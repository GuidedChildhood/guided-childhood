'use client'

import { useState } from 'react'

import WorryIcon from '@/components/onboarding/WorryIcon'
import { WORRIES, CATCH_ALL_ID } from '@/lib/onboarding/worries'

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
  selected, onToggle, primary, other, onOther,
}: {
  selected: string[]
  onToggle: (id: string) => void
  /** The worry tomorrow opens on. Omit for a plain grid with no marker. */
  primary?: string | null
  /** Their own words, when Something else is ticked. Omit both to hide it. */
  other?: string
  onOther?: (text: string) => void
}) {
  const savedOther = (other ?? '').trim()
  const showOther = onOther !== undefined && selected.includes(CATCH_ALL_ID)
  // ── WHY THE FIELD HAS A DRAFT OF ITS OWN ──────────────────────────────────
  //
  // Justin, 9 September 2026: "can we make the something else box where they
  // type in appear in the box and they click to save."
  //
  // It used to write every keystroke straight up to the quiz, which meant
  // there was no such thing as saving and so no way to show it had been. A
  // parent typed their worry into a bare box and got no answer back at all.
  //
  // So the field holds a draft, and Save is what commits it. `other` is the
  // SAVED value and nothing else, which also means the value that reaches
  // onboarding_answers is one the parent chose to keep rather than whatever
  // they happened to have typed when they tapped Continue.
  const [draft, setDraft] = useState(savedOther)
  const dirty = draft.trim() !== savedOther
  const commit = () => { if (draft.trim() !== savedOther) onOther?.(draft.trim()) }
  return (
    <div>
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
              {/* Once they have saved their own words, the tile wears them.
                  A parent who typed "getting off the Switch at teatime" and
                  then sees a tile still reading "Something else" has been
                  asked a question and shown our label back. */}
              {w.id === CATCH_ALL_ID && savedOther ? savedOther : w.label}
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

    {/* ── SOMETHING ELSE, IN THEIR OWN WORDS ────────────────────────────────
        Justin, 9 September 2026: "How do we deal with something else? Note
        they can add as many as they want and all areas we will cover through
        the journey."

        It was the one tile that did nothing. No slug, so no concern row, so
        the parent who could not find themselves in nine tiles told us their
        worry and we dropped it between the question and the check in. Their
        words become a real worry now, rated at check in beside the rest.

        The field appears only once the tile is ticked, so nine tiles do not
        arrive with a text box under them, and it is never required: a parent
        who ticks it and types nothing has still said "there is something
        else", which is worth hearing on its own. */}
    {showOther && (
      <div style={{ marginTop: 12 }}>
        <label
          htmlFor="worry-other"
          style={{
            display: 'block', marginBottom: 7,
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)',
          }}
        >
          What is it, in your words
        </label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'stretch', flexWrap: 'wrap' }}>
          <input
            id="worry-other"
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value.slice(0, 80))}
            // Saved on blur and on Enter as well as on the button. The button
            // is the affordance a parent looks for; the other two stop the
            // words being lost by someone who simply carried on.
            onBlur={commit}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commit() } }}
            placeholder="Getting off the Switch at teatime"
            maxLength={80}
            style={{
              flex: '1 1 190px', minWidth: 0, boxSizing: 'border-box',
              padding: '13px 15px',
              background: '#fff', border: '2px solid var(--ink)', borderRadius: 14,
              boxShadow: '0 4px 0 var(--ink)',
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)',
            }}
          />
          <button
            type="button"
            onClick={commit}
            disabled={!dirty || !draft.trim()}
            style={{
              flexShrink: 0,
              padding: '13px 20px',
              background: dirty && draft.trim() ? 'var(--terracotta)' : 'var(--border)',
              color: 'var(--ink)',
              border: '2px solid var(--ink)', borderRadius: 14,
              boxShadow: dirty && draft.trim() ? '0 4px 0 var(--ink)' : 'none',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
              cursor: dirty && draft.trim() ? 'pointer' : 'default',
              opacity: dirty && draft.trim() ? 1 : 0.55,
            }}
          >
            {dirty || !savedOther ? 'Save' : 'Saved'}
          </button>
        </div>

        {/* Their words, read back, so saving is a thing they can SEE having
            happened rather than something they have to trust. */}
        {savedOther && !dirty && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginTop: 10,
            background: 'var(--tint-sage)', border: '2px solid var(--ink)',
            borderRadius: 14, padding: '10px 13px',
          }}>
            <span aria-hidden style={{
              flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
              background: 'var(--terracotta)', border: '2px solid var(--ink)', boxSizing: 'border-box',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7" />
              </svg>
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.4 }}>
              Saved. We will ask you about <strong>{savedOther}</strong> at your check in.
            </span>
          </div>
        )}

        <p style={{ margin: '8px 0 0', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
          Whatever you write becomes one of the worries you rate, the same as the tiles.
        </p>
      </div>
    )}
    </div>
  )
}
