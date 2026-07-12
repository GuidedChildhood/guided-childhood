'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AGE_BAND_OPTIONS, getStageFromAgeBand, type AgeBand, type StarterAnswers } from '@/lib/content/stages'
import { VAPID_PUBLIC_KEY } from '@/lib/config/vapid'
import { trialEndsFromNow } from '@/lib/access'
import Celebration from '@/components/ui/Celebration'

type Screen = 'init' | 'welcome' | 'children' | 'challenges' | 'loading' | 'digi-intro' | 'founding' | 'first-task' | 'notifications'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from(rawData, c => c.charCodeAt(0))
}

interface DigiData {
  intro: string
  taskQuestion: string
  taskAction: string
  taskScript: string
}

interface FounderSpots {
  remaining: number
  sold_out: boolean
}

const CHALLENGES = [
  { id: 'morning_tv', label: 'Morning TV' },
  { id: 'controller_fights', label: 'Controller fights' },
  { id: 'wont_put_down', label: "Won't put it down" },
  { id: 'bedtime_screens', label: 'Bedtime screens' },
  { id: 'mood_after_screens', label: 'Mood after screens' },
  { id: 'something_else', label: 'Something else' },
]

const OLD_TO_NEW_CHALLENGE: Record<string, string> = {
  screens_takeover: 'wont_put_down',
  mood_changes: 'mood_after_screens',
  gaming: 'controller_fights',
  online_safety: 'something_else',
  start_conversation: 'something_else',
  asking_for_phone: 'something_else',
}

const BTN: React.CSSProperties = {
  display: 'block', width: '100%',
  padding: '17px 28px',
  background: 'var(--terracotta)', color: 'var(--ink)',
  border: 'none', borderRadius: 16,
  fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13,
  letterSpacing: '0.08em', textTransform: 'uppercase' as const,
  cursor: 'pointer',
  boxShadow: '0 5px 0 var(--terracotta-dark)',
  transition: 'transform 0.1s, box-shadow 0.1s',
  textAlign: 'center' as const,
}

const BACK_BTN: React.CSSProperties = {
  display: 'block', width: '100%', marginTop: '12px',
  background: 'none', border: 'none',
  color: '#9ca3af',
  fontFamily: 'var(--font-mono)', fontSize: '11px',
  cursor: 'pointer', textAlign: 'center' as const,
  padding: '10px 0', letterSpacing: '0.06em',
}

// CSS keyframes shared across all screens
const ANIM = `
  @keyframes digiFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-9px); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1);   opacity: 0.75; }
    100% { transform: scale(1.6); opacity: 0; }
  }
  @keyframes btnGlow {
    0%, 100% { box-shadow: 0 5px 0 var(--terracotta-dark); }
    50%       { box-shadow: 0 5px 0 var(--terracotta-dark), 0 0 32px rgba(220,88,50,0.32); }
  }
  @keyframes arrowBounce {
    0%, 100% { transform: translateY(0);  opacity: 0.45; }
    50%       { transform: translateY(7px); opacity: 1; }
  }
  @keyframes spin { to { transform: rotate(360deg) } }
`

function ProgressBar({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div style={{ height: '4px', background: '#f3f4f6', flexShrink: 0 }}>
      <div style={{
        height: '100%', background: 'var(--terracotta)',
        width: `${(step / 3) * 100}%`,
        transition: 'width 0.4s ease',
        borderRadius: '0 2px 2px 0',
      }} />
    </div>
  )
}

