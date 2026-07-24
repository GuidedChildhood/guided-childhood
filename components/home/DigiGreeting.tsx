import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'

// The top of Home: DiGi greets in one short, mobile clean line, then one warm
// line that reads across to the child's own app, whether their jobs are on
// track, tapping straight through to the jobs. The daily streak lives on the
// path below and in the streak card, so it is not repeated up here. Server
// rendered, no fetches of its own: Home already knows all of this.

export default function DigiGreeting({
  firstName, childName, stageNum, minutesLeft, dayDone,
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

  // Two short sentences, not one long run on, so it reads clean on a phone.
  const line = dayDone
    ? `${daypart} ${firstName}. ${kid} is on stamp ${stageNum} of 5, and today is done. Lovely.`
    : `${daypart} ${firstName}. ${kid} is on stamp ${stageNum} of 5. Today takes about ${minutesLeft} ${minutesLeft === 1 ? 'minute' : 'minutes'}.`

  // The jobs read, in the child's name, connecting the parent view to the
  // child's own app. When there are jobs still to do it lands straight on the
  // jobs; when done it goes to the screen and jobs balance.
  const pending = jobsStatus === 'pending'
  const jobsLine =
    jobsStatus === 'on_track'
      ? (jobsStreakDays >= 2 ? `Jobs on track, ${jobsStreakDays} days on the trot` : 'Jobs on track, all done today')
      : pending ? `${kid} has jobs to do today`
      : jobsStatus === 'none' ? 'No jobs set yet' : null
  const jobsTone =
    jobsStatus === 'on_track' ? 'var(--retro-green-dark)'
    : pending ? 'var(--terracotta-dark)'
    : 'var(--ink-muted)'
  const jobsHref = pending ? '/dashboard/quests#quest-board' : (balanceHref ?? '/dashboard/quests')
  const jobsSuffix = pending ? 'see the jobs →' : 'screen and jobs balance →'

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
            href={jobsHref}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '8px',
              textDecoration: 'none', flexWrap: 'wrap',
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
              · {jobsSuffix}
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}
