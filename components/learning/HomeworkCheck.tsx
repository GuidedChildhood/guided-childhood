'use client'

import { useState } from 'react'
import { CRAYON, HAPPY } from '@gc/shared/happy-news'
import { CHILD_SAYS, SAYS_MINUTES, verdictFor, type ChildSays, type HomeworkBand } from '@/lib/homework/guide'

// ── HOW MUCH IS NORMAL, AND IS TONIGHT FINE ─────────────────────────────────
//
// Justin, 17 October 2026: help "when parent is not sure what level of
// homework the child should have and if child is communicating what should be
// fine compare with the school advice".
//
// The shape is the health app range bar, "standardised to your age", with a
// marker for you and a one line verdict under it (Bevel, BitePal and Oura on
// Mobbin, 17 October). A parent reads where the normal band is for this school
// year, taps what their child said tonight, and the marker lands with one
// sentence on what to do. Nothing is stored: it is a check, not a log, and the
// child's own note from their app (kid_homework_notes) sits above the taps
// when there is one.

const TONE_BG: Record<'fine' | 'check' | 'stop', string> = {
  fine: CRAYON.green, check: CRAYON.sky, stop: CRAYON.coral,
}

export default function HomeworkCheck({ band, childName, tonightNote }: {
  band: HomeworkBand
  childName: string
  /** What the child wrote in their own app today, if anything. */
  tonightNote?: string | null
}) {
  const [says, setSays] = useState<ChildSays | null>(null)
  const max = Math.round(band.aLot * 1.45)
  const pct = (m: number) => `${Math.min(100, Math.max(0, (m / max) * 100))}%`
  const verdict = says ? verdictFor(says, band, childName) : null
  const markerMins = says && says !== 'tears' ? SAYS_MINUTES[says] : null
  // The marker never sits on the bar's very ends, where its label would be
  // cut by the card edge: an hour on a Year 4 bar is simply "well into a lot".
  const markerAt = (m: number) => `${Math.min(92, Math.max(8, (m / max) * 100))}%`

  return (
    <section aria-labelledby="hw-check" style={{
      background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--lift)', padding: '18px 16px 18px', marginBottom: 16,
    }}>
      <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
        Homework tonight
      </p>
      <h2 id="hw-check" style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
        How much is normal in {band.yearLabel}?
      </h2>
      <p style={{ margin: '0 0 16px', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
        Most schools ask for <strong style={{ color: 'var(--ink)' }}>{band.low} to {band.high} minutes</strong> a night: {band.kind}.
      </p>

      {/* The bar: light, about right, a lot. The marker is what they said. */}
      <div style={{ position: 'relative', paddingTop: markerMins !== null ? 34 : 0, transition: 'padding .2s' }}>
        {markerMins !== null && (
          <span style={{
            position: 'absolute', top: 0, left: markerAt(markerMins), transform: 'translateX(-50%)',
            background: 'var(--ink)', color: 'var(--white)', borderRadius: 10, padding: '4px 9px',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', whiteSpace: 'nowrap',
            transition: 'left .3s ease',
          }}>
            {CHILD_SAYS.find(c => c.key === says)?.label ?? childName}
            <span aria-hidden style={{ position: 'absolute', left: '50%', bottom: -5, width: 10, height: 10, transform: 'translateX(-50%) rotate(45deg)', background: 'var(--ink)' }} />
          </span>
        )}
        <div role="img" aria-label={`Light under ${band.low} minutes, about right ${band.low} to ${band.aLot}, a lot over ${band.aLot}`} style={{
          display: 'flex', height: 18, borderRadius: 'var(--radius-pill)', overflow: 'hidden',
          border: '2px solid var(--ink)',
        }}>
          <span style={{ width: pct(band.low), background: CRAYON.sky }} />
          <span style={{ width: `calc(${pct(band.aLot)} - ${pct(band.low)})`, background: CRAYON.green, borderLeft: '2px solid var(--ink)', borderRight: '2px solid var(--ink)' }} />
          <span style={{ flex: 1, background: CRAYON.coral }} />
        </div>
        <div aria-hidden style={{ position: 'relative', height: 34, marginTop: 4 }}>
          {[
            { at: band.low / 2, label: 'Light' },
            { at: (band.low + band.aLot) / 2, label: 'About right' },
            { at: (band.aLot + max) / 2, label: 'A lot' },
          ].map(z => (
            <span key={z.label} style={{
              position: 'absolute', left: pct(z.at), transform: 'translateX(-50%)', top: 0,
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', whiteSpace: 'nowrap',
            }}>{z.label}</span>
          ))}
          <span style={{ position: 'absolute', left: pct(band.low), transform: 'translateX(-50%)', top: 18, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>{band.low}m</span>
          <span style={{ position: 'absolute', left: pct(band.aLot), transform: 'translateX(-50%)', top: 18, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>{band.aLot}m</span>
        </div>
      </div>

      {/* What the child wrote in their own app today, word for word. */}
      {tonightNote && (
        <p style={{
          margin: '12px 0 0', padding: '10px 12px', background: 'var(--cream)', borderRadius: 'var(--radius-tile)',
          fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.45,
        }}>
          <strong>{childName} wrote in their app today:</strong> &ldquo;{tonightNote}&rdquo;
        </p>
      )}

      <p style={{ margin: '16px 0 8px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
        What did {childName} say they have tonight?
      </p>
      {/* An even grid of five durations, then tears on a line of its own:
          tears are not a length of time, and a chip in the middle of the
          scale said they were (design review, 17 October). The chosen one is
          sky with a tick rather than solid ink, so it never outweighs the one
          butter button on the page. */}
      <div role="radiogroup" aria-label={`What ${childName} said`}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
          {CHILD_SAYS.filter(c => c.key !== 'tears').map(c => {
            const on = says === c.key
            return (
              <button
                key={c.key}
                role="radio"
                aria-checked={on}
                onClick={() => setSays(on ? null : c.key)}
                style={{
                  minHeight: 44, padding: '8px 6px', borderRadius: 16, cursor: 'pointer',
                  border: on ? '2px solid var(--ink)' : '2px solid var(--ink-light)',
                  background: on ? CRAYON.sky : 'var(--white)', color: 'var(--ink)',
                  boxShadow: on ? '0 3px 0 var(--ink)' : 'none',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', lineHeight: 1.15,
                }}
              >
                {on && <span aria-hidden>✓ </span>}{c.label}
              </button>
            )
          })}
        </div>
        <button
          role="radio"
          aria-checked={says === 'tears'}
          onClick={() => setSays(says === 'tears' ? null : 'tears')}
          style={{
            width: '100%', minHeight: 44, marginTop: 8, padding: '8px 12px', borderRadius: 16, cursor: 'pointer',
            border: `2px solid ${says === 'tears' ? 'var(--ink)' : HAPPY.coral}`,
            background: says === 'tears' ? CRAYON.coral : 'var(--white)', color: 'var(--ink)',
            boxShadow: says === 'tears' ? '0 3px 0 var(--ink)' : 'none',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
          }}
        >
          {says === 'tears' && <span aria-hidden>✓ </span>}Or it ended in tears
        </button>
      </div>

      {verdict && (
        // A mark as well as a colour, so the verdict never rests on colour
        // alone: a tick for fine, a question for worth a look, a hand for stop.
        <div role="status" style={{
          marginTop: 14, background: TONE_BG[verdict.tone], border: 'var(--edge)', borderRadius: 'var(--radius-tile)',
          padding: '12px 14px', display: 'flex', gap: 11, alignItems: 'flex-start',
        }}>
          <span aria-hidden style={{
            flexShrink: 0, width: 30, height: 30, borderRadius: '50%', background: 'var(--white)', border: '2px solid var(--ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)',
          }}>{verdict.tone === 'fine' ? '✓' : verdict.tone === 'check' ? '?' : '✋'}</span>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: 'block', margin: '2px 0 3px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
              {verdict.title}
            </span>
            <span style={{ display: 'block', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.5 }}>
              {verdict.line}
            </span>
          </span>
        </div>
      )}

      <p style={{ margin: '14px 0 0', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
        A guide from school homework policies, not a rule. Your school&rsquo;s own policy wins, and most put it on their website.
      </p>
    </section>
  )
}
