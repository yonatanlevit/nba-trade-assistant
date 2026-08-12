# Deck Changes — What to Edit in Gamma

> **Reference deck:** the 49-page PDF you uploaded earlier (the version with FOMA, Global Trends, Career Paths, AI-PM Skills, etc.)
> **Goal:** align deck with the final 17:00–21:00 agenda — 3 hands-on Parts (Explore, Constrain, Collaborate), no panel, with Claude Code Fundamentals taught explicitly before Part 1.
> **Estimated edit time in Gamma:** 30–40 minutes.

---

## Final agenda the deck must support

```
17:00–17:10  Pod intros (10 min)
17:10–18:00  Keynote (50 min)
18:00–18:50  PART 1: EXPLORE — Product Audit (50 min)
18:50–19:00  ☕ Break (10 min)
19:00–19:50  PART 2: CONSTRAIN — Figma → Component (50 min)
19:50–20:00  ☕ Break (10 min)
20:00–20:50  PART 3: COLLABORATE — PRD Round-Trip (50 min)
20:50–21:00  Closing (10 min)
```

**Note on times:** The keynote in your current deck has substantially more content than 30 min worth (FOMA, Global Trends, Models, Workspace, Rewired, Career Paths, AI-PM Skills, etc.). At 50 min it's still tight but doable if you keep slides moving (~90 sec average). If you find yourself running over, see "Time-saving cuts" at the bottom.

---

## The 5 categories of changes

1. **Renumber Parts** — current Parts 2/3/4 become Parts 1/2/3
2. **Add** — 4 new Claude Code Fundamentals slides between current Slide 23 and current Slide 24
3. **Delete** — section divider slides (4 of them) and panel slides (2 of them) — 6 deletions total
4. **Fix** — the Part 4 (now Part 3) task slide numbering issue
5. **Update** — Tonight's Arc slide with new Part numbers and times

---

## Change 1 — Renumber Parts throughout

The deck currently uses Part 2 / Part 3 / Part 4 (because Part 1 was the keynote in an old version). With the new structure, the keynote is just "Keynote" and the hands-on Parts are 1, 2, 3.

**Find and replace, slide by slide:**

| Current slide | Find | Replace |
|---|---|---|
| Slide 21 (Workshop Framework) | "Part 2 — Explore" | "Part 1 — Explore" |
| Slide 21 | "Part 3 — Constrain" | "Part 2 — Constrain" |
| Slide 21 | "Part 4 — Collaborate" | "Part 3 — Collaborate" |
| Slide 24 (Part frame) | "PART 2 / Explore." | "PART 1 / Explore." |
| Slide 27 (task) | "Your Part 2 task." | "Your Part 1 task." |
| Slide 28 (share-back) | "Part 2 Share-back" | "Part 1 Share-back" |
| Slide 31 (Part frame) | "PART 3 / Constrain." | "PART 2 / Constrain." |
| Slide 33 (task) | "Your Part 3 task." | "Your Part 2 task." |
| Slide 34 (share-back) | "Part 3 Share-back" | "Part 2 Share-back" |
| Slide 37 (Part frame) | "PART 4 / Collaborate." | "PART 3 / Collaborate." |
| Slide 39 (task) | "Your Part 4 task." | "Your Part 3 task." |
| Slide 40 (share-back) | "Part 4 Share-back" | "Part 3 Share-back" |
| Slide 45 ("What it means for your role") | "Remember the three words from tonight: Explore, Constrain, Collaborate" | *(no change — still works)* |

**Also update on Slide 17 (Why Claude Code Tonight):**
- "You'll feel this in Part 2" → "You'll feel this in Part 1"

---

## Change 2 — Add 4 Claude Code Fundamentals slides

**Position:** Insert between current Slide 23 ("Today you become the PM/designer your engineers wish they had") and current Slide 24 (PART 1 Explore frame, after renumbering).

**Slides to add** (full content in `04-fundamentals-slides.md` in the workshop folder):

1. **🔍 Plan Mode** — Read-only exploration. Toggle near the input.
2. **📋 CLAUDE.md** — Project memory file. Read automatically.
3. **🛠️ Skills** — Reusable Markdown patterns in `.claude/skills/`.
4. **🔌 MCP** — Model Context Protocol for external tools.

Each slide is 90 sec on stage = 6 min total addition.

---

## Change 3 — Delete redundant slides

### Section divider slides — DELETE (Gamma added these, they duplicate content)

- **Slide 25** ("SECTION B · Part 2: Onboard to a New Product · 17:40–18:30...")
- **Slide 30** ("SECTION C · Part 3: Figma + Claude + Design System...")
- **Slide 36** ("SECTION D · Part 4: PRD Round-Trip...")

These section dividers each precede the actual Part frame slide. The Part frame slide already does the framing — these section dividers are redundant.

### Panel slides — DELETE (no panel in final agenda)

- **Slide 41** ("SECTION E · Panel · 20:30–20:50...")
- **Slide 42** ("4 voices from the field...")

Total deletions: **6 slides**

---

## Change 4 — Fix the Part 3 (was Part 4) task slide numbering

**Slide:** Slide 39 (after renumbering, this is the "Your Part 3 task" slide)

**The bug:** The slide numbers steps as 1, 2, 3, 4 but says "stop after Role 2" — making "Role 2" ambiguous (is it Step 2 or Step 3?).

**The fix:** Renumber to match the cheat sheet's 0/1/2/3 + Role labels.

**Find:**
```
Run the full round-trip in 23 minutes:
1. Synthesize: find the top theme. Define the feature. Don't skip this.
2. PM hat: fill in the PRD skeleton against the codebase.
3. Dev hat: implement. Note every ambiguity.
4. PM hat again: read the diff. Revise the PRD.

If running out of time: stop after Role 2. Better to skip Role 3 honestly than fake it.
```

