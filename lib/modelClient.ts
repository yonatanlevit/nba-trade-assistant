// ModelClient — the LLM dependency boundary. This is the ONLY file that
// imports the Anthropic SDK; the harness depends on the interface, so a
// provider swap is a one-file change.

import Anthropic from "@anthropic-ai/sdk";

export type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

/** Provider-neutral conversation items the harness produces. */
export type HarnessMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string }
  | { role: "assistant_raw"; content: unknown }
  | {
      role: "tool_results";
      results: { toolUseId: string; content: string; isError?: boolean }[];
    };

export type ModelToolCall = { id: string; name: string; input: Record<string, unknown> };

export type ModelResponse = {
  stopReason: "tool_use" | "end_turn" | "refusal" | "max_tokens" | "other";
  text: string;
  toolCalls: ModelToolCall[];
  /** Provider-shaped assistant content, echoed back verbatim on the next call. */
  rawContent: unknown;
};

export type ModelRequest = {
  system: string;
  messages: HarnessMessage[];
  /** Fresh, authoritative <current_state> block — regenerated before EVERY
   *  model call, never persisted into conversation history. */
  stateSnapshot: string;
  tools: ToolDefinition[];
};

export interface ModelClient {
  createMessage(req: ModelRequest): Promise<ModelResponse>;
}

// ---------------------------------------------------------------------------
// Production implementation — claude-opus-5 (MODEL_ID configurable)
// ---------------------------------------------------------------------------

export class AnthropicModelClient implements ModelClient {
  private client: Anthropic;
  private modelId: string;

  constructor(opts?: { apiKey?: string; modelId?: string }) {
    this.client = new Anthropic({
      apiKey: opts?.apiKey ?? process.env.ANTHROPIC_API_KEY,
    });
    this.modelId = opts?.modelId ?? process.env.MODEL_ID ?? "claude-opus-5";
  }

  async createMessage(req: ModelRequest): Promise<ModelResponse> {
    const messages = req.messages.map(toAnthropicMessage);
    // Opus 5 mid-conversation system message: the fresh state snapshot rides
    // as a trailing role:"system" entry — operator-authority, cache-preserving,
    // and regenerated per call (never appended to durable history).
    messages.push({ role: "system", content: req.stateSnapshot });

    const response = await this.client.beta.messages.create({
      model: this.modelId,
      max_tokens: 8000,
      // Thinking stays ON (Opus 5 default = adaptive); disabling it risks
      // tool calls emitted as plain text. Low effort keeps chat turns snappy.
      output_config: { effort: "low" },
      // Server-side refusal fallbacks (recommended default for Opus 5).
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [
        {
          type: "text",
          text: req.system,
          cache_control: { type: "ephemeral" },
        },
      ],
      tools: req.tools.map((t) => ({
        name: t.name,
        description: t.description,
        input_schema: t.inputSchema,
      })),
      messages,
      // SDK typings can lag current API fields (fallbacks scalar form,
      // mid-conversation system role) — the wire shapes are current.
    } as never) as Anthropic.Beta.BetaMessage;

    return fromAnthropicResponse(response);
  }
}

type WireMessage = { role: string; content: unknown };

function toAnthropicMessage(m: HarnessMessage): WireMessage {
  switch (m.role) {
    case "user":
      return { role: "user", content: m.content };
    case "assistant":
      return { role: "assistant", content: m.content };
    case "assistant_raw":
      return { role: "assistant", content: m.content };
    case "tool_results":
      return {
        role: "user",
        content: m.results.map((r) => ({
          type: "tool_result",
          tool_use_id: r.toolUseId,
          content: r.content,
          ...(r.isError ? { is_error: true } : {}),
        })),
      };
  }
}

function fromAnthropicResponse(response: Anthropic.Beta.BetaMessage): ModelResponse {
  const blocks = (response.content ?? []) as Array<{
    type: string;
    text?: string;
    id?: string;
    name?: string;
    input?: Record<string, unknown>;
  }>;

  const text = blocks
    .filter((b) => b.type === "text" && typeof b.text === "string")
    .map((b) => b.text)
    .join("");

  const toolCalls: ModelToolCall[] = blocks
    .filter((b) => b.type === "tool_use")
    .map((b) => ({ id: b.id ?? "", name: b.name ?? "", input: b.input ?? {} }));

  const stop = response.stop_reason;
  const stopReason: ModelResponse["stopReason"] =
    stop === "tool_use" || stop === "end_turn" || stop === "refusal" || stop === "max_tokens"
      ? stop
      : "other";

  return { stopReason, text, toolCalls, rawContent: response.content };
}
