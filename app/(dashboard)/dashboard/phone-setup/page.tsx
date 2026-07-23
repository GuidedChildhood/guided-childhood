import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PHONE_LADDER } from '@/lib/content/passport'

// The first smartphone, our way. Not a brick phone, but a locked down phone
// released bit by bit, so the device becomes a tutor and a habit builder long
// before the stakes of social media. The science on when, our belief on how,
// the phone ladder, the per operating system setup, and the good first apps.
// Additive page, same tokens, no redesign.

export const metadata = { title: 'The first phone — Guided Childhood' }

type PhoneGuide = {
  os_key: string; name: string; emoji: string; blurb: string
  lockdown: { name: string; how: string }[]
  release: { name: string; how: string }[]
  time_management: string; parental_tool: string; official_url: string
}
type LearningApp = {
  app_key: string; name: string; emoji: string; teaches: string; why_good: string; from_age: string; url: string
}

export default async function PhoneSetupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: guidesData }, { data: appsData }] = await Promise.all([
    supabase.from('phone_setup_guides').select('os_key, name, emoji, blurb, lockdown, release, time_management, parental_tool, official_url').eq('active', true).order('sort_order', { ascending: true }),
    supabase.from('learning_apps').select('app_key, name, emoji, teaches, why_good, from_age, url').eq('active', true).order('sort_order', { ascending: true }),
  ])
  const guides = (guidesData ?? []) as PhoneGuide[]
  const apps = (appsData ?? []) as LearningApp[]

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', marginBottom: '18px' }}>
        ← Home
      </Link>

      <p className="eyebrow" style={{ marginBottom: '4px' }}>The first phone</p>
      <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '10px' }}>
        Not a brick phone. A phone you release, bit by bit.
      </h1>
      <p style={{ color: 'var(--ink-soft)', fontSize: '15px', lineHeight: 1.6, marginBottom: '18px' }}>
        The danger is the open, unmanaged phone, not the phone itself. Set up well, with safe settings and a small allowance, a phone teaches a child to stop, to ask, and to use good apps, and it can be a genuine tutor long before social media is anywhere near.
      </p>

      {/* Our belief, stated plainly */}
      <div style={{ background: 'var(--tint-sage)', border: '1.5px solid var(--tint-sage)', borderRadius: '16px', padding: '16px 18px', marginBottom: '26px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '7px' }}>
          Our belief
        </div>
        <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
          We do not push the brick phone. We start a real phone locked right down, hand back a little time and one more app as trust grows, and use the early apps to build good habits. Done this way, used correctly, a phone is one of the best educators a child has. When to start is about the child, not a birthday, but the conversation usually begins around 9 to 10, with independence, not apps, as the reason.
        </p>
      </div>

      {/* The phone ladder, from the passport */}
      <SectionLabel eyebrow="The ladder" title="What phone, at what age" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        {PHONE_LADDER.map((rung, i) => (
          <div key={i} style={{ display: 'flex', gap: '13px', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '13px 15px' }}>
            <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--terracotta-dark)', background: 'var(--terracotta-lt)', borderRadius: '100px', padding: '3px 9px', height: 'fit-content' }}>{rung.ages}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)', marginBottom: '2px' }}>{rung.device}</div>
              <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>{rung.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* The setup, per operating system */}
      <SectionLabel eyebrow="The setup" title="Lock it down, then release it" note="Start near brick, then hand back time and apps one step at a time. Choose the phone you have." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
        {guides.map(g => <PhoneCard key={g.os_key} g={g} />)}
      </div>

      {/* The learning apps */}
      {apps.length > 0 && (
        <>
          <SectionLabel eyebrow="The good first apps" title="Make the phone a tutor" note="The apps worth allowing first: easy to manage, no feeds, and they give back." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginBottom: '10px' }}>
            {apps.map(a => (
              <a key={a.app_key} href={a.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '14px 15px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '22px', lineHeight: 1 }}>{a.emoji}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.2 }}>{a.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--terracotta-dark)' }}>{a.teaches} · {a.from_age}</span>
                <span style={{ fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.4 }}>{a.why_good}</span>
              </a>
            ))}
          </div>
        </>
      )}

      <Link href="/dashboard/lessons" style={{ textDecoration: 'none', display: 'block', marginTop: '20px' }}>
        <div style={{ background: 'var(--stage-2)', border: '1.5px solid var(--stage-2)', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '4px' }}>
              Teach it, do not just set it
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
              The lessons on habits and balance
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '4px' }}>
              Why stopping feels hard and how to win at it, and the daily balance that makes a phone a good thing.
            </div>
          </div>
          <span style={{ fontSize: '18px', color: 'var(--ink-light)', flexShrink: 0 }}>→</span>
        </div>
      </Link>
    </div>
  )
}

function PhoneCard({ g }: { g: PhoneGuide }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span aria-hidden style={{ flexShrink: 0, width: 42, height: 42, borderRadius: '12px', background: 'var(--cream)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{g.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)' }}>{g.name}</span>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '4px 0 0' }}>{g.blurb}</p>
        </div>
      </div>

      <details style={{ marginTop: '12px' }}>
        <summary style={{ cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--terracotta-dark)', listStyle: 'none' }}>
          The full setup, lock down then release
        </summary>
        <div style={{ marginTop: '12px' }}>
          <StepList label="Start near brick" steps={g.lockdown} tint="var(--stage-1)" />
          <div style={{ height: '14px' }} />
          <StepList label="Then release, one step at a time" steps={g.release} tint="var(--tint-sage)" />

          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '12px', padding: '11px 13px', marginTop: '14px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '4px' }}>
              Time and earn back
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>{g.time_management}</p>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '12px 0 0' }}>{g.parental_tool}</p>
          <a href={g.official_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '13px', fontWeight: 700, color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
            Open the official setup page →
          </a>
        </div>
      </details>
    </div>
  )
}

function StepList({ label, steps, tint }: { label: string; steps: { name: string; how: string }[]; tint: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>{label}</div>
      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
        {steps.map((s, i) => (
          <li key={i} style={{ display: 'flex', gap: '9px' }}>
            <span aria-hidden style={{ flexShrink: 0, width: 18, height: 18, borderRadius: '50%', background: tint, color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, marginTop: 1 }}>{i + 1}</span>
            <span style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.5 }}>
              <strong style={{ fontWeight: 800 }}>{s.name}.</strong> <span style={{ color: 'var(--ink-soft)' }}>{s.how}</span>
            </span>
          </li>
        ))}
      </ol>
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
