// ScriptedModelClient — deterministic ModelClient used in Tier-1 (with the
// fixture engine) and Tier-2 (against the REAL bball-GM API). It replays
// pre-recorded tool-call sequences keyed on the user's message, exercising the
// real harness loop, tool dispatch, state machine, and validation pipeline.

import type {
  ModelClient,
  ModelRequest,
  ModelResponse,
  ModelToolCall,
} from "../modelClient";

type Step =
  | { toolCalls: { name: string; input: Record<string, unknown> }[] }
  | { text: string };

type Scenario = { match: RegExp; steps: Step[] };

export const DEMO_SCRIPT: Scenario[] = [
  {
    // "yes" / confirmation replies
    match: /^\s*(yes|yeah|yep|sure|confirm|go ahead|do it)\b/i,
    steps: [
      { toolCalls: [{ name: "confirm_search", input: {} }, { name: "run_trade_search", input: {} }] },
      {
        text: "Confirmed — the search is done. The board shows every validated package, simplest trades first. Want me to keep validating more options?",
      },
    ],
  },
  {
    match: /(boston|celtics)[\s\S]*davis|davis[\s\S]*(boston|celtics)/i,
    steps: [
      {
        toolCalls: [
          { name: "set_team", input: { team_name: "Boston" } },
          { name: "set_target_player", input: { player_name: "Anthony Davis" } },
        ],
      },
      {
        text: "You're representing the Boston Celtics and want to acquire Anthony Davis. Should I search for valid trades?",
      },
    ],
  },
  {
    match: /curry/i,
    steps: [
      { toolCalls: [{ name: "set_target_player", input: { player_name: "Stephen Curry" } }] },
      {
        text: "You're still representing the Boston Celtics, but your target is now Stephen Curry — the earlier confirmation no longer applies. Should I search for valid trades for Curry?",
      },
    ],
  },
  {
    match: /smith/i,
    steps: [
      { toolCalls: [{ name: "set_target_player", input: { player_name: "Smith" } }] },
      {
        text: 'I found more than one player matching "Smith" — Dru Smith (Wizards) and Jalen Smith (Suns). Which one do you mean?',
      },
    ],
  },
  {
    match: /lebron/i,
    steps: [
      { toolCalls: [{ name: "set_target_player", input: { player_name: "LeBron James" } }] },
      {
        text: "LeBron James is currently a free agent, so he can't be acquired through a trade — free agents are signed, not traded.",
      },
    ],
  },
  {
    match: /zzz/i,
    steps: [
      { toolCalls: [{ name: "set_target_player", input: { player_name: "Zzz Nobody" } }] },
      { text: "I couldn't find a player by that name. Could you check the spelling?" },
    ],
  },
];

const FALLBACK_TEXT =
  "Tell me which team you represent and which player you'd like to acquire.";

export class ScriptedModelClient implements ModelClient {
  constructor(private scenarios: Scenario[] = DEMO_SCRIPT) {}

  async createMessage(req: ModelRequest): Promise<ModelResponse> {
    // The last plain user message identifies the turn...
    let lastUserIdx = -1;
    for (let i = req.messages.length - 1; i >= 0; i--) {
      if (req.messages[i].role === "user") {
        lastUserIdx = i;
        break;
      }
    }
    const userText =
      lastUserIdx >= 0
        ? String((req.messages[lastUserIdx] as { content: string }).content)
        : "";

    // ...and the number of assistant_raw entries after it is the step index.
    const stepIndex = req.messages
      .slice(lastUserIdx + 1)
      .filter((m) => m.role === "assistant_raw").length;

    const scenario = this.scenarios.find((s) => s.match.test(userText));
    const step = scenario?.steps[stepIndex];

    if (!step) {
      return { stopReason: "end_turn", text: FALLBACK_TEXT, toolCalls: [], rawContent: [] };
    }
    if ("text" in step) {
      return { stopReason: "end_turn", text: step.text, toolCalls: [], rawContent: [] };
    }
    const toolCalls: ModelToolCall[] = step.toolCalls.map((c, i) => ({
      id: `scripted-${stepIndex}-${i}`,
      name: c.name,
      input: c.input,
    }));
    return {
      stopReason: "tool_use",
      text: "",
      toolCalls,
      rawContent: toolCalls.map((c) => ({
        type: "tool_use",
        id: c.id,
        name: c.name,
        input: c.input,
      })),
    };
  }
}
