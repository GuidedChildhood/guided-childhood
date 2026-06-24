import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { SOCIAL_MEDIA_LAW } from '@/lib/config/social-media-law'

const FREE_SORT_ORDERS = [1, 2, 3]

const STAGE_META: Record<string, { label: string; color: string; bg: string }> = {
  foundation:  { label: 'Foundation · Ages 4–7',  color: 'var(--green-dark)', bg: 'var(--green-lt)' },
  builder:     { label: 'Builder · Ages 8–10',    color: 'var(--lav-deep)',   bg: 'var(--lav)' },
  explorer:    { label: 'Explorer · Ages 11–13',  color: 'var(--coral)',      bg: 'var(--coral-lt)' },
  shaper:      { label: 'Shaper · Ages 13–15',    color: 'var(--gold-dark)',  bg: 'var(--gold-lt)' },
  independent: { label: 'Independent · Ages 16+', color: 'var(--ink-soft)',   bg: 'var(--warm)' },
}

const STEPS = [
  { num: 1, key: 'say_this',     label: 'Say this',      accent: 'var(--green-dark)', bg: 'var(--green-lt)',  border: 'var(--green-b)' },
  { num: 2, key: 'not_this',     label: 'Not this',      accent: 'var(--coral)',      bg: 'var(--coral-lt)', border: 'var(--coral)' },
  { num: 3, key: 'why_it_works', label: 'Why it works',  accent: 'var(--lav-deep)',   bg: 'var(--lav)',      border: '#b8c8f0' },
  { num: 4, key: 'tonight',      label: 'Tonight',       accent: 'var(--gold-dark)',  bg: 'var(--gold-lt)',  border: 'var(--gold)' },
] as const

type ScriptRow = {
  id: string
  stage_id: string
  title: string
  situation: string
  say_this: string
  not_this: string
  why_it_works: string
  tonight: string
  law_flag: string
  is_free: boolean
  sort_order: number
}

export default async function ScriptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sortOrder = parseInt(id, 10)
  if (isNaN(sortOrder) || sortOrder < 1 || sortOrder > 17) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  const isPaid = profile?.subscription_status === 'active'
  const isFreeScript = FREE_SORT_ORDERS.includes(sortOrder)

  if (!isPaid && !isFreeScript) {
    redirect('/dashboard/upgrade')
  }

  const { data: script } = await supabase
    .from('scripts')
    .select('*')
    .eq('sort_order', sortOrder)
    .single() as { data: ScriptRow | null }

  if (!script) notFound()

  const stageMeta = STAGE_META[script.stage_id] ?? STAGE_META.foundation
  const showBanNote = script.law_flag !== 'none' && SOCIAL_MEDIA_LAW !== 'none'

  const prev = sortOrder > 1 ? sortOrder - 1 : null
  const next = sortOrder < 17 ? sortOrder + 1 : null

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 20px 48px' }}>

      {/* Back */}
      <Link
        href="/dashboard/scripts"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'none', marginBottom: '24px', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
      >
        ← All scripts
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: stageMeta.color, background: stageMeta.bg,
            padding: '4px 10px', borderRadius: '100px',
          }}>
            {stageMeta.label}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--ink-light)', background: 'var(--warm)',
            padding: '4px 10px', borderRadius: '100px', border: '1px solid var(--border)',
          }}>
            Script #{sortOrder} of 17
          </span>
          {isFreeScript && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--green-dark)', background: 'var(--green-lt)',
              padding: '4px 10px', borderRadius: '100px', border: '1px solid var(--green-b)',
            }}>
              Free
            </span>
          )}
        </div>

        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '10px' }}>
          {script.title}
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
          {script.situation}
        </p>
      </div>

      {/* Ban world note */}
      {showBanNote && (
        <div style={{
          background: 'var(--gold-lt)', border: '2px solid var(--gold)',
          borderRadius: '14px', padding: '16px 18px', marginBottom: '24px',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '6px' }}>
            UK social media ban context
          </div>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
            This script is updated for the UK ban on social media for under-16s. The approach remains the same: relational, not restrictive. The law is the starting point for the conversation, not the end of it.
          </p>
        </div>
      )}

      {/* 4 steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
        {STEPS.map((step) => {
          const content = script[step.key]
          return (
            <div
              key={step.num}
              style={{
                background: step.bg,
                border: `1.5px solid ${step.border}`,
                borderRadius: '16px',
                padding: '22px',
                display: 'flex',
                gap: '18px',
              }}
            >
              {/* Number circle */}
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: step.accent, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: 800, flexShrink: 0,
                fontFamily: 'var(--font-display)',
              }}>
                {step.num}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: step.accent, marginBottom: '10px',
                }}>
                  {step.label}
                </div>
                <p style={{
                  fontSize: '15px', color: 'var(--ink)',
                  lineHeight: 1.65,
                  ...(step.key === 'say_this' ? { fontWeight: 500 } : {}),
                  ...(step.key === 'not_this' ? { color: 'var(--ink-soft)', fontStyle: 'italic' } : {}),
                }}>
                  {step.key === 'say_this' ? `"${content}"` : content}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* DiGi CTA */}
      <div style={{
        background: 'var(--ink)', borderRadius: '16px', padding: '22px',
        marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
            DiGi
          </div>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            Need help adapting this for your situation? Ask DiGi.
          </p>
        </div>
        <Link
          href={`/dashboard/digi?q=${encodeURIComponent(`I need help with the script: ${script.title}. My situation: `)}`}
          className="btn btn-gold"
          style={{ flexShrink: 0, padding: '11px 20px', fontSize: '12px' }}
        >
          Ask DiGi about this
        </Link>
      </div>

      {/* Prev / Next */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
        {prev ? (
          <Link
            href={`/dashboard/scripts/${prev}`}
            style={{ flex: 1, padding: '14px 18px', background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '12px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-light)' }}>← Previous</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>Script #{prev}</span>
          </Link>
        ) : <div style={{ flex: 1 }} />}

        {next ? (
          <Link
            href={`/dashboard/scripts/${next}`}
            style={{ flex: 1, padding: '14px 18px', background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '12px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-light)' }}>Next →</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>Script #{next}</span>
          </Link>
        ) : (
          <Link
            href="/dashboard/scripts"
            style={{ flex: 1, padding: '14px 18px', background: 'var(--green-lt)', border: '1px solid var(--green-b)', borderRadius: '12px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green-dark)' }}>All done</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green-dark)' }}>Back to scripts</span>
          </Link>
        )}
      </div>

    </div>
  )
}
