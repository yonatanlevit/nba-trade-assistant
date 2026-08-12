# Part 4: PRD Round-Trip — Step-by-Step

> **Time:** 23 minutes · **Save as:** `.claude/skills/prd-round-trip.md`
>
> **What you're doing:** Synthesize real customer feedback → write a PRD → switch hats and implement it → revise the PRD with what implementation surfaced. Round-trip the full spec-to-shipped loop.

---

## Setup (60 seconds)

1. Open **Claude Desktop** → click **Code** tab
2. Click **New session** → **Local** → pick the **`claude-code-pm-starter`** folder
3. Confirm two files exist by typing in chat:
   ```
   Confirm that workshop-data/feedback.csv and docs/prd-template.md
   both exist.
   ```
4. **Rotate the keyboard** — whoever didn't type in Parts 2 and 3 types now

---

## Step 0 — SYNTHESIZE (4 min)

**The most important step. Don't skip it.**

Type this prompt:

```
Read workshop-data/feedback.csv. It contains 200 rows of customer
feedback for InvoiceFlow. Synthesize: what is the top theme by impact
and frequency? Define a concrete feature that addresses it. Be
specific — files involved, acceptance criteria. No vague "improve UX."
```

Wait ~30-60 sec. Read the output **aloud as a pod.**

### What good looks like

✅ A specific feature an engineer could code tomorrow
✅ Files involved are real paths (e.g., `app/(dashboard)/invoices/new/page.tsx`)
✅ At least 2-3 customer quotes from the feedback support the feature
✅ Acceptance criteria are testable (concrete verbs)

### If output is vague — push back

Examples of bad output: "Improve onboarding." "Better UX." "More integrations."

Push back with:

```
That's too abstract. Give me a feature concrete enough that an engineer
could code tomorrow. Files involved. Acceptance criteria. Quote 2-3
real feedback rows that support this feature.
```

**Lock the feature before moving on.** Read it aloud. Everyone in the pod agrees on what you're building.

---

## Role 1 — PM HAT (5 min)

You are the PM. You're filling in the spec.

Type this prompt:

```
Now put on your PM hat. Open docs/prd-template.md — it's a skeleton.
Fill it in for the feature you just defined. Use the codebase as
evidence. Cite specific files where the change would happen. Save as
docs/prd-{feature-name}.md (replace {feature-name} with whatever you
named your feature).
```

Wait ~60-90 sec. **Open the saved PRD file** in the file panel. **Read it aloud.**

### What good looks like

✅ Problem statement references real customer feedback rows
✅ Acceptance criteria are testable (no "should be intuitive")
✅ Files involved cites real paths from the codebase
✅ Open questions section is filled in (this is where ambiguity hides)

### If the PRD is generic — push back

```
This reads like a template, not a PRD for THIS codebase. Cite specific
files. Reference the existing patterns. Point out where this feature
fits into the current code structure.
```

---

## Role 2 — DEV HAT (8 min)

**You're now the Dev. Read the PRD cold — pretend a different person wrote it.**

Type this prompt:

```
Now switch to Dev hat. Read your own PRD cold — pretend the PM is a
different person. Implement the feature in code. Make actual file
changes. While you implement, note every ambiguity in the PRD that's
slowing you down. Quote the exact PRD line that's ambiguous and
explain why.
```

Wait ~2-3 min. Claude will make real code edits AND list ambiguities.

**Verify the code changes are real.** Open a terminal and run:

```bash
git diff
```

You should see actual file changes.

### What good looks like

✅ Real code changes (not just descriptions of what would change)
✅ A list of 3+ ambiguities encountered during implementation
✅ Each ambiguity quotes the exact PRD line that was unclear
✅ Each ambiguity explains why it was unclear and what the Dev decided

### If Claude just describes (doesn't implement) — push back

```
Don't describe what you'd change. Make the actual code edits. Then
run git diff to verify you made real changes.
```

### If Claude doesn't surface ambiguities — push back

```
List every ambiguity you encountered during implementation. Quote the
exact PRD line. Explain why. If you don't list any, you're hiding them.
```

