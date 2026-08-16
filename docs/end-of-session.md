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
  - **Deployed to Vercel and verified live:** <https://nba-trade-assistant.vercel.app> returns the same 11 valid / 274 pending for "Boston → Anthony Davis" as the local run, in ~7s per turn against the route's `maxDuration = 60`.
  - **Tier 3 verified at the API level** against real Claude + the real engine: criteria resolution, confirmation gating, search, target change invalidating confirmation, ambiguity listing all matches with teams, free-agent rejection, unknown player, and out-of-scope refusal.
- **In progress:** nothing — the build is at a natural stopping point.
  - **Tier 3 browser QA walked and passing** — the visual half of `qa-plan.md` §4 (split view, card rendering, Show more, responsive tabs, focus rings, reduced motion) confirmed by the user at a browser.
  - **Validation-outage check run and passing**, all three scenarios, using `scripts/outage-proxy.mjs`. Cards survived a mid-flight failure; Retry resumed down the same list.
- **Blocked:**
  - **The PR** is not open. It is the next HAPI stage after this handoff, but it waits on the user asking for it in the moment. It is the only outstanding delivery item.

**Committed and pushed.** Upstream tracking is configured, so a bare `git push` works. **No PR is open** — `main` is still at `cd4ae13` (Initial commit).

## Key decisions (this session)

