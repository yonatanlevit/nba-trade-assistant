# Floater Fallback Recipes

> **For the 2 dedicated floaters during the workshop.** Print this. Tape it to your laptop. Read it before the workshop starts.
>
> **Your role:** environment problems only. Pedagogy is the pod's job. You're the firefighter, not the teacher.

---

## The 60-second triage rule

When a pod waves you over, before doing anything else, ask:

1. **What's not working?** (Specific. Not "Claude is weird" — "the Figma MCP returns an auth error.")
2. **What did you try?** (Avoids you wasting 5 minutes on what they already attempted.)
3. **Which Part are you in?** (Determines which fallback to use.)

If the issue can't be diagnosed in 60 seconds, **deploy the relevant fallback** and let the pod continue. Don't trade pod work-time for a clean fix.

---

## Part 1 fallbacks — Product Audit (00:40–01:30)

### Issue: Sample repo won't clone

**Symptoms:** `git clone` fails. SSH errors. HTTP errors.

**Fallback:** A pre-cloned copy of the repo lives at `/Users/[shared-account]/workshop-fallback/claude-code-pm-starter` on your floater laptop, and on a USB stick. Hand the USB or share via AirDrop / shared network folder. Pod opens that folder in Claude Desktop directly. Skips git entirely.

**Time cost:** 90 seconds.

### Issue: Claude Desktop won't open the folder

**Symptoms:** Pod opens the folder in Claude Desktop and gets a "Failed to load session" or blank screen.

**Fallback:**
1. Quit Claude Desktop fully (right-click in dock/tray → Quit).
2. Reopen.
3. If still failing: open a different folder first (e.g., the user's Desktop), then switch to the workshop repo.

**Time cost:** 60 seconds.

### Issue: Claude is too slow / context heavy

**Symptoms:** Responses taking 30+ seconds. Spinning forever.

**Fallback:** Tell the pod to start a fresh session (close current, open a new one in the same folder). The Desktop app caches context aggressively; a clean session almost always fixes it.

**Time cost:** 30 seconds.

---

## Part 2 fallbacks — Figma → component (01:40–02:30)

> **The Figma MCP is the single most fragile dependency in the workshop.** Expect 1–2 pods to hit issues. Be ready.

### Issue: Figma MCP won't authorize

**Symptoms:** `claude mcp add figma` fails. Auth flow stalls. Browser doesn't redirect back.

**Fallback:** A JSON export of the workshop's sample Figma frame lives at `workshop-data/figma-frame-export.json` in the sample repo. Hand the pod this file. Tell them: *"Treat this as the Figma frame. Read it, map elements to tokens, generate the component the same way."*

The exercise still works — pods just skip the live Figma connection. The system-first discipline is unchanged.

**Time cost:** 30 seconds (just point at the file).

### Issue: Figma file won't open / participant can't access it

**Symptoms:** "You don't have access" error. The shared link is broken.

**Fallback:** Same as above — use `figma-frame-export.json`. Plus a screenshot reference at `workshop-data/figma-frame-screenshot.png` so the pod can see the visual design.

**Time cost:** 30 seconds.

### Issue: Component generated but doesn't render

**Symptoms:** Claude wrote the component, but importing it into the InvoiceFlow app errors out.

**Fallback:** This is pedagogy, not setup — **don't fix it**. Tell the pod: *"The error message is the lesson. Show it to Claude and ask 'why does this not import?'"* Send them back to the keyboard.

**Time cost:** 30 seconds.

---

## Part 3 fallbacks — Customer feedback → PRD round-trip (02:40–03:30)

### Issue: feedback.csv won't parse / Hebrew encoding errors

**Symptoms:** Claude returns garbled text from the CSV. Mixed encoding warnings.

**Fallback:** A pre-cleaned 50-row UTF-8 subset lives at `workshop-data/feedback-clean-50.csv`. Hand the pod this filename. Tell them: *"Use this version. Same exercise, smaller dataset."*

**Time cost:** 30 seconds.

### Issue: PRD template missing or won't open

**Symptoms:** Pod can't find `docs/prd-template.md` or it appears empty.

**Fallback:** Tell the pod: *"It's intentionally a 3-line skeleton. The whole point is you fill it in. If yours is empty, that's correct — start writing into it."*

**Time cost:** 15 seconds (it's not actually broken — beginners just don't expect a skeleton).

### Issue: Pod is racing through, will obviously not finish Role 3

**Symptoms:** It's 03:18, pod is still in Role 2, Role 3 hasn't started.

**Action:** **Don't try to rescue them.** Walk over and say: *"You're not going to finish Role 3. That's fine — the work-slide tells you to skip honestly rather than fake it. Stop where you are. Save what you have."* This protects the pod from rushing through the highest-value step.

**Time cost:** 15 seconds.

---

## Issue: Authentication / sign-in problems

### Symptoms: "Free tier doesn't include Claude Code"

The participant signed in with a free account. **They cannot do the workshop on free.**

**Fallback options, ranked:**
1. They have a Pro/Max account they forgot about — get them to switch login.
2. They sign up for Pro right now — $20, 2 minutes — and the workshop's first hour absorbs it.
3. **Floater's emergency Pro account** — share screen with the participant if they're truly stuck and can't pay. Last resort.

### Symptoms: SSO / corporate firewall blocking auth

**Fallback:** Get them onto a phone hotspot, not the venue WiFi. Bypass corporate VPN entirely.

**Time cost:** 2 minutes.

---

## When to NOT help

These are the situations where you should **leave the pod alone**:

- **The pod is debating Claude's output.** That's the exercise. Don't interrupt.
- **The pod is reading the cheat sheet for pushback prompts.** Same.
- **The pod is running over time.** Acknowledge, then let them figure it out — the work slide tells them what to do.
- **The pod is asking pedagogical questions** ("how do we know which theme to pick?"). Redirect: *"Ask the experienced person at your table — that's their job today."*

---

## Communication with the instructor

If something is breaking across multiple pods:
- Make eye contact during the room walk. Hold up a number with your fingers (1, 2, 3 = number of pods affected).
- The instructor will decide whether to address the room.

If something is breaking only for one pod:
- Don't interrupt the room. Handle it silently.

---

## End of Part 1 / Part 2 / Part 3 — your other job

During share-back time (and the breaks immediately after each Part):
- Walk to each pod and confirm: **was the skill saved to `.claude/skills/`?**
- If not, prompt them to save now. Don't let any pod leave a Part without the artifact.

---

*BrAIght Wave · Claude Code Workshop · v8 — April 2026*
