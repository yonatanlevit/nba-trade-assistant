import { describe, expect, it } from "vitest";
import { executeTool, TOOL_DEFINITIONS, type ToolExecutionContext } from "@/lib/tools";
import { FixtureBballGmClient } from "@/lib/testdoubles/fixtureBballGmClient";
import { FIXTURE_PLAYERS, FIXTURE_TEAMS } from "@/lib/testdoubles/fixtures";
import { emptyState, withConfirmed, withTarget, withTeam } from "@/lib/state";

const ctx = (): ToolExecutionContext => ({
  bballGm: new FixtureBballGmClient(),
  teams: FIXTURE_TEAMS,
  players: FIXTURE_PLAYERS,
});

const call = (name: string, input: Record<string, unknown> = {}) => ({ id: "t0", name, input });
const boston = FIXTURE_TEAMS[0];
const davis = FIXTURE_PLAYERS.find((p) => p.name === "Anthony Davis")!;
const tatum = { ...FIXTURE_PLAYERS[0] }; // Jaylen Brown stands in as a Boston player

describe("tool schemas", () => {
  it("exposes exactly the four documented tools", () => {
    expect(TOOL_DEFINITIONS.map((t) => t.name)).toEqual([
      "set_team",
      "set_target_player",
      "confirm_search",
      "run_trade_search",
    ]);
  });

  it("gives every tool a substantial description (trigger + behavior)", () => {
    for (const t of TOOL_DEFINITIONS) {
      expect(t.description.length).toBeGreaterThan(120);
    }
  });
});

describe("set_team", () => {
  it("resolves and stores a matched team", async () => {
    const out = await executeTool(call("set_team", { team_name: "Boston" }), emptyState(), ctx());
    expect(out.state.team?.abbreviation).toBe("BOS");
    expect(JSON.parse(out.result).status).toBe("matched");
  });

  it("reports not_found without mutating state", async () => {
    const out = await executeTool(call("set_team", { team_name: "Raptors" }), emptyState(), ctx());
    expect(out.state.team).toBeNull();
    expect(JSON.parse(out.result).status).toBe("not_found");
  });
});

describe("set_target_player", () => {
  it("stores a matched, rostered player", async () => {
    const out = await executeTool(
      call("set_target_player", { player_name: "Anthony Davis" }),
      emptyState(),
      ctx(),
    );
    expect(out.state.target?.name).toBe("Anthony Davis");
  });

  it("lists candidates with their teams when ambiguous", async () => {
    const out = await executeTool(
      call("set_target_player", { player_name: "Smith" }),
      emptyState(),
      ctx(),
    );
    const body = JSON.parse(out.result);
    expect(body.status).toBe("ambiguous");
    expect(body.candidates.every((c: { team: string }) => c.team)).toBe(true);
    expect(out.state.target).toBeNull();
  });

  it("refuses a free agent as a trade target", async () => {
    const out = await executeTool(
      call("set_target_player", { player_name: "LeBron" }),
      emptyState(),
      ctx(),
    );
    expect(JSON.parse(out.result).status).toBe("free_agent");
    expect(out.state.target).toBeNull();
  });

  it("reports a player already on the user's roster", async () => {
    const state = withTeam(emptyState(), boston);
    const out = await executeTool(
      call("set_target_player", { player_name: "Jaylen Brown" }),
      state,
      ctx(),
    );
    expect(JSON.parse(out.result).status).toBe("already_on_your_team");
    expect(out.state.target).toBeNull();
  });

  it("reports not_found for an unknown player", async () => {
    const out = await executeTool(
      call("set_target_player", { player_name: "Zzz Nobody" }),
      emptyState(),
      ctx(),
    );
    expect(JSON.parse(out.result).status).toBe("not_found");
  });
});

describe("confirm_search", () => {
  it("rejects when criteria are incomplete", async () => {
    const out = await executeTool(call("confirm_search"), emptyState(), ctx());
    expect(out.isError).toBe(true);
    expect(out.state.confirmed).toBe(false);
  });

  it("confirms when both criteria are valid", async () => {
    const state = withTarget(withTeam(emptyState(), boston), davis);
    const out = await executeTool(call("confirm_search"), state, ctx());
    expect(out.state.confirmed).toBe(true);
  });

  it("rejects when the target is on the user's own roster", async () => {
    const state = withTarget(withTeam(emptyState(), boston), { ...tatum, teamId: boston.id });
    const out = await executeTool(call("confirm_search"), state, ctx());
    expect(out.isError).toBe(true);
    expect(out.state.confirmed).toBe(false);
  });
});

describe("run_trade_search", () => {
  it("refuses to search before confirmation (the model cannot bypass the gate)", async () => {
    const state = withTarget(withTeam(emptyState(), boston), davis);
    const out = await executeTool(call("run_trade_search"), state, ctx());
    expect(out.isError).toBe(true);
    expect(out.state.searched).toBe(false);
  });

  it("returns validated trades once confirmed", async () => {
    const state = withConfirmed(withTarget(withTeam(emptyState(), boston), davis));
    const out = await executeTool(call("run_trade_search"), state, ctx());
    const body = JSON.parse(out.result);
    expect(body.status).toBe("complete");
    expect(out.state.results.length).toBeGreaterThan(0);
    expect(out.state.results.every((t) => t.kind === "validated")).toBe(true);
  });

  it("summarizes top options with salary effects for the chat reply", async () => {
    const state = withConfirmed(withTarget(withTeam(emptyState(), boston), davis));
    const out = await executeTool(call("run_trade_search"), state, ctx());
    const body = JSON.parse(out.result);
    expect(body.topOptions[0]).toHaveProperty("send");
    expect(body.topOptions[0]).toHaveProperty("salaryEffect");
  });

  it("reports validation_unavailable when the engine is down", async () => {
    const c = ctx();
    (c.bballGm as FixtureBballGmClient).failNextValidations = 999;
    const state = withConfirmed(withTarget(withTeam(emptyState(), boston), davis));
    const out = await executeTool(call("run_trade_search"), state, c);
    expect(JSON.parse(out.result).status).toBe("validation_unavailable");
    expect(out.state.results).toHaveLength(0);
    expect(out.state.validationUnavailable).toBe(true);
  });
});
