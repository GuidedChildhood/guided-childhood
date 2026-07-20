import DigiCharacter from '@/components/digi/DigiCharacter'
import StreakFlame from '@/components/daily/StreakFlame'

// The top of the simplified Home: DiGi greets in one sentence that folds in
// the road position and today's minutes, with the streak flame on the right.
// Server rendered, no fetches of its own: Home already knows all of this.

export default function DigiGreeting({
  firstName, childName, stageName, stageNum, minutesLeft, dayDone, streakCount, aliveToday,
}: {
  firstName: string
  childName?: string
  stageName: string
  stageNum: number
  minutesLeft: number
  dayDone: boolean
  streakCount: number
  aliveToday: boolean
}) {
  const kid = childName && childName !== 'Your child' ? childName : 'Your child'
  const ukHour = Number(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London', hour: 'numeric', hour12: false }))
  const daypart = ukHour < 12 ? 'Morning' : ukHour < 18 ? 'Afternoon' : 'Evening'

  const line = dayDone
    ? `${daypart} ${firstName}. ${kid} is at stamp ${stageNum} of 5, ${stageName} stage, and today is already done. Lovely.`
    : `${daypart} ${firstName}. ${kid} is at stamp ${stageNum} of 5, ${stageName} stage, and today takes about ${minutesLeft} more ${minutesLeft === 1 ? 'minute' : 'minutes'}.`

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
      </div>
      <div style={{ flexShrink: 0 }}>
        <StreakFlame count={streakCount} aliveToday={aliveToday} />
      </div>
    </div>
  )
}
