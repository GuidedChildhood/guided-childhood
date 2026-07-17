'use client'

import { useEffect, useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'

// The Sunday check in with DiGi. Once a week, proactively on a Sunday, DiGi asks
// the parent five quick things: how they are, what went well, what was hardest,
// and what they want next week to feel like, then hands back a short agreed plan
// grounded in the evidence. Once agreed, the plan sits on Home all week as a
// gentle steer, and the Friday round up reports back on it. Warm, tidy, one
// thing per tap, so it is a two minute moment, not a form.

type PlanStep = { title: string; why: string; expert: string }

const MOODS = [
  { v: 1, face: '😔', label: 'A real struggle' },
  { v: 2, face: '😕', label: 'Hard going' },
  { v: 3, face: '😐', label: 'Up and down' },
  { v: 4, face: '🙂', label: 'Pretty good' },
  { v: 5, face: '😄', label: 'Really good' },
]

const WENT_WELL = [
  'Calmer moments', 'Good sleep', 'Less screen battle', 'We connected',
  'Homework sorted', 'Handled a wobble well', 'More time outside', 'Ate well together',
]

// Hardest maps to the concern ledger so DiGi carries it into the week.
const HARDEST = [
  { slug: 'screens_takeover', label: 'Screens taking over' },
  { slug: 'mood_changes', label: 'Mood after screens' },
  { slug: 'gaming', label: 'Gaming' },
  { slug: 'online_safety', label: 'Online safety' },
  { slug: 'start_conversation', label: 'Starting the talk' },
  { slug: 'asking_for_phone', label: 'Asking for a phone' },
]

const FOCUS = ['Calmer mornings', 'Less screen battle', 'More connection', 'Better sleep', 'Feeling calmer myself']

export default function SundayCheckIn() {
  const [loaded, setLoaded] = useState(false)
  const [due, setDue] = useState(false)
  const [plan, setPlan] = useState<PlanStep[]>([])
  const [focusSaved, setFocusSaved] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)
  const [mood, setMood] = useState<number | null>(null)
  const [wentWell, setWentWell] = useState<string[]>([])
  const [hardest, setHardest] = useState<string[]>([])
  const [focus, setFocus] = useState<string | null>(null)
  const [draftPlan, setDraftPlan] = useState<PlanStep[]>([])
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch('/api/wellbeing/weekly')
      .then(r => r.json())
      .then(d => { setDue(!!d.due); setPlan(d.plan ?? []); setFocusSaved(d.focus ?? null) })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v])

  async function suggest() {
    setBusy(true)
    try {
      const r = await fetch('/api/wellbeing/weekly', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'suggest', parentMood: mood, wentWell, hardest, focus }),
      })
      const d = await r.json()
      setDraftPlan(Array.isArray(d.plan) ? d.plan : [])
      setStepIdx(4)
    } catch { setDraftPlan([]) ; setStepIdx(4) }
    setBusy(false)
  }

  async function agree() {
    setBusy(true)
    try {
      await fetch('/api/wellbeing/weekly', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'save', parentMood: mood, wentWell, hardest, focus, plan: draftPlan }),
      })
      setPlan(draftPlan)
      setFocusSaved(focus)
      setOpen(false); setDue(false)
    } catch { /* stays open to retry */ }
    setBusy(false)
  }

  if (!loaded) return null

  // The agreed plan, sitting on Home all week.
  if (plan.length > 0 && !open) {
    return (
      <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px', padding: '18px 20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(26,26,46,0.03), 0 10px 28px -14px rgba(26,26,46,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '13px' }}>
          <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '13px', background: 'var(--tint-sage)', border: '1.5px solid var(--retro-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DigiCharacter mood="happy" size={30} once />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'var(--deep-teal)' }}>This week with DiGi</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color: 'var(--ink)', lineHeight: 1.2 }}>
              {focusSaved ? focusSaved : 'Your agreed plan'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {plan.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '11px', background: 'var(--cream)', borderRadius: '13px', padding: '11px 13px' }}>
              <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: 'var(--retro-green)', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.3 }}>{p.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '3px' }}>{p.why}</div>
                {p.expert && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginTop: '5px' }}>{p.expert}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Sunday only: the check in appears proactively on a Sunday, never any other
  // day. Once a plan is agreed it shows above (all week); the rest of the week
  // this stays quiet so Home is not cluttered with a card there is nothing to do
  // with yet.
  if (!open) {
    if (!due) return null
    return (
      <button onClick={() => { setOpen(true); setStepIdx(0) }} style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        background: 'var(--terracotta-lt)',
        border: '1.5px solid var(--terracotta)',
        borderRadius: '20px', padding: '16px 18px', marginBottom: '20px',
        display: 'flex', alignItems: 'center', gap: '13px',
        boxShadow: '0 6px 20px -8px rgba(201,154,40,0.3)',
      }}>
        <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: '13px', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DigiCharacter mood="wave" size={30} once />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '16px', color: 'var(--ink)', lineHeight: 1.2 }}>
            Your Sunday check in
          </span>
          <span style={{ display: 'block', fontSize: '13px', color: 'var(--ink-soft)', marginTop: '2px', lineHeight: 1.4 }}>
            Five quick things, then DiGi sets a small plan for the week with you.
          </span>
        </span>
        <span style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: '#fff', background: 'var(--terracotta-dark)', borderRadius: '12px', padding: '10px 15px' }}>
          Start
        </span>
      </button>
    )
  }

  // Open: the stepped flow.
  const steps = ['mood', 'wentWell', 'hardest', 'focus', 'plan']
  const canNext =
    stepIdx === 0 ? mood != null
    : stepIdx === 3 ? focus != null
    : true

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--terracotta)', borderRadius: '22px', padding: '20px 20px 18px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(26,26,46,0.03), 0 16px 40px -14px rgba(26,26,46,0.16)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '16px' }}>
        <span style={{ flexShrink: 0, width: 42, height: 42, borderRadius: '12px', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DigiCharacter mood={busy ? 'thinking' : 'speak'} size={28} once />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>Sunday check in</div>
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '5px', marginTop: '6px' }}>
            {steps.map((_, i) => (
              <span key={i} style={{ width: i === stepIdx ? 20 : 7, height: 7, borderRadius: '100px', background: i <= stepIdx ? 'var(--terracotta)' : 'var(--border)', transition: 'all 0.3s ease' }} />
            ))}
          </div>
        </div>
        <button onClick={() => setOpen(false)} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--ink-muted)', flexShrink: 0 }}>✕</button>
      </div>

      {stepIdx === 0 && (
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '19px', color: 'var(--ink)', margin: '0 0 14px', lineHeight: 1.25 }}>First, how are you this week?</h3>
          <div style={{ display: 'flex', gap: '7px', justifyContent: 'space-between' }}>
            {MOODS.map(m => (
              <button key={m.v} onClick={() => setMood(m.v)} style={{
                flex: 1, cursor: 'pointer', background: mood === m.v ? 'var(--terracotta-lt)' : 'var(--cream)',
                border: `2px solid ${mood === m.v ? 'var(--terracotta)' : 'transparent'}`, borderRadius: '14px', padding: '11px 4px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              }}>
                <span style={{ fontSize: '26px' }}>{m.face}</span>
              </button>
            ))}
          </div>
          {mood != null && <p style={{ textAlign: 'center', fontSize: '13px', fontWeight: 700, color: 'var(--terracotta-dark)', margin: '11px 0 0' }}>{MOODS.find(m => m.v === mood)?.label}</p>}
        </div>
      )}

      {stepIdx === 1 && (
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '19px', color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.25 }}>What went well?</h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: '0 0 13px' }}>Tap any that fit, or none. Every week has something.</p>
          <ChipGrid options={WENT_WELL.map(w => ({ v: w, label: w }))} selected={wentWell} onToggle={v => toggle(wentWell, setWentWell, v)} />
        </div>
      )}

      {stepIdx === 2 && (
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '19px', color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.25 }}>What felt hardest?</h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: '0 0 13px' }}>So DiGi points the plan at the right thing.</p>
          <ChipGrid options={HARDEST.map(h => ({ v: h.slug, label: h.label }))} selected={hardest} onToggle={v => toggle(hardest, setHardest, v)} />
        </div>
      )}

      {stepIdx === 3 && (
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '19px', color: 'var(--ink)', margin: '0 0 13px', lineHeight: 1.25 }}>What do you want next week to feel like?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FOCUS.map(f => (
              <button key={f} onClick={() => setFocus(f)} style={{
                textAlign: 'left', cursor: 'pointer', background: focus === f ? 'var(--terracotta-lt)' : 'var(--cream)',
                border: `2px solid ${focus === f ? 'var(--terracotta)' : 'transparent'}`, borderRadius: '13px', padding: '13px 15px',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)',
              }}>
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {stepIdx === 4 && (
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '19px', color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1.25 }}>DiGi’s plan for your week</h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: '0 0 14px' }}>Small, doable, grounded in the evidence. Agree it and it sits on your Home all week.</p>
          {busy && draftPlan.length === 0 ? (
            <p style={{ fontSize: '14px', color: 'var(--terracotta-dark)', fontWeight: 700 }}>Reading your week and shaping a plan…</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {draftPlan.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: '11px', background: 'var(--cream)', borderRadius: '13px', padding: '12px 13px' }}>
                  <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: 'var(--terracotta)', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.3 }}>{p.title}</div>
                    <div style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '3px' }}>{p.why}</div>
                    {p.expert && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginTop: '5px' }}>{p.expert}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '18px' }}>
        {stepIdx > 0 && stepIdx < 4 && (
          <button onClick={() => setStepIdx(i => i - 1)} style={{ background: 'none', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '11px 16px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink-soft)' }}>Back</button>
        )}
        {stepIdx < 3 && (
          <button onClick={() => setStepIdx(i => i + 1)} disabled={!canNext} style={{ flex: 1, background: canNext ? 'var(--terracotta)' : 'var(--border)', color: 'var(--ink)', border: 'none', borderRadius: '13px', padding: '13px', cursor: canNext ? 'pointer' : 'default', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', boxShadow: canNext ? '0 4px 0 var(--terracotta-dark)' : 'none' }}>Next</button>
        )}
        {stepIdx === 3 && (
          <button onClick={suggest} disabled={!canNext || busy} style={{ flex: 1, background: canNext ? 'var(--terracotta)' : 'var(--border)', color: 'var(--ink)', border: 'none', borderRadius: '13px', padding: '13px', cursor: canNext && !busy ? 'pointer' : 'default', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', boxShadow: canNext ? '0 4px 0 var(--terracotta-dark)' : 'none' }}>
            {busy ? 'Shaping your plan…' : 'See my plan'}
          </button>
        )}
        {stepIdx === 4 && (
          <button onClick={agree} disabled={busy || draftPlan.length === 0} className="btn btn-green" style={{ flex: 1, borderRadius: '13px', padding: '13px', cursor: busy ? 'default' : 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px' }}>
            {busy ? 'Saving…' : 'Agree this plan ✓'}
          </button>
        )}
      </div>
    </div>
  )
}

function ChipGrid({ options, selected, onToggle }: { options: { v: string; label: string }[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(o => {
        const on = selected.includes(o.v)
        return (
          <button key={o.v} onClick={() => onToggle(o.v)} style={{
            cursor: 'pointer', background: on ? 'var(--terracotta)' : 'var(--cream)',
            border: `2px solid ${on ? 'var(--terracotta)' : 'transparent'}`, borderRadius: '100px', padding: '9px 15px',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13.5px', color: on ? '#fff' : 'var(--ink)',
          }}>
            {on ? '✓ ' : ''}{o.label}
          </button>
        )
      })}
    </div>
  )
}
