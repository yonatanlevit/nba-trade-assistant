// PURE candidate generation — no network, fully deterministic, unit-tested.
//
//   generate once → pre-filter once → order once
//
// The ordered list is validated lazily elsewhere (lib/validation.ts). Batches
// are an infrastructure detail; nothing here knows about them.

import type { CompactCandidate, Player, Team } from "./state";
import { totalSalary } from "./salary";

/** Cap context for the provably-safe pre-filter. */
export type PreFilterContext = {
  userTeam: Team;
  opposingTeam: Team;
  /** League trade-match add-on for under-cap absorption (bball-GM: $250K). */
  tradeMatchAddOn: number;
  /** Flat matching add-on (bball-GM: $9.4M). */
  flatAddOn: number;
  /** Extra slack so we NEVER eliminate a trade the engine might allow. */
  safetyMargin: number;
};

export const DEFAULT_PREFILTER_SLACK = 5_000_000;

/**
 * The LOOSEST salary a team could conceivably receive when sending `outgoing`,
 * across every matching tier the engine documents (under-cap absorption,
 * 125%/200% bands, 100%+flat), plus a safety margin. Using the maximum over
 * all tiers guarantees the pre-filter only removes candidates that are
 * provably invalid under every rule — the every-valid-trade-reachable
 * invariant survives.
 */
export function loosestMaxReceive(
  team: Team,
  outgoing: number,
  ctx: Pick<PreFilterContext, "tradeMatchAddOn" | "flatAddOn" | "safetyMargin">,
): number {
  const underCap = team.capSpace + outgoing + ctx.tradeMatchAddOn;
  const band200 = 2 * outgoing;
  const flat = outgoing + ctx.flatAddOn;
  return Math.max(underCap, band200, flat) + ctx.safetyMargin;
}

/** True when the package is provably invalid in at least one direction. */
export function provablyInvalid(
  outgoingTotal: number,
  targetSalary: number,
  ctx: PreFilterContext,
): boolean {
  const userCanReceiveTarget =
    targetSalary <= loosestMaxReceive(ctx.userTeam, outgoingTotal, ctx);
  const oppCanReceivePackage =
    outgoingTotal <= loosestMaxReceive(ctx.opposingTeam, targetSalary, ctx);
  return !(userCanReceiveTarget && oppCanReceivePackage);
}

/**
 * Enumerate all 1-, 2-, and 3-player outgoing packages from the roster,
 * drop provably-invalid ones (when cap context is provided), and order by:
 *   1. package size ascending (simpler trades first — human plan)
 *   2. |outgoing total − target salary| ascending (closest salary match)
 * Ties broken by ascending player ids for full determinism.
 */
export function generateCandidates(
  roster: Player[],
  target: Player,
  ctx: PreFilterContext | null,
): CompactCandidate[] {
  const out: CompactCandidate[] = [];
  const n = roster.length;

  const push = (players: Player[]) => {
    const sum = totalSalary(players);
    if (ctx && provablyInvalid(sum, target.salary, ctx)) return;
    out.push({
      ids: players.map((p) => p.id).sort((a, b) => a - b),
      diff: Math.abs(sum - target.salary),
    });
  };

  for (let i = 0; i < n; i++) {
    push([roster[i]]);
    for (let j = i + 1; j < n; j++) {
      push([roster[i], roster[j]]);
      for (let k = j + 1; k < n; k++) {
        push([roster[i], roster[j], roster[k]]);
      }
    }
  }

  out.sort(
    (a, b) =>
      a.ids.length - b.ids.length ||
      a.diff - b.diff ||
      compareIds(a.ids, b.ids),
  );
  return out;
}

function compareIds(a: number[], b: number[]): number {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return a.length - b.length;
}
