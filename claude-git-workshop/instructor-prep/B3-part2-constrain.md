# Instructor Prep — Part 3: Figma → Component

> **Audience:** You. ~15 minutes to read.
> **What this is:** Everything for delivering the Part 3 demo (15 min) and walking the room during pod work (23 min).
> **Total time:** 50 min · 18:55–19:45
> **Stakes:** This is the highest-MCP-risk Part of the workshop. Figma MCP is finicky. If it fails, you need to recover fast.

---

## The arc of Part 3

| Block | Time | What's happening |
|---|---|---|
| Frame slide | 30 sec | "PART 3 — Constrain" — slide 31 |
| Pattern slide | 2 min | The 4 steps — slide 32 |
| **Live demo walkthrough slide** | 1 min | Show prompts pods will use — slide 33 |
| **Live demo (you)** | 15 min | Forced failure → system-first — slide 33 |
| **Your turn prep slide** | 1 min | Read aloud — slide 34 |
| Pod work | 23 min | Task slide stays up — slide 35 |
| Share-back | 7 min | 1 pod presents — slide 36 |

---

## Why this exercise was designed this way

**The core insight:** Claude, by default, will generate code that *looks* right but uses raw hex values, invented component names, and ignores the design system entirely. This is the silent failure mode that causes design debt at every company that adopts AI coding without discipline.

**The 4-step system-first pattern (Read system → Read Figma → Generate → Self-review)** is the antidote. It forces Claude to ground itself in the existing design system *before* touching the new design.

**The forced-failure opening** is the key pedagogical move. You show the room what happens when you skip Step 1 — Claude invents tokens, uses raw colors, names primitives that don't exist. The room sees the failure mode. Then you show the right way. Without the failure first, the right way looks like overkill.

---

## The demo — sequence and exact prompts

### Step 0: Setup (30 sec)

- Code tab → New session → `claude-code-pm-starter` folder
- Verify Figma MCP is connected (Settings → MCP servers → "figma" shows connected, not error)
- Have the Figma frame URL copied to clipboard

### Step 1: The WRONG way (3 min) — forced failure

This is the pedagogical move. Commit to it.

```
Generate the InvoiceLineItem component from this Figma frame: [paste URL]
```

**Expected failure mode:**
- Claude generates code with raw hex colors (`color: #4A90E2`)
- Imports primitives that don't exist (`<DataRow>`, `<PriceCell>`)
- Doesn't read `tokens.json` first
- Doesn't reference `components/ui/` primitives

**What to say (3 minutes):**

> *"OK, let's see what we got."*
>
> *(Open the file. Pause. Show it on screen.)*
>
> *"What's wrong with this?"*
>
> *(Wait for the room. Someone will say 'it didn't read the design system' or 'those colors aren't from tokens.json'.)*
>
> *"Right. Look at this hex code. Is this from `tokens.json`? No. Claude invented it. Look at this `<DataRow>` import — does that primitive exist in `/components/ui/`? No. Claude invented it."*
>
> *"This is the silent failure mode. The code compiles. It looks right. But it's design debt the moment it's merged. Six months from now, your design system has 47 invented colors and no one knows where they came from."*
>
> *"This is what happens when you skip Step 1. Now let's do it right."*

### Step 2: The RIGHT way — system first (10 min)

#### 2a. READ THE SYSTEM (2 min)

```
Before doing anything else, read the design system in this repo. Look at:
- tokens.json (color tokens, spacing, typography)
- components/ui/ (existing primitives like Button, Input, Card)
- CLAUDE.md (any guidance about components)

Output what's available — tokens, primitives, conventions. Don't touch
the Figma file yet.
```

**Expected:** Claude lists tokens (`--color-primary`, `--spacing-md`, etc.), primitives (`Button`, `Input`, `Card`, `Badge`), and conventions from CLAUDE.md.

**What to say:**
> *"Notice — Claude is now grounded. It knows what's available before it sees what's needed. This is the system-first move."*

#### 2b. READ THE FIGMA (3 min)

```
Now read the Figma frame at [URL]. List every visual element.
For each one, identify which design-system token or primitive it should
map to. If no match, add it to a "Questions for designer" list — don't
invent a token.
```

**Expected:** A mapping table. *"Container = Card primitive. Title text = Body token. Price text = Body-Bold token. Icon = Icon primitive (size-md). Border-radius 12px = SYSTEM-BEND, no token at 12px..."*

**What to say:**
> *"Watch this list — 'Questions for designer.' This is the artifact. Every time Claude wants to invent something, it asks the designer instead. That list goes back to your designer in the next 1:1."*

#### 2c. GENERATE (3 min)

```
Now generate the InvoiceLineItem component. Use ONLY the system primitives
and tokens you identified. Do not invent colors. Do not use raw hex values.
Mark every place where you had to bend the system as `// SYSTEM-BEND:`
with a reason.
```

**Open the generated file. Search for `#` (hex codes).** If any appear, push back live:

```
You used a raw hex code on line 23. Replace it with the corresponding
token from tokens.json. Show me the diff.
```

**What to say:**
> *"This is the discipline. Every raw hex is a question. Every invented primitive is a question. The pattern catches them."*

#### 2d. SELF-REVIEW (2 min)

```
Review your own component. Find 3 things that are wrong or could be more
system-compliant. Be honest — what bends did you make that weren't
necessary? What goes back to the designer?
```