// DiGi with left-pointing speech bubble — used on question screens
function DigiSpeech({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '28px' }}>
      <div style={{ flexShrink: 0, animation: 'digiFloat 3.5s ease-in-out infinite' }}>
        <img src="/digi-squad/DiGi-star.svg" alt="" aria-hidden="true" width={64} height={64} style={{ display: 'block' }} />
      </div>
      <div style={{ position: 'relative', flex: 1, paddingTop: '6px' }}>
        {/* Tail — border layer */}
        <div style={{
          position: 'absolute', left: -9, top: 18,
          width: 0, height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: '9px solid #e5e7eb',
        }} />
        {/* Tail — fill layer */}
        <div style={{
          position: 'absolute', left: -7, top: 18,
          width: 0, height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: '9px solid #fff',
          zIndex: 1,
        }} />
        <div style={{
          background: '#fff', border: '1.5px solid #e5e7eb',
          borderRadius: 18, padding: '14px 18px',
          boxShadow: '0 2px 12px rgba(26,26,46,0.07)',
          position: 'relative', zIndex: 0,
        }}>
          <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--ink)', lineHeight: 1.4 }}>
            {text}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [screen, setScreen] = useState<Screen>('init')
  const [childName, setChildName] = useState('')
  const [nameNudge, setNameNudge] = useState(false)
  const [ageBand, setAgeBand] = useState<AgeBand>('8-10')
  // Any additional children the parent adds. The first child above is the
  // active one the app follows for now; these are saved so the account feels
  // complete, ready for full multi child later.
  const [siblings, setSiblings] = useState<{ name: string; ageBand: AgeBand }[]>([])
  const [challenges, setChallenges] = useState<string[]>([])
  const [timeCommitment, setTimeCommitment] = useState<StarterAnswers['timeCommitment']>(undefined)
  const [digiData, setDigiData] = useState<DigiData | null>(null)
  const [founderSpots, setFounderSpots] = useState<FounderSpots | null>(null)
  const [saving, setSaving] = useState(false)
  // True when the starter quiz already gave us age and challenges, so
  // onboarding skips re asking them and goes straight to the pathway.
  const [prefilled, setPrefilled] = useState(false)
  const [notifDest, setNotifDest] = useState<'script' | 'dashboard'>('script')
  const [notifStatus, setNotifStatus] = useState<'idle' | 'asking' | 'done'>('idle')
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles').select('onboarding_complete').eq('id', user.id).maybeSingle()

      // Already onboarded: send them to the dashboard. The dashboard only
      // bounces back here when it positively knows onboarding is not done, so
      // this can no longer ping pong into the continuous flashing loop.
      if (profile?.onboarding_complete) { router.push('/dashboard'); return }

      try {
        // The child's first name is captured at the start of the pathway now,
        // so carry it through and never ask for it twice.
        const savedChildName = localStorage.getItem('gc_starter_child_name')
        if (savedChildName) setChildName(savedChildName)

        const saved = localStorage.getItem('gc_starter_answers')
        if (saved) {
          const answers = JSON.parse(saved) as StarterAnswers
          if (answers.ageBand) setAgeBand(answers.ageBand)
          // Carry through every concern the parent ticked in the starter
          // quiz, most pressing first, mapped onto the onboarding ids and
          // de duped (several starter concerns can map to something_else).
          const fromStarter = answers.concerns?.length ? answers.concerns : answers.challenge ? [answers.challenge] : []
          const mappedAll = Array.from(new Set(fromStarter.map(c => OLD_TO_NEW_CHALLENGE[c]).filter(Boolean)))
          if (mappedAll.length) setChallenges(mappedAll)
          if (answers.timeCommitment) setTimeCommitment(answers.timeCommitment)
          // We already asked age and concern in the starter quiz. If both are
          // here, do not make the parent answer them a second time.
          if (answers.ageBand && mappedAll.length) setPrefilled(true)
        }
      } catch {}

      fetch('/api/founder-spots')
        .then(r => r.json())
        .then((d: FounderSpots) => setFounderSpots(d))
        .catch(() => setFounderSpots({ remaining: 50, sold_out: false }))

      setScreen('welcome')
    }
    init()
  }, [router])

  useEffect(() => {
    if (screen === 'children') setTimeout(() => nameInputRef.current?.focus(), 100)
  }, [screen])

  async function completePersonalisation() {
    setSaving(true)
    setScreen('loading')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const stage = getStageFromAgeBand(ageBand)
    const name = childName.trim() || 'Your child'

    const [, existingChildren] = await Promise.all([
      supabase.from('profiles').update({
        onboarding_answers: { ageBand, challenge: challenges[0] ?? null, feeling: null, timeCommitment: timeCommitment ?? null },
        onboarding_complete: true,
        // The 7 day free trial starts the moment setup is done, no card.
        trial_ends_at: trialEndsFromNow(),
      }).eq('id', user.id),
      supabase.from('children').select('id').eq('parent_id', user.id).limit(1),
    ])

    if (!existingChildren.data || existingChildren.data.length === 0) {
      await supabase.from('children').insert({
        parent_id: user.id, name, age_band: ageBand, stage_id: stage.name.toLowerCase(), is_primary: true,
      })
    } else {
      await supabase.from('children').update({ name, age_band: ageBand, stage_id: stage.name.toLowerCase() })
        .eq('id', existingChildren.data[0].id)
    }

    // Save any additional children the parent added. Named only, never
    // primary, so the account holds the whole family while the app runs on
    // the active child for now. Only on a fresh setup, so re running never
    // duplicates them.
    if ((!existingChildren.data || existingChildren.data.length === 0) && siblings.length) {
      const rows = siblings
        .filter(s => s.name.trim())
        .map(s => ({
          parent_id: user.id,
          name: s.name.trim(),
          age_band: s.ageBand,
          stage_id: getStageFromAgeBand(s.ageBand).name.toLowerCase(),
          is_primary: false,
        }))
      if (rows.length) await supabase.from('children').insert(rows)
    }

    localStorage.removeItem('gc_starter_answers')

    try {
      const res = await fetch('/api/onboarding/digi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childName: name, ageBand, challenges }),
      })
      const data = await res.json()
      setDigiData(data)
    } catch {
      const n = name === 'Your child' ? 'your child' : name
      setDigiData({
        intro: `Hi, I'm DiGi. You mentioned the hard moments with ${n} and I know that feeling well. It is very fixable. I will give you the exact words, not just theory.`,
        taskQuestion: `What does tomorrow morning usually look like before things get difficult?`,
        taskAction: `Pick one moment tomorrow where you will give a five-minute heads-up before asking them to stop. Say it once, calmly.`,
        taskScript: `"Five more minutes, then we're done." That's it. Say it once. The calm consistency is what builds the habit.`,
      })
    }

    setSaving(false)
    setScreen('digi-intro')
  }

  function toggleChallenge(id: string) {
    setChallenges(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  // ── INIT ──────────────────────────────────────────────────────────────────

  if (screen === 'init') {
    return (
      <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{ANIM}</style>
        <div style={{ width: 36, height: 36, border: '3px solid #f3f4f6', borderTopColor: 'var(--terracotta)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  // ── WELCOME ───────────────────────────────────────────────────────────────

  if (screen === 'welcome') {
    return (
      <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <style>{ANIM}</style>
        <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>

          {/* DiGi centered with pulse rings */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
            <div style={{ position: 'relative', width: 96, height: 96 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(220,88,50,0.35)', animation: 'pulseRing 2.2s ease-out infinite' }} />
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(220,88,50,0.2)', animation: 'pulseRing 2.2s ease-out 1.1s infinite' }} />
              <img src="/digi-squad/DiGi-star.svg" alt="DiGi" width={96} height={96} style={{ animation: 'digiFloat 3.5s ease-in-out infinite', display: 'block', position: 'relative', zIndex: 1 }} />
            </div>
          </div>

          {/* Speech bubble — tail points upward to DiGi */}
          <div style={{ display: 'inline-block', position: 'relative', marginBottom: '32px' }}>
            <div style={{
              position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
              borderBottom: '8px solid #e5e7eb',
            }} />
            <div style={{
              position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
              borderBottom: '8px solid #fff',
              zIndex: 1,
            }} />
            <div style={{
              background: '#fff', border: '1.5px solid #e5e7eb',
              borderRadius: 18, padding: '14px 22px',
              boxShadow: '0 2px 12px rgba(26,26,46,0.07)',
              position: 'relative', zIndex: 0,
            }}>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
                Hi! I'm DiGi, your digital parenting guide.
              </p>
            </div>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1.12, marginBottom: '14px' }}>
            From first screen to digital independence.
          </h1>
          <p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.65, marginBottom: '32px' }}>
            Let's set this up around your child. Takes two minutes.
          </p>
          <button style={BTN} onClick={() => setScreen('children')}>
            Start your digital pathway
          </button>
        </div>
      </div>
    )
  }

  // ── CHILDREN ──────────────────────────────────────────────────────────────
  // One screen: the active child (name and age), then any brothers or sisters
  // the parent wants on the account. The first child is the one the app
  // follows for now, the rest are saved so the whole family is set up.

  if (screen === 'children') {
    const firstName = childName.trim()
    // A name is never demanded (first name only is the whole ask), but leaving
    // it blank should be a choice, not an accident: the first Next with no
    // name flags why it matters and asks once. A second Next continues.
    const continueOn = () => {
      if (!firstName && !nameNudge) {
        setNameNudge(true)
        nameInputRef.current?.focus()
        return
      }
      if (prefilled) completePersonalisation(); else setScreen('challenges')
    }
    const addSibling = () => setSiblings(prev => [...prev, { name: '', ageBand: '8-10' }])
    const updateSibling = (i: number, patch: Partial<{ name: string; ageBand: AgeBand }>) =>
      setSiblings(prev => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)))
    const removeSibling = (i: number) => setSiblings(prev => prev.filter((_, idx) => idx !== i))

    const lbl: React.CSSProperties = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 8 }
    const ageRow = (on: boolean): React.CSSProperties => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', border: `2px solid ${on ? 'var(--terracotta)' : '#e5e7eb'}`, borderRadius: 16, background: on ? 'var(--terracotta-lt)' : '#fff', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'border-color 0.12s, background 0.12s' })

    return (
      <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
        <style>{ANIM}</style>
        <ProgressBar step={prefilled ? 3 : 2} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
          <div style={{ maxWidth: 480, width: '100%' }}>
            <DigiSpeech text="Who are we setting up for?" />

            <label style={lbl}>Your child&apos;s first name</label>
            <input
              ref={nameInputRef}
              className="input"
              value={childName}
              onChange={e => setChildName(e.target.value)}
              placeholder="Their first name"
              style={{ marginBottom: nameNudge && !firstName ? '10px' : '18px', fontSize: 17 }}
            />
            {nameNudge && !firstName && (
              <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: 12, padding: '12px 14px', marginBottom: '18px' }}>
                <p style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
                  A first name makes every script and DiGi answer personal to them. First name only, nothing else is ever asked for. You can also continue without one.
                </p>
              </div>
            )}

            <label style={lbl}>How old {firstName ? `is ${firstName}` : 'are they'}?</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {AGE_BAND_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setAgeBand(opt.value)} style={ageRow(ageBand === opt.value)}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginBottom: 2 }}>{opt.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#9ca3af', letterSpacing: '0.04em' }}>{opt.sub}</div>
                  </div>
                  {ageBand === opt.value
                    ? <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ color: '#fff', fontSize: 11, fontWeight: 800, lineHeight: 1 }}>✓</span></div>
                    : <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #e5e7eb', flexShrink: 0 }} />}
                </button>
              ))}
            </div>

            {siblings.map((s, i) => (
              <div key={i} style={{ border: '1.5px solid #e5e7eb', borderRadius: 16, padding: '14px 15px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ ...lbl, marginBottom: 0 }}>Another child</span>
                  <button type="button" onClick={() => removeSibling(i)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer', letterSpacing: '0.04em' }}>Remove</button>
                </div>
                <input className="input" value={s.name} onChange={e => updateSibling(i, { name: e.target.value })} placeholder="First name" style={{ marginBottom: '10px', fontSize: 16 }} />
                <select value={s.ageBand} onChange={e => updateSibling(i, { ageBand: e.target.value as AgeBand })} className="input" style={{ fontSize: 15 }}>
                  {AGE_BAND_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            ))}

            <button type="button" onClick={addSibling} style={{ ...BTN, background: '#fff', color: 'var(--terracotta)', border: '2px solid var(--terracotta)', boxShadow: 'none', marginBottom: '18px' }}>
              + Add another child
            </button>

            <button style={{ ...BTN, opacity: saving ? 0.7 : 1 }} onClick={continueOn} disabled={saving}>
              {saving ? 'One moment...' : nameNudge && !firstName ? 'Continue without a name' : prefilled ? 'Show me the pathway' : 'Next'}
            </button>
            <button onClick={() => setScreen('welcome')} style={BACK_BTN}>
              ← Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── CHALLENGES ────────────────────────────────────────────────────────────

  if (screen === 'challenges') {
    return (
      <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
        <style>{ANIM}</style>
        <ProgressBar step={3} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
          <div style={{ maxWidth: 480, width: '100%' }}>
            <DigiSpeech text="What's the main challenge right now?" />
            <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: '18px', fontFamily: 'var(--font-mono)', letterSpacing: '0.03em' }}>
              Pick as many as apply.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {CHALLENGES.map(c => {
                const selected = challenges.includes(c.id)
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleChallenge(c.id)}
                    style={{
                      padding: '16px 12px',
                      border: `2px solid ${selected ? 'var(--terracotta)' : '#e5e7eb'}`,
                      borderRadius: 14,
                      background: selected ? 'var(--terracotta-lt)' : '#fff',
                      cursor: 'pointer', textAlign: 'center', lineHeight: 1.35,
                      fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14,
                      color: selected ? 'var(--terracotta)' : 'var(--ink)',
                      transition: 'border-color 0.12s, background 0.12s, color 0.12s',
                    }}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
            <button
              style={{ ...BTN, opacity: saving ? 0.7 : 1 }}
              onClick={completePersonalisation}
              disabled={saving}
            >
              {saving ? 'One moment...' : 'Show me the pathway'}
            </button>
            <button onClick={() => setScreen('children')} style={BACK_BTN}>
              ← Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── LOADING ───────────────────────────────────────────────────────────────

  if (screen === 'loading') {
    return (
      <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <style>{ANIM}</style>
        <img src="/digi-squad/DiGi-star.svg" alt="" width={72} height={72} style={{ animation: 'digiFloat 2s ease-in-out infinite' }} />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#9ca3af', letterSpacing: '0.08em' }}>
          Setting up your pathway...
        </p>
      </div>
    )
  }

  // ── DIGI INTRO ────────────────────────────────────────────────────────────

  if (screen === 'digi-intro') {
    return (
      <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <style>{ANIM}</style>
        {/* The pathway is ready: a soft confetti burst as DiGi arrives, so
            finishing setup feels like a welcome, not a form submit. */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
          <Celebration />
        </div>
        <div style={{ maxWidth: 480, width: '100%' }}>

          {/* DiGi avatar with pulse rings — animates in */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', animation: 'fadeUp 0.45s ease both' }}>
            <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
              <div style={{ position: 'absolute', inset: '-6px', borderRadius: '50%', border: '2px solid rgba(220,88,50,0.4)', animation: 'pulseRing 2.1s ease-out infinite' }} />
              <div style={{ position: 'absolute', inset: '-6px', borderRadius: '50%', border: '2px solid rgba(220,88,50,0.22)', animation: 'pulseRing 2.1s ease-out 1.05s infinite' }} />
              <img
                src="/digi-squad/DiGi-star.svg" alt="DiGi" width={64} height={64}
                style={{ animation: 'digiFloat 3.5s ease-in-out infinite', display: 'block', position: 'relative', zIndex: 1 }}
              />
            </div>
            <div style={{ animation: 'fadeUp 0.45s ease 0.1s both' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--ink)', letterSpacing: '-0.02em' }}>DiGi</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#9ca3af', letterSpacing: '0.06em', marginTop: 2 }}>Your digital parenting advisor</div>
            </div>
          </div>

          {/* Message */}
          <div style={{
            background: '#fff', border: '1.5px solid #e5e7eb',
            borderRadius: 20, padding: '22px 24px',
            marginBottom: '24px',
            boxShadow: '0 4px 24px rgba(26,26,46,0.08)',
            animation: 'fadeUp 0.45s ease 0.25s both',
          }}>
            <p style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1.75, margin: 0, fontWeight: 500 }}>
              {digiData?.intro ?? 'Loading...'}
            </p>
          </div>

          {/* Bouncing arrow pointing to the button */}
          <div style={{ textAlign: 'center', marginBottom: '10px', animation: 'arrowBounce 1.3s ease-in-out 1.8s infinite both' }}>
            <span style={{ color: 'var(--terracotta)', fontSize: 22, lineHeight: 1 }}>↓</span>
          </div>

          {/* CTA — glows after appearing */}
          <div style={{ animation: 'fadeUp 0.45s ease 0.45s both' }}>
            <button
              style={{ ...BTN, animation: 'btnGlow 2.2s ease-in-out 2.2s infinite' }}
              onClick={() => setScreen('founding')}
            >
              Sounds good
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── FOUNDING ──────────────────────────────────────────────────────────────

  if (screen === 'founding') {
    const remaining = founderSpots?.remaining ?? null
    const soldOut = founderSpots?.sold_out ?? false

    async function skipToApp() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', user.id)
      }
      setScreen('first-task')
    }

    return (
      <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <style>{ANIM}</style>
        <div style={{ maxWidth: 480, width: '100%' }}>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '12px' }}>
            Founding members · 50 places
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4.5vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--ink)', marginBottom: '28px' }}>
            Be one of the first 50.
          </h1>

          <div style={{
            background: '#fff', border: '1.5px solid #e5e7eb',
            borderRadius: 20, padding: '28px 24px',
            marginBottom: '14px',
            boxShadow: '0 4px 24px rgba(26,26,46,0.07)',
          }}>
            {!soldOut ? (
              <>
                <p style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1.7, marginBottom: '20px' }}>
                  Your 7 days are already running. Add your card now to hold one of the 50 founder places and lock in £7.99 a month for life. Nothing is charged for 7 days, and you can cancel any time before then.
                </p>

                {/* Availability counter — ink on white, not coloured bg */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: '100px', padding: '7px 16px', marginBottom: '24px',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--terracotta)', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>
                    {remaining !== null ? `${remaining} of 50 places left` : 'Loading availability...'}
                  </span>
                </div>

                <form action="/api/stripe/checkout" method="POST">
                  <input type="hidden" name="tier" value="founder" />
                  <input type="hidden" name="from" value="onboarding" />
                  <button type="submit" style={BTN}>
                    Hold my founder place. 7 days free, then £7.99 for life
                  </button>
                </form>
              </>
            ) : (
              <>
                <p style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1.7, marginBottom: '20px' }}>
                  The 50 founder places have been claimed. Your 7 days are already running. Add your card to continue automatically after, nothing charged for 7 days, cancel any time.
                </p>
                <form action="/api/stripe/checkout" method="POST">
                  <input type="hidden" name="tier" value="standard" />
                  <input type="hidden" name="from" value="onboarding" />
                  <button type="submit" style={BTN}>Keep my access. 7 days free, then standard rate</button>
                </form>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={skipToApp}
            style={{
              display: 'block', width: '100%', marginTop: '14px',
              padding: '15px 24px', background: '#fff',
              border: '2px solid var(--ink)', borderRadius: 16,
              color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
              cursor: 'pointer', textAlign: 'center',
            }}
          >
            Start free without a card
          </button>
          <p style={{ fontSize: 12.5, color: '#9ca3af', textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
            Full access for your 7 days. After that the daily habit, quests and tracker stay free, and the founder rate stays open for you if you want everything back. No card now, no charge without your say.
          </p>
        </div>
      </div>
    )
  }

  // ── FIRST TASK ────────────────────────────────────────────────────────────

  if (screen === 'first-task') {
    const name = childName.trim() || 'your child'
    return (
      <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px 48px' }}>
        <style>{ANIM}</style>
        <div style={{ maxWidth: 480, width: '100%' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 900, letterSpacing: '-0.025em', lineHeight: 1.15, color: 'var(--ink)', marginBottom: '24px', textAlign: 'center' }}>
            Let's set tomorrow up.
          </h2>

          {digiData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* DiGi question */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <img src="/digi-squad/DiGi-star.svg" alt="" width={36} height={36} style={{ flexShrink: 0, animation: 'digiFloat 3.5s ease-in-out infinite' }} />
                <div style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 16, padding: '16px 18px', flex: 1, boxShadow: '0 2px 12px rgba(26,26,46,0.06)' }}>
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink)', margin: 0, fontWeight: 500 }}>
                    {digiData.taskQuestion}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderLeft: '3px solid var(--terracotta)', borderRadius: '0 14px 14px 0', padding: '20px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 8 }}>
                  Try this tomorrow
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink)', margin: 0 }}>
                  {digiData.taskAction}
                </p>
              </div>

              {/* Script */}
              <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid #e5e7eb', borderRadius: 14, padding: '20px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 8 }}>
                  Say this
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, lineHeight: 1.65, color: 'var(--ink)', margin: 0, fontStyle: 'italic' }}>
                  {digiData.taskScript}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <img src="/digi-squad/DiGi-star.svg" alt="" width={48} height={48} style={{ margin: '0 auto 16px', animation: 'digiFloat 2s ease-in-out infinite', display: 'block' }} />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#9ca3af', letterSpacing: '0.06em' }}>DiGi is preparing your first task...</p>
            </div>
          )}

          <button style={{ ...BTN, marginTop: '28px' }} onClick={() => { setNotifDest('script'); setScreen('notifications') }}>
            Open my first script
          </button>
          <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
            DiGi picked it from what you told us. Two minutes, the exact words for tonight.
          </p>
          <button type="button" onClick={() => { setNotifDest('dashboard'); setScreen('notifications') }} style={BACK_BTN}>
            Take me to my dashboard instead
          </button>
        </div>
      </div>
    )
  }

  // ── NOTIFICATIONS ─────────────────────────────────────────────────────────
  // Asked here, at the exact moment DiGi named tonight's real moment, not
  // buried in Settings for later. Duolingo asks the same way: once someone
  // has already invested in a concrete plan, protecting that plan with a
  // reminder is an easy, obvious yes.

  if (screen === 'notifications') {
    const goNext = () => router.push(notifDest === 'script' ? '/dashboard/scripts/recommended' : '/dashboard')

    async function enableNotifications() {
      setNotifStatus('asking')
      try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) { goNext(); return }
        const perm = await Notification.requestPermission()
        if (perm !== 'granted') { goNext(); return }
        const reg = await navigator.serviceWorker.register('/sw.js')
        await navigator.serviceWorker.ready
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        })
        const { data: { user } } = await supabase.auth.getUser()
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ subscription: sub.toJSON(), userId: user?.id }),
        })
        setNotifStatus('done')
        setTimeout(goNext, 900)
      } catch {
        goNext()
      }
    }

    return (
      <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <style>{ANIM}</style>
        <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
          <img src="/digi-squad/DiGi-star.svg" alt="" width={56} height={56} style={{ margin: '0 auto 22px', animation: 'digiFloat 2.4s ease-in-out infinite', display: 'block' }} />

          {notifStatus === 'done' ? (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', fontWeight: 900, color: 'var(--ink)', marginBottom: 10 }}>
                Done! DiGi will be there.
              </h2>
              <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6 }}>Taking you in...</p>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 14 }}>
                Want me to remind you?
              </h2>
              <p style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1.7, marginBottom: '28px' }}>
                The moment you just planned for happens tonight, not next week. A nudge right before it, and one after school, and that is genuinely it. No spam, and I will stop the second it stops helping.
              </p>
              <button
                style={{ ...BTN, animation: notifStatus === 'idle' ? 'btnGlow 2.2s ease-in-out 1s infinite' : 'none' }}
                onClick={enableNotifications}
                disabled={notifStatus === 'asking'}
              >
                {notifStatus === 'asking' ? 'One second...' : 'Yes, remind me'}
              </button>
              <button type="button" onClick={goNext} style={BACK_BTN}>
                Not now
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return null
}
