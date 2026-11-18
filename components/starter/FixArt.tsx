'use client'

import type { CSSProperties, ReactNode } from 'react'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import Face from '@/components/daily/CheckFace'
import { AskCard, Screen, Star } from '@/app/(marketing)/starter-pack/Mocks'

// THE THREE FIXES, DRAWN THE WAY THE APP DRAWS THEM.
//
// Justin, 18 November 2026, with a screenshot of "The words, ready" and "Ten
// seconds a day": still a little clunky, "the graphics need to be way more
// stylish and in fit with app".
//
// Two things made them look like a different product. They wore thin grey
// borders where the app wears the ink edge and the chunky ledge; and the
// progress drawing was pink bars and a row of stars, which is not what the
// check in looks like at all. The real check in is five faces
// (components/daily/ConcernCheckIn), so that is what is drawn here, from the
// same component.
//
// Mobbin, for the shape (Good Inside is not on Mobbin, so the nearest first
// look tours stand in):
//   Alma, stacked and slightly turned cards, each with a small chip
//     https://mobbin.com/screens/d876f5ab-11b0-47ec-b4d1-50df5a9816df
//   X, the real notification lifted off the screen behind it
//     https://mobbin.com/screens/62cb5ada-5558-41c7-9e57-ad1c2baa8717
//   Finch and Duolingo, progress as a row of the app's own marks
//     https://mobbin.com/screens/9c5434c3-6fa3-43bd-bcc2-c46c2e077e25
//     https://mobbin.com/screens/f6675d16-c6b5-4847-aa9f-fb66a2d61e88
//
// Every drawing is a picture, aria hidden, because the heading above each one
// says the same thing in words. No motion of its own: the page's GSAP batch
// fades the parent block in.

const EYEBROW: CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const CARD: CSSProperties = {
  background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--lift-deep)',
}

/** The ground each drawing sits on: a soft tint with a faint dot paper, the
 *  way the app's Happy News panels sit on crayon paper rather than a grey box. */
function Ground({ tint, children, pad = '22px 18px 26px' }: { tint: string; children: ReactNode; pad?: string }) {
  return (
    <div aria-hidden style={{
      position: 'relative', overflow: 'hidden', borderRadius: 24, padding: pad,
      background: `radial-gradient(rgba(26,26,46,0.07) 1.2px, transparent 1.4px) 0 0 / 16px 16px, ${tint}`,
    }}>
      {children}
    </div>
  )
}

function Chip({ children, bg = 'var(--terracotta)', color = 'var(--ink)' }: { children: ReactNode; bg?: string; color?: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999,
      background: bg, border: 'var(--edge)', color,
      fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xs)', lineHeight: 1.2, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}

// ── 1. STARS THEY EARN ───────────────────────────────────────────────────────
// The child's ask in their own app behind, the ask landing on the parent's
// phone in front: one action, both sides, which is the thing nobody else has.

export function StarsArt({ kid }: { kid: string }) {
  return (
    <Ground tint="var(--tint-blue)">
      <div style={{ ...CARD, boxShadow: 'var(--lift)', width: '88%', maxWidth: 360, padding: '12px 14px', transform: 'rotate(-2.5deg)', transformOrigin: 'left bottom' }}>
        <div style={{ ...EYEBROW, marginBottom: 8 }}>{kid}&rsquo;s app</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 12, background: 'var(--tint-blue)', border: 'var(--edge)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Screen size={20} /></span>
          <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.2 }}>30 minutes of TV</span>
          <Chip>Ask <Star size={13} /></Chip>
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: 18, marginLeft: '4%', transform: 'rotate(1deg)' }}>
        <div style={{ ...EYEBROW, color: 'var(--ink)', margin: '0 0 6px 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--retro-green)' }} /> On your phone
        </div>
        <AskCard kid={kid} />
      </div>
    </Ground>
  )
}

// ── 2. THE WORDS, READY ──────────────────────────────────────────────────────
// The script card as the app draws it: "Not this" peeking behind and struck
// through, "Say this" on top in butter with the ledge, and the two things a
// parent can do with it, both real (components/scripts/RehearseWithDigi and
// components/rightnow/ScriptFridgeCard).

/** The stage notThis reads '"Just five more minutes." Once you move the line...'.
 *  The quote is the picture; the reason stays with the script in the app. */
