'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AGE_BAND_OPTIONS, getStageFromAgeBand, type AgeBand, type StarterAnswers } from '@/lib/content/stages'

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Constants ────────────────────────────────────────────────────────────────

const CHALLENGES = [
  { id: 'morning_tv', label: 'Morning TV' },
  { id: 'controller_fights', label: 'Controller fights' },
  { id: 'wont_put_down', label: 'Won\'t put it down' },
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

// ─── Shared styles ────────────────────────────────────────────────────────────

const CARD: React.CSSProperties = {
  background: '#fff',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: '28px 24px',
  boxShadow: '0 2px 12px rgba(43,43,43,0.06)',
}

const SCREEN: React.CSSProperties = {
  minHeight: '100dvh',
  background: 'var(--cream)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 20px',
}

const EYEBROW: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--ink-muted)',
  marginBottom: 16,
}

const BTN: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '15px 28px',
  background: 'var(--terracotta)',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
  boxShadow: '0 4px 0 var(--terracotta-dark)',
  transition: 'transform 0.1s, box-shadow 0.1s',
  textAlign: 'center' as const,
  textDecoration: 'none',
}

// ─── Component ────────────────────────────────────────────────────────────────

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

  // ── On mount: gate + pre-fill ──────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_complete')
        .eq('id', user.id)
        .single()

      if (profile?.onboarding_complete) {
        router.push('/dashboard')
        return
      }

      // Pre-fill from starter-pack localStorage answers
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

      // Fetch founder spots in background (needed for Screen 4)
      fetch('/api/founder-spots')
        .then(r => r.json())
        .then((d: FounderSpots) => setFounderSpots(d))
        .catch(() => setFounderSpots({ remaining: 50, sold_out: false }))

      setScreen('welcome')
    }
    init()
  }, [router])

  // ── Focus name input when screen changes to name ───────────────────────────
  useEffect(() => {
    if (screen === 'name') {
      setTimeout(() => nameInputRef.current?.focus(), 100)
    }
  }, [screen])

  // ── After Q3: save + fetch DiGi content ───────────────────────────────────
  async function completePersonalisation() {
    setSaving(true)
    setScreen('loading')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const stage = getStageFromAgeBand(ageBand)
    const name = childName.trim() || 'Your child'

    // Save profile answers + child record in parallel
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
        parent_id: user.id,
        name,
        age_band: ageBand,
        stage_id: stage.id,
        is_primary: true,
      })
    } else {
      // Update existing child with the new values
      await supabase.from('children').update({
        name,
        age_band: ageBand,
        stage_id: stage.id,
      }).eq('id', existingChildren.data[0].id)
    }

    localStorage.removeItem('gc_starter_answers')

    // Fetch DiGi intro + first task
    try {
      const res = await fetch('/api/onboarding/digi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childName: name, ageBand, challenges }),
      })
      const data = await res.json()
      setDigiData(data)
    } catch {
      setDigiData({
        intro: `Hi, I'm DiGi. You mentioned the hard moments with ${name === 'Your child' ? 'your child' : name} — I know that feeling well, and it is very fixable. I will give you the exact words, not just theory.`,
        taskQuestion: `What does tomorrow morning usually look like before things get difficult?`,
        taskAction: `Pick one moment tomorrow where you will give a five-minute heads-up before asking them to stop. Say it once, calmly.`,
        taskScript: `"Five more minutes, then we're done." That's it. Say it once. The calm consistency is what builds the habit.`,
      })
    }

    setSaving(false)
    setScreen('digi-intro')
  }

  function toggleChallenge(id: string) {
    setChallenges(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  // ─── Progress dots ─────────────────────────────────────────────────────────
  function ProgressDots({ current }: { current: 1 | 2 | 3 }) {
    return (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
        {[1, 2, 3].map(n => (
          <div
            key={n}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: n <= current ? 'var(--terracotta)' : 'var(--border)',
              transition: 'background 0.2s',
            }}
          />
        ))}
      </div>
    )
  }

  // ─── Screens ───────────────────────────────────────────────────────────────

  if (screen === 'init') {
    return (
      <div style={{ ...SCREEN }}>
        <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--terracotta)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (screen === 'welcome') {
    return (
      <div style={{ ...SCREEN }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <p style={EYEBROW}>Ages 4 to 16 · One pathway</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 600, lineHeight: 1.2, color: 'var(--ink)', marginBottom: 20 }}>
            From their first screen to the moment they're ready for everything.
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 40 }}>
            Let's set this up around your child. Takes two minutes.
          </p>
          <button style={BTN} onClick={() => setScreen('name')}>
            Get started →
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'name') {
    const canContinue = true // name is optional but we can continue
    return (
      <div style={{ ...SCREEN }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          <ProgressDots current={1} />
          <div style={CARD}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 600, color: 'var(--ink)', marginBottom: 24, lineHeight: 1.2 }}>
              What's your child's name?
            </h2>
            <input
              ref={nameInputRef}
              className="input"
              value={childName}
              onChange={e => setChildName(e.target.value)}
              placeholder="Their first name"
              onKeyDown={e => { if (e.key === 'Enter' && canContinue) setScreen('age') }}
              style={{ marginBottom: 24, fontSize: 18 }}
            />
            <button style={BTN} onClick={() => setScreen('age')}>
              Next →
            </button>
          </div>
          <button
            onClick={() => setScreen('welcome')}
            style={{ display: 'block', width: '100%', marginTop: 16, background: 'none', border: 'none', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer', textAlign: 'center', padding: '8px 0' }}
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'age') {
    const firstName = childName.trim() || 'them'
    return (
      <div style={{ ...SCREEN }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          <ProgressDots current={2} />
          <div style={CARD}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 600, color: 'var(--ink)', marginBottom: 8, lineHeight: 1.2 }}>
              How old {firstName === 'them' ? 'are they' : `is ${firstName}`}?
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-muted)', marginBottom: 24 }}>
              This maps them to the right pathway stage.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {AGE_BAND_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setAgeBand(opt.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 16px',
                    border: `2px solid ${ageBand === opt.value ? 'var(--terracotta)' : 'var(--border)'}`,
                    borderRadius: 12,
                    background: ageBand === opt.value ? 'var(--terracotta-lt)' : '#fff',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, background 0.15s',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: `2px solid ${ageBand === opt.value ? 'var(--terracotta)' : 'var(--border)'}`,
                      background: ageBand === opt.value ? 'var(--terracotta)' : 'transparent',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {ageBand === opt.value && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{opt.label}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-muted)', marginTop: 1 }}>{opt.sub}</div>
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
            style={{ display: 'block', width: '100%', marginTop: 16, background: 'none', border: 'none', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer', textAlign: 'center', padding: '8px 0' }}
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'challenges') {
    const firstName = childName.trim() || 'your child'
    const canContinue = true // can continue even without selection
    return (
      <div style={{ ...SCREEN }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          <ProgressDots current={3} />
          <div style={CARD}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 600, color: 'var(--ink)', marginBottom: 8, lineHeight: 1.2 }}>
              What's hardest right now?
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-muted)', marginBottom: 24 }}>
              Pick as many as apply.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {CHALLENGES.map(c => {
                const selected = challenges.includes(c.id)
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleChallenge(c.id)}
                    style={{
                      padding: '13px 14px',
                      border: `2px solid ${selected ? 'var(--terracotta)' : 'var(--border)'}`,
                      borderRadius: 12,
                      background: selected ? 'var(--terracotta-lt)' : '#fff',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontWeight: selected ? 600 : 400,
                      fontSize: 14,
                      color: selected ? 'var(--terracotta)' : 'var(--ink)',
                      textAlign: 'center',
                      transition: 'border-color 0.15s, background 0.15s, color 0.15s',
                      lineHeight: 1.3,
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
            style={{ display: 'block', width: '100%', marginTop: 16, background: 'none', border: 'none', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer', textAlign: 'center', padding: '8px 0' }}
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'loading') {
    return (
      <div style={{ ...SCREEN, gap: 20 }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--terracotta)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-muted)', fontSize: 15 }}>Setting up your pathway...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (screen === 'digi-intro') {
    return (
      <div style={{ ...SCREEN }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          {/* DiGi avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              background: 'var(--terracotta)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 0 var(--terracotta-dark)',
            }}>
              <span style={{ fontSize: '1.4rem', lineHeight: 1, color: '#fff' }}>◎</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--ink)' }}>DiGi</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-muted)' }}>Your AI parenting advisor</div>
            </div>
          </div>

          <div style={CARD}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
              {digiData?.intro ?? 'Loading...'}
            </p>
          </div>

          <button
            style={{ ...BTN, marginTop: 20 }}
            onClick={() => setScreen('founding')}
          >
            Sounds good →
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'founding') {
    const remaining = founderSpots?.remaining ?? null
    const soldOut = founderSpots?.sold_out ?? false

    return (
      <div style={{ ...SCREEN }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          <p style={EYEBROW}>Founding members · 50 places</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 600, lineHeight: 1.2, color: 'var(--ink)', marginBottom: 20 }}>
            Be one of the first 50.
          </h1>

          <div style={CARD}>
            {!soldOut ? (
              <>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.65, color: 'var(--ink-soft)', marginBottom: 20 }}>
                  Founding members lock in £7.99 a month for life. The price never rises for you, even as the platform grows. 50 places only.
                </p>

                {/* Live counter */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--terracotta-lt)',
                  border: '1px solid var(--border)',
                  borderRadius: 100,
                  padding: '6px 14px',
                  marginBottom: 24,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--terracotta)' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: 'var(--terracotta)' }}>
                    {remaining !== null ? `${remaining} of 50 places left` : 'Loading availability...'}
                  </span>
                </div>

                <form action="/api/stripe/checkout" method="POST">
                  <input type="hidden" name="tier" value="founder" />
                  <button
                    type="submit"
                    style={{ ...BTN, marginBottom: 0 }}
                  >
                    Claim my founding place — £7.99/mo for life
                  </button>
                </form>
              </>
            ) : (
              <>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.65, color: 'var(--ink-soft)', marginBottom: 20 }}>
                  The 50 founding places have been claimed. You can still join at our standard rate.
                </p>
                <form action="/api/stripe/checkout" method="POST">
                  <input type="hidden" name="tier" value="standard" />
                  <button type="submit" style={{ ...BTN, marginBottom: 0 }}>
                    Join now
                  </button>
                </form>
              </>
            )}
          </div>

          <button
            onClick={() => setScreen('first-task')}
            style={{
              display: 'block',
              width: '100%',
              marginTop: 16,
              background: 'none',
              border: 'none',
              color: 'var(--ink-muted)',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              cursor: 'pointer',
              textAlign: 'center',
              padding: '10px 0',
              textDecoration: 'underline',
              textDecorationColor: 'var(--border)',
            }}
          >
            Maybe later
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'first-task') {
    const name = childName.trim() || 'your child'
    return (
      <div style={{ ...SCREEN }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 600, lineHeight: 1.2, color: 'var(--ink)', marginBottom: 24, textAlign: 'center' }}>
            Let's set tomorrow up.
          </h2>

          {digiData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* DiGi question */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
                  <span style={{ fontSize: '1rem', lineHeight: 1, color: '#fff' }}>◎</span>
                </div>
                <div style={{ ...CARD, flex: 1, padding: '16px 18px' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.6, color: 'var(--ink)', margin: 0 }}>
                    {digiData.taskQuestion}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div style={{ ...CARD, borderLeft: '3px solid var(--terracotta)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 8 }}>
                  Try this tomorrow
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.65, color: 'var(--ink-soft)', margin: 0 }}>
                  {digiData.taskAction}
                </p>
              </div>

              {/* Script */}
              <div style={{ ...CARD, background: 'var(--terracotta-lt)', border: '1px solid var(--border)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 8 }}>
                  Say this
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, lineHeight: 1.65, color: 'var(--ink)', margin: 0, fontStyle: 'italic' }}>
                  {digiData.taskScript}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--terracotta)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-muted)', fontSize: 14 }}>DiGi is preparing your first task...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          )}

          <button
            style={{ ...BTN, marginTop: 24 }}
            onClick={() => router.push('/dashboard')}
          >
            You're set for tomorrow →
          </button>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-muted)', textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
            DiGi will be there whenever you need it. Ask anything.
          </p>
        </div>
      </div>
    )
  }

  return null
}
