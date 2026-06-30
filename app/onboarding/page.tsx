'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AGE_BAND_OPTIONS, getStageFromAgeBand, type AgeBand, type StarterAnswers } from '@/lib/content/stages'

type Screen = 'init' | 'welcome' | 'name' | 'age' | 'challenges' | 'loading' | 'digi-intro' | 'founding' | 'first-task'

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
  padding: '16px 28px',
  background: 'var(--terracotta)', color: '#fff',
  border: 'none', borderRadius: 16,
  fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13,
  letterSpacing: '0.08em', textTransform: 'uppercase' as const,
  cursor: 'pointer',
  boxShadow: '0 5px 0 var(--terracotta-dark)',
  transition: 'transform 0.1s, box-shadow 0.1s',
  textAlign: 'center' as const,
  textDecoration: 'none',
}

const CARD: React.CSSProperties = {
  background: '#fff',
  border: '1px solid var(--border)',
  borderRadius: 20,
  padding: '28px 24px',
  boxShadow: '0 2px 16px rgba(26,26,46,0.07)',
}

function ProgressBar({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div style={{ height: '3px', background: 'rgba(26,26,46,0.08)', flexShrink: 0 }}>
      <div style={{
        height: '100%', background: 'var(--terracotta)',
        width: `${(step / 3) * 100}%`, transition: 'width 0.35s ease',
      }} />
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [screen, setScreen] = useState<Screen>('init')
  const [childName, setChildName] = useState('')
  const [ageBand, setAgeBand] = useState<AgeBand>('8-10')
  const [challenges, setChallenges] = useState<string[]>([])
  const [digiData, setDigiData] = useState<DigiData | null>(null)
  const [founderSpots, setFounderSpots] = useState<FounderSpots | null>(null)
  const [saving, setSaving] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles').select('onboarding_complete').eq('id', user.id).single()

      if (profile?.onboarding_complete) { router.push('/dashboard'); return }

      try {
        const saved = localStorage.getItem('gc_starter_answers')
        if (saved) {
          const answers = JSON.parse(saved) as StarterAnswers
          if (answers.ageBand) setAgeBand(answers.ageBand)
          if (answers.challenge) {
            const mapped = OLD_TO_NEW_CHALLENGE[answers.challenge]
            if (mapped) setChallenges([mapped])
          }
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
    if (screen === 'name') setTimeout(() => nameInputRef.current?.focus(), 100)
  }, [screen])

  async function completePersonalisation() {
    setSaving(true)
    setScreen('loading')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const stage = getStageFromAgeBand(ageBand)
    const name = childName.trim() || 'Your child'

    const [, existingChildren] = await Promise.all([
      supabase.from('profiles').upsert({
        id: user.id,
        onboarding_answers: { ageBand, challenge: challenges[0] ?? null, feeling: null },
        onboarding_complete: true,
      }),
      supabase.from('children').select('id').eq('parent_id', user.id).limit(1),
    ])

    if (!existingChildren.data || existingChildren.data.length === 0) {
      await supabase.from('children').insert({
        parent_id: user.id, name, age_band: ageBand, stage_id: stage.id, is_primary: true,
      })
    } else {
      await supabase.from('children').update({ name, age_band: ageBand, stage_id: stage.id })
        .eq('id', existingChildren.data[0].id)
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
        intro: `Hi, I'm DiGi. You mentioned the hard moments with ${n} — I know that feeling well, and it is very fixable. I will give you the exact words, not just theory.`,
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
      <div style={{ minHeight: '100dvh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--terracotta)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  // ── WELCOME ───────────────────────────────────────────────────────────────

  if (screen === 'welcome') {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '24px' }}>
            Ages 4 to 16 · One pathway
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.025em', color: 'var(--ink)', marginBottom: '18px' }}>
            From their first screen to the moment they are ready for everything.
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '40px' }}>
            Let&apos;s set this up around your child. Takes two minutes.
          </p>
          <button style={BTN} onClick={() => setScreen('name')}>
            Get started →
          </button>
        </div>
      </div>
    )
  }

  // ── NAME ──────────────────────────────────────────────────────────────────

  if (screen === 'name') {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
        <ProgressBar step={1} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
          <div style={{ maxWidth: 480, width: '100%' }}>
            <div style={CARD}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.2 }}>
                What's your child's name?
              </h2>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
                Optional. We'll use it throughout so everything feels personal.
              </p>
              <input
                ref={nameInputRef}
                className="input"
                value={childName}
                onChange={e => setChildName(e.target.value)}
                placeholder="Their first name"
                onKeyDown={e => { if (e.key === 'Enter') setScreen('age') }}
                style={{ marginBottom: '24px', fontSize: 17 }}
              />
              <button style={BTN} onClick={() => setScreen('age')}>
                Next →
              </button>
            </div>
            <button
              onClick={() => setScreen('welcome')}
              style={{ display: 'block', width: '100%', marginTop: '14px', background: 'none', border: 'none', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', textAlign: 'center', padding: '8px 0', letterSpacing: '0.06em' }}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── AGE ───────────────────────────────────────────────────────────────────

  if (screen === 'age') {
    const firstName = childName.trim() || 'them'
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
        <ProgressBar step={2} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
          <div style={{ maxWidth: 480, width: '100%' }}>
            <div style={CARD}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.2 }}>
                How old {firstName === 'them' ? 'are they' : `is ${firstName}`}?
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '22px', lineHeight: 1.5 }}>
                This maps them to the right pathway stage.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '24px' }}>
                {AGE_BAND_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setAgeBand(opt.value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 16px',
                      border: `2px solid ${ageBand === opt.value ? 'var(--terracotta)' : 'var(--border)'}`,
                      borderRadius: '14px',
                      background: ageBand === opt.value ? 'var(--terracotta-lt)' : '#fff',
                      cursor: 'pointer', textAlign: 'left', width: '100%',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${ageBand === opt.value ? 'var(--terracotta)' : 'var(--border)'}`,
                      background: ageBand === opt.value ? 'var(--terracotta)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {ageBand === opt.value && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>{opt.label}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', marginTop: '1px', letterSpacing: '0.04em' }}>{opt.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
              <button style={BTN} onClick={() => setScreen('challenges')}>
                Next →
              </button>
            </div>
            <button
              onClick={() => setScreen('name')}
              style={{ display: 'block', width: '100%', marginTop: '14px', background: 'none', border: 'none', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', textAlign: 'center', padding: '8px 0', letterSpacing: '0.06em' }}
            >
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
      <div style={{ minHeight: '100dvh', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
        <ProgressBar step={3} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
          <div style={{ maxWidth: 480, width: '100%' }}>
            <div style={CARD}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.2 }}>
                What's hardest right now?
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '22px', lineHeight: 1.5 }}>
                Pick as many as apply.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px', marginBottom: '24px' }}>
                {CHALLENGES.map(c => {
                  const selected = challenges.includes(c.id)
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleChallenge(c.id)}
                      style={{
                        padding: '13px 12px',
                        border: `2px solid ${selected ? 'var(--terracotta)' : 'var(--border)'}`,
                        borderRadius: '12px',
                        background: selected ? 'var(--terracotta-lt)' : '#fff',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-display)', fontWeight: selected ? 700 : 500, fontSize: '14px',
                        color: selected ? 'var(--terracotta)' : 'var(--ink)',
                        textAlign: 'center', lineHeight: 1.3,
                        transition: 'border-color 0.15s, background 0.15s, color 0.15s',
                        boxShadow: selected ? '0 3px 0 var(--terracotta-dark)' : 'none',
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
                {saving ? 'One moment...' : 'Show me the pathway →'}
              </button>
            </div>
            <button
              onClick={() => setScreen('age')}
              style={{ display: 'block', width: '100%', marginTop: '14px', background: 'none', border: 'none', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', textAlign: 'center', padding: '8px 0', letterSpacing: '0.06em' }}
            >
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
      <div style={{ minHeight: '100dvh', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--terracotta)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)', letterSpacing: '0.08em' }}>Setting up your pathway...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  // ── DIGI INTRO ────────────────────────────────────────────────────────────

  if (screen === 'digi-intro') {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          {/* DiGi avatar row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'var(--terracotta)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 4px 0 var(--terracotta-dark)',
            }}>
              <span style={{ fontSize: '1.4rem', color: '#fff' }}>◎</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--ink)', letterSpacing: '-0.01em' }}>DiGi</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.06em', marginTop: '2px' }}>Your digital parenting advisor</div>
            </div>
          </div>

          {/* Message */}
          <div style={{
            background: '#fff', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '24px', marginBottom: '24px',
            boxShadow: '0 2px 16px rgba(26,26,46,0.06)',
          }}>
            <p style={{ fontSize: '16px', color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>
              {digiData?.intro ?? 'Loading...'}
            </p>
          </div>

          <button style={BTN} onClick={() => setScreen('founding')}>
            Sounds good →
          </button>
        </div>
      </div>
    )
  }

  // ── FOUNDING ──────────────────────────────────────────────────────────────

  if (screen === 'founding') {
    const remaining = founderSpots?.remaining ?? null
    const soldOut = founderSpots?.sold_out ?? false

    async function skipToApp() {
      // Ensure onboarding_complete is saved before navigating away
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          onboarding_complete: true,
        })
      }
      router.push('/dashboard')
    }

    return (
      <div style={{ minHeight: '100dvh', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '16px' }}>
            Founding members · 50 places
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.15, color: 'var(--ink)', marginBottom: '28px' }}>
            Be one of the first 50.
          </h1>

          <div style={{
            background: '#fff', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '28px 24px', marginBottom: '16px',
            boxShadow: '0 2px 16px rgba(26,26,46,0.06)',
          }}>
            {!soldOut ? (
              <>
                <p style={{ fontSize: '16px', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '20px' }}>
                  Founding members lock in £7.99 a month for life. The price never rises for you, even as the platform grows.
                </p>

                {/* Counter */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'var(--stage-2)', border: '1px solid var(--border)',
                  borderRadius: '100px', padding: '6px 14px', marginBottom: '24px',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--terracotta)', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '13px', color: 'var(--ink-soft)' }}>
                    {remaining !== null ? `${remaining} of 50 places left` : 'Loading availability...'}
                  </span>
                </div>

                <form action="/api/stripe/checkout" method="POST">
                  <input type="hidden" name="tier" value="founder" />
                  <button type="submit" style={BTN}>
                    Claim my founding place. £7.99 per month for life.
                  </button>
                </form>
              </>
            ) : (
              <>
                <p style={{ fontSize: '16px', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '20px' }}>
                  The 50 founding places have been claimed. You can still join at our standard rate.
                </p>
                <form action="/api/stripe/checkout" method="POST">
                  <input type="hidden" name="tier" value="standard" />
                  <button type="submit" style={BTN}>Join now</button>
                </form>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={skipToApp}
            style={{
              display: 'block', width: '100%',
              background: 'none', border: 'none',
              color: 'var(--ink-muted)',
              fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em',
              cursor: 'pointer', textAlign: 'center', padding: '12px 0',
            }}
          >
            Maybe later — take me to the platform
          </button>
        </div>
      </div>
    )
  }

  // ── FIRST TASK ────────────────────────────────────────────────────────────

  if (screen === 'first-task') {
    const name = childName.trim() || 'your child'
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px 48px' }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, color: 'var(--ink)', marginBottom: '24px', textAlign: 'center' }}>
            Let's set tomorrow up.
          </h2>

          {digiData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* DiGi question */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--terracotta)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 3px 0 var(--terracotta-dark)',
                }}>
                  <span style={{ fontSize: '1rem', color: '#fff' }}>◎</span>
                </div>
                <div style={{ ...CARD, flex: 1, padding: '16px 18px' }}>
                  <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--ink)', margin: 0 }}>
                    {digiData.taskQuestion}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div style={{ ...CARD, borderLeft: '3px solid var(--terracotta)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '8px' }}>
                  Try this tomorrow
                </div>
                <p style={{ fontSize: '15px', lineHeight: 1.65, color: 'var(--ink-soft)', margin: 0 }}>
                  {digiData.taskAction}
                </p>
              </div>

              {/* Script */}
              <div style={{ ...CARD, background: 'var(--terracotta-lt)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '8px' }}>
                  Say this
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', lineHeight: 1.65, color: 'var(--ink)', margin: 0, fontStyle: 'italic' }}>
                  {digiData.taskScript}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--terracotta)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)', letterSpacing: '0.06em' }}>DiGi is preparing your first task...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          )}

          <button style={{ ...BTN, marginTop: '28px' }} onClick={() => router.push('/dashboard')}>
            You are set for tomorrow →
          </button>

          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', textAlign: 'center', marginTop: '14px', lineHeight: 1.5 }}>
            DiGi will be there whenever you need it.
          </p>
        </div>
      </div>
    )
  }

  return null
}
