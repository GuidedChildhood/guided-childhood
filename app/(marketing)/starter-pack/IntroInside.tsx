'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import gsap from 'gsap'
import WorryIcon from '@/components/onboarding/WorryIcon'
import MethodIcon, { METHOD, type MethodId } from '@/components/starter/MethodIcon'
import { WORRIES, challengeFor } from '@/lib/onboarding/worries'
import { STAGES, getStageFromAgeBand } from '@/lib/content/stages'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'
import { MockAsk, MockDigi, MockProgress } from './Mocks'

// WHAT IS INSIDE, UNDER THE FIRST BUTTON.
//
// Justin, 14 November 2026, three times in one afternoon. First: the page
// should show exactly what a parent gets. Then: flow, examples, balance. Then,
// looking at a version that did all of that in six screens of sentences: "it
// needs to be super slick and much less wordy and obvious, and highlight what
// we offer and solve and the passport to get them safe, ready and educated.
// Can this not be super simple and the best look of any starter page."
//
// So the rule for this file is the last one. A picture and a handful of words
// per idea, and four ideas:
//
//   1. The passport: one road from 4 to 16, five stages, a friend at each.
//   2. Three things it fixes, each as "instead of X" and the product drawn.
//   3. DiGi: one example, and the loop it learns by, in four words each.
//   4. What else is inside, as labels, not sentences.
//   5. What it is not, in one line, and the button.
//
// The day on a rail, the long demo card, the list with a line per service and
// the three quiz steps all went. Each was true and each was reading.
//
// ── NOTHING HERE IS NEW COPY ABOUT THE PRODUCT ──────────────────────────────
//
// The stages and their ages are lib/content/stages.ts, the friends are
// lib/content/stage-characters.ts, the one thing for tonight is the Builder
// stage's own challengeActions (the same line the result screen gives), and
// the drawings are the ones in Mocks.tsx. Builder, ages 8 to 10, because
// primary age is the heart of the market and its lines do not change with
// the social_media_law flag. No statistic, no price, no free days.

const SAMPLE = getStageFromAgeBand('8-10')

/** The four a parent of a primary age child recognises first. */
const DEMO_IDS = ['wont_put_down', 'bedtime_screens', 'controller_fights', 'asking_for_phone']
const DEMO = WORRIES.filter(w => DEMO_IDS.includes(w.id))

const EYEBROW: CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 6px',
}
const H2: CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.03em',
  fontSize: 'clamp(1.6rem, 6vw, 2.1rem)', lineHeight: 1.1, color: 'var(--ink)', margin: 0,
}
const INSTEAD: CSSProperties = { fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.3, margin: '0 0 2px' }
const FIX: CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)',
  lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 14px',
}

function tonightFor(worryId: string): string {
  const challenge = challengeFor(worryId)
  return (challenge && SAMPLE.challengeActions[challenge]) || SAMPLE.action
}

/** The road: five stages, a Planet Friend at each, the ages under them. */
function Passport() {
  return (
    <section aria-labelledby="intro-passport" data-intro-passport style={{ textAlign: 'center' }}>
      <p style={EYEBROW}>The passport</p>
      <h2 id="intro-passport" style={H2}>One road, from 4 to 16.</h2>
      <ol style={{ listStyle: 'none', margin: '22px 0 0', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, position: 'relative' }}>
        <span aria-hidden style={{ position: 'absolute', left: '10%', right: '10%', top: 27, height: 2, background: 'var(--border)' }} />
        {STAGES.map(s => {
          const friend = STAGE_CHARACTERS.find(c => c.stageId === s.id)
          return (
            <li key={s.id} style={{ position: 'relative', minWidth: 0 }}>
              <span style={{
                display: 'inline-flex', width: 56, height: 56, maxWidth: '100%', borderRadius: '50%', overflow: 'hidden',
                border: 'var(--edge)', boxSizing: 'border-box', background: `var(--stage-${s.id}-bold)`,
              }}>
                {friend && <img src={friend.img} alt="" width={56} height={56} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xs)', color: 'var(--ink)', marginTop: 6, lineHeight: 1.2 }}>
                {s.name}
              </span>
              <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', lineHeight: 1.3 }}>
                {s.ages.replace('Ages ', '').replace(' and above', '+').replace(' to ', ' to ')}
              </span>
            </li>
          )
        })}
      </ol>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '18px 0 0' }}>
        Safe, ready and taught, one stage at a time.
      </p>
    </section>
  )
}

