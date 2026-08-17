// IMPURE validation orchestration: bball-GM calls, batching, concurrency,
// time-budget handling, and the result-set monotonicity invariant.
//
// Semantics (the contract every doc repeats):
//   validate candidates IN ORDER, across as many batches as necessary,
//   until:  `want` valid confirmed | candidates exhausted | time budget reached.
// Batch size/concurrency are tuning knobs — correctness never depends on them.
//
// Monotonicity: on an infrastructure failure we return everything validated so
// far, put unresolved candidates back into `remaining`, and set
// `unavailable: true`. Previously validated results are NEVER discarded.

import {
  BballGmUnavailableError,
  type BballGmClient,
  type ValidateTradeRequest,
} from "./bballGmClient";
import type {
  CompactCandidate,
  Player,
  Team,
  TradePlayer,
  ValidatedTrade,
} from "./state";
import { salarySavings } from "./salary";

export type ValidationOutcome = {
  newlyValidated: ValidatedTrade[];
  remaining: CompactCandidate[];
  unavailable: boolean;
  /** How many candidates received a definitive verdict this pass. */
  processed: number;
};

export type ValidationContext = {
  client: BballGmClient;
  userTeam: Team;
  opposingTeam: Team;
  target: Player;
  /** id → Player for reconstructing outgoing packages from CompactCandidate. */
  playersById: Map<number, Player>;
};

export type ValidationLimits = {
  /** Stop once this many newly validated trades were found. */
  want: number;
  /** Hard wall-clock budget for this pass (ms). */
  timeBudgetMs: number;
  /** Parallel requests per batch window. */
  concurrency: number;
};

export function resolveLimits(partial?: Partial<ValidationLimits>): ValidationLimits {
  return {
    want: partial?.want ?? 9,
    timeBudgetMs:
      partial?.timeBudgetMs ??
      intFromEnv("SEARCH_TIME_BUDGET_MS", 8_000),
    concurrency: partial?.concurrency ?? intFromEnv("VALIDATION_CONCURRENCY", 4),
  };
}

function intFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function validateInOrder(
  ctx: ValidationContext,
  candidates: CompactCandidate[],
  limits: ValidationLimits,
): Promise<ValidationOutcome> {
  const deadline = Date.now() + limits.timeBudgetMs;
  const validated: ValidatedTrade[] = [];
  let cursor = 0;
  let unavailable = false;

  while (
    cursor < candidates.length &&
    validated.length < limits.want &&
    Date.now() < deadline
  ) {
    const windowSize = Math.min(limits.concurrency, candidates.length - cursor);
    const window = candidates.slice(cursor, cursor + windowSize);

    const settled = await Promise.allSettled(
      window.map((cand) => validateOne(ctx, cand)),
    );

    // Preserve candidate order; on the first infra failure, everything from
    // that candidate onward goes back to `remaining` for retry.
    let failedAt = -1;
    for (let i = 0; i < settled.length; i++) {
      const s = settled[i];
      if (s.status === "fulfilled") {
        if (s.value) validated.push(s.value);
      } else {
        failedAt = i;
        break;
      }
    }
    if (failedAt >= 0) {
      unavailable = true;
      cursor += failedAt; // candidates before failedAt got definitive verdicts
      break;
    }
    cursor += window.length;
  }

  // A concurrency window may over-shoot `want` by a few — keep every validated
  // trade (results only grow; dropping one would orphan its consumed candidate).
  return {
    newlyValidated: validated,
    remaining: candidates.slice(cursor),
    unavailable,
    processed: cursor,
  };
}

/** Definitive verdict for one candidate: ValidatedTrade if valid, null if not.
 *  Throws BballGmUnavailableError upward for infrastructure failures. */
async function validateOne(
  ctx: ValidationContext,
  cand: CompactCandidate,
): Promise<ValidatedTrade | null> {
  const outgoing = cand.ids.map((id) => {
    const p = ctx.playersById.get(id);
    if (!p) throw new BballGmUnavailableError(`unknown player id ${id} in candidate`);
    return p;
  });

  const req: ValidateTradeRequest = {
    teams: [
      {
        teamId: ctx.userTeam.id,
        sendingPlayerIds: cand.ids,
        receivingPlayerIds: [ctx.target.id],
        sendingPickIds: [],
        receivingPickIds: [],
      },
      {
        teamId: ctx.opposingTeam.id,
        sendingPlayerIds: [ctx.target.id],
        receivingPlayerIds: cand.ids,
        sendingPickIds: [],
        receivingPickIds: [],
      },
    ],
  };

  const verdict = await ctx.client.validateTrade(req);
  if (!verdict.isValid) return null;

  const outgoingPlayers: TradePlayer[] = outgoing.map((p) => ({
    id: p.id,
    name: p.name,
    position: p.position,
    salary: p.salary,
  }));

  // The single construction site of ValidatedTrade in the codebase.
  return {
    kind: "validated",
    outgoing: outgoingPlayers,
    incoming: {
      id: ctx.target.id,
      name: ctx.target.name,
      position: ctx.target.position,
      salary: ctx.target.salary,
    },
    opposingTeam: {
      id: ctx.opposingTeam.id,
      name: ctx.opposingTeam.name,
      city: ctx.opposingTeam.city,
      abbreviation: ctx.opposingTeam.abbreviation,
      primaryColor: ctx.opposingTeam.primaryColor,
      secondaryColor: ctx.opposingTeam.secondaryColor,
    },
    salarySavings: salarySavings(outgoingPlayers, ctx.target.salary),
    apiSummary: verdict.summary,
  };
}
