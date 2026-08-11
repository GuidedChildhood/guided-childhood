// The weekly check in, read as a signal about which script to offer.
//
// Justin, 11 August 2026, looking at the same recommended card for a third day:
// "why are we using this script as next one, shouldn't we have a better script
// that relates to dips on check in or previous moments, can we make sure it
// puts the most relevant script for the user and rotates them as we have a lot?"
//
// ── The gap ──────────────────────────────────────────────────────────────────
//
// wellbeing_checks has held five scores out of five, per child, per week, since
// migration 001: mood, sleep, social, screen mood and open communication. It is
// the most deliberate thing a parent ever tells us. They sit down once a week
// and grade five parts of their child's life.
//
// The recommender has never read it. Not once. It reads concerns, the devices
// in the house and the answer picked at signup, and a parent who has been
// marking sleep at two out of five for a month was being offered scripts on the
// strength of owning a tablet.
//
// ── How a dip is weighted ────────────────────────────────────────────────────
//
// Between a concern and a device, on purpose. A concern is a family SAYING a
// thing is a problem, which is the strongest signal there is. A dip is a family
// MEASURING one, which is quieter but harder to argue with, and both beat the
// fact that there is a console in the hall.
//
// Only 1 and 2 out of 5 count. Three is the middle of the scale and reading it
// as a cry for help would mean every family got a mood script for ever.

export type WellbeingCheck = {
  week_start: string
  mood_score?: number | null
  sleep_score?: number | null
  social_score?: number | null
  screen_mood_score?: number | null
  open_communication?: number | null
}

export type Dip = {
  category: string
  /** Above devices at 50, below the weakest concern at 110. */
  score: number
  /** Why this one, in the parent's own measurements. */
  reason: string
}

/** A score at or below this is a dip. Three is the middle and means nothing. */
const DIP_AT = 2

/**
 * Which part of the library each score points at.
 *
 * Sleep goes to SCREEN TIME rather than anywhere else, matching the reasoning
 * already written into CONCERN_TO_CATEGORY: on this platform a sleep problem is
 * almost always a device in a bedroom, and that is where those scripts live.
 *
 * Social goes to SOCIAL MEDIA for the same reason friendship does: at these
 * ages falling out happens in group chats far more often than in playgrounds.
 *
 * Open communication is the one that could have gone two ways. It lands in mood
 * and confidence rather than staying safe because a child who has stopped
 * talking is not yet a child in danger, and treating it as one would put a
 * frightening script in front of a parent who described a quiet fortnight.
 */
const SCORE_TO_CATEGORY: { key: keyof WellbeingCheck; category: string; label: string }[] = [
  { key: 'mood_score', category: 'mood-confidence', label: 'Mood' },
  { key: 'sleep_score', category: 'screen-time', label: 'Sleep' },
  { key: 'social_score', category: 'social-media', label: 'Friendships' },
  { key: 'screen_mood_score', category: 'screen-time', label: 'Mood around screens' },
  { key: 'open_communication', category: 'mood-confidence', label: 'How much they talk to you' },
]

/**
 * The dips worth acting on, strongest first.
 *
 * `checks` should be the most recent few weeks, newest first. Older weeks count
 * for less: a bad week in June is not this week's problem, and a run of bad
 * weeks is worth more than one.
 */
export function dipsFrom(checks: WellbeingCheck[]): Dip[] {
  if (checks.length === 0) return []
  // Newest first, and only the last four weeks are ever consulted. A month is
  // long enough to tell a run from a bad week and short enough that a family
  // who has turned things around is not still being handed the old problem.
  const recent = [...checks]
    .sort((a, b) => String(b.week_start).localeCompare(String(a.week_start)))
    .slice(0, 4)

  const out: Dip[] = []
  for (const { key, category, label } of SCORE_TO_CATEGORY) {
    const scored = recent
      .map(c => Number(c[key]))
      .filter(n => Number.isFinite(n) && n > 0)
    if (scored.length === 0) continue

    const dipped = scored.filter(n => n <= DIP_AT)
    if (dipped.length === 0) continue

    // The worst score seen, and how many weeks it has been low. A one out of
    // five outranks a two, and three low weeks outrank one.
    const worst = Math.min(...dipped)
    const weeks = dipped.length
    // 1 of 5 with a run: 60 + 30 + 20 = 110 at the very top of the band.
    // 2 of 5 once:       60 + 15 + 0  = 75, comfortably above a device at 50.
    const score = 60 + (3 - worst) * 15 + Math.min(2, weeks - 1) * 10
    // The most recent week is what a parent remembers, so lead with whether it
    // is still low rather than with the history.
    const stillLow = Number(recent[0]?.[key]) <= DIP_AT
    out.push({
      category,
      score,
      reason: weeks > 1
        ? `${label} has been low on ${spell(weeks)} of your recent check ins`
        : stillLow
          ? `${label} was low on your last check in`
          : `${label} was low on a recent check in`,
    })
  }

  return out.sort((a, b) => b.score - a.score)
}

/** Small numbers as words, because "3 of your check ins" reads like a receipt. */
function spell(n: number): string {
  return ['', 'one', 'two', 'three', 'four'][n] ?? String(n)
}
