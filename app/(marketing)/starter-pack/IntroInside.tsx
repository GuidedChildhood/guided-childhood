'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import WorryIcon from '@/components/onboarding/WorryIcon'
import MethodIcon, { METHOD, type MethodId } from '@/components/starter/MethodIcon'
import WhatWeAreNot from '@/components/marketing/WhatWeAreNot'
import { WORRIES, challengeFor } from '@/lib/onboarding/worries'
import { ANSWERS } from '@/lib/content/proof'
import { getStageFromAgeBand } from '@/lib/content/stages'
import { MockAsk, MockKidApp, MockProgress, MockToday } from './Mocks'

// WHAT IS INSIDE, UNDER THE FIRST BUTTON.
//
// Justin, 14 November 2026, on this page: it should "show exactly what they
// get from the platform", but it "looks a bit messy and confusing". He asked
// for the industry leading way to present it: nothing that scares, a solution
// beside each known problem, easy to read, every service shown, and a demo if
// it makes them want to keep going.
//
// The intro used to be three cards describing the QUIZ and a box saying what
// we are NOT. The product itself was nowhere on it. This is the product.
//
// ── THE RESEARCH PASS (plans/2026-11-14-stage-check-intro-shows-the-product.md)
//
// - The first screen stays short: outcome, one line, the button. That part
//   lives in page.tsx. Everything here is below it, so nothing delays a start.
// - A worry is only ever named beside its fix. No statistic, no threat.
//   (Fear appeals work only with the "here is what you do" attached.)
// - The services are STACKED. Tabs and carousels get missed on a phone, which
//   is where nearly every parent reads this.
// - The demo is one tap and already shows an answer before it is touched, so
//   a parent who never taps still sees the product answer a real question.
//
// ── THE MOBBIN PASS ─────────────────────────────────────────────────────────
//
// - Greenlight, "An experience for you and your kid": your device beside the
//   kid device. That is the star quest row: their app, then your phone.
//   https://mobbin.com/screens/21cafe44-cc81-4953-ba5e-536506229f5a
// - GoHenry opens on the product itself, not a description of it.
//   https://mobbin.com/screens/b704341b-8bc3-4ec8-910c-33bd0f38f35a
// - Norma, How it works: a short line and the product drawn inside each card.
//   https://mobbin.com/sites/sections/96f4183b-7eb5-437c-90ad-95d1306d320c
//
// ── NOTHING HERE IS NEW COPY ABOUT THE PRODUCT ──────────────────────────────
//
// The demo reads the same data the result screen does: the parent's question,
// the answer and the method rows from ANSWERS (lib/content/proof.ts), and the
// one thing for tonight from the Builder stage (lib/content/stages.ts). So it
// cannot promise something the result does not then give. Builder, ages 8 to
// 10, because primary age is the heart of the market and its lines do not
// change with the social_media_law flag.
//
// No DiGi reply is drawn. None was ever approved for this page and one is not
// invented here; DiGi is named in the method rows and in the list.

const SAMPLE = getStageFromAgeBand('8-10')

/** The four a parent of a primary age child recognises first. */
const DEMO_IDS = ['wont_put_down', 'bedtime_screens', 'controller_fights', 'asking_for_phone']
const DEMO = WORRIES.filter(w => DEMO_IDS.includes(w.id))

const EYEBROW: CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 4px',
}
const H2: CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.03em',
  fontSize: 'clamp(1.45rem, 5vw, 1.9rem)', lineHeight: 1.12, color: 'var(--ink)', margin: '0 0 8px',
}
const LEAD: CSSProperties = { fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }
const CARD: CSSProperties = {
  background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--lift)',
}

function tonightFor(worryId: string): string {
  const challenge = challengeFor(worryId)
  return (challenge && SAMPLE.challengeActions[challenge]) || SAMPLE.action
}

/** Tap a worry, see the product answer it. */
function TryIt() {
  const [picked, setPicked] = useState(DEMO[0].id)
  const a = ANSWERS[picked]
  return (
    <section aria-labelledby="intro-try" data-intro-demo>
      <p style={EYEBROW}>Try it now</p>
      <h2 id="intro-try" style={H2}>Which one sounds like your house?</h2>
      <p style={LEAD}>Tap one. This is the kind of answer your stage check gives you.</p>

      <div role="group" aria-label="Pick a worry" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
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
                display: 'flex', alignItems: 'center', gap: 8, minHeight: 56, padding: '8px 10px',
                background: on ? 'var(--tint-butter)' : 'var(--white)',
                border: on ? 'var(--edge)' : '1.5px solid var(--border)',
                boxShadow: on ? 'var(--lift)' : 'none',
                borderRadius: 'var(--radius-tile)', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
                color: 'var(--ink)', lineHeight: 1.2,
              }}
            >
              <span aria-hidden style={{
                flexShrink: 0, width: 34, height: 34, borderRadius: 'var(--radius-tile)', background: w.tint,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <WorryIcon name={w.icon} size={22} />
              </span>
              {w.label}
            </button>
          )
        })}
      </div>

      {a && (
        <div aria-live="polite" style={{ ...CARD, padding: '16px 16px 14px' }}>
          <p style={{ ...EYEBROW, color: 'var(--ink-muted)' }}>You ask</p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3, margin: '0 0 10px', letterSpacing: '-0.01em' }}>
            {a.question}
          </p>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px' }}>
            {a.answer}
          </p>

          <p style={{ ...EYEBROW, color: 'var(--ink-muted)', marginBottom: 6 }}>What we do, each time</p>
          <ul style={{ listStyle: 'none', margin: '0 0 12px', padding: 0 }}>
            {a.how.slice(0, 3).map((h, i) => (
              <li key={h.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderTop: i === 0 ? 'none' : '1.5px dotted var(--border)' }}>
                <span aria-hidden style={{
                  flexShrink: 0, width: 32, height: 32, borderRadius: 'var(--radius-tile)', background: METHOD[h.id].tint,
                  border: 'var(--edge)', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <MethodIcon id={h.id} size={18} />
                </span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.45 }}>
                  <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>{METHOD[h.id].label}.</strong>{' '}{h.line}
                </span>
              </li>
            ))}
          </ul>

          <div style={{ background: 'var(--tint-butter)', borderRadius: 'var(--radius-tile)', padding: '12px 14px' }}>
            <p style={{ ...EYEBROW, color: 'var(--ink-soft)' }}>Tonight, for a nine year old</p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.45, margin: 0 }}>
              {tonightFor(picked)}
            </p>
          </div>
        </div>
      )}
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '10px 2px 0' }}>
        Yours is written for your child&apos;s age and the worries you pick.
      </p>
    </section>
  )
}

