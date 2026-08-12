# Instructor Prep — Part 2: Product Audit

> **Audience:** You. ~15 minutes to read.
> **What this is:** Everything for delivering the Part 2 demo (14 min) and walking the room during pod work (24 min).
> **Total time:** 50 min · 17:55–18:45
> **Stakes:** This is the first hands-on Part. If it goes well, the room is with you for the rest of the night. If pods fail here, energy drops for Parts 3 & 4.

---

## The arc of Part 2

| Block | Time | What's happening |
|---|---|---|
| Frame slide | 30 sec | "PART 2 — Explore" — slide 24 |
| Pattern slide | 2 min | The 4 steps — slide 25 |
| **Live demo walkthrough slide** | 1 min | Show the prompts pods will type — slide 26 |
| **Live demo (you)** | 14 min | Run the 4-step pattern on InvoiceFlow — silent slide 27 |
| **Your turn prep slide** | 1 min | Read aloud what pods will do — slide 27 |
| Pod work | 24 min | Task slide stays up — slide 28 |
| Share-back | 7 min | 2 pods present — slide 29 |

---

## Why this exercise was designed this way

**The 4-step pattern (Survey → Push back → Audit → Self-critique)** is the underlying move that makes Claude useful for unfamiliar code. Most participants will, left to themselves, type *"audit this codebase"* as a single prompt and get garbage. The 4-step pattern is the differentiator.

**Plan mode in Step 1** enforces read-only exploration. This is the safety story for non-coders. They can't break anything by surveying.

**The "push back on yourself" step** is the unique pedagogical move. Without it, Claude's first-pass survey is too confident. The push-back prompt forces nuance.

**Self-critique at the end** is what makes the audit useful in real life. Claude's own list of gaps in its audit is more honest than asking it "is this audit good?"

If pods skip any of these steps, the lesson doesn't land. Walk the room watching for skips.

---

## The demo — sequence and exact prompts

### Step 0: Open and orient (30 sec)

- Cmd+Tab to Claude Desktop
- Click **Code tab** (not Cowork — that was Part 1)
- Verify session is on `claude-code-pm-starter` (you set this up before the workshop)
- Type warmup: *"Read CLAUDE.md and confirm what this project is."* — wait for response, confirm it picked up the file. ~30 sec.

**Why:** You're showing the room that Claude Code reads project memory automatically. Don't skip this step — it answers a question they have.

### Step 1: SURVEY (plan mode ON) — 2.5 min

Click into plan mode (the toggle near the input).

```
Survey this codebase. Identify what this product is, every user-facing
feature, and the major moving parts (auth, data model, integrations,
exports). Don't write the audit yet — just the survey.
```

**Expected output:** Claude maps InvoiceFlow features (login, dashboard, invoice CRUD, PDF export, customer list, settings) without yet making opinionated claims about what's broken.

**What to say while it runs (~30 sec):**
> *"Notice — plan mode means it's read-only. Claude is reading files but not editing anything. This is the exploration phase. You can't break anything in this mode."*

### Step 2: PUSH BACK — 2 min

Stay in plan mode.

```
Now push back on what you just said. What did you miss? What's the
riskiest part of this codebase that I should know as a new PM? What
did you over-trust from the README?
```

**Expected output:** Claude surfaces nuance — *"I assumed auth was simple but actually `/lib/auth.ts` mixes session logic with user lookup. The README says PDF export works but there are two libraries..."*

**What to say:**
> *"Watch this — Claude is going to be more honest here than in the first response. The first pass is confident. The push-back forces nuance. This is how you get past the surface."*

### Step 3: AUDIT (plan mode OFF) — 4 min

Click out of plan mode.

```
Now write the 1-page audit. Format:
- What this product is (1 paragraph)
- User-facing features (each with file path)
- Three things that look half-built or buggy (with file evidence)
- Three quick-win opportunities shippable in a sprint (with file paths)
- Three questions for the CEO

Be specific. Cite files for every claim.
```

**Expected output:** Claude identifies the 3 deliberate hotspots:
1. Auth tangle (`/lib/auth.ts` mixes concerns)
2. PDF export uses two libraries (pdfkit + puppeteer — looks half-finished migration)
3. Currency formatting duplicated in 4+ places

**Critical:** If Claude misses one of these three, push back live:
```
Look more carefully at the PDF export code — search for pdfkit and puppeteer.
What do you find?
```

The push-back is the lesson. Don't hide it. The room is learning that you push back when output is incomplete.

### Step 4: SELF-CRITIQUE — 2 min

```
Read the codebase one more time. Find 3 things in your own audit that
are wrong, missing, or under-specified. Be honest — if your audit was
thin somewhere, say so.
```

**Expected:** Claude identifies its own gaps. *"My quick-win for currency formatting was vague — I should have specified which file to consolidate to. My CEO question about pricing was generic — a better one would be..."*

**What to say:**
> *"This is the move that makes the audit actually useful. Don't trust the first audit. Make Claude critique itself. Then take that critique seriously."*

### Step 5: Save as a skill — 90 sec

