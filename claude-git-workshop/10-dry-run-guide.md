# Workshop Dry-Run Guide — Instructor's Run-Through

> **Purpose:** Run every demo and every pod exercise yourself before Thursday May 7. Capture each output as a backup asset so live failures on the day don't kill the workshop. This is the single most important pre-workshop action you can take.
>
> **Estimated time to complete:** 3–4 hours of focused work (do it in one sitting if possible — context switching costs you).
>
> **When:** Tonight or tomorrow morning. Not Thursday afternoon.
>
> **Format:** Read this top-to-bottom while sitting at your demo laptop. Execute as you go. Each section ends with a "Captured ✅" checkbox you'll mark as you complete it.
>
> **Output:** A folder of backup screen recordings + screenshots + completed exercise outputs. By the end of the dry-run you will have demonstrated to yourself that every workshop element works — and you'll have backups if any of them fail live.

---

## Table of Contents

- [Phase 0 — Setup the demo laptop](#phase-0)
- [Phase 1 — Part 1: Cowork live demo](#phase-1)
- [Phase 2 — Part 2: Product Audit (demo + pod exercise)](#phase-2)
- [Phase 3 — Part 3: Figma → Component (demo + pod exercise)](#phase-3)
- [Phase 4 — Part 4: PRD Round-Trip (demo + pod exercise)](#phase-4)
- [Phase 5 — Backup-asset inventory](#phase-5)
- [Phase 6 — Day-of routine](#phase-6)

---

<a id="phase-0"></a>
## Phase 0 — Setup the demo laptop

### Why this matters

The dry-run only validates the workshop if your demo laptop is in the same state participants will be in. Don't run the dry-run on a laptop with stale Claude Desktop installs, half-configured MCPs, or cached sample-repo state.

### Checklist (estimated 30 min)

**Laptop hygiene**
- [ ] Demo laptop is the SAME laptop you'll use Thursday (don't dry-run on a different machine)
- [ ] Laptop is fully charged + charger packed
- [ ] External monitor or projector cable tested if you'll project Thursday
- [ ] Sound output to room speakers tested (in case any demo has audio — Cowork doesn't, but worth checking)

**Software up to date**
- [ ] **Claude Desktop app** — open it, check menu → "Check for Updates" → install latest
- [ ] **Verify the Code tab is visible** at the top of the window (this is the bug your participant hit Tuesday)
- [ ] **Verify the Cowork tab is visible** at the top of the window (this is the v9 addition)
- [ ] Git installed (`git --version` in Terminal returns 2.x)
- [ ] Node + npm installed (`node --version` returns 18+, `npm --version` returns 9+)
- [ ] **Working internet connection** at the dry-run location (test by loading a video — you don't want bandwidth surprises)

**Workshop materials staged**
- [ ] Sample repo cloned to a known location: `~/workshop-fallback/claude-code-pm-starter`
- [ ] `cd` into the repo, run `npm install`, run `npm run dev` once to confirm the Next.js app starts (proves the repo isn't broken)
- [ ] **Confirm `workshop-data/feedback.csv` exists** in the cloned repo (this is the file Cowork reads in Part 1)
- [ ] **Confirm `docs/prd-template.md` exists** (this is the Part 4 scaffold)
- [ ] **Confirm `tokens.json` exists** at the repo root (this is the design system for Part 3)
- [ ] **Confirm `components/ui/` folder has shadcn primitives** (this is what Part 3's component will use)

**Authentications**
- [ ] Claude Pro/Max account signed in to Claude Desktop
- [ ] **Cowork tab works** — click it, see the "Tasks" interface, no error messages
- [ ] **Code tab works** — click it, "New session" → "Local" → folder picker appears
- [ ] GitHub account signed in (browser)
- [ ] Figma account signed in (browser) with edit access to at least one file
- [ ] **Figma Dev Mode MCP** authorized in Claude Desktop — Settings → MCP servers → confirm "figma" is connected (not error state)

**Backup folder created**
- [ ] Create `~/workshop-fallback/captures/` on your demo laptop
- [ ] This is where you'll save all the screen recordings + screenshots from the dry-run
- [ ] Inside it, create 4 subfolders: `01-cowork-demo/`, `02-product-audit/`, `03-figma-component/`, `04-prd-roundtrip/`

**Screen recording tool ready**
- [ ] Mac: built-in Screenshot app (Cmd+Shift+5) — you can record portions of the screen
- [ ] Windows: built-in Snipping Tool or OBS
- [ ] **Test it once** — record 10 seconds, verify the file saves where you expect

### What you should be able to do after Phase 0

Open Claude Desktop. See three tabs at the top: Chat / Code / Cowork. Click Code → New session → Local → pick the cloned `claude-code-pm-starter` folder → it loads without error. **If any of that fails, fix it before moving to Phase 1.**

---

<a id="phase-1"></a>
## Phase 1 — Part 1: Cowork live demo

### What this is

In Part 1 of the workshop (Slide 6 in the deck, ~17:26–17:33), Shmulik switches to the Cowork tab in Claude Desktop and demos Cowork synthesizing customer feedback. **This is the highest-risk live demo of the entire workshop** — Cowork is brand-new, dependencies are unproven, and the demo runs for 7 minutes in front of 40 people.

**The whole point of doing this dry-run first:** if Cowork fails on the day, you have a backup screen recording you can play instead. You'll lose the live energy but the substance lands.

### What to do

**Step 1 — Open Cowork (1 min)**

- Open Claude Desktop
- Click the **Cowork tab** at the top
- Click "New task" (or whatever the latest UI calls it)
- Verify you can drag-and-drop a folder, OR there's a "Choose folder" button

**Step 2 — Point Cowork at the feedback folder (1 min)**

- Drag `~/workshop-fallback/claude-code-pm-starter/workshop-data/` into Cowork
- OR use Cowork's folder selector
- **You want Cowork to have access to the folder containing `feedback.csv`** — not just the file alone, since Cowork is folder-oriented

**Step 3 — Start screen recording (start now, before the prompt)**

Filename to use: `~/workshop-fallback/captures/01-cowork-demo/cowork-feedback-synthesis.mov`

Capture region: just Claude Desktop's window. You don't need the whole screen.

**Step 4 — Type the demo prompt (the EXACT prompt — don't improvise)**

```
Synthesize this customer feedback into a 1-page report — top 3 themes by impact, with representative quotes.
```

That's the prompt from the deck (Slide 6 speaker notes). Type it word-for-word. **The reason we use this exact prompt:** if you improvise on the day, you might get a different output than what your dry-run produced, and you'll lose your backup's relevance.

**Step 5 — Let Cowork run, narrate as you go**

Expected duration: 60–90 seconds.

While it runs, practice the narration line from the deck:
> *"This is Cowork analyzing the file. It's going to take 60–90 seconds. Notice the progress panel — it tells you what it's doing at each step. This is the same engine as Claude Code, just packaged for non-coding work."*

**Step 6 — When it finishes, evaluate the output**

You're looking for:
- Does the output identify 3 distinct themes? (yes/no)
- Are the themes sensible? (e.g., "PDF export issues," "currency display bugs," "checkout friction" — not "users seem unhappy")
- Are there representative quotes? (1–2 per theme)
- Is the format readable in under 30 seconds at a glance? (people in the back of the room need to be able to skim it)

**Step 7 — Stop the recording. Save a screenshot of the final output.**

Filename: `~/workshop-fallback/captures/01-cowork-demo/final-output.png`

Also: copy the text of the output to a file: `~/workshop-fallback/captures/01-cowork-demo/output-text.md`. This way if Cowork's UI changes between dry-run and Thursday, you still have the text content.

### Success criteria

- ✅ Cowork ran without errors
- ✅ Output is 3 clear themes with quotes
- ✅ Total run time was 60–90 seconds (Slide 6 budgets 7 min total — needs slack)
- ✅ Screen recording saved in `01-cowork-demo/`
- ✅ Final-output screenshot saved
- ✅ Output text saved as Markdown

### Failure modes & fixes

| Symptom | Fix |
|---|---|
| Cowork tab doesn't exist in Claude Desktop | Update Claude Desktop. If still missing, check [claude.com/download](https://claude.com/download) — Cowork requires latest version. |
| "Setting up Claude's workspace" stuck for >2 min | Quit and reopen Claude Desktop. Cowork updates itself silently; restarting nudges it. |
| "VM service not running" (Windows) | Reinstall Claude Desktop from claude.com/download (use the MSIX installer, not the older .exe). |
| Output is generic / not theme-specific | Re-prompt with: *"Be more specific. What concrete issues are users complaining about? Quote them."* — but log this; if Cowork needs a re-prompt to give a good answer, factor that into your live demo timing. |
| Output is 5+ pages of analysis instead of 1 page | Re-prompt: *"Make this one page. Top 3 themes only. 2 quotes per theme. Tight."* — same logging note. |
| Cowork takes >3 minutes to run | Bandwidth issue or Cowork is slow today. Make a note. **This is your single biggest argument for having the screen recording as backup.** |

### Hebrew variant (optional — if you want to test)

Some of your audience might respond better to a Hebrew prompt. Worth testing once:

```
סכם את משוב הלקוחות הזה לדו"ח של עמוד אחד — שלוש התמות המרכזיות לפי השפעה, עם ציטוטים מייצגים.
```

Run the same exercise with this prompt, save outputs to `01-cowork-demo/hebrew/`. **Only commit to this on the day if the Hebrew output quality is comparable.**

### Captured ✅

- [ ] Screen recording: `01-cowork-demo/cowork-feedback-synthesis.mov`
- [ ] Final output screenshot: `01-cowork-demo/final-output.png`
- [ ] Output text: `01-cowork-demo/output-text.md`
- [ ] (Optional) Hebrew run: `01-cowork-demo/hebrew/`

---

<a id="phase-2"></a>
## Phase 2 — Part 2: Product Audit

### What this is

Part 2 has two pieces:
- **(a) Instructor demo (~14 min, 17:45–17:59):** you walk through the 4-step product-audit pattern using the InvoiceFlow repo. End by saving the pattern as a skill.
- **(b) Pod exercise (~24 min, 17:59–18:23):** pods do the same exercise on the same repo. You walk the room.

You need to dry-run both. Run the demo first, then run the pod exercise from a fresh session — to validate that pods can actually do what you'll ask them to do.

### Part 2(a): Instructor demo dry-run

**Step 1 — Switch to the Code tab**

- Open Claude Desktop
- Click **Code tab** (not Cowork, not Chat)
- New session → Local → pick `~/workshop-fallback/claude-code-pm-starter/`

**Step 2 — Verify CLAUDE.md is recognized**

- The Code tab should show CLAUDE.md as having been read (usually a small indicator in the file panel, or Claude will reference it in the first response)
- Type: *"Read the CLAUDE.md and confirm what you see."*
- Claude should respond with a summary of CLAUDE.md's content (the project description for InvoiceFlow). If it doesn't, something's wrong with the repo's CLAUDE.md — investigate.

**Step 3 — Start screen recording**

Filename: `~/workshop-fallback/captures/02-product-audit/02a-instructor-demo.mov`

**Step 4 — Run Step 1 of the 4-step pattern (Survey)**

- Click into **plan mode** (the mode toggle button near the input)
- Type:

```
Survey this codebase. Identify what this product is, every user-facing feature, and the major moving parts (auth, data model, integrations, exports). Don't write the audit yet — just the survey.
```

- Expected duration: 30–60 seconds
- **What you're looking for:** Claude maps the InvoiceFlow features (login, dashboard, invoice creation, PDF export, etc.) without yet making opinionated claims about what's broken.

**Step 5 — Run Step 2 (Push back on yourself)**

- Stay in plan mode
- Type:

```
Now push back on what you just said. What did you miss? What's the riskiest part of this codebase that I should know as a new PM? What did you over-trust from the README?
```

- Expected: Claude surfaces nuance — "I assumed auth was simple but actually `/lib/auth.ts` mixes session logic with user lookup," etc.

**Step 6 — Run Step 3 (Audit)**

- Switch out of plan mode (now allowing edits)
- Type:

```
Now write the 1-page audit. Format:
- What this product is (1 paragraph)
- User-facing features (each with file path)
- Three things that look half-built or buggy (with file evidence)
- Three quick-win opportunities shippable in a sprint (with file paths)
- Three questions for the CEO

Be specific. Cite files for every claim.
```

- Expected duration: 60–90 seconds
- **What you're looking for:** the 3 deliberate hotspots show up:
  1. Auth tangle (`/lib/auth.ts` mixes concerns)
  2. PDF export uses TWO libraries (pdfkit + puppeteer) — looks like a half-finished migration
  3. Currency formatting duplicated in 4+ places
- **If Claude misses one of these three:** push back with *"Look more carefully at the PDF export code"* or similar. Note this in your demo prep — you may need a follow-up prompt on the day.

**Step 7 — Run Step 4 (Self-critique)**

- Type:

```
Read the codebase one more time. Find 3 things in your own audit that are wrong, missing, or under-specified. Be honest — if your audit was thin somewhere, say so.
```

- Expected: Claude identifies its own gaps. If it just says "looks good," push back with *"You wrote 3 quick wins — were any of them too vague? What would a senior engineer push back on?"*

**Step 8 — Save the working pattern as a skill**

- Type:

```
Now save this 4-step pattern as a reusable skill. Create the file at `.claude/skills/product-audit.md` with proper frontmatter (name, description). Make sure the skill is general enough to work on any codebase, not just this one.
```

- Expected: Claude writes a skill file matching the structure of the starter `product-audit.md` we already shipped
- **Critical check:** the skill file should appear in `.claude/skills/` in your file panel. Open it. Verify it's there.

**Step 9 — The "skills click" moment**

- Tell Claude: *"Now run that skill on a different folder — try `~/Downloads/` or `~/Desktop/`. Show me how the skill applies to a folder you've never seen."*
- Expected: Claude runs the same 4-step pattern on whatever's in that folder. **This is the moment in the demo that will land for the room.**

**Step 10 — The 60-second multi-perspective subagent teaser**

- Tell Claude:

```
Now spawn 3 subagents in parallel to audit InvoiceFlow from 3 angles: an Engineer (technical feasibility), an Executive (business framing), and a Designer (UX critique). Run them simultaneously, then show me all 3 outputs side-by-side.
```

- Expected: 3 outputs, each with a different perspective
- **This is the "what's possible later" moment** — don't over-explain it in the demo, just show it works.

**Step 11 — Stop the recording. Capture artifacts.**

- Save the audit output as text: `02-product-audit/02a-audit-text.md`
- Save a screenshot of the saved skill file: `02-product-audit/02a-skill-saved.png`
- Save a screenshot of the 3-subagent output: `02-product-audit/02a-subagents-output.png`

### Part 2(a) success criteria

- ✅ All 4 steps ran without error
- ✅ Audit identified all 3 deliberate hotspots
- ✅ Skill file saved successfully
- ✅ Skill works on a second folder
- ✅ 3 subagents produced 3 different perspectives
- ✅ Total dry-run time: under 14 min (the demo's budget)
- ✅ Screen recording captured

### Part 2(a) failure modes & fixes

| Symptom | Fix |
|---|---|
| Plan mode toggle isn't visible | Update Claude Desktop. Plan mode was added in mid-2025 versions. |
| Claude misses the auth hotspot | Add to your demo: *"Look at `/lib/auth.ts` specifically — what's the actual structure?"* |
| Claude misses PDF library duplication | *"Search the codebase for both 'pdfkit' and 'puppeteer'. What do you find?"* |
| Claude misses currency duplication | *"Grep for 'formatCurrency' or anything similar. How many places format currency?"* |
| Skill saves to wrong path | Verify with: *"Confirm the file path you just wrote to."* If it wrote to `~/Documents/` or similar, redirect: *"No — write to `.claude/skills/product-audit.md` in the current project."* |
| Subagent demo fails | Skip it for the live demo. The 4-step pattern is the actual lesson. The subagent moment is bonus. |

### Captured ✅

- [ ] Screen recording: `02-product-audit/02a-instructor-demo.mov`
- [ ] Audit text: `02-product-audit/02a-audit-text.md`
- [ ] Skill saved screenshot: `02-product-audit/02a-skill-saved.png`
- [ ] Subagents output screenshot: `02-product-audit/02a-subagents-output.png`

### Part 2(b): Pod exercise dry-run

**Why dry-run this if you already did the demo?**

Two reasons:
1. The pod exercise has 24 minutes, more than the demo's 14. Pods will have time to push back, redo steps, hit dead ends. You need to know what they'll experience.
2. Pods will use the **starter** `product-audit.md` skill from the repo (in `.claude/skills/`), not write their own from scratch. You need to verify that skill works as-is when invoked.

**Step 1 — Start fresh**

- Close the previous session
- New session → Local → pick the same repo
- **Do NOT re-use the previous session's context.** Pods will start clean; you should too.

**Step 2 — Verify the starter skill exists**

- In the file panel, navigate to `.claude/skills/product-audit.md`
- Open it. Confirm it has frontmatter with `name: product-audit` and a description
- This is the skill pods will invoke — if it's missing, we have a real problem

**Step 3 — Invoke the starter skill**

- Type:

```
Use the product-audit skill on this codebase.
```

- **What you're looking for:** Claude reads the skill file and runs all 4 steps automatically. If Claude doesn't recognize the skill, the file's frontmatter or location is wrong — fix it before Thursday.

**Step 4 — Time the full run**

- Note start time. Let it run all 4 steps.
- Expected: 8–12 minutes for the full 4-step run if Claude does it without interruption
- **If it takes longer than 15 min, pods will be in trouble.** They have 24 min, but they also have 4 people debating each step.

**Step 5 — Evaluate the output as a beginner would**

- Read the audit Claude produced. Pretend you've never seen InvoiceFlow before.
- Could you take this to the CEO with confidence? If not — what's missing?
- Does Claude say things you'd want to push back on? (Use the Pushback Playbook prompts from the cheat sheet.)
- This is the experience pods will have.

**Step 6 — Capture for backup**

Filename: `~/workshop-fallback/captures/02-product-audit/02b-pod-output.md` (the audit text)
Filename: `~/workshop-fallback/captures/02-product-audit/02b-screenshot-final.png`

### Part 2(b) success criteria

- ✅ Starter skill invoked successfully
- ✅ All 4 steps ran without manual intervention
- ✅ Total time was within 15 min (leaves 9 min for pod discussion + skill save in the 24-min budget)
- ✅ Output is genuinely useful (not generic)
- ✅ Captured

### Captured ✅

- [ ] Pod output text: `02-product-audit/02b-pod-output.md`
- [ ] Screenshot: `02-product-audit/02b-screenshot-final.png`

---

<a id="phase-3"></a>
## Phase 3 — Part 3: Figma → Component

### What this is

Part 3 is the highest-MCP-risk part of the workshop. Figma MCP is finicky. The 4-step pattern (READ SYSTEM → READ FIGMA → GENERATE → SELF-REVIEW) only works if MCP is connected and the Figma file is accessible.

### Pre-condition: Figma file ready

- [ ] You have a Figma file you can edit
- [ ] The file contains an "invoice line item" component (or any component you'll use as the workshop example — but consistency matters; pick one and use it for both demo and exercise)
- [ ] The Figma file is shared in a way participants can also access on Thursday (not just your account)
- [ ] **If you can't get a clean Figma file ready by Thursday, fall back to the JSON export approach** — see Floater Fallback Recipes file, Part 3 fallback

### Part 3(a): Instructor demo dry-run

**Step 1 — New Code session, repo open**

- New session in Code tab → Local → pick the repo
- This time you'll show pods the system-first pattern

**Step 2 — Start screen recording**

Filename: `~/workshop-fallback/captures/03-figma-component/03a-instructor-demo.mov`

**Step 3 — The forced-failure opening (3 min)**

This is the v8 pedagogical move — show Claude getting it wrong first.

- Type (deliberately bad prompt):

```
Generate the InvoiceLineItem component from this Figma file: [paste Figma frame URL]
```

- **Expected failure mode:** Claude generates code without first reading `tokens.json` or the existing `components/ui/` primitives. It invents colors. It uses raw hex values. It might invent component names that don't exist in the system.
- Pause the screen recording briefly. Switch to your "show the room" voice:
  > *"What's wrong with this output?"*
- The room will (hopefully) call out: it didn't read the system, it invented tokens, etc. **You're showing them the failure mode they need to recognize.**

**Step 4 — The system-first pattern (10 min)**

Restart the recording. Now do it right:

- Type (Step 1: READ SYSTEM):

```
Before doing anything else, read the design system in this repo. Look at:
- tokens.json (color tokens, spacing, typography)
- components/ui/ (existing primitives like Button, Input, Card)
- CLAUDE.md (any guidance about components)

Summarize: what tokens exist, what primitives exist, what conventions does the system use?
```

- Expected: Claude lists tokens (e.g., `--color-primary`, `--spacing-md`), primitives (`<Button variant="primary">`, `<Input>`, etc.), and conventions
- **Critical:** if Claude doesn't surface the actual tokens and primitives, your `tokens.json` or `components/ui/` may be incomplete. Investigate.

- Type (Step 2: READ FIGMA):

```
Now read the Figma file at [URL]. List the elements in the InvoiceLineItem frame. For each element, identify which design-system token or primitive it should map to.
```

- Expected: Claude reads the Figma frame via MCP and produces a mapping table. *"This rectangle = Card primitive. This text = Body token. This icon = Icon primitive."*
- **If Figma MCP fails:** retry once. If still failing, switch to the fallback (use `figma-frame-export.json` from `workshop-data/`).

- Type (Step 3: GENERATE):

```
Now generate the InvoiceLineItem component. Use ONLY the system primitives and tokens you identified. Do not invent colors. Do not use raw hex values. Mark every place where you had to bend the system as `// SYSTEM-BEND:` with a reason.
```

- Expected: Claude writes a `.tsx` file in `components/InvoiceLineItem.tsx` (or wherever appropriate)
- **Critical check:** open the file. Verify it imports from `components/ui/`, uses CSS variables for colors, and has zero raw hex values

- Type (Step 4: SELF-REVIEW):

```
Now review your own component. Find 3 things that are wrong or could be more system-compliant. Be honest — what bends did you make that weren't necessary?
```

**Step 5 — Save as skill**

- Type:

```
Save this 4-step pattern as `.claude/skills/figma-to-component.md`. The skill should work for any future Figma → component task.
```

**Step 6 — Capture artifacts**

- Save the generated component file: `03-figma-component/03a-component.tsx`
- Screenshot of the rendered component (if you can run the dev server and view it in browser): `03-figma-component/03a-rendered.png`
- Screenshot of the saved skill: `03-figma-component/03a-skill-saved.png`

### Part 3(a) success criteria

- ✅ Forced-failure opening landed (Claude visibly failed without system context)
- ✅ READ SYSTEM step surfaced real tokens and primitives
- ✅ READ FIGMA step worked via MCP (or fallback if needed)
- ✅ GENERATE produced a component with no raw hex values
- ✅ SELF-REVIEW surfaced honest bends
- ✅ Skill saved to `.claude/skills/figma-to-component.md`
- ✅ Captured

### Part 3(a) failure modes & fixes

| Symptom | Fix |
|---|---|
| Figma MCP not connected | Settings → MCP servers → re-authorize Figma. Restart Claude Desktop. |
| Figma MCP says "no access to this file" | The Figma file isn't shared with the right account. Check permissions in Figma. |
| Claude generates raw hex values anyway | Push back: *"Replace every hex code with the corresponding token from `tokens.json`. Show me the diff."* |
| Claude invents component names | Push back: *"Stop. List the components that actually exist in `components/ui/`. Use only those."* |
| The component file doesn't render | Check imports. Likely Claude imported from a wrong path. Have it fix. |

### Captured ✅

- [ ] Screen recording: `03-figma-component/03a-instructor-demo.mov`
- [ ] Component file: `03-figma-component/03a-component.tsx`
- [ ] Rendered screenshot: `03-figma-component/03a-rendered.png`
- [ ] Skill saved screenshot: `03-figma-component/03a-skill-saved.png`

### Part 3(b): Pod exercise dry-run

Same as 2(b) but for Figma → component:

- New session, repo open
- Invoke: *"Use the figma-to-component skill to generate the InvoiceLineItem component from [Figma URL]"*
- Time the run (target: under 18 min, leaving 5 min for pod discussion within the 23-min budget)
- Capture the output

### Captured ✅

- [ ] Pod output component: `03-figma-component/03b-pod-component.tsx`
- [ ] Screenshot: `03-figma-component/03b-screenshot-final.png`

---

<a id="phase-4"></a>
## Phase 4 — Part 4: PRD Round-Trip

### What this is

The most cognitively dense Part. Step 0 (synthesize feedback) → Step 1 (PM hat: write PRD) → Step 2 (Dev hat: implement) → Step 3 (PM hat again: revise PRD).

### Part 4(a): Instructor demo dry-run

**Step 1 — Fresh Code session**

- New session → Local → pick the repo
- Verify `workshop-data/feedback.csv` and `docs/prd-template.md` are visible

**Step 2 — Start screen recording**

Filename: `~/workshop-fallback/captures/04-prd-roundtrip/04a-instructor-demo.mov`

**Step 3 — Step 0: Synthesize**

- Type:

```
Read workshop-data/feedback.csv. It contains 200 rows of customer feedback for InvoiceFlow. Synthesize: what is the top theme by impact and frequency? Define a feature that addresses it. Be specific — don't say "improve UX." Pick a concrete feature.
```

- Expected: Claude returns a clear feature. Examples that would be valid: "Inline currency selector on the invoice creation page," "Bulk PDF re-export with progress indicator," "Save invoice draft to localStorage."
- **If Claude returns vague:** push back: *"Give me a feature concrete enough that an engineer could start coding tomorrow. Files involved. Acceptance criteria."*

**Step 4 — Step 1: PM hat**

- Type:

```
Now put on your PM hat. Open docs/prd-template.md — it's a 3-line skeleton. Fill it in for the feature you just defined. Use the codebase as evidence. Cite specific files where the change would happen.
```

- Expected: Claude writes a real PRD into `docs/prd-template.md` (or saves a copy as `docs/prd-[feature-name].md`)
- **Critical:** open the file. Confirm it has Problem, Users, Acceptance Criteria, all filled in with evidence

**Step 5 — Step 2: Dev hat**

- Type:

```
Now switch to Dev hat. Implement the feature in code. While you implement, note every ambiguity in the PRD that's slowing you down. Be specific — quote the PRD line that's ambiguous and explain why.
```

- Expected: Claude makes code edits AND surfaces ambiguities
- **Watch for:** does Claude actually implement, or just describe what would change? You want real diffs.

**Step 6 — Step 3: PM hat again**

- Type:

```
Now read the diff you just made. Read the PRD again. Revise the PRD to fix every ambiguity that came up during implementation. Be honest — if you cut corners as Dev, say so as PM.
```

- Expected: Claude rewrites parts of the PRD with concrete acceptance criteria, edge cases, etc.

**Step 7 — Save as skill**

- Type:

```
Save this round-trip pattern as `.claude/skills/prd-round-trip.md`. The skill should include the synthesize step at the top, not just the round-trip.
```

**Step 8 — Capture artifacts**

- Save the final PRD: `04-prd-roundtrip/04a-prd-final.md`
- Save the diff: `04-prd-roundtrip/04a-implementation.diff` (run `git diff` from the repo root)
- Save the saved skill: `04-prd-roundtrip/04a-skill.md`

### Part 4(a) success criteria

- ✅ Step 0 produced a concrete feature
- ✅ Step 1 produced a real PRD with file evidence
- ✅ Step 2 produced actual code changes (not descriptions)
- ✅ Step 3 surfaced honest ambiguities and revised the PRD
- ✅ Skill saved
- ✅ Total run time under 17 min (the demo's budget — pod budget is 23 min)
- ✅ Captured

### Captured ✅

- [ ] Screen recording: `04-prd-roundtrip/04a-instructor-demo.mov`
- [ ] Final PRD: `04-prd-roundtrip/04a-prd-final.md`
- [ ] Implementation diff: `04-prd-roundtrip/04a-implementation.diff`
- [ ] Skill: `04-prd-roundtrip/04a-skill.md`

### Part 4(b): Pod exercise dry-run

- Reset the repo (`git reset --hard` to undo the dev-hat changes from 4(a))
- New session → invoke the skill: *"Use the prd-round-trip skill on `workshop-data/feedback.csv`. Pick a different theme than [the one from 4(a)] so we test the skill's generality."*
- Time the run
- Capture

### Captured ✅

- [ ] Pod PRD output: `04-prd-roundtrip/04b-pod-prd.md`
- [ ] Pod diff: `04-prd-roundtrip/04b-pod-diff.diff`
- [ ] Screenshot: `04-prd-roundtrip/04b-screenshot.png`

---

<a id="phase-5"></a>
## Phase 5 — Backup-asset inventory

After completing Phases 1–4, this is what should exist on your demo laptop. Print this page. Cross-check Wednesday night.

### `~/workshop-fallback/captures/`

```
01-cowork-demo/
   ├── cowork-feedback-synthesis.mov          ← BACKUP for live Cowork demo
   ├── final-output.png
   ├── output-text.md
   └── hebrew/ (optional)

02-product-audit/
   ├── 02a-instructor-demo.mov                 ← BACKUP for live Part 2 demo
   ├── 02a-audit-text.md
   ├── 02a-skill-saved.png
   ├── 02a-subagents-output.png
   ├── 02b-pod-output.md                       ← Reference for "what good looks like"
   └── 02b-screenshot-final.png

03-figma-component/
   ├── 03a-instructor-demo.mov                 ← BACKUP for live Part 3 demo
   ├── 03a-component.tsx
   ├── 03a-rendered.png
   ├── 03a-skill-saved.png
   ├── 03b-pod-component.tsx
   └── 03b-screenshot-final.png

04-prd-roundtrip/
   ├── 04a-instructor-demo.mov                 ← BACKUP for live Part 4 demo
   ├── 04a-prd-final.md
   ├── 04a-implementation.diff
   ├── 04a-skill.md
   ├── 04b-pod-prd.md
   ├── 04b-pod-diff.diff
   └── 04b-screenshot.png
```

### What each backup is for

| If THIS fails live | Play THIS | While saying THIS |
|---|---|---|
| Cowork live demo (Slide 6) | `01-cowork-demo/cowork-feedback-synthesis.mov` | *"This is what Cowork normally produces — let me show you a recording from earlier this week."* |
| Part 2 product-audit demo | `02-product-audit/02a-instructor-demo.mov` | Same framing. Don't pretend it's live. |
| Figma MCP authorization fails | Skip live demo, play `03-figma-component/03a-instructor-demo.mov` | *"Figma MCP is being slow today — let me show you the pattern from yesterday's run, then we'll have pods try it on their machines."* |
| Part 4 demo | `04-prd-roundtrip/04a-instructor-demo.mov` | Same framing. |

### Sample-repo state for Thursday

After Phase 4, your repo has changes in it (the dev-hat implementation from Part 4(a)). **Reset it before Thursday:**

```bash
cd ~/workshop-fallback/claude-code-pm-starter
git reset --hard HEAD
git clean -fd
```

This restores the repo to the clean state pods will start from. **Critical — don't forget this step.**

---

<a id="phase-6"></a>
## Phase 6 — Day-of routine

### Wednesday evening (May 6, evening)

- [ ] Reset the sample repo to clean state (above command)
- [ ] Verify all 4 backup recordings play (open each one, watch 5 seconds)
- [ ] Charge laptop to 100%, charge phone to 100%
- [ ] Pack: laptop, charger, phone, phone charger, USB stick (with backups), business cards, water
- [ ] Print: cheat sheet (40 copies), floater fallback recipes (2 copies for floaters)
- [ ] Re-read the Slide 5b speaker notes — that's the credibility moment, doesn't pay to wing it

### Thursday afternoon (May 7, before participants arrive)

**Arrive 60 minutes before the workshop starts (16:00 if workshop is 17:00).**

**Setup checklist (30 min):**

- [ ] Set up projector / screen sharing
- [ ] Test deck on the projection screen — every slide displays correctly, fonts render, no Gamma surprises
- [ ] Open Claude Desktop. Verify Cowork tab and Code tab both work.
- [ ] Open the cloned sample repo in Code tab. Run the *"What does this app do?"* check to verify everything works.
- [ ] Open the backup-recordings folder. Have it minimized but ready (Cmd+Tab away).
- [ ] Open WhatsApp on phone. Verify the workshop room is active.
- [ ] Confirm WiFi credentials and that internet works.
- [ ] Charger plugged in (don't risk laptop dying mid-demo).
- [ ] Backup laptop (if you have one) also set up and ready.

**5 minutes before participants arrive:**

- [ ] Tabs at top of Claude Desktop: which tab is showing? Should be **Cowork** initially (since Slide 6 is the first demo). When you reach Part 2, you'll switch to Code.
- [ ] Slide 1 (Title) up on the projector.
- [ ] Sticky notes on every table.
- [ ] Cheat sheets on every table.
- [ ] Coffee/water available.
- [ ] Floaters briefed (15 min before) — make sure they have the fallback recipes file.
- [ ] Take 30 seconds to breathe.

### During the workshop

**Live-demo discipline:**
- For every live demo, have the corresponding backup recording open in another window.
- If a demo runs over 90 seconds without progress, **stop**. Don't keep the room watching a spinner. Switch to the recording with the framing line above.
- After every Part, walk to a floater and ask: *"How's the room? Any pods stuck?"*

**The "show, don't tell" reminder:**
- The most powerful moments in the workshop are when Claude does something visible and useful. Don't narrate over it. Let the room watch.
- Resist the urge to fill silence. 30 seconds of "Claude is thinking" is fine. The room is reading.

### After the workshop

- [ ] Save 5 minutes for one-on-one questions before participants leave
- [ ] Within 24 hours, send a follow-up email with: cheat sheet PDF, link to the WhatsApp room (still active), Friday commitment reminder
- [ ] Within 1 week, run a survey: what landed, what didn't, would they recommend
- [ ] Capture data for v10 — what to change for the next cohort

---

## Final checklist before you call this done

- [ ] All 4 instructor demos dry-run
- [ ] All 3 pod exercises dry-run
- [ ] All capture files in `~/workshop-fallback/captures/`
- [ ] Sample repo reset to clean state
- [ ] All software up to date
- [ ] Backup recordings tested (each plays correctly)
- [ ] WhatsApp room active and pre-populated with welcome message
- [ ] Cheat sheets printed
- [ ] Floater recipes printed for the 2 floaters
- [ ] Day-of routine reviewed

If all of the above is checked, you're ready. **Do this dry-run as soon as possible — tonight if you can.** The workshop's success on Thursday is mostly determined by whether this dry-run got done.

---

*BrAIght Wave · Claude Code Workshop · v9 · Dry-run guide for Shmulik · May 2026*
