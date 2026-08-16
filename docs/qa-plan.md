# QA Plan — NBA Trade Assistant

How to verify the app actually works end to end. Scope ties to [`human-plan.md`](./human-plan.md); the architecture under test is described in [`ai-plan.md`](./ai-plan.md).

---

## 1. Scope — what the MVP claims to support

- Natural-language chat sets the team the user represents and the player they want to acquire.
- Missing information triggers a follow-up question; ambiguous names trigger a clarification request; unknown names produce a clear not-found message. None of these run a search.
- Full player names are not required when the input uniquely identifies a player.
- A player already on the user's roster, or a free agent, is reported as unacquirable rather than searched for.
- Criteria are reflected back and must be explicitly confirmed before any search runs; changing either criterion invalidates that confirmation.
- Trades are two-team, one to three outgoing players for exactly the target player.
- Only trades confirmed valid by the bball-GM engine are displayed; up to 9 initially, with Show more revealing further validated results.
- Results are ordered: 1-for-1, then 2-for-1, then 3-for-1; within a size, closest salary match first.
- Chat and the GUI board always show the same state.

Out of scope (per the Human Plan): multi-team trades, packages over three players, draft picks, free agents, sign-and-trades, basketball-value ranking, explanations for rejected trades, and commands that manipulate an existing result set.

---

## 2. Three-tier strategy

| Tier | LLM | bball-GM | What it proves | Command |
|---|---|---|---|---|
| 1 | scripted | fixture | Deterministic, CI-safe: the whole application pipeline minus nondeterministic externals | `npm test` and `npm run test:e2e` |
| 2 | scripted | **real** | Real validation integration; catches API schema drift | `npm run test:e2e:tier2` |
| 3 | **real Claude** | **real** | Prompt quality, tool comprehension, real conversation | Manual, §4 |

Production and displayed trades always use the real bball-GM API. The fixture engine exists only so Tier 1 is deterministic.

---

## 3. Automated checks

### Tier 1 — unit (Vitest, 100 tests)

```bash
npm test
```

Covers, by file:

- **`salary.test.ts`** (10) — product sign contract in both directions, badge labels, API sign normalization, money formatting.
- **`resolve.test.ts`** (14) — team match by city/nickname/abbreviation, player match by full and partial name, ambiguity lists, free-agent detection, roster filtering.
- **`candidates.test.ts`** (15) — exhaustive 1/2/3-player enumeration, ordering by size then salary proximity, determinism, and that the pre-filter removes only provably-invalid packages.
- **`state.test.ts`** (13) — criteria invalidation, result clearing, reveal caps, and the monotonicity rule that results never shrink on infrastructure errors.
- **`validation.test.ts`** (13) — fill-to-9 across batches, partial results on time-budget exhaustion, unavailability flagging with earlier results preserved, failed candidates returned for retry, and correct two-team send/receive routing.
- **`tools.test.ts`** (16) — each tool's success and rejection paths, including that `run_trade_search` refuses to run before confirmation.
- **`harness.test.ts`** (19) — loop iteration, multi-tool turns, the 8-iteration guard, refusal/max-token handling, and that a fresh state snapshot is generated per model call and never persisted into history.

### Tier 1 — end-to-end (Playwright, 9 tests)

```bash
npm run build && npm run test:e2e
```

Runs the real app with `MOCK_LLM=1 MOCK_BBALLGM=1`. Asserts: chat drives state and the board mirrors it; no cards appear before confirmation; cards show both sides plus a salary badge and validity tick; at most 9 initially with Show more revealing more; changing the target clears results and re-requires confirmation; ambiguity, free agents, and unknown players each produce the right message with no search; the tool trail records each state change.

### Tier 2 — integration (Playwright, 3 tests)

```bash
npm run build && npm run test:e2e:tier2
```

Scripted LLM against the **real** engine. Asserts real league data resolves, the real engine yields displayable validated cards with no unavailability error, Show more continues validating the same list, and the real free-agent record is reported as untradeable.

---

## 4. Tier 3 — manual checks against a live deployment

Requires `ANTHROPIC_API_KEY` in `.env.local` (or the Vercel dashboard). Run each numbered step in a fresh session.

