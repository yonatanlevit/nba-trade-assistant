# Gambit HAPI Onboarding Task

**Author:** Ido Cohen, Gambit Labs  
**Read in order:** Part 1 → Part 2 → Part 3 → Delivery

This document is self-contained. Everything you need to understand the method, learn the tools, and complete the task is in this repository.

---

# Part 1 — The HAPI Flow

## Why this exists

Gambit builds AI products to improve team building and shared decision-making for organizations. That only works if people have a shared model for how humans and AI work together — not as a novelty, but as the operating system for how we ship.

We believe the future of product teams is not "humans vs. AI" or "AI replaces humans." It is **Human & Artificial Planning Intelligence** — humans owning judgment and quality, AI owning the heavy lifting in between. We call this the **HAPI Flow**.

## The pipeline

> **Idea/Task → Human Thinking → Human Plan → AI Plan → AI Execute → Human Guidance → AI PR → AI Review → Human Review & QA → AI Deploy**

**Humans own thinking, direction, and the quality bar.**  
**AI owns the heavy lifting in between.**

Fast iteration, clear plans, and real end-to-end checks are what make **fast delivery — with human and AI quality** — possible. Speed without the quality bar is just noise. Quality without speed is a team that can't learn.

## The 10 stages

Each stage below is the guide. Read the *what it means* — that is where judgment lives. **Who leads** is a one-line reminder of ownership, not the point.

---

### 1. Idea / Task
*Team*

A problem worth solving surfaces — from a customer call, a competitive insight, a bug, or a design question. Capture it with enough context that someone picking it up cold understands the *why*, not just the *what*. If you cannot state the problem in one sentence, you are not ready to plan.

---

### 2. Human Thinking
*Human*

Frame the problem before anyone touches a keyboard. Decide what we are building and why — product judgment, architecture calls, trade-offs. Make sure you understand both the problem *and* the solution direction you are offering. This stage is where human expertise is irreplaceable: the AI will execute brilliantly on a wrong frame.

---

### 3. Human Plan
*Human*

Set scope, acceptance criteria, and priorities *before* code. The human plan is the contract. **A clear Goal is the most important part** — without it, the AI will confidently lead you somewhere else. Your human expertise matters most here. Ask yourself: *why am I the right person to plan this?* What do I know that the agent does not? Write that down.

---

### 4. AI Plan
*AI — human approves*

Turn the contract into an implementation plan: files, steps, risks, test commands. The agent proposes; you approve or correct. Make sure your expertise from Human Plan is passed to the agent in a form it can use — context docs, constraints, examples of what "done" looks like. Never skip approval; an unreviewed AI plan is a plan you did not own.

---

### 5. AI Execute
*AI — human steers*

Write code, docs, prototypes — on a branch, against the approved plan. This is where throughput happens. Stay available: execution without steering drifts. You are not watching for mistakes only; you are watching for *goal drift*.

---

### 6. Human Guidance
*Human*

Course-correct in real time. "Not that." "Keep the regression test." "Route the pick to Boston instead." Follow the goal you set in Human Plan — do not let a clever implementation pull you off course. Guidance is not micromanagement; it is holding the quality bar and the direction while the agent moves fast.

---

### 7. AI PR
*AI*

Test. Commit. Open the pull request. Populate the description with the Human Plan, the AI Plan, and the Goal — so reviewers inherit the full thread without an archaeology session. A PR without context is a PR someone else has to reverse-engineer.

---

### 8. AI Review
*AI*

Address review threads, summarize what changed, re-run checks. The agent does the tedious loop; you decide when the loop is done. AI Review prepares the work for human judgment — it does not replace it.

---

### 9. Human Review & QA
*Human*

Approve the merge. Run sanity and integration checks. Own the quality gate. If something feels wrong but you cannot name it, that is a signal to pause — not to merge and hope. This stage is non-delegable.

---

### 10. AI Deploy
*AI — human gates*

