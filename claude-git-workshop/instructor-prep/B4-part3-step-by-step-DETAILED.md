# Part 4: PRD Round-Trip — Instructor Step-by-Step

> **Audience:** You. Read this once tonight, skim once before the workshop.
> **Purpose:** Walk through every prompt, every transition, every potential failure point — so you can deliver this confidently in 17 min on stage and walk the room knowingly during the 23-min pod work.
> **Estimated read time:** 12 minutes.

---

## The arc you're delivering

| Block | Time | What you do |
|---|---|---|
| Frame the Part | 30 sec | Click to PART 4 frame slide. *"Customer feedback to PRD to working code to revised PRD. Round-trip the loop."* |
| Pattern slide | 2 min | Walk the 0/1/2/3 pattern. Don't elaborate — the demo makes it concrete. |
| Live demo | 17 min | You run all 4 steps on stage. **This guide focuses on this.** |
| Pod prep slide | 1 min | Read aloud the "Your Turn" prep slide. |
| Pod work | 23 min | Task slide stays up. Walk the room. |
| Share-back | 5 min | 3 pods, 90 sec each. |

---

## Before the demo: setup checklist

Run through this 60 seconds before clicking to the Part 4 frame slide.

- [ ] **Reset the repo.** From terminal: `cd ~/workshop-fallback/claude-code-pm-starter && git reset --hard HEAD && git clean -fd` — this undoes any leftover changes from Parts 2 and 3 demos. **Critical** — without this, Claude will see code from your earlier demos and get confused.
- [ ] Claude Desktop → **Code tab** → New session → Local → pick `claude-code-pm-starter` folder
- [ ] **Verify the two files exist** by typing in the chat: *"Confirm that `workshop-data/feedback.csv` and `docs/prd-template.md` both exist."* — Claude should say yes to both.
- [ ] Have a terminal window visible somewhere on screen — you'll use `git diff` later
- [ ] Backup recording is in `~/workshop-fallback/captures/04-prd-roundtrip/04a-instructor-demo.mov` and accessible via Cmd+Tab

---

## Live demo — exact sequence (17 min total)

### STEP 0: SYNTHESIZE (3 min)

**What you're showing:** Claude reading 200 rows of real customer feedback and pulling out a concrete, codable feature.

**Click to demo walkthrough slide.** Read the Step 0 line aloud: *"Step 0 — synthesize. We start by reading the customer voice."*

**Type this exact prompt:**

```
Read workshop-data/feedback.csv. It contains 200 rows of customer
feedback for InvoiceFlow. Synthesize: what is the top theme by impact
and frequency? Define a concrete feature that addresses it. Be
specific — files involved, acceptance criteria. No vague "improve UX."
```

**While Claude runs (~30 sec), narrate:**
> *"This is the most important step of the round-trip. If we skip this, we're defining features from imagination. Real PMs ground specs in real user voice. That's what's happening right now — Claude is reading 200 rows."*

**Expected output:** Claude returns one of these themes (most likely the first two given the data):

| Theme | Likely feature definition |
|---|---|
| **PDF performance** | "Add progress indicator + bulk re-export for invoices with >10 line items" |
| **Currency UX** | "Inline currency selector on invoice creation page (currently hidden in settings)" |
| **Currency conversion bugs** | "Display currency rate source + last-updated timestamp on invoices" |

**If output is vague (e.g., "improve user experience"):** Push back live. The room learns by watching you push back.

```
That's too abstract. Give me a feature concrete enough that an engineer
could code tomorrow. Files involved. Acceptance criteria. Quote 2-3
real feedback rows that support this feature.
```

**Once you have a concrete feature, lock it.** Read the feature aloud to the room. Acknowledge: *"OK — we're building this feature. Note the file paths it touched. Now let's write the spec."*

**Time check:** You should be at minute 3.

---

### ROLE 1: PM HAT (4 min)

**What you're showing:** Writing a real PRD against the codebase, with file evidence — not a generic Notion template.

