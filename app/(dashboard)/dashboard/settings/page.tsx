'use client'
import { useState, useEffect } from 'react'
import SchoolLink from '@/components/digi/SchoolLink'
import { DEFAULT_REGION, isRegion, REGION_LABEL, REGION_NOTE } from '@/lib/learning/region'
import type { Region } from '@/lib/learning/holidays'
import DeleteAccount from '@/components/settings/DeleteAccount'
import YourAgreements from '@/components/settings/YourAgreements'
import SettingsLinks from '@/components/settings/SettingsLinks'
import RemoveChild from '@/components/settings/RemoveChild'
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
  // Joining is when the Terms and the Privacy Policy were agreed: signup says
  // so in as many words, so there is no separate column to keep and no second
  // tick box to pretend is more meaningful than the first.
  created_at: string | null
  // Article 9 consent for the weekly check in, asked separately and shown
  // separately. Null before migration 120 has run, which reads the same as not
  // consented and is the safe way round.
  wellbeing_consent_at: string | null
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
  // Which school holiday calendar this family keeps. Lands with migration 129,
  // so it fails soft to England and the control hides until the column exists.
  const [region, setRegion] = useState<Region>(DEFAULT_REGION)
  const [regionSupported, setRegionSupported] = useState(true)
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
      // Same fail soft shape as the children read below: ask for the consent
      // column, and if migration 120 has not run here, drop back to the set
      // that has always existed rather than blanking the whole page.
      let [profileResult, childrenResult] = await Promise.all([
        supabase.from('profiles').select('full_name, email, subscription_status, subscription_tier, is_founder, created_at, wellbeing_consent_at, school_region').eq('id', user.id).single(),
        supabase.from('children').select('id, name, age_band, date_of_birth, interests, is_primary').eq('parent_id', user.id).order('is_primary', { ascending: false }),
      ])
      if (profileResult.error) {
        // school_region lands with 129 and wellbeing_consent_at with 120, so
        // step back one column at a time rather than blanking the whole page.
        const withConsent = await supabase.from('profiles').select('full_name, email, subscription_status, subscription_tier, is_founder, created_at, wellbeing_consent_at').eq('id', user.id).single() as typeof profileResult
        if (!withConsent.error) {
          profileResult = withConsent
          setRegionSupported(false)
        } else {
          profileResult = await supabase.from('profiles').select('full_name, email, subscription_status, subscription_tier, is_founder, created_at').eq('id', user.id).single() as typeof profileResult
          setRegionSupported(false)
        }
      }
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
        const p = profileResult.data as Partial<Profile>
        setProfile({
          full_name: p.full_name ?? null,
          email: p.email ?? null,
          subscription_status: p.subscription_status ?? 'free',
          subscription_tier: p.subscription_tier ?? null,
          is_founder: p.is_founder ?? false,
          created_at: p.created_at ?? null,
          wellbeing_consent_at: p.wellbeing_consent_at ?? null,
        })
        setName(p.full_name ?? '')
        const r = (p as { school_region?: unknown }).school_region
        if (isRegion(r)) setRegion(r)
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
    const patch: Record<string, unknown> = { full_name: name.trim() }
    if (regionSupported) patch.school_region = region
    const { error: err } = await supabase.from('profiles').update(patch).eq('id', user.id)
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
        <div style={{ background: 'var(--stage-1)', border: '1px solid var(--stage-1)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
          {error}
        </div>
      )}

      {/* Profile section */}
      <section style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: 'var(--text-md)', marginBottom: '18px', color: 'var(--ink)' }}>Your profile</h2>
        <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
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
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
              Email
            </label>
            <input
              className="input"
              value={profile?.email ?? ''}
              disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            />
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', marginTop: '4px' }}>
              To change your email, contact support.
            </p>
          </div>
          {/* School holidays. Two full sets of windows existed in the code and
              nothing could pick between them, so a family in the US quietly got
              English half terms: relaxed in late October while their child was
              at school, term time through the whole of Thanksgiving week.

              Never guessed from location. A holiday calendar chosen by IP is
              wrong for anyone travelling, on a VPN or living abroad, and it is
              wrong in the direction that changes a child's screen time without
              anybody asking. */}
          {regionSupported && (
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
                School holidays
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['uk', 'us'] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(r)}
                    aria-pressed={region === r}
                    style={{
                      padding: '10px 16px', borderRadius: 100, cursor: 'pointer',
                      border: `1.5px solid ${region === r ? 'var(--terracotta)' : 'var(--border)'}`,
                      background: region === r ? 'var(--terracotta-lt)' : '#fff',
                      fontFamily: 'var(--font-body)', fontSize: '15.5px', fontWeight: 700, color: 'var(--ink)',
                    }}
                  >
                    {REGION_LABEL[r]}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', marginTop: '8px', lineHeight: 1.5 }}>
                {REGION_NOTE[region]} It sets when the screen guide relaxes, and when saved holiday minutes can be spent.
              </p>
            </div>
          )}
          <button
            type="submit"
            className="btn btn-green"
            disabled={savingProfile}
            style={{ alignSelf: 'flex-start', padding: '10px 24px', fontSize: 'var(--text-md)' }}
          >
            {profileSaved ? 'Saved' : savingProfile ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </section>

      {/* Children: every child in the family, each with their own details.
          The birthday is the growing up switch: once set, the band and stage
          derive from it daily and the hand picked band below steps back. */}
      {/* Anchored so Everything else can land straight on the children,
          which is what a parent means by "child details". */}
      <div id="children" style={{ scrollMarginTop: 84 }} />
      {/* Said out loud, because a parent has no other way to check it and
          because DiGi counts these rows. When DiGi says "your two children" it
          is reading this list, so this is where you come to see whether the
          list is right. */}
      {kids.length > 1 && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 12px' }}>
          {kids.length} children on this account
        </p>
      )}
      {kids.map(kid => {
        const form = forms[kid.id]
        if (!form) return null
        const hasDob = dobSupported && !!form.dob
        const derivedBand = hasDob ? bandForAge(form.dob) : null
        return (
        <section key={kid.id} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: 'var(--text-md)', marginBottom: '18px', color: 'var(--ink)' }}>
            {kids.length > 1 ? (kid.name && kid.name !== 'Your child' ? kid.name : 'Your child') : 'Your child'}
          </h2>
          <form onSubmit={e => saveChild(e, kid.id)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
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
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
                What they love (optional)
              </label>
              <input
                className="input"
                value={form.interests}
                onChange={e => patchForm(kid.id, { interests: e.target.value })}
                placeholder="Football, singing, crafts..."
              />
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', marginTop: '4px' }}>
                DiGi turns this into a for you tip on their pathway: enjoy a little on the screen, then go and do the real thing.
              </p>
            </div>
            )}
            {dobSupported && (
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
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
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)' }}>
                  Rather not give the exact day? Month and year is plenty, we work from that.
                </span>
              </label>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', marginTop: '4px' }}>
                Set the birthday and everything grows up with them on its own.
              </p>
              {derivedBand && (
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginTop: '2px' }}>
                  From this birthday: {AGE_BAND_OPTIONS.find(o => o.value === derivedBand)?.label} · {AGE_BAND_OPTIONS.find(o => o.value === derivedBand)?.sub}
                </p>
              )}
            </div>
            )}
            {!hasDob && (
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>
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
                      <span style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>{opt.label}</span>
                      <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', marginTop: '1px' }}>{opt.sub}</span>
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
              style={{ alignSelf: 'flex-start', padding: '10px 24px', fontSize: 'var(--text-md)' }}
            >
              {form.saved ? 'Saved' : form.saving ? 'Saving...' : 'Save child details'}
            </button>
          </form>
          {/* Outside the form on purpose: removing a child is not a way of
              saving one, and a stray Enter must never reach it. */}
          <RemoveChild
            childId={kid.id}
            name={kid.name}
            isPrimary={kid.is_primary}
            siblingCount={kids.length}
            promoteToId={kids.find(k => k.id !== kid.id)?.id ?? null}
            onRemoved={id => {
              setKids(ks => {
                const left = ks.filter(k => k.id !== id)
                // Whoever we promoted in the database is promoted here too, so
                // the screen and the row agree without a reload.
                return kid.is_primary && left.length > 0
                  ? left.map((k, i) => i === 0 ? { ...k, is_primary: true } : k)
                  : left
              })
              setForms(f => { const { [id]: _gone, ...rest } = f; return rest })
            }}
          />
        </section>
        )
      })}

      {/* Billing section */}
      <section style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: 'var(--text-md)', marginBottom: '6px', color: 'var(--ink)' }}>Membership</h2>

        {isPaid ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, background: 'var(--stage-2)', color: 'var(--terracotta)', padding: '3px 10px', borderRadius: '100px' }}>
                {tierLabel} member
              </span>
              {profile?.is_founder && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>
                  Founder rate locked for life
                </span>
              )}
            </div>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
              Manage your subscription, update payment details, or download invoices through Stripe's secure billing portal.
            </p>
            <a
              href="/api/stripe/portal"
              className="btn btn-green"
              style={{ display: 'inline-block', padding: '10px 24px', fontSize: 'var(--text-md)', textDecoration: 'none' }}
            >
              Manage billing
            </a>
          </>
        ) : (
          <>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
              You are on the free plan. Upgrade to unlock all five stages, unlimited DiGi, and the full script library.
            </p>
            <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ display: 'inline-block', padding: '10px 24px', fontSize: 'var(--text-md)', textDecoration: 'none' }}>
              Upgrade now
            </Link>
          </>
        )}
      </section>

      {/* The way out to devices, notifications and the child app, none of
          which Settings holds itself and all of which parents come here
          looking for. */}
      <SettingsLinks />

      {/* What was agreed, when, and the button that takes the Article 9
          consent back. */}
      <YourAgreements joinedAt={profile?.created_at ?? null} consentAt={profile?.wellbeing_consent_at ?? null} />

      {/* Sign out */}
      <section id="sign-out" style={{ scrollMarginTop: 84, background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px' }}>
        <h2 style={{ fontSize: 'var(--text-md)', marginBottom: '6px', color: 'var(--ink)' }}>Sign out</h2>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-muted)', marginBottom: '16px' }}>
          You will be signed out on this device.
        </p>
        <button
          onClick={signOut}
          style={{
            background: 'none',
            border: '2px solid var(--border)',
            borderRadius: '16px',
            padding: '10px 24px',
            fontSize: 'var(--text-md)',
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

      <DeleteAccount />
    </div>
  )
}
