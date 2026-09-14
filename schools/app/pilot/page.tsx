import type { Metadata } from 'next'
import Link from 'next/link'
import { MODULE_COUNT, FLAGGED_MODULES } from '@gc/shared/schools-curriculum'
import { PILOT_PLACES } from '@/lib/pilot'
import { pilotPlacesLeft } from '@/lib/pilot-places'
import { TASTER_MODULES } from '@/lib/taster'
import PilotForm from './PilotForm'

// THE PILOT PAGE. Open to the world, the door every "Request a pilot" button
// on the site goes through (the schools review, decision 2: bring the request
// into the product). It used to be a Mailchimp form in a new tab.
//
// A pilot is two lessons, free, for one term, for the first five schools,
// matched to the phase the school teaches (Justin, 14 September 2026: the
// pilot has to make paying customers, not give the scheme away). The five
// is read from lib/pilot.ts and the places left are counted from the
// requests themselves, so the page can never claim a place it does not
// have. When the five are gone the form stays open and says so: the next
// round starts with whoever asks.

export const metadata: Metadata = {
  title: 'Request a free pilot',
  description: 'Teach two Guided Childhood digital literacy lessons free for one term, matched to the phase you teach. Five places, one school code, no card, no contract, no pupil data.',
  alternates: { canonical: 'https://schools.guidedchildhood.com/pilot' },
}

export const dynamic = 'force-dynamic'

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
}
const body: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7,
}

export default async function PilotPage() {
  const left = await pilotPlacesLeft()
  const full = left !== null && left <= 0

  const included = [
    'Two lessons matched to the phase you teach, on one code for the whole staff room',
    'The classroom player with the word for word script on every slide',
    'Every printable for both: the pack, the pupil booklet, the organiser, the two quizzes, the learning record',
    `The compliance Hub, the RSHE mapping matrix and the ${FLAGGED_MODULES.length} staff briefings`,
    `The map of all ${MODULE_COUNT} modules, Reception to Year 13, open to read`,
    'A reply within two working days, usually the same day',
  ]

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '48px 20px 90px' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'start' }}>
        <div>
          <p style={{ ...eyebrow, marginBottom: '12px' }}>A free one term pilot</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 4.6vw, 3rem)', letterSpacing: '-0.03em', lineHeight: 1.08, color: 'var(--ink)', marginBottom: '16px', textWrap: 'balance' }}>
            Teach it for a term. Decide after.
          </h1>
          <p style={{ ...body, marginBottom: '14px' }}>
            The first {PILOT_PLACES} schools get two lessons free for a term, matched to the phase they teach, with every printable and the Hub. No card, no contract, no pupil data.
          </p>
          <p style={{ ...body, marginBottom: '22px' }}>
            At the end of the term you carry on with a licence or you stop, and either way we will have learned something from you.
          </p>

          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: full ? 'var(--ink-muted)' : 'var(--stage-1-text)',
            background: full ? 'var(--border)' : 'var(--stage-1)', border: `1.5px solid ${full ? 'var(--border)' : 'var(--stage-1-bold)'}`,
            borderRadius: '100px', padding: '8px 14px', display: 'inline-block', marginBottom: '26px',
          }}>
            {left === null
              ? `${PILOT_PLACES} places`
              : full
                ? `The first ${PILOT_PLACES} places are taken`
                : `${left} of ${PILOT_PLACES} places left`}
          </p>

          <div style={{ ...eyebrow, color: 'var(--ink-muted)', marginBottom: '10px' }}>What the pilot includes</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {included.map(line => (
              <li key={line} style={{ ...body, display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span aria-hidden style={{ color: 'var(--terracotta-dark)', fontWeight: 900, flexShrink: 0 }}>✓</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <p style={{ ...body, fontSize: 'var(--text-base)' }}>
            Not ready to ask yet? <Link href={`/lesson/${TASTER_MODULES[0]}`} style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>Teach the sample lesson first</Link>. It is the real thing, nothing locked.
          </p>
        </div>

        <PilotForm full={full} />
      </div>
    </main>
  )
}
