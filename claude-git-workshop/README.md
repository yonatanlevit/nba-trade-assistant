# Claude Code for Product Teams — Workshop Delivery Folder

> **One folder. Everything you need to deliver the workshop.**
> **Date:** Thursday, May 7, 2026 · 17:00–21:00
> **Audience:** 40 PMs and product designers, 10 pods of 4
> **Instructor:** Shmulik Davar · BrAIght Wave

---

## What's in this folder

```
workshop-final/
│
├── 00-DECK-CHANGES.md              ← READ FIRST — what to edit in Gamma
├── 01-instructor-plan.md            ← Minute-by-minute plan for you
├── 02-instructor-syllabus.md        ← Workshop overview for you / colleagues
├── 03-deck-outline-gamma.md         ← Full deck outline (paste into Gamma if needed)
├── 04-fundamentals-slides.md        ← The 4 new Claude Code Fundamentals slides
├── 05-cheat-sheet.md                ← 1-pager for participants (print 40 copies)
├── 06-pre-workshop-email.md         ← Email sent to participants pre-workshop
├── 07-pre-flight-setup-guide.md     ← Setup guide participants follow before Thursday
├── 08-skill-survey.md               ← Pod-assignment form questions
├── 09-student-syllabus.md           ← Concise syllabus for participants
├── 10-dry-run-guide.md              ← Your dry-run script (do this BEFORE the workshop)
├── 11-floater-fallback-recipes.md   ← For your 2 floaters
├── 12-publish-repo-to-github.md     ← How to publish the sample repo to GitHub
│
├── handouts/                        ← For pods (PRINT THESE)
│   ├── A1-cowork-takehome.md        ← Cowork reference card (40 copies for take-home)
│   ├── A2-part1-explore.md          ← Pod handout for Part 1 (12 copies)
│   ├── A3-part2-constrain.md        ← Pod handout for Part 2 (12 copies)
│   ├── A4-part3-collaborate.md      ← Pod handout for Part 3 (12 copies)
│   └── A4-part3-step-by-step-DETAILED.md  ← Optional: longer Part 3 alternative
│
├── instructor-prep/                 ← For you (READ TONIGHT)
│   ├── B1-cowork.md                 ← Cowork demo prep
│   ├── B2-part1-explore.md          ← Part 1 prep
│   ├── B3-part2-constrain.md        ← Part 2 prep
│   ├── B4-part3-collaborate.md      ← Part 3 prep
│   └── B4-part3-step-by-step-DETAILED.md  ← Optional: deeper Part 3 prep
│
└── sample-repo/                     ← The InvoiceFlow codebase
    └── claude-code-pm-starter/      ← Push this to GitHub, pods clone it
```

---

## ⚠️ One important note on Part numbering

The agenda we settled on uses **Part 1 / Part 2 / Part 3** for the three hands-on exercises. But many files in this folder still reference **Part 2 / Part 3 / Part 4** (legacy from when there was a Part 1: Context keynote that was renumbered into "Keynote").

**The mapping is:**

| Old name | New name | What it is |
|---|---|---|
| Part 2 (old) | **Part 1: Explore** | Product Audit on InvoiceFlow |
| Part 3 (old) | **Part 2: Constrain** | Figma → Component |
| Part 4 (old) | **Part 3: Collaborate** | PRD Round-Trip |

When reading any document with old Part numbers, mentally remap. The **handouts** in `handouts/` have already been renamed in their filenames (A2-part1-explore, A3-part2-constrain, A4-part3-collaborate), but the content inside still refers to "Part 2", "Part 3", "Part 4" in places. Same for the instructor prep files.

**This is OK because:**
- The exercises themselves haven't changed — only the labels.
- During the workshop, you'll only refer to the new numbers when speaking.
- Pods read the handout content as instructions, not as reference to "which Part is this" — so the internal labels don't confuse them.

If you want me to do a global search-and-replace to update every file's content to the new Part numbers, I can — but it's optional polish for v13 after the workshop.

---

## ⚡ The 10-hours-out action plan

Reading order tonight (in priority order):

### Tier 1 — Must do (3 hours total)

1. **Read `00-DECK-CHANGES.md`** (5 min) — understand what to edit in Gamma
2. **Apply deck changes in Gamma** (30–40 min) — renumber Parts, add 4 fundamentals slides, delete redundant slides, fix Part 3 task numbering
3. **Run `10-dry-run-guide.md`** (3 hours) — execute the demos and pod exercises yourself, capture backup recordings

### Tier 2 — Should do (45 min total)

