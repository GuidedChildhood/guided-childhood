import ConcernAcknowledge from '@/components/daily/ConcernAcknowledge'

// Day one, with made up worries, so the screen can be seen at both sizes
// without an account. Same job as ref-baseline-checkin, and the middleware
// 404s every /ref- route in production.
//
// TWO CHILDREN AND AN AWKWARD LIST, deliberately. One child with seven worries
// is the case Justin actually hit, and a second child is what proves the
// grouping reads as two short lists rather than one wall. A fixture where
// everything is tidy only proves that tidy fits.

export const metadata = { title: 'Ref: day one acknowledgement' }

const GROUPS = [
  {
    id: 'child-1',
    name: 'Timbotee',
    concerns: [
      { id: 'c1', label: 'Biting' },
      { id: 'c2', label: 'Mood after screens' },
      { id: 'c3', label: 'Controller fights' },
      { id: 'c4', label: 'Bedtime screens' },
      { id: 'c5', label: 'Coming off screens' },
      { id: 'c6', label: 'Phones and messaging' },
      { id: 'c7', label: 'Social media' },
    ],
  },
  {
    id: 'child-2',
    name: 'Alma Rose',
    concerns: [
      { id: 'c8', label: 'Coming off screens' },
      { id: 'c9', label: 'Wanting a phone like her friends' },
    ],
  },
]

export default function RefCheckInAcknowledge() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 20px 40px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 8px' }}>
          Today · first thing
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--ink)', margin: '0 0 14px' }}>
          Heard. Here is what we start on
        </h1>
        <ConcernAcknowledge groups={GROUPS} />
      </div>
    </div>
  )
}
