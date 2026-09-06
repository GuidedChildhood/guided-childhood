import Link from 'next/link'
import PrintButton from '@/components/PrintButton'

// The accessibility statement: honest about what the player supports today
// and what is still improving, dated so a school can see it is maintained.
// Written for the SENDCo and the procurement checklist, not for lawyers.
// The P0 wave (plans/2026-09-06-p0-wave-plan.md) shipped the reduced motion
// support, the slide announcements and the focus styles it describes.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.7 }
const block: React.CSSProperties = { border: '1.5px solid var(--border)', borderRadius: '14px', padding: '16px 20px', marginBottom: '14px' }
const h2: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 8px' }

export default function AccessibilityPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton />
        </div>

        <div style={mono}>For your SENDCo and procurement checklist</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '6px 0 8px' }}>
          Accessibility statement
        </h1>
        <p style={{ ...body, marginBottom: '20px' }}>
          The design of this programme starts from the classroom where nothing goes right: no
          projector, no sound, a class with every kind of learner in it. That is why every lesson has
          a complete paper fallback and why the teacher, never the platform, holds the room. This
          statement covers the interactive player and the printed materials, says what works today,
          and names what we are still improving. Last reviewed 6 September 2026.
        </p>

        <div style={block}>
          <h2 style={h2}>What the player supports today</h2>
          <p style={body}>
            Full keyboard navigation (arrow keys move between slides, every control is a real button
            or link with a visible focus ring). Screen reader announcements of each slide change with
            its phase and position. Respect for the reduce motion setting on every animation: slides,
            reveals, the progress bar and all classroom interactives hold still or jump to their
            finished state, and the teaching always survives because the words carry it. Text sizes
            follow the device&rsquo;s own text size setting throughout. Colour is never the only
            carrier of meaning, and every statistic and verdict is written as well as coloured.
          </p>
        </div>

        <div style={block}>
          <h2 style={h2}>How the materials reach every learner</h2>
          <p style={body}>
            Every module carries support and stretch guidance in its teacher notes, three named
            misconceptions with corrections, and a paper fallback that runs the whole lesson with no
            screen. Worksheets are designed for handwriting, pointing or verbal answers, and the
            scripts tell the teacher when to offer each. Lessons are taught by the teacher from a
            script, so pace, repetition and rephrasing are always in human hands rather than fixed by
            software.
          </p>
        </div>

        <div style={block}>
          <h2 style={h2}>What we are still improving</h2>
          <p style={body}>
            Named adaptations for specific SEND profiles per module are being written into the
            teacher notes, following the same pattern as the misconceptions. Some decorative text in
            the player still uses fixed sizes we are converting to scale with device settings. We
            review this statement as the product moves, and the date above changes when it does.
          </p>
        </div>

        <div style={block}>
          <h2 style={h2}>Tell us what your classroom needs</h2>
          <p style={body}>
            If a pupil in your class cannot use something in this programme, that is a bug to us, not
            an edge case. Write to justin@thesocialbillboard.com with the module and what happened,
            and it goes on the same board as every other fix.
          </p>
        </div>
      </div>
    </main>
  )
}
