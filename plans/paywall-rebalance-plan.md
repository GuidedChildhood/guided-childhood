# Paywall rebalance — the Duolingo playbook, applied

**Written 9 Jul 2026 · Grounded in Duolingo's freemium model and 2025 paywall research · No dashes**

Justin's note: the paywall seems too much for free, redo it as the best apps do. This is the research and the plan.

## What Duolingo actually does

- **The core is free forever.** Every language course is free. They never wall the learning itself.
- **They gate friction, not value.** Free users hit ads, and a hearts or energy meter that caps them at about two to three lessons a day (15 to 20 minutes). You can learn for free every day, you just feel a soft ceiling.
- **The ceiling renews daily.** It is never a dead end. You come back tomorrow, or you pay to remove the ceiling. Super is £12.99 a month for no ads, unlimited hearts, offline and AI explanations.
- **The limit is the product.** The daily cap is what builds the habit and the upgrade pull at the same time.

## What the 2025 paywall research says

- **Onboarding placement more than doubles conversion.** Show the offer when motivation is highest, right after signup, not buried in settings. 82% of trials start on day zero.
- **Longer trials win big.** 17 to 32 day trials convert at 46% trial to paid, versus 27% for 3 to 7 day trials. The mechanism is habit: by the time it ends, the product is already part of the week.
- **Full price and tiers visible upfront** builds trust. No hidden pricing.
- **Freemium versus hard wall.** Hard walls convert survivors far better but filter nine of ten users out. For our goal (20,000 free signups to 800 paying) we want the wide funnel, so freemium is right, with a strong trial offer at onboarding.
- **Track paywall visibility.** 80% of new users should reach the offer at least once.

## The problem with our current paywall

Our free tier is actually good on the habit features (daily practice, tracker, quests, device checklists are free). The walls that feel too much are the stingy, permanent ones:

1. **Scripts: 5 free for life.** This is the stingiest possible shape. A parent uses their five in week one and then hits a permanent wall. Duolingo would never cap the core like this.
2. **Agreement builder: fully locked.** A hard wall on a whole core feature, before the parent has felt its value.
3. **DiGi: 3 a day** is fine as a soft ceiling, but it should read like Duolingo's warm daily limit, not a punishment.

## The plan: loosen the walls, keep the ceiling, sell the trial

1. **Scripts become a renewing free allowance, not a lifetime cap.** Free parents get a few scripts a week (say three), refreshing weekly, plus the recommended one always free. This is the hearts model: real ongoing value, a soft ceiling, a reason to come back and a reason to upgrade for the full 160.
2. **Let them build the agreement free, charge for the payoff.** The builder is free to use and preview. Saving, the printable signed PDF, and the premium clause library are the paid unlock. Value first, wall at the moment of payoff.
3. **Keep DiGi's daily limit but reframe it warmly.** Lift to 5 a day, and when the limit lands, it is a calm "DiGi has helped all it can today, back tomorrow, or go unlimited," never a hard stop.
4. **Add a 14 day free trial, offered at onboarding.** Right after the pathway is built, when motivation peaks. Full access for 14 days so the habit forms, then it settles to the free tier if they do not subscribe. Full price and all three tiers visible.
5. **The paywall moment appears after a win,** not before. Finished the first week, or hit a soft ceiling, then the upgrade story, never a dead end.
6. **Founder £7.99 urgency stays,** shown on the trial and paywall screens with the live counter.

## What this changes in code

- Scripts gating: swap the lifetime `FREE_SCRIPT_LIMIT` (5) for a weekly renewing allowance in `lib/content/free-script-limit.ts` and the scripts pages.
- Agreement: move the `!isPaid` block from the whole page to the save and export actions in `app/(dashboard)/dashboard/agreement/page.tsx` and the agreement API.
- DiGi: `FREE_DAILY_LIMIT` 3 to 5 in `app/api/digi/route.ts`, and warm limit copy in `DigiChat.tsx`.
- Trial: a `trial_ends_at` on profiles, set at onboarding, treated as paid until it passes. New migration.
- Paywall screen: one reusable component, appears after a win, all tiers and the founder counter, upgrade story, never a dead end.

## Open decision for Justin

This plan assumes the intent is loosen the free tier per best practice (the Duolingo shape). If instead the free tier should be tighter, the moves invert. Confirm the direction and I build it.