4. **Read `instructor-prep/B1-cowork.md`** (10 min) — Cowork demo prep
5. **Read `instructor-prep/B4-part3-step-by-step-DETAILED.md`** (15 min) — Part 3 (PRD round-trip) is the most cognitively dense, deserves the deeper prep
6. **Skim `01-instructor-plan.md`** (10 min) — minute-by-minute timing
7. **Skim `instructor-prep/B2-part1-explore.md` and `B3-part2-constrain.md`** (10 min)

### Tier 3 — Thursday morning (1 hour total)

8. **Print handouts** — 40× A1, 12× each of A2, A3, A4 (use `handouts/A4-part3-collaborate.md`, NOT the DETAILED version, for printing)
9. **Print 2 copies of `11-floater-fallback-recipes.md`** for your floaters
10. **Verify sample repo is on GitHub** — see `12-publish-repo-to-github.md` if not yet done
11. **Reset sample repo to clean state** — `git reset --hard HEAD && git clean -fd` so pods start clean

---

## What to print on Thursday morning

| Document | Copies | Purpose |
|---|---|---|
| `handouts/A1-cowork-takehome.md` | 40 | One per participant, take-home reference for Cowork |
| `handouts/A2-part1-explore.md` | 12 | One per pod (10 + 2 spare) for Part 1 |
| `handouts/A3-part2-constrain.md` | 12 | One per pod for Part 2 |
| `handouts/A4-part3-collaborate.md` | 12 | One per pod for Part 3 |
| `05-cheat-sheet.md` | 40 | One per participant, on every desk |
| `11-floater-fallback-recipes.md` | 2 | One per floater |

**Total prints: ~118 sheets.** Bring extra paper in case.

---

## What's in the sample repo

`sample-repo/claude-code-pm-starter/` is a complete Next.js 14 + TypeScript + Prisma + NextAuth invoicing app with:

- **CLAUDE.md** at the root (project memory)
- **`tokens.json`** (design system tokens)
- **`components/ui/`** (shadcn primitives for Part 2)
- **`docs/architecture.md`** + **`docs/prd-template.md`** (for Part 3 round-trip)
- **`workshop-data/feedback.csv`** (200 rows EN + Hebrew, used in both Cowork demo and Part 3)
- **`workshop-data/events.json`** + **`tickets.json`** (extra grist)
- **`.claude/skills/`** with 3 starter skills: `product-audit.md`, `figma-to-component.md`, `prd-round-trip.md`
- **`.mcp.json`** with stub config for Atlassian/Notion/Figma

**3 deliberate complexity hotspots** for Part 1's audit exercise:
1. Tangled `lib/auth.ts` (mixes session + user lookup)
2. Two PDF libraries (pdfkit + puppeteer — looks half-finished migration)
3. Currency formatting duplicated 4× across the codebase

**Heads up:** I created `docs/prd-template.md` during this session because it was missing — the deck and Part 3 exercise reference it as if it exists. Make sure your local copy of the repo has it.

---

## What to do with the sample repo before Thursday

1. **Publish to GitHub** at `braightwave/claude-code-pm-starter` — see `12-publish-repo-to-github.md` for step-by-step
2. **Clone it on your demo laptop** to `~/workshop-fallback/claude-code-pm-starter/`
3. **Verify it runs:** `npm install && npm run dev` should start the dev server at `localhost:3000`
4. **Test login** with seeded credentials: `demo@invoiceflow.test` / `password123`
5. **Reset it to clean state** Wednesday evening (so pods start from the same point)
6. **Post the URL** in the WhatsApp room before Thursday

---

## What's not in this folder (and why)

- **The Gamma deck itself** — lives in your Gamma account, not exported here
- **Backup screen recordings** — these come out of your dry-run on Wednesday/Thursday morning
- **Hebrew translations** — all materials are English; pods can read either language
- **Pre-workshop landing page edits** — the Lovable page edits we discussed weren't applied yet (you can do them or not)
- **Panel materials** — the panel was cut from the final agenda

---

## Final thought before you start prepping

You've spent many hours on this workshop. The materials are mature. The exercises work. The sample repo is ready.

**The single highest-leverage action you can take in the next 10 hours is the dry-run** (`10-dry-run-guide.md`). Not more deck iterations. Not more guide rewrites. Run the demos, capture backups, identify failure modes you didn't expect, and **then go to sleep.**

Good luck Thursday.

---

*BrAIght Wave · Claude Code for Product Teams · Final delivery folder · May 7, 2026*
