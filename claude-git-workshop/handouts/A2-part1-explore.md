# Part 2 — Explore: Product Audit

> **Scenario:** You just joined the InvoiceFlow team. The CEO wants a 1:1 in 30 minutes. You've never seen the product before. Use Claude Code to produce a 1-page audit.
>
> **Time:** 24 minutes · **Save as:** `.claude/skills/product-audit.md`

---

## Setup (60 seconds)

1. Open **Claude Desktop** → click **Code** tab
2. Click **New session** → **Local** → pick the **`claude-code-pm-starter`** folder
3. Confirm CLAUDE.md is recognized — you should see it referenced in the file panel
4. Type the warmup prompt: *"Read CLAUDE.md and confirm what this project is."*
5. **Rotate the keyboard** — pick who types this Part (different person than Parts 3 & 4)

---

## The 4-step pattern

### Step 1 — SURVEY (turn plan mode ON)

```
Survey this codebase. Identify what this product is, every user-facing
feature, and the major moving parts (auth, data model, integrations,
exports). Don't write the audit yet — just the survey.
```

Wait for response. Read it aloud as a pod.

### Step 2 — PUSH BACK ON YOURSELF

```
Now push back on what you just said. What did you miss? What's the
riskiest part of this codebase that I should know as a new PM? What
did you over-trust from the README?
```

Wait. Read aloud.

### Step 3 — AUDIT (turn plan mode OFF)

```
Now write the 1-page audit. Format:
- What this product is (1 paragraph)
- User-facing features (each with file path)
- Three things that look half-built or buggy (with file evidence)
- Three quick-win opportunities shippable in a sprint (with file paths)
- Three questions for the CEO

Be specific. Cite files for every claim.
```

### Step 4 — SELF-CRITIQUE

```
Read the codebase one more time. Find 3 things in your own audit that
are wrong, missing, or under-specified. Be honest — if your audit was
thin somewhere, say so.
```

---

## Push back when output is "good enough"

The Challenger's job. Use these:

```
Show me where in the codebase that's true.
```

```
What assumptions are you making about this?
```

```
Look more carefully at /lib/auth.ts — what's actually going on there?
```

```
Search for "formatCurrency" — how many places format currency?
```

---

## What success looks like

✅ Audit identifies **all 3 hotspots** (auth tangle, two PDF libraries, currency duplication)
✅ Every claim cites a specific file path
✅ Quick wins are shippable in a sprint, not "rewrite everything"
✅ CEO questions are pointed (not "what's the strategy")
✅ Self-critique surfaces real gaps (not just "looks good")

---

## When to stop and save

At the **18-minute mark.** Stop the audit work even if not perfect. Save the pattern as a reusable skill:

```
Save this 4-step pattern as `.claude/skills/product-audit.md` with
proper frontmatter (name, description). Make the skill general enough
to work on any codebase, not just this one.
```

Confirm the file appears in `.claude/skills/`. Open it. Read it.

---

## Write your trigger

Before the share-back, finish this sentence on a sticky note:

> **"I will use this skill when ___."**

Examples that work:
- "When I join a new team in week 1"
- "When I inherit a stuck project"
- "Before scoping any feature in a codebase I haven't seen in 3+ months"

Examples that **don't** work: "Eventually." "Sometimes." "When relevant."

---

## If you finish early (Track-C stretch)

Try the SSO scoping task — use the same skill on a hypothetical "add Google + Microsoft SSO" feature. Note where the skill works and where it falls short.

---

*BrAIght Wave · Part 2 handout · Keep on the table all 24 min*
