import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { SOCIAL_MEDIA_LAW } from '@/lib/config/social-media-law'
import ScriptDepth from '@/components/scripts/ScriptDepth'
import { isScriptLocked } from '@/lib/content/free-script-limit'

const STAGE_META: Record<string, { label: string; color: string; bg: string }> = {
  foundation:  { label: 'Foundation · Ages 4 to 7',  color: 'var(--ink)', bg: 'var(--stage-1)' },
  builder:     { label: 'Builder · Ages 8 to 10',    color: 'var(--ink)', bg: 'var(--stage-2)' },
  explorer:    { label: 'Explorer · Ages 11 to 13',  color: 'var(--ink)', bg: 'var(--stage-3)' },
  shaper:      { label: 'Shaper · Ages 13 to 15',    color: 'var(--ink)', bg: 'var(--stage-4)' },
  independent: { label: 'Independent · Ages 16 and above', color: 'var(--ink)', bg: 'var(--stage-5)' },
}

const STEPS = [
  { num: 1, key: 'say_this',     label: 'Say this',      accent: 'var(--terracotta)', bg: 'var(--stage-2)',  border: 'var(--stage-2)' },
  { num: 2, key: 'not_this',     label: 'Not this',      accent: 'var(--danger)',           bg: 'var(--danger-bg)',         border: 'var(--danger-border)' },
  { num: 3, key: 'why_it_works', label: 'Why it works',  accent: 'var(--terracotta)', bg: 'var(--stage-3)', border: 'var(--stage-3)' },
  { num: 4, key: 'tonight',      label: 'Tonight',       accent: 'var(--terracotta)', bg: 'var(--stage-5)',  border: 'var(--stage-5)' },
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
  if_they_push_back: string | null
  check_back: string | null
  for_your_child: string | null
}

export default async function ScriptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sortOrder = parseInt(id, 10)
  if (isNaN(sortOrder) || sortOrder < 1) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  const isPaid = profile?.subscription_status === 'active'

  const { data: script } = await supabase
    .from('scripts')
    .select('*')
    .eq('sort_order', sortOrder)
    .single() as { data: ScriptRow | null }

  if (!script) notFound()

  if (await isScriptLocked(supabase, user.id, isPaid, script)) {
    redirect('/dashboard/upgrade')
  }

  const stageMeta = STAGE_META[script.stage_id] ?? STAGE_META.foundation
  const showBanNote = script.law_flag !== 'none' && SOCIAL_MEDIA_LAW !== 'none'

  const [{ data: prevScript }, { data: nextScript }, { data: primaryChild }] = await Promise.all([
    supabase.from('scripts').select('sort_order, title').eq('sort_order', sortOrder - 1).maybeSingle(),
    supabase.from('scripts').select('sort_order, title').eq('sort_order', sortOrder + 1).maybeSingle(),
    supabase.from('children').select('name, phone').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
  ])

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 20px 48px' }}>

      {/* Back */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
        <Link
          href="/dashboard/scripts"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
        >
          ← All scripts
        </Link>
        <Link
          href={`/dashboard/scripts/${sortOrder}/deck`}
          className="btn btn-green"
          style={{ padding: '8px 16px', fontSize: '11px' }}
        >
          Try as deck
        </Link>
      </div>

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
          {script.is_free && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--terracotta)', background: 'var(--stage-2)',
              padding: '4px 10px', borderRadius: '100px', border: '1px solid var(--stage-2)',
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
          background: 'var(--stage-5)', border: '2px solid var(--stage-5)',
          borderRadius: '14px', padding: '16px 18px', marginBottom: '24px',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
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
                background: step.key === 'not_this' ? 'var(--danger)' : step.accent, color: '#fff',
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
                {step.key === 'say_this' ? (
                  <p style={{
                    fontSize: 'clamp(1.1rem, 3vw, 1.25rem)',
                    fontWeight: 700,
                    color: 'var(--ink)',
                    lineHeight: 1.55,
                    fontFamily: 'var(--font-display)',
                  }}>
                    &ldquo;{content}&rdquo;
                  </p>
                ) : step.key === 'not_this' ? (
                  <p style={{ fontSize: '15px', color: 'var(--danger)', lineHeight: 1.65, fontStyle: 'italic' }}>
                    &ldquo;{content}&rdquo;
                  </p>
                ) : (
                  <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.65, ...(step.key === 'tonight' ? { fontWeight: 500 } : {}) }}>
                    {content}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* The deeper half: push back, check back, and the note for the child */}
      <ScriptDepth
        sortOrder={sortOrder}
        initial={{
          ifTheyPushBack: script.if_they_push_back ?? undefined,
          checkBack: script.check_back ?? undefined,
          forYourChild: script.for_your_child ?? undefined,
        }}
        childName={primaryChild?.name ?? null}
        childPhone={primaryChild?.phone ?? null}
        stageId={script.stage_id}
      />

      {/* DiGi CTA */}
      <div style={{
        background: 'var(--stage-5)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '22px',
        marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--terracotta)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
            DiGi
          </div>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
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

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {prevScript ? (
          <Link
            href={`/dashboard/scripts/${prevScript.sort_order}`}
            style={{ flex: 1, padding: '14px 16px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '12px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-light)' }}>← Previous</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prevScript.title}</span>
          </Link>
        ) : (
          <Link
            href="/dashboard/scripts"
            style={{ flex: 1, padding: '14px 16px', background: 'var(--stage-2)', border: '1px solid var(--stage-2)', borderRadius: '12px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>All topics</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--terracotta)' }}>Back to scripts</span>
          </Link>
        )}

        {nextScript && (
          <Link
            href={`/dashboard/scripts/${nextScript.sort_order}`}
            style={{ flex: 1, padding: '14px 16px', background: 'var(--stage-2)', border: '1px solid var(--stage-2)', borderRadius: '12px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right', minWidth: 0 }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>Next →</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--terracotta)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nextScript.title}</span>
          </Link>
        )}
      </div>

    </div>
  )
}
