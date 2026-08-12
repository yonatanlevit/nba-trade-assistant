# Instructor Prep — Cowork Live Demo

> **Audience:** You. Read this before your dry run. ~10 minutes.
> **What this is:** Everything you need to deliver the Cowork demo live in Part 1, including what to say, what to watch for, and what to do if Cowork misbehaves.
> **Time on stage:** 7 minutes (Slide 18 in the deck).
> **Stakes:** This is the highest-risk live demo of the workshop. Cowork is brand-new, untested in front of an audience, and the whole room is watching the screen for 7 minutes.

---

## Why this demo matters

Pages 16–19 of the deck establish: "There are 4 Claude products, you should know which one to use when, and tonight we go deep on Claude Code." But participants will leave the workshop thinking *"I know one tool."*

The Cowork demo is the moment that breaks that frame. Participants see, in 90 seconds, that Claude Desktop has a sibling tool that solves a different category of problem (knowledge work without code). It opens up their post-workshop world.

**If this demo fails to land**, participants leave thinking Claude Code is the only Claude product. That's a worse outcome than skipping the demo entirely.

So: either nail this, or skip it and play your dry-run recording. Don't half-deliver.

---

## What you're showing

A folder of 200 customer feedback rows (EN + Hebrew), turned into a 1-page synthesis with top themes, sentiment, and quotes. **Output that matches what an analyst would produce in 2 hours, in 90 seconds, with no copy-paste.**

The audience reaction you're aiming for: the room collectively realizing "wait, I could give Cowork my whole research folder and just... get a synthesis?"

---

## Setup — exact sequence

**Before the workshop starts (during your 60-min setup window):**

1. Open Claude Desktop
2. Click **Cowork** tab
3. Click **New task** — verify the interface loads, no errors
4. Have the `workshop-data/` folder ready on your desktop in a known location (suggested: `~/Desktop/cowork-demo/workshop-data/`)
5. Have the **screen recording** of your dry-run run open in another window (Cmd+Tab to it instantly)
6. Have your laptop on AC power