/** One service: the problem in a parent's words, the answer, the product drawn. */
function Row({ when, title, line, children }: { when: string; title: string; line: string; children: ReactNode }) {
  return (
    <li style={{ ...CARD, padding: '16px 14px 14px', listStyle: 'none' }}>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4, margin: '0 0 4px', padding: '0 2px' }}>
        {when}
      </p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 4px', padding: '0 2px' }}>
        {title}
      </h3>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px', padding: '0 2px' }}>
        {line}
      </p>
      {children}
    </li>
  )
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 2px 6px' }}>
      {children}
    </p>
  )
}

/** The rest, as one plain list (the 13 September rule: rows, nothing to open). */
const ALSO: { icon: MethodId; title: string; line: string }[] = [
  { icon: 'digi',     title: 'DiGi',               line: 'Ask anything, any time. Never just a yes or a no' },
  { icon: 'lesson',   title: 'Lessons and school', line: 'The things nobody teaches, before they arrive' },
  { icon: 'balance',  title: 'Device time',        line: 'The settings worth setting, done with your child' },
  { icon: 'moment',   title: 'Moments',            line: 'The thing that went wrong tonight, picked up tomorrow' },
  { icon: 'passport', title: 'The passport',       line: 'One road, from 4 to 16' },
]

const STEPS = [
  'Answer three questions about your child.',
  'See their stage and one thing to try tonight. No sign up.',
  'Save it if you want to keep going.',
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

  return (
    <div id="inside" style={{ marginTop: 44, display: 'flex', flexDirection: 'column', gap: 44, scrollMarginTop: 16 }}>
      <TryIt />

      <section aria-labelledby="intro-get" data-intro-services>
        <p style={EYEBROW}>What you get</p>
        <h2 id="intro-get" style={H2}>Three problems you know, and what we do about each.</h2>
        <ul style={{ margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Row
            when="When every evening ends in a row about more time"
            title="Stars, not arguments"
            line="Your child has their own app. Jobs earn stars, stars become screen minutes, and bedtime is never for sale."
          >
            <Tag>Their app</Tag>
            <MockKidApp kid="Ava" />
            <div style={{ height: 10 }} />
            <MockAsk kid="Ava" />
          </Row>

          <Row
            when="When you never know what to say"
            title="The words, ready before the moment"
            line="One thing to do today and the sentence to say, written for their age."
          >
            <MockToday action={SAMPLE.action} words={SAMPLE.script.sayThis} />
          </Row>

          <Row
            when="When you cannot tell if any of it is working"
            title="Ten seconds a day"
            line="Tap how it went. Each worry gets its own line, so you can watch it ease over the weeks."
          >
            <MockProgress concern="Coming off screens" />
          </Row>
        </ul>
      </section>

      <section aria-labelledby="intro-also">
        <p style={EYEBROW}>Also inside</p>
        <h2 id="intro-also" style={H2}>Everything else, in one place.</h2>
        <ul style={{ ...CARD, listStyle: 'none', margin: '14px 0 0', padding: '0 14px' }}>
          {ALSO.map((r, i) => (
            <li key={r.icon} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderTop: i === 0 ? 'none' : '1.5px solid var(--border)' }}>
              <span aria-hidden style={{
                flexShrink: 0, width: 38, height: 38, borderRadius: 'var(--radius-tile)', background: METHOD[r.icon].tint,
                border: 'var(--edge)', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MethodIcon id={r.icon} size={22} />
              </span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.25, letterSpacing: '-0.01em' }}>{r.title}</span>
                <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 1 }}>{r.line}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="intro-how">
        <p style={EYEBROW}>How it works</p>
        <h2 id="intro-how" style={H2}>Two minutes, then you have a plan.</h2>
        <ol style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STEPS.map((s, i) => (
            <li key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span aria-hidden style={{
                flexShrink: 0, width: 30, height: 30, borderRadius: '50%', background: 'var(--terracotta)', border: 'var(--edge)', boxSizing: 'border-box',
                fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{i + 1}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.4 }}>{s}</span>
            </li>
          ))}
        </ol>
        <WhatWeAreNot example={false} />
      </section>

      <div>
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
