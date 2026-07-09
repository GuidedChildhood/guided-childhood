import { createClient } from '@/lib/supabase/server'
import { hasFullAccess } from '@/lib/access'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { CATEGORY_META } from '../../page'

const STAGE_LABELS: Record<string, string> = {
  foundation:  'Ages 4 to 7',
  builder:     'Ages 8 to 10',
  explorer:    'Ages 11 to 13',
  shaper:      'Ages 13 to 15',
  independent: 'Ages 16 and up',
}

const STAGE_COLORS: Record<string, { color: string; bg: string }> = {
  foundation:  { color: 'var(--ink)', bg: 'var(--stage-1)' },
  builder:     { color: 'var(--ink)', bg: 'var(--stage-2)' },
  explorer:    { color: 'var(--ink)', bg: 'var(--stage-3)' },
  shaper:      { color: 'var(--ink)', bg: 'var(--stage-4)' },
  independent: { color: 'var(--ink)', bg: 'var(--stage-5)' },
}

type ScriptRow = {
  sort_order: number
  title: string
  situation: string
  stage_id: string
  is_free: boolean
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const meta = CATEGORY_META[slug]
  if (!meta) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, trial_ends_at')
    .eq('id', user.id)
    .single()

  const isPaid = hasFullAccess(profile)

  const { data: completionRows } = await supabase
    .from('script_completions')
    .select('script_sort_order')
    .eq('user_id', user.id)

  const completedSet = new Set((completionRows ?? []).map(r => r.script_sort_order))

  const { data: scripts } = await supabase
    .from('scripts')
    .select('sort_order, title, situation, stage_id, is_free')
    .eq('category', slug)
    .order('sort_order') as { data: ScriptRow[] | null }

  if (!scripts || scripts.length === 0) notFound()

  const completedCount = scripts.filter(s => completedSet.has(s.sort_order)).length

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 20px 48px' }}>

      <Link
        href="/dashboard/scripts"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'none', marginBottom: '24px', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
      >
        ← All topics
      </Link>

      {/* Category header */}
      <div style={{
        background: meta.bg,
        border: `1.5px solid ${meta.border}`,
        borderRadius: '18px',
        overflow: 'hidden',
        marginBottom: '24px',
      }}>
        <div style={{ background: meta.accent, padding: '16px 22px' }}>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.3rem, 4vw, 1.7rem)', margin: 0, letterSpacing: '-0.02em' }}>
            {meta.label}
          </h1>
        </div>
        <div style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', margin: 0 }}>{meta.description}</p>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: meta.accent, letterSpacing: '0.06em' }}>
            {completedCount} of {scripts.length} done
          </span>
        </div>
      </div>

      {/* Progress bar */}
      {scripts.length > 0 && (
        <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.round((completedCount / scripts.length) * 100)}%`,
            background: meta.accent,
            borderRadius: '2px',
            transition: 'width 0.4s ease',
          }} />
        </div>
      )}

      {/* Script cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {scripts.map(script => {
          const isLocked = !isPaid && !script.is_free
          const isDone = completedSet.has(script.sort_order)
          const stageColor = STAGE_COLORS[script.stage_id] ?? STAGE_COLORS.foundation
          return (
            <div
              key={script.sort_order}
              style={{
                background: isDone ? 'var(--stage-2)' : 'var(--cream)',
                border: `1.5px solid ${isDone ? 'var(--stage-2)' : 'var(--border)'}`,
                borderRadius: '16px',
                padding: '18px 20px',
                opacity: isLocked ? 0.7 : 1,
              }}
            >
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: stageColor.color, background: stageColor.bg,
                  padding: '3px 8px', borderRadius: '100px',
                }}>
                  {STAGE_LABELS[script.stage_id] ?? script.stage_id}
                </span>
                {isDone && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--terracotta)', background: 'var(--stage-2)',
                    padding: '3px 8px', borderRadius: '100px', border: '1px solid var(--stage-2)',
                  }}>
                    Done
                  </span>
                )}
                {isLocked && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '9px',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--ink-light)', background: 'var(--cream)',
                    padding: '3px 8px', borderRadius: '100px', border: '1px solid var(--border)',
                  }}>
                    Locked
                  </span>
                )}
              </div>

              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)', marginBottom: '6px' }}>
                {script.title}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--ink-muted)', fontStyle: 'italic', margin: '0 0 14px' }}>
                {script.situation}
              </p>

              {isLocked ? (
                <Link
                  href="/dashboard/upgrade"
                  className="btn btn-gold"
                  style={{ display: 'inline-flex', padding: '9px 18px', fontSize: '11px' }}
                >
                  Unlock
                </Link>
              ) : (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Link
                    href={`/dashboard/scripts/${script.sort_order}/deck`}
                    className="btn btn-green"
                    style={{ padding: '9px 18px', fontSize: '11px' }}
                  >
                    {isDone ? 'Read again' : 'Start deck'}
                  </Link>
                  <Link
                    href={`/dashboard/digi?q=${encodeURIComponent(`Help me with: ${script.title}`)}`}
                    style={{
                      padding: '9px 18px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: 'var(--terracotta)',
                      background: 'var(--stage-5)',
                      border: '1px solid var(--stage-5)',
                      borderRadius: 'var(--radius-btn)',
                      textDecoration: 'none',
                    }}
                  >
                    Ask DiGi
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}
