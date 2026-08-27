import Link from 'next/link'
import { STAR_MINUTES } from '@/lib/quests/templates'

// The two pieces of the child's balance page that have to agree with each other.
//
// They are here rather than inline in the page for one reason: the bug they fix
// was two sums twenty lines apart quietly answering different questions, and
// nothing could look at either of them. In a component they can be rendered at
// /dev/balance-today in all three states and checked on a phone width, which is
// how the copy was proved rather than assumed.

export type JobRow = {
  id: string
  title: string
  emoji: string
  stars: number
}

/**
 * The line under the star count when a tick is waiting on a grown up.
 *
 * The sentence Justin's screen was missing. A child who has just ticked a job
 * and reads a balance of zero has to be told, in the same breath as the zero,
 * that the stars exist and where they are. Without it the number reads as the
 * app having eaten their work.
 */
export function WaitingNote({ stars }: { stars: number }) {
  if (stars <= 0) return null
  const one = stars === 1
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, background: 'var(--tint-sage)', borderRadius: 14, padding: '10px 12px', marginTop: 10 }}>
      <span aria-hidden style={{ fontSize: 'var(--text-md)', flexShrink: 0 }}>⏳</span>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.45, margin: 0 }}>
        <strong>{stars} more star{one ? '' : 's'}</strong> {one ? 'is' : 'are'} waiting for a grown up to say yes. Nothing is lost, {one ? 'it lands' : 'they land'} here the moment they do.
      </p>
    </div>
  )
}

/**
 * Today's jobs, one row each, in three states.
 *
 * Three, not two. A ticked job used to look exactly like an approved one, struck
 * through with a tick beside it, which is what turned a balance of zero into
 * something that looked broken. Done is now the only thing that looks done.
 */
export function TodayJobs({
  jobs, approvedIds, waitingIds, earned, waiting, stillToEarn, token,
  starMinutes = STAR_MINUTES,
}: {
  jobs: JobRow[]
  approvedIds: Set<string>
  waitingIds: Set<string>
  earned: number
  waiting: number
  stillToEarn: number
  token: string
  /** What one star buys THIS child (migration 225). Defaults to the
   *  deployment rate for surfaces that cannot supply it. */
  starMinutes?: number
}) {
  if (jobs.length === 0) {
    return (
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
        No jobs set for today.
      </p>
    )
  }
  return (
    <>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 10px' }}>
        <strong>{earned} star{earned === 1 ? '' : 's'}</strong> in the bank so far today
        {waiting > 0 && <>, <strong>{waiting}</strong> waiting on a yes</>}
        {stillToEarn > 0 && <>, and <strong>{stillToEarn} more</strong> still there to be had, worth {stillToEarn * starMinutes} minutes.</>}
        {stillToEarn === 0 && <>. Everything for today is done.</>}
      </p>
      {/* An outstanding job is a link to the job, not a line about it. Justin:
          it "lets them know what jobs are outstanding but can they actually
          click to go to those jobs". A child reading a list of what they still
          owe, with no way through to it, has to remember the list and go and
          find it, which is the moment the page stops being useful. A done one
          is a record and has nowhere to go, and a waiting one has nowhere to go
          either: the next move belongs to a grown up. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {jobs.map(q => {
          const approved = approvedIds.has(q.id)
          const pending = waitingIds.has(q.id)
          const settled = approved || pending
          const row = (
            <>
              <span aria-hidden style={{ fontSize: 'var(--text-md)', flexShrink: 0, opacity: approved ? 0.55 : 1 }}>
                {approved ? '✓' : pending ? '⏳' : q.emoji}
              </span>
              <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.35, textDecoration: approved ? 'line-through' : 'none', opacity: approved ? 0.55 : 1 }}>
                {q.title}
              </span>
              <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: approved ? 'var(--ink-muted)' : 'var(--terracotta-dark)' }}>
                {pending ? 'waiting on a yes' : `${q.stars * starMinutes} min`}
              </span>
              {!settled && (
                <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink-muted)' }}>›</span>
              )}
            </>
          )
          const base: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 9 }
          if (settled) return <div key={q.id} style={base}>{row}</div>
          return (
            <Link
              key={q.id}
              href={`/k/${token}#kid-today`}
              style={{ ...base, textDecoration: 'none', color: 'inherit', borderRadius: 10, margin: '0 -6px', padding: '4px 6px' }}
            >
              {row}
            </Link>
          )
        })}
      </div>
    </>
  )
}
