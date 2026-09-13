'use client'

import { AREA_START, type LiteracyKey } from '@/lib/content/literacy'

// The four things, on the passport page itself.
//
// Justin, 13 September 2026: the passport must be "updated based on
// progression through the areas we have agreed need to be met" and show
// "measurable progression". Until today the book showed five ACTIVITY slots
// (devices, moments, lessons, jobs, balance) and the four OUTCOMES a family is
// told they are building lived in a separate card further down the page. A
// parent could fill every slot and never see the passport say what their
// child had learned to be.
//
// ── WHAT IT DRAWS ───────────────────────────────────────────────────────────
//
// Two by two, one small card each: the area's name, "3 of 7", and a slim bar
// in the stage's own ink. Nibble lays its categories out as rows with a level
// and a bar, and Duolingo ABC's level card puts the counts in boxes; two by two
// is the version of that which fits under a ring on a 340 wide page without
// adding a screen.
//
// ── WHAT IT NEVER DRAWS ─────────────────────────────────────────────────────
//
// Lesson counts and nothing else. No worry, no star, no note. The child reads
// this same component inside their read only book, and their own lessons are
// theirs to see. scripts/check-passport-readonly.mjs holds that line.
//
// An area that has not started at this stage (social media before 11) is
// drawn ghosted with the word "later", never a fake bar, the same honesty the
// four things card keeps.

type Area = { key: string; name: string; done: number; total: number }

// The two word names. The full ones ("Social media ready") wrap to three lines
// in a 140 wide card and the block stops being glanceable.
const SHORT: Record<string, string> = {
  safe: 'Safe online',
  balance: 'Healthy balance',
  ai: 'AI literate',
  social: 'Social ready',
}

export default function StageAreas({
  areas,
  stageId,
  ink,
  tint,
}: {
  areas: Area[]
  stageId: number
  /** The stage's own text colour, which every mark on the page is pressed in. */
  ink: string
  /** The stage's pastel, for the bar's track. */
  tint: string
}) {
  if (areas.length === 0) return null
  return (
    <div style={{ margin: '0 0 12px' }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: ink, opacity: 0.7, marginBottom: 7,
      }}>
        What this page builds
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {areas.map(a => {
          const started = stageId >= (AREA_START[a.key as LiteracyKey] ?? 1)
          const pct = a.total > 0 ? Math.round((a.done / a.total) * 100) : 0
          const full = a.total > 0 && a.done >= a.total
          return (
            <div
              key={a.key}
              aria-label={started ? `${a.name}: ${a.done} of ${a.total} lessons` : `${a.name}: comes later`}
              style={{
                background: '#fff', border: `1.5px solid ${ink}`, borderRadius: 'var(--radius-tile)',
                padding: '7px 9px 8px', opacity: started ? 1 : 0.45, minWidth: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
                  color: 'var(--ink)', lineHeight: 1.2, minWidth: 0,
                }}>
                  {SHORT[a.key] ?? a.name}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                  color: ink, whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  {started ? (a.total > 0 ? `${a.done} of ${a.total}` : 'none yet') : 'later'}
                </span>
              </div>
              <div
                role={started && a.total > 0 ? 'progressbar' : undefined}
                aria-valuenow={started ? a.done : undefined}
                aria-valuemin={started ? 0 : undefined}
                aria-valuemax={started ? a.total : undefined}
                style={{ height: 5, borderRadius: 'var(--radius-pill)', background: tint, border: `1px solid ${ink}`, overflow: 'hidden', marginTop: 6 }}
              >
                {/* Filled by GSAP on page arrival (PassportBook), never by a
                    CSS transition racing it. Without script it is simply full. */}
                <div className="gc-pp-bar" style={{
                  height: '100%', width: `${started ? pct : 0}%`, minWidth: started && a.done > 0 ? 6 : 0,
                  background: ink, borderRadius: 'var(--radius-pill)',
                }} />
              </div>
              {full && started && (
                <span style={{ display: 'block', marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: ink }}>
                  All done
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
