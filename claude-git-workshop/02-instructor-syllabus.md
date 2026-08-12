# Claude Code for Product Teams — Workshop Syllabus

> **A 4-hour, hands-on Claude Code workshop for Product Managers and Product Designers.**
>
> **Next cohort:** Thursday, May 7, 2026 · 17:00 – 21:00 · [LOCATION]
>
> Designed and delivered by Shmulik Davar / BrAIght Wave.
>
> Format: in-person, 40 participants, 10 pods of 4. Mixed levels per pod.

---

## Why this workshop exists

Most AI tooling for product teams is still treated as a chat window — copy a question in, copy an answer out. Claude Code changes that mental model: it's an AI agent that runs on the participant's own laptop, reads their real files, edits real code, and connects to real tools (Jira, Notion, Figma, GitHub) through MCP.

This workshop teaches Product Managers and Product Designers how to use Claude Code as a working tool — not to become engineers, but to do their existing jobs (scoping, PRDs, design-system enforcement, customer feedback synthesis) at higher leverage.

By 16:00, every participant walks out with three working **skills** saved in their `.claude/skills/` folder, framed as the first three entries of a team Claude Code library. They've also seen four practitioners share what real production use looks like, including one explicitly contrarian voice.

---

## Audience and prerequisites

**Audience:** Working PMs and product designers, mixed levels:
- Some have never used Claude Code (or any agentic AI tool).
- Some have used Cursor, Lovable, Bolt, or v0 for prototyping.
- A small subset are advanced Claude Code users.

We assemble pods of 4 with **1 advanced + 2 mid + 1 beginner per pod** based on a pre-workshop skill survey. Peer teaching is a load-bearing element of the design.

**Prerequisites (sent 1 week before):**
- A laptop (macOS 13+, Windows 10+, or Linux Ubuntu 20.04+).
- A paid Claude account (Pro $20/mo recommended; Max, Teams, or Enterprise also work). Free tier does NOT include Claude Code.
- Claude Desktop app installed and signed in.
- Git installed and configured (name + email).
- A GitHub account.
- A Figma account with edit access to at least one file.

A separate setup guide walks participants through all of this and includes a verification step (post a screenshot in the WhatsApp room) that runs 5 days before the workshop. By the time anyone walks in, they're green or flagged.

---

## Surface choice — why we use the Claude Desktop app

Claude Code ships in three flavors: Desktop app, CLI (terminal), and IDE extensions. We use the **Desktop app** for the entire workshop because:

- The audience is mostly beginners. Adding "learn the terminal" on top of "learn agentic AI" doubles the cognitive load.
- Every pattern we teach (plan mode, CLAUDE.md, skills, MCP) works identically across all three flavors.
- Skills saved during the workshop are portable — participants who graduate to the CLI later don't lose anything.
- Demos are easier to follow visually: the file tree, plan sidebar, and split-pane views show what Claude is doing in real time.

The CLI and IDE extensions are mentioned in the keynote and cheat sheet as "what advanced participants might use after the workshop." The patterns transfer 1:1.

---

## Workshop goals

By the end of the session, every participant can:

1. Use Claude Code to **explore an unfamiliar codebase and scope a feature** with file-level evidence — not vibes.
2. Use Claude Code with **Figma + a design system** to translate design into working code that respects system tokens, not freelance pixels.
3. **Synthesize real customer feedback** into a feature definition, then run a **PRD round-trip** — PM ↔ Dev ↔ PM — entirely inside Claude Code.
4. Place Claude Code correctly in their stack (vs. Claude.ai, Cursor, Lovable, v0, Codex).
5. Walk out with **3 skills, 1 cheat sheet, and 1 commitment for Friday**.

---

## Format and structure

```
17:00–17:10   Pod intros (10 min)
17:10–17:40   PART 1: CONTEXT — Modern PM, Claude family, Cowork demo (30 min)
17:40–18:30   PART 2: EXPLORE — Onboard to a new product → save as skill (50 min)
18:30–18:40   ☕ Break
18:40–19:30   PART 3: CONSTRAIN — Figma + Design System → save as skill (50 min)
19:30–19:40   ☕ Break
19:40–20:30   PART 4: COLLABORATE — Customer feedback → PRD round-trip → save as skill (50 min)
20:30–20:50   Graduate panel: 4 voices from the field (20 min)
20:50–21:00   Closing: What's coming this year (10 min)
```

