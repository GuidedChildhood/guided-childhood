'use client'

import WorryIcon from '@/components/onboarding/WorryIcon'
import { WORRIES } from '@/lib/onboarding/worries'

// The grid of worries, in the happy news finish.
//
// A white card on the warm ground with an ink edge and a hard 4px ledge, the
// colour carried by the icon plate rather than the fill, exactly as the parent
// home tiles do (components/ui/SectionTiles). Chosen goes butter and the ledge
// deepens to 5px, so a ticked tile reads across a room instead of asking to be
// compared with its neighbour, and the tick badge says it a second way for
// anybody who cannot tell the two backgrounds apart.
//
// Its own component so the wizard and /dev/worries draw the same thing, which
// is the only way a screen behind a login can be checked at 390 and 1200.
//
// ── THE ONE WE OPEN ON ──────────────────────────────────────────────────────
//
// Justin, 9 September 2026, on the old quiz: "says start here on several icons
// which does not make sense." It did not. That screen put a "Start with this"
// chip on EVERY ticked tile except the first, because it was a button for
// promoting one, but it read as a label claiming three different tiles were
// the starting point at once.
//
// So the control is gone and the fact stays: the first one ticked is the one
// tomorrow opens on, one pill says so on that tile alone, and untick and
// retick is how you change it. Two taps, no chrome, nothing to misread.
//
// The pill says "First" and not "We start here" because a 164px tile at 390
// wraps the longer phrase onto two lines inside the card, which looks like a
// mistake. The full sentence is under the grid, where it has the width.
//
// The pill's row is reserved on EVERY tile whether or not it is filled, so
// ticking a tile never nudges the grid under a thumb that is still choosing.

export default function WorryPicker({
  selected, onToggle, primary,
}: {
  selected: string[]
  onToggle: (id: string) => void
  /** The worry tomorrow opens on. Omit for a plain grid with no marker. */
  primary?: string | null
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'stretch' }}>
      {WORRIES.map(w => {
        const on = selected.includes(w.id)
        const first = primary === w.id
        return (
          <button
            key={w.id}
            onClick={() => onToggle(w.id)}
            aria-pressed={on}
            style={{
              background: on ? 'var(--terracotta-lt)' : '#fff',
              border: '2px solid var(--ink)',
              borderRadius: 18,
              boxShadow: on ? '0 5px 0 var(--ink)' : '0 4px 0 var(--ink)',
              // Room for the badge in the top right, and a floor that keeps a
              // one word tile the same height as "Seeing things they should
              // not" so the grid never looks half built.
              padding: '13px 13px 15px',
              minHeight: primary === undefined ? 118 : 132,
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: '9px',
              height: '100%',
              position: 'relative',
              transition: 'background 0.12s, box-shadow 0.12s',
            }}
          >
            <span aria-hidden style={{
              width: 44, height: 44, borderRadius: 13,
              background: w.tint, border: '2px solid var(--ink)', boxSizing: 'border-box',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, color: 'var(--ink)',
            }}>
              <WorryIcon name={w.icon} size={24} />
            </span>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'var(--text-md)', lineHeight: 1.25, color: 'var(--ink)',
            }}>
              {w.label}
            </span>
            {primary !== undefined && (
              <span style={{ marginTop: 'auto', paddingTop: 6, minHeight: 19, display: 'block' }}>
                {first && (
                  <span style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    // Gold on ink, the house pairing. NOT var(--butter):
                    // there is no such token, and a colour that does not
                    // resolve inherits ink, which drew this pill as a solid
                    // black blob with invisible words in it. Caught in the
                    // 390 screenshot, which is the only place it shows.
                    background: 'var(--ink)', color: 'var(--terracotta)',
                    borderRadius: 100, padding: '3px 9px',
                  }}>
                    First
                  </span>
                )}
              </span>
            )}
            {on && (
              <span aria-hidden style={{
                position: 'absolute', top: 9, right: 9,
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--terracotta)', border: '2px solid var(--ink)',
                boxSizing: 'border-box',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7" />
                </svg>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
