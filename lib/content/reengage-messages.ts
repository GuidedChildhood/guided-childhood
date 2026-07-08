// The Duolingo tactic, in DiGi's voice: fun, personality led, never
// guilt, never shame (non-negotiable). A rotating bank so the same
// parent never gets the same line twice in a row, picked by day of
// year so it varies without needing randomness (which is unavailable
// in some contexts) and is stable across retries.

export const REENGAGE_MESSAGES: { title: string; body: string }[] = [
  { title: 'DiGi here, long time no see 👋', body: 'Still got your back. Two minutes today and you are caught up again.' },
  { title: 'Your star missed you ⭐', body: 'No lectures from me, just a nudge. Today\'s moment card is ready when you are.' },
  { title: 'Quick one from DiGi', body: 'Something is always happening with screens somewhere in your house. Come tell me about it.' },
  { title: 'Still here, still golden 🌟', body: 'Your streak is gone quiet, not gone forever. One tap brings it back to life.' },
  { title: 'DiGi has a new thought for you', body: 'I read something this week worth two minutes of your time. Come and see?' },
  { title: 'Checking in, not checking up', body: 'No pressure at all. If today has two minutes going spare, I am ready.' },
  { title: 'Your family agreement called', body: 'It wondered how this week is going. Worth a look, no judging, promise.' },
]

export function reengageMessageForDay(dayIndex: number): { title: string; body: string } {
  return REENGAGE_MESSAGES[dayIndex % REENGAGE_MESSAGES.length]
}
