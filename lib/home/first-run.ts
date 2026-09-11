// ── IS THIS THE FAMILY'S FIRST DAY? ────────────────────────────────────────
//
// Justin, 11 September 2026: "some of them are not right for first ever log
// in, monthly catch up."
//
// He is right, and the monthly check in is the clearest example. Home carries
// around forty conditional blocks, and a good half of them REPORT ON HISTORY:
// what changed since your last visit, what you saved today, the community
// this week, your last insight, your last bit of feedback, a monthly check in
// on how YOU have been. Every one of those is written for a family three
// weeks in.
//
// On day one they are worse than empty. "How have you been this month?" on an
// account twenty minutes old is the app talking to somebody who is not there
// yet, and it sits between a new parent and the only thing they should be
// doing, which is their first walk down the path.
//
// ── WHY IT IS COMPUTED RATHER THAN STORED ──────────────────────────────────
//
// Every input is already on the page. Nothing is fetched for this, no column
// is added, and there is no flag to get stuck on: the moment a family has one
// day behind them the answer flips on its own and stays flipped.
//
// ── THE THREE TESTS, AND WHY ALL THREE ─────────────────────────────────────
//
// daysShownUp is the real signal: getDailyStreak counts every meaningful day
// ever, a finished day, a moment worked, a quest tick approved, a check in
// answered. Zero means genuinely nothing has happened yet.
//
// hasCheckedIn is the second, because a family can answer the check in on the
// morning they join, before any of the above has landed, and a parent who has
// just told us about their child should not be treated as a stranger.
//
// accountAgeDays is the backstop. A family who signed up in March, never came
// back, and logs in today has zero days shown up and no check in, and they are
// not new: they are returning, and the catch up card is exactly what they
// want. One day is the window, because the first day is the only day this is
// about.

export type FirstRunFacts = {
  /** Meaningful days ever, from getDailyStreak's total. */
  daysShownUp: number
  /** profiles.first_checkin_at is set. */
  hasCheckedIn: boolean
  /** Whole days since the account was created. */
  accountAgeDays: number
}

export function isFirstRun(f: FirstRunFacts): boolean {
  return f.daysShownUp === 0 && !f.hasCheckedIn && f.accountAgeDays <= 1
}
