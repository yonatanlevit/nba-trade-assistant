# Claude Code for Product Teams — 4-Hour Workshop (v9)

> **Audience:** Product Managers and Product Designers — 40 people in 10 pods of 4 (1 experienced + 2 mid + 1 beginner per pod).
> **Format:** Pod-based learning. 30-min Context block + three hands-on Parts. Demo → independent pod work → instructor walks the room. Capped with a graduate panel and a "what's coming next" closing.
> **Surface:** **Claude Desktop app** for everyone. Cowork is demoed (not used hands-on) in Part 1; Claude Code is the hands-on tool for Parts 2-4.
> **Promise:** By 21:00, every participant has the first 3 entries of a **team Claude Code library** saved in `.claude/skills/`, knows when to reach for Cowork instead, has seen what their peers are shipping in production, and has one Friday commitment in their pocket.

---

## What's new in v9 (vs v8)

**Added Part 1 — Context (30 min).** Replaces the v8 "why Claude Code" keynote with a context-setting block: modern PM expectations, the Claude family of products (Claude.ai vs Claude Desktop's Cowork mode vs Claude Code vs API), a live Cowork demo (research synthesis on customer feedback), and a decision tree for when to use what.

**Why this exists:**
- A participant got stuck two days before the workshop because they tried to "list files in this folder" with the regular Claude Desktop chat tab — they didn't know Claude Code is a different tab. The Context block addresses this confusion before they touch their laptops.
- Other participants asked whether the workshop is based on Cowork. The Context block answers that explicitly: "Cowork is for daily knowledge work. Claude Code is for code-grounded work. Today is Claude Code, but here's what Cowork does so you know when to reach for it instead."
- The v8 keynote was 30 min of "why this tool" advocacy. The v9 Context block is 30 min of "where you fit and what's available" framing — better suited to mixed-level audiences.

**Hands-on Parts unchanged.** Parts 2-4 are the v8 Parts 1-3 verbatim. Same exercises, same skills saved, same pod dynamics, same arc (Explore → Constrain → Collaborate). They've just shifted from "Part 1/2/3" to "Part 2/3/4."

**Cowork demo is demo-only.** No pod work in Cowork. Shmulik runs a 5-7 minute live demo (research synthesis on the workshop's `feedback.csv` from Part 4) so participants see the product, then we move into Claude Code as the workshop's center of gravity.

## What's new in v8 (vs v7)

Eight changes informed by reviewer feedback on v7. Six clear wins, two modified-applies, three pushed-back-on (and held).

**Applied:**
1. **Explore / Constrain / Collaborate framework.** Each Part now has a one-word framing keyword. The framework lands in the keynote (Slide 8), echoes through Part frame slides (11, 16, 21), and resurfaces in the closing. People remember frameworks, not sessions.
2. **Forced-failure moment in Part 3 demo.** The first 3 minutes of the Part 3 demo deliberately show Claude inventing tokens and ignoring primitives. Pods see the failure mode before learning the discipline. Anchors the system-first vigilance far better than a positive-only demo.
3. **The Pushback Playbook on the cheat sheet.** Six concrete prompts beginners can copy ("Show me where this is true," "What assumptions are you making?"). Briefly mentioned in the keynote (Slide 9).
4. **"What NOT to use Claude Code for" closing slide** (Slide 28b, ~60 sec). Pairs with v6's scope-honesty slide. Inoculates against overgeneralization.
5. **"I will use this skill when ___" reflection** in all three share-backs. Pods write one concrete trigger before sharing. Ties artifact → behavior.
6. **Floater fallback recipes** (new file: `10-floater-fallback-recipes.md`). Per-Part degraded-mode plans for when the Figma MCP fails, git won't clone, or the CSV won't parse.

**Modified applies (the diagnosis was right; the prescription needed adjusting):**
7. **Part 3 scaffold (not scope cut).** A 3-line PRD template skeleton at `docs/prd-template.md` reduces blank-page anxiety without removing the round-trip. Plus an explicit "skip Role 3 honestly before faking it" guardrail. Preserves the workshop's emotional peak while acknowledging time pressure.
8. **The Challenger role for advanced participants.** Pod rule #3 reframed: experienced participants drive the pushback, not the keyboard. Redirects their energy from typing to critiquing. Positive role, not punitive constraint.

**Held against reviewer feedback:**
- Keynote length stays at 30 min. The platform map (4 min on Slide 5) prevents 2 hours of confusion later. Will trim only if dry runs consistently exceed 32 min.
- Floater count stays at 2. With 10 advanced pod members + 2 floaters + instructor, we're already at 13 troubleshooters in the room. Sharpening the floaters' role with the new fallback recipes is the right move, not adding more bodies.
- Slide 5 (platform map) stays at full depth. It's load-bearing for participants understanding what they're choosing not to use.

## What's new in v7 (vs v6)

**Part 1 redesigned for progressive load.** The SSO scoping exercise was the workshop's hardest task and ran first — backwards from a learning-design perspective. A true beginner faced auth/OAuth/feature-flag vocabulary on minute 1.

**Replaced with: Product Audit.** Same 4-step pattern (Survey → Push back → Audit → Self-critique). Same code-grounded discipline. Different topic: *"You just joined the InvoiceFlow team. The CEO wants a 1:1 in 30 minutes. Produce a 1-page audit."*

**Why this works:**
- "What does this app do?" is a question every PM has asked their first day at every job. No specialized vocabulary.
- Fast first success — Claude's first answer lands in ~30 seconds and is genuinely useful. Beginners get a confidence win.
- Still teaches code-grounded scoping (audit must reference real files, name evidence).
- Universal workflow — saved skill (`product-audit.md`) is more reusable than `feasibility-scout.md` was.

**The cognitive arc the workshop now has:**
- **Part 1:** "Wow, Claude can read code." (accessibility win)
- **Part 2:** "Wow, Claude connects to my tools." (integration win)
- **Part 3:** "Wow, this changes how I think about my whole job." (craft win)

The SSO exercise is preserved as a Track-C stretch task for advanced participants who finish the audit early.

## What's new in v6 (vs v5)

Four fixes from the competitive comparison against established 4-hour and short-format AI workshops for PMs (General Assembly, BrainStation, Mind the Product, Scrum Alliance, Product School, Marily Nika, Carl Vellotti, Aman Khan):

1. **Added a "What this workshop is NOT" slide** in the keynote (Slide 7b). 60-second scope-honesty moment naming three deliberate exclusions: AI ethics/bias, evals/observability, multi-tool coverage. Inoculates against the "you didn't cover X" objection that plagues most AI-for-PM workshops.

2. **Multi-perspective subagents promoted from Part 3 buried teaser to Part 1 visible demo.** A 60-second moment at the end of the Part 2 demo shows 3 subagents (Engineer / Executive / Designer) critiquing the same scope in parallel. This is the signature Claude Code-for-PMs pattern in the market; it now lives where every participant sees it, not just Track-C.

3. **Output transformation moment in Part 4 demo.** A 2-minute extension showing how the revised PRD becomes an exec one-pager, a Slack post, and release notes — all in the same Claude session. Plants a real PM superpower (one spec → four formats, no copy-paste). Pod work in Part 3 absorbs the 2-min cost — 23 min instead of 25.

4. **Tool-portability inoculation in the closing.** One sentence on the trajectories slide acknowledging the "won't this be obsolete?" concern: *"Plan mode, CLAUDE.md, skills, MCP — concepts the whole industry is converging on. The patterns transfer to whatever tool wins in 2027."*

## What's new in v5 (vs v4)

**The whole workshop is now run on the Claude Desktop app, not the CLI.** Reasoning: the audience is PMs and designers, mostly beginners. The Desktop app removes the terminal tax — visible file tree, plan sidebar, one-click mode toggling, MCP through a settings GUI. Every pattern we teach (plan mode, CLAUDE.md, skills, MCP) works identically on the Desktop app. CLI and IDE extensions are mentioned as "what advanced participants might use after the workshop" — patterns transfer 1:1.

The skills participants save during the workshop are portable across all three flavors, so this is a beginner-friendly entry point, not a permanent commitment.

## What's new in v4 (vs v3)

Two changes informed by a competitive read of the established Claude Code courses for PMs (Carl Vellotti, Aman Khan, Product School, et al.):

1. **Part 3 starts with customer feedback synthesis.** Instead of inventing a feature ("add CSV export"), pods scan `workshop-data/feedback.csv` for the top theme, define the feature that addresses it, then run the PRD round-trip on it. Same skill saved (`prd-round-trip`), same time budget — but the workshop now exercises the universal "research synthesis" muscle that every PM uses Claude Code for first.

2. **Skills are reframed as "your team library," not personal scratch files.** The 3 saved skills are explicitly the seeds of a shared team library — like a shared component library, but for prompts and workflows. This connects to where the industry is going (Aman Khan's "Every PM Should Be Building Skills"; Ron Yang's "Build Your PM Operating System on Claude Code") and turns the workshop's deliverable into something with a longer half-life than a Monday commitment.

## What's still true from v3

The "deliverable shape" of every Part is a **skill** — a `SKILL.md` file the participant saves. This is the workshop's central artifact.

> **The 1-sentence frame for the room:** *A skill is a working prompt you saved so your team can run it again next week without thinking.*

That's all the teaching needed. No separate skills module. By the end of each Part, every pod saves what just worked into `.claude/skills/`. Three Parts = three skills = the first three entries of a team library.

The starter repo ships with template versions of all three so beginners modify, advanced people rewrite from scratch.

---

## Workshop goals

By the end of the session, every participant can:

1. Use Claude Code to **audit an unfamiliar product** and produce a 1-page brief with real evidence — and save the pattern as a reusable skill.
2. Use Claude Code with **Figma + a design system** to translate design into working code — and save it as a reusable skill.
3. **Synthesize real customer feedback** into a feature definition, then run a **PRD round-trip** — PM ↔ Dev ↔ PM — entirely inside Claude Code, and save it as a reusable skill.
4. Place Claude Code correctly in their stack (vs. Claude.ai, Cursor, Lovable, v0, Codex).
5. Walk out with 3 skills, 1 cheat sheet, and 1 commitment for Friday.

---

## Room setup

- **10 pod tables of 4** (2 tables joined into a square).
- Each pod is pre-assigned: **1 experienced + 2 mid + 1 beginner**.
- Pod assignments emailed 24h before based on the pre-flight skill survey.
- Big screen visible from every pod showing Shmulik's Claude Desktop app.
- Floaters: **2 tech-support people** (not teaching assistants) — their job is environment fixes only.
- Sticky notes + markers at every table.

---

## Pre-requisites

See `05-pre-flight-page.md` for the full pre-workshop content. Summary:

- Laptop, Claude Pro account, Claude Desktop app installed and signed in, Git installed, GitHub account, Figma account.
- Authentication: Pro ($20/mo) recommended; API pay-as-you-go with $5 free credit also works for a single workshop.
- Pre-flight script run, green checkmark posted in the WhatsApp room before arrival.
- Skill survey completed (drives pod assignments).
- Optional: bring a real artifact from current work (a stuck PRD, a Figma file, a feature being scoped).

---

## What you (Shmulik) bring

- **Sample repo** — `braightwave/claude-code-pm-starter` on GitHub. See `08-sample-repo-spec.md`.
- **Sample Figma file** with a small design system (tokens, 5-10 components, a few screens) for Part 2.
- **Synthetic data files** — `feedback.csv` (200 rows EN+HE), `events.json`, `tickets.json`.
- **Slide deck** — see `workshop-deck-content.md` (one unified deck, 31 slides covering all 4 hours).
- **Cheat sheet** — see `04-cheat-sheet.md`.
- **Slack/Discord channel** for post-workshop continuity.

---

## The 4-hour agenda

```
17:00–17:10   Pod intros (10 min)
17:10–17:40   PART 1 — Context: Modern PM, Claude family, Cowork demo (30 min)
17:40–18:30   PART 2 — Explore: Onboard to a new product → save as skill (50 min)
18:30–18:40   ☕ Break (10 min)
18:40–19:30   PART 3 — Constrain: Figma + Design System → save as skill (50 min)
19:30–19:40   ☕ Break (10 min)
19:40–20:30   PART 4 — Collaborate: PRD round-trip → save as skill (50 min)
20:30–20:50   Graduate panel: 4 voices from the field (20 min)
20:50–21:00   Closing: What's coming this year (10 min)
```

---

### 17:00–17:10 — Pod intros (10 min)

- Each pod: round of 4, 60 seconds each. Format: name → role → one product they ship → one thing they want from today.
- The "one thing" gets written on a sticky note and posted on the table. Shmulik scans the wall during Part 1 and references real ones in his examples.

---

### 17:10–17:40 — PART 1: Context (30 min)

**Goal:** Set the frame for everything that follows. By 17:40 every participant knows what's expected of a modern PM, what the Claude family of products looks like, what Cowork does (live demo), and the decision rule for when to use Cowork vs Claude Code.

| Time | Block |
|---|---|
| 0–3 | Welcome + the day's arc (Slide 3) |
| 3–10 | The modern PM — what's expected of you in 2026 (Slide 4) |
| 10–13 | The Claude family in plain English (Slide 5) — Claude.ai vs Claude Desktop's Cowork mode vs Claude Code vs API |
| 13–16 | **Why Claude Code, specifically, tonight** (Slide 5b) — three-reason credibility punch (long-horizon agentic, plan-mode safety, skills-as-team-library). The honest "other tools are catching up" closing. |
| 16–23 | **Cowork live demo** (Slide 6) — Cowork reads `feedback.csv`, produces a 1-page synthesis with top themes and quotes |
| 23–26 | When to use what (Slide 7) — decision tree: Claude.ai for thinking, Cowork for knowledge work, Claude Code for code-grounded work |
| 26–30 | Bridge: "What this workshop is NOT" (Slide 7b) → Three relationships frame (Slide 8) → 5 pod rules (Slide 9) → Framing line (Slide 10) → Part 2 frame (Slide 11) |

**The Cowork demo specifics:**
- Shmulik clicks the **Cowork tab** in Claude Desktop (not Code tab — Cowork is the parallel surface).
- Drops a folder with the workshop's `feedback.csv` (200 rows of customer feedback, English + Hebrew, mixed sentiment).
- Asks: *"Synthesize this customer feedback into a 1-page report — top 3 themes by impact, with representative quotes."*
- Talks through what Cowork is doing while it runs (60-90 sec). Shows the output. Doesn't dwell.
- **Backup plan:** if Cowork is slow or fails live, play a pre-recorded 30-second screen recording of a successful run. **Test this before the workshop.**

**Why the Cowork demo uses the same `feedback.csv` Part 4 will use:**
- Plants thematic continuity. When pods reach Part 4 and see the same file, they recognize it. The implicit teaching: "Cowork can synthesize this. Claude Code can synthesize THIS *and* turn the synthesis into a working PRD against your real codebase. That's the difference."
- Saves preparation time — only one CSV needed.

**What this Part deliberately does NOT do:**
- No pod work. Pods watch and listen. The hands-on starts in Part 2.
- No Cowork installation drama — Cowork is in Claude Desktop, which everyone has installed.
- No "5 power moves" list (that was v8 keynote content; in v9 those features are introduced contextually as Shmulik uses them in the Part 3 demo).

---

### 17:40–18:30 — PART 2: Explore — Onboard to a new product (50 min)

**Goal:** Every pod uses Claude Code to audit an unfamiliar codebase as if they just joined the team, and **save the working pattern as a skill**.

| Time | Block |
|---|---|
| 0–5 | Frame: the most common PM pain — *"I just joined a new team. What does this thing actually do, and what should I work on first?"* — and how Claude Code answers it in 10 minutes. |
| 5–19 | Live demo (14 min): Shmulik walks through plan mode + the 4-step grounded audit pattern. **Last 60 sec of the demo:** saves the pattern as `.claude/skills/product-audit.md`. Re-runs it on a different folder in 30 seconds to show payoff. **Plus 60-sec subagent teaser** (Engineer / Executive / Designer audit the same product in parallel). |
| 19–43 | **Pod independent work** (24 min). Shmulik walks the room. Last 3 minutes of pod time: save the skill. |
| 43–50 | 2-3 pods share their audit (highlights — three quick wins, three questions for the CEO) AND read their saved skill aloud. |

**The realistic task:**

> *"You just joined the InvoiceFlow team. The CEO wants a 1:1 in 30 minutes. You've never seen the product before. In 24 minutes, use Claude Code to produce a 1-page audit you can bring to that meeting:*
> *1. What this product is — 1 paragraph.*
> *2. Every user-facing feature — 1 sentence each, plus the file or folder where it lives.*
> *3. Three things that look half-built or buggy — with evidence.*
> *4. Three quick-win opportunities (shippable in a sprint) — with the files that would change.*
> *5. Three questions for the CEO.*
> *Then save the working pattern as a skill."*

**Why this is the right Part 2 task:**
- **Beginner-drivable.** "Tell me what this app does" is a question every PM has asked their first day at every job. No specialized vocabulary required.
- **Fast first success.** Claude's first answer to "what does this app do?" lands in ~30 seconds and is genuinely useful. Beginners get a confidence win in the first 5 minutes.
- **Still teaches code-grounded scoping.** The audit must reference real files, not vibes. The "three half-built things" and "files that would change" requirements force the same evidence-based discipline as feasibility scoping.
- **Universal PM workflow.** Every PM uses "audit on arrival" every job. The saved skill is more reusable than a feature-specific scoping pattern.

**The 4-step pattern Shmulik demos:** see `starter-files/.claude/skills/product-audit.md` for the actual prompt.

**Pod dynamics expected:**
- The beginner asks the first question ("Claude, what does this app do?") — they can drive this.
- Mid-level participants take over for the "three half-built things" and "three quick wins" portions, which require more inference.
- The experienced person owns the self-critique step.
- Rotate the keyboard between steps. Everyone touches it.

**Floaters watch for:** Claude Desktop sign-in issues, sample-repo clone failures, slow first-time auth.

**Stretch task for advanced participants who finish early:**
*"Now use the same pattern to scope adding SSO support — Google + Microsoft — to InvoiceFlow's enterprise tier. Should it ship in 4 weeks?"* This is the v6 task, repurposed as Track-C bonus content.

**Deliverable saved by every pod:** `.claude/skills/product-audit.md` (modified from the starter template if they're beginners; rewritten if they're advanced).

---

### 18:30–18:40 — ☕ Break

---

### 18:40–19:30 — PART 3: Figma + Claude + Design System (50 min)

**Goal:** Translate a Figma design into working components that respect a design system — entirely in Claude Code. Save the pattern as a skill.

| Time | Block |
|---|---|
| 0–5 | Frame: the designer's pain — "the engineers built it but it doesn't match the system." How Claude Code closes the loop. |
| 5–20 | **Graduate or Shmulik demo (15 min)** — *strongly prefer graduate.* They show their real Figma file, design system, Figma Dev Mode MCP, and a component that gets generated against the system tokens. End by saving the pattern as `.claude/skills/figma-to-component.md`. |
| 20–43 | **Pod independent work** with the workshop sample Figma file. Last 3 minutes: save the skill. |
| 43–50 | 1-2 pods share their generated component AND their skill. |

**The realistic task:**

> *"Your designer just shipped a Figma file with a new 'invoice line item' component. Your team's design system already lives in `/components/ui` with tokens in `tokens.json`. Use Claude Code with the Figma MCP to generate the component — and make sure it uses the system, not custom values. If it doesn't, push back on Claude until it does. Then save the working pattern as a skill."*

**Skill template:** `starter-files/.claude/skills/figma-to-component.md`.

**Why this lands for designers:** they finally see the gap between "what I designed" and "what's possible in the system" measured by code, not opinion.

**Why this lands for PMs:** they see the cost of design-system drift in real time.

**Deliverable saved by every pod:** `.claude/skills/figma-to-component.md`.

---

### 19:30–19:40 — ☕ Break

---

### 19:40–20:30 — PART 4: PRD round-trip — PM ↔ Dev ↔ PM (50 min)

**Goal:** Synthesize real customer feedback into a feature, then show a complete spec-to-code-to-feedback loop. Save the pattern as a skill. This is where the "what's possible with agents" teaser lives for Track C.

| Time | Block |
|---|---|
| 0–5 | Frame: the everyday PM frustration — "I read 200 customer comments, picked a top theme, wrote a PRD, dev built something different, two weeks gone." Claude Code collapses the whole loop. |
| 5–22 | Shmulik demo (17 min): scan `workshop-data/feedback.csv` for the top theme, define the feature, run the full round-trip end to end. Saves the pattern as `.claude/skills/prd-round-trip.md`. **Last 2 minutes:** ask Claude to transform the revised PRD into an exec one-pager + a Slack post + release notes. *Output transformation moment — plants the "PMs as orchestrators" pattern.* |
| 22–45 | **Pod independent work.** 23 minutes (down from 25 to absorb the longer demo). Last 3 minutes: save the skill. |
| 45–50 | 2-3 pods share what they shipped AND their skill. |

**The realistic task:**

> *"You have 200 rows of real customer feedback at `workshop-data/feedback.csv` (English + Hebrew, mixed sentiment, with theme tags). Run the full round-trip in 23 minutes:*
> *1. **Synthesize:** scan the feedback, find the top theme, define the feature that addresses it.*
> *2. **PM hat:** write the grounded PRD for that feature, against the InvoiceFlow codebase.*
> *3. **Dev hat:** have Claude Code implement it. Review the diff.*
> *4. **PM hat again:** critique the implementation — what's missing, what's surprising, what changes your PRD?*
> *5. Save the working pattern as a skill."*

**Skill template:** `starter-files/.claude/skills/prd-round-trip.md`.

**Why this works:** the workshop now exercises the #1 most-used PM Claude Code workflow (research synthesis) without adding a module. The skill saved is the same. The realism premium is enormous — pods finish having shipped a feature based on actual user voice, not a hypothetical.

**Note on the multi-agent demo (moved from Part 3 to Part 1 in v6):** the Track-C subagents teaser used to live here. It's now a 60-second visible demo at the end of the Part 2 demo (showing 3 sub-agents — Engineer, Executive, Designer — critiquing the same scope in parallel). Same idea, better placement: it lands as a "this is where you go next" moment for advanced participants instead of competing for time in Part 3.

**Why this is the workshop's emotional peak:** every participant has lived the broken PRD loop. Watching it close in 23 minutes is the moment they decide to use Claude Code Monday.

**Deliverable saved by every pod:** `.claude/skills/prd-round-trip.md`.

---

### 20:30–20:50 — Graduate panel: 4 voices from the field (20 min)

**Format:** 4 graduates, each gets 4 minutes (timed), then 4 minutes Q&A from the room.

**Selection (4 different angles):**

1. **The PM** — uses Claude Code daily for codebase Q&A and PRDs. "What changed in my role."
2. **The Designer** — Figma + Claude + design system shipper. (Doubles as the Part 3 demo person if the same.)
3. **The Org adopter** — someone who rolled Claude Code out across a team. "What worked, what didn't, what surprised us."
4. **The contrarian** — someone who tried it and pulled back, or set serious guardrails. Honest critique. **This one is the most important.** Workshops with only success stories ring hollow.

See `07-graduate-brief.md` for the brief sent to each panelist.

---

### 20:50–21:00 — Closing: What's coming this year (10 min)

Full slide-by-slide outline in `workshop-deck-content.md` (Slides 26–31 cover the closing).

End with one line that doesn't sound like a workshop closing.

---

## What participants leave with

- ✅ Claude Code installed, authenticated, used.
- ✅ **The first 3 entries of a team Claude Code library** in `~/.claude/skills/` — `product-audit`, `figma-to-component`, `prd-round-trip`. Forkable. Shareable. The seeds of a team operating system.
- ✅ A 1-page product audit of an unfamiliar codebase (Part 2 artifact).
- ✅ A real component generated from a Figma file against a design system (Part 3 artifact).
- ✅ A complete PRD round-trip artifact built from real customer feedback (Part 4 artifact).
- ✅ Real production patterns from 4 graduates.
- ✅ The 1-page cheat sheet.
- ✅ One Friday commitment, written by their own hand.
- ✅ The Slack/Discord channel for follow-ups.

---

## Open decisions for Shmulik

1. **Sample repo build** — the spec is in `08-sample-repo-spec.md`. Build it yourself, have a graduate build it, or hand it to a developer? Decide this week.
2. **Graduate selection** — who are the 4? Briefs go out 7 days before.
3. **Figma file** — coordinate with the Part 2 graduate so their demo file and the workshop file share enough DNA to be teachable in 5 minutes.
4. **Floater identity** — 2 people, ideally one with strong setup/install skills (Desktop app on Mac and Windows) and one with auth/account skills (Pro vs Max, SSO).
5. **Recording** — recording the keynote, demos, and panel for an on-demand version? Affects setup needs.
6. **Translation** — workshop materials currently in English; if any pods are Hebrew-dominant, we may want a Hebrew variant of the cheat sheet and pre-flight page.

---

## File map

| File | Purpose |
|---|---|
| `01-workshop-plan.md` | This document |
| `04-cheat-sheet.md` | 1-page reference for participants |
| `05-pre-flight-page.md` | Pre-workshop participant content (Notion-ready) |
| `06-skill-survey.md` | Survey for pod assignments |
| `07-graduate-brief.md` | Brief for the 4 panelists |
| `08-sample-repo-spec.md` | Spec for the GitHub starter repo |
| `09-syllabus.md` | Shareable syllabus for colleagues |
| `10-floater-fallback-recipes.md` | One-page fallback playbook for the 2 floaters |
| `starter-files/CLAUDE.md` | Starter CLAUDE.md committed to the sample repo |
| `starter-files/.claude/skills/product-audit.md` | Part 2 starter skill |
| `starter-files/.claude/skills/figma-to-component.md` | Part 3 starter skill |
| `starter-files/.claude/skills/prd-round-trip.md` | Part 4 starter skill |
