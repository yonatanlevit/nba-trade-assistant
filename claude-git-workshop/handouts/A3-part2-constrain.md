# Part 3 — Constrain: Figma → Component

> **Scenario:** Your designer just shipped a Figma file with a new "invoice line item" component. Your design system lives in `components/ui/` with tokens in `tokens.json`. Generate the component — using the system, not custom values.
>
> **Time:** 23 minutes · **Save as:** `.claude/skills/figma-to-component.md`

---

## Setup (60 seconds)

1. **Code tab → New session → Local** → pick the **`claude-code-pm-starter`** folder
2. Verify the **Figma MCP** is connected (Settings → MCP servers)
3. Have the **Figma frame URL** ready (your instructor will share)
4. **Rotate the keyboard** — different typist than Part 2
5. **Rule swap:** the designer in your pod reads aloud this Part

---

## The 4-step pattern (system-first)

### Step 1 — READ THE SYSTEM FIRST

```
Before doing anything else, read the design system in this repo. Look at:
- tokens.json (color tokens, spacing, typography)
- components/ui/ (existing primitives like Button, Input, Card)
- CLAUDE.md (any guidance about components)

Output what's available — tokens, primitives, conventions. Don't touch
the Figma file yet.
```

Wait. The output is a list of tokens and primitives. **Read it aloud.**

### Step 2 — READ THE FIGMA FRAME

```
Now read the Figma frame at [PASTE URL HERE]. List every visual element.
For each one, identify which design-system token or primitive it should
map to. If no match, add it to a "Questions for designer" list — don't
invent a token.
```

Wait. The output is a mapping table. **The "Questions for designer" list is your prize.**

### Step 3 — GENERATE

```
Now generate the InvoiceLineItem component. Use ONLY the system primitives
and tokens you identified. Do not invent colors. Do not use raw hex values.
Mark every place where you had to bend the system as `// SYSTEM-BEND:`
with a reason.
```

Open the generated file. **Search for any raw hex codes (`#`). If you find them, push back.**

### Step 4 — SELF-REVIEW

```
Review your own component. Find 3 things that are wrong or could be more
system-compliant. Be honest — what bends did you make that weren't
necessary? What goes back to the designer?
```

---

## Push back when Claude bends the system

The designer's job this Part — be the system police. Use these:

```
Show me where in tokens.json that value exists.
```

```
Use the existing primitive instead — which one in components/ui/ is closest?
```

```
Don't invent. Add this to the "Questions for designer" list.
```

```
Replace every hex code in this file with the corresponding token.
Show me the diff.
```

---

## What success looks like

✅ The component file imports from `components/ui/` (uses real primitives)
✅ Zero raw hex codes — every color is a CSS variable from `tokens.json`
✅ Every deviation marked with `// SYSTEM-BEND:` and a reason
✅ A "Questions for designer" list with at least 2–3 real questions
✅ Self-review surfaces honest bends

---

## When to stop and save

At the **18-minute mark.** Save the pattern as a skill:

```
Save this 4-step pattern as `.claude/skills/figma-to-component.md`.
The skill should work for any future Figma → component task, not just
this one.
```

---

## Write your trigger

> **"I will use this skill when ___."**

Examples that work:
- "When a designer hands off any new component"
- "When I'm reviewing a PR that touches the UI"
- "Whenever someone says 'just match the Figma'"

---

## If Figma MCP fails

1. Try once more — sometimes it's a token refresh
2. If still failing, your floater has a JSON export of the Figma frame
3. Use that JSON instead of the live Figma URL — same pattern still works

---

*BrAIght Wave · Part 3 handout · Keep on the table all 23 min*