**Type this exact prompt:**

```
Now put on your PM hat. Open docs/prd-template.md — it's a skeleton.
Fill it in for the feature you just defined. Use the codebase as
evidence. Cite specific files where the change would happen. Save as
docs/prd-currency-selector.md (or whatever the feature is named).
```

**While Claude runs (~60 sec), narrate:**
> *"Notice — Claude is reading the existing codebase while writing the PRD. This isn't a generic spec. Every claim is going to be grounded in a real file. That's the difference between a PRD a PM writes from a template and a PRD a PM writes after Claude has read the code."*

**When the PRD is saved, open it on screen.** Click into the file in the Claude Desktop file panel. **Read 2-3 sections aloud:**
- Read the Problem statement
- Read the Acceptance Criteria (each one should be concrete)
- Read the Files Involved (every line should be a real path)

**Highlight one thing the PRD does well, and one thing that's still vague.** This is the setup for Role 2.

> *"Notice this acceptance criterion — 'displays the currency selector inline on the invoice creation page.' That's testable. But notice this one — 'should be intuitive.' That's a landmine. Watch what happens when Dev hat tries to implement that."*

**Time check:** You should be at minute 7.

---

### ROLE 2: DEV HAT (5 min)

**What you're showing:** Implementing the spec while surfacing every ambiguity. The ambiguities are the lesson.

**Type this exact prompt:**

```
Now switch to Dev hat. Read your own PRD cold — pretend the PM is a
different person. Implement the feature in code. Make actual file
changes. While you implement, note every ambiguity in the PRD that's
slowing you down. Quote the exact PRD line that's ambiguous and
explain why.
```

**While Claude runs (~90 sec), narrate:**
> *"Claude is now switching modes. Same model. Different task. It's reading the PRD it just wrote — and it's allowed to challenge it. This is the move PMs almost never get to do — sit on the other side of their own spec."*

**Expected output:** Claude makes file edits AND surfaces a list of ambiguities. Look for things like:
- *"PRD says 'should be intuitive' — I went with a dropdown. Could equally be a search. Asked Designer."*
- *"PRD says 'inline on creation page' but doesn't specify whether before or after the line items. I put it after."*
- *"PRD doesn't say what happens if user changes currency mid-creation. I made it preserve existing line items at old rate."*

**Switch to terminal. Run:**

```bash
git diff
```

Show the diff on screen. **Don't read every line — point at one or two real changes.**

> *"This is real code. These edits exist. If you closed Claude right now, these changes would still be in the repo. Pods will see this in their own work."*

**Then return to the chat and read the ambiguity list aloud.** This is the heart of the demo.

> *"Look at this list. Every one of these is something the PM didn't notice when writing the PRD. This is what 'how does my spec actually work' looks like. Most PRDs at most companies have 5x more ambiguities than this. Now you see them — before they hit standup."*

**Time check:** You should be at minute 12.

---

### ROLE 3: PM HAT AGAIN (3 min)

**What you're showing:** Closing the loop — the spec gets better only because you tried to implement it.

**Type this exact prompt:**

```
Now read the diff you just made. Read the PRD again. Revise the PRD
to fix every ambiguity that came up during implementation. Be honest —
if you cut corners as Dev, say so as PM. Save as
docs/prd-currency-selector-v2.md.
```

**While Claude runs (~60 sec), narrate:**
> *"This is what really learning looks like. The PRD didn't get better because the PM thought harder. It got better because someone tried to implement it. You can do this in 25 minutes for any feature. Imagine if every PRD in your team's history had been round-tripped before going to engineering."*

**When v2 is saved, open both PRDs on screen** (v1 and v2 side by side in the file panel). **Show the diff.**

**Highlight 1-2 specific revisions:**
- *"Look — v1 said 'intuitive.' v2 says 'dropdown with the 5 most-used currencies pinned at top, full list below.' That's now testable."*
- *"v1 didn't mention what happens mid-creation. v2 spells it out: existing line items keep old rate, new ones use new rate, with a banner warning."*

