import { createClient } from '@/lib/supabase/server'
import { hasFullAccess } from '@/lib/access'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { SOCIAL_MEDIA_LAW } from '@/lib/config/social-media-law'
import ScriptDepth from '@/components/scripts/ScriptDepth'
import ScriptReader from '@/components/scripts/ScriptReader'
import RehearseWithDigi from '@/components/scripts/RehearseWithDigi'
import ScriptHelpPrompt from '@/components/scripts/ScriptHelpPrompt'
import { scriptVoiceUrl } from '@/lib/content/script-voice'
import { isScriptLocked } from '@/lib/content/free-script-limit'

const STAGE_META: Record<string, { label: string; color: string; bg: string }> = {
  foundation:  { label: 'Foundation · Ages 4 to 7',  color: 'var(--ink)', bg: 'var(--stage-1)' },
  builder:     { label: 'Builder · Ages 8 to 10',    color: 'var(--ink)', bg: 'var(--stage-2)' },
  explorer:    { label: 'Explorer · Ages 11 to 13',  color: 'var(--ink)', bg: 'var(--stage-3)' },
  shaper:      { label: 'Shaper · Ages 13 to 15',    color: 'var(--ink)', bg: 'var(--stage-4)' },
  independent: { label: 'Independent · Ages 16 and above', color: 'var(--ink)', bg: 'var(--stage-5)' },
}

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
    .select('subscription_status, trial_ends_at')
    .eq('id', user.id)
    .single()

  const isPaid = hasFullAccess(profile, user.email)

  const { data: script } = await supabase
    .from('scripts')
    .select('*')
    .eq('sort_order', sortOrder)
    .single() as { data: ScriptRow | null }

  if (!script) notFound()

  if (await isScriptLocked(supabase, user.id, isPaid, script)) {
    redirect('/dashboard/upgrade')
  }

  // The purpose of this tool is to find the script the moment you need
  // it, not to run a separate completion ritual. Opening it here IS
  // using it, so this is the one and only place completion gets marked
  // for the vast majority of visits (the deck flow marks it too, same
  // row, upsert makes either order safe). Never touches the worked
  // rating a parent may have already given.
  await supabase
    .from('script_completions')
    .upsert({ user_id: user.id, script_sort_order: sortOrder }, { onConflict: 'user_id,script_sort_order' })

  const stageMeta = STAGE_META[script.stage_id] ?? STAGE_META.foundation
  const showBanNote = script.law_flag !== 'none' && SOCIAL_MEDIA_LAW !== 'none'

  const [{ data: prevScript }, { data: nextScript }, { data: primaryChild }, { data: myCompletion }] = await Promise.all([
    supabase.from('scripts').select('sort_order, title').eq('sort_order', sortOrder - 1).maybeSingle(),
    supabase.from('scripts').select('sort_order, title').eq('sort_order', sortOrder + 1).maybeSingle(),
    supabase.from('children').select('id, name, phone').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
    supabase.from('script_completions').select('worked').eq('user_id', user.id).eq('script_sort_order', sortOrder).maybeSingle(),
  ])
  const workedRating = (myCompletion as { worked?: 'yes' | 'somewhat' | 'no' | null } | null)?.worked ?? null

  // Does this child have their own app (a kid link)? If so the note goes
  // straight to their phone and their app, not out over SMS.
  const { data: kidLink } = primaryChild?.id
    ? await supabase.from('kid_links').select('token').eq('child_id', primaryChild.id).maybeSingle()
    : { data: null }
  const childHasApp = Boolean((kidLink as { token?: string } | null)?.token)

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

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.9rem, 6vw, 2.6rem)', lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: '12px' }}>
          {script.title}
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '62ch' }}>
          {script.situation}
        </p>
      </div>

      {/* How completion works, stated plainly: reading it here IS the
          whole action, nothing else to click or tick */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'var(--tint-sage)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '10px 14px', marginBottom: '20px',
      }}>
        <span style={{ fontSize: '14px', color: 'var(--ink)' }}>✓</span>
        <span style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
          Marked as read, just by opening it. It counts on your path today and toward your free scripts, nothing else to click.
        </span>
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

      {/* The four core steps, led by the say-this hero: read it big, hear it
          aloud, then the supporting cards */}
      <div style={{ marginBottom: '28px' }}>
        <ScriptReader
          sayThis={script.say_this}
          notThis={script.not_this}
          whyItWorks={script.why_it_works}
          tonight={script.tonight}
          stageId={script.stage_id}
          voiceUrl={scriptVoiceUrl(sortOrder)}
        />
      </div>

      {/* Rehearse the words with DiGi before the real conversation */}
      <RehearseWithDigi
        scriptTitle={script.title}
        situation={script.situation}
        sayThis={script.say_this}
        notThis={script.not_this}
        childName={primaryChild?.name ?? null}
        isPaid={isPaid}
      />

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
        childId={primaryChild?.id ?? null}
        childHasApp={childHasApp}
        stageId={script.stage_id}
      />

      {/* Did it help? DiGi asks, and the answer shapes what it suggests next. */}
      <ScriptHelpPrompt sortOrder={sortOrder} initialWorked={workedRating} />

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

      {/* Turn the words into something that lasts: a shared family agreement */}
      <Link
        href="/dashboard/agreement"
        style={{
          display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none',
          background: 'var(--tint-sage)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '18px 20px', marginBottom: '24px',
        }}
      >
        <span style={{ fontSize: '22px', flexShrink: 0 }}>🤝</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)', marginBottom: '2px' }}>
            Make it a family agreement
          </div>
          <div style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
            Turn this conversation into a simple agreement you both sign, so the rule holds after the moment passes.
          </div>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--terracotta)', flexShrink: 0 }}>→</span>
      </Link>

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