**The list of ambiguities is the prize, not the code.** Read it aloud.

---

## Role 3 — PM HAT AGAIN (5 min)

You're the PM again. The Dev gave you a list of ambiguities. Fix them.

Type this prompt:

```
Now read the diff you just made. Read the PRD again. Revise the PRD
to fix every ambiguity that came up during implementation. Be honest —
if you cut corners as Dev, say so as PM. Save as
docs/prd-{feature-name}-v2.md.
```

Wait ~60-90 sec. **Open both PRDs** (v1 and v2) side by side. Compare them.

### What good looks like

✅ Each ambiguity from Role 2 is now resolved in v2
✅ "Should be intuitive" → replaced with specific behavior
✅ Edge cases that came up in implementation are documented
✅ The revised PRD reads like something engineering could ship without questions

---

## ⚠️ If you run out of time

**Stop at Role 2. Don't fake Role 3.**

The point of this exercise is to surface ambiguities in your spec process. If you fake Role 3, you've learned nothing. The honest report — *"we ran out of time at Role 3, here's what we'd revise if we had it"* — is more useful than a faked Role 3.

**The 5-minute warning will come at minute 18.** When it does:
- If you're in Role 1: you're behind, sprint
- If you're in Role 2: stop after this step. Save the skill.
- If you're in Role 3: finish what you started

---

## Save as a skill (90 seconds)

Once you're done (or honestly stopped), save the pattern:

```
Save this round-trip pattern as `.claude/skills/prd-round-trip.md`.
Include the synthesize step at the top — not just the round-trip.
Make it general enough to work for any feature, not just this one.
```

Verify the file appears in `.claude/skills/`. Open it. Read the frontmatter.

---

## Write your trigger (90 seconds)

The most important moment of the day. Finish this sentence on a sticky note:

> **"I will use this skill when ___."**

### Examples that work

- *"When the next feature debate happens at standup"*
- *"Before sending any PRD to engineering — I'll round-trip it myself first"*
- *"When a feature gets bounced back as 'unclear'"*
- *"Every Friday afternoon, I'll round-trip one PRD from the next sprint"*

### Examples that don't work

- *"Eventually"* ❌
- *"When I have time"* ❌
- *"Maybe"* ❌
- *"For important features"* ❌

Be specific. Be concrete. The trigger is what gets this skill out of the workshop and into your week.

---

## Push-back playbook (use anytime Claude is being vague)

| When Claude says... | Push back with... |
|---|---|
| "Improve UX" | *"That's too abstract. Give me a specific behavior change. Quote feedback rows."* |
| "Should be intuitive" | *"Define intuitive. What's the specific interaction?"* |
| "Will need refinement" | *"Refine it now. What's the actual decision?"* |
| "Various edge cases" | *"List them. Each one. Quote the PRD line."* |
| Generic implementation | *"Quote the PRD line you implemented and the code change you made."* |

---

## What success looks like at minute 23

You should have all of these in your repo:

✅ A PRD at `docs/prd-{feature}.md` (Role 1 output)
✅ Real code changes (run `git diff` to see them)
✅ A revised PRD at `docs/prd-{feature}-v2.md` *(only if you completed Role 3 honestly)*
✅ A list of ambiguities surfaced during Role 2
✅ The skill saved at `.claude/skills/prd-round-trip.md`
✅ A sticky note with your "I will use this skill when ___" trigger

**If you stopped honestly at Role 2:** you have everything except the revised PRD. That's a complete, successful outcome. Don't fake the missing item.

---

## After Part 4: what to share

Each sharing pod (90 sec each) covers:

1. **The feature you chose** (15 sec) — name it, one-line description
2. **One thing the spec got wrong** (45 sec) — the most useful answer
3. **One thing you learned about your own spec process** (15 sec)
4. **Your "I will use this skill when ___" trigger** (15 sec)

The most useful share-back is from a pod that found a surprising ambiguity — not from the pod that finished perfectly.

---

*BrAIght Wave · Part 4 participant guide · Keep on the table all 23 minutes*
