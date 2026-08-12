import Link from 'next/link'
import DigiCharacter from '@gc/shared/components/DigiCharacter'

// The top of Home: DiGi greets in one short, mobile clean line, then one warm
// line that reads across to the child's own app, whether their jobs are on
// track, tapping straight through to the jobs. The daily streak lives on the
// path below and in the streak card, so it is not repeated up here. Server
// rendered, no fetches of its own: Home already knows all of this.

export default function DigiGreeting({
  firstName, childName, stageNum, minutesLeft, dayDone,
  jobsStatus, jobsStreakDays = 0, balanceHref, nextUpCoversJobs = false,
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
  /** The card directly underneath is already about the jobs, so this line would
   *  be the same thing said twice, one line apart, with the smaller tap target
   *  of the two. See the note above the jobs line below. */
  nextUpCoversJobs?: boolean
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
  // ── SAID ONCE, ON THE NICER CARD (12 August 2026) ──────────────────────────
  //
  // Justin, with a screenshot of this line reading "Teo has jobs to do today,
  // see the jobs" directly above a card reading "Teo's quests, jobs to check
  // off": "we should just keep the Teo's jobs as it looks nicer and it's doing
  // the same as the afternoon one, although make sure we don't break any logic
  // behind it."
  //
  // He is right, and the card wins on every count: a real button, a bigger tap
  // target, an icon, and room to say what is actually waiting. This line was
  // the same sentence in a smaller font one line higher.
  //
  // SO IT GOES QUIET, IT DOES NOT GO AWAY, and the difference matters. Three of
  // the four cards below are about jobs; the fourth is the passport. On a
  // passport day this is the only place a parent hears "jobs on track, 3 days on
  // the trot", which is worth telling them and is said nowhere else on the
  // screen. Deleting the line would have quietly taken that with it.
  //
  // The deep link to the board moved to the card rather than being dropped.
  const pending = jobsStatus === 'pending'
  const jobsLine = nextUpCoversJobs ? null
    : jobsStatus === 'on_track'
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
        <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.45 }}>
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
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: jobsTone }}>
              {jobsLine}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)' }}>
              · {jobsSuffix}
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}