**Expected:** Claude surfaces honest gaps. *"I bent border-radius to 12px because no 12px token exists, but maybe spacing-3 (also 12px) was meant for this — flag for designer. I used Card primitive but Card has more padding than needed — flag for designer to confirm."*

### Step 3: Save as a skill (90 sec)

```
Save this 4-step pattern as `.claude/skills/figma-to-component.md`.
The skill should work for any future Figma → component task.
```

Open the file. Show it on screen. Bridge to pod work:

> *"Now you do it. Same pattern. 23 minutes. Save the skill at the end."*

---

## Pod work — what to watch for during 23 min

### Failure mode 1: Pods skip Step 1
Most common failure. Pods are excited to see the Figma rendering, so they jump to "generate." Their output looks good but is full of invented values.

**Intervention:** *"Did you read the design system first? Open `tokens.json` and tell me which tokens it has. Now ask Claude — does the Figma element match any of those?"*

### Failure mode 2: Figma MCP fails to connect
Common. Possible causes: token expired, file not shared with the right account, MCP server not started.

**Intervention sequence:**
1. Ask the pod to retry once (token refresh sometimes fixes it)
2. If still failing, fall back to the JSON export of the Figma frame (the floater has it on a USB stick)
3. If JSON also fails, give them the textual description of the frame and continue with the pattern

### Failure mode 3: Pods accept invented tokens
The Challenger role is critical here. If the designer in the pod isn't pushing back when Claude invents, intervene.

**Intervention:** *"Stop. Open `tokens.json`. Find that hex value Claude used. Is it there? No? Then it doesn't ship. Tell Claude: 'Replace it with the token, or add it to questions for designer.'"*

### Failure mode 4: "Questions for designer" list is empty
A red flag. If the list is empty, either Claude invented stuff silently (Step 3 failed) OR the Figma frame happened to map perfectly (rare — most real-world Figma files have at least 2–3 system gaps).

**Intervention:** *"Look at the generated component. Search for `#` and `SYSTEM-BEND`. Anything you find that isn't in the questions list — Claude is hiding from you."*

### Failure mode 5: Self-review is too kind
Some pods will get a self-review that says "looks good." That's a Claude pattern.

**Intervention:** *"Push back. Tell Claude: 'You wrote 8 lines of code. Find 3 things in those 8 lines that are wrong. Be honest.'"*

---

## How to time the room

- **Minute 4:** Most pods should be done with Step 1 (Read System). If still stuck, intervene.
- **Minute 10:** Most pods should be in Step 3 (Generate). If still on Step 2, push them forward.
- **Minute 18:** Stop new generation. "**5 minutes left. Self-review and save your skill.**"
- **Minute 23:** Stop. Share-back.

---

## Share-back — 7 min, ONE pod

Only one pod shares this Part (Parts 2 and 4 have multiple). Pick the pod with the **best "Questions for designer" list** — that's the artifact.

Why one pod: Part 3 has the most variation in Figma frames, so seeing many "different versions" is less useful than seeing one done well.

**The sharing pod shows (in order):**
1. The "Questions for designer" list (60 sec) — read 3 questions out loud
2. The generated component file (90 sec) — show that hex codes are replaced with tokens
3. Their "I will use this skill when ___" trigger (30 sec)

---

## What success at the end of Part 3 looks like

After 50 minutes, every pod should have:
1. ✅ A component file in `components/` with no raw hex codes
2. ✅ A "Questions for designer" list with at least 2–3 real questions
3. ✅ A `figma-to-component.md` skill saved in `.claude/skills/`
4. ✅ The realization that AI-generated code can either *respect* or *destroy* a design system depending on the pattern

If 70% of pods have all 4, you crushed it. (Lower bar than Part 2 because Figma MCP variability adds noise.)

---

## If your demo fails live

### Figma MCP doesn't authenticate
**Action:** Skip the live Figma read. Use a printed mock-up instead.

**Script:**
> *"Figma MCP is being slow today — let me show you the pattern with a fixed example, then your pods will try the real Figma read on their machines."*

Then describe the frame textually and run Steps 2c and 2d as if Step 2b succeeded.

### Generated component doesn't render
**Action:** Don't try to debug live. Move on.

**Script:**
> *"The render has issues — that's a separate problem. The pattern is what matters. Pods, focus on the system-first discipline, not the rendering."*

### Forced-failure step doesn't fail (Claude actually does it right first time)
**Rare but possible — Claude has been improving.** If it happens:

**Script:**
> *"Lucky day — Claude got it right without being told. But we can't count on that. Most days, you'll see the failure mode I was about to show you. Let me show you the failure on purpose."*

Then deliberately remove the design system context with a fresh session.

---

## What to say at the end of Part 3

Bridge to break (slide 37):

> *"That's the constrain pattern. AI generates fast, but undisciplined AI generates design debt. The pattern protects your system. Take 10 minutes. We come back for Part 4 — the full PRD round-trip. The most cognitively dense Part of the night, but also the one that pays off most for your day-to-day work."*

---

## Pre-mortem checklist

Before this Part starts, verify:
- [ ] Figma MCP is authorized in Claude Desktop (test with a real fetch)
- [ ] You have the Figma frame URL ready
- [ ] You have a JSON export of the frame as backup (USB stick)
- [ ] Your dry-run recording is in `~/workshop-fallback/captures/03-figma-component/`
- [ ] Your floater has been briefed on Figma MCP fallbacks specifically (this is their highest-likelihood intervention)

---

*BrAIght Wave · Instructor prep · Part 3 · Read tonight, skim before workshop*