> ⚠️ **Synthetic-data gotcha:** in bball-GM's dataset **LeBron James is a free agent with a $0 salary and cannot be traded.** Demos must use rostered stars — Jayson Tatum (Celtics) or Anthony Davis (Wizards).

| # | Step | Expected result |
|---|---|---|
| 1 | Load the app | Split view: chat left, board right. Board shows "not set" for team and target with an empty-court illustration. |
| 2 | Type `I want Anthony Davis` | Assistant asks which team you represent. Target chip fills; team chip stays "not set". No cards. |
| 3 | Type `Boston` | Assistant restates both criteria and asks for confirmation. Board shows the Celtics chip in team colour and status "Awaiting confirmation". Still no cards. |
| 4 | Type `yes` | Status flips to "Confirmed". Up to 9 cards appear, 1-for-1 options first. Chat summarises the count and the top option. Tool-trail chips show `confirm_search` and `run_trade_search`. |
| 5 | Inspect any card | Shows Option #n, the players you send (name, position, salary), Anthony Davis on the receive side, the opposing team, a green **Saved $X** / red **Added $X** / neutral **No salary change** badge, and a VALID tick. Both team colours appear on the card edges. |
| 6 | Click **Show more** | Additional validated cards append below. The existing cards do not change or reorder. No new search runs. |
| 7 | Type `Actually I want Stephen Curry instead` | Target chip changes to Curry, status returns to "Awaiting confirmation", **all cards disappear**, and the assistant asks for confirmation again. |
| 8 | Type `yes` | A new search runs for Curry; cards reflect Golden State as the opposing team. |
| 9 | Type `I want Smith` | Assistant lists the matching players **with their teams** and asks which one. No search runs; the target chip is unchanged. |
| 10 | Type `I want LeBron James` | Assistant explains LeBron is a free agent and cannot be acquired by trade. Target unchanged, no cards. |
| 11 | As Boston, type `I want Jayson Tatum` | Assistant explains Tatum is already on your roster. No search. |
| 12 | Type `I want Zzz Nobody` | Clear not-found message. No search. |
| 13 | Type `Can you do a three-team trade with draft picks?` | Assistant explains that is out of scope for this assistant. |
| 14 | Narrow the window below 1024px | Chat/Board tabs appear; the criteria strip stays visible; cards stack in one column. |
| 15 | Tab through the page | Visible amber focus rings on the input, send button, Show more, and tab switches. |
| 16 | Enable OS "reduce motion", reload, repeat step 4 | Cards appear without animation; all functionality is unchanged. |

### Validation-outage check (manual)

With the app running, block `bball-gm.com` (hosts file, devtools offline, or firewall) and:

| Scenario | Expected |
|---|---|
| Confirm a search while blocked | No cards. Error card reads exactly *"Trade validation is temporarily unavailable. Please try again later."* with a Retry button. |
| Run a successful search, then block and press **Show more** | **Every previously validated card stays on screen.** The error appears alongside them; nothing is removed. |
| Unblock and press **Retry** | Validation resumes down the same candidate list; the error clears. |

---

## 5. Known gaps — what is not tested and why

- **Tier 3 is manual.** Driving real Claude in CI would be nondeterministic and cost tokens per run. Prompt-behaviour regressions are caught by a human walking §4, not by an automated gate.
- **No visual-regression testing.** The design is verified by eye and by screenshot review; no pixel baselines are stored.
- **Ambiguity phrasing is asserted loosely.** Tests assert that a clarification is requested and that no search runs, not the exact wording, which is model-authored.
- **The fixture engine is a simplification.** It implements a documented salary-matching rule, not the full CBA. That is deliberate: real CBA behaviour is Tier 2's job, and Tier 1's job is determinism.
- **Client-held state is not tamper-tested.** It is trusted by design in this MVP and is explicitly not a security boundary; a hardened build would move state server-side.
- **No load or concurrency testing.** Out of scope for a prototype.
- **Roster and salary data are synthetic.** Real-world player/team assignments will not match; this is a property of the bball-GM dataset, not a defect.
