'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { PHASE_LABELS, PHASE_ORDER, type LessonPhase } from '@gc/shared/lesson-slides'
import { CHARACTERS } from '@gc/shared/schools-curriculum'

// A LESSON OPENS AS YOU SCROLL.
//
// The Apple shape for a product that moves: the frame stays where it is and
// the thing inside it changes as the reader's own steps pass by. Six steps,
// in the lesson's own phase order, read from the shared phase list so the
// words on this page can never differ from the strip on the wall. On a desk
// a board frame sits beside the steps and turns to the current one as its
// title crosses a line on the screen.
//
// ON A PHONE THE STEPS DO NOT PASS UNDER A PINNED BOARD (20 September 2026).
// They did, and Justin caught it on his own phone: "as you scroll down the
// box stays, the text underneath also scrolls, but you miss it." The pinned
// card took the top half of the screen and each step's words slid up
// underneath it while the reader was still on them, so the board turned to a
// step whose text the reader never got to finish. A phone gets the other
// honest shape instead: one panel per step, the board drawn for that step
// with its words directly beneath, side by side in a strip the reader swipes
// through, with the next panel's edge showing so the swipe is obvious. The
// picture and its words never separate, nothing slides under anything, and
// the whole section is one screen tall.
//
// Every line below is true of the product as it ships: the friend beats
// (migration 296), the start card (269), one idea per slide with the script
// in the presenter bar, the timed talk tasks and the tool strip, the two
// checks with green, amber and one retry, the passport beat (297) and the
// parent note. What the board shows for each step is the product's own
// furniture drawn from its tokens, or the friends' own cutout art. Nothing
// here is a picture of a feature that does not render.
//
// Without JavaScript every step is on the page in full and the desk frame
// shows the first one. Reduced motion changes the frame without the
// crossfade and moves the strip without smoothing.

type Step = {
  phase: LessonPhase
  title: string
  body: string
  board: { headline: string; line: string; art?: 'orbit' | 'digi' }
}

const STEPS: Step[] = [
  {
    phase: 'connect',
    title: 'A friend at the door',
    body: 'The Planet Friend for this year arrives and names the mission, the same face every time the topic comes back. DiGi carries the heaviest lessons and closes every one.',
    board: { headline: 'Orbit arrives', line: 'Today’s mission, in one line.', art: 'orbit' },
  },
  {
    phase: 'starter',
    title: 'Last lesson first',
    body: 'The start card asks last lesson’s question before this one begins. Retrieval practice built into every lesson, rather than left to whoever remembers.',
    board: { headline: 'What do you remember?', line: 'The start card, on the wall and on paper.' },
  },
  {
    phase: 'teach',
    title: 'One idea on the wall',
    body: 'One idea per slide, sized for the back row, and the teacher’s words underneath it, word for word. A non specialist reads it well the first time.',
    board: { headline: 'One idea. The words underneath.', line: 'The script sits in the presenter bar, never on the class’s slide.' },
  },
  {
    phase: 'practise',
    title: 'Talk, then choose',
    body: 'A talk task on the clock, then a choice the class has to give a reason for. The lesson’s own tool is on the slide the moment it is needed.',
    board: { headline: 'Talk task, on the clock', line: 'Then a choice, with a reason.' },
  },
  {
    phase: 'prove',
    title: 'Prove it before the close',
    body: 'Two checks on the board before the lesson ends: green, amber, one retry, and the reason always shown. Exit cards do the same on paper for every child.',
    board: { headline: 'Green, amber, one retry', line: 'The reason is always shown.' },
  },
  {
    phase: 'close',
    title: 'The page fills and a note goes home',
    body: 'The class fills the passport page for the lesson, DiGi closes, and the parent note carries what was taught and one question for the dinner table.',
    board: { headline: 'The passport page fills', line: 'One question goes home tonight.', art: 'digi' },
  },
]

// The steps follow the lesson's order exactly, and this says so at build
// time rather than hoping.
const ORDERED = PHASE_ORDER.map(p => STEPS.find(s => s.phase === p)!).filter(Boolean)

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase',
}

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const pad2 = (n: number) => String(n).padStart(2, '0')

// The colours a step's board wears: the friend's own where a friend is on
// it, the house terracotta otherwise.
const tone = (step: Step) => {
  const art = step.board.art ? CHARACTERS[step.board.art] : null
  return { art, accent: art ? art.accent : 'var(--terracotta)', accentInk: art ? art.ink : 'var(--terracotta-dark)' }
}

