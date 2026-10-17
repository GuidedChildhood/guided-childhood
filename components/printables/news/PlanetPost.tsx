'use client'

import type { CSSProperties, ReactNode } from 'react'
import { HAPPY, RainbowArc, Burst, WavyRule, StarShape } from '@/components/kid/HappyNewsBits'
import { CRAYON } from '@/components/printables/drawn/crayon'
import { SLICES } from '@/components/printables/drawn/BalanceWheelSheet'
import { Moon, Phone, Star, Heart } from '@/components/printables/drawn/HappyPaper'
import { CHARACTERS } from '@gc/shared/schools-curriculum'
import { BRAND_DOMAIN } from '@gc/shared/brand'
import type { PlanetPostIssue } from '@/lib/printables/free/planet-post'

// THE PLANET POST, laid out (13 October 2026).
//
// A real newspaper, in the Happy News finish: white stock, ink lines, colour
// printed on as marks (a painted rainbow masthead, bursts, crayon fills), and
// Nunito 900 for every headline. The Happy Newspaper's energy, our drawing;
// nothing is copied (content/brand-story/visual-system.md).
//
// ONE PAGE SIZE FOR BOTH PAPERS. Each page is 740 by 1000 CSS pixels, which is
// 195.8 by 264.6 millimetres: inside the box A4 and US Letter share, with 10mm
// or more to every edge of either sheet, so one design prints on both without
// reflowing and nothing falls in the strip a home printer cannot reach. The
// print route centres it on the chosen paper.
//
// INK SAVER. With `ink` on, every fill goes white and the line art stays, so
// the paper becomes a colouring page and prints on a nearly empty cartridge.
// The Planet Friends are our real character art, never redrawn
// (brand/GDC_SOCIAL_VISUAL_SYSTEM.md); in ink saver they print grey and light.

export const NEWS_W = 740
export const NEWS_H = 1000

const INK = HAPPY.ink
const MUTED = '#6B6B80'
// Orbit's answers: quieter than ink, still 10:1 on white so a child can read them.
const ANSWER = '#3F3F55'

type P = { issue: PlanetPostIssue; ink: boolean }

const fill = (ink: boolean, c: string) => (ink ? 'var(--white)' : c)

// A write in line is at least 46 px, about 12 mm printed: the gap of an
// exercise book line, so a nine year old's handwriting fits (tried at home,
// 16 October 2026).
const WRITE_H = 46

const mono = (size = 11, color: string = INK): CSSProperties => ({
  fontFamily: 'var(--font-mono)', fontSize: size, fontWeight: 700, letterSpacing: '0.14em',
  textTransform: 'uppercase', color, lineHeight: 1.3,
})
const display = (size: number): CSSProperties => ({
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: size, letterSpacing: '-0.02em',
  lineHeight: 1.02, color: INK, margin: 0,
})
const body = (size = 15): CSSProperties => ({
  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: size, lineHeight: 1.45, color: INK, margin: 0,
})
const box = (ink: boolean, bg = 'var(--white)'): CSSProperties => ({
  background: fill(ink, bg), border: `3px solid ${INK}`, borderRadius: 14,
  boxShadow: `4px 5px 0 ${INK}`, boxSizing: 'border-box',
})

function Friend({ img, name, size, ink }: { img: string; name: string; size: number; ink: boolean }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0, boxSizing: 'border-box',
      background: fill(ink, CRAYON.paper), border: `3px solid ${INK}`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt={name} width={size * 0.82} height={size * 0.82}
        style={{ width: size * 0.82, height: size * 0.82, objectFit: 'contain', filter: ink ? 'grayscale(1) opacity(0.45)' : 'none' }} />
    </span>
  )
}

function Line({ label, width = '100%', size = 15 }: { label?: string; width?: number | string; size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, width, height: Math.max(size * 2.1, WRITE_H) }}>
      {label && <span style={{ ...body(size), fontWeight: 800, whiteSpace: 'nowrap', paddingBottom: 2 }}>{label}</span>}
      <span style={{ flex: 1, borderBottom: '2.5px dotted #9A9AB0', height: '100%' }} />
    </div>
  )
}