**At the moment of the demo (you're on Slide 18):**

1. Cmd+Tab to Claude Desktop
2. Cowork tab is already showing (you set it up before)
3. Drag the `workshop-data/` folder into the new-task interface
4. Type the prompt (memorized — see next section)
5. Hit enter
6. **Step away from the keyboard.** Don't fidget with the laptop while Cowork runs.

---

## The prompt — memorized

Type this exactly. No improvising.

```
Synthesize this customer feedback into a 1-page report —
top 3 themes by impact, with representative quotes.
```

**Why exactly this prompt:**
- Specifies "1-page" — bounds Cowork's tendency to write 5 pages
- "Top 3 themes by impact" — forces prioritization, prevents "users seem unhappy" generic output
- "Representative quotes" — anchors the output in real user voice (the Hebrew quotes will land for your audience)

Don't change "1-page" to "short." Don't change "themes" to "issues." This wording was tested.

---

## What to say while Cowork runs (60–90 sec of dead air)

Cowork will run for ~90 seconds. The room will be watching a progress indicator. You need to fill that time, not stand silently.

**Suggested narration (script, not memorize verbatim):**

> *"This is Cowork analyzing the file. It'll take 60 to 90 seconds. Notice the progress panel — it tells you what it's doing at each step. Reading the file. Identifying themes. Pulling representative quotes. Writing the report."*
>
> *(pause 5 seconds)*
>
> *"This is the same engine as Claude Code, just packaged for non-coding work. Same Sonnet underneath. Same agentic loop. Different interface."*
>
> *(pause)*
>
> *"The thing to notice: I haven't told it 'these are customer feedback rows' or 'use sentiment analysis.' It figured that out from reading the file. That's the agentic part."*
>
> *(by now Cowork should be near done)*
>
> *"Here we go..."*

---

## What good output looks like

Your dry-run output is your reference. The live output should look similar. Likely themes (based on the actual feedback.csv data):

1. **PDF export performance** — slow on large invoices, mid-migration between two libraries, multiple users frustrated
2. **Currency / VAT issues** — multi-currency confusion, European VAT not handled well
3. **Missing integrations** — Stripe, Google login, Hebrew UI support

If output deviates significantly from these themes, it's still fine — the data supports several theme groupings. What matters is that there are **3 distinct themes with real quotes**.

---

## What to do after the output appears

1. **Don't read the whole report aloud.** Point at it on the screen.
2. **Highlight 2 things only:**
   - "Notice it pulled both Hebrew and English quotes — and kept them in the original language."
   - "Notice the theme prioritization — it's not just frequency, it's impact."
3. **Bridge to Slide 19:**
   > *"That took 90 seconds. If I'd opened the CSV in Excel and tried to do this manually, I'd be here for 2 hours. This is what Cowork is for. Now — let's talk about when to use it vs Claude Code."*

---

## Failure modes — what to do if it goes wrong

### Cowork gets stuck on "Setting up workspace" for >2 min

**Action:** Stop. Don't wait. Switch to recording.

**Script:**
> *"Cowork is having a slow day — let me show you what it produces from yesterday's run."*

Cmd+Tab to your dry-run recording. Play it. Narrate over it as if you were running it live. **Do not pretend the recording is live.** Honesty about the failure builds trust; faking it destroys credibility if the room catches you.

### Output is generic ("users have concerns")

**Action:** One push-back attempt, then move on if it doesn't help.

**Push-back prompt:**
```
Be more specific. What concrete issues are users complaining about?
Quote them directly. Use exact phrases from the feedback rows.
```

If the second output is still generic, switch to the recording. Don't get stuck in re-prompts on stage.

### Output is too long (5+ pages)

**Action:** Push back once.

```
Make this one page. Top 3 themes only. 2 quotes per theme. Tight.
```

### Cowork tab doesn't exist

**Action:** Skip the demo entirely. Switch to your dry-run recording.

**Script:**
> *"My Cowork installation is being weird tonight — let me show you a recording of what it does, then we'll move on."*

Then go straight to Slide 19 (Decision Framework). Don't lose more than 2 minutes recovering.

### Hebrew text comes out garbled

**Action:** Note it, move on. Don't dwell.

**Script:**
> *"Cowork still has some Hebrew rendering quirks — the substance is right, the formatting needs work. Anthropic's working on it."*

---

## What you should NOT do

- ❌ **Don't try multiple prompts in sequence** to get a perfect output. The room is watching you flounder. One prompt, then move on.
- ❌ **Don't apologize for slow performance.** Cowork takes 90 seconds. That's normal. Apologizing makes it feel slow.
- ❌ **Don't compare Cowork to ChatGPT or Gemini Workspace.** Tempting, but it's a tangent. Stay focused.
- ❌ **Don't promise "Cowork will replace [tool X]."** It might or might not. Just show what it does.
- ❌ **Don't run a second prompt** to show off more features. 7 minutes is the budget. One prompt, one output, one bridge to next slide.

---

## What you should do

- ✅ **Step away from the keyboard while Cowork runs.** Stillness reads as confidence.
- ✅ **Use the dead air.** Narrate what's happening on screen. The narration is the demo as much as the output is.
- ✅ **Point at the Hebrew quotes when they appear.** Your audience will recognize their own customers' voices.
- ✅ **Bridge cleanly to Slide 19.** "That's Cowork. Now let's talk about when to use it vs Claude Code." Don't linger.

---

## Time budget

| Sub-segment | Time |
|---|---|
| Setup (Cmd+Tab, drag folder) | 30 sec |
| Type prompt + hit enter | 15 sec |
| Cowork runs (narrate) | 90 sec |
| Output review + 2 highlights | 90 sec |
| Bridge to Slide 19 | 30 sec |
| **Total** | **~4 min** |

You have 7 minutes budgeted. The 3 min of buffer absorbs any first-time-on-stage friction. **Don't expand to fill the time** — finish early and use the slack for Slides 19 and 20.

---

## One last thing

The honest moment of this demo isn't the output. It's the moment you step away from the keyboard and let the room watch Cowork work. That stillness is what tells the audience this is a real tool doing real work — not a magic show.

Practice the stillness in the dry run.

---

*BrAIght Wave · Instructor prep · Cowork demo · Read once before dry run, again before workshop*
