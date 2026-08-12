# Instructor Prep — Part 4: PRD Round-Trip

> **Audience:** You. ~15 minutes to read.
> **What this is:** Everything for delivering the Part 4 demo (17 min) and walking the room during pod work (23 min).
> **Total time:** 50 min · 19:55–20:45
> **Stakes:** Most cognitively dense Part. Pods will be tired (it's 90 min into hands-on work). The honest "stop after Role 2" guardrail is what saves them.

---

## The arc of Part 4

| Block | Time | What's happening |
|---|---|---|
| Frame slide | 30 sec | "PART 4 — Collaborate" — slide 38 |
| Pattern slide | 2 min | The 0/1/2/3 pattern — slide 39 |
| **Live demo walkthrough slide** | 1 min | Show prompts pods will use — slide 40 |
| **Live demo (you)** | 17 min | Synthesize → PM → Dev → PM-again — slide 40 |
| **Your turn prep slide** | 1 min | Read aloud — slide 41 |
| Pod work | 23 min | Task slide stays up — slide 42 |
| Share-back | 5 min | 3 pods present (90 sec each) — slide 43 |

---

## Why this exercise was designed this way

**The core insight:** Most PRDs fail not because the PM didn't think hard enough, but because the PM never tried to *implement* their own spec. Ambiguities only surface when you're doing the work. The round-trip pattern collapses that loop into one session — write the spec, switch hats, implement, then come back to the spec with what you learned.

**Step 0 (Synthesize)** anchors the whole exercise in real user voice. Without it, pods will define imaginary features. With it, the feature is defensible against actual feedback.

**Role 1 (PM hat)** uses the existing `prd-template.md` skeleton. This is intentional — pods who try to write a PRD from scratch will spend 15 minutes on structure. The skeleton lets them focus on substance.

**Role 2 (Dev hat) is the lesson.** The point is not the code that gets shipped. The point is the *list of ambiguities* that surface during implementation. That list is the deliverable of this Part.

**Role 3 (PM hat again)** closes the loop. Pods see, in their own writing, the gap between "what I thought I said" and "what was actually clear."

**The "stop after Role 2 honestly" guardrail** is the trust move. Pods will run out of time. Telling them upfront that *not finishing* is a valid outcome — better than faking — preserves the pedagogical integrity.

---

## The demo — sequence and exact prompts

### Step 0: Setup (30 sec)

- Code tab → New session → `claude-code-pm-starter` folder
- Verify these files exist (open them in the file panel as a check):
  - `workshop-data/feedback.csv`
  - `docs/prd-template.md`
- Confirm the repo is in clean state (no leftover changes from Part 2 or Part 3 demos)

### Step 1: SYNTHESIZE (3 min)

```
Read workshop-data/feedback.csv. It contains 200 rows of customer feedback
for InvoiceFlow. Synthesize: what is the top theme by impact and frequency?
Define a concrete feature that addresses it. Be specific — files involved,
acceptance criteria. No vague "improve UX."
```

**Expected:** Claude identifies a top theme (likely PDF performance, currency handling, or missing integrations) and proposes a concrete feature.

**Examples of valid output:**
- "Bulk PDF re-export with progress indicator" (addresses PDF performance theme)
- "Inline currency selector on invoice creation page" (addresses currency theme)
- "Save invoice draft to localStorage" (addresses 'lost work' complaints)

**If Claude returns vague:** Push back live.

```
Give me a feature concrete enough that an engineer could start coding tomorrow.
Files involved. Acceptance criteria. Don't say "improve" anything.
```

**What to say:**
> *"Notice — I'm not letting Claude give me a strategy bullet. 'Improve UX' is not a feature. 'Inline currency selector on /app/invoice-create.tsx' is a feature."*

### Step 2: PM HAT — Role 1 (4 min)

```
Now put on your PM hat. Open docs/prd-template.md — it's a 3-line skeleton.
Fill it in for the feature you just defined. Use the codebase as evidence.
Cite specific files where the change would happen. Save as
docs/prd-{feature-name}.md.
```

**Expected:** A real PRD with sections (Problem, Users, Acceptance Criteria, etc.) filled in with file evidence.

**Open the saved PRD on screen. Read 2-3 sections aloud.**

**What to say:**
> *"This isn't a generic PRD. Notice — every claim cites a file. That's the difference between a PRD a PM writes from a Notion template and a PRD a PM writes after Claude has read the codebase."*

### Step 3: DEV HAT — Role 2 (5 min)

```
Now switch to Dev hat. Read your own PRD cold — pretend the PM is a different
person. Implement the feature in code. While you implement, note every
ambiguity in the PRD that's slowing you down. Quote the exact PRD line that's
ambiguous and explain why.
```

**Expected:** Claude makes real code edits AND surfaces ambiguities like:
- *"PRD says 'show progress indicator' but doesn't specify whether per-file or aggregate. I went with aggregate."*
- *"PRD says 'large invoices' but doesn't define large. I picked >10 line items."*

**The ambiguities ARE the lesson.** Don't rush past them.

**Run `git diff` in the terminal:**

```
Run `git diff` and show me the actual code changes you made.
```

**What to say:**
> *"This is the moment. Look at this list of ambiguities. Every one of these is something the PM didn't notice when writing the PRD. This is what 'how does my spec actually work' looks like. Most of you have shipped PRDs with 5x more ambiguities than this. Now you know."*

### Step 4: PM HAT AGAIN — Role 3 (3 min)

```
Now read the diff you just made. Read the PRD again. Revise the PRD to fix
every ambiguity that came up during implementation. Be honest — if you cut
corners as Dev, say so as PM. Save as docs/prd-{feature-name}-v2.md.
```

**Expected:** A revised PRD with concrete acceptance criteria, edge cases noted, decisions documented.

**Open both PRDs side-by-side. Show the diff between v1 and v2.**

**What to say:**
> *"This is what really learning looks like. The PRD got better only because we tried to implement it. You can do this in 25 minutes for any feature. Imagine if every PRD in your team's history had been round-tripped before going to engineering."*

### Step 5: Save as a skill (90 sec)

```
Save this round-trip pattern as `.claude/skills/prd-round-trip.md`.
The skill should include the synthesize step at the top, not just the
round-trip.
```

---

## Pod work — what to watch for during 23 min

### Failure mode 1: Skipping Step 0 (Synthesize)
Pods who skip synthesize will pick imaginary features. Their PRDs won't ground in real user voice.

**Intervention:** *"Did you read feedback.csv? Tell me which row supports the feature you chose."*

### Failure mode 2: Vague Step 0 output
"Improve onboarding" is not a feature. "Add a 30-second product tour modal on first login" is.

**Intervention:** *"Push back. Make Claude specify the file. Make it specify the acceptance criteria."*

### Failure mode 3: Dev hat just describes, doesn't implement
Some pods will get Dev-hat output that says *"I would change /lib/auth.ts to do X"* without actually making code edits. That's not Dev hat. That's still PM hat.

**Intervention:** *"Tell Claude: 'Don't describe what you'd change. Make the actual code edits. Run `git diff` to verify.'"*

### Failure mode 4: Trying to finish all 4 steps in 23 min
Most ambitious pods will run out of time at Step 3. **The honest report is the deliverable.**

**Intervention (preventive):** Walk the room at minute 18. *"5 minutes left. If you're at Role 2, stop there. Don't fake Role 3. Save the skill and write your trigger."*

### Failure mode 5: Pods skip the ambiguities list
Some pods will let Claude implement without surfacing ambiguities. The list of ambiguities is the prize.

**Intervention:** *"Stop. Tell Claude: 'List every ambiguity that slowed you down. Quote the PRD line. Explain why.'"*

---

## How to time the room

This Part has the highest variance in pod completion. Manage it actively.

- **Minute 5:** Pods should be done with Step 0. If still synthesizing, push them forward.
- **Minute 12:** Pods should be in Role 2 (Dev hat). If still in Role 1, they're going to run out of time.
- **Minute 18:** **Announce to the room: "5 minutes left. If you're at Role 2, stop and save. Don't fake Role 3."**
- **Minute 22:** Pods writing their trigger.
- **Minute 23:** Stop. Share-back.

---

## Share-back — 5 min, 3 pods

The fastest share-back of the night. 90 seconds per pod. Tight transitions.

**Each pod covers:**
- The feature they chose
- One thing the spec got wrong (the most useful answer)
- One thing they learned about their own spec process
- Their "I will use this skill when ___" trigger

**Pick pods strategically:**
- One pod that completed all 4 steps (rare)
- One pod that honestly stopped at Role 2 (model the honest behavior)
- One pod that found a surprising ambiguity (the strongest learning moment)

**Don't pick three pods who finished perfectly.** That obscures the lesson — which is that real PRDs always have ambiguities.

---

## What success at the end of Part 4 looks like

After 50 minutes, every pod should have:
1. ✅ A real PRD in `docs/` citing specific files
2. ✅ Real code changes (visible in git diff) — even if incomplete
3. ✅ An honest list of ambiguities that surfaced during implementation
4. ✅ A `prd-round-trip.md` skill saved
5. ✅ A trigger that's specific to their workflow

Pods who *honestly stopped at Role 2* should have all of the above except #4 (revised PRD), and that's a successful outcome — not a failure.

If 60% of pods have items 1-3 + 5, you crushed it. (Lower bar than Parts 2 and 3 because of cognitive load.)

---

## If your demo runs long

Most likely failure: your demo runs over 17 minutes. Reasons: Step 1 takes longer than expected, or Claude returns a vague theme and you push back twice.

**Decision tree:**
- **At minute 12, you're still in Step 1 or 2:** Skip Step 4 (Role 3) in your demo. Instead, briefly describe what Role 3 would do. Save the skill. Move to pod work.
- **At minute 15, you're still demoing:** Stop the demo immediately. Wrap with: *"You've seen the pattern. Now do it. Same pattern. 23 minutes."*

**Do not let your demo eat pod time.** Pod time is more valuable than demo time. Pods doing the work is the lesson, not you doing the work.

---

## If your demo fails live

### feedback.csv is empty or unreadable
**Action:** Check the file path. Falls back to the dry-run recording if needed.

### Claude won't switch hats
Some Claude versions struggle with explicit hat-switching. If Claude keeps writing PRD when you ask for Dev work:

**Push-back prompt:**
```
Stop describing. Make the code edits in the actual files. I want to see
git diff show real changes. PM mode is over.
```

### Claude implements but doesn't surface ambiguities
**Push-back prompt:**
```
Now list every ambiguity in the PRD that you encountered during implementation.
Quote the exact line that was ambiguous. If you don't list any, you're hiding them.
```

---

## What to say at the end of Part 4

Bridge to panel (slide 44):

> *"That's the round-trip. You've now done all three patterns — Explore, Constrain, Collaborate. You have three skills saved. Most importantly, you have three triggers — three concrete moments next week where you'll pick this up again."*
>
> *"Stretch. Refill. We have 15 minutes with our panelists, then a final commitment. You're 30 minutes from the end."*

---

## The honest thing to remember

Part 4 is the most demanding Part of the workshop, and it lands at the moment pods are most tired. **Calibrate down.** A 60% completion rate is fine. The lesson — *"my spec process has ambiguities I never see until someone tries to implement it"* — lands even when the deliverable is incomplete.

If you sense the room is exhausted at minute 18, announce: *"You can stop at Role 2. The honest report is the deliverable."* That announcement protects the pedagogy and the room's energy.

---

## Pre-mortem checklist

Before this Part starts, verify:
- [ ] `feedback.csv` and `docs/prd-template.md` are present in the repo
- [ ] Repo is in clean state (no leftover changes)
- [ ] Your dry-run recording is in `~/workshop-fallback/captures/04-prd-roundtrip/`
- [ ] You've practiced the "stop after Role 2 honestly" announcement out loud

---

*BrAIght Wave · Instructor prep · Part 4 · Read tonight, skim before workshop*