// WHAT THE BOARD SHOWS BETWEEN THE TWO FRIENDS: the product's own furniture,
// from its own tokens. The start card, the presenter bar the script lives
// in, the talk task clock, and the three states an answer can be in, coloured
// the way the player colours them (tint-green and tint-amber, LessonPlayer's
// ChoiceBlock).
function Furniture({ phase, accent, accentInk }: { phase: LessonPhase; accent: string; accentInk: string }) {
  if (phase === 'starter') {
    return (
      <div aria-hidden style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', boxShadow: '0 3px 0 var(--border)' }}>
        <span style={{ ...mono, color: accentInk }}>Start card</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>Last lesson, one question</span>
      </div>
    )
  }
  if (phase === 'teach') {
    return (
      <div aria-hidden style={{ background: 'var(--ink)', borderRadius: 'var(--radius-pill)', padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', maxWidth: '100%' }}>
        <span style={{ ...mono, color: accent }}>Script</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: '#fff', opacity: 0.92, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Say this, word for word.</span>
      </div>
    )
  }
  if (phase === 'practise') {
    return (
      <div aria-hidden style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <svg width="30" height="30" viewBox="0 0 30 30">
          <circle cx="15" cy="15" r="12" fill="none" stroke="var(--border)" strokeWidth="3" />
          <circle cx="15" cy="15" r="12" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeDasharray="75.4" strokeDashoffset="26" transform="rotate(-90 15 15)" />
        </svg>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-md)', letterSpacing: '0.04em', color: 'var(--ink)' }}>02:00</span>
      </div>
    )
  }
  if (phase === 'prove') {
    const states = [
      ['Right', 'var(--tint-green)', 'var(--retro-green-dark)'],
      ['Nearly', 'var(--tint-amber)', 'var(--stage-1-text)'],
      ['One retry', '#fff', 'var(--ink-soft)'],
    ] as const
    return (
      <div aria-hidden style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-2)' }}>
        {states.map(([t, bg, fg]) => (
          <span key={t} style={{ ...mono, background: bg, color: fg, border: `2px solid ${bg === '#fff' ? 'var(--border)' : fg}`, borderRadius: 'var(--radius-pill)', padding: 'var(--space-1) var(--space-3)' }}>{t}</span>
        ))}
      </div>
    )
  }
  return null
}

// The face of the board for one step: the friend or the furniture, the
// headline, the line. The desk frame crossfades between faces; a phone panel
// carries its own face and never changes.
function Face({ step, compact }: { step: Step; compact?: boolean }) {
  const { art, accent, accentInk } = tone(step)
  return (
    <div style={{ minHeight: compact ? '112px' : 'clamp(150px, 20vw, 220px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: compact ? 'var(--space-2)' : 'var(--space-3)' }}>
      {art ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={art.img} alt={art.name} style={{ width: compact ? '64px' : 'clamp(64px, 9vw, 96px)', height: 'auto', filter: 'drop-shadow(0 6px 10px rgba(46,40,24,0.25))' }} />
      ) : (
        <Furniture phase={step.phase} accent={accent} accentInk={accentInk} />
      )}
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: compact ? 'var(--text-xl)' : 'var(--text-2xl)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.02em', textWrap: 'balance' }}>
        {step.board.headline}
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: compact ? 'var(--text-sm)' : 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: '340px', margin: 0 }}>
        {step.board.line}
      </p>
    </div>
  )
}

const card = (accent: string, compact?: boolean): React.CSSProperties => ({
  background: '#fff', border: '1px solid var(--border)', borderTop: `4px solid ${accent}`,
  borderRadius: 'var(--radius-card)', padding: compact ? 'var(--space-3) var(--space-3) var(--space-4)' : 'clamp(18px, 2.5vw, 28px)',
  boxShadow: compact ? '0 2px 4px rgba(46,40,24,0.08), 0 24px 40px -28px rgba(46,40,24,0.45)' : '0 2px 4px rgba(46,40,24,0.08), 0 50px 90px -40px rgba(46,40,24,0.5)',
  transition: 'border-color 0.4s ease',
})

