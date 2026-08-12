---
name: figma-to-component
description: Generate a component from a Figma frame using only the project's design system tokens and primitives. Enforces system discipline: no invented colors, no raw hex values, no approximations when an exact match exists. Marks every deviation with SYSTEM-BEND and escalates unresolved gaps to the designer. Use when a designer hands you a Figma URL and you want code that respects the system, not freelance pixels.
---

# Figma → Component (4-step pattern)

Argument: a Figma frame URL or node ID — `$ARGUMENTS`

You play two roles: **system reader first**, **component builder second**. Never reverse the order.

---

## Step 1 — Read the design system

Before opening Figma, read these files in order:

1. `tokens.json` — colors, spacing, typography, radii. This is the source of truth.
2. `components/ui/` — every primitive (Button, Input, Card, Badge, Table, etc.). Note each component's **baked-in defaults** (classNames it applies unconditionally), because those are the constraints you must work within or explicitly bend.
3. `CLAUDE.md` — project conventions (naming, server vs client components, what you must never do).
4. `tailwind.config.ts` — check which tokens are **actually wired** as Tailwind classes. A token in `tokens.json` does NOT automatically exist as a Tailwind class. If `surface.*` colors are not in the config, `bg-surface-background` will silently do nothing.

Output a summary:
- **Color tokens:** list every token name and its hex value
- **Spacing tokens:** list the scale values
- **Typography tokens:** list each style with size and weight
- **Primitives:** list each component and its baked-in defaults
- **Tailwind gaps:** list any token groups NOT registered in tailwind.config.ts
- **Conventions:** anything from CLAUDE.md that affects component authoring

---

## Step 2 — Read the Figma frame and map every element

Use the Figma MCP (`get_metadata` then `get_design_context`) to inspect the frame.

For every visual element, answer: **which token or primitive does this map to?**

Output table:

| Element | Figma value | Maps to | Notes |
|---|---|---|---|
| Page background | #FFFFFF | `surface.background` → `bg-white` (Tailwind built-in; token not in config) | SYSTEM-BEND candidate |
| Section heading | ~32px bold | `typography.h1` (2rem/700) | Check if a heading primitive exists |
| Muted label | 14px, #64748B | `typography.small` + `ink.500` → `text-sm text-ink-500` | Clean match |
| Table header fill | light gray | `TableHead` default = `bg-ink-100` | Confirm design matches default |
| Badge "Free" | white pill | `Badge variant="default"` | Verify variant visually |

**Rules for this step:**
- If a token exists but is not in `tailwind.config.ts`, note it. Do not use a raw hex value to work around it — that is a SYSTEM-BEND, and raw hex codes are never allowed.
- If no token or primitive maps to the element, add it to the **Questions for designer** list. Do not invent a token or approximate with a close-enough value.
- Check whether primitive defaults (e.g. `TableHead` adds `bg-ink-100`, `TableRow` adds `border-b border-ink-300`) match the design. If they don't match, that is a SYSTEM-BEND — flag it now, don't silently override it in Step 3.
- Note any Figma placeholder text (copy like "This is a footer sample…") — that is annotation, not data. Never hardcode it into the component.

**Questions for designer:**
- Bulleted list of every element with no system match
- Any primitive default that conflicts with the design (get confirmation before overriding)
- Any typography style that needs a new token (e.g. body-semibold)

Save these questions to `docs/designer-questions.md` using the format established in that file.

---

## Step 3 — Generate the component

**Hard rules:**
- Use ONLY the primitives from `components/ui/`. No raw `<div className="bg-[#6366F1]">` style — use `bg-brand-600`.
- No raw hex values anywhere in the file. If a token exists for the color, use the token class. If no token exists, that is a SYSTEM-BEND — mark it and use the closest built-in (e.g. `bg-white` for `surface.background`).
- Use `lib/currency.ts` for all money formatting. Never format currency inline.
- Server component by default. Add `"use client"` only if the component needs state, effects, or browser APIs.
- For typography: Tailwind JIT supports arbitrary values — `text-[2rem]` will honor a token exactly. Use it before reaching for a named scale step that approximates the token.
- Do not render Figma placeholder copy as real content. If a field (e.g. `footerNote`) doesn't exist in the schema, omit the section entirely and leave a comment.

**For every place you bend the system, mark it:**
```tsx
// SYSTEM-BEND: <one-line reason>
```

Categories of bends you will encounter:
- **Token not in Tailwind config** — e.g. `surface.background` exists in `tokens.json` but not in `tailwind.config.ts`; must use `bg-white`
- **Typography size gap** — token specifies a size but no Tailwind class maps to it; use `text-[Xrem]` for an exact match before approximating
- **Missing token** — design needs something (e.g. body-semibold) that has no token; flag it, use the closest utility, add to designer questions
- **Primitive default override** — a primitive bakes in a style (e.g. `TableHead` → `bg-ink-100`) that the design doesn't want; only override after designer confirmation
- **No applicable primitive** — design needs an element (e.g. h1 heading) for which no primitive exists; use the closest available primitive (`CardTitle`) and flag it as undersized/wrong — do NOT invent a custom style

---

## Step 4 — Self-review

Before reporting done, run this checklist against your own component:

**Hex codes:**
- Grep the file for `#`. There should be zero hex values. Every color must be a token class or (if unavoidable) a Tailwind built-in with a SYSTEM-BEND comment.

**Approximations:**
- Did you use `text-3xl` when `text-[2rem]` would have matched the token exactly? If so, fix it.
- Did you use `p-10` or any spacing value NOT in the token set (1, 2, 3, 4, 6, 8, 12)? If so, justify it.

**Primitive overrides:**
- Did you override a primitive's default className without a confirmed designer answer? If so, revert and add to designer questions instead.

**Hardcoded content:**
- Is any rendered text copied from Figma annotations ("This is a sample…", "Your name here")? If so, remove it.

**Unnecessary bends:**
- Re-read each SYSTEM-BEND comment. Ask: could this bend have been avoided with a different primitive, an arbitrary Tailwind value, or by just accepting the primitive's default? If yes, fix it — an honest bend is one where the system genuinely lacks what the design needs.

**Output:**
| # | SYSTEM-BEND | Avoidable? | Goes to designer? |
|---|---|---|---|
| 1 | bg-white for surface.background | No — token not in Tailwind config | Yes — Q: add surface.* to config? |
| 2 | CardTitle for h1 heading | No — no h1 primitive exists | Yes — Q: add Heading primitive? |
| 3 | font-semibold on body text | No — no body-semibold token | Yes — Q: add token? |

---

## Checklist before handing back

- [ ] Zero hex values in the generated file
- [ ] Every SYSTEM-BEND is genuinely unavoidable (not lazy)
- [ ] All designer questions saved to `docs/designer-questions.md`
- [ ] No Figma placeholder copy rendered as content
- [ ] Currency formatted via `lib/currency.ts`
- [ ] Component is a server component unless state/effects required
