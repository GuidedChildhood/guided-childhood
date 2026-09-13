'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import MethodIcon, { METHOD, type MethodId } from './MethodIcon'
import HappyIcon, { type HappyIconName } from '@/components/kid/HappyIcon'

// The detail, one tap away.
//
// Justin, 10 September 2026, of the starter pack reveal: "can we really reduce
// the text on this page ... the actual written text with it can be folded away
// ... so we can shrink the scroll and too much text."
//
// ── WHY FOLD RATHER THAN CUT ────────────────────────────────────────────────
//
// The prose on this page is not padding. It is the reasoning a careful parent
// wants before they hand over a card: why a chart can be the wrong idea for a
// low mood, what the evidence actually says about an hour a day, what happens
// on day five. Deleting it would make the page shorter and the product less
// trustworthy.
//
// The trouble is that it is all printed at once, so a parent who was sold on
// screen three still has nine screens between them and the button. Canva,
// foodpanda, KOHO and Rocket Money all solve this the same way: one line
// visible, a chevron, the rest behind it. Rocket Money puts fifteen features on
// one screen because each is one line, which is the whole lesson. Length is not
// the problem. Line count is.
//
// So nothing here is deleted. It is one press away instead of in the way.
//
// ── THE ROW FORM ────────────────────────────────────────────────────────────
//
// Justin, 13 September 2026, with the reveal on his phone: keep the first part,
// "fold the other parts like attached to make super efficient and simple,
// happy news style, Apple UX quality." The parts attached were the other
// parents card and the safeguarding card, each printed in full under the
// worry cards.
//
// Given an `icon` and a `line`, a Fold draws the row Monzo's What we'll do
// next and Polarsteps' Travel DNA use: a drawn icon on its tinted plate, one
// bold label, one small line, a chevron, everything the same height. The
// visible line is chosen per row to carry the one fact a parent scanning
// past must not miss (the safeguarding row carries the phone numbers), so
// folding never hides what a frightened reader needs.
//
// Opening is a height tween rather than a jump, and the ledge lifts off while
// the row is open so the card reads as pressed in. One ledge per shell, none
// inside: whatever is drawn inside a row must come without its own edge and
// shadow (see KnownProblems and BiggerThanThis, `inRow`).

export default function Fold({
  label,
  children,
  tone = 'quiet',
  icon,
  happy,
  tint,
  line,
}: {
  /** What is behind it, in the parent's words. Never "Read more". */
  label: string
  children: React.ReactNode
  /** 'quiet' sits inside a section; 'card' stands on its own. */
  tone?: 'quiet' | 'card'
  /** With `line`, draws the happy news row: a drawn icon on its plate. */
  icon?: MethodId
  /** The other drawn set, for a row about something that is not a part of the
   *  product (the other parents, when it is bigger than this). Needs `tint`. */
  happy?: HappyIconName
  tint?: string
  /** One short line under the label, the one fact that must not need a tap. */
  line?: string
}) {
  const [open, setOpen] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const row = Boolean((icon || happy) && line)

  // The reveal, measured. GSAP tweens the wrapper from 0 to its own height and
  // then clears the inline height so the content can reflow (a font loading, a
  // phone rotating). Reduced motion gets the plain mount, which is what the
  // component did before it animated at all.
  useLayoutEffect(() => {
    const el = bodyRef.current
    if (!open || !el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tween = gsap.fromTo(el,
      { height: 0, opacity: 0 },
      { height: el.scrollHeight, opacity: 1, duration: 0.34, ease: 'power2.out', clearProps: 'height' },
    )
    return () => { tween.kill() }
  }, [open])

  const shell: React.CSSProperties = row ? {
    background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-btn)',
    boxShadow: open ? 'none' : 'var(--lift)', padding: '0 12px', marginTop: 10,
    transition: 'box-shadow 0.2s ease',
  } : tone === 'card' ? {
    background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-btn)',
    boxShadow: open ? 'none' : 'var(--lift)', padding: '4px 14px 4px', marginTop: 12,
  } : { marginTop: 10 }

  return (
    <div style={shell}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: row ? 12 : 8, width: '100%',
          background: 'none', border: 'none', padding: row ? '11px 0' : tone === 'card' ? '11px 0' : '7px 0',
          cursor: 'pointer', textAlign: 'left',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
          color: 'var(--ink)',
        }}
      >
        {row && (
          <span aria-hidden style={{
            flexShrink: 0, width: 40, height: 40, borderRadius: 'var(--radius-tile)',
            background: icon ? METHOD[icon].tint : (tint ?? 'var(--terracotta-lt)'), border: 'var(--edge)', boxSizing: 'border-box',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {icon ? <MethodIcon id={icon} size={23} /> : happy ? <HappyIcon name={happy} size={30} /> : null}
          </span>
        )}
        <span style={{ flex: 1, minWidth: 0, lineHeight: 1.35 }}>
          {label}
          {row && (
            <span style={{
              display: 'block', marginTop: 2, fontFamily: 'var(--font-body)', fontWeight: 500,
              fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4,
            }}>
              {line}
            </span>
          )}
        </span>
        {/* The thing to tap is butter, with the ink edge every plate on the
            page carries. It was a hairline grey ring, the one control on the
            page not drawn in the house hand. */}
        <span aria-hidden style={{
          flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
          background: row ? 'var(--terracotta)' : 'none',
          border: row ? 'var(--edge)' : '1.5px solid var(--border)', boxSizing: 'border-box',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: row ? 'var(--ink)' : 'var(--terracotta-dark)', fontSize: 11, fontWeight: 900,
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease',
        }}>▾</span>
      </button>
      {open && (
        <div ref={bodyRef} style={{ overflow: 'hidden' }}>
          <div style={{ paddingBottom: row ? 14 : tone === 'card' ? 12 : 4 }}>{children}</div>
        </div>
      )}
    </div>
  )
}
