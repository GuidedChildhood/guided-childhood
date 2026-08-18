import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { getStageProgress, type StageId as ProgressStageId } from '@/lib/pathway/progress'
import { gatherChildPassportToDo } from '@/lib/pathway/passport-todo-gather'
import { READINESS } from '@/lib/content/readiness'
import { stagePace } from '@/lib/pathway/pace'

// ═══ THE CHILD'S MIRROR OF THE PASSPORT ═════════════════════════════════════
//
// Justin, 18 August 2026: "Should the passport page on childs app sync with
// parents version letting child just know if on track and what they need to do
// to gain stamp?" Answered yes in the approved mock, screen eight, with the
// sync FREE because both sides read the same tables: there is nothing to keep
// in step, so the two can never drift.
//
// THIS IS NOT THE ROAD COMING BACK. The child's trail was removed on Justin's
// own call ("yes lets lose the pathway as advised for children only NOT
// parents") because it duplicated the five a day into a second list. This
// screen adds NO list and NO duplicate: one ring, one sentence, and at most
// three doors to things that already exist on their app (their lessons, their
// jobs, the big check). The cap is gatherChildPassportToDo's, already enforced,
// already what the monthly note sends.
//
// WHAT THE CHILD NEVER SEES: the parent's half. Devices, moments and balance
// repair are grown up jobs, and a child must never feel they carry them. No
// clock either: the pace arithmetic runs only to choose between two warm
// sentences, and a child is never shown a rhythm, a deadline or a birthday
// count. That pressure is the exact thing the product exists to prevent.
//
// Same trust model as every kid page: no account, the token scopes everything.

export const dynamic = 'force-dynamic'

export default async function KidPassportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) notFound()

  const { data: child } = await supabase
    .from('children')
    .select('id, name, age_band, stage_id, streak_weeks, date_of_birth')
    .eq('id', link.child_id)
    .maybeSingle()
  if (!child) notFound()

  const name = child.name && child.name !== 'Your child' ? (child.name as string) : 'you'
  const stage = getStageFromAgeBand((child.age_band as AgeBand | null) ?? '8-10')
  const stampName = READINESS[Math.min(4, Math.max(0, stage.id - 1))].stamp

  const slug = (['foundation', 'builder', 'explorer', 'shaper', 'independent'] as ProgressStageId[])[stage.id - 1]
  const [progress, passRes] = await Promise.all([
    getStageProgress(supabase, link.user_id, slug, (child.streak_weeks as number | null) ?? 0, link.child_id),
    supabase.from('stage_quiz_passes')
      .select('stage_id').eq('user_id', link.user_id).eq('child_id', link.child_id)
      .eq('stage_id', stage.id).eq('passed', true).limit(1),
  ])
  const stamped = !!passRes.data?.length

  // Their three things, the same list the monthly note sends, capped at three
  // by the gather itself. Never the parent's rows.
  const toDo = await gatherChildPassportToDo(supabase, link.user_id, {
    id: link.child_id,
    name: child.name as string | null,
    stage_id: child.stage_id as string | null,
    streak_weeks: (child.streak_weeks as number | null) ?? 0,
  }, { progress })

  // The pace runs ONLY to pick between two sentences. No rhythm, no clock, no
  // birthday ever reaches a child's screen.
  const left = Math.max(0, progress.lessonsTotal - progress.lessonsDone)
    + Math.max(0, progress.scriptsTotal - progress.scriptsDone)
  const dobRaw = child.date_of_birth ? new Date(child.date_of_birth as string) : null
  const pace = stagePace(stage.id, left, dobRaw && !Number.isNaN(dobRaw.getTime()) ? dobRaw : null)
  const onTrack = ['stamped', 'few', 'month', 'fortnight', 'week', 'open', 'unknown'].includes(pace.kind)
  const line = stamped
    ? `Your ${stage.name} page is stamped for good!`
    : pace.kind === 'stamped' || pace.kind === 'few'
      ? 'So close! The big check is nearly here'
      : onTrack
        ? `You are on track for your ${stampName} stamp`
        : `Your ${stampName} stamp is getting closer`

  const pct = stamped ? 100 : progress.overallPct

  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.18)',
    borderRadius: 14, padding: '12px 14px',
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--kid-bg)', color: '#F4F4F6', padding: '22px 18px 40px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <Link href={`/k/${token}`} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>
          ‹ Home
        </Link>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', margin: '16px 0 4px', textAlign: 'center' }}>
          My passport
        </p>

        {/* One ring, the same number the parent's page reads for this stage. */}
        <div aria-hidden style={{
          width: 108, height: 108, borderRadius: '50%', margin: '10px auto 8px',
          background: `conic-gradient(#FECDD3 0 ${pct}%, rgba(255,255,255,0.14) ${pct}% 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            width: 84, height: 84, borderRadius: '50%', background: '#3A3D43',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)', color: '#FECDD3',
            textAlign: 'center', lineHeight: 1.2,
          }}>
            {stage.name.toUpperCase()}
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, opacity: 0.75 }}>{stamped ? '🏅' : `${pct}%`}</span>
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', textAlign: 'center', margin: '0 0 4px', lineHeight: 1.2, color: '#fff' }}>
          {line} {stamped ? '' : '⭐'}
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.72)', textAlign: 'center', margin: '0 0 18px', lineHeight: 1.5 }}>
          {stamped
            ? 'Every lesson, every job, every win added up to this.'
            : `Every lesson and every job ${name === 'you' ? 'you do' : `${name} does`} fills the page. When it is full, the big check earns the stamp.`}
        </p>

        {/* At most three doors, and every one already exists on their app.
            The gather speaks in the child's words (lower case lines built to
            join into a sentence); the door names and destinations live here
            because only this page knows the token. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {toDo.map(item => {
            const door = item.key === 'lessons'
              ? { label: 'Do a lesson', href: `/k/${token}/lessons` }
              : item.key === 'jobs'
                ? { label: "Tick today's jobs", href: `/k/${token}` }
                : { label: 'The big check', href: `/k/${token}/quiz` }
            return (
              <Link key={item.key} href={door.href} style={{ ...card, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff' }}>
                <span aria-hidden style={{ fontSize: 'var(--text-lg)' }}>{item.emoji}</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)' }}>{door.label}</span>
                  <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.65)' }}>{item.line}</span>
                </span>
                <span aria-hidden style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.55)', fontWeight: 800 }}>›</span>
              </Link>
            )
          })}
          {toDo.length === 0 && !stamped && (
            <div style={{ ...card, textAlign: 'center', color: 'rgba(255,255,255,0.72)', fontSize: 'var(--text-base)' }}>
              Nothing waiting on you right now. The grown ups have the rest.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
