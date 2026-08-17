import { describe, expect, it } from "vitest";
import {
  criteriaReady,
  emptyState,
  INITIAL_RESULT_COUNT,
  withConfirmed,
  withRevealTarget,
  withSearchOutcome,
  withTarget,
  withTeam,
  withTrace,
  type ValidatedTrade,
} from "@/lib/state";
import { FIXTURE_PLAYERS, FIXTURE_TEAMS } from "@/lib/testdoubles/fixtures";

const boston = FIXTURE_TEAMS[0];
const warriors = FIXTURE_TEAMS[2];
const davis = FIXTURE_PLAYERS.find((p) => p.name === "Anthony Davis")!;
const curry = FIXTURE_PLAYERS.find((p) => p.name === "Stephen Curry")!;

function fakeTrade(id: number): ValidatedTrade {
  return {
    kind: "validated",
    outgoing: [{ id, name: `P${id}`, position: "PG", salary: 10_000_000 }],
    incoming: { id: 999, name: "Target", position: "PF", salary: 10_000_000 },
    opposingTeam: {
      id: warriors.id,
      name: warriors.name,
      city: warriors.city,
      abbreviation: warriors.abbreviation,
      primaryColor: warriors.primaryColor,
      secondaryColor: warriors.secondaryColor,
    },
    salarySavings: 0,
    apiSummary: "Trade is valid.",
  };
}

const searched = () =>
  withSearchOutcome(withConfirmed(withTarget(withTeam(emptyState(), boston), davis)), {
    newlyValidated: [fakeTrade(1), fakeTrade(2), fakeTrade(3)],
    remaining: [{ ids: [104], diff: 1 }],
    unavailable: false,
  });

describe("TradeState machine", () => {
  it("starts empty and unconfirmed", () => {
    const s = emptyState();
    expect(s.team).toBeNull();
    expect(s.target).toBeNull();
    expect(s.confirmed).toBe(false);
    expect(s.results).toEqual([]);
  });

  it("criteriaReady requires both team and target", () => {
    expect(criteriaReady(emptyState())).toBe(false);
    expect(criteriaReady(withTeam(emptyState(), boston))).toBe(false);
    expect(criteriaReady(withTarget(withTeam(emptyState(), boston), davis))).toBe(true);
  });

  it("changing the target invalidates a previous confirmation", () => {
    const s = withTarget(searched(), curry);
    expect(s.confirmed).toBe(false);
    expect(s.searched).toBe(false);
  });

  it("changing the target clears previous results", () => {
    const s = withTarget(searched(), curry);
    expect(s.results).toEqual([]);
    expect(s.pendingCandidates).toEqual([]);
    expect(s.shownCount).toBe(0);
  });

  it("changing the team invalidates a previous confirmation and results", () => {
    const s = withTeam(searched(), warriors);
    expect(s.confirmed).toBe(false);
    expect(s.results).toEqual([]);
  });

  it("changing the team preserves the target (only confirmation resets)", () => {
    const s = withTeam(searched(), warriors);
    expect(s.target?.name).toBe("Anthony Davis");
  });

  it("clears a stale validationUnavailable flag on criteria change", () => {
    const failed = withSearchOutcome(searched(), {
      newlyValidated: [],
      remaining: [],
      unavailable: true,
    });
    expect(withTarget(failed, curry).validationUnavailable).toBe(false);
  });

  it("reveals up to INITIAL_RESULT_COUNT after a search", () => {
    const s = withSearchOutcome(emptyState(), {
      newlyValidated: Array.from({ length: 12 }, (_, i) => fakeTrade(i)),
      remaining: [],
      unavailable: false,
    });
    expect(s.shownCount).toBe(INITIAL_RESULT_COUNT);
  });

  it("never reveals more than exist", () => {
    expect(searched().shownCount).toBe(3);
  });

  it("results only grow when merging a later outcome (monotonicity)", () => {
    const first = searched();
    const second = withSearchOutcome(first, {
      newlyValidated: [fakeTrade(4)],
      remaining: [],
      unavailable: false,
    });
    expect(second.results).toHaveLength(4);
    expect(second.results.slice(0, 3)).toEqual(first.results);
  });

  it("keeps every validated result when a later batch reports unavailable", () => {
    const first = searched();
    const failed = withSearchOutcome(first, {
      newlyValidated: [],
      remaining: first.pendingCandidates,
      unavailable: true,
    });
    expect(failed.results).toHaveLength(3);
    expect(failed.validationUnavailable).toBe(true);
  });

  it("withRevealTarget caps the reveal at validated count", () => {
    expect(withRevealTarget(searched(), 99).shownCount).toBe(3);
  });

  it("withTrace appends entries", () => {
    const s = withTrace(emptyState(), [{ tool: "set_team", summary: "→ BOS", ok: true }]);
    expect(s.trace).toHaveLength(1);
  });
});
