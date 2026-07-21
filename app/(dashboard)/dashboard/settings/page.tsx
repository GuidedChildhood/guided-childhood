'use client'
import { useState, useEffect } from 'react'
import SchoolLink from '@/components/digi/SchoolLink'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AGE_BAND_OPTIONS, getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { bandForAge } from '@/lib/children/age'
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
  date_of_birth: string | null
  interests: string | null
  is_primary: boolean
}

interface ChildForm {
  name: string
  ageBand: AgeBand
  dob: string
  // What this child loves, so DiGi can point screens back at the real world:
  // a short free text (football, singing, crafts) that becomes a "for you"
  // tip on their pathway.
  interests: string
  // Month and year is plenty to work from: the toggle swaps the input to a
  // month picker and the save lands on the first of that month.
  monthOnly: boolean
  saving: boolean
  saved: boolean
}

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [kids, setKids] = useState<Child[]>([])
  const [forms, setForms] = useState<Record<string, ChildForm>>({})
  // False when migration 083 has not run yet: the birthday field hides and
  // saves write the same columns they always did.
  const [dobSupported, setDobSupported] = useState(true)
  // False before migration 088: the interests field hides and saves skip it.
  const [interestsSupported, setInterestsSupported] = useState(true)
  const [loading, setLoading] = useState(true)

  // Profile form
  const [name, setName] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      // date_of_birth arrives with migration 083. Until that runs, the
      // column select fails, so we fail soft: load without it and the
      // birthday field simply waits. Nothing breaks either side of the
      // migration landing.
      // Cascade the child read so each new column fails soft on its own:
      // first the full set (with birthday and interests), then drop interests
      // if 088 has not run, then drop the birthday too if 083 has not run.
      let [profileResult, childrenResult] = await Promise.all([
        supabase.from('profiles').select('full_name, email, subscription_status, subscription_tier, is_founder').eq('id', user.id).single(),
        supabase.from('children').select('id, name, age_band, date_of_birth, interests, is_primary').eq('parent_id', user.id).order('is_primary', { ascending: false }),
      ])
      if (childrenResult.error) {
        const withDob = await supabase.from('children').select('id, name, age_band, date_of_birth, is_primary').eq('parent_id', user.id).order('is_primary', { ascending: false }) as typeof childrenResult
        if (!withDob.error) {
          childrenResult = withDob
          setInterestsSupported(false)
        } else {
          childrenResult = await supabase.from('children').select('id, name, age_band, is_primary').eq('parent_id', user.id).order('is_primary', { ascending: false }) as typeof childrenResult
          setDobSupported(false)
          setInterestsSupported(false)
        }
      }

      if (profileResult.data) {
        setProfile(profileResult.data)
        setName(profileResult.data.full_name ?? '')
      }
      const loadedKids = ((childrenResult.data ?? []) as Partial<Child>[]).map(k => ({
        id: k.id as string,
        name: k.name ?? 'Your child',
        age_band: k.age_band ?? '8-10',
        date_of_birth: k.date_of_birth ?? null,
        interests: k.interests ?? null,
        is_primary: k.is_primary ?? false,
      })) as Child[]
      setKids(loadedKids)
      setForms(Object.fromEntries(loadedKids.map(k => [k.id, {
        name: k.name === 'Your child' ? '' : k.name,
        ageBand: (k.age_band as AgeBand) || '8-10',
        dob: k.date_of_birth ?? '',
        interests: k.interests ?? '',
        monthOnly: false,
        saving: false,
        saved: false,
      }])))
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

  function patchForm(id: string, patch: Partial<ChildForm>) {
    setForms(f => ({ ...f, [id]: { ...f[id], ...patch } }))
  }

  async function saveChild(e: React.FormEvent, id: string) {
    e.preventDefault()
    const form = forms[id]
    if (!form) return
    patchForm(id, { saving: true })
    setError('')
    // A birthday takes over: the band and stage derive from it, today and
    // every day after, so everything grows up on its own. Without one, the
    // hand picked band stands. stage_id stores the stage slug (foundation,
    // builder, ...), the same value onboarding writes.
    // A month only birthday lands on the first of that month: month and year
    // is plenty to derive the band and grow the stage from.
    const dobFull = form.dob ? (form.dob.length === 7 ? `${form.dob}-01` : form.dob) : ''
    const band = (dobSupported ? bandForAge(dobFull || null) : null) ?? form.ageBand
    const stage = getStageFromAgeBand(band)
    const update: Record<string, string | null> = {
      name: form.name.trim() || 'Your child',
      age_band: band,
      stage_id: stage.name.toLowerCase(),
    }
    if (dobSupported) update.date_of_birth = dobFull || null
    if (interestsSupported) update.interests = form.interests.trim() || null
    const { error: err } = await supabase
      .from('children')
      .update(update)
      .eq('id', id)
    if (err) { setError(err.message); patchForm(id, { saving: false }); return }
    setKids(ks => ks.map(k => k.id === id ? { ...k, name: form.name.trim() || 'Your child', age_band: band, date_of_birth: dobFull || null, interests: form.interests.trim() || null } : k))
    patchForm(id, { saving: false, saved: true, ageBand: band })
    setTimeout(() => patchForm(id, { saved: false }), 2500)
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
        <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 0 }}>Settings</h1>
      </div>

      {error && (
        <div style={{ background: 'var(--stage-1)', border: '1px solid var(--stage-1)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: 'var(--ink)' }}>
          {error}
        </div>
      )}

      {/* Profile section */}
      <section style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
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

      {/* Children: every child in the family, each with their own details.
          The birthday is the growing up switch: once set, the band and stage
          derive from it daily and the hand picked band below steps back. */}
      {kids.map(kid => {
        const form = forms[kid.id]
        if (!form) return null
        const hasDob = dobSupported && !!form.dob
        const derivedBand = hasDob ? bandForAge(form.dob) : null
        return (
        <section key={kid.id} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '18px', color: 'var(--ink)' }}>
            {kids.length > 1 ? (kid.name && kid.name !== 'Your child' ? kid.name : 'Your child') : 'Your child'}
          </h2>
          <form onSubmit={e => saveChild(e, kid.id)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
                Child's name (optional)
              </label>
              <input
                className="input"
                value={form.name}
                onChange={e => patchForm(kid.id, { name: e.target.value })}
                placeholder="Your child"
              />
            </div>
            {interestsSupported && (
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
                What they love (optional)
              </label>
              <input
                className="input"
                value={form.interests}
                onChange={e => patchForm(kid.id, { interests: e.target.value })}
                placeholder="Football, singing, crafts..."
              />
              <p style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '4px' }}>
                DiGi turns this into a for you tip on their pathway: enjoy a little on the screen, then go and do the real thing.
              </p>
            </div>
            )}
            {dobSupported && (
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
                Birthday
              </label>
              <input
                className="input"
                type={form.monthOnly ? 'month' : 'date'}
                value={form.monthOnly ? form.dob.slice(0, 7) : form.dob}
                onChange={e => patchForm(kid.id, { dob: e.target.value })}
                max={new Date().toISOString().slice(0, form.monthOnly ? 7 : 10)}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '7px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.monthOnly}
                  onChange={e => patchForm(kid.id, { monthOnly: e.target.checked, dob: form.dob.slice(0, e.target.checked ? 7 : 10) })}
                />
                <span style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>
                  Rather not give the exact day? Month and year is plenty, we work from that.
                </span>
              </label>
              <p style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '4px' }}>
                Set the birthday and everything grows up with them on its own.
              </p>
              {derivedBand && (
                <p style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '2px' }}>
                  From this birthday: {AGE_BAND_OPTIONS.find(o => o.value === derivedBand)?.label} · {AGE_BAND_OPTIONS.find(o => o.value === derivedBand)?.sub}
                </p>
              )}
            </div>
            )}
            {!hasDob && (
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
                      border: `2px solid ${form.ageBand === opt.value ? 'var(--terracotta)' : 'var(--border)'}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      background: form.ageBand === opt.value ? 'var(--terracotta-lt)' : 'var(--cream)',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                  >
                    <input
                      type="radio"
                      name={`age_band_${kid.id}`}
                      value={opt.value}
                      checked={form.ageBand === opt.value}
                      onChange={() => patchForm(kid.id, { ageBand: opt.value })}
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
            )}
            <button
              type="submit"
              className="btn btn-green"
              disabled={form.saving}
              style={{ alignSelf: 'flex-start', padding: '10px 24px', fontSize: '14px' }}
            >
              {form.saved ? 'Saved' : form.saving ? 'Saving...' : 'Save child details'}
            </button>
          </form>
        </section>
        )
      })}

      {/* Billing section */}
      <section style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
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
      <section style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '6px', color: 'var(--ink)' }}>Sign out</h2>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '16px' }}>
          You will be signed out on this device.
        </p>
        <button
          onClick={signOut}
          style={{
            background: 'none',
            border: '2px solid var(--border)',
            borderRadius: '16px',
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

      <section style={{ marginTop: '24px' }}>
        <SchoolLink />
      </section>
    </div>
  )
}