**Replace with:**
```
Run the full round-trip in 23 minutes:
0. Synthesize: find the top theme. Define the feature. Don't skip this.
1. PM hat (Role 1): fill in the PRD skeleton against the codebase.
2. Dev hat (Role 2): implement. Note every ambiguity.
3. PM hat again (Role 3): read the diff. Revise the PRD.

If running out of time: stop after Role 2 (Dev hat). Better to skip Role 3
honestly than fake it.
```

This makes "stop after Role 2" map cleanly to the second numbered step.

---

## Change 5 — Update Tonight's Arc slide

**Slide 2 — Tonight's Arc**

**Current:**
```
Part 1 — Context        30 min · Where AI fits in your job
Part 2 — Explore        50 min · Audit a codebase you've never seen
Part 3 — Constrain      50 min · Generate code that respects your design system
Part 4 — Collaborate    50 min · Customer feedback → PRD → working feature
```

**Replace with:**
```
Keynote                 50 min · Why Claude Code, why now
Part 1 — Explore        50 min · Audit a codebase you've never seen
Part 2 — Constrain      50 min · Generate code that respects your design system
Part 3 — Collaborate    50 min · Customer feedback → PRD → working feature
```

**Also update bottom line** from:
> *"Then a panel and a Friday commitment. Part 1 is your map. Parts 2–4 are hands-on with Claude Code on your laptop."*

**To:**
> *"Then a Friday commitment. Keynote is your map. Parts 1–3 are hands-on with Claude Code on your laptop."*

---

## Pre-existing fixes (still pending from earlier review)

These were flagged in the earlier deck review and may or may not have been applied:

### Slide 4 — Pod intros

Verify it says **"Within your pod: 60 seconds per person, max"** (not just "60 seconds each — no more, no less"). Without "within your pod," 40 participants × 60 sec reads as 40 minutes.

If it's already correct in your latest deck (the v10 PDF you sent showed *"Within your pod: 60 seconds per person, max"* — looks like this was already fixed), no change needed.

### Duplicate title slide

In the original deck there was a duplicate title slide on Page 3. In the v10 PDF you sent, that's now your bio slide instead — looks like this was already fixed too.

---

## Final slide count after all changes

- Original v10 deck: **49 slides**
- Add 4 fundamentals: **+4 slides**
- Delete 6 redundant slides (4 section dividers + 2 panel slides): **−6 slides**
- **Final: 47 slides**

Average duration: 240 min ÷ 47 slides = ~5 min per slide on average. But this is misleading because hands-on Part task slides stay up for 23-24 min each. Adjusted: ~22 active "presenter speaks" slides for ~95 min of stage time = ~4 min/slide average. Realistic.

---

## How to apply these changes in Gamma

**Option 1 — Edit existing deck (recommended given time pressure):**

1. Open your current Gamma deck
2. **Renaming pass:** Use Ctrl+F (Cmd+F) to find each Part reference. Replace as listed in Change 1.
3. **Deletion pass:** Delete slides 25, 30, 36, 41, 42 (the 6 redundant slides). After deletions, slide numbers will shift.
4. **Insertion pass:** Click between current Slide 23 and Slide 24, add 4 new slides using content from `04-fundamentals-slides.md`.
5. **Fix pass:** Edit the Part 3 task slide (renumbered from Part 4) using the find/replace text in Change 4.
6. **Tonight's Arc pass:** Edit Slide 2 with the new agenda content from Change 5.
7. **Total time:** ~30 minutes if you're efficient.

**Option 2 — Regenerate from scratch:**
Use the consolidated outline at `03-deck-outline-gamma.md` (in the workshop folder). Paste into Gamma's "Generate from text" mode. Cleaner result but takes 60+ minutes to review.

I'd recommend **Option 1** given you have under 12 hours.

---

## Time-saving cuts (if keynote runs long)

If during the dry-run you realize the keynote can't fit in 50 min, here are the best cuts in priority order:

1. **Easiest:** Skip Slide 13 (Four PM Career Paths) — ~90 sec saved. The content is interesting but not load-bearing for the workshop.
2. **Medium:** Compress Slide 14 (AI-PM Skills grid) — say *"You can read this on your own — here are the 3 we go deep on tonight: Multiple Chatbots, Vibe Prototyping, Agentic Coding"* and click forward. Saves ~2 min.
3. **Bigger:** Skip Slide 11 (2026 Workspace MCP diagram) — ~90 sec. MCP gets explained again in Slide 28 (the Fundamentals slide).
4. **Last resort:** Skip Slide 9 (Global Trends in AI) — ~2 min. Real content but you can recover the substance verbally during the FOMA slide.

Combined potential savings: ~7 min. That's enough buffer for a tight keynote.

---

## Don't change these (they're working)

- **Cowork demo slide** (Slide 18) — keep the live demo as-is. It's the highest-leverage moment in the keynote.
- **Why Claude Code Tonight** (Slide 17) — the 3-card credibility punch. Don't water it down.
- **Forced-failure framing** in Slide 32 (System-First Pattern) — keep the warning callout. It sets up the demo.
- **The "skip Role 3 honestly" guardrail** in the Part 3 task slide — don't soften this language.
- **The closing arc** (Slides 43–49 after renumbering, currently 43–49). Keep all 7 closing slides — Where the line is moving, Four Trajectories, What it means for your role, Honest Boundaries, Friday commitment, Resources, Final line.

---

*BrAIght Wave · Deck changes for v12 final · May 2026*
