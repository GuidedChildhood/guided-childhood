import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import StreakFlame from '@/components/daily/StreakFlame'

// The top of the simplified Home: DiGi greets in one sentence that folds in
// the road position and today's minutes, with the streak flame on the right.
// It also reads across to the child's own app: whether their jobs are on track
// and being done, with a tap through to the screen and jobs balance. Server
// rendered, no fetches of its own: Home already knows all of this.

export default function DigiGreeting({
  firstName, childName, stageName, stageNum, minutesLeft, dayDone, streakCount, aliveToday,
  jobsStatus, jobsStreakDays = 0, balanceHref,
}: {
  firstName: string
  childName?: string
  stageName: string
  stageNum: number
  minutesLeft: number
  dayDone: boolean
  streakCount: number
  aliveToday: boolean
  // The child's jobs, read from their own app: on_track when today's jobs are
  // all confirmed, pending when some are still to do, none when no jobs are set.
  jobsStatus?: 'on_track' | 'pending' | 'none'
  jobsStreakDays?: number
  balanceHref?: string
}) {
  const kid = childName && childName !== 'Your child' ? childName : 'Your child'
  const ukHour = Number(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London', hour: 'numeric', hour12: false }))
  const daypart = ukHour < 12 ? 'Morning' : ukHour < 18 ? 'Afternoon' : 'Evening'

  const line = dayDone
    ? `${daypart} ${firstName}. ${kid} is at stamp ${stageNum} of 5, ${stageName} stage, and today is already done. Lovely.`
    : `${daypart} ${firstName}. ${kid} is at stamp ${stageNum} of 5, ${stageName} stage, and today takes about ${minutesLeft} more ${minutesLeft === 1 ? 'minute' : 'minutes'}.`

  // The jobs read, connecting the parent view to the child's own app: whether
  // their jobs are on track and being done, warm and plain.
  const jobsLine =
    jobsStatus === 'on_track'
      ? (jobsStreakDays >= 2 ? `Jobs on track, ${jobsStreakDays} days on the trot` : 'Jobs on track, all done today')
      : jobsStatus === 'pending' ? 'Jobs still to do today'
      : jobsStatus === 'none' ? 'No jobs set yet' : null
  const jobsTone =
    jobsStatus === 'on_track' ? 'var(--retro-green-dark)'
    : jobsStatus === 'pending' ? 'var(--terracotta-dark)'
    : 'var(--ink-muted)'

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '18px' }}>
      <span style={{
        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
        background: 'var(--terracotta)', border: '2px solid var(--terracotta-dark)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 3px 0 var(--terracotta-dark)',
      }}>
        <DigiCharacter mood="speak" size={30} once />
      </span>
      <div style={{
        flex: 1, minWidth: 0, background: '#fff', border: '1.5px solid var(--border)',
        borderRadius: '4px 18px 18px 18px', padding: '11px 14px',
        boxShadow: '0 3px 0 rgba(26,26,46,0.05)',
      }}>
        <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.45 }}>
          {line}
        </p>
        {jobsLine && (
          <Link
            href={balanceHref ?? '/dashboard/quests'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '8px',
              textDecoration: 'none',
            }}
          >
            <span aria-hidden style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: jobsTone,
            }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12.5px', color: jobsTone }}>
              {jobsLine}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--ink-muted)' }}>
              · screen and jobs balance →
            </span>
          </Link>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>
        <StreakFlame count={streakCount} aliveToday={aliveToday} />
      </div>
    </div>
  )
}
