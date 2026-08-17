import { describe, expect, it } from "vitest";
import { generateCandidates, loosestMaxReceive, provablyInvalid } from "@/lib/candidates";
import { activeRoster } from "@/lib/resolve";
import { FIXTURE_PLAYERS, FIXTURE_TEAMS } from "@/lib/testdoubles/fixtures";
import type { Player } from "@/lib/state";

const boston = FIXTURE_TEAMS[0];
const wizards = FIXTURE_TEAMS[1];
const target = FIXTURE_PLAYERS.find((p) => p.name === "Anthony Davis")!;
const roster = activeRoster(1, FIXTURE_PLAYERS);

const ctx = {
  userTeam: boston,
  opposingTeam: wizards,
  tradeMatchAddOn: 250_000,
  flatAddOn: 9_400_000,
  safetyMargin: 5_000_000,
};

describe("generateCandidates (pure)", () => {
  it("enumerates every 1-, 2-, and 3-player package when unfiltered", () => {
    const all = generateCandidates(roster, target, null);
    // C(5,1) + C(5,2) + C(5,3) = 5 + 10 + 10 = 25
    expect(all).toHaveLength(25);
  });

  it("never produces packages larger than three players", () => {
    const all = generateCandidates(roster, target, null);
    expect(Math.max(...all.map((c) => c.ids.length))).toBe(3);
  });

  it("orders by package size first (simpler trades first)", () => {
    const all = generateCandidates(roster, target, null);
    const sizes = all.map((c) => c.ids.length);
    expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
  });

  it("orders by closest salary match within a package size", () => {
    const all = generateCandidates(roster, target, null);
    const singles = all.filter((c) => c.ids.length === 1).map((c) => c.diff);
    expect(singles).toEqual([...singles].sort((a, b) => a - b));
  });

  it("puts the closest single-player match first overall", () => {
    const all = generateCandidates(roster, target, null);
    // Jaylen Brown at $48M is closest to Davis's $50M.
    expect(all[0].ids).toEqual([101]);
  });

  it("is deterministic across runs", () => {
    expect(generateCandidates(roster, target, null)).toEqual(
      generateCandidates(roster, target, null),
    );
  });

  it("returns sorted id arrays for stable identity", () => {
    const all = generateCandidates(roster, target, null);
    for (const c of all) {
      expect(c.ids).toEqual([...c.ids].sort((a, b) => a - b));
    }
  });

  it("computes diff as |outgoing total − target salary|", () => {
    const all = generateCandidates(roster, target, null);
    const brown = all.find((c) => c.ids.join() === "101")!;
    expect(brown.diff).toBe(Math.abs(48_000_000 - 50_000_000));
  });

  it("returns an empty list for an empty roster", () => {
    expect(generateCandidates([], target, ctx)).toEqual([]);
  });

  it("applies the pre-filter without removing plausible packages", () => {
    const filtered = generateCandidates(roster, target, ctx);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.length).toBeLessThanOrEqual(25);
    // Brown-for-Davis is comfortably matchable and must survive.
    expect(filtered.some((c) => c.ids.join() === "101")).toBe(true);
  });

  it("pre-filter removes only provably-invalid packages (tiny out, huge in)", () => {
    const tiny: Player[] = [
      { ...roster[0], id: 900, name: "Minimum Guy", salary: 1_000_000 },
    ];
    expect(generateCandidates(tiny, target, ctx)).toHaveLength(0);
  });
});

describe("loosestMaxReceive / provablyInvalid", () => {
  it("takes the maximum across every matching tier", () => {
    const out = 10_000_000;
    const max = loosestMaxReceive(boston, out, ctx);
    expect(max).toBeGreaterThanOrEqual(2 * out);
    expect(max).toBeGreaterThanOrEqual(out + ctx.flatAddOn);
  });

  it("includes the safety margin so borderline trades are never eliminated", () => {
    const bare = Math.max(
      boston.capSpace + 10_000_000 + ctx.tradeMatchAddOn,
      20_000_000,
      19_400_000,
    );
    expect(loosestMaxReceive(boston, 10_000_000, ctx)).toBe(bare + ctx.safetyMargin);
  });

  it("accepts a balanced package", () => {
    expect(provablyInvalid(48_000_000, 50_000_000, ctx)).toBe(false);
  });

  it("rejects an absurdly lopsided package", () => {
    expect(provablyInvalid(1_000_000, 50_000_000, ctx)).toBe(true);
  });
});
