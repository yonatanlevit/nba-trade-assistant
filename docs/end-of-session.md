# End of session — 2026-08-16

## Goal

Build a chat-first NBA trade assistant where conversation drives trade state through an LLM tool-calling harness and a GUI board mirrors it live — see [`human-plan.md`](./human-plan.md).

## Status

- **Done:** the full application is built, typechecks, builds clean, and passes every automated tier.
  - Harness with a hand-rolled 8-iteration agentic loop, 4 tools, fresh per-call state injection.
  - Pure candidate generation + impure validation with a configurable time budget and monotonic result semantics.
  - Broadcast/arena UI: split view, criteria strip, trade cards in both teams' colours, Show more, designed empty/loading/error states, motion, mobile tabs, AA contrast and focus rings.
  - **100 Vitest unit tests**, **9 Tier-1 Playwright e2e** (both boundaries mocked, deterministic), **3 Tier-2 e2e** (scripted LLM + real bball-GM engine) — all green.
  - Verified against the live engine: "Boston → Anthony Davis" returns **11 validated trades with 274 candidates still pending**; Show more continued to 19 validated without regenerating or reordering.
  - Docs written: `ai-plan.md`, `qa-plan.md`, this file, and a rewritten `README.md`.
  - Committed and pushed as three commits on `feature-mvp-trade-assistant`: `c8fa7e7` (feat — app, components, lib, config), `3c0e6f1` (test — Vitest units plus Tier-1/Tier-2 Playwright), `03ec30a` (docs — ai-plan, qa-plan, this file, README rewrite).
- **In progress:** nothing — the build is at a natural stopping point.
- **Blocked:**
  - **Tier 3 manual QA** (real Claude + real engine) needs a funded `ANTHROPIC_API_KEY` in `.env.local`. The previous key was deleted when the earlier build was torn down. Everything else runs without one.
  - **Deployment** to Vercel needs the user's account and their explicit go-ahead.
  - **The PR** is not open. It is the next HAPI stage after this handoff, but it waits on the user asking for it in the moment.

**Committed and pushed.** The working tree is clean and `origin/feature-mvp-trade-assistant` is at `03ec30a`, so nothing is unpushed. **No PR is open** — `main` is still at `cd4ae13` (Initial commit). The branch has **no upstream configured**, so a bare `git push` fails; use `git push -u origin feature-mvp-trade-assistant` once to set it.

## Key decisions (this session)

- **Fresh rebuild from scratch.** The earlier tested implementation remains untouched in `git stash@{0}` as read-only reference; it was never popped. Inspect with `git stash show -p stash@{0}` if ever useful.
- **Model: `claude-opus-5`** (changed from `claude-haiku-4-5` mid-session at the user's request), behind a `ModelClient` interface with `MODEL_ID` env-configurable. Adaptive thinking left on at `effort: "low"` — Opus 5 defaults thinking on, and disabling it risks tool calls being emitted as plain text. Server-side refusal fallbacks enabled.
- **A second dependency boundary, `BballGmClient`**, mirroring `ModelClient`. Both implementations are chosen at the composition edge (`lib/wiring.ts`) via env flags, never inside business logic. This is what makes the three test tiers possible.
- **Team colours come from the API.** Verified before building that `GET /api/teams` returns `primaryColor`/`secondaryColor`, so no hand-curated 30-team map was written.
- **Salary signs are normalised at the boundary.** Product semantics are `salarySavings = outgoing − target`; the API's `netSalaryChange` is the opposite sign and never shares a name with it.
- **Broadcast/arena design direction**, implemented as progressive enhancement — no state transition depends on animation code.

## Human guidance given

The user materially changed the architecture rather than approving the first proposal. Five corrections to carry into the PR reflection:

1. **Validation-only display** — never fall back to locally-inferred validity when the engine fails.
2. **Uncapped lazy validation** — no fixed top-N cap; every valid package stays eventually reachable through Show more.
3. **Pure candidate generation separated from impure external validation.**
4. **Fresh state injection** instead of a `get_current_state` tool.
5. **Deterministic external-boundary testing** — the stable e2e tier mocks *both* the model and the engine; real integrations are verified in separate tiers.

Plus, this session: the model switch to Opus 5; the explicit `TradeState` shape with a type-level rendering guarantee; the configurable search time budget returning partial results rather than failing; the precise "results never shrink on infrastructure error" invariant; keeping `pendingCandidates` compact for serialization; and treating platform facts (pricing, timeouts, model IDs) as configuration to verify rather than architecture.

## Open questions

- Should Tier 2 run in CI at all, or stay a pre-delivery manual gate? It is network-dependent by design.
- The fixture engine implements one documented salary-matching rule, not the full CBA. Enough for determinism — worth revisiting only if Tier 1 starts needing richer verdict shapes.
- Whether to add a small server-side rate guard before making the demo public.

## Continue from here

- **Branch:** `feature-mvp-trade-assistant` — 3 commits, pushed, no PR yet.
- **Files:** `lib/harness.ts` (the loop), `lib/tools.ts` (the tool boundary), `lib/validation.ts` (search semantics and the monotonicity invariant), `lib/state.ts` (types and reducer), `components/Board.tsx` + `components/TradeCard.tsx` (the mirror).
- **Commands:**
  ```bash
  npm install
  npm test                 # 100 unit tests
  npm run build
  npm run test:e2e         # Tier 1, deterministic
  npm run test:e2e:tier2   # Tier 2, real engine
  npm run dev              # needs ANTHROPIC_API_KEY for real chat
  ```
- **Next steps:** add an API key → walk the Tier-3 script in [`qa-plan.md`](./qa-plan.md) → deploy to Vercel → ask the user before opening the PR.
- **Demo URL:** none yet.

## Do not regress

- Only bball-GM-validated trades may ever render. `TradeCard` accepts `ValidatedTrade` only; keep `CompactCandidate` a separate type with no path into the render layer.
- Results never shrink because of an infrastructure error. A failure with zero results shows the exact message *"Trade validation is temporarily unavailable. Please try again later."*; a failure after results exist keeps every card and shows the error alongside.
- No total cap on results. Show more continues down the same saved ordered list — never regenerate, never reorder, never call the LLM.
- Do not add a `get_current_state` tool. State is injected fresh before every model call and never persisted into history.
- Keep `candidates.ts` pure and network-free; keep batching, concurrency, and the time budget in `validation.ts`.
- The search returns partial results when the time budget is reached; it must not time out or fail wholesale.
- Keep both dependency boundaries and the composition edge — env flags must not leak into business logic.
- Salary sign semantics follow the Human Plan; do not let the API's `netSalaryChange` and the product's `salarySavings` share a name.
- The demo scripts use rostered stars. **LeBron James is a free agent in this dataset and cannot be traded** — that is correct behaviour, not a bug.
- Visual polish stays optional: the app must work with animation removed or `prefers-reduced-motion` set.
- **Do not commit, push, or open a PR without the user asking in that moment.**
