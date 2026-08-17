import { describe, expect, it } from "vitest";
import { activeRoster, isFreeAgent, resolvePlayer, resolveTeam } from "@/lib/resolve";
import { FIXTURE_PLAYERS, FIXTURE_TEAMS } from "@/lib/testdoubles/fixtures";

describe("resolveTeam", () => {
  it("matches by city", () => {
    const r = resolveTeam("Boston", FIXTURE_TEAMS);
    expect(r.status).toBe("matched");
    expect(r.status === "matched" && r.team.abbreviation).toBe("BOS");
  });

  it("matches by nickname", () => {
    const r = resolveTeam("Celtics", FIXTURE_TEAMS);
    expect(r.status === "matched" && r.team.id).toBe(1);
  });

  it("matches by abbreviation, case-insensitively", () => {
    const r = resolveTeam("bos", FIXTURE_TEAMS);
    expect(r.status === "matched" && r.team.city).toBe("Boston");
  });

  it("matches 'city nickname' phrasing", () => {
    const r = resolveTeam("Golden State Warriors", FIXTURE_TEAMS);
    expect(r.status === "matched" && r.team.abbreviation).toBe("GSW");
  });

  it("reports not_found for unknown teams", () => {
    expect(resolveTeam("Toronto Raptors", FIXTURE_TEAMS).status).toBe("not_found");
  });

  it("reports not_found for empty input", () => {
    expect(resolveTeam("   ", FIXTURE_TEAMS).status).toBe("not_found");
  });
});

describe("resolvePlayer", () => {
  it("matches a full name exactly", () => {
    const r = resolvePlayer("Anthony Davis", FIXTURE_PLAYERS);
    expect(r.status === "matched" && r.player.id).toBe(201);
  });

  it("matches a unique partial name (no full name required)", () => {
    const r = resolvePlayer("Curry", FIXTURE_PLAYERS);
    expect(r.status === "matched" && r.player.name).toBe("Stephen Curry");
  });

  it("is case- and whitespace-insensitive", () => {
    const r = resolvePlayer("  jaylen   brown ", FIXTURE_PLAYERS);
    expect(r.status === "matched" && r.player.id).toBe(101);
  });

  it("reports ambiguity with every candidate for a shared surname", () => {
    const r = resolvePlayer("Smith", FIXTURE_PLAYERS);
    expect(r.status).toBe("ambiguous");
    expect(r.status === "ambiguous" && r.candidates.map((p) => p.name).sort()).toEqual([
      "Dru Smith",
      "Jalen Smith",
    ]);
  });

  it("still finds free agents so the caller can explain they're untradeable", () => {
    const r = resolvePlayer("LeBron", FIXTURE_PLAYERS);
    expect(r.status === "matched" && isFreeAgent(r.player)).toBe(true);
  });

  it("reports not_found for unknown players", () => {
    expect(resolvePlayer("Zzz Nobody", FIXTURE_PLAYERS).status).toBe("not_found");
  });
});

describe("activeRoster", () => {
  it("returns only rostered, tradeable players for the team", () => {
    const roster = activeRoster(1, FIXTURE_PLAYERS);
    expect(roster).toHaveLength(5);
    expect(roster.every((p) => p.teamId === 1 && p.salary > 0)).toBe(true);
  });

  it("excludes free agents", () => {
    expect(activeRoster(99, FIXTURE_PLAYERS)).toHaveLength(0);
  });
});
