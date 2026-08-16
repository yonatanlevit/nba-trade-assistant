# AI Plan — NBA Trade Assistant

The implementation plan approved during the AI Plan stage of the HAPI flow, after several rounds of Human Guidance. It is the contract the code was built against; every invariant here is enforced by tests.

Human Plan (the product contract): [`human-plan.md`](./human-plan.md).

---

## 1. Goal

A chat-first NBA trade assistant. Conversation drives trade-builder state through an LLM harness with a tool-calling agentic loop; a GUI board mirrors that state live; every displayed trade is validated by the real bball-GM league engine.

---

## 2. Technology decisions (decision → alternatives → reason)

| Decision | Alternatives considered | Reason |
|---|---|---|
| **Next.js 15 (App Router) + TypeScript** | Vite + Express; Remix/SvelteKit; browser-only SPA | One deployable unit. API routes keep `ANTHROPIC_API_KEY` server-side (a browser-only SPA would leak it). Vercel free tier deploys it zero-config. Shared types between client and server carry the type-level rendering guarantee (§4). |
| **`claude-opus-5` behind a `ModelClient` interface** | `claude-haiku-4-5` (cheapest/fastest, the first build's choice); `claude-sonnet-5`; OpenAI | Chosen for maximum tool-use reliability on messy phrasing; cost is trivial at demo volume. `MODEL_ID` is env-configurable and the SDK is confined to one file, so the swap is a one-file change. |
| **Hand-rolled agentic loop** | Anthropic SDK `toolRunner`; LangChain; Vercel AI SDK | The harness/tool boundary is the graded artifact. A ~60-line explicit loop makes it visible and defensible; a framework would hide exactly what is being evaluated. |
| **Two dependency boundaries: `ModelClient` + `BballGmClient`** | Env flags checked inside business logic | Core code depends on interfaces only; implementations are selected at the composition edge ([`lib/wiring.ts`](../lib/wiring.ts)). This is what makes the three test tiers possible. |
| **Stateless server, client-held `TradeState`** | Server session store (Redis); database | Vercel serverless has no sticky sessions. One state object is the single source of truth for chat and board, so their sync is structural rather than something to keep in step. |
| **Tailwind v4 + CSS custom properties** | CSS Modules; styled-components; a UI kit (shadcn) | Utility speed plus real design tokens — team colours are CSS variables set per card, so one component renders any team palette. A UI kit would make the demo look generic. |
| **`motion` for choreography** | CSS-only; GSAP | Staggered card entrance and layout transitions in minutes. Strictly progressive enhancement — no state transition depends on it (§8). |
| **Team colours from the API** | Hand-curated 30-team map | Verified before building: `GET /api/teams` returns `primaryColor`/`secondaryColor` per team. No hand-maintained map needed. |
| **Vitest + Playwright, three tiers** | Jest; single-tier e2e against live services | Vitest is faster with ESM/TS. Tiering isolates each external boundary so a failure attributes to one layer (§6). |
| **Vercel free tier** | Render; Railway | First-party Next.js host, public URL, env-var management. Serverless duration is handled by a configurable time budget (§5), not by assuming a platform number. |

---

## 3. Architecture

```
User types → POST /api/chat {history, userMessage, state}
  composition edge wires ModelClient + BballGmClient (real or fake per env)
  → harness loop (≤ 8 iterations):
      fresh <current_state> snapshot + cached system prompt + history + 4 tool schemas
      → model → tool_use? → our code executes against a TradeState copy
      → tool_result → model → …  until end_turn
  → run_trade_search: candidates.ts (generate → pre-filter → order, once)
      → validation.ts validates in order, batch after batch, until
        9 valid | candidates exhausted | SEARCH_TIME_BUDGET_MS reached
  → {reply, state, trace}

Client replaces TradeState → chat panel and Front Office Board both re-render
from the same object.

"Show more" → reveal already-validated results first, then POST
/api/validate-batch to continue down the SAME saved ordered candidate list.
No model call, no regeneration, no reordering.
```

### Tool surface (exactly four)

| Tool | Input | What app code does |
|---|---|---|
| `set_team` | raw team name | Resolves against league data → matched / ambiguous / not_found. Invalidates prior confirmation. |
| `set_target_player` | raw player name | Resolves → matched / ambiguous / not_found / free_agent / already_on_your_team. Invalidates prior confirmation. |
| `confirm_search` | none | Legal only when criteria are complete, valid, unambiguous. |
| `run_trade_search` | none | Legal only when confirmed. Runs the full search semantics of §5. |

The model never resolves names and never decides legality — that is deterministic app code, per the Human Plan and for auditability.

### Fresh state injection (no `get_current_state` tool)

A `<current_state>` block is regenerated **before every model call**, including calls after a state-changing tool inside the same loop, and is sent as a mid-conversation system message — never appended to durable history. One authoritative snapshot per request. A state *tool* would be a round trip the model can forget to make; ambient state the model always needs belongs in injected context. Tools are for actions.

---

## 4. Domain model and the type-level guarantee

```ts
TradeState = {
  team, target, confirmed, searched,
  results: ValidatedTrade[],            // ONLY API-confirmed trades, ever
  pendingCandidates: CompactCandidate[],// {ids, diff} — compact for serialization
  shownCount, validationUnavailable, trace[]
}
```

- `ValidatedTrade` and `CompactCandidate` are **distinct types**. `ValidatedTrade` is constructed in exactly one place: [`lib/validation.ts`](../lib/validation.ts), from a successful bball-GM response.
- `TradeCard` accepts **only** `ValidatedTrade`, so a pending candidate has no type-safe path into the render layer. The compiler enforces the product's core trust guarantee.
- `CompactCandidate` stays minimal (`{ids: number[], diff: number}`) because state round-trips browser ↔ server every turn; the server rehydrates full player data from its cached datasets when validating.

### Salary semantics

The Human Plan is the product contract: `salarySavings = total outgoing − target salary` → positive **Saved $X**, negative **Added $X**, zero **No salary change**. The bball-GM API's `netSalaryChange` is the opposite sign (`in − out`); the two never share a name — [`lib/salary.ts`](../lib/salary.ts) exposes `salarySavings()` and an explicit `apiNetChangeToSavings()`. Tests cover both directions.

### Reducer rules

Changing team or target sets `confirmed = false`, `searched = false`, and clears results, pending candidates, shownCount, and the unavailability flag.

### Trust boundary

Client-held state is **trusted in this MVP and is not a security boundary**. The code enforces the state machine during normal application flows — the model cannot bypass the confirmation contract through tool use — but a user could tamper with browser-held state. No Redis, DB, sessions, or signed state for this assignment.

---

## 5. Trade search semantics

`run_trade_search` means:

```
generate once → pre-filter once → order once
→ validate in order, across as many batches as necessary
→ stop at: 9 valid | candidates exhausted | SEARCH_TIME_BUDGET_MS reached
```

Batch size and concurrency are infrastructure tuning knobs; correctness never depends on them.

- **Time budget.** If the budget is reached before 9 valid trades are found, the search **returns what it confirmed** (e.g. 6 valid) and keeps the remaining ordered candidates for Show more. It never times out or fails the whole search.
- **Pure/impure split.** [`candidates.ts`](../lib/candidates.ts) is pure: enumerate 1–3-player packages, apply a provably-safe cap pre-filter, order by package size then closest salary match. [`validation.ts`](../lib/validation.ts) is impure: engine calls, batching, concurrency, budget, error mapping. The model never orchestrates one against the other.
- **Pre-filter safety.** The filter removes a package only if it is invalid under *every* matching tier the engine documents, plus a $5M safety margin — so no valid trade is ever eliminated before the engine sees it.
- **Show more** reveals validated results first, then continues validating the same saved list. It never regenerates, never reorders, never invokes the LLM, and imposes no total cap: every valid candidate in the generated space stays eventually reachable.

### Validation-failure invariant

**The displayed result set only ever grows with API-confirmed trades and never shrinks because of infrastructure errors.**

- Failure with **zero** validated trades → no cards, `validationUnavailable = true`, exact message: *"Trade validation is temporarily unavailable. Please try again later."*
- Failure **after** some results exist (Show more, or mid-search) → every previously validated card stays, the error shows alongside, retry is offered.
- Unvalidated candidates are never displayed under any circumstance.

---

## 6. Testing strategy — three tiers

Each tier swaps exactly one boundary from fake to real, so a failure attributes to one layer.

| Tier | LLM | bball-GM | Purpose | Status |
|---|---|---|---|---|
| **1 — stable automated** | scripted (`MOCK_LLM=1`) | fixture (`MOCK_BBALLGM=1`) | Deterministic, CI-safe. Exercises the real pipeline: UI → `/api/chat` → harness → tools → state machine → candidate generation → validation abstraction → results → UI sync. | 100 Vitest + 9 Playwright passing |
| **2 — integration** | scripted | **real** | Catches API schema drift and real validation problems. Network-dependent; not a CI gate. | 3 Playwright passing |
| **3 — manual QA** | **real Claude** | **real** | Prompt quality, tool comprehension, conversation flow. See [`qa-plan.md`](./qa-plan.md). | Conversational half verified against the live deployment; browser/visual half still manual |

**Wording contract:** production/displayed trades are validated by the real bball-GM API. Deterministic automated tests use a fixture-backed implementation of the same client interface. Mocking in Tier 1 does not weaken the production implementation.

---

## 7. File layout

```
app/
  page.tsx                     split-view shell; one TradeState drives both panes
  api/chat/route.ts            composition edge + harness endpoint
  api/validate-batch/route.ts  Show-more continuation
components/
  Chat.tsx                     messages + tool-trail chips + composer
  Board.tsx                    criteria strip, results grid, empty/error states
  TradeCard.tsx                accepts ONLY ValidatedTrade
lib/
  harness.ts        agentic loop, 8-iteration guard, fresh state injection
  tools.ts          4 tool schemas + dispatch
  state.ts          TradeState, ValidatedTrade, CompactCandidate, reducer
  modelClient.ts    ModelClient interface + AnthropicModelClient (only SDK import)
  bballGmClient.ts  BballGmClient interface + RealBballGmClient (+ cache)
  candidates.ts     PURE generation, pre-filter, ordering
  validation.ts     IMPURE batching, concurrency, time budget, monotonicity
  resolve.ts        team/player resolution + disambiguation
  salary.ts         product vs API sign semantics
  systemPrompt.ts   conversation policy
  wiring.ts         composition edge (the only place env picks implementations)
  testdoubles/      fixtures, FixtureBballGmClient, ScriptedModelClient
tests/              Vitest units (100)
e2e/                Playwright Tier 1 (9) and Tier 2 (3)
```

---

## 8. Design — "Broadcast / Arena", as progressive enhancement

Courtside-at-night broadcast graphics: charcoal court tones (`#0B0E13`), amber ticker accent, Barlow Condensed scoreboard display type over Archivo UI text, tabular numerals for money. Team colours appear only as *light* — card edges, header fills, the team chip — never as body text.

The board is the GUI mirror: criteria strip (team chip, target, confirmation status, result counts) above a responsive results grid; two tabs on mobile. Trade cards show "OPTION #n", a two-sided send/receive split coloured by both teams, a Saved/Added/No-change badge, and a VALID tick. Empty, loading, and error states are designed rather than default.

**Implementation priority was:** harness loop → state machine → candidate generation → real validation → chat/GUI sync → tests → docs → visual polish. Motion and polish are additive: with `motion` removed or `prefers-reduced-motion` set, the app remains fully usable and every state transition still works.

Accessibility: AA contrast on the dark ground, amber focus rings, `aria-live` chat region, semantic landmarks.

---

## 9. Platform-fact policy

Model IDs, pricing, caching thresholds, platform timeouts, and API fields are time-sensitive. They are configuration (`MODEL_ID`, `SEARCH_TIME_BUDGET_MS`, `VALIDATION_CONCURRENCY`, `BBALLGM_BASE_URL`), not domain constants. The bball-GM schema was verified live before implementation.

---

## 10. Human Guidance corrections that changed this architecture

Five points where the Human Guidance stage materially changed the design rather than approving the first proposal:

1. **Validation-only display** instead of falling back to locally-inferred validity when the API fails.
2. **Uncapped lazy validation** instead of a fixed top-N validation cap, so every valid package stays reachable.
3. **Pure candidate generation separated from impure external validation**, rather than one mixed module.
4. **Fresh state injection** instead of a `get_current_state` tool the model must remember to call.
5. **Deterministic external-boundary testing** — the stable E2E tier mocks *both* the model and the validation service; real integrations are verified in separate tiers.
