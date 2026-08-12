# Part 4 — Collaborate: PRD Round-Trip

> **Scenario:** 200 rows of real customer feedback wait at `workshop-data/feedback.csv`. A 3-line PRD skeleton waits at `docs/prd-template.md`. Synthesize → write spec → implement → revise spec. Round-trip the full loop.
>
> **Time:** 23 minutes · **Save as:** `.claude/skills/prd-round-trip.md`

---

## Setup (60 seconds)

1. **Code tab → New session → Local** → `claude-code-pm-starter` folder
2. Verify both files exist:
   - `workshop-data/feedback.csv` (200 rows, EN + HE)
   - `docs/prd-template.md` (3-line skeleton)
3. **Rotate the keyboard** — whoever didn't type in Parts 2 & 3 types now

---

## The round-trip pattern (4 steps: 0 → 1 → 2 → 3)

### Step 0 — SYNTHESIZE

```
Read workshop-data/feedback.csv. It contains 200 rows of customer feedback
for InvoiceFlow. Synthesize: what is the top theme by impact and frequency?
Define a concrete feature that addresses it. Be specific — files involved,
acceptance criteria. No vague "improve UX."
```

Wait. **Output should be a real, codable feature.** Not a strategy bullet.

### Step 1 — PM HAT (Role 1)

```
Now put on your PM hat. Open docs/prd-template.md — it's a 3-line skeleton.
Fill it in for the feature you just defined. Use the codebase as evidence.
Cite specific files where the change would happen. Save as
docs/prd-{feature-name}.md.
```

Open the saved PRD. **Read it aloud.**

### Step 2 — DEV HAT (Role 2)

```
Now switch to Dev hat. Read your own PRD cold — pretend the PM is a different
person. Implement the feature in code. While you implement, note every
ambiguity in the PRD that's slowing you down. Quote the exact PRD line that's
ambiguous and explain why.
```

Wait. **Real code changes happen here.** Run `git diff` to see them.

### Step 3 — PM HAT AGAIN (Role 3)

```
Now read the diff you just made. Read the PRD again. Revise the PRD to fix
every ambiguity that came up during implementation. Be honest — if you cut
corners as Dev, say so as PM. Save as docs/prd-{feature-name}-v2.md.
```

---

## Push back when Claude is vague

```
That's too abstract. Give me a feature concrete enough that an engineer
could code tomorrow.
```

```
Quote the PRD line that was ambiguous. Don't paraphrase it.
```

```
What did you cut as Dev that PM-you should know about?
```

```
Be more honest about what didn't fit the timeline.
```

---

## What success looks like

✅ A real PRD in `docs/prd-{feature}.md` citing specific files
✅ Real code changes (visible in `git diff`)
✅ A revised PRD in `docs/prd-{feature}-v2.md` with the ambiguities resolved
✅ The honest list of "what was ambiguous" — this is half the lesson
✅ Skill saved as `.claude/skills/prd-round-trip.md`

---

## ⚠️ The honest stop

If you run out of time at Step 2 (Dev hat) — **stop. Don't fake Step 3.**

The honest report — *"we ran out of time at Step 3, here's what we'd revise if we had it"* — is more useful than a faked Step 3. The whole point of the round-trip is to surface where your spec process breaks down. Faking it defeats the purpose.

---

## When to stop and save

At the **18-minute mark.** Save the skill:

```
Save this round-trip pattern as `.claude/skills/prd-round-trip.md`.
Include the synthesize step at the top — not just the round-trip.
```

---

## Write your trigger (the most important one of the day)

> **"I will use this skill when ___."**

Examples that work:
- "When the next feature debate happens at standup"
- "Before sending any PRD to engineering — I'll round-trip it myself first"
- "When a feature gets bounced back as 'unclear'"

Examples that **don't** work: "Eventually." "When I have time." "Maybe."

---

*BrAIght Wave · Part 4 handout · Keep on the table all 23 min*