/** One page of the paper: the fixed box, the folio at the foot. */
function NewsPage({ issue, n, children }: { issue: PlanetPostIssue; n: number; children: ReactNode }) {
  return (
    <section className="planet-post-page" data-page={n} style={{
      width: NEWS_W, height: NEWS_H, boxSizing: 'border-box', background: 'var(--white)', color: INK,
      padding: '26px 30px 18px', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>{children}</div>
      <div style={{ flexShrink: 0, marginTop: 10 }}>
        <WavyRule color={INK} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, ...mono(10, MUTED) }}>
          <span>The Planet Post · Issue {issue.number}</span>
          <span>{BRAND_DOMAIN}</span>
          <span>Page {n}</span>
        </div>
      </div>
    </section>
  )
}

/** A section head: a ribbon of ink with the words reversed out, a burst at the end. */
function SectionHead({ children, by, ink, tint = HAPPY.butter }: { children: ReactNode; by?: string; ink: boolean; tint?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <h2 style={{ ...display(30), background: fill(ink, tint), border: `3px solid ${INK}`, borderRadius: 10, padding: '6px 14px 7px', boxShadow: `3px 4px 0 ${INK}`, transform: 'rotate(-1deg)' }}>
        {children}
      </h2>
      {by && <span style={{ ...mono(11, MUTED) }}>by {by}</span>}
    </div>
  )
}

// The Planet Friends line up under the masthead (14 October 2026, from the
// design canvas). The approved waving stills, never a redrawn Friend
// (brand/GDC_SOCIAL_VISUAL_SYSTEM.md section 15), standing on a crayon hill.
const BAND_FRIENDS = ['pebble', 'bloop', 'orbit', 'nova', 'cosmo'] as const

