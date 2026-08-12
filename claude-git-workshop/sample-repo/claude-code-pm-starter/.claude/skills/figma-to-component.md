---
name: figma-to-component
description: Generate a working component from a Figma frame, strictly using the project's design system tokens and primitives. Pushes back when the design diverges from the system. Use this when a designer hands you a Figma file and you want code that respects the system, not freelance pixels.
---

# Figma to Component

Generate a working component from this Figma frame: $ARGUMENTS

You will play two roles: **system reader first**, **component builder second**.

---

## Step 1 — Read the system FIRST

Before looking at the Figma frame, read these files in order:

1. `tokens.json` (or wherever design tokens live — check `CLAUDE.md` for the path)
2. `components/ui/` (or wherever the design system primitives live)
3. `CLAUDE.md` (for any project-specific component conventions)

Output a 5-line summary:
- **Tokens available:** [colors, spacing, typography, radii — name only, count]
- **Primitives available:** [Button, Input, Card, etc. — name only]
- **Conventions noted:** [from CLAUDE.md, anything that affects how components are written here]
- **Naming pattern:** [PascalCase, kebab-case, etc. — match it]
- **File location pattern:** [where new components go]

---

## Step 2 — Read the Figma frame

Use the Figma MCP to fetch the frame. List every visual element and what design system token or primitive it maps to.

If something in the design has **NO clear system equivalent**, do NOT invent one. Add it to a "Questions for designer" list.

Output format:

| Figma element | Maps to | Confidence |
|---|---|---|
| 16px gap | `spacing.4` | high |
| Heading | `Typography.h3` | high |
| "Pay now" button | `Button` variant=primary | high |
| Custom gradient bg | NO MATCH | — |

**Questions for designer:** [bulleted list of things that don't fit the system]

---

## Step 3 — Generate the component

Write the component using ONLY the system primitives and tokens listed in Step 1. Naming and file location follow the conventions you noted.

If you bent the system anywhere, mark the line with `// SYSTEM-BEND:` and explain why in a comment.

Save the file in the location matching the project's pattern.

---

## Step 4 — Self-review

Output a 1-paragraph design review of your own component:

- **Where did the system fit cleanly?** [1-2 sentences]
- **Where did you bend the system?** [list every `SYSTEM-BEND` and the reason]
- **What questions go back to the designer?** [restate from Step 2]
- **What did the designer probably not realize about the system constraints?** [1 sentence — this is the most useful output for the PM/designer running this skill]

---

## Notes for the user of this skill

- The Figma Dev Mode MCP must be connected (`claude mcp add figma`) before running this skill.
- Pass the Figma frame URL or node ID as the argument.
- If Step 1 returns "no design system found," stop. The skill is wrong for this project — you need a system first.
- The most valuable output is the "Questions for designer" list. Take it back to the designer before you ship the component, not after.