**Pedagogical principle:** Part 1 sets context (no pod work). Parts 2-4 each follow the same shape — short demo (10–15 min) → independent pod work (~25 min) with the instructor walking the room → share-back from 2-3 pods → save the working pattern as a `SKILL.md` file. Three hands-on Parts means three skills saved by 21:00.

**Pod rules** (introduced at end of Part 1):
1. Rotate the keyboard. Different person types each Part.
2. Beginner reads Claude's output aloud — this is how the room catches Claude when it's confidently wrong.
3. Push back on Claude. The first answer is rarely the best one.
4. Ask your pod before asking the instructor. Pedagogy happens at the table.
5. Floaters handle setup problems only. Pedagogy is the pod's job.

---

## Curriculum detail

### Module 0 — Pod intros (17:00–17:10)

Each pod runs a 4×60-second round: name → role → one product they ship → one thing they want from today. The "one thing" gets written on a sticky note posted at the table. The instructor uses real sticky-note answers during the keynote to ground examples.

### Module 1 — Part 1: Context (17:10–17:40)

A 30-minute context-setting block that frames the rest of the workshop. Replaces the v8 "Why Claude Code" keynote with broader framing. Key beats:

1. **Welcome + the day's arc** — what the four Parts look like.
2. **The modern PM (and designer)** — what's expected in 2026: ship faster, synthesize more, translate between code and product, onboard in days, work with AI as a teammate not a chat window.
3. **The Claude family in plain English** — Claude.ai (chat in browser, no file access) vs Claude Desktop's Cowork mode (agent for daily knowledge work) vs Claude Code (agent for code-grounded work, today's focus) vs Claude API (developer surface).
4. **Cowork live demo (~7 min)** — Cowork reads `feedback.csv`, produces a 1-page synthesis with top themes and representative quotes. Demonstrates "what knowledge work looks like with AI as a teammate" without the codebase complexity.
5. **When to use what** — decision tree: Claude.ai for thinking/drafting, Cowork for knowledge work, Claude Code for code-grounded work.
6. **What this workshop is NOT** — 60-second scope honesty.
7. **Three relationships frame** — the Explore → Constrain → Collaborate arc, plus the team-library framing for skills.
8. **5 pod rules** — rotate the keyboard, beginner reads aloud, the experienced person is the Challenger, push back with the cheat sheet, ask your pod first.
9. **Framing line:** *"Today you become the PM/designer your engineers wish they had."*

**No pod work in this Part.** Watch and listen. The hands-on starts in Part 2.

**Why the Cowork demo specifically uses the workshop's own `feedback.csv`:** plants thematic continuity with Part 4. When pods reach Part 4 and see the same file, the implicit teaching lands — "Cowork can synthesize this. Claude Code can synthesize THIS *and* turn the synthesis into a working PRD against your real codebase."

### Module 2 — Part 2: Explore — Onboard to a New Product (17:40–18:30)

**Goal:** Every pod uses Claude Code to audit an unfamiliar codebase as if they just joined the team, and save the working pattern as a skill.

**The realistic task:** *"You just joined the InvoiceFlow team. The CEO wants a 1:1 in 30 minutes. You've never seen the product before. In 24 minutes, use Claude Code to produce a 1-page audit: what the product is, every user-facing feature with files, three things that look half-built, three quick-win opportunities, three questions for the CEO. Then save the working pattern as a skill."*

**The 4-step pattern (demonstrated by the instructor, then run by pods):**
1. **Survey** in plan mode — read-only codebase mapping. "Don't write the audit yet."
2. **Push back on yourself** — "What did you miss? What's the riskiest thing here?"
3. **Audit** — with file-level evidence for every claim, not vibes.
4. **Self-critique** — "Find 3 things in your own audit that are wrong."

**Why this is Part 2's exercise (and not the v6 SSO scoping task):**
- "What does this app do?" is universally PM territory. No specialized vocabulary required.
- Beginners can drive the first 5 minutes confidently.
- Same code-grounded scoping discipline (audit must reference real files).
- Saved skill is reusable across every team a PM ever joins.

**Skill saved:** `.claude/skills/product-audit.md`.

**Stretch task for advanced pods who finish early:** scope adding SSO support (Google + Microsoft) using the same pattern. This is the v6 Part 1 task, repurposed as Track-C bonus content.

### Module 3 — Part 3: Constrain — Figma + Design System (18:40–19:30)

**Goal:** Translate a Figma design into working code that respects the project's design system tokens — entirely inside Claude Code, with the Figma MCP connected.