Build, deploy, smoke-test — when the human says go. Automation handles the steps; the human holds the trigger. Shipping is a decision, not a side effect of green checks.

---

## How we think about roles

Job titles don't define how you work. **Archetypes** do:

| Archetype | What you do |
|-----------|-------------|
| **Prototyper** | Explore brand-new ideas; many drafts, most don't ship |
| **Builder** | Turn a prototype or spec into production-grade product or infra, fast |
| **Sweeper** | Simplify, unship, optimize — make the system smaller and clearer |
| **Grower** | Iterate on shipped product to improve product-market fit |
| **Maintainer** | Keep mature systems secure, reliable, and fast at scale |

Most people span two or three archetypes. A healthy team needs a mix — and the mix shifts as the product matures.

**This onboarding task is Prototyper work** — explore boldly. The deliverable informs direction; it does not have to ship verbatim to production.

## What we believe

1. **Humans set direction; AI scales execution.** The quality bar is human. The throughput is AI-assisted.
2. **Plans before code.** Human Plan and AI Plan are separate stages for a reason. Skipping planning is how teams lose the thread.
3. **Real QA, not checkbox QA.** Exercise the running system — not just unit tests.
4. **Honest about the gap.** Name what's real today and what's still maturing. Vision without honesty is marketing.

---

# Part 2 — Claude + Git learning primer

Before the task, get comfortable working with an AI coding partner and Git. These materials were built for a workshop on Claude + Git for product teams.

**Time box:** half a day. Don't try to master every feature — enough to start Part 3 with confidence.

## Materials (in this repo)

Read in this order:

1. **Git workshop presentation (start here)** — branches, commits, PRs, and working with AI on Git  
   [`git-workshop.html`](./git-workshop.html) — open in a browser (`open git-workshop.html` on macOS)

2. **Claude + Git learning guide** — Claude Projects, skills, git primer, workshop replay  
   [`gambit-claude-guide.md`](./gambit-claude-guide.md)

3. **Workshop exercises** — handouts, cheat sheet, sample repos to practice on  
   [`claude-git-workshop/`](./claude-git-workshop/) — start with [`claude-git-workshop/09-student-syllabus.md`](./claude-git-workshop/09-student-syllabus.md) and [`claude-git-workshop/05-cheat-sheet.md`](./claude-git-workshop/05-cheat-sheet.md)

4. **Anthropic's official course (recommended)** — Claude Code in Action  
   https://anthropic.skilljar.com/claude-code-in-action

## Minimum git reflexes before you start

- **Branch per task** — never work directly on `main`
- **Commit small and often** — especially before risky AI turns (`git reset --hard HEAD` is your safety net)
- **Read the diff before you push** — if you can't explain a file change in one sentence, ask why
- **PRs tell a story** — include what you planned, what the AI planned, and what you built

## Minimum Claude reflexes before you start

- **Start in plan mode** for anything non-trivial — read-only until you approve direction
- **Push back** — the first AI answer is a draft, not a deliverable
- **Write decisions down** — context resets between sessions; plans belong in files, not chat history
- **End every working session with a handoff file** — see `docs/end-of-session.md` in Delivery; this is how you pause mid-task and pick up with another model or agent later
- **Use a Claude Project** for the onboarding task — upload this document and any reference material you gather

---

# Part 3 — The onboarding task

## Chat-first interface over a trade-builder GUI

### Background