**Time check:** You should be at minute 15.

---

### SAVE AS SKILL (90 sec)

**Type this exact prompt:**

```
Save this round-trip pattern as `.claude/skills/prd-round-trip.md`.
The skill should include the synthesize step at the top — not just
the round-trip. Make it general enough to work for any feature, not
just this one.
```

**Open the saved skill on screen.** Show the frontmatter. Read the description aloud.

**Bridge to pod work:**

> *"That's the round-trip pattern. Now you do it. 23 minutes. Pick a different theme than I picked — the data has at least 5 strong themes. Save the skill at the end. Write your trigger. Go."*

**Click to "Your Turn" prep slide. Read it aloud (60 sec).**

**Click to task slide. It stays up for 23 min.**

**Time check:** You should be at minute 17. Pod work starts.

---

## During pod work (23 min) — what to watch for

Walk the room every 4-5 min. Don't sit down. Look for these failure modes:

### Most common failure: skipping Step 0

**What you'll see:** Pods who go straight to PM hat without synthesizing. Their PRDs will be for imagined features.

**Intervention:**
> *"Stop. Did you read feedback.csv first? Tell me which row supports the feature you chose."*

If they can't cite a row, they skipped Step 0. Make them go back.

### Second most common: vague Step 0 output

**What you'll see:** A pod has a feature like "improve onboarding" — too abstract.

**Intervention:**
> *"Push back on Claude. Tell it: 'Give me a feature concrete enough that an engineer could code tomorrow. Files. Acceptance criteria.'"*

### Third most common: Dev hat just describes, doesn't implement

**What you'll see:** Claude says *"I would change /lib/auth.ts to do X..."* with no actual edits.

**Intervention:**
> *"Tell Claude: 'Don't describe what you'd change. Make the actual code edits. Then run git diff to verify.'"*

### Fourth most common: Pods skip the ambiguity list

**What you'll see:** Dev hat output is 200 lines of code with no surfaced ambiguities.

**Intervention:**
> *"Stop. The ambiguities are the prize, not the code. Tell Claude: 'List every ambiguity you encountered. Quote the exact PRD line. Explain why.'"*

### Fifth most common: Pods running out of time

**What you'll see (at minute 18 of pod work):** Pods still in Role 2.

**Intervention (announce to the room):**
> *"Five minutes left. If you're at Role 2 — STOP. Don't fake Role 3. Save your skill. Write your trigger. The honest 'we ran out of time' report is the deliverable."*

This is critical. Pods will be tempted to fake Role 3. Don't let them.

---

## Time anchors during pod work

Keep these in mind as you walk the room:

- **Minute 5 of pod work (18:07):** Pods should be done with Step 0 (Synthesize). If still synthesizing, push them forward.
- **Minute 12 (20:14):** Pods should be in Role 2 (Dev hat). If still in Role 1, they're going to run out of time.
- **Minute 18 (20:20):** **Announce the 5-minute warning.** Stop after Role 2 honestly. Save the skill. Write the trigger.
- **Minute 23 (20:25):** Stop. Move to share-back.

---

## Share-back (5 min) — how to pick pods

You have 5 min, 3 pods, 90 sec each. Pick strategically — don't take volunteers.

While walking the room, identify:
1. **One pod that completed all 4 steps** (rare but possible)
2. **One pod that honestly stopped at Role 2** (model the right behavior)
3. **One pod that found a surprising ambiguity** (strongest learning moment)

**Don't pick three pods who finished perfectly.** That obscures the lesson — which is that real PRDs always have ambiguities. The "we stopped honestly at Role 2" pod is often the most useful share-back.

For each sharing pod:
- Feature they chose (15 sec)
- One thing the spec got wrong (45 sec — the most useful answer)
- One thing they learned about their own spec process (15 sec)
- "I will use this skill when ___" trigger (15 sec)

