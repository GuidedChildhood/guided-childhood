import { HappyPaper, Caption, WriteLine, TickCircle, INK, INK_MUTED, CRAYON, useExample } from './HappyPaper'
import type { Bedtime } from './PhonesToBedSheet'

// My Screen Time Deal, ages 8 to 16 (stages 2 to 5).
//
// The three kinds of time, in three jars a child can see: a core that is
// theirs every day with no strings, the extra they earn with stars, and the
// windows nobody's stars can buy. Under the jars, the ladder the whole
// product runs on (set for me, set together, set by me), with the step they
// are on to colour. Two signatures at the foot, because a deal has two sides.
//
// When printed from the child's app the numbers are the family's real
// settings (minutes per star, the daily core, the bedtime, the protected
// windows), so the paper on the fridge never disagrees with the app. Printed
// anywhere else the lines are dotted and the family writes them in.

export type DealFacts = {
  starMinutes?: number | null
  coreMinutesDaily?: number | null
  bedtime?: Bedtime
  mealtimes?: boolean | null
  schoolHours?: boolean | null
}

function Jar({ label, crayon, children }: { label: string; crayon: string; children: React.ReactNode }) {
  const ex = useExample()
  return (
    <div style={{ position: 'relative', width: 218, height: 300, flexShrink: 0 }}>
      <svg viewBox="0 0 218 300" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
        <rect x="52" y="6" width="114" height="26" rx="8" fill={ex ? CRAYON.paper : '#fff'} stroke={INK} strokeWidth="5" />
        <path d="M40 50 Q40 32 60 32 H158 Q178 32 178 50 V60 Q200 70 200 100 V270 Q200 294 176 294 H42 Q18 294 18 270 V100 Q18 70 40 60 Z" fill={ex ? crayon : '#fff'} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
        <rect x="36" y="118" width="146" height="34" rx="8" fill={ex ? CRAYON.paper : '#fff'} stroke={INK} strokeWidth="4" />
        <text x="109" y="141" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11.5" fontWeight="700" letterSpacing="1.4" fill={INK}>{label.toUpperCase()}</text>
      </svg>
      <div style={{ position: 'absolute', left: 30, right: 30, top: 164, bottom: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
        {children}
      </div>
    </div>
  )
}

export default function ScreenTimeDealSheet({ childName, stars, facts = {} }: {
  childName: string
  stars: number
  facts?: DealFacts
}) {
  const ex = useExample()
  const core = facts.coreMinutesDaily && facts.coreMinutesDaily > 0 ? String(facts.coreMinutesDaily) : null
  const rate = facts.starMinutes && facts.starMinutes > 0 ? String(facts.starMinutes) : null
  const bed = facts.bedtime ? `${facts.bedtime.start} to ${facts.bedtime.end}` : ex ? '8 to 7' : null
  return (
    <HappyPaper
      title="My screen time deal"
      kicker={`${childName ? `${childName}'s deal` : 'Our deal'} · three kinds of time, one page`}
      stars={stars}
      deal="Signed by both of you and on the fridge?"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', flexShrink: 0, padding: '0 6px' }}>
        <Jar label="Mine every day" crayon={CRAYON.sky}>
          <WriteLine label="" height={34} size={13} value={core} sample="30" />
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, textAlign: 'center', lineHeight: 1.3, color: INK }}>
            minutes, no strings. Mine because I am me.
          </div>
        </Jar>
        <Jar label="Earned with stars" crayon={CRAYON.butter}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: INK, paddingBottom: 3, whiteSpace: 'nowrap', flexShrink: 0 }}>1 ⭐ =</span>
            <WriteLine height={34} size={13} value={rate} sample="5" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, textAlign: 'center', lineHeight: 1.3, color: INK }}>
            minutes. Jobs turn into stars, stars turn into time.
          </div>
        </Jar>
        <Jar label="Nobody's" crayon={CRAYON.coral}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TickCircle size={20} filled={!!facts.bedtime} sample />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12.5, color: INK, lineHeight: 1.2 }}>Bedtime{bed ? ` ${bed}` : ''}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TickCircle size={20} filled={!!facts.mealtimes} sample />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12.5, color: INK }}>Mealtimes</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TickCircle size={20} filled={!!facts.schoolHours} sample />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12.5, color: INK }}>School hours</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK_MUTED, textAlign: 'center', marginTop: 2 }}>
            No stars can buy these
          </div>
        </Jar>
      </div>

      {/* The ladder: three steps, colour the one you are on */}
      <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: INK_MUTED, marginBottom: 6 }}>
          The ladder · colour the step you are on
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 178, padding: '0 8px' }}>
          {[
            { title: 'Set for me', sub: 'A grown up holds it', h: 96, on: false },
            { title: 'Set together', sub: 'We hold it together', h: 136, on: true },
            { title: 'Set by me', sub: 'I hold it myself', h: 176, on: false },
          ].map(step => (
            <div key={step.title} style={{ flex: 1, height: step.h, boxSizing: 'border-box', border: `3px solid ${INK}`, borderRadius: 16, background: ex && step.on ? CRAYON.butter : '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 10 }}>
              <TickCircle size={26} sample={step.on} />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: INK, lineHeight: 1.1, textAlign: 'center' }}>{step.title}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ex && step.on ? INK : INK_MUTED, textAlign: 'center' }}>{step.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <Caption size={14} top={2}>
        The deal moves up the ladder as you show you can hold it. That is the whole plan.
      </Caption>

      <div style={{ display: 'flex', gap: 30, padding: '6px 20px 0', flexShrink: 0 }}>
        <WriteLine label="Signed (me)" height={38} size={14} sample={childName || 'Alfie'} />
        <WriteLine label="Signed (grown up)" height={38} size={14} sample="Mum" />
      </div>
    </HappyPaper>
  )
}
