import Link from 'next/link'
import type { Journey } from '@/lib/pathway/journey'

// The pathway as one spine, three strands. Devices first, then the moments
// this family is working through, then the lessons. One node is clearly
// current and glows with the next action, done strands fill in, strands
// ahead wait quietly but stay tappable, never a hard wall. This is the
// single next step view the best journey apps use, in our skin.

type StrandKey = 'devices' | 'moments' | 'lessons'
interface Strand {
  key: StrandKey
  icon: string
  title: string
  subtitle: string
  cta: string
  href: string
  done: boolean
}

function buildStrands(j: Journey, childName: string): Strand[] {
  const devicesDone = j.devices.total === 0 || j.devices.done >= j.devices.total
  const momentsDone = j.moments.open === 0
  const lessonsDone = j.lessons.total === 0 || j.lessons.done >= j.lessons.total

  return [
    {
      key: 'devices',
      icon: '🛡️',
      title: 'Set up every device',
      subtitle: j.devices.total === 0
        ? 'No devices to set for this stage yet.'
        : devicesDone
        ? `All ${j.devices.total} set, the settings are in place.`
        : `${j.devices.done} of ${j.devices.total} set. Next: ${j.devices.nextName ?? 'the next device'}.`,
      cta: devicesDone ? 'Review devices' : 'Set up the next one',
      href: j.devices.href,
      done: devicesDone,
    },
    {
      key: 'moments',
      icon: '🌱',
      title: `Work through what comes up`,
      subtitle: momentsDone
        ? 'Nothing open right now. Flag a hard moment and it lands here.'
        : `${j.moments.open} to work through${j.moments.topLabel ? `, starting with ${j.moments.topLabel.toLowerCase()}` : ''}.`,
      cta: momentsDone ? 'Open the daily page' : 'Work through it',
      href: j.moments.href,
      done: momentsDone,
    },
    {
      key: 'lessons',
      icon: '✦',
      title: `${childName}'s lessons`,
      subtitle: j.lessons.total === 0
        ? 'Lessons for this stage are coming.'
        : lessonsDone
        ? `All ${j.lessons.total} done for this stage.`
        : `${j.lessons.done} of ${j.lessons.total} done. Next: ${j.lessons.nextTitle ?? 'your next lesson'}.`,
      cta: lessonsDone ? 'Revisit lessons' : 'Do the next lesson',
      href: j.lessons.href,
      done: lessonsDone,
    },
  ]
}

export default function PathwayJourney({
  journey,
  childName,
  stageName,
  stageAges,
}: {
  journey: Journey
  childName: string
  stageName: string
  stageAges: string
}) {
  const strands = buildStrands(journey, childName)
  const currentIndex = strands.findIndex(s => !s.done)
  const allDone = currentIndex === -1

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)', borderRadius: '22px',
      padding: '22px 22px 24px', boxShadow: '0 6px 26px rgba(26,26,46,0.07)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          Your journey
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, color: 'var(--ink-muted)' }}>
          {stageName} · {stageAges}
        </span>
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', letterSpacing: '-0.03em', lineHeight: 1.12, margin: '0 0 4px' }}>
        {allDone ? 'This stage is walked' : 'One step at a time to independence'}
      </h2>
      <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 20px' }}>
        {allDone
          ? `Settings set, moments worked through, lessons done. ${childName} is ready for what comes next.`
          : 'The goal is not control. It is a young person who does not need it. Here is the next thing that gets you there.'}
      </p>

      <div style={{ position: 'relative' }}>
        {/* The spine */}
        <div style={{ position: 'absolute', left: '21px', top: '20px', bottom: '20px', width: '2.5px', background: 'var(--border)', borderRadius: '2px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {strands.map((s, i) => {
            const isCurrent = i === currentIndex
            const isDone = s.done
            const ahead = !isDone && !isCurrent
            return (
              <div key={s.key} style={{ position: 'relative', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                {/* Node */}
                <div style={{
                  position: 'relative', zIndex: 1, flexShrink: 0,
                  width: 44, height: 44, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                  background: isDone ? 'var(--tint-sage)' : isCurrent ? 'var(--terracotta-lt)' : '#fff',
                  border: isDone ? '2.5px solid var(--tint-sage)' : isCurrent ? '3px solid var(--terracotta)' : '2.5px solid var(--border)',
                  boxShadow: isCurrent ? '0 0 0 5px var(--terracotta-lt)' : 'none',
                  filter: ahead ? 'grayscale(1) opacity(0.6)' : 'none',
                }}>
                  {isDone ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="var(--sage-ink, #2D5016)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span aria-hidden="true">{s.icon}</span>
                  )}
                </div>

                {/* Card */}
                <div style={{
                  flex: 1, minWidth: 0,
                  background: isCurrent ? 'var(--terracotta-lt)' : 'var(--cream)',
                  border: `1.5px solid ${isCurrent ? 'var(--terracotta)' : 'var(--border)'}`,
                  borderRadius: '16px', padding: '14px 16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
                      {s.title}
                    </span>
                    {isCurrent && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', background: '#fff', border: '1px solid var(--terracotta)', borderRadius: '100px', padding: '2px 8px' }}>
                        Do this next
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '4px 0 12px' }}>
                    {s.subtitle}
                  </p>
                  <Link href={s.href} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
                    padding: isCurrent ? '10px 18px' : '8px 14px', borderRadius: '12px',
                    background: isCurrent ? 'var(--terracotta)' : '#fff',
                    color: 'var(--ink)',
                    border: isCurrent ? 'none' : '1.5px solid var(--border)',
                    boxShadow: isCurrent ? '0 3px 0 var(--terracotta-dark)' : 'none',
                  }}>
                    {s.cta} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