[bball-GM.com](http://bball-gm.com) ("NBA Trade Machine") is a conventional GUI trade builder: pick teams, click players and picks onto each side, the app validates and shows a verdict with salary math and CBA citations.

**Use the live site** — build a few trades yourself. The exercise is about the *interaction model*, not re-deriving trade rules.

**Reference:** [`bball-gm-engine-teardown.md`](./bball-gm-engine-teardown.md) — how bball-GM's API and GUI work (request/response schema, what the verdict UI shows). Read this before designing your chat interface.

### The exercise

1. **Learn the site** — build a few trades in bball-GM's GUI. Notice how mouse clicks map to state (teams, players, picks, routing).
2. **Design and build** a **chat-first interface** that replaces mouse-driven interactions with conversation:
   - User describes a trade in natural language.
   - Trade-builder state fills in automatically (teams, players, picks, routing).
   - GUI updates live as a **mirror** of conversation state — not the primary input.
   - User keeps chatting to refine ("route the pick to Boston instead"); GUI tracks every change.
3. **The harder design problem:** outputs the GUI shows must also appear **in chat**, naturally — verdict, per-team salary math, CBA citations, violation reasons. Think concretely about *how*: plain text, inline cards, a mix, when to summarize vs. show full detail — not "render as JSON."

**North star:** the mouse becomes optional. The GUI stays a live visual mirror; conversation is primary.

### Required: build an LLM harness (agentic pipeline)

This task is **not** a single prompt. The core of what we're evaluating is that you can build an **LLM harness** — an agentic pipeline that wraps the model API behind a **tool layer** — and route the natural-language understanding (NLU) through it.

Concretely, your solution must:

- **Wrap your LLM API calls in a harness you control** — one place all model calls go through, owning the system prompt, message history, and trade state. Not scattered raw SDK/`fetch` calls.
- **Expose the trade-builder operations as tools the model calls** — e.g. `set_teams`, `add_player`, `add_pick`, `route_pick`, `request_verdict`. The model turns a user message into tool calls; *your* code executes them against the trade state.
- **Do the NLU through the tool-calling loop** — natural language → structured trade intent happens via the model choosing tools, **not** hardcoded string parsing and **not** one mega-prompt that returns final JSON.
- **Run an agentic loop** — model → tool call → tool result → model, repeating until the turn resolves (e.g. build the trade, call `request_verdict`, then explain the result in chat).

**Why:** Gambit builds agentic products. We care that you can design a clean **harness + tools boundary** — the model reasons, your tools do the deterministic work — far more than whether you can write one clever prompt. This is the part we look at hardest.

You may use any model provider and any harness/agent library (or hand-roll one) — the design of the tool boundary and loop is what matters, not the SDK.

### What to think about (Human Thinking / Human Plan)

This problem is **effectively endless** — full chat architecture, every edge case, production-grade explainability, automated QA at scale. **Don't try to boil the ocean.**

Choose a **chat MVP that feels interesting to you** — one slice where you can show the **main concept** clearly. In your Human Plan, name what you're deliberately *not* building and why.

At minimum, think through:

| Lens | Questions to answer in your plan |
|------|-------------------------------|
| **Harness & tools** | What is your harness responsible for, and what tools do you expose? How does a message become tool calls that mutate trade state? How do you handle multi-step turns, tool errors, and the model asking for a verdict? *(A tool-calling agentic loop is required — see above.)* |
| **Features** | What's in your MVP vs later? (e.g. two-team only, no picks, sign-and-trade out of scope) |
| **Explainability** | When the user asks "why is this illegal?" — what do they see? Can they follow the reasoning without reading raw API JSON? |
| **Traceability** | Can you reconstruct *what changed* after each chat turn? Is there a visible trail from "user said X" → "state updated Y" → "verdict Z"? |

You don't need to solve all of this in code — but your design write-up and demo should make your choices **legible**. Gambit cares about products users can **trust and audit**, not black-box chat.

### How to run it (HAPI Flow)

| Stage | You | AI |
|-------|-----|-----|
| Idea / Task | Accept this brief | — |
| Human Thinking | Scope your chat MVP; note architecture, explainability, traceability | Ask up to 5 clarifying questions before designing |
| Human Plan | Write your plan: scope, goal, acceptance criteria, out of scope | — |
| AI Plan | Approve or correct | Propose the **harness + tool schema**, architecture, stack, file layout, deployment approach |
| AI Execute | Steer on edge cases (multi-team trades, illegal trades, chat/GUI desync) | Build the **harness (tool-calling loop)**, NLU tools, chat UI, state sync, and deployment config |
| Human Guidance | Hold the quality bar — "show money math in chat", "don't hide illegal verdicts" | Iterate |
| *(session handoff)* | When pausing or switching agents: write `docs/end-of-session.md` | Use the handoff file to resume without re-explaining everything |
| AI PR | Review | Open PR *in your own repo* with Human Plan + AI Plan + end-of-session in the description |
| Human Review & QA | Run your QA plan; test the deployed app; review the PR diff | Address feedback |
| AI Deploy | Approve go-live | Deploy to your chosen free host |

### Out of scope

- Building a trade-legality engine from scratch (use bball-GM's public API or mock validation for the prototype — this is the **interaction layer**). Your `request_verdict` tool can delegate legality to bball-GM rather than reimplementing CBA rules — the harness wraps *your* pipeline, the tools do the deterministic work.
- Production-grade CBA rule coverage

### Reference materials

| Resource | Purpose |
|----------|---------|
| [`bball-gm-engine-teardown.md`](./bball-gm-engine-teardown.md) | bball-GM API + GUI reference for the exercise |
| [bball-GM.com](http://bball-gm.com) | Hands-on GUI experience |

---

# Delivery

When you are done, submit **two things**:

## 1. Deployed LLM chat app

A working chat interface deployed on a **free-tier host** (Render, Railway, Vercel, or similar). The URL must be publicly reachable so reviewers can try it without cloning anything.

Minimum behavior:
- User can describe a trade in natural language
- Trade-builder state updates (teams, players, picks) — real or mocked data is fine
- A GUI panel mirrors chat state live
- Verdict / validation output appears in **both** chat and GUI

Include the live URL in your PR description.

## 2. Pull request — in your own repo (created from this template)

**This repository is a GitHub _template_.** Do **not** fork it, and do **not** open a pull request against it. Instead, work in your own copy:

1. On the repo page, click **“Use this template” → “Create a new repository.”** Give it your own name and keep it **public**.
2. Clone *your* new repo and do all your work there, on a **feature branch** (never commit straight to `main`).
3. Open a **pull request inside your own repo** — your feature branch → your repo's `main`.
4. Send us the **link to that PR** (plus the live demo URL).

> ⚠️ Work only in your own copy. Do **not** open a pull request against `gambit-lab/gambit-hapi-onboarding` — those will be closed. Each candidate works in isolation.

Your PR should contain:

| Artifact | Location | Purpose |
|----------|----------|---------|
| **Human Plan** | `docs/human-plan.md` | Your goal, scope, acceptance criteria, UX principles — written *before* heavy AI execution |
| **AI Plan** | `docs/ai-plan.md` | The implementation plan you approved (stack, files, risks, test approach) |
| **End of session** | `docs/end-of-session.md` | Handoff snapshot of the human ↔ AI working session — so another agent/model can pick up where you left off |
| **QA plan** | `docs/qa-plan.md` | How you would verify the app works — manual checks and/or automated browser-agent tests |
| **Application code** | project root | The chat app source |
| **README** | `README.md` | How to run locally, how you deployed, architecture overview, link to live demo |

### `docs/end-of-session.md` — session handoff (required)

Chat context disappears when a session ends. A new agent (or a different model) starts cold unless you **write the working session down**.

This file is **not** a full chat transcript. It is a curated handoff — the minimum context needed to continue the task without archaeology. Update it whenever you pause meaningful work or finish a session; the final version is part of delivery.

Include:

- **Goal** — one sentence; link to Human Plan
- **Current status** — what's done, what's in progress, what's blocked
- **Key decisions** — choices you and the AI made during the session (and *why*)
- **Human guidance given** — corrections, constraints, quality-bar calls ("not that", "keep X", "show Y in chat")
- **Open questions** — unresolved design or implementation questions for the next session
- **Where to continue** — files, branches, commands, deployed URL if any
- **Do not regress** — things the next agent must not undo or reinterpret

Think of it as **saving a task mid-flight** — the same way HAPI Flow treats plans as files, not chat memory.

**Template:**

```markdown
# End of session — <date>

## Goal
<link to human-plan.md — one sentence>

## Status
- Done: …
- In progress: …
- Blocked: …

## Key decisions (this session)
- …

## Human guidance given
- …

## Open questions
- …

## Continue from here
- Branch: …
- Files: …
- Commands: …
- Demo URL: …

## Do not regress
- …
```

### `docs/qa-plan.md` — how you would QA this (required)

A **QA plan** is a written checklist of how to verify the product actually works in a running environment — not unit tests in isolation, but **does the deployed chat MVP behave correctly end-to-end?**

At Gambit, QA plans gate shipping: humans own the quality bar; the plan says what "pass" looks like before you merge.

Your plan should cover **both** (you can lean harder on one):

| Approach | What it means | Example for this task |
|----------|---------------|----------------------|
| **Manual QA** | A human walks through the live demo with a checklist | "Type 'Boston gets Tatum for Butler' → GUI shows both teams → verdict appears in chat and panel → illegal trade shows violation text, not silent failure" |
| **Automated QA (browser agent)** | A script or AI agent drives the browser and asserts outcomes | Playwright/Cypress test, or an agent that opens your deployed URL, sends chat messages, and checks DOM/state; note what you'd automate vs what still needs human judgment |

Include in `docs/qa-plan.md`:

- **Scope** — what your MVP claims to support (tie to Human Plan)
- **Manual checks** — numbered steps a reviewer can run on your live URL; expected result for each
- **Automated checks** (if any) — what you'd run in CI or locally; commands or pseudocode is fine
- **Known gaps** — what you are *not* testing and why (honest scoping)

You do **not** need a full CI pipeline — but you **do** need a credible plan. Bonus: ship one automated check that proves chat → state → GUI sync on a happy path.

### PR description template

```markdown
## Live demo
<URL>

## Human Plan summary
<2-3 sentences>

## AI Plan summary
<2-3 sentences>

## Session handoff
Point to `docs/end-of-session.md` — what state you left the work in

## QA approach
<manual vs automated — link to docs/qa-plan.md>

## What I learned about HAPI Flow
<short reflection — what worked, what you'd do differently>

## How to run locally
<commands>
```

### Acceptance criteria

- [ ] **Human Plan**, **AI Plan**, **`docs/end-of-session.md`**, and **`docs/qa-plan.md`** committed as separate docs
- [ ] **README** explains the project clearly enough for a stranger to run it
- [ ] **Deployed URL** works — chat → state → GUI mirror → verdict in both places
- [ ] **LLM harness** — natural language becomes trade state through a **tool-calling agentic loop** (tools like `set_teams` / `add_player` / `route_pick` / `request_verdict`), **not** hardcoded parsing or a single JSON-returning prompt
- [ ] **Design notes** in Human Plan or README cover:
  - Harness & tools — the tool boundary you designed and how the agentic loop runs a turn
  - Interaction model — what a chat turn does to state
  - Sync — how chat-state and GUI-state stay aligned
  - Output presentation — with **concrete examples** of a verdict rendered in chat
  - **Explainability & traceability** — how users see *why* and *what changed*
  - **MVP scope** — what you chose to build and what you explicitly deferred
- [ ] **QA plan** lists runnable manual checks against the live demo (and automated checks if you built any)
- [ ] **Bonus:** uses bball-GM's real validation API instead of mocks
- [ ] **Bonus:** one automated browser test on the happy path

---

## Feedback

If these materials helped — or didn't — we'd love to hear it. Mention what was missing when you open your PR.

*Gambit Labs · HAPI Onboarding · 2026*
