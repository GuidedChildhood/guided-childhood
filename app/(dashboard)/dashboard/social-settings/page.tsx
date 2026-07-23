import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'

// The per platform social media settings, delivered at the right age. The
// settings to lock on each app a UK family meets, kept in the database so they
// stay current as platforms rename and move their toggles. Guides for the
// child's stage lead; the rest sit below as a calm heads up of what is coming,
// so a parent always sees the whole map without being overwhelmed on day one.
//
// The honest line runs throughout: the minimum age is the platform's own
// account rule, never a readiness signal. Additive page, no redesign, same
// tokens as the rest of the dashboard.

export const metadata = { title: 'Social media settings — Guided Childhood' }

type Guide = {
  platform_key: string
  name: string
  emoji: string
  min_age: number
  first_seen_stage: number
  blurb: string
  settings: { name: string; how: string }[]
  watch_fors: string[]
  supervision: string
  official_url: string
}

export default async function SocialSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: child }, { data: guidesData }] = await Promise.all([
    supabase.from('children').select('name, age_band').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
    supabase.from('social_platform_guides').select('platform_key, name, emoji, min_age, first_seen_stage, blurb, settings, watch_fors, supervision, official_url').eq('active', true).order('first_seen_stage', { ascending: true }).order('sort_order', { ascending: true }),
  ])

  const childName = child?.name && child.name !== 'Your child' ? child.name : 'your child'
  const childStage = child?.age_band ? getStageFromAgeBand(child.age_band as AgeBand).id : 2
  const guides = (guidesData ?? []) as Guide[]
  const forNow = guides.filter(g => g.first_seen_stage <= childStage)
  const later = guides.filter(g => g.first_seen_stage > childStage)

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', marginBottom: '18px' }}>
        ← Home
      </Link>

      <p className="eyebrow" style={{ marginBottom: '4px' }}>Social media settings</p>
      <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '10px' }}>
        The settings to lock, app by app
      </h1>
      <p style={{ color: 'var(--ink-soft)', fontSize: '15px', lineHeight: 1.6, marginBottom: '16px' }}>
        The safety settings that do the quiet protecting on each app {childName} might meet, in the order they usually arrive. Walk them together when the time is right. DiGi keeps these current as the apps change.
      </p>

      <div style={{ background: 'var(--stage-1)', border: '1.5px solid var(--stage-1)', borderRadius: '14px', padding: '13px 16px', marginBottom: '26px' }}>
        <p style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
          <strong>One thing to hold onto.</strong> The minimum age on each app is the company's own account rule, not a sign a child is ready. Readiness is the child, the settings you lock, and the conversations you have.
        </p>
      </div>

      {forNow.length > 0 && (
        <>
          <SectionLabel eyebrow={`For ${childName}'s age`} title="Worth setting up around now" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: later.length > 0 ? '30px' : 0 }}>
            {forNow.map(g => <GuideCard key={g.platform_key} g={g} dim={false} />)}
          </div>
        </>
      )}

      {later.length > 0 && (
        <>
          <SectionLabel eyebrow="Coming later" title="Get to know these before they arrive" note="Not usually needed at this stage. Here so nothing is a surprise when it does come up." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {later.map(g => <GuideCard key={g.platform_key} g={g} dim={true} />)}
          </div>
        </>
      )}

      <Link href="/dashboard/lessons" style={{ textDecoration: 'none', display: 'block', marginTop: '28px' }}>
        <div style={{ background: 'var(--stage-3)', border: '1.5px solid var(--stage-3)', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '4px' }}>
              The lessons behind the settings
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
              Open the Social Media Ready module
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '4px' }}>
              The why underneath the toggles, taught as a ramp from what it is to taking the wheel at 16.
            </div>
          </div>
          <span style={{ fontSize: '18px', color: 'var(--ink-light)', flexShrink: 0 }}>→</span>
        </div>
      </Link>

      <p style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.6, margin: '18px 0 0', textAlign: 'center' }}>
        For the fullest step by step per app, Internet Matters, the NSPCC and Childnet keep guides that update the day a setting moves.
      </p>
    </div>
  )
}

function GuideCard({ g, dim }: { g: Guide; dim: boolean }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '16px 18px', opacity: dim ? 0.82 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span aria-hidden style={{ flexShrink: 0, width: 42, height: 42, borderRadius: '12px', background: 'var(--cream)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{g.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)' }}>{g.name}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)' }}>
              Account age {g.min_age}, not a readiness signal
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '5px 0 0' }}>{g.blurb}</p>
        </div>
      </div>

      <details style={{ marginTop: '12px' }}>
        <summary style={{ cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--terracotta-dark)', listStyle: 'none' }}>
          The settings to lock ({g.settings.length}) and what to watch for
        </summary>

        <div style={{ marginTop: '12px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
            Lock these
          </div>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {g.settings.map((s, i) => (
              <li key={i} style={{ display: 'flex', gap: '9px' }}>
                <span aria-hidden style={{ flexShrink: 0, width: 18, height: 18, borderRadius: '50%', background: 'var(--tint-sage)', color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, marginTop: 1 }}>{i + 1}</span>
                <span style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.5 }}>
                  <strong style={{ fontWeight: 800 }}>{s.name}.</strong> <span style={{ color: 'var(--ink-soft)' }}>{s.how}</span>
                </span>
              </li>
            ))}
          </ol>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '14px 0 7px' }}>
            Watch for
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {g.watch_fors.map((w, i) => (
              <li key={i} style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{w}</li>
            ))}
          </ul>

          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '12px', padding: '11px 13px', marginTop: '14px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '4px' }}>
              Parental tool
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>{g.supervision}</p>
          </div>

          <a href={g.official_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '13px', fontWeight: 700, color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
            Open the official settings page →
          </a>
        </div>
      </details>
    </div>
  )
}

function SectionLabel({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <div style={{ margin: '0 0 13px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '3px' }}>{eyebrow}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)' }}>{title}</div>
      {note && <p style={{ fontSize: '12.5px', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '3px 0 0' }}>{note}</p>}
    </div>
  )
}