export default function LessonOpens() {
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const rows = useRef<(HTMLLIElement | null)[]>([])
  const panels = useRef<(HTMLLIElement | null)[]>([])
  const strip = useRef<HTMLOListElement>(null)
  const face = useRef<HTMLDivElement>(null)
  const first = useRef(true)

  // THE DESK RULE. Which step is in charge: the last one whose top edge has
  // crossed a line just past the middle of the screen. The observer's root
  // is the screen above that line, so a step joins the set once its top
  // crosses the line and leaves it once its bottom has gone off the top, and
  // the highest number in the set is in charge. Scrolling up hands charge
  // back at the same place it was taken. The nav is sticky, so its height is
  // measured rather than guessed and handed to the stylesheet as --nav-h for
  // the board's pin, divided by the zoom tokens.css puts on the body (a
  // length in the stylesheet is multiplied by it on its way to the screen,
  // which put the board 7px low on 20 September 2026).
  //
  // THE PHONE RULE. The panel that fills most of the strip is in charge: an
  // observer rooted on the strip itself, and a panel takes charge once six
  // tenths of it is in view. Both observers are always built; the rows are
  // hidden on a phone and the strip on a desk, and a hidden element never
  // intersects, so only the visible layout ever speaks.
  useEffect(() => {
    const el = root.current
    if (!el) return
    let desk: IntersectionObserver | null = null
    let phone: IntersectionObserver | null = null
    const build = () => {
      desk?.disconnect()
      phone?.disconnect()
      const nav = document.querySelector('.gc-nav')
      const navH = Math.round(nav?.getBoundingClientRect().height ?? 64)
      const zoom = (el as HTMLElement & { currentCSSZoom?: number }).currentCSSZoom ?? 1
      el.style.setProperty('--nav-h', `${Math.round(navH / zoom)}px`)
      const line = window.innerHeight * 0.55
      const crossed = new Set<number>()
      desk = new IntersectionObserver(
        entries => {
          for (const e of entries) {
            const i = Number((e.target as HTMLElement).dataset.step)
            if (!Number.isFinite(i)) continue
            if (e.isIntersecting) crossed.add(i)
            else crossed.delete(i)
          }
          if (crossed.size) setActive(Math.max(...Array.from(crossed)))
        },
        { rootMargin: `0px 0px -${Math.round(window.innerHeight - line)}px 0px`, threshold: 0 },
      )
      rows.current.forEach(r => r && desk!.observe(r))
      if (strip.current) {
        phone = new IntersectionObserver(
          entries => {
            for (const e of entries) {
              const i = Number((e.target as HTMLElement).dataset.panel)
              if (Number.isFinite(i) && e.isIntersecting && e.intersectionRatio >= 0.6) setActive(i)
            }
          },
          { root: strip.current, threshold: 0.6 },
        )
        panels.current.forEach(r => r && phone!.observe(r))
      }
    }
    build()
    window.addEventListener('resize', build)
    return () => { desk?.disconnect(); phone?.disconnect(); window.removeEventListener('resize', build) }
  }, [])

  // The desk frame crossfades to the new step. Opacity and a few pixels of
  // rise, nothing that reflows. Skipped when the frame is not on the screen,
  // which is every phone.
  useEffect(() => {
    if (first.current) { first.current = false; return }
    const el = face.current
    if (!el || el.offsetParent === null || reduced()) return
    gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out', clearProps: 'opacity,transform' })
  }, [active])

  // A tap on a dot brings that panel to the front of the strip.
  const goTo = (i: number) => {
    const s = strip.current, p = panels.current[i]
    if (!s || !p) return
    s.scrollTo({ left: p.offsetLeft - s.offsetLeft - parseFloat(getComputedStyle(s).paddingLeft || '0'), behavior: reduced() ? 'auto' : 'smooth' })
  }

  const step = ORDERED[active]
  const { accent, accentInk } = tone(step)

  return (
    <div ref={root} className="schools-lesson-opens">
      {/* THE DESK: the board, sticky beside the steps, turned to the step in
          charge. */}
      <div className="schools-lesson-board">
        <div aria-live="polite" style={card(accent)}>
          {/* The strip the wall itself carries, so a head sees the shape of
              a lesson before they have seen a lesson. */}
          <div className="schools-board-strip" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            {ORDERED.map((s, i) => (
              <span key={s.phase} style={{
                ...mono, padding: 'var(--space-1) 0',
                color: i === active ? accentInk : 'var(--ink-light)',
                borderBottom: `2px solid ${i === active ? accent : 'transparent'}`,
                transition: 'color 0.3s ease, border-color 0.3s ease',
              }}>
                {PHASE_LABELS[s.phase]}
              </span>
            ))}
          </div>

          <div ref={face}>
            <Face step={step} />
          </div>

          {/* The dot rail: where the reader is in the six. */}
          <div aria-hidden style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
            {ORDERED.map((s, i) => (
              <span key={s.phase} style={{
                width: i === active ? '22px' : '8px', height: '8px', borderRadius: 'var(--radius-pill)',
                background: i === active ? accent : 'var(--border)', transition: 'width 0.35s ease, background 0.35s ease',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* THE DESK STEPS. Each is its own idea with air around it, so one
          crosses the line at a time. */}
      {/* No inline display here: the stylesheet decides whether the list
          shows at all, and an inline display:flex would beat its display:none
          on a phone (it did, on the first render of this layout). */}
      <ol className="schools-lesson-steps" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {ORDERED.map((s, i) => (
          <li
            key={s.phase}
            data-step={i}
            ref={el => { rows.current[i] = el }}
            style={{
              padding: 'clamp(28px, 5vh, 56px) 0', borderTop: i === 0 ? 'none' : '1px solid var(--border)',
              opacity: i === active ? 1 : 0.55, transition: 'opacity 0.4s ease',
            }}
          >
            <div style={{ ...mono, color: i === active ? 'var(--terracotta-dark)' : 'var(--ink-muted)', marginBottom: 'var(--space-2)', transition: 'color 0.3s ease' }}>
              {pad2(i + 1)} · {PHASE_LABELS[s.phase]}
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 var(--space-2)' }}>
              {s.title}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '480px', margin: 0 }}>
              {s.body}
            </p>
          </li>
        ))}
      </ol>

      {/* THE PHONE: one panel per step, the board for that step with its
          words directly beneath, in a strip the reader swipes through. The
          strip runs to the screen's edges so the next panel's edge shows. */}
      <div className="schools-lesson-phone">
        <ol ref={strip} className="schools-lesson-strip" aria-label="The six phases of a lesson, one panel each" tabIndex={0}>
          {ORDERED.map((s, i) => {
            const t = tone(s)
            return (
              <li key={s.phase} data-panel={i} ref={el => { panels.current[i] = el }} className="schools-lesson-panel">
                <div style={card(t.accent, true)}>
                  <div style={{ ...mono, color: t.accentInk, textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                    {pad2(i + 1)} of {pad2(ORDERED.length)} · {PHASE_LABELS[s.phase]}
                  </div>
                  <Face step={s} compact />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: 'var(--space-4) 0 var(--space-2)' }}>
                  {s.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, margin: 0 }}>
                  {s.body}
                </p>
              </li>
            )
          })}
        </ol>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
          {ORDERED.map((s, i) => (
            <button
              key={s.phase}
              type="button"
              aria-label={`Step ${i + 1} of ${ORDERED.length}, ${PHASE_LABELS[s.phase]}`}
              aria-current={i === active ? 'step' : undefined}
              onClick={() => goTo(i)}
              style={{
                appearance: 'none', border: 0, padding: 'var(--space-3) var(--space-2)', background: 'transparent', cursor: 'pointer',
              }}
            >
              <span style={{
                display: 'block', width: i === active ? '22px' : '8px', height: '8px', borderRadius: 'var(--radius-pill)',
                background: i === active ? accent : 'var(--border)', transition: 'width 0.35s ease, background 0.35s ease',
              }} />
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .schools-lesson-opens {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(28px, 6vw, 96px);
          align-items: start;
        }
        .schools-lesson-board { position: sticky; top: calc(var(--nav-h, 64px) + var(--space-6)); order: 2; }
        .schools-lesson-steps { order: 1; display: flex; flex-direction: column; }
        .schools-lesson-phone { display: none; }
        @media (max-width: 860px) {
          .schools-lesson-opens { display: block; }
          .schools-lesson-board, .schools-lesson-steps { display: none; }
          .schools-lesson-phone { display: block; }
          /* The strip bleeds to the screen's edges through the section's own
             gutter (clamp(20px, 4vw, 40px) on the home page), and pads by the
             same amount inside, so the first panel lines up with the heading
             above it and the next panel's edge is always in view. */
          .schools-lesson-strip {
            list-style: none; margin: 0 calc(-1 * clamp(20px, 4vw, 40px)); padding: var(--space-2) clamp(20px, 4vw, 40px) var(--space-3);
            display: flex; gap: 12px; overflow-x: auto; overscroll-behavior-x: contain;
            scroll-snap-type: x mandatory; scroll-padding-inline: clamp(20px, 4vw, 40px);
            -webkit-overflow-scrolling: touch; scrollbar-width: none;
          }
          .schools-lesson-strip::-webkit-scrollbar { display: none; }
          .schools-lesson-strip:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 2px; border-radius: var(--radius-card); }
          .schools-lesson-panel { flex: 0 0 86%; scroll-snap-align: start; scroll-snap-stop: always; }
        }
      `}</style>
    </div>
  )
}