```
Now save this 4-step pattern as a reusable skill. Create the file at
`.claude/skills/product-audit.md` with proper frontmatter (name,
description). Make sure the skill is general enough to work on any
codebase, not just this one.
```

**Open the file in the file panel.** Show it on screen. **Read 3 lines aloud.**

**What to say:**
> *"This is the most important moment of Part 2. We just turned a 14-minute demo into a 30-second skill. Next time I onboard to a new product, I just say 'use the product-audit skill' and Claude runs all 4 steps. Your teammate can run it next week."*

### Step 6: The "skill works elsewhere" demo — 1 min

```
Now run that skill on a different folder — try ~/Downloads/ or any
other folder you have. Show me how the skill applies somewhere new.
```

This is the moment that lands hardest. The skill works on any folder.

---

## Pod work — what to watch for during the 24 min

When the task slide goes up (slide 28), pods start typing. Walk the room. Look for these failure modes:

### Failure mode 1: Skipping the push-back step
Pods who go straight from Survey to Audit miss the nuance. Their audit will be confident but shallow.

**Intervention:** Stop at the pod. Ask: *"Did you push back on the survey before writing the audit? Try it now — you'll see it changes."*

### Failure mode 2: Vague pushbacks
Pods type "what did you miss?" with no specifics. Claude will respond generically.

**Intervention:** Suggest a sharper push-back from the cheat sheet:
*"Try: 'Look at /lib/auth.ts specifically — what's the actual structure?'"*

### Failure mode 3: Audit without file paths
Some pods will accept an audit that says "PDF export is slow" with no file evidence.

**Intervention:** *"Push back. Make Claude cite the file. 'Show me where in the code that's true.'"*

### Failure mode 4: Saving the skill as a personal note
Some pods will save the audit text as the skill. That's wrong — the skill should be the *pattern*, not the output.

**Intervention:** *"The skill is the recipe, not the cake. Tell Claude to save the 4-step process as a skill, not the audit itself."*

### Failure mode 5: Stuck in plan mode
Plan mode is read-only — pods can't save files in plan mode. If they're stuck saving the skill, check that they exited plan mode.

---

## How to time the room

- **Minute 5 (3 min in):** Most pods are mid-Survey. Walk the room, listen for the push-back step.
- **Minute 12 (10 min in):** Most pods should be in Step 3 (writing the audit). If a pod is still on Survey, gently push them forward.
- **Minute 18 (16 min in):** Stop new audit work. Tell the room: "**6 minutes left. Save your skill now.**"
- **Minute 22 (20 min in):** Pods writing their "I will use this when ___" trigger.
- **Minute 24:** Stop. Move to share-back.

---

## Share-back — 7 min

2 pods present. Each gets 3 min. Quick transitions.

**For each sharing pod:**
- 60 sec: Their audit highlights — top 3 quick wins, top 3 CEO questions
- 60 sec: Their saved skill prompt
- 60 sec: Their "I will use this skill when ___" trigger

**Pick the pods strategically:**
- One pod that found something surprising in the audit (you'll spot this from walking the room)
- One pod with a sharp "I will use this when" trigger

Avoid picking based on volunteers — the loudest pods aren't always the most insightful.

---

## What success at the end of Part 2 looks like

After 50 minutes, every pod should have:
1. ✅ A 1-page audit of InvoiceFlow with specific file evidence
2. ✅ A `product-audit.md` skill saved in `.claude/skills/`
3. ✅ A sticky-note trigger ("I will use this when ___")
4. ✅ The realization that Claude Code can read code and produce real work

If 80% of pods have all 4, you crushed it.

---

## If your demo fails live

**If Claude refuses to enter plan mode:** plan mode toggle was added mid-2025. If it's missing, Claude Desktop needs an update. Switch to your dry-run recording.

**If Claude misses ALL THREE hotspots:** unusual but possible. Don't fake it. Say:
> *"Claude missed the auth issue here. Watch what I do — this is exactly what you'll do during pod work."*

Then push back live with the sharper prompt. The push-back IS the demo.

**If subagent demo fails (Step 6):** skip it. The 4-step pattern is the lesson. The subagent moment is bonus.

---

## What to say at the end of Part 2

Bridge to break (slide 30):

> *"You just did something most PMs never do. You read 50 files of an unfamiliar codebase, produced an audit, and saved a reusable skill — in 24 minutes. Take a 10-minute break. Stretch. Refill. Don't open Slack. When we come back, we go from research to making things — Part 3, with Figma."*

---

## Pre-mortem checklist

Before this Part starts, verify:
- [ ] Sample repo is open in your Claude Desktop Code tab
- [ ] Plan mode toggle is visible and works
- [ ] Your dry-run recording is in the `~/workshop-fallback/captures/02-product-audit/` folder
- [ ] You have the file paths memorized (`/lib/auth.ts`, `/lib/pdf/`, `/lib/currency/`) for live push-backs
- [ ] You know which pod likely has the strongest "I will use this when" trigger from walking the room

---

*BrAIght Wave · Instructor prep · Part 2 · Read tonight, skim before workshop*
