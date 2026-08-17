// POST /api/validate-batch — Show-more continuation. Continues validating the
// SAME saved ordered candidate list (never regenerates, never reorders, never
// invokes the LLM) until the reveal target is met, candidates are exhausted,
// or the time budget is reached. Previously validated results only ever grow.

import { NextResponse } from "next/server";
import { withRevealTarget, withSearchOutcome, type TradeState } from "@/lib/state";
import { resolveLimits, validateInOrder } from "@/lib/validation";
import { getBballGmClient } from "@/lib/wiring";
import { BballGmUnavailableError } from "@/lib/bballGmClient";

export const runtime = "nodejs";
export const maxDuration = 60;

type BatchRequestBody = {
  state?: TradeState;
  targetCount?: number;
};

export async function POST(request: Request) {
  let body: BatchRequestBody;
  try {
    body = (await request.json()) as BatchRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const state = body.state;
  const targetCount = body.targetCount ?? 0;
  if (!state || !state.searched || !state.team || !state.target || targetCount <= 0) {
    return NextResponse.json(
      { error: "A searched state and a positive targetCount are required" },
      { status: 400 },
    );
  }

  // Already have enough validated results — pure reveal, no network.
  if (state.results.length >= targetCount || state.pendingCandidates.length === 0) {
    return NextResponse.json({ state: withRevealTarget(state, targetCount) });
  }

  const bballGm = getBballGmClient();
  try {
    const [teams, players] = await Promise.all([bballGm.getTeams(), bballGm.getPlayers()]);
    const opposingTeam = teams.find((t) => t.id === state.target!.teamId);
    if (!opposingTeam) {
      return NextResponse.json(
        { error: "Opposing team missing from league data" },
        { status: 500 },
      );
    }

    const outcome = await validateInOrder(
      {
        client: bballGm,
        userTeam: state.team,
        opposingTeam,
        target: state.target,
        playersById: new Map(players.map((p) => [p.id, p])),
      },
      state.pendingCandidates,
      resolveLimits({ want: targetCount - state.results.length }),
    );

    const next = withRevealTarget(withSearchOutcome(state, outcome), targetCount);
    return NextResponse.json({ state: next });
  } catch (e) {
    if (e instanceof BballGmUnavailableError) {
      // Monotonicity: keep everything already validated, flag unavailability.
      return NextResponse.json({
        state: { ...state, validationUnavailable: true },
      });
    }
    console.error("validate-batch route error", e);
    return NextResponse.json({ error: "Validation request failed" }, { status: 500 });
  }
}
