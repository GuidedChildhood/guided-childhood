# Trial clock, seven day trial, school family pass pilot (25 September 2026)

Justin's answers after the Duolingo research review:

- After the trial: lock everything, as now. No change.
- Trial emails: yes, on the trial clock.
- Trial: seven days, card for Founder.
- Target: pilot a school family pass.

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
- trial-ending moves ahead of Pass A so the one email per run slot cannot be
  taken by a drip.
- The Founder pre charge reminder fires at three days left (and never before
  day three), which is day three of four and day five of seven.
- scripts/check-email-guard.mjs lists the new opt out and proves the
  suppression check still runs for it.

## 2. Seven day trial (build now, Justin runs one migration)

- lib/access.ts TRIAL_DAYS 4 to 7 (the fallback and the created_at floor).
- Migration 353 sets platform_config.trial_days to 7. The live number moves
  only when Justin runs it. Live DB writes need his OK.
- Copy that spells "four days" reads the constant through a words helper.
- Card for Founder: already true (payment_method_collection 'always'). No change.
- trial-pushes cron: its window already covers three, two and one days left.

## 3. School family pass pilot (plan only, nothing built)

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