function FriendsBand({ ink }: { ink: boolean }) {
  return (
    <div style={{ position: 'relative', height: 128, flexShrink: 0, margin: '14px 0 10px', overflow: 'hidden', ...box(ink) }}>
      <svg viewBox="0 0 690 40" preserveAspectRatio="none" aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: 32 }}>
        <path d="M0 18 Q 86 4 172 16 T 345 14 T 518 16 T 690 12 V 40 H 0 Z" fill={fill(ink, CRAYON.green)} />
        <path d="M0 18 Q 86 4 172 16 T 345 14 T 518 16 T 690 12" fill="none" stroke={INK} strokeWidth="2.5" />
      </svg>
      <div style={{ position: 'absolute', left: 15, top: 11, ...mono(11) }}>Meet the Planet Friends</div>
      <div style={{ position: 'absolute', right: 15, top: 10, ...body(12), fontWeight: 800 }}>One for every stage of growing up</div>
      <div style={{ position: 'absolute', left: 10, right: 10, bottom: 4, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end' }}>
        {BAND_FRIENDS.map(k => {
          const c = CHARACTERS[k]
          return (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.moods?.wave ?? c.img} alt={`${c.name} waving`} width={86} height={86}
                style={{ width: 86, height: 86, objectFit: 'contain', filter: ink ? 'grayscale(1) opacity(0.45)' : 'none' }} />
              <span style={{ ...display(12), marginTop: -8, background: 'var(--white)', border: `2px solid ${INK}`, borderRadius: 999, padding: '1px 9px' }}>{c.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** A star big enough to write a number in. */
function JobStar({ ink, size = 50 }: { ink: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden style={{ flexShrink: 0 }}>
      <path d="M50 8l12 26 28 3-21 19 6 28-25-14-25 14 6-28L10 37l28-3z" fill={fill(ink, CRAYON.paper)} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    </svg>
  )
}

/** REAL or PRETEND, to circle. Nunito, not mono caps: a six year old has to read it. */
function Pill({ label }: { label: string }) {
  return <span style={{ ...display(14), lineHeight: 1.1, border: `2px solid ${INK}`, borderRadius: 999, padding: '4px 12px', textAlign: 'center' }}>{label}</span>
}

// ── PAGE 1, THE FRONT ────────────────────────────────────────────────────────

function MiniWheel({ ink, size }: { ink: boolean; size: number }) {
  const R = 130, C = 140, n = SLICES.length
  const pt = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180
    return [C + r * Math.cos(a), C + r * Math.sin(a)] as const
  }
  return (
    <svg viewBox="0 0 280 280" width={size} height={size} aria-hidden>
      <circle cx={C} cy={C} r={R} fill="#fff" stroke={INK} strokeWidth="5" />
      {SLICES.map((_, i) => {
        const [x, y] = pt(-90 + i * (360 / n), R)
        return <line key={i} x1={C} y1={C} x2={x} y2={y} stroke={INK} strokeWidth="3.5" />
      })}
      {SLICES.map((s, i) => {
        const [ix, iy] = pt(-90 + (i + 0.5) * (360 / n), 60)
        const [tx, ty] = pt(-90 + (i + 0.5) * (360 / n), 104)
        return (
          <g key={s.label}>
            <g transform={`translate(${ix} ${iy}) scale(0.85)`}>
              <path d={s.icon} fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            </g>
            <text x={tx} y={ty + 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700" letterSpacing="0.5" fill={INK}>
              {s.label.toUpperCase()}
            </text>
          </g>
        )
      })}
      <circle cx={C} cy={C} r="16" fill={fill(ink, HAPPY.butter)} stroke={INK} strokeWidth="4" />
    </svg>
  )
}

function FrontPage({ issue, ink }: P) {
  return (
    <NewsPage issue={issue} n={1}>
      {/* The masthead: the painted rainbow over a pale yellow ground, the
          paper's name on a white sheet lying on it, the price on a burst. */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 206, flexShrink: 0, ...box(ink, HAPPY.butterLt), boxShadow: `5px 6px 0 ${INK}` }}>
        {ink ? (
          <svg viewBox="0 0 200 100" style={{ position: 'absolute', left: '-4%', top: -6, width: '108%' }} aria-hidden>
            {[13, 26, 39, 52].map(r => (
              <path key={r} d={`M ${r} 100 A ${100 - r} ${100 - r} 0 0 1 ${200 - r} 100`} fill="none" stroke={INK} strokeWidth="2" />
            ))}
          </svg>
        ) : (
          <RainbowArc painted width={760} style={{ position: 'absolute', left: '-4%', top: -10, width: '108%', height: 'auto' }} />
        )}
        <div style={{
          position: 'absolute', left: 26, right: 128, bottom: 22, background: 'var(--white)', border: `3px solid ${INK}`,
          borderRadius: 12, boxShadow: `4px 5px 0 ${INK}`, padding: '14px 20px 14px', transform: 'rotate(-1.5deg)',
        }}>
          <div style={{ ...mono(11, MUTED), marginBottom: 4 }}>Issue {issue.number} · {issue.theme}</div>
          <div style={{ ...display(64), letterSpacing: '-0.035em', lineHeight: 0.95 }}>The Planet Post</div>
          <div style={{ ...mono(11), marginTop: 8 }}>The newspaper for kids and their grown ups</div>
        </div>
        <span style={{ position: 'absolute', right: 18, bottom: 26, transform: 'rotate(10deg)' }}>
          <Burst size={104} color={fill(ink, HAPPY.coral)} textColor={ink ? INK : 'var(--white)'}>FREE!</Burst>
        </span>
      </div>

      <FriendsBand ink={ink} />

      {/* The lead story and the wheel to colour. */}
      <div style={{ display: 'flex', gap: 20, flex: '1 1 auto', minHeight: 0 }}>
        <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={mono(11, MUTED)}>Front page news</div>
          <h1 style={{ ...display(36), margin: '2px 0 8px' }}>{issue.lead.headline}</h1>
          {issue.lead.paras.map((p, i) => (
            <p key={i} style={{ ...body(15.5), marginBottom: 8 }}>{p}</p>
          ))}
          <div style={{ ...mono(11), margin: '2px 0 6px' }}>✏️ My day wheel</div>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {issue.lead.steps.map((st, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <StepNo n={i + 1} ink={ink} />
                <div style={{ flex: '1 1 auto', minWidth: 0, ...body(16), fontWeight: 800, lineHeight: 1.3, paddingTop: 2 }}>
                  {st.box === 'count' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>{st.text} <Blank w={52} h={38} /> {st.after}</span>
                  ) : st.box === 'line' ? (
                    <span style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                      <span style={{ whiteSpace: 'nowrap' }}>{st.text}</span>
                      <span style={{ flex: 1, height: 34, borderBottom: '2.5px dotted #9A9AB0' }} /> {/* hex-ok: a write in line tuned for paper, between ink-muted and ink-light */}
                    </span>
                  ) : st.text}
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div style={{ width: 270, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <MiniWheel ink={ink} size={270} />
          <div style={{ ...body(14), fontWeight: 800, textAlign: 'center' }}>One crayon for each slice</div>
        </div>
      </div>

      {/* The editor's note, and what is inside. */}
      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexShrink: 0 }}>
        <div style={{ flex: '1 1 0', display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', ...box(ink) }}>
          <Friend img={issue.editor.img} name={issue.editor.name} size={78} ink={ink} />
          <div>
            <div style={mono(10, MUTED)}>A note from the editor</div>
            <p style={{ ...body(14), marginTop: 3 }}>{issue.editor.note}</p>
          </div>
        </div>
        <div style={{ width: 210, flexShrink: 0, padding: '12px 14px', ...box(ink, CRAYON.paper) }}>
          <div style={{ ...mono(11), marginBottom: 6 }}>Inside</div>
          {issue.inside.map(i => (
            <div key={i.page} style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{ ...display(20), width: 18 }}>{i.page}</span>
              <span style={{ ...body(14), fontWeight: 800, lineHeight: 1.25 }}>{i.label}</span>
            </div>
          ))}
        </div>
      </div>
    </NewsPage>
  )
}

// ── PAGE 2, THE BIG EXPLAINER ────────────────────────────────────────────────

function Jar({ label, tint, ink, children }: { label: string; tint: string; ink: boolean; children: ReactNode }) {
  return (
    <div style={{ position: 'relative', width: 212, height: 262, flexShrink: 0 }}>
      <svg viewBox="0 0 218 270" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
        <rect x="52" y="6" width="114" height="24" rx="8" fill={fill(ink, CRAYON.paper)} stroke={INK} strokeWidth="5" />
        <path d="M40 46 Q40 30 60 30 H158 Q178 30 178 46 V56 Q200 66 200 94 V242 Q200 264 176 264 H42 Q18 264 18 242 V94 Q18 66 40 56 Z" fill={fill(ink, tint)} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
        <rect x="32" y="84" width="154" height="34" rx="8" fill="#fff" stroke={INK} strokeWidth="4" />
      </svg>
      <div style={{ position: 'absolute', left: 32, right: 32, top: 84, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', ...mono(11), letterSpacing: '0.08em' }}>
        {label}
      </div>
      <div style={{ position: 'absolute', left: 30, right: 30, top: 128, bottom: 18, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6, textAlign: 'center' }}>
        {children}
      </div>
    </div>
  )
}

function Blank({ w = 64, h = 34 }: { w?: number; h?: number }) {
  return <span style={{ display: 'inline-block', flexShrink: 0, width: w, height: h, background: 'var(--white)', border: `3px solid ${INK}`, borderRadius: 8 }} />
}

/** A numbered step: one instruction per number, so nothing is missed. */
function StepNo({ n, ink }: { n: number; ink: boolean }) {
  return (
    <span style={{ ...display(15), lineHeight: 1, width: 26, height: 26, flexShrink: 0, borderRadius: '50%', background: fill(ink, HAPPY.butter), border: `2.5px solid ${INK}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
  )
}

/** A line to cut along: solid ink, with the scissors at its start. */
const CUT = `2.5px solid ${INK}`
/** A line to fold along: dotted. */
const FOLD = '2.5px dashed #6B6B80' // hex-ok: a fold line tuned to print visibly on paper; no token at this weight

/** The phone's bed, to colour, cut out and fold (the page 2 craft). */
function PhoneBed({ issue, ink }: P) {
  const b = issue.phoneBed
  const quilt = [CRAYON.sky, CRAYON.butter, CRAYON.pink, CRAYON.green]
  return (
    <div style={{ marginTop: 14, flex: '1 1 auto', minHeight: 0, padding: '12px 16px', ...box(ink), display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <Friend img={b.img} name={b.by} size={58} ink={ink} />
        <div style={{ minWidth: 0 }}>
          <div style={mono(10, MUTED)}>Make it with {b.by}</div>
          <h3 style={display(26)}>{b.headline}</h3>
          <p style={{ ...body(13.5), marginTop: 2 }}>{b.line}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, flex: '1 1 auto', minHeight: 0 }}>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, width: 150, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {b.steps.map((st, i) => (
            <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <StepNo n={i + 1} ink={ink} />
              <span style={{ ...body(13), fontWeight: 800, lineHeight: 1.25 }}>{st}</span>
            </li>
          ))}
        </ol>
        {/* The blanket and the pillow: cut along the solid line. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: '1 1 auto', minWidth: 0 }}>
          <div style={{ position: 'relative', border: CUT, borderRadius: 6, padding: 6, flex: '1 1 auto', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridAutoRows: '1fr', gap: 4 }}>
            <span style={{ position: 'absolute', left: -9, top: -13, fontSize: 15, background: 'var(--white)' }}>✂</span>
            {Array.from({ length: 18 }, (_, i) => (
              <span key={i} style={{ border: `1.5px solid ${INK}`, borderRadius: 4, background: ink ? 'var(--white)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {i % 4 === 0 && <StarShape size={14} color={fill(ink, quilt[(i / 4) % 4])} />}
              </span>
            ))}
            <span style={{ position: 'absolute', right: 8, bottom: -11, ...mono(9.5), background: 'var(--white)', padding: '0 4px' }}>{b.blanket}</span>
          </div>
          <div style={{ position: 'relative', height: 58, border: CUT, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ position: 'absolute', left: -9, top: -13, fontSize: 15, background: 'var(--white)' }}>✂</span>
            <span style={{ ...mono(9.5, MUTED) }}>{b.pillow}</span>
          </div>
        </div>
        {/* The sign: fold on the dotted line and it stands up like a tent. */}
        <div style={{ position: 'relative', width: 196, flexShrink: 0, border: CUT, borderRadius: 6, display: 'flex', flexDirection: 'column' }}>
          <span style={{ position: 'absolute', left: -9, top: -13, fontSize: 15, background: 'var(--white)' }}>✂</span>
          <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, transform: 'rotate(180deg)', padding: 8 }}>
            <span style={{ ...display(16) }}>{b.sign.back}</span>
            <Blank w={110} h={34} />
          </div>
          <div style={{ borderTop: FOLD, position: 'relative' }}>
            <span style={{ position: 'absolute', right: 6, top: -9, ...mono(9, MUTED), background: 'var(--white)', padding: '0 3px' }}>fold</span>
          </div>
          <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 8 }}>
            <Moon size={42} />
            <span style={{ ...display(17), textAlign: 'center' }}>{b.sign.front}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function JarsPage({ issue, ink }: P) {
  const j = issue.jars
  return (
    <NewsPage issue={issue} n={2}>
      <SectionHead ink={ink}>{j.headline}</SectionHead>
      <p style={{ ...body(16), marginBottom: 8 }}>{j.intro}</p>
      <div style={{ alignSelf: 'flex-start', ...body(14), fontWeight: 900, background: fill(ink, HAPPY.butterLt), border: `2.5px solid ${INK}`, borderRadius: 999, padding: '4px 14px', marginBottom: 6, boxShadow: `2px 3px 0 ${INK}` }}>
        ✋ {j.together}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
        <Jar label={j.mine.label} tint={CRAYON.sky} ink={ink}>
          <span style={{ ...body(13), fontWeight: 800, lineHeight: 1.2 }}>{j.mine.ask}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Blank w={58} h={36} /><span style={{ ...body(13), fontWeight: 800 }}>{j.mine.unit}</span></span>
          <span style={{ ...body(11.5), color: ANSWER }}>({j.mine.hint})</span>
        </Jar>
        <Jar label={j.earned.label} tint={CRAYON.butter} ink={ink}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Star size={30} /><span style={{ ...body(13), fontWeight: 800, lineHeight: 1.2 }}>{j.earned.ask}</span></span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Blank w={58} h={36} /><span style={{ ...body(13), fontWeight: 800 }}>{j.earned.unit}</span></span>
        </Jar>
        <Jar label={j.nobodys.label} tint={CRAYON.coral} ink={ink}>
          {j.nobodys.items.map(it => (
            <span key={it} style={{ ...body(14), fontWeight: 900 }}>{it}</span>
          ))}
          <span style={{ ...body(12), fontWeight: 800, marginTop: 2 }}>{j.nobodys.line}</span>
        </Jar>
      </div>

      {/* How a star is made, as a puzzle: the steps are mixed up and the
          child numbers them, so it is a task rather than a diagram that
          looked like one (a nine year old tried to fill it in). */}
      <div style={{ margin: '12px 0 0', padding: '10px 14px 8px', ...box(ink, CRAYON.paper), flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={display(18)}>{j.starPuzzle.headline}</span>
          <span style={{ ...body(13.5), fontWeight: 700 }}>{j.starPuzzle.ask}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {j.starPuzzle.order.map(k => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: `2.5px solid ${INK}`, borderRadius: 10, padding: '6px 8px', minHeight: 50 }}>
              <Blank w={30} h={30} />
              <span style={{ ...body(13.5), fontWeight: 800, lineHeight: 1.2 }}>{j.starSteps[k]}</span>
            </div>
          ))}
        </div>
        <div style={{ transform: 'rotate(180deg)', marginTop: 6, ...body(11), color: ANSWER }}>{j.starPuzzle.answer}</div>
      </div>

      <PhoneBed issue={issue} ink={ink} />
    </NewsPage>
  )
}

// ── PAGE 3, PUZZLES ──────────────────────────────────────────────────────────

function PuzzlePage({ issue, ink }: P) {
  const r = issue.realOrPretend
  const w = issue.wordSearch
  return (
    <NewsPage issue={issue} n={3}>
      {/* Orbit's detective corner. */}
      <div style={{ padding: '14px 16px', ...box(ink), flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <Friend img={r.img} name={r.by} size={66} ink={ink} />
          <div>
            <div style={{ ...mono(10, MUTED), marginBottom: 4 }}>{r.by}&apos;s detective corner</div>
            <SectionHead ink={ink} tint={CRAYON.sky}>{r.headline}</SectionHead>
          </div>
        </div>
        <p style={{ ...body(15), marginBottom: 10 }}>{r.intro}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {r.messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ ...display(24), width: 20, flexShrink: 0 }}>{i + 1}</span>
              <div style={{ flex: '1 1 0', background: fill(ink, CRAYON.paper), border: `2.5px solid ${INK}`, borderRadius: '14px 14px 14px 4px', padding: '8px 12px' }}>
                <div style={mono(9.5, MUTED)}>{m.from}</div>
                <div style={{ ...body(14.5), fontWeight: 700 }}>{m.text}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                {['REAL', 'PRETEND'].map(x => <Pill key={x} label={x} />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The word search and tomorrow's headline, side by side. */}
      <div style={{ display: 'flex', gap: 18, marginTop: 20, flex: '1 1 auto', minHeight: 0 }}>
        <div style={{ padding: '12px 14px', ...box(ink, CRAYON.paper), display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <div style={{ ...mono(11), marginBottom: 8 }}>{w.headline}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 30px)', gap: 1, background: 'var(--white)', border: `2.5px solid ${INK}`, borderRadius: 8, padding: 6 }}>
            {w.grid.join('').split('').map((ch, i) => (
              <span key={i} style={{ width: 30, height: 31, display: 'flex', alignItems: 'center', justifyContent: 'center', ...display(17), lineHeight: 1 }}>{ch}</span>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px', marginTop: 8, maxWidth: 316 }}>
            {w.words.map(x => (
              <span key={x} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, ...body(13), fontWeight: 800 }}>
                <span style={{ width: 13, height: 13, border: `2px solid ${INK}`, borderRadius: 3 }} />{x}
              </span>
            ))}
          </div>
        </div>
        <div style={{ flex: '1 1 0', minWidth: 0, padding: '12px 16px', ...box(ink), display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StarShape size={22} color={fill(ink, HAPPY.butter)} />
            <div style={mono(11)}>{issue.myHeadline.headline}</div>
          </div>
          <p style={{ ...body(14), margin: '6px 0 8px' }}>{issue.myHeadline.prompt}</p>
          <div style={{ border: `2.5px solid ${INK}`, borderRadius: 10, padding: '6px 10px 10px', flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
            <div style={mono(9.5, MUTED)}>The Planet Post · Tomorrow</div>
            <Line size={17} />
            <Line size={17} />
            <div style={{ ...body(14), fontWeight: 800, marginTop: 8 }}>Draw the picture for your story</div>
            <div style={{ flex: '1 1 auto', minHeight: 120, border: '2.5px dashed #9A9AB0', borderRadius: 10, marginTop: 6 }} />
          </div>
        </div>
      </div>

      {/* Orbit's answers, upside down, the way a real paper hides them. */}
      <div style={{ transform: 'rotate(180deg)', marginTop: 12, flexShrink: 0 }}>
        <div style={{ ...mono(9.5, MUTED), marginBottom: 2 }}>Orbit&apos;s answers</div>
        {r.answers.map(a => <div key={a} style={{ ...body(13), color: ANSWER, lineHeight: 1.35 }}>{a}</div>)}
      </div>
    </NewsPage>
  )
}

// ── PAGE 4, THE BACK PAGE ────────────────────────────────────────────────────

function BackPage({ issue, ink, qrSvg }: P & { qrSvg: string }) {
  const j = issue.jobs
  return (
    <NewsPage issue={issue} n={4}>
      <SectionHead ink={ink} tint={CRAYON.green}>{j.headline}</SectionHead>
      <p style={{ ...body(15), marginBottom: 10 }}>{j.intro}</p>
      <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
        <div style={{ flex: '1 1 0', padding: '10px 14px', ...box(ink) }}>
          {j.earn.map(x => (
            <div key={x} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', borderBottom: '2px dotted #C9C9D6' }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', border: `3px solid ${INK}`, flexShrink: 0 }} />
              <span style={{ ...body(15.5), fontWeight: 800, flex: 1 }}>{x}</span>
              <JobStar ink={ink} />
            </div>
          ))}
        </div>
        <div style={{ width: 236, flexShrink: 0, padding: '12px 14px', ...box(ink, CRAYON.paper), display: 'flex', flexDirection: 'column' }}>
          <div style={{ ...mono(11), marginBottom: 6 }}>{j.family.headline}</div>
          {j.family.items.map(x => (
            <div key={x} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', border: `3px solid ${INK}`, flexShrink: 0 }} />
              <span style={{ ...body(14.5), fontWeight: 800 }}>{x}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 6px' }}><Heart size={52} /></div>
          <p style={{ ...body(13), paddingTop: 6 }}>{j.family.line}</p>
        </div>
      </div>

      {/* The promise, signed by both. */}
      <div style={{ marginTop: 20, padding: '14px 18px', ...box(ink), flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <Friend img={issue.promise.img} name={issue.promise.by} size={62} ink={ink} />
          <h2 style={display(34)}>{issue.promise.headline}</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', flex: '1 1 auto' }}>
          {issue.promise.lines.map(l => <Line key={l} label={l} size={16} />)}
          <div style={{ display: 'flex', gap: 24 }}>
            <Line label="My name" size={15} />
            <Line label="Grown up" size={15} />
          </div>
        </div>
      </div>

      {/* The strip for the grown up, cut off along the dotted line. */}
      <div style={{ marginTop: 18, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...mono(9.5, MUTED) }}>
          <span style={{ fontSize: 16 }}>✂</span>
          <span style={{ flex: 1, borderTop: `2.5px dashed ${INK}` }} />
          <span>{issue.grownUp.kicker}</span>
          <span style={{ flex: 1, borderTop: `2.5px dashed ${INK}` }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }}>
          <div style={{ flex: '1 1 0' }}>
            <h3 style={display(24)}>{issue.grownUp.headline}</h3>
            <p style={{ ...body(15), marginTop: 4 }}>{issue.grownUp.line}</p>
            <p style={{ ...mono(12), letterSpacing: '0.06em', textTransform: 'none', marginTop: 6 }}>{issue.grownUp.shown}</p>
          </div>
          <div aria-label="QR code to the stage check" style={{ width: 104, height: 104, flexShrink: 0, padding: 6, background: 'var(--white)', border: `3px solid ${INK}`, borderRadius: 10, boxSizing: 'border-box' }}
            dangerouslySetInnerHTML={{ __html: qrSvg }} />
        </div>
      </div>
    </NewsPage>
  )
}

/** The four pages, in reading order. */
export function PlanetPostPages({ issue, ink, qrSvg }: P & { qrSvg: string }) {
  return [
    <FrontPage key={1} issue={issue} ink={ink} />,
    <JarsPage key={2} issue={issue} ink={ink} />,
    <PuzzlePage key={3} issue={issue} ink={ink} />,
    <BackPage key={4} issue={issue} ink={ink} qrSvg={qrSvg} />,
  ]
}
