import { WaitingNote, TodayJobs, type JobRow } from '@/components/kid/BalanceToday'
import { STAR_MINUTES } from '@/lib/quests/templates'

// The child's balance page, in the three states it can be in.
//
// Justin, 10 August 2026: "strange, I did the first one of five on the child's
// app but when I check balance it says 0 stars?" He had ticked a job. The stars
// were real and waiting on his own yes, and the screen never said so.
//
// The real page is behind a link token and needs a family with jobs, a tick and
// an approval to show any of this, which is precisely why the copy was never
// looked at in all three states at once. Here it is, on a phone width.

export const dynamic = 'force-static'

const JOBS: JobRow[] = [
  { id: 'a', title: 'Make your bed', emoji: '🛏️', stars: 10 },
  { id: 'b', title: 'Feed the cat', emoji: '🐈', stars: 3 },
  { id: 'c', title: 'Put your reading book in your bag', emoji: '📚', stars: 2 },
  { id: 'd', title: 'Ten minutes of tidying', emoji: '🧹', stars: 1 },
]

const CARD: React.CSSProperties = {
  background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: 22,
  padding: '16px 18px', marginBottom: 14, boxShadow: '0 5px 0 rgba(26,26,46,0.08)',
}
const EYEBROW: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 8,
}

/** One whole balance, the way a child meets it: stars first, jobs under. */
function State({ label, note, banked, approved, waiting }: {
  label: string
  note: string
  banked: number
  approved: string[]
  waiting: string[]
}) {
  const approvedIds = new Set(approved)
  const waitingIds = new Set(waiting)
  const starsOf = (ids: Set<string>) => JOBS.filter(j => ids.has(j.id)).reduce((s, j) => s + j.stars, 0)
  const earned = starsOf(approvedIds)
  const waitingStars = starsOf(waitingIds)
  const stillToEarn = JOBS.filter(j => !approvedIds.has(j.id) && !waitingIds.has(j.id)).reduce((s, j) => s + j.stars, 0)

  return (
    <section style={{ marginBottom: 34 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 2px' }}>{label}</h2>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 12px' }}>{note}</p>

      <div style={CARD}>
        <div style={{ ...EYEBROW, color: 'var(--terracotta-dark)', marginBottom: 6 }}>Your jobs earned</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-3xl)', color: 'var(--ink)', lineHeight: 1 }}>⭐ {banked}</span>
          <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--terracotta-dark)' }}>= {banked * STAR_MINUTES} minutes ready to use</span>
        </div>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '8px 0 0' }}>
          One star is {STAR_MINUTES} minutes. These are yours, they do not disappear at the end of the day.
        </p>
        <WaitingNote stars={waitingStars} />
      </div>

      <div style={CARD}>
        <div style={EYEBROW}>Today, job by job</div>
        <TodayJobs
          jobs={JOBS}
          approvedIds={approvedIds}
          waitingIds={waitingIds}
          earned={earned}
          waiting={waitingStars}
          stillToEarn={stillToEarn}
          token={'0'.repeat(18)}
        />
      </div>
    </section>
  )
}

export default function BalanceTodayFixture() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--tint-sage)', padding: '22px 16px 60px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <State
          label="Just ticked, nothing said yes to yet"
          note="The exact screen Justin was looking at. Zero in the bank is true, and on its own it reads as the app having eaten the work."
          banked={0}
          approved={[]}
          waiting={['a']}
        />
        <State
          label="A grown up has said yes"
          note="The same ten stars, now spendable, and the row is the only thing on the page allowed to look done."
          banked={10}
          approved={['a']}
          waiting={[]}
        />
        <State
          label="Some of each"
          note="One yes, one waiting, two still to do. Three states, three different marks."
          banked={10}
          approved={['a']}
          waiting={['b']}
        />
        <State
          label="Nothing done yet"
          note="Every job outstanding, every row a link through to it."
          banked={0}
          approved={[]}
          waiting={[]}
        />
      </div>
    </div>
  )
}
