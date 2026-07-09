# The full email sequence — comprehensive lifecycle drip

**Written 9 Jul 2026 · Extends the five existing lifecycle emails · Grounded in 2025 SaaS drip research · No dashes**

Justin's ask: make the email pattern comprehensive. Feature nudges (have you tried the routine reminders, the lessons, the quest chores), a two week mark that names the safe YouTube app and the social media checker, re engagement for signups who never paid (founder rate still open, benefits, school curriculum to your child), and a founder ping on every new signup.

## What we already send (keep)
Day 2 stage guide · Day 3 tour · Day 4 DiGi nudge · Day 7 founder rate · Monday weekly digest. All idempotent through email_log, all in `/api/email/cron`.

## The principles from the research
- Five to eight emails across the first two weeks, one message each, value first, one clear action.
- Trial expiry email about one week and again two days before, helpful not pushy (the YNAB letter, not a countdown scream).
- Feature adoption: email the people who have not used a feature, lead with the benefit, link straight to it. Systematic beats one shot, three to five times the adoption.
- Behaviour triggered beats time based where we can (only email the lessons nudge to someone who has not opened a lesson).
- Re engagement: two to three emails, new value plus a limited offer (the founder cap is our natural FOMO).

## The new sequence to build

**Onboarding and adoption (first 2 weeks), each skipped if already done:**
1. **Day 5, the quest chores nudge.** Only if no family_quests yet. "Turn the daily jobs into earned screen time. No phone needed, print the sheet or tick them off yourself." Link to Quests.
2. **Day 6, the routine reminders nudge.** Only if no school connection yet. "Forward one school email and never miss a kit day again." Link to School setup.
3. **Day 8, the lessons nudge.** Only if no lesson opened. "Ten calm minutes that teach real digital judgement, matched to their age." Link to Lessons.
4. **Day 10, the DiGi deepen.** Only if fewer than 3 DiGi messages ever. A concrete 11pm example.

**Trial (keys off trial_ends_at):**
5. **Day 12, trial has 2 days left.** Warm, "here is what stays free, here is what opens with membership," founder rate.
6. **Day 15, trial ended, not paid.** The YNAB letter: the daily habit is still free, the full thing (all scripts, unlimited DiGi, the pathway, the school curriculum lessons straight to your child) is one step away, founder rate still open with the live counter.

**Two week value mark:**
7. **Day 14, what is coming and what you have.** Names the safe YouTube style curated viewing and the social media pattern checker (see the caveat below), plus a recap of what they already have.

**Re engagement for signups who never paid (behaviour, not just time):**
8. **Day 21 and Day 35, win back.** Only for non paid, non opted out. New value plus the founder cap FOMO, the school curriculum lessons benefit, one soft link. Two emails, spaced.

**Founder ping (built):** a new starter email fires a push to the founder account so every signup is visible in real time.

## The one caveat, important
Two of the features Justin wants to email about **do not exist in the product yet**: the **safe YouTube style curated, no algorithm viewing app**, and the **social media pattern checker**. Emailing customers about features that are not built would break trust the first time they tap through and find nothing.

Three honest options, in order of preference:
1. **Build them first, then email.** They are strong, on brand features (curated safe viewing, a checker that spots worrying patterns). Worth their own build.
2. **Frame them as an explicit coming soon teaser** in the day 14 email ("two things we are building for you"), with no tappable feature, only a promise. Safe, builds anticipation.
3. **Hold those two lines** until the features exist.

Everything else in the sequence references features that are live today, so it can ship now.

## Build shape
- Add the new templates to `lib/email/templates.ts` in the existing wrapper style.
- Add the day 5, 6, 8, 10, 12, 14, 15, 21, 35 conditions to `/api/email/cron`, each guarded by email_log and by a cheap has-this-been-done query (a family_quests count, a school_connections row, a lesson completion, a DiGi message count, subscription_status, trial_ends_at).
- Keep every send value first, one action, mobile first, unsubscribe in the footer.
- Needs, in Vercel, the same RESEND_API_KEY, EMAIL_FROM and CRON_SECRET the current emails need.

## First actions
1. Decide the safe YouTube app and social checker caveat (build, tease, or hold).
2. Build the adoption nudges (5, 6, 8, 10) and the trial emails (12, 15), the highest leverage and all behaviour guarded.
3. Add the win back pair (21, 35).