function quoteOf(notThis: string): string {
  const m = notThis.match(/^\s*["“]([^"”]+)["”]/)
  return m ? m[1] : notThis
}

export function WordsArt({ words, notThis }: { words: string; notThis: string }) {
  return (
    <Ground tint="var(--tint-butter)">
      <div style={{
        width: '84%', marginLeft: 'auto', transform: 'rotate(2.5deg)', transformOrigin: 'right bottom',
        background: 'var(--tint-rose)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: '12px 14px 26px',
      }}>
        <div style={{ ...EYEBROW, color: '#B4453C', marginBottom: 4 }}>Not this</div>
        <p style={{
          margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.35,
          textDecoration: 'line-through', textDecorationColor: '#B4453C', textDecorationThickness: 2,
        }}>
          &ldquo;{quoteOf(notThis)}&rdquo;
        </p>
      </div>
      <div style={{ ...CARD, position: 'relative', marginTop: -16, width: '96%', transform: 'rotate(-1deg)', padding: '14px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
          <Chip>Say this</Chip>
          <span style={{ ...EYEBROW, fontSize: 10 }}>Script</span>
        </div>
        <p style={{
          margin: 0, background: 'var(--terracotta-lt)', border: 'var(--edge)', borderRadius: 16, boxShadow: '0 4px 0 var(--terracotta)',
          padding: '14px 14px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.4,
        }}>
          &ldquo;{words}&rdquo;
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          <Chip bg="#fff"><span style={{ display: 'inline-flex', margin: '-4px 0 -4px -4px' }}><DigiCharacter mood="idle" size={22} /></span>Practise with DiGi</Chip>
          <Chip bg="#fff"><PrinterIcon /> Fridge card</Chip>
        </div>
      </div>
    </Ground>
  )
}

function PrinterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 9V3h10v6" />
      <rect x="3" y="9" width="18" height="8" rx="2" fill="var(--tint-blue)" />
      <rect x="7" y="14" width="10" height="7" rx="1" fill="#fff" />
    </svg>
  )
}

// ── 3. TEN SECONDS A DAY ─────────────────────────────────────────────────────
// Tonight's check in with one face chosen, then six weeks of the same faces
// climbing. The finish is the real rest rule (lib/concerns/resting.ts): one
// going great rests a worry, and it comes back after a week to check it held.
// No stamp, no score: the check in has neither.

const BAND_LABELS = ['Really tough', 'Hard going', 'Up and down', 'Getting there', 'Going great']
const WEEKS = [1, 2, 2, 3, 4, 5]
/** How far each band's face rises in the six weeks row, in px, by band. */
const RISE = [0, 0, 10, 20, 30, 40]
/** The same rise as a y in the dotted line's 92 high viewBox: each face's centre. */
const FACE_Y = [0, 60, 50, 40, 30, 20]

export function CheckArt({ concern }: { concern: string }) {
  const tonight = 4
  return (
    <Ground tint="var(--tint-sage)">
      <div style={{ ...CARD, padding: '14px 14px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={EYEBROW}>Tonight</span>
          <Chip bg="var(--tint-sage)">10 seconds</Chip>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.2, margin: '8px 0 12px', overflowWrap: 'anywhere' }}>
          {concern}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          {BAND_LABELS.map((label, i) => {
            const n = i + 1
            const on = n === tonight
            return (
              <div key={label} style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <span style={{ display: 'block', borderRadius: '50%', lineHeight: 0, boxShadow: on ? '0 4px 0 var(--ink)' : 'none', transform: on ? 'translateY(-2px)' : 'none' }}>
                  <Face band={n} filled={on} past={false} size={38} />
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: on ? 900 : 700, fontSize: 10, lineHeight: 1.1, textAlign: 'center', color: on ? 'var(--ink)' : 'var(--ink-muted)' }}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ ...CARD, boxShadow: 'var(--lift)', marginTop: 14, padding: '12px 14px 14px' }}>
        <div style={{ ...EYEBROW, marginBottom: 10 }}>Six weeks</div>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${WEEKS.length}, 1fr)`, alignItems: 'end', height: 92 }}>
          {/* The climb, as a dotted line through the faces. viewBox matches
              the grid: six equal columns, faces 28px, rising 10px a band. */}
          <svg viewBox="0 0 600 92" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <polyline
              fill="none" stroke="var(--ink)" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" vectorEffect="non-scaling-stroke"
              points={WEEKS.map((b, i) => `${50 + i * 100},${FACE_Y[b]}`).join(' ')}
            />
          </svg>
          {WEEKS.map((b, i) => {
            const last = i + 1 === WEEKS.length
            return (
              <div key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ display: 'block', borderRadius: '50%', lineHeight: 0, marginBottom: RISE[b], boxShadow: last ? '0 3px 0 var(--ink)' : 'none', background: '#fff' }}>
                  <Face band={b} filled={last} past={!last} size={28} />
                </span>
                <span style={{ ...EYEBROW, fontSize: 10, letterSpacing: '0.08em' }}>W{i + 1}</span>
              </div>
            )
          })}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, padding: '10px 12px',
          background: 'var(--tint-green)', border: 'var(--edge)', borderRadius: 14,
        }}>
          <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--retro-green)', border: 'var(--edge)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.3 }}>
            Sorted. Back in a week to check it held.
          </span>
        </div>
      </div>
    </Ground>
  )
}
