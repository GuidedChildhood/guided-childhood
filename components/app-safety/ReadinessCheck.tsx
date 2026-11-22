'use client'

import { useState, type CSSProperties } from 'react'
import Link from 'next/link'

import { track } from '@/components/Analytics'
import { AGES, aAge } from '@/lib/app-safety/types'
import { checkTrust, USE_OPTIONS, WORRY_OPTIONS, type CheckApp, type Use, type Worry, type Status } from '@/lib/app-safety/trust'

// The free check on every app page (lib/app-safety/trust.ts has the why).
// Three questions, one per screen, then a place to start. No login, nothing
// stored, nothing sent but one anonymous "a check was finished on this app"
// event: never the age, the answers or the result.
//
// Shape from real apps (Mobbin, 22 November 2026): one question per screen
// with a slim progress bar (Pool), and the result as a short ordered list led
// by where to begin (WHOOP, Ahead). Not a score: Brainly's "5 / 15" is the
// pattern this deliberately is not.

type Step = 'age' | 'use' | 'worries' | 'result'
const STEPS: Step[] = ['age', 'use', 'worries', 'result']

const STATUS_LABEL: Record<Status, string> = { start: 'Start here', work: 'Worth working on', ok: 'In place' }
// Every place to start first, then what is worth working on, then what is in place.
const RANK: Record<Status, number> = { start: 0, work: 1, ok: 2 }

const wrap: CSSProperties = { background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 'clamp(20px, 4vw, 28px)' }
const q: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xl)', lineHeight: 1.25, color: 'var(--ink)', margin: '0 0 6px' }
const sub: CSSProperties = { fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }
const row = (on: boolean): CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', minHeight: '52px', padding: '12px 16px', textAlign: 'left',
  background: on ? 'var(--terracotta-lt)' : 'var(--cream)', border: `1.5px solid ${on ? 'var(--terracotta-dark)' : 'var(--border)'}`,
  borderRadius: '14px', fontFamily: 'var(--font-body, inherit)', fontSize: 'var(--text-base)', fontWeight: on ? 700 : 500, color: 'var(--ink)', cursor: 'pointer',
})
const tick = (on: boolean): CSSProperties => ({
  width: '22px', height: '22px', flexShrink: 0, borderRadius: '7px', border: `2px solid ${on ? 'var(--terracotta-dark)' : 'var(--ink-muted)'}`,
  background: on ? 'var(--terracotta-dark)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
})

export default function ReadinessCheck({ app, slug, presetAge }: { app: CheckApp; slug: string; presetAge: number | null }) {
  const [step, setStep] = useState<Step>(presetAge ? 'use' : 'age')
  const [age, setAge] = useState<number | null>(presetAge)
  const [use, setUse] = useState<Use | null>(null)
  const [worries, setWorries] = useState<Worry[]>([])

  const at = STEPS.indexOf(step)
  const result = step === 'result' && age && use ? checkTrust(app, { age, use, worries }) : null

  function finish() {
    setStep('result')
    track('mini_check_done', { app: slug })
  }

  return (
    <section aria-labelledby="check-title" style={wrap}>
      <h2 id="check-title" style={{ ...q, fontSize: 'var(--text-lg)', marginBottom: '4px' }}>The free {app.name} check</h2>
      <p style={{ ...sub, fontSize: 'var(--text-sm)', marginBottom: '16px' }}>Three questions. No sign up, and nothing you choose is saved.</p>

      <div aria-hidden style={{ display: 'flex', gap: '6px', marginBottom: '22px' }}>
        {STEPS.map((s, i) => (
          <span key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= at ? 'var(--terracotta-dark)' : 'var(--border)' }} />
        ))}
      </div>

      {step === 'age' && (
        <div>
          <p style={q}>How old is your child?</p>
          <p style={sub}>The advice changes a lot between six and fifteen.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
            {AGES.map(a => (
              <button key={a} type="button" onClick={() => { setAge(a); setStep('use') }} aria-pressed={age === a}
                style={{ ...row(age === a), justifyContent: 'center', fontWeight: 800, fontSize: 'var(--text-lg)', padding: '10px 0' }}>
                {a}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'use' && (
        <div>
          <p style={q}>How much do they use {app.name} now?</p>
          <p style={sub}>
            {age ? `For ${aAge(age)}. ` : ''}
            <button type="button" onClick={() => setStep('age')} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--ink)', textDecoration: 'underline', cursor: 'pointer', font: 'inherit' }}>Change age</button>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {USE_OPTIONS.map(o => (
              <button key={o.id} type="button" onClick={() => { setUse(o.id); setStep('worries') }} aria-pressed={use === o.id} style={row(use === o.id)}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'worries' && (
        <div>
          <p style={q}>Anything worrying you?</p>
          <p style={sub}>Pick any that fit, or none.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {WORRY_OPTIONS.map(o => {
              const on = worries.includes(o.id)
              return (
                <button key={o.id} type="button" aria-pressed={on} style={row(on)}
                  onClick={() => setWorries(on ? worries.filter(w => w !== o.id) : [...worries, o.id])}>
                  <span aria-hidden style={tick(on)}>
                    {on && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.2 5 8.5l4.5-5" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </span>
                  {o.label}
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-gold" onClick={finish} style={{ minHeight: '48px' }}>
              {worries.length ? 'Show where to start' : 'No worries, show where to start'}
            </button>
            <button type="button" onClick={() => setStep('use')} style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', minHeight: '44px' }}>Back</button>
          </div>
        </div>
      )}

      {result && age && (
        <div aria-live="polite">
          <p style={q}>Where to start with {app.name} at {age}</p>
          <p style={sub}>Built from your answers and {app.name}&apos;s own rules. Five areas, the first one to start on at the top.</p>
          <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[...result.letters].sort((a, b) => (a.id === result.lead ? -1 : b.id === result.lead ? 1 : RANK[a.status] - RANK[b.status])).map(l => {
              const lead = l.id === result.lead
              return (
                <li key={l.id} style={{ background: lead ? 'var(--terracotta-lt)' : 'var(--cream)', border: `1.5px solid ${lead ? 'var(--terracotta-dark)' : 'var(--border)'}`, borderRadius: '16px', padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
                      <span aria-hidden style={{ fontFamily: 'var(--font-mono)', color: 'var(--terracotta-dark)', marginRight: '8px' }}>{l.letter}</span>{l.name}
                    </span>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: l.status === 'ok' ? 'var(--retro-green)' : 'var(--ink)' }}>{STATUS_LABEL[l.status]}</span>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: '0 0 6px' }}>{l.means}</p>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>{l.step}</p>
                </li>
              )
            })}
          </ol>
          <p style={{ ...sub, marginBottom: '14px' }}>This covers one app. Your child&apos;s stage covers all of it: the words for the arguments, a plan for their age and their own app where jobs earn screen time.</p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/starter-pack" className="btn btn-gold" data-track="app-check-result" style={{ minHeight: '48px' }}>Find your child&apos;s stage</Link>
            <button type="button" onClick={() => { setStep(presetAge ? 'use' : 'age'); setUse(null); setWorries([]) }} style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', minHeight: '44px' }}>Start again</button>
          </div>
        </div>
      )}
    </section>
  )
}
