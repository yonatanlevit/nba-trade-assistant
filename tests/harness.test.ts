import { describe, expect, it } from "vitest";
import { MAX_LOOP_ITERATIONS, renderStateSnapshot, runChatTurn } from "@/lib/harness";
import type { ModelClient, ModelRequest, ModelResponse } from "@/lib/modelClient";
import { FixtureBballGmClient } from "@/lib/testdoubles/fixtureBballGmClient";
import { ScriptedModelClient } from "@/lib/testdoubles/scriptedModelClient";
import { emptyState, REQUIRED_UNAVAILABLE_MESSAGE, withTeam, withTarget } from "@/lib/state";
import { FIXTURE_PLAYERS, FIXTURE_TEAMS } from "@/lib/testdoubles/fixtures";

/** ModelClient returning a fixed sequence of responses, recording requests. */
class MockModelClient implements ModelClient {
  requests: ModelRequest[] = [];
  private i = 0;
  constructor(private responses: ModelResponse[]) {}
  async createMessage(req: ModelRequest): Promise<ModelResponse> {
    this.requests.push(structuredClone({ ...req, tools: [] }) as ModelRequest);
    const r = this.responses[Math.min(this.i, this.responses.length - 1)];
    this.i++;
    return r;
  }
}

const toolUse = (calls: { name: string; input?: Record<string, unknown> }[]): ModelResponse => ({
  stopReason: "tool_use",
  text: "",
  toolCalls: calls.map((c, i) => ({ id: `t${i}`, name: c.name, input: c.input ?? {} })),
  rawContent: [],
});
const endTurn = (text: string): ModelResponse => ({
  stopReason: "end_turn",
  text,
  toolCalls: [],
  rawContent: [],
});

const deps = (model: ModelClient, bballGm = new FixtureBballGmClient()) => ({ model, bballGm });
const turn = (userMessage: string, state = emptyState()) => ({
  history: [],
  userMessage,
  state,
});