/** One fix: what it replaces, what you get, the product drawn. */
function Fix({ instead, title, children }: { instead: string; title: string; children: ReactNode }) {
  return (
    <li data-reveal style={{ listStyle: 'none' }}>
      <p style={INSTEAD}>{instead}</p>
      <h3 style={FIX}>{title}</h3>
      {children}
    </li>
  )
}

/** The words: tap a worry, read tonight's one thing. */
function Words() {
  const [picked, setPicked] = useState(DEMO[0].id)
  return (
    <div data-intro-demo>
      <div role="group" aria-label="Pick a worry" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        {DEMO.map(w => {
          const on = w.id === picked
          return (
            <button
              key={w.id}
              type="button"
              aria-pressed={on}
              data-demo-worry={w.id}
              onClick={() => setPicked(w.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, minHeight: 52, padding: '8px 10px',
                background: on ? 'var(--tint-butter)' : 'var(--white)',
                border: on ? 'var(--edge)' : '1.5px solid var(--border)',
                borderRadius: 'var(--radius-tile)', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
                color: 'var(--ink)', lineHeight: 1.2,
              }}
            >
              <span aria-hidden style={{
                flexShrink: 0, width: 32, height: 32, borderRadius: 'var(--radius-tile)', background: w.tint,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <WorryIcon name={w.icon} size={20} />
              </span>
              {w.label}
            </button>
          )
        })}
      </div>
      <div aria-live="polite" style={{ background: 'var(--tint-butter)', borderRadius: 'var(--radius-card)', padding: '16px 18px' }}>
        <p style={{ ...EYEBROW, color: 'var(--ink-soft)' }}>Tonight, age nine</p>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.4, margin: 0 }}>
          {tonightFor(picked)}
        </p>
      </div>
    </div>
  )
}

// ── DIGI, AND HOW IT LEARNS ─────────────────────────────────────────────────
//
// Justin, the same afternoon: include a DiGi example and explain how it learns
// from every parent's feedback, builds a brain, and keeps advising until what
// works is echoed back.
//
// The loops are real and are written up in digi/00-how-digi-works.md, "How
// DiGi learns": a memory of this family on every reply, a "did it work" card a
// few days after a suggestion, and a weekly pass over what families said
// worked, read back as a starting suggestion (rank 5 in PRECEDENCE: never
// authority, never with numbers). So this says what the loop DOES and claims
// no result from it. No count of families, no success rate.
//
// The example is a drawing, not a recorded reply. Its advice and its words are
// the Builder stage's own line for this worry (challengeActions.online_safety
// in lib/content/stages.ts), so DiGi is not shown saying anything the product
// does not already say to a parent of a nine year old.

const DIGI_WORDS = 'You can always come to me if something online feels weird or wrong. I will not take the device away. I will help.'

const LOOP: { icon: MethodId; label: string }[] = [
  { icon: 'digi', label: 'You ask' },
  { icon: 'script', label: 'You try it' },
  { icon: 'checkin', label: 'Did it work?' },
  { icon: 'passport', label: 'It remembers' },
]

function Digi() {
  return (
    <section aria-labelledby="intro-digi" data-intro-digi data-reveal>
      <div style={{ textAlign: 'center', marginBottom: 22 }}>
        <p style={EYEBROW}>DiGi, your guide</p>
        <h2 id="intro-digi" style={H2}>Ask anything. It learns what works.</h2>
      </div>
      <MockDigi
        question="She saw something online that upset her. What do I say?"
        answer="Stay calm, and keep her talking to you. This is the conversation for her age."
        words={DIGI_WORDS}
      />
      <ol aria-label="How DiGi learns" style={{ listStyle: 'none', margin: '18px 0 0', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, position: 'relative' }}>
        <span aria-hidden style={{ position: 'absolute', left: '12%', right: '12%', top: 21, height: 2, background: 'var(--border)' }} />
        {LOOP.map(l => (
          <li key={l.label} style={{ position: 'relative', textAlign: 'center', minWidth: 0 }}>
            <span aria-hidden style={{
              display: 'inline-flex', width: 44, height: 44, borderRadius: '50%', background: METHOD[l.icon].tint,
              border: 'var(--edge)', boxSizing: 'border-box', alignItems: 'center', justifyContent: 'center',
            }}>
              <MethodIcon id={l.icon} size={22} />
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xs)', color: 'var(--ink)', marginTop: 6, lineHeight: 1.2 }}>
              {l.label}
            </span>
          </li>
        ))}
      </ol>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '16px 0 0', textAlign: 'center' }}>
        Every answer starts from the research, then fits your family. What works for other families comes back as a starting point for yours.
      </p>
    </section>
  )
}

