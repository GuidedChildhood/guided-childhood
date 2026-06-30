'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AGE_BAND_OPTIONS, getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import Link from 'next/link'

interface Profile {
  full_name: string | null
  email: string | null
  subscription_status: string
  subscription_tier: string | null
  is_founder: boolean
}

interface Child {
  id: string
  name: string
  age_band: string
}

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [child, setChild] = useState<Child | null>(null)
  const [loading, setLoading] = useState(true)

  // Profile form
  const [name, setName] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  // Child form
  const [childName, setChildName] = useState('')
  const [ageBand, setAgeBand] = useState<AgeBand>('8-10')
  const [savingChild, setSavingChild] = useState(false)
  const [childSaved, setChildSaved] = useState(false)

  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [profileResult, childResult] = await Promise.all([
        supabase.from('profiles').select('full_name, email, subscription_status, subscription_tier, is_founder').eq('id', user.id).single(),
        supabase.from('children').select('id, name, age_band').eq('parent_id', user.id).eq('is_primary', true).single(),
      ])

      if (profileResult.data) {
        setProfile(profileResult.data)
        setName(profileResult.data.full_name ?? '')
      }
      if (childResult.data) {
        setChild(childResult.data)
        setChildName(childResult.data.name)
        setAgeBand(childResult.data.age_band as AgeBand)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSavingProfile(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error: err } = await supabase.from('profiles').update({ full_name: name.trim() }).eq('id', user.id)
    if (err) { setError(err.message); setSavingProfile(false); return }
    setProfile(p => p ? { ...p, full_name: name.trim() } : p)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
    setSavingProfile(false)
  }

  async function saveChild(e: React.FormEvent) {
    e.preventDefault()
    if (!child) return
    setSavingChild(true)
    setError('')
    const stage = getStageFromAgeBand(ageBand)
    const { error: err } = await supabase
      .from('children')
      .update({ name: childName.trim() || 'Your child', age_band: ageBand, stage_id: stage.id })
      .eq('id', child.id)
    if (err) { setError(err.message); setSavingChild(false); return }
    setChild(c => c ? { ...c, name: childName.trim() || 'Your child', age_band: ageBand } : c)
    setChildSaved(true)
    setTimeout(() => setChildSaved(false), 2500)
    setSavingChild(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid var(--border)', borderTopColor: 'var(--terracotta)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const isPaid = profile?.subscription_status === 'active'
  const tierLabel = profile?.is_founder ? 'Founder' : profile?.subscription_tier === 'annual' ? 'Annual' : 'Monthly'

  return (
    <div style={{ maxWidth: '540px', margin: '0 auto', padding: '24px 20px 40px' }}>

      <div style={{ marginBottom: '28px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Your account</p>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', marginBottom: 0 }}>Settings</h1>
      </div>

      {error && (
        <div style={{ background: 'var(--stage-1)', border: '1px solid var(--stage-1)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: 'var(--ink)' }}>
          {error}
        </div>
      )}

      {/* Profile section */}
      <section style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '18px', color: 'var(--ink)' }}>Your profile</h2>
        <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
              Your name
            </label>
            <input
              className="input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
              Email
            </label>
            <input
              className="input"
              value={profile?.email ?? ''}
              disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            />
            <p style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '4px' }}>
              To change your email, contact support.
            </p>
          </div>
          <button
            type="submit"
            className="btn btn-green"
            disabled={savingProfile}
            style={{ alignSelf: 'flex-start', padding: '10px 24px', fontSize: '14px' }}
          >
            {profileSaved ? 'Saved' : savingProfile ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </section>

      {/* Child section */}
      {child && (
        <section style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '18px', color: 'var(--ink)' }}>Your child</h2>
          <form onSubmit={saveChild} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
                Child's name (optional)
              </label>
              <input
                className="input"
                value={childName}
                onChange={e => setChildName(e.target.value)}
                placeholder="Your child"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>
                Age band
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {AGE_BAND_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      border: `2px solid ${ageBand === opt.value ? 'var(--terracotta)' : 'var(--border)'}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      background: ageBand === opt.value ? 'var(--terracotta-lt)' : '#fff',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                  >
                    <input
                      type="radio"
                      name="age_band"
                      value={opt.value}
                      checked={ageBand === opt.value}
                      onChange={() => setAgeBand(opt.value)}
                      style={{ accentColor: 'var(--terracotta)' }}
                    />
                    <span style={{ flex: 1 }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{opt.label}</span>
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', marginTop: '1px' }}>{opt.sub}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-green"
              disabled={savingChild}
              style={{ alignSelf: 'flex-start', padding: '10px 24px', fontSize: '14px' }}
            >
              {childSaved ? 'Saved' : savingChild ? 'Saving...' : 'Save child details'}
            </button>
          </form>
        </section>
      )}

      {/* Billing section */}
      <section style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '6px', color: 'var(--ink)' }}>Membership</h2>

        {isPaid ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, background: 'var(--stage-2)', color: 'var(--terracotta)', padding: '3px 10px', borderRadius: '100px' }}>
                {tierLabel} member
              </span>
              {profile?.is_founder && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)' }}>
                  Founder rate locked for life
                </span>
              )}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
              Manage your subscription, update payment details, or download invoices through Stripe's secure billing portal.
            </p>
            <a
              href="/api/stripe/portal"
              className="btn btn-green"
              style={{ display: 'inline-block', padding: '10px 24px', fontSize: '14px', textDecoration: 'none' }}
            >
              Manage billing
            </a>
          </>
        ) : (
          <>
            <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
              You are on the free plan. Upgrade to unlock all five stages, unlimited DiGi, and the full script library.
            </p>
            <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ display: 'inline-block', padding: '10px 24px', fontSize: '14px', textDecoration: 'none' }}>
              Upgrade now
            </Link>
          </>
        )}
      </section>

      {/* Sign out */}
      <section style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '6px', color: 'var(--ink)' }}>Sign out</h2>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '16px' }}>
          You will be signed out on this device.
        </p>
        <button
          onClick={signOut}
          style={{
            background: 'none',
            border: '2px solid var(--border)',
            borderRadius: '12px',
            padding: '10px 24px',
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            color: 'var(--ink-muted)',
            cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </section>
    </div>
  )
}
