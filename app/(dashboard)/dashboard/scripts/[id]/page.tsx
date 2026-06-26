import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const STAGE_META = {
  foundation:  { num: 1, label: 'Foundation',  ages: 'Ages 4 to 7',       color: 'var(--green-dark)', bg: 'var(--green-lt)' },
  builder:     { num: 2, label: 'Builder',     ages: 'Ages 8 to 10',      color: 'var(--lav-deep)',   bg: 'var(--lav)' },
  explorer:    { num: 3, label: 'Explorer',    ages: 'Ages 11 to 13',     color: 'var(--coral)',      bg: 'var(--coral-lt)' },
  shaper:      { num: 4, label: 'Shaper',      ages: 'Ages 13 to 15',     color: 'var(--gold-dark)',  bg: 'var(--gold-lt)' },
  independent: { num: 5, label: 'Independent', ages: 'Ages 16 and above', color: 'var(--ink-soft)',   bg: 'var(--warm)' },
} as const

type StageId = keyof typeof STAGE_META

type Script = {
  id: string
  stage_id: StageId
  title: string
  situation: string
  say_this: string
  not_this: string
  why_it_works: string
  tonight: string
  is_free: boolean
}

export default async function ScriptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Row level security means this query only returns the script if it is free,
  // or if this member has an active subscription. A free member who guesses a
  // paid script id simply gets no row back, so we show the gentle paywall below.
  const { data: scriptData } = await supabase
    .from('scripts')
    .select('id, stage_id, title, situation, say_this, not_this, why_it_works, tonight, is_free')
    .eq('id', id)
    .maybeSingle()

  const script = scriptData as Script | null

  if (!script) {
    return (
      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '24px 20px' }}>
        <Link href="/dashboard/scripts" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none' }}>
          Back to scripts
        </Link>
        <div style={{ marginTop: '20px', background: 'var(--warm)', border: '2px dashed var(--border)', borderRadius: '16px', padding: '28px 22px', textAlign: 'center' }}>
          <div style={{ fontSize: '26px', marginBottom: '12px' }}>🔒</div>
          <h1 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>This script is part of membership</h1>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '18px' }}>
            You are on the free plan. Membership opens the full library of 100 plus scripts, for every stage from 4 to 16.
          </p>
          <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ display: 'inline-flex' }}>
            See membership
          </Link>
        </div>
      </div>
    )
  }

  const meta = STAGE_META[script.stage_id]

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', padding: '24px 20px' }}>
      <Link href="/dashboard/scripts" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none' }}>
        Back to scripts
      </Link>

      <div style={{ margin: '16px 0 8px' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: meta.color, background: meta.bg, padding: '4px 10px', borderRadius: '100px',
        }}>
          Stage {meta.num}: {meta.label}
        </span>
        <span style={{ marginLeft: '8px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {meta.ages}
        </span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', marginBottom: '20px' }}>{script.title}</h1>

      {/* The moment */}
      <Section eyebrow="The moment">
        <p style={{ fontSize: '16px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{script.situation}</p>
      </Section>

      {/* Say this */}
      <div style={{ background: 'var(--green-lt)', border: '1px solid var(--green)', borderRadius: '16px', padding: '20px 22px', marginBottom: '14px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green-dark)', marginBottom: '10px' }}>
          Try saying this
        </p>
        <p style={{ fontSize: '17px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.6 }}>{script.say_this}</p>
      </div>

      {/* Not this */}
      <div style={{ background: 'var(--coral-lt)', border: '1px solid var(--coral)', borderRadius: '16px', padding: '20px 22px', marginBottom: '14px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: '10px' }}>
          Try not to say
        </p>
        <p style={{ fontSize: '16px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{script.not_this}</p>
      </div>

      {/* Why it works */}
      <Section eyebrow="Why it works">
        <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{script.why_it_works}</p>
      </Section>

      {/* Tonight */}
      <div style={{ background: 'var(--gold-lt)', border: '1px solid var(--gold)', borderRadius: '16px', padding: '20px 22px', marginBottom: '20px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '10px' }}>
          One thing to try tonight
        </p>
        <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.6 }}>{script.tonight}</p>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--ink-muted)', fontStyle: 'italic', textAlign: 'center', marginBottom: '20px' }}>
        There are no perfect scripts, only honest conversations. Make these words your own.
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href={`/dashboard/digi?q=${encodeURIComponent(`Help me with this conversation: ${script.title}`)}`}
          className="btn btn-gold"
          style={{ padding: '11px 22px', fontSize: '12px' }}
        >
          Talk it through with DiGi
        </Link>
        <Link href="/dashboard/scripts" className="btn btn-outline" style={{ padding: '11px 22px', fontSize: '12px' }}>
          Back to all scripts
        </Link>
      </div>
    </div>
  )
}

function Section({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: '8px' }}>
        {eyebrow}
      </p>
      {children}
    </div>
  )
}
