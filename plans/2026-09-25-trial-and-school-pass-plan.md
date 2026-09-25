# Trial clock emails, and the school family pass question (25 September 2026)

Justin's answers after the Duolingo research review:

- After the trial: lock everything, as now. No change.
- Trial emails: yes, on the trial clock.
- Trial: first seven days, then Justin kept FOUR (same morning). Card for Founder already true.
- Target: a school family pass. Now undecided; see section 3.

## 1. Trial emails on the trial clock (build now)

Today the welcome records a send, so the one a week floor holds day 2, day 3,
day 4 and the trial ending email back by six days each. In a four day trial the
trial ending email can never land. Fix:

- New `EmailKind` 'trial' in lib/email/index.ts: checks suppression (an
  unsubscribe still holds), skips the six day floor, records the send so the
  weekly programme counts from it.
- The email cron uses it for welcome, day2-stage, day3-tour, day4-digi and
  trial-ending, only while the account is inside its trial window (so an old
  account missing one of them never gets it unthrottled).
- Four days reads: welcome day 0, stage day 2, trial ending day 3. On the
  last day trial ending goes first so a drip cannot take the run's slot.
- scripts/check-email-guard.mjs lists the new opt out and proves the
  suppression check still runs for it.

## 2. Trial length: stays four days

No change to TRIAL_DAYS, platform_config or copy. No migration.

## 3. School family pass (undecided, nothing built)

Today the school licence covers the curriculum in class. The pass would give
every family at a pilot school the parent app, paid by the school.

Open questions for Justin before any build:
1. Price: per pupil per year, or a flat school fee?
2. What each family gets: full app, or the stage path plus DiGi on a limit?
3. How families claim it: a school code at signup, or a link in the school
   newsletter that skips the card?
4. Which school pilots first, and for how long (one term)?

Likely surfaces once decided: a `school_passes` table (school, seats, ends_at),
a claim route that sets subscription_status for the family, a line on the
school dashboard showing how many families claimed, and the paywall treating a
claimed pass as full access.