describe("agentic loop", () => {
  it("returns the model's text when it ends the turn immediately", async () => {
    const model = new MockModelClient([endTurn("Which team do you represent?")]);
    const r = await runChatTurn(deps(model), turn("I want a trade"));
    expect(r.reply).toBe("Which team do you represent?");
    expect(model.requests).toHaveLength(1);
  });

  it("executes a tool call and feeds the result back to the model", async () => {
    const model = new MockModelClient([
      toolUse([{ name: "set_team", input: { team_name: "Boston" } }]),
      endTurn("Got it — who do you want?"),
    ]);
    const r = await runChatTurn(deps(model), turn("I'm Boston"));
    expect(r.state.team?.abbreviation).toBe("BOS");
    expect(model.requests).toHaveLength(2);
    expect(r.reply).toBe("Got it — who do you want?");
  });

  it("executes multiple tool calls in one model response", async () => {
    const model = new MockModelClient([
      toolUse([
        { name: "set_team", input: { team_name: "Boston" } },
        { name: "set_target_player", input: { player_name: "Anthony Davis" } },
      ]),
      endTurn("Confirm?"),
    ]);
    const r = await runChatTurn(deps(model), turn("Boston, Anthony Davis"));
    expect(r.state.team?.abbreviation).toBe("BOS");
    expect(r.state.target?.name).toBe("Anthony Davis");
    expect(r.trace).toHaveLength(2);
  });

  it("stops at the iteration guard instead of looping forever", async () => {
    const model = new MockModelClient([toolUse([{ name: "set_team", input: { team_name: "Boston" } }])]);
    const r = await runChatTurn(deps(model), turn("loop"));
    expect(model.requests).toHaveLength(MAX_LOOP_ITERATIONS);
    expect(r.reply).toMatch(/stuck/i);
  });

  it("handles a refusal stop reason gracefully", async () => {
    const model = new MockModelClient([
      { stopReason: "refusal", text: "", toolCalls: [], rawContent: [] },
    ]);
    const r = await runChatTurn(deps(model), turn("something disallowed"));
    expect(r.reply).toMatch(/can't help/i);
  });

  it("handles a max_tokens stop reason gracefully", async () => {
    const model = new MockModelClient([
      { stopReason: "max_tokens", text: "", toolCalls: [], rawContent: [] },
    ]);
    const r = await runChatTurn(deps(model), turn("long"));
    expect(r.reply).toMatch(/cut short/i);
  });

  it("falls back to a helpful line when the model returns empty text", async () => {
    const model = new MockModelClient([endTurn("   ")]);
    const r = await runChatTurn(deps(model), turn("hi"));
    expect(r.reply.length).toBeGreaterThan(10);
  });

  it("records a trace entry per tool call for traceability", async () => {
    const model = new MockModelClient([
      toolUse([{ name: "set_team", input: { team_name: "Boston" } }]),
      endTurn("ok"),
    ]);
    const r = await runChatTurn(deps(model), turn("I'm Boston"));
    expect(r.trace[0]).toMatchObject({ tool: "set_team", ok: true });
    expect(r.state.trace).toHaveLength(1);
  });

  it("reports an unknown tool as an error without crashing", async () => {
    const model = new MockModelClient([toolUse([{ name: "not_a_tool" }]), endTurn("ok")]);
    const r = await runChatTurn(deps(model), turn("x"));
    expect(r.trace[0].ok).toBe(false);
    expect(r.reply).toBe("ok");
  });
});

describe("fresh state injection", () => {
  it("sends a state snapshot on every model call", async () => {
    const model = new MockModelClient([
      toolUse([{ name: "set_team", input: { team_name: "Boston" } }]),
      endTurn("ok"),
    ]);
    await runChatTurn(deps(model), turn("I'm Boston"));
    expect(model.requests.every((r) => r.stateSnapshot.includes("<current_state>"))).toBe(true);
  });

  it("regenerates the snapshot after a state-changing tool in the same loop", async () => {
    const model = new MockModelClient([
      toolUse([{ name: "set_team", input: { team_name: "Boston" } }]),
      endTurn("ok"),
    ]);
    await runChatTurn(deps(model), turn("I'm Boston"));
    expect(model.requests[0].stateSnapshot).toContain("user_team: NOT SET");
    expect(model.requests[1].stateSnapshot).toContain("Boston Celtics");
  });

  it("never appends the snapshot into durable message history", async () => {
    const model = new MockModelClient([
      toolUse([{ name: "set_team", input: { team_name: "Boston" } }]),
      endTurn("ok"),
    ]);
    await runChatTurn(deps(model), turn("I'm Boston"));
    const serialized = JSON.stringify(model.requests[1].messages);
    expect(serialized).not.toContain("<current_state>");
  });

  it("exposes no get_current_state tool (state is injected, not fetched)", async () => {
    const { TOOL_DEFINITIONS } = await import("@/lib/tools");
    expect(TOOL_DEFINITIONS.map((t) => t.name)).toEqual([
      "set_team",
      "set_target_player",
      "confirm_search",
      "run_trade_search",
    ]);
  });
});

describe("renderStateSnapshot", () => {
  it("prompts for missing criteria", () => {
    const snap = renderStateSnapshot(emptyState());
    expect(snap).toContain("user_team: NOT SET");
    expect(snap).toContain("target_player: NOT SET");
  });

  it("includes resolved criteria and confirmation status", () => {
    const s = withTarget(
      withTeam(emptyState(), FIXTURE_TEAMS[0]),
      FIXTURE_PLAYERS.find((p) => p.name === "Anthony Davis")!,
    );
    const snap = renderStateSnapshot(s);
    expect(snap).toContain("Boston Celtics (BOS)");
    expect(snap).toContain("Anthony Davis");
    expect(snap).toContain("criteria_confirmed: false");
  });

  it("relays the exact unavailability wording when validation failed", () => {
    const snap = renderStateSnapshot({ ...emptyState(), validationUnavailable: true });
    expect(snap).toContain(REQUIRED_UNAVAILABLE_MESSAGE);
  });
});

describe("scripted end-to-end turns (Tier-1 wiring)", () => {
  it("sets both criteria and asks for confirmation", async () => {
    const r = await runChatTurn(
      deps(new ScriptedModelClient()),
      turn("I'm Boston and I want Anthony Davis"),
    );
    expect(r.state.team?.abbreviation).toBe("BOS");
    expect(r.state.target?.name).toBe("Anthony Davis");
    expect(r.state.confirmed).toBe(false);
    expect(r.reply).toMatch(/should i search/i);
  });

  it("confirms and runs a search that yields validated trades", async () => {
    const first = await runChatTurn(
      deps(new ScriptedModelClient()),
      turn("I'm Boston and I want Anthony Davis"),
    );
    const second = await runChatTurn(deps(new ScriptedModelClient()), {
      history: [
        { role: "user", content: "I'm Boston and I want Anthony Davis" },
        { role: "assistant", content: first.reply },
      ],
      userMessage: "yes",
      state: first.state,
    });
    expect(second.state.confirmed).toBe(true);
    expect(second.state.searched).toBe(true);
    expect(second.state.results.length).toBeGreaterThan(0);
    expect(second.state.results.every((t) => t.kind === "validated")).toBe(true);
  });

  it("surfaces the exact unavailability message when the engine is down", async () => {
    const engine = new FixtureBballGmClient();
    const first = await runChatTurn(
      deps(new ScriptedModelClient(), engine),
      turn("I'm Boston and I want Anthony Davis"),
    );
    engine.failNextValidations = 999;
    const second = await runChatTurn(deps(new ScriptedModelClient(), engine), {
      history: [],
      userMessage: "yes",
      state: first.state,
    });
    expect(second.state.results).toHaveLength(0);
    expect(second.state.validationUnavailable).toBe(true);
    expect(REQUIRED_UNAVAILABLE_MESSAGE).toBe(
      "Trade validation is temporarily unavailable. Please try again later.",
    );
  });
});