---

## Failure modes for the LIVE DEMO (and recovery scripts)

### If `feedback.csv` is empty or unreadable

**Action:** Switch to backup recording immediately.

**Script:**
> *"My CSV file is being weird tonight — let me show you a recording of yesterday's run."*

Cmd+Tab to your dry-run video. Play it. Don't fake it as live.

### If Claude won't switch hats (keeps writing PRD when asked for Dev work)

**Push-back prompt:**

```
Stop describing. PM mode is over. You are now Dev. Make the actual
code edits in the files. I want git diff to show real changes. If you
keep writing PRD content, I'll know you're stuck in PM mode.
```

### If Claude implements but doesn't surface ambiguities

**Push-back prompt:**

```
Now list every ambiguity in the PRD that you encountered during
implementation. Quote the exact PRD line. Explain why. If you don't
list any, you're hiding them — which means PM-you didn't get the
feedback PM-you needs.
```

### If your demo is running long (you're at minute 12 and still in Step 1)

**Decision tree:**
- **At minute 12, still in Step 0 or 1:** Skip Role 3 in your demo. Wrap with: *"In the interest of time, I'll let you do Role 3 yourselves. The pattern is clear — let's start pod work."*
- **At minute 15, still demoing:** Stop the demo immediately. *"You've seen the pattern. Now do it."* Click to pod prep slide.

**Pod time is more valuable than demo time.** Don't let demo overrun eat pod work.

### If the demo lands in 12 minutes instead of 17

Possible. Use the extra 5 min to:
- Run `git log` and show that the demo's changes are committable
- Open the saved skill and read the entire frontmatter aloud
- Ask the room: *"What questions do you have before you do this yourselves?"* (this is rare but lands hard)

---

## Bridge into Part 4's break-of-day moment

When pod work ends and you're moving to share-back, this Part has the highest emotional weight in the workshop. People are tired (90 min into hands-on work). People discover things they didn't expect about their own spec process.

**Acknowledge the difficulty. Don't pretend it was easy.**

> *"That was the most cognitively dense Part of the night. If your head hurts, it's because you just did real work. Three pods are going to share what they shipped — let's hear it."*

---

## What success looks like at the end of Part 4

After 50 min, every pod should have:
1. ✅ A real PRD in `docs/prd-{feature}.md` citing specific files
2. ✅ Real code changes (visible in `git diff`) — even if incomplete
3. ✅ An honest list of ambiguities that surfaced during implementation
4. ✅ A saved skill at `.claude/skills/prd-round-trip.md`
5. ✅ A "I will use this skill when ___" trigger

Pods who **honestly stopped at Role 2** should have items 1, 2, 3, 4, 5 — except the revised PRD. **That is a successful outcome, not a failure.**

If 60% of pods have items 1-3 + 5, you crushed it.

---

## Pre-mortem checklist (run this 5 min before Part 4 starts)

- [ ] Repo is in clean state (`git status` shows nothing modified)
- [ ] `workshop-data/feedback.csv` exists and has 200 rows
- [ ] `docs/prd-template.md` exists (verify by opening it)
- [ ] Backup recording is accessible via Cmd+Tab
- [ ] Terminal window is visible somewhere on screen
- [ ] You've practiced saying *"Stop after Role 2 honestly"* out loud at least 3 times

---

## The honest thing to remember

The point of Part 4 is not that pods finish. The point is that pods **discover the gap between what their spec said and what implementation needed.** That gap is real for every PM in the room, in every PRD they've ever written.

A pod that runs the full round-trip and finds 3 ambiguities has learned. A pod that fakes Role 3 to "finish on time" has learned nothing.

**Protect the honest stop.** Announce the 5-min warning. Repeat the "stop at Role 2" guardrail. Praise the pods who stopped honestly during share-back. The pedagogy depends on it.

---

*BrAIght Wave · Part 4 instructor step-by-step · Read once tonight, skim Thursday afternoon*
