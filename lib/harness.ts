// The agentic loop — hand-rolled so the harness/tool boundary is explicit:
//
//   model → tool_use? → our code executes against TradeState → tool_result →
//   model … until end_turn (or the iteration guard trips).
//
// A fresh <current_state> snapshot is generated before EVERY model call —
// including calls after a state-changing tool within the same loop — and is
// never appended to durable history. One authoritative snapshot per request.

import type { BballGmClient } from "./bballGmClient";
import type { HarnessMessage, ModelClient } from "./modelClient";
import { REQUIRED_UNAVAILABLE_MESSAGE, type ChatMsg, type TraceEntry, type TradeState, withTrace } from "./state";
import { SYSTEM_PROMPT } from "./systemPrompt";
import { executeTool, TOOL_DEFINITIONS, type ToolExecutionContext } from "./tools";
import { formatMoney } from "./salary";

/** Guard against runaway loops. A worst-case realistic turn is ~5 model calls
 *  (set team → set player → reflect → confirm → search → summarize, some
 *  batched); 8 leaves retry headroom while capping cost. */
export const MAX_LOOP_ITERATIONS = 8;

export type HarnessDeps = {
  model: ModelClient;
  bballGm: BballGmClient;
};

export type ChatTurnResult = {
  reply: string;
  state: TradeState;
  /** Tool trail for THIS turn (rendered as chips under the assistant message). */
  trace: TraceEntry[];
};

export async function runChatTurn(
  deps: HarnessDeps,
  params: { history: ChatMsg[]; userMessage: string; state: TradeState },
): Promise<ChatTurnResult> {
  const [teams, players] = await Promise.all([
    deps.bballGm.getTeams(),
    deps.bballGm.getPlayers(),
  ]);
  const toolCtx: ToolExecutionContext = { bballGm: deps.bballGm, teams, players };

  let state = params.state;
  const turnTrace: TraceEntry[] = [];

  const messages: HarnessMessage[] = [
    ...params.history.map(
      (m): HarnessMessage => ({ role: m.role, content: m.content }),
    ),
    { role: "user", content: params.userMessage },
  ];

  for (let iteration = 0; iteration < MAX_LOOP_ITERATIONS; iteration++) {
    const response = await deps.model.createMessage({
      system: SYSTEM_PROMPT,
      messages,
      stateSnapshot: renderStateSnapshot(state),
      tools: TOOL_DEFINITIONS,
    });

    if (response.stopReason === "tool_use" && response.toolCalls.length > 0) {
      messages.push({ role: "assistant_raw", content: response.rawContent });

      const results: { toolUseId: string; content: string; isError?: boolean }[] = [];
      for (const call of response.toolCalls) {
        const outcome = await executeTool(call, state, toolCtx);
        state = outcome.state;
        turnTrace.push(outcome.trace);
        results.push({
          toolUseId: call.id,
          content: outcome.result,
          isError: outcome.isError || undefined,
        });
      }
      messages.push({ role: "tool_results", results });
      continue;
    }

    if (response.stopReason === "refusal") {
      return finish(
        "I can't help with that request. Tell me which team you represent and which player you'd like to acquire, and I'll take it from there.",
        state,
        turnTrace,
      );
    }

    if (response.stopReason === "max_tokens") {
      return finish(
        "My reply was cut short — could you rephrase or ask again?",
        state,
        turnTrace,
      );
    }

    // end_turn (or other): the model has produced its final text.
    const reply = response.text.trim();
    return finish(
      reply.length > 0
        ? reply
        : "I'm not sure how to respond to that. Tell me your team and target player and I'll help from there.",
      state,
      turnTrace,
    );
  }

  return finish(
    "I seem to be stuck processing that. Could you rephrase your request?",
    state,
    turnTrace,
  );
}

function finish(reply: string, state: TradeState, trace: TraceEntry[]): ChatTurnResult {
  return { reply, state: withTrace(state, trace), trace };
}

/** The authoritative per-call state snapshot the model reasons over. */
export function renderStateSnapshot(state: TradeState): string {
  const lines: string[] = ["<current_state>"];
  lines.push(
    state.team
      ? `user_team: ${state.team.city} ${state.team.name} (${state.team.abbreviation})`
      : "user_team: NOT SET — ask which team the user represents",
  );
  lines.push(
    state.target
      ? `target_player: ${state.target.name} — ${state.target.position}, ${state.target.teamName}, salary ${formatMoney(state.target.salary)}`
      : "target_player: NOT SET — ask which player the user wants to acquire",
  );
  lines.push(`criteria_confirmed: ${state.confirmed}`);
  lines.push(`search_run_for_current_criteria: ${state.searched}`);
  if (state.searched) {
    lines.push(
      `valid_trades_found: ${state.results.length} (displayed on the user's board)`,
    );
    lines.push(`candidates_pending_validation: ${state.pendingCandidates.length}`);
  }
  if (state.validationUnavailable) {
    lines.push(
      `validation_service: UNAVAILABLE — if the user asks, relay exactly: "${REQUIRED_UNAVAILABLE_MESSAGE}"`,
    );
  }
  lines.push("</current_state>");
  return lines.join("\n");
}
