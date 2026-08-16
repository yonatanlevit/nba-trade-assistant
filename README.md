# Front Office — NBA Trade Assistant

A **chat-first** NBA trade assistant. You tell it which team you represent and who you want; it fills in the trade-builder state through an LLM tool-calling loop, and a live board mirrors that state. Every trade it shows has been validated by the real [bball-GM](http://bball-gm.com) league engine.

Built for the Gambit Labs HAPI onboarding task. The mouse is optional: conversation is the primary input, and the GUI is a mirror.

> **Live demo:** **<https://nba-trade-assistant.vercel.app>**

---

## What it does

```
You: I'm Boston and I want Anthony Davis
     → set_team → Boston Celtics ✓    set_target_player → Anthony Davis (WAS) ✓

App: You're representing the Boston Celtics and want to acquire Anthony Davis.
     Should I search for valid trades?

You: yes
     → confirm_search ✓    run_trade_search → 11 valid · 274 pending ✓

App: Confirmed — the board shows every validated package, simplest trades first.
```

The board fills with numbered option cards: who you send, who you get, the opposing team, a **Saved / Added / No salary change** badge, and a validity tick — each side tinted with its team's real colours.

---

## Architecture

```
Browser  ──POST /api/chat {history, userMessage, state}──▶  Composition edge
                                                             (picks real or fake clients)
                                                                   │
                                        ┌──────────────────────────┴─────────────────────┐
                                        │  Harness — hand-rolled agentic loop (≤8 iters)  │
                                        │  fresh <current_state> + system prompt + tools  │
                                        │  model → tool_use → OUR CODE executes → result  │
                                        │       → model → … → end_turn                    │
                                        └──────────┬──────────────────────┬───────────────┘
                                                   │                      │
                                     ModelClient (Claude)      BballGmClient (league engine)
                                                                          │
                                         candidates.ts (PURE) ────▶ validation.ts (IMPURE)
                                         generate→filter→order      batches, budget, verdicts
                                                   │
Browser  ◀────────── {reply, state, trace} ────────┘
   └─ one TradeState object renders BOTH the chat panel and the board
```

### The harness and its tool boundary

The core of the assignment. `lib/harness.ts` runs the loop explicitly — no agent framework — so the boundary is visible: **the model reasons and routes; our code does everything deterministic.**

Four tools, and nothing else:

| Tool | The model passes | Our code does |
|---|---|---|
| `set_team` | the user's raw wording | resolves it → matched / ambiguous / not found |
| `set_target_player` | the user's raw wording | resolves it → matched / ambiguous / not found / free agent / already on your roster |
| `confirm_search` | — | gates on complete, valid, unambiguous criteria |
| `run_trade_search` | — | generates, orders, and validates packages |

The model never resolves a name and never decides whether a trade is legal. That is what makes the output auditable.

**State is injected, not fetched.** There is deliberately no `get_current_state` tool: a fresh `<current_state>` snapshot is generated before *every* model call — including calls that follow a state-changing tool inside the same loop — and is never appended to durable history. A state tool would be a round trip the model could forget to make.

**Interaction model.** A chat turn produces tool calls; each executes against a copy of `TradeState`; the updated state comes back with the reply. Changing your team or target automatically invalidates a previous confirmation and clears results — enforced in the reducer, not in the prompt.

**Sync.** Chat and board are not kept in step; they render from the *same* `TradeState` object. Drift is structurally impossible.

### Only validated trades can be displayed

`ValidatedTrade` and `CompactCandidate` are distinct types. `ValidatedTrade` is constructed in exactly one place — from a successful engine response — and `TradeCard` accepts only `ValidatedTrade`. A pending candidate has no type-safe path into the UI; the compiler enforces the trust guarantee.

The result set is **monotonic**: it only ever grows with API-confirmed trades. If validation fails with nothing yet found, you get no cards and the message *"Trade validation is temporarily unavailable. Please try again later."* If it fails **after** results exist, every existing card stays and the error appears alongside with a retry.

### Search semantics

```
generate once → pre-filter once → order once
→ validate in order across as many batches as needed
→ stop at 9 valid | candidates exhausted | SEARCH_TIME_BUDGET_MS reached
```

Batch size and concurrency are tuning knobs; correctness never depends on them. If the time budget runs out first, the search returns what it confirmed and keeps the rest for **Show more** — which reveals validated results, then continues down the *same saved ordered list*. It never regenerates, never reorders, never calls the LLM, and imposes no total cap, so every valid package stays reachable.

The pre-filter only drops a package that is invalid under *every* matching tier the engine documents, plus a $5M safety margin — it can never eliminate a trade the engine would have allowed.

### Explainability and traceability

Each assistant turn renders its tool trail as chips — `set_team → Boston Celtics`, `run_trade_search → 11 valid · 274 pending` — so you can reconstruct *what you said → what changed → what the engine ruled*. Cards carry the engine's own verdict summary, and the board's counter shows how many packages are validated versus still unchecked.

---

## Running locally

```bash
npm install
cp .env.example .env.local     # then add your ANTHROPIC_API_KEY
npm run dev                    # http://localhost:3000
```

Configuration (all optional except the key):

| Variable | Default | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | **Required.** Server-side only; never reaches the browser. |
| `MODEL_ID` | `claude-opus-5` | The model powering the loop. Not freely swappable — see the note below. |
| `SEARCH_TIME_BUDGET_MS` | `8000` | Wall-clock budget per validation pass. |
| `VALIDATION_CONCURRENCY` | `4` | Parallel engine requests per window. |
| `BBALLGM_BASE_URL` | `https://bball-gm.com/api` | League data + validation endpoint. |
| `MOCK_LLM` / `MOCK_BBALLGM` | unset | Test wiring only — swaps in deterministic fakes at the composition edge. |

**On changing `MODEL_ID`.** All Anthropic SDK usage is confined to [`lib/modelClient.ts`](lib/modelClient.ts), so a model change touches one file — but the request there uses three Opus-5 features, and one of them is load-bearing:

- **A mid-conversation `role: "system"` message** carries the fresh state snapshot. This is the state-injection mechanism, and it is supported on Opus 5, Opus 4.8, and Fable 5 only. A model without it returns `400: role 'system' is not supported on this model` on **every** request.
- **`output_config: { effort: "low" }`** — the `effort` parameter errors on Haiku 4.5.
- **Server-side refusal fallbacks** — an Opus 5 feature; inert elsewhere.

The practical effect is a short allowlist. `MODEL_ID` accepts **`claude-opus-5`, `claude-opus-4-8`, or `claude-fable-5`** — the models that support a mid-conversation `role: "system"` message. **Every other model, including `claude-sonnet-5` and `claude-haiku-4-5`, fails on every request**, because the state snapshot has nowhere to go. Setting `MODEL_ID` to a cheaper model is a code change, not a config change: the snapshot has to move into a user turn first, which costs the operator-authority and cache-preservation properties it was designed for.

### Testing

```bash
npm test                # Tier 1 units — 100 tests, no network, no tokens
npm run build
npm run test:e2e        # Tier 1 e2e — 9 tests, both boundaries mocked, deterministic
npm run test:e2e:tier2  # Tier 2 — scripted LLM against the REAL bball-GM engine
```

Three tiers, each swapping exactly one external boundary from fake to real, so a failure always attributes to one layer. Tier 3 (real Claude + real engine) is the manual script in [`docs/qa-plan.md`](docs/qa-plan.md).

Production and displayed trades are always validated by the real bball-GM API; the fixture engine exists only to make Tier 1 deterministic.

---

## Deploying

Deployed to the Vercel free tier via the CLI:

```bash
vercel link --yes
vercel env add ANTHROPIC_API_KEY production   # value piped in, never echoed
vercel --prod --yes
```

Leave `MOCK_LLM` and `MOCK_BBALLGM` **unset** in Vercel — their absence is what selects the real Claude and real bball-GM clients at the composition edge.

Only the clean alias `nba-trade-assistant.vercel.app` is public; the project-scoped `*-yonatans-projects-*.vercel.app` URLs sit behind Vercel's deployment protection. Redeploy with `vercel --prod --yes`.

The league engine is called server-side, so there are no CORS concerns — and note that blocking `bball-gm.com` on your own machine will **not** simulate an outage against the deployment. Run that check locally (see [`docs/qa-plan.md`](docs/qa-plan.md) §4).

---

## Project docs

| Document | What it is |
|---|---|
| [`docs/human-plan.md`](docs/human-plan.md) | The product contract: goal, scope, acceptance criteria, UX rules — written before implementation. |
| [`docs/ai-plan.md`](docs/ai-plan.md) | The approved implementation plan: technology rationale, invariants, file layout, design spec. |
| [`docs/qa-plan.md`](docs/qa-plan.md) | How to verify it works: automated tiers, a manual script, and honest known gaps. |
| [`docs/end-of-session.md`](docs/end-of-session.md) | Session handoff — status, decisions, guidance given, what must not be undone. |

---

## Known limitations

- **Roster data is synthetic.** Player/team assignments do not match the real NBA. Notably **LeBron James is a free agent with a $0 salary and cannot be traded** — use Jayson Tatum or Anthony Davis for demos.
- **Client-held state is trusted** and is not a security boundary. The state machine is enforced during normal application flows — the model cannot bypass the confirmation gate through tool use — but a determined user could tamper with browser state. Hardening would move state server-side.
- **Two-team, player-only trades.** No draft picks, sign-and-trades, or multi-team deals; packages are one to three outgoing players for exactly the target.
- **Ordering is not a quality ranking.** Simpler packages and closer salary matches come first; the app makes no basketball-value judgement.

---

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Motion · Anthropic SDK (`claude-opus-5`) · Vitest · Playwright
