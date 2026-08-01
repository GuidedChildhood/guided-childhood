'use client'

import SmartAlerts from '@/components/alerts/SmartAlerts'
import DigiPrompts from '@/components/digi/DigiPrompts'
import type { Suggestion } from '@/lib/alerts/suggestions'

// Dev harness for the quiet tail of Home: one reflective DiGi card, then short
// factual nudge rows.
//
// DigiPrompts fetches /api/digi/prompts so it is stubbed in Playwright rather
// than imported here. SmartAlerts takes its suggestions as a prop, so it can be
// fed directly. Bodies here are deliberately long, because the whole point of
// the change is what happens when the real content is not short.

const SUGGESTIONS: Suggestion[] = [
  { key: 'a', kind: 'quest', urgency: 9, emoji: '🖨️', title: 'Print this week\'s star chart', body: 'The chart is what makes the stars real on the fridge, and it takes a minute.', cta: 'Print it', href: '/dashboard/printables' },
  { key: 'b', kind: 'ping', urgency: 8, emoji: '📱', title: 'Ada has not opened her app yet', body: 'Jobs are waiting on her list but nobody has signed in on her side.', cta: 'Send the code', href: '/dashboard/quests' },
  { key: 'c', kind: 'lesson', urgency: 7, emoji: '🎬', title: 'One lesson left in this stage', body: 'Finishing it stamps the passport for Explorer.', cta: 'Open lessons', href: '/dashboard/lessons' },
  { key: 'd', kind: 'win', urgency: 6, emoji: '⚖️', title: 'Screen balance is on track this week', body: 'Four days inside the agreed amount.', cta: 'See the week', href: '/dashboard/stats' },
]

export default function HomeTailHarness() {
  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '24px 20px 60px', background: 'var(--cream)' }}>
      <p className="eyebrow" style={{ margin: '0 0 10px', fontSize: 'var(--text-sm)' }}>DiGi, your streak and alerts</p>
      <DigiPrompts />
      <SmartAlerts suggestions={SUGGESTIONS} />
    </div>
  )
}
