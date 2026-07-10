# The journey, front loaded into one path

**Justin's walkthrough, 10 Jul 2026. No dashes in any copy. This replaces the current two part flow (marketing starter quiz, then a separate app signup and onboarding) with one journey.**

## The problem today
It tries to do two jobs, capture the lead and set up the account, split across two places, so it asks the same things twice and says "save your pathway" more than once. It should be one simple journey: tell us about your child, see your pathway, step in.

## The core change: front load everything
Collect the person and the child up front, build the pathway, reveal it, then step into the platform. Account creation and child details move to the beginning, the pathway reveal becomes the payoff, and there is no second onboarding later.

## The homepage
- Primary button becomes **Get started here** (not "Start my pathway"). Same thing as the current skip and get started, we take it from there.
- Under it: **Free access to the platform, no card required** (not "free starter pack"). Drop the words "starter pack" everywhere. Where we mean the trial, say **free trial**.
- **Make Log in clear and easy to find** from the homepage. The pathway now saves to the account and loads whenever they log in, so returning is the main action for anyone who has been before.

## The get started flow, in this order
The order matters, it should follow the logic of first fixes.

1. **Your name and email first.** Capture the person before anything else. (This is the only email capture. See the note on removing "where should we send it" below.)
2. **How old is your child.**
3. **What are we dealing with.** The main concerns. These are the important ones, so they come right before the pathway is built. This is the screen that drives the first fixes.
4. **How many times a day** (the current usage question, keep it). But wire it into the system so we can monitor it or at least keep a sense of it over time, not just ask and forget.
5. **Create your account** (password). Front loaded here so they are a real account before the reveal. [SEE DECISION 1: front load the password, or ask it after the reveal.]
6. **Building your pathway** (the loading beat, it is great, keep it).
7. **Your pathway** (the reveal, see below).
8. **Step into the platform.**

### Remove
- The **"where should we send it"** email step. We already have the email and name from step 1, so it is a repeat. Delete it.

### Leave for now
- **Mobile number.** Decide later if it is good practice to ask. Not now. Maybe an optional "add later" in settings.

## The concerns screen does double duty
The "what are we dealing with" screen is reused **monthly**: after each month it asks what has been fixed and what has come up since. This gives us a running picture, links to how we talk about progress over time, and needs real logic behind it so it genuinely catches up with the family, not a throwaway form.

## Parent wellbeing is part of this
- A **bubble that pops up** during the concerns step: how much the parent's own wellbeing matters in all of this, and that we will help. Warm, brief, not a lecture.
- The monthly check in feeds a light view of parent wellbeing over time. This is a big part of the mission and needs its own logic, not just child facing metrics.

## The pathway reveal (the old result page), made premium
- **Apple level finish.** More professional, less busy. This is the page that has to feel worth it.
- **First time:** lead them through the pathway as it does now, flashing up the real services: lessons, quest demos, encouraging outside play, real education, and so on. Show, do not tell.
- **A straight to the platform button** near the top, so anyone who does not want to scroll the whole reveal can jump right in. First timers get the guided scroll, returners get the shortcut.
- The final CTA is **Get started here** or, once they have an account, straight in. Never "save your pathway."

## Copy rules for this flow
- No "starter pack." Say "the platform" or "free trial."
- No "save your pathway." It saves on login now.
- One "Get started here," never two competing calls.
- Justin's voice, warm and plain, no dashes.

## Decisions needed before building
1. **Password position.** Front load the password right after the concerns (as written above), or show the pathway reveal first and ask for the password only when they step in? Front loading is what you described. Showing the value first usually converts better because they have seen what they are signing up for. My lean: capture name and email up front (light), let them see the reveal, then set a password to step in. Your call.
2. **Monthly check in and wellbeing logic.** This is a real feature with data behind it (a monthly concerns snapshot, a wellbeing view over time). Big enough to be its own build after the flow. Build the flow first, then this? Or design them together so the data model is right from the start.

## Build order once agreed
1. Rename and reframe: homepage copy, remove "starter pack" language, Get started here, clearer Log in.
2. Merge the two flows into one front loaded path, in the new order, remove "where should we send it."
3. Premium pass on the pathway reveal, add the straight to platform button and the service demos.
4. The parent wellbeing bubble.
5. The monthly concerns and wellbeing check in, with its data model.