**The realistic task:** *"Your designer just shipped a Figma file with a new 'invoice line item' component. Your design system lives in `/components/ui` with tokens in `tokens.json`. Use Claude Code with the Figma MCP to generate the component — and make sure it uses the system, not custom values. If it doesn't, push back on Claude until it does."*

**The 4-step system-first pattern:**
1. **Read the system FIRST** — `tokens.json`, `components/ui/`, `CLAUDE.md`. Output what's available.
2. **Read the Figma frame** — map every visual element to a token or primitive. No match? Add to "Questions for designer" — don't invent.
3. **Generate** — using only system primitives. Mark every system bend with `// SYSTEM-BEND:`.
4. **Self-review** — where the system fit, where you bent, what goes back to the designer.

This Part is ideally co-led by a graduate (a designer in the BrAIght Wave network who ships with this pattern in production).

**Skill saved:** `.claude/skills/figma-to-component.md`.

### Module 4 — Part 4: Collaborate — Customer Feedback → PRD Round-Trip (19:40–20:30)

**Goal:** Synthesize real customer feedback into a feature, then show a complete spec-to-code-to-feedback loop. This is the workshop's emotional peak — every PM in the room has lived the broken PRD loop.

**The realistic task:** *"You have 200 rows of real customer feedback at `workshop-data/feedback.csv` (English + Hebrew, mixed sentiment, with theme tags). Run the full round-trip in 23 minutes:*
- *Step 0 — Synthesize: scan, find the top theme, define the feature.*
- *Role 1 — PM hat: write the grounded PRD against the codebase.*
- *Role 2 — Dev hat: implement. Note ambiguities.*
- *Role 3 — PM hat again: read the diff. Revise the PRD."*

**Skill saved:** `.claude/skills/prd-round-trip.md`.

**Optional advanced demo (Track C):** a 2-agent setup in `.claude/agents/` (`pm-spec.md` and `dev-implementer.md`) that runs the PM ↔ Dev hand-off across two specialized subagents. Frame as "this is what's possible — not what you have to do today."

### Module 5 — Graduate Panel (20:30–20:50)

Four pre-selected practitioners, 4 minutes each, timed. Format strictly enforced. The four angles:

1. **The PM** — uses Claude Code daily for codebase Q&A and PRDs.
2. **The designer** — Figma + Claude + design system shipper (often the same person who co-led Part 3).
3. **The org adopter** — rolled Claude Code out across a team. What worked, what didn't, what surprised them.
4. **The contrarian** — tried it and pulled back, or set serious guardrails. **This panelist is the most important.** Workshops with only success stories ring hollow.

Each panelist hits three questions: one thing they ship now that they couldn't before, one thing they tried that failed, one pattern the room should steal Monday.

Followed by 4 minutes of room Q&A pulled from sticky notes posted at pod tables in the morning.

### Module 6 — Closing: What's Coming This Year (20:50–21:00)

A 10-minute close framing the trajectory:

1. **Where the line is moving** — multi-agent teams, autonomous-for-hours horizons, agents in CI, skills as the team operating system.
2. **What it means for product roles** — not replacing engineers, removing the loss-in-translation tax.
3. **The Monday commitment** — every participant writes one line on a sticky note (kept in their physical laptop sleeve) committing to a Friday ship.
4. **Resources** — Slack/Discord channel, sample repo, cheat sheet, panelist contacts.

Ends with the dismissal line: *"You came in today as PMs and designers. You're leaving as the PM and designer your engineers wish they had. See you in the channel."* No "thank you for coming." The handshake is the channel.

---

## What participants leave with

| Artifact | Purpose |
|---|---|
| Claude Code installed, authenticated, used | Foundation |
| 3 working skills in `~/.claude/skills/` | The first 3 entries of their team's library |
| A 1-page audit of an unfamiliar product, with file-level evidence | Part 2 deliverable |
| A Figma-derived component respecting a design system | Part 3 deliverable |
| A complete PRD round-trip artifact built from real feedback | Part 4 deliverable |
| Four production patterns from graduates | Real-world calibration |
| 1-page cheat sheet | Reference |
| One Friday commitment, written by their own hand | Accountability |
| Slack/Discord channel access | Continuity |

---

## Pedagogical decisions worth flagging

For colleagues who might co-deliver or critique:

1. **Pod composition is not optional.** The 1-advanced + 2-mid + 1-beginner mix is what makes peer teaching work. Random pods produce dramatically worse outcomes.
2. **The deliberate complexity in the sample repo matters.** InvoiceFlow ships with 3 deliberate hotspots (tangled auth file, two PDF libraries mid-migration, currency formatting duplicated 4 times). This produces realistic scoping conversations. Curated-clean codebases produce naive answers.
3. **The contrarian panelist is non-negotiable.** Workshops without honest critique read as marketing.
4. **Skills, not sub-agents, are the central artifact.** Sub-agents are a Track-C teaser. Skills are universal and portable.
5. **Step 0 in Part 4 (feedback synthesis) is the workshop's competitive differentiator.** Most Claude Code-for-PM courses teach research synthesis as a standalone module. Folding it into the front of the round-trip means we exercise the universal use case without adding a fourth Part.

---

## Materials in the package

| File | Purpose |
|---|---|
| `01-workshop-plan.md` | Full 4-hour minute-by-minute plan |
| `04-cheat-sheet.md` | 1-page printable reference |
| `05-pre-flight-page.md` | Setup guide sent 1 week before |
| `06-skill-survey.md` | Survey questions for pod assignment |
| `07-graduate-brief.md` | Brief sent to each panelist |
| `08-sample-repo-spec.md` | Spec for `braightwave/claude-code-pm-starter` |
| `workshop-deck-content.md` | Unified 31-slide deck (paste-into-Gamma format) |
| `starter-files/CLAUDE.md` | Starter project memory file |
| `starter-files/.claude/skills/product-audit.md` | Part 2 starter skill |
| `starter-files/.claude/skills/figma-to-component.md` | Part 3 starter skill |
| `starter-files/.claude/skills/prd-round-trip.md` | Part 4 starter skill |

The sample repo (`braightwave/claude-code-pm-starter`) is a separate deliverable — a working Next.js + Prisma + NextAuth invoicing SaaS called "InvoiceFlow" with deliberate complexity hotspots that make scoping exercises realistic.

---

# APPENDIX A — Full exercise list

The 8 hands-on exercises participants run during the 4 hours, in order:

| # | Exercise | When | Duration | Surface | Output |
|---|---|---|---|---|---|
| 1 | **Pod intro round** | 17:00–17:10 | 10 min | Sticky notes | One "what I want" sticky per participant, posted at the table |
| 2 | **(Watching demo)** Cowork live demo — research synthesis on `feedback.csv` | 17:17–17:24 | 7 min | Claude Desktop app — Cowork tab (instructor's screen) | Awareness of Cowork as the knowledge-work surface |
| 3 | **(Watching demo)** Part 2: 4-step grounded scoping pattern + 60-sec multi-perspective subagents teaser | 17:45–17:59 | 14 min | Claude Desktop app — Code tab (instructor's screen) | Reference for pod work |
| 4 | **Part 2 pod work — Product audit** | 17:59–18:23 | 24 min | Claude Desktop app + sample repo | A 1-page product audit (5 sections) + saved `product-audit.md` skill |
| 5 | **(Watching demo)** Part 3: Figma → component pattern | 18:45–19:00 | 15 min | Claude Desktop app + Figma | Reference for pod work |
| 6 | **Part 3 pod work — Generate component from Figma** | 19:00–19:23 | 23 min | Claude Desktop app + Figma + sample repo | A working component file + "Questions for designer" list + saved `figma-to-component.md` skill |
| 7 | **(Watching demo)** Part 4: feedback synthesis + PRD round-trip + output transformation | 19:45–20:02 | 17 min | Claude Desktop app + sample repo | Reference for pod work |
| 8 | **Part 4 pod work — Customer feedback → PRD round-trip** | 20:02–20:25 | 23 min | Claude Desktop app + sample repo + workshop-data/feedback.csv | A PRD v1, an implementation diff, a PRD v2, a self-process reflection + saved `prd-round-trip.md` skill |
| 9 | **Friday commitment write** | 20:55–20:56 | 60 sec (silent) | Sticky note + laptop sleeve | One sticky note: *"By Friday I will ship one [PRD / component / workflow] using Claude Code"* |

**Note on the demo entries (2, 3, 5, 7):** these are passive on the participants' side, but the room is expected to engage actively — calling out what to push Claude on, suggesting alternatives, etc. They're not lectures.

**Pod share-backs** are not separate exercises but appear as 5-7 minute closing segments at the end of each Part: 2-3 pods stand up, share their output and skill, get one comment from the room.

---

# APPENDIX B — Tools, software, and accounts checklist

For colleagues confirming readiness or vouching for the workshop. Each row is something a participant must have available on their laptop or accessible in their browser by the workshop start.

## Required for every participant

| Item | Why | Who provides | Verified by |
|---|---|---|---|
| **Laptop** — macOS 13+, Windows 10+, or Linux Ubuntu 20.04+ | The whole workshop runs on it | Participant | Pre-flight |
| **Claude Pro subscription** ($20/mo) — or Max, Teams, Enterprise | Claude Code requires paid tier | Participant | Pre-flight verification step |
| **Claude Desktop app** — installed, signed in | Primary surface for the workshop | Participant | Pre-flight screenshot |
| **Git** — installed, with name + email configured | Cloning the sample repo and version-controlling skill saves | Participant | Pre-flight script |
| **GitHub account** | Cloning `braightwave/claude-code-pm-starter` | Participant | Pre-flight |
| **Figma account** with edit access to at least one file | Part 3 uses the Figma MCP | Participant | Pre-flight |
| **Internet connection** — workshop is fully real-time | Claude Code talks to Anthropic's servers continuously | Participant + venue | Day-of |
| **WhatsApp** — for the pre-flight room | Async support before the day | Participant | Invite link |

## Required for the venue / facilitator

| Item | Why |
|---|---|
| **Big screen** — visible from every pod | Showing instructor's Claude Desktop app during demos |
| **Pod tables** — 10 squares of 4, with sticky notes + markers | Pod structure depends on the physical layout |
| **Reliable WiFi** with backup hotspots | Claude Code is real-time; outages = workshop pause |
| **Power outlets** at every pod | 4 hours, 4 laptops per table |
| **Coffee + water + snacks** | 4-hour energy management |
| **A timer visible to panelists** during the graduate panel | 4-minute hard cutoff per panelist |

## Software / services used during the workshop

| What | Who uses it | When | Notes |
|---|---|---|---|
| **Claude Desktop app** | Everyone | All Parts | Primary surface |
| **Claude Pro subscription** (or higher) | Everyone | All Parts | The Desktop app's auth |
| **Git** | Everyone | Cloning the sample repo at start; saving skill files |
| **GitHub** | Everyone | Cloning the sample repo |
| **Figma** | Everyone (especially designers) | Part 3 | Figma MCP needs to be authorized once |
| **Figma Dev Mode MCP** | Everyone | Part 3 | Connected through the Desktop app's settings panel |
| **Sample Figma file** (workshop-provided) | Everyone | Part 3 | Sent on the day; participants who bring their own Figma file get more value |
| **InvoiceFlow sample repo** (`braightwave/claude-code-pm-starter`) | Everyone | All Parts | Cloned at the start; lives on their machine for 4 hours |
| **`workshop-data/feedback.csv`** (in the sample repo) | Everyone | Part 4 | 200 rows of mock EN+HE customer feedback (also used in Part 1 Cowork demo) |
| **`tokens.json`** (in the sample repo) | Everyone | Part 3 | Design system tokens |
| **`components/ui/`** (in the sample repo) | Everyone | Part 3 | Existing design system primitives |
| **`CLAUDE.md`** (in the sample repo) | Everyone | All Parts | Project memory; modified by some pods as a stretch task |
| **`.claude/skills/`** (in the sample repo) | Everyone | All Parts | Where the 3 skills get saved |
| **`.claude/agents/`** (in the sample repo) | Track-C participants | Part 4 only | For the optional 2-agent setup demo |
| **Slack or Discord** | Everyone | After the workshop | Cohort continuity channel |
| **Sticky notes + markers** | Everyone | Pod intros, Monday commitment | Physical artifacts intentional |

## Optional / nice-to-have

| Item | Use |
|---|---|
| Atlassian (Jira) MCP server | Stretch tasks for participants who want to connect to their real tickets |
| Notion MCP server | Same, for Notion users |
| GitHub MCP server | Same, for code-review workflows |
| A real PRD they're stuck on | Brought from work; replaces the InvoiceFlow example for higher realism |
| A real Figma file with a stuck component | Same, for Part 3 |

## Anti-checklist — what we do NOT use

To set expectations clearly:
- ❌ No code editor (VS Code / Cursor) needed — the Desktop app shows files and diffs natively
- ❌ No terminal use (the Desktop app handles everything)
- ❌ No cloud infrastructure (the sample repo runs on SQLite locally)
- ❌ No Anthropic API key required (Pro subscription is enough)
- ❌ No Docker, Kubernetes, or DevOps tooling
- ❌ No external IDEs or paid plugins beyond what's listed above

---

## Questions or feedback?

This syllabus reflects v5 of the workshop materials (April 2026). Earlier versions (v1–v4) are deprecated.

— Shmulik Davar / BrAIght Wave
shmulik@braightwave.com
