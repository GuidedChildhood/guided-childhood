// Layout fixture for buttons whose label is longer than the button.
//
// Justin, 8 August 2026, on the founder rate CTA: "text doesn't quite fit."
//
// This page exists because of a lesson that cost most of a day earlier this
// week: a fixture that renders less than the real thing certifies nothing.
// Three separate fixtures passed while showing a narrower or shorter case than
// production, so this one deliberately carries the LONGEST labels in the app,
// measured out of the source rather than invented, and puts them in the
// narrowest column they actually appear in.
//
// The failure being guarded against is specific. `.btn` used to set
// `white-space: nowrap`, so a label too wide for its button did not wrap and
// did not shrink the button. It hung outside it, over the card behind, which
// is what Justin photographed. It also pushed the page sideways, which is very
// likely part of the sideways scroll he asked about separately.
//
// 404s in production via middleware, like every other ref-* page.

export const dynamic = 'force-dynamic'

// Real labels, taken from the app. The first is the one in the screenshot.
const LABELS = [
  'Claim founder rate, £7.99 a month',
  "Find your child's stage, it is free →",
  'Wellbeing tracker and the family agreement builder',
  'Claim founder rate',
  'Get the starter pack',
  'Play it again ↻',
]

// The widths that matter. The upgrade card is the narrowest column a full
// width button lives in, and 320 is the smallest phone we support.
const WIDTHS = [320, 360, 390]

export default function RefButtons() {
  return (
    <main style={{ background: 'var(--app-bg)', minHeight: '100vh', padding: '20px 12px 60px' }}>
      <p className="eyebrow" style={{ color: 'var(--ink-muted)', margin: '0 0 14px' }}>
        Reference · long labels in short buttons
      </p>

      {WIDTHS.map(w => (
        <section key={w} style={{ marginBottom: 26 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', margin: '0 0 8px' }}>
            {w}px column
          </p>
          {/* The dark card the founder button actually sits inside, at its
              real padding, so the button gets the width it really gets. */}
          <div
            data-probe={`card-${w}`}
            style={{ width: w, maxWidth: '100%', background: 'var(--deep-teal)', borderRadius: 22, padding: '18px 22px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LABELS.map(label => (
                <button
                  key={label}
                  type="button"
                  data-probe="btn"
                  className="btn btn-gold"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 'var(--text-md)', padding: 16 }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Buttons that size to their own text rather than filling the column.
          These are the ones that used to push the page sideways. */}
      <section>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', margin: '0 0 8px' }}>
          Auto width, inside a 320px column
        </p>
        <div data-probe="card-auto" style={{ width: 320, maxWidth: '100%', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18, padding: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {LABELS.map(label => (
              <button key={label} type="button" data-probe="btn" className="btn btn-gold">
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
