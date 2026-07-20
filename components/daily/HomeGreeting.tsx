import DigiCharacter from '@/components/digi/DigiCharacter'
import StreakFlame from '@/components/daily/StreakFlame'

// The top of the narrowed home: DiGi greets in one sentence that folds in the
// road position and today's minutes, with the streak chip on the right. One
// line, same shape every day, so the screen opens with a voice, not a wall.

function minutesWord(m: number): string {
  return m === 5 ? 'five' : m === 15 ? 'fifteen' : m === 10 ? 'ten' : String(m)
}

export default function HomeGreeting({
  firstName, childName, stageName, stageNum, minutes, dayDone, streakCount, aliveToday,
}: {
  firstName: string
  childName?: string
  stageName: string
  stageNum: number
  minutes: number
  dayDone: boolean
  streakCount: number
  aliveToday: boolean
}) {
  const kid = childName && childName !== 'Your child' ? childName : 'Your child'
  const ukHour = Number(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London', hour: 'numeric', hour12: false }))
  const daypart = ukHour < 12 ? 'Morning' : ukHour < 17 ? 'Afternoon' : 'Evening'
  const sentence = dayDone
    ? `${daypart} ${firstName}. ${kid} is on the ${stageName} stage, stamp ${stageNum} of 5, and today is already done. Lovely.`
    : `${daypart} ${firstName}. ${kid} is on the ${stageName} stage, stamp ${stageNum} of 5, and today takes about ${minutesWord(minutes)} minutes.`

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '16px' }}>
      <span style={{
        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
        background: 'var(--terracotta)', border: '2px solid var(--terracotta-dark)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        <DigiCharacter mood="happy" size={28} once />
      </span>
      <div style={{
        background: '#fff', border: '1.5px solid var(--border)',
        borderRadius: '4px 18px 18px 18px', padding: '11px 14px',
        boxShadow: '0 3px 0 rgba(26,26,46,0.05)', minWidth: 0,
      }}>
        <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.45 }}>
          {sentence}
        </p>
      </div>
      <span style={{ marginLeft: 'auto', flexShrink: 0 }}>
        <StreakFlame count={streakCount} aliveToday={aliveToday} />
      </span>
    </div>
  )
}
