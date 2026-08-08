import CatchupCard from '@/components/daily/CatchupCard'
import type { Catchup } from '@/lib/pathway/catchup'

// Layout fixture for the while you were away card, which otherwise only appears
// to a logged in parent who has genuinely been gone four hours or more, and only
// when their child actually did something in the gap. Not a state you can
// conjure by clicking around.
//
// Three cases, because the card has three real shapes and the middle one is the
// one that goes wrong: news with nothing waiting, news with things waiting, and
// waiting with no news at all.
//
// 404s in production via middleware, like every other ref-* page.

export const dynamic = 'force-dynamic'

const FOUR_DAYS_AGO = new Date(Date.now() - 4 * 86400_000).toISOString()
const ELEVEN_DAYS_AGO = new Date(Date.now() - 11 * 86400_000).toISOString()

const NEWS_ONLY: Catchup = {
  since: FOUR_DAYS_AGO, days: 4,
  lines: [
    { key: 'friends', emoji: '🪐', text: 'Teo brought a new Planet Friend home' },
    { key: 'lessons', emoji: '💡', text: 'Teo passed 2 lessons' },
    { key: 'days', emoji: '⭐', text: 'Teo finished 3 full days, all five each time' },
    { key: 'stars', emoji: '✅', text: '11 jobs done and approved' },
  ],
  waiting: [],
}

const BOTH: Catchup = {
  since: ELEVEN_DAYS_AGO, days: 11,
  lines: [
    { key: 'days', emoji: '⭐', text: 'Teo finished 6 full days, all five each time' },
    { key: 'sheets', emoji: '🖍️', text: '2 printables finished away from a screen' },
  ],
  waiting: [
    { key: 'w-sheets', emoji: '🖍️', text: '1 finished sheet waiting for you to confirm' },
    { key: 'w-asks', emoji: '🙋', text: '2 jobs Teo asked to add' },
  ],
}

const WAITING_ONLY: Catchup = {
  since: FOUR_DAYS_AGO, days: 4,
  lines: [],
  waiting: [{ key: 'w-asks', emoji: '🙋', text: '1 job Teo asked to add' }],
}

export default function RefCatchup() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh', padding: '24px 16px 60px' }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 16px',
        }}>
          Reference · while you were away
        </p>

        {[
          ['News, nothing waiting', NEWS_ONLY],
          ['News and things waiting', BOTH],
          ['Waiting only, no news', WAITING_ONLY],
        ].map(([label, c]) => (
          <div key={label as string} style={{ marginBottom: 26 }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', fontWeight: 700, margin: '0 0 8px' }}>
              {label as string}
            </p>
            <CatchupCard catchup={c as Catchup} childName="Teo" />
          </div>
        ))}
      </div>
    </main>
  )
}