- **Fresh rebuild from scratch.** The earlier tested implementation remains untouched in `git stash@{0}` as read-only reference; it was never popped. Inspect with `git stash show -p stash@{0}` if ever useful.
- **Model: `claude-opus-5`** (changed from `claude-haiku-4-5` mid-session at the user's request), behind a `ModelClient` interface with `MODEL_ID` env-configurable. Adaptive thinking left on at `effort: "low"` — Opus 5 defaults thinking on, and disabling it risks tool calls being emitted as plain text. Server-side refusal fallbacks enabled. **`MODEL_ID` is set nowhere** — not in `.env.local` (commented out) and not in Vercel — so both local and production run the `claude-opus-5` default in `lib/modelClient.ts`. Confirmed 2026-08-16 after a question about whether the app was on Haiku; it is not, and has not been since the switch.
- **A second dependency boundary, `BballGmClient`**, mirroring `ModelClient`. Both implementations are chosen at the composition edge (`lib/wiring.ts`) via env flags, never inside business logic. This is what makes the three test tiers possible.
- **Team colours come from the API.** Verified before building that `GET /api/teams` returns `primaryColor`/`secondaryColor`, so no hand-curated 30-team map was written.
- **Salary signs are normalised at the boundary.** Product semantics are `salarySavings = outgoing − target`; the API's `netSalaryChange` is the opposite sign and never shares a name with it.
- **Broadcast/arena design direction**, implemented as progressive enhancement — no state transition depends on animation code.
- **Tier 2 was silently testing the fixture, and now cannot be.** Next.js loads `.env.local` into `process.env` at server start, so a local file in demo mode fed `MOCK_BBALLGM=1` straight into the Tier-2 server: the tier passed while proving nothing about the real API. Fixed by pinning `MOCK_BBALLGM: "0"` in the Tier-2 config — timings confirm it (`511ms → 4.8s` on the same assertions). The assertions were always correct; only the boundary was wrong.
- **Deployed with the Vercel CLI, not the Git integration.** `vercel link` could not connect the GitHub repo, and CLI deploys sidestep that entirely. The key is stored as a Sensitive production env var, piped from `.env.local` so it never appeared in a command line.

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
- **The demo is public, and its spend cap is deliberately tight.** A **$2/month** cap is set in the Anthropic console (user's choice, 2026-08-16). At Opus 5 rates — $5/M input, $25/M output, with the system prompt and tool schemas cached — a chat turn costs roughly $0.02–0.04, so $2 is about **80 turns, or 4–8 reviewer sessions**. There is no graceful degradation: when the cap trips the API errors and the live demo goes dead. Raise it before sharing the URL widely, and add a server-side rate guard if the demo stays up.

## Continue from here

- **Branch:** `feature-mvp-trade-assistant` — pushed, upstream tracking set, no PR yet.
- **Files:** `lib/harness.ts` (the loop), `lib/tools.ts` (the tool boundary), `lib/validation.ts` (search semantics and the monotonicity invariant), `lib/state.ts` (types and reducer), `components/Board.tsx` + `components/TradeCard.tsx` (the mirror).
- **Commands:**
  ```bash
  npm install
  npm test                 # 100 unit tests
  npm run build
  npm run test:e2e         # Tier 1, deterministic
  npm run test:e2e:tier2   # Tier 2, real engine
  npm run dev              # needs ANTHROPIC_API_KEY, both MOCK_* lines commented out
  vercel --prod --yes      # redeploy
  ```
- **Next steps:** the only remaining delivery item is the PR — `feature-mvp-trade-assistant` → `main` in this repo, description per the brief's template (`gambit-onboarding-task.md:362-385`). Ask the user before opening it.
- **Demo URL:** <https://nba-trade-assistant.vercel.app> (Vercel project `yonatans-projects-7d5ba689/nba-trade-assistant`). Redeploy with `vercel --prod --yes`. Only the clean alias is public — the project-scoped `*-yonatans-projects-*.vercel.app` URLs sit behind Vercel SSO.

## Do not regress

- Only bball-GM-validated trades may ever render. `TradeCard` accepts `ValidatedTrade` only; keep `CompactCandidate` a separate type with no path into the render layer.
- Results never shrink because of an infrastructure error. A failure with zero results shows the exact message *"Trade validation is temporarily unavailable. Please try again later."*; a failure after results exist keeps every card and shows the error alongside.
- No total cap on results. Show more continues down the same saved ordered list — never regenerate, never reorder, never call the LLM.
- Do not add a `get_current_state` tool. State is injected fresh before every model call and never persisted into history.
- **`MODEL_ID` is not a free knob — treat a model change as a code change.** The request in `lib/modelClient.ts` uses three Opus-5 features, and one is structural: the fresh state snapshot rides as a mid-conversation `role: "system"` message, supported on Opus 5 / Opus 4.8 / Fable 5 only. **`MODEL_ID` accepts `claude-opus-5`, `claude-opus-4-8`, or `claude-fable-5` and nothing else** — those are the models supporting a mid-conversation `role: "system"` message. Point it anywhere else, **Sonnet 5 and Haiku 4.5 included**, and every request fails with `400 role 'system' is not supported on this model` (Haiku additionally errors on `output_config.effort`). Nothing in the test suite catches this: Tier 1 and Tier 2 both run the scripted client and never touch the real SDK, so a bad `MODEL_ID` ships green and breaks only in production.
- Keep `candidates.ts` pure and network-free; keep batching, concurrency, and the time budget in `validation.ts`.
- The search returns partial results when the time budget is reached; it must not time out or fail wholesale.
- Keep both dependency boundaries and the composition edge — env flags must not leak into business logic.
- **Every Playwright config must set `MOCK_LLM` *and* `MOCK_BBALLGM` explicitly**, even where a value looks like the default. `MOCK_BBALLGM: "0"` in the Tier-2 config is not redundant: Next.js loads `.env.local` into `process.env` at server start, so a local file in demo mode silently swaps the real engine for the fixture and the tier passes while proving nothing. Nothing catches this — the suite stays green, `.env.local` is gitignored so the trigger never appears in a diff, and demo mode is the default onboarding state. Do not "tidy up" that line.
- Salary sign semantics follow the Human Plan; do not let the API's `netSalaryChange` and the product's `salarySavings` share a name.
- The demo scripts use rostered stars. **LeBron James is a free agent in this dataset and cannot be traded** — that is correct behaviour, not a bug.
- Visual polish stays optional: the app must work with animation removed or `prefers-reduced-motion` set.
- **Do not commit, push, or open a PR without the user asking in that moment.**
