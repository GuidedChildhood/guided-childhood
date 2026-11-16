'use client'

import WeeklyRoundup, { type Review } from '@/components/digi/WeeklyRoundup'

// Dev harness for the weekly round up card, in its three reads: inside our
// guide, past it, and a quiet week. Added when the 0 to 100 balance score came
// off the card (15 November 2026) so the two tallies can be looked at on a
// phone without a stored review.

const base = { id: 'r', week_start: '2026-11-09', summary: 'A steady week. Teo led on his reading and the mornings ran smoother.', watch_for: null, suggestion: 'Try the after school routine.', suggestion_routine: null }
const REVIEWS: [string, Review][] = [
  ['Inside our guide', { ...base, stats: { children: ['Teo', 'Olga'], ageBands: ['8-10', '4-7'], questsApproved: 31, starsEarned: 36, earnedMinutes: 180, deviceMinutes: 420, activeDays: 6, topQuest: 'Twenty minutes lost in a book', momentsDone: 2 } }],
  ['Past our guide', { ...base, stats: { children: ['Teo', 'Olga'], ageBands: ['8-10', '4-7'], questsApproved: 12, starsEarned: 14, earnedMinutes: 70, deviceMinutes: 1500, activeDays: 4, topQuest: 'Feed the cat', momentsDone: 0 } }],
  ['A quiet week', { ...base, stats: { children: ['Teo'], ageBands: ['8-10'], questsApproved: 0, starsEarned: 0, earnedMinutes: 0, deviceMinutes: 0, activeDays: 0 } }],
]

export default function WeeklyRoundupHarness() {
  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '24px 20px 60px', display: 'grid', gap: 28 }}>
      {REVIEWS.map(([label, review]) => (
        <div key={label}>
          <p className="eyebrow" style={{ marginBottom: 10 }}>{label}</p>
          <WeeklyRoundup review={review} />
        </div>
      ))}
    </div>
  )
}