/** Everything else, as labels. The result screen has the sentences. */
const ALSO: { icon: MethodId; label: string }[] = [
  { icon: 'kidapp', label: 'Their own app' },
  { icon: 'lesson', label: 'Lessons' },
  { icon: 'script', label: 'Scripts' },
  { icon: 'balance', label: 'Device time' },
  { icon: 'moment', label: 'Moments' },
]

export default function IntroInside({ onStart }: { onStart: () => void }) {
  // The bar: on only while the first button is off screen and the last one has
  // not arrived, so a parent never looks at two copies of the same button.
  const [bar, setBar] = useState(false)
  useEffect(() => {
    const first = document.getElementById('intro-start')
    const last = document.getElementById('intro-start-again')
    if (!first || !last || typeof IntersectionObserver === 'undefined') return
    const seen = { first: true, last: false }
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.target === first) seen.first = e.isIntersecting
        if (e.target === last) seen.last = e.isIntersecting
      }
      setBar(!seen.first && !seen.last)
    })
    io.observe(first); io.observe(last)
    return () => io.disconnect()
  }, [])

  // Motion rule: GSAP only, a subtle fade up, once. Only what starts below the
  // screen is hidden, and only after this runs, so with no script or with
  // reduced motion everything is simply there.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = Array.from(document.querySelectorAll<HTMLElement>('#inside [data-reveal]'))
      .filter(el => el.getBoundingClientRect().top > window.innerHeight)
    if (!els.length) return
    gsap.set(els, { opacity: 0, y: 18 })
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        gsap.to(e.target, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'transform' })
        io.unobserve(e.target)
      }
    }, { rootMargin: '0px 0px -8% 0px' })
    els.forEach(el => io.observe(el))
    return () => { io.disconnect(); gsap.set(els, { clearProps: 'opacity,transform' }) }
  }, [])

  return (
    <div id="inside" style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 56, scrollMarginTop: 16 }}>
      <Passport />

      <section aria-labelledby="intro-fix" data-intro-services>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <p style={EYEBROW}>What it fixes</p>
          <h2 id="intro-fix" style={H2}>Three things, starting tonight.</h2>
        </div>
        <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 40 }}>
          <Fix instead="Instead of rows about more time" title="Stars they earn.">
            <MockAsk kid="Ava" />
          </Fix>
          <Fix instead="Instead of not knowing what to say" title="The words, ready.">
            <Words />
          </Fix>
          <Fix instead="Instead of guessing if it works" title="Ten seconds a day.">
            <MockProgress concern="Coming off screens" />
          </Fix>
        </ul>
      </section>

      <Digi />

      <section aria-labelledby="intro-also" data-reveal style={{ textAlign: 'center' }}>
        <p style={EYEBROW}>Also inside</p>
        <h2 id="intro-also" style={H2}>All in one place.</h2>
        <ul style={{ listStyle: 'none', margin: '20px 0 0', padding: 0, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {ALSO.map(a => (
            <li key={a.icon} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px 7px 7px',
              background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-pill)',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)',
            }}>
              <span aria-hidden style={{
                width: 30, height: 30, borderRadius: '50%', background: METHOD[a.icon].tint,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MethodIcon id={a.icon} size={18} />
              </span>
              {a.label}
            </li>
          ))}
        </ul>
      </section>

      <div data-reveal>
        <p data-what-we-are-not style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.45, textAlign: 'center', margin: '0 0 18px' }}>
          Not a blocking app. We never read their chats.
        </p>
        <button
          id="intro-start-again"
          type="button"
          onClick={onStart}
          className="btn btn-gold"
          style={{ width: '100%', justifyContent: 'center', fontSize: 'var(--text-base)', padding: '17px' }}
        >
          Find my child&apos;s stage
        </button>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', textAlign: 'center', marginTop: 14, letterSpacing: '0.06em' }}>
          Free. Three questions. No sign up.
        </p>
      </div>

      {/* Hidden rather than unmounted, so it slides; out of the tab order and
          the accessibility tree while it is off. */}
      <div
        data-intro-bar
        aria-hidden={!bar}
        style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40,
          padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
          background: 'var(--white)', borderTop: '1.5px solid var(--border)',
          transform: bar ? 'translateY(0)' : 'translateY(110%)', transition: 'transform 0.25s ease',
          display: 'flex', justifyContent: 'center',
        }}
      >
        <button
          type="button"
          onClick={onStart}
          tabIndex={bar ? 0 : -1}
          className="btn btn-gold"
          style={{ width: '100%', maxWidth: 472, justifyContent: 'center', fontSize: 'var(--text-base)', padding: '14px' }}
        >
          Find my child&apos;s stage
        </button>
      </div>
    </div>
  )
}
