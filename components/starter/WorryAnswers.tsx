'use client'

import WorryIcon from '@/components/onboarding/WorryIcon'
import { WORRIES, CATCH_ALL_ID, type Worry } from '@/lib/onboarding/worries'
import { ANSWERS, scriptsForWorry } from '@/lib/content/proof'

// The worries a parent just ticked, each with the answer to it.
//
// ── WHY IT IS HERE, ON THIS SCREEN ──────────────────────────────────────────
//
// Justin, 9 September 2026, looking at the reveal at the end of the starter
// quiz: "though we redesigned and simplify this page with the problems and
// what we do to fix?"
//
// The page told a parent how the platform works. It never told them what we do
// about the thing they had typed in thirty seconds earlier. This is the last
// screen before we ask for money, and a parent reading it is deciding one
// thing: does this actually deal with MY problem. Answering that is the whole
// job of this section.
//
// ── THE SHAPE, AND WHY IT IS NOT A TABLE ────────────────────────────────────
//
// The research behind it is a four column grid (the worry, the question
// underneath, what we do, the proof) and it reads well on a canvas at 1080.
// On a phone a four column grid is either a sideways scroll or four stacked
// fragments, so it is one card per worry instead: their words as the heading,
// the question underneath in their voice, the mechanism, then the proof as
// chips. Same four things, read top to bottom.
//
// ── AND WHY ONLY THEIRS ARE OPEN ────────────────────────────────────────────
//
// Nine full cards is a wall. The ones they ticked get the full answer; the
// rest are named in a strip underneath, because the promise on the question
// screen was "we cover them all, and more as we go" and a parent who ticked
// two should still see the other seven exist. Ticking nothing but Something
// else falls back to the three most houses recognise, so the section is never
// empty.

const FALLBACK = ['wont_put_down', 'mood_after_screens', 'asking_for_phone']

export default function WorryAnswers({ worryIds, tonight }: {
  worryIds: string[]
  /** The one thing to do this evening, for the worry they put first. Written
   *  per stage per pathway key in lib/content/stages, so it is the sharpest
   *  thing on the page and it belongs on the card it answers, not in a box of
   *  its own two sections earlier. */
  tonight?: string
}) {
  const named = worryIds.filter(id => id !== CATCH_ALL_ID && ANSWERS[id])
  const chosen = named.length ? named : FALLBACK
  const rest = WORRIES.filter(w => w.id !== CATCH_ALL_ID && !chosen.includes(w.id))
  const theirs = named.length > 0

  return (
    <div>
      {chosen.map((id, i) => {
        const worry = WORRIES.find(w => w.id === id) as Worry
        const a = ANSWERS[id]
        const scripts = scriptsForWorry(id)
        return (
          <div
            key={id}
            className="wow-fu"
            style={{
              background: '#fff',
              border: '2px solid var(--ink)',
              borderRadius: 20,
              boxShadow: '0 5px 0 var(--ink)',
              padding: '18px 18px 20px',
              marginBottom: i === chosen.length - 1 ? 0 : 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span aria-hidden style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                background: worry.tint, border: '2px solid var(--ink)', boxSizing: 'border-box',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)',
              }}>
                <WorryIcon name={worry.icon} size={25} />
              </span>
              <h3 style={{
                margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: 'var(--text-lg)', letterSpacing: '-0.02em',
                lineHeight: 1.2, color: 'var(--ink)',
              }}>
                {worry.label}
              </h3>
            </div>

            {/* Their question, in the words they would use asking a friend. */}
            <p style={{
              margin: '0 0 10px', fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'var(--text-md)', lineHeight: 1.4, color: 'var(--ink-soft)',
            }}>
              {a.question}
            </p>

            <p style={{ margin: 0, fontSize: 'var(--text-md)', lineHeight: 1.6, color: 'var(--ink)' }}>
              {a.answer}
            </p>

            {/* The thing to do tonight, on the first card only. A parent who
                reads nothing else on this page should still leave with one
                sentence they can use this evening. */}
            {i === 0 && tonight && (
              <div style={{ marginTop: 14, background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: 14, padding: '12px 14px' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
                  marginBottom: 5,
                }}>
                  Tonight
                </div>
                <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', lineHeight: 1.45, color: 'var(--ink)' }}>
                  {tonight}
                </p>
              </div>
            )}

            {/* Named things, not adjectives. Every count is in lib/content/proof
                and was counted in the database, not estimated. */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 14 }}>
              {[...(scripts ? [`${scripts} scripts`] : []), ...a.proof].map(p => (
                <span key={p} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                  letterSpacing: '0.04em',
                  background: 'var(--terracotta-lt)', color: 'var(--ink)',
                  border: '1.5px solid var(--terracotta)', borderRadius: 100,
                  padding: '5px 10px',
                }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        )
      })}

      {rest.length > 0 && (
        <div className="wow-fu" style={{
          marginTop: 16, padding: '15px 17px 17px',
          background: 'var(--tint-sage)', border: '1.5px solid var(--border)', borderRadius: 18,
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
            marginBottom: 10,
          }}>
            {theirs ? 'Also covered, when it comes up' : 'And the rest of it'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {rest.map(w => (
              <span key={w.id} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#fff', border: '1.5px solid var(--border)', borderRadius: 100,
                padding: '5px 11px 5px 6px',
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 'var(--text-sm)', color: 'var(--ink)',
              }}>
                <span aria-hidden style={{
                  width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                  background: w.tint, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--ink)',
                }}>
                  <WorryIcon name={w.icon} size={15} />
                </span>
                {w.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
