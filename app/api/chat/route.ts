// POST /api/chat — the harness endpoint. Stateless: the client sends the full
// chat history and TradeState; we return the reply and the updated state.

import { NextResponse } from "next/server";
import { runChatTurn } from "@/lib/harness";
import { BballGmUnavailableError } from "@/lib/bballGmClient";
import { emptyState, type ChatMsg, type TradeState } from "@/lib/state";
import { getBballGmClient, getModelClient } from "@/lib/wiring";

export const runtime = "nodejs";
export const maxDuration = 60;

type ChatRequestBody = {
  history?: ChatMsg[];
  userMessage?: string;
  state?: TradeState;
};

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const userMessage = (body.userMessage ?? "").trim();
  if (!userMessage) {
    return NextResponse.json({ error: "userMessage is required" }, { status: 400 });
  }
  const history = Array.isArray(body.history) ? body.history.slice(-30) : [];
  const state = body.state ?? emptyState();

  try {
    const result = await runChatTurn(
      { model: getModelClient(), bballGm: getBballGmClient() },
      { history, userMessage, state },
    );
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof BballGmUnavailableError) {
      // League roster data itself could not be loaded — distinct from the
      // validation-unavailable path, but equally non-fatal to the session.
      return NextResponse.json({
        reply:
          "League roster data is temporarily unavailable, so I can't look anything up right now. Please try again in a moment.",
        state,
        trace: [],
      });
    }
    console.error("chat route error", e);
    return NextResponse.json(
      { error: "Something went wrong processing that message." },
      { status: 500 },
    );
  }
}
