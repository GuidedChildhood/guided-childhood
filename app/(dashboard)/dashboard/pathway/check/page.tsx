import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { pickChild } from '@/lib/children/select'
import { getStageFromAgeBand, STAGES, type AgeBand } from '@/lib/content/stages'
import { stageQuizPool } from '@/lib/pathway/stage-quiz-gather'
import { fetchAnswerFacts, orderPoolByHistory } from '@/lib/lessons/answers'
import { READINESS } from '@/lib/content/readiness'
import BackTo from '@/components/nav/BackTo'
import ParentStageCheck from '@/components/passport/ParentStageCheck'
import { withChild } from '@/components/passport/Application'

// The check, sat together on the parent's screen: the together fallback
// Justin approved ("should push for app but yes when no app parents can do
// together"), and the catch up door for an earlier stage's check (?stage=N,
// earlier only, mirroring the kid page's guard).
//
// The child's own link stays the front door. This page exists so that neither
// no app nor joined late can ever mean no stamp.

export const metadata = { title: 'The stage check · Guided Childhood' }

export default async function ParentCheckPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string; stage?: string; from?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { child: childParam, stage: stageParam, from } = await searchParams

  const { data: childRows } = await supabase
    .from('children')
    .select('id, name, age_band, is_primary')
    .eq('parent_id', user.id)
    .order('is_primary', { ascending: false })
  const child = pickChild(childRows ?? [], childParam)
  if (!child) redirect('/dashboard/pathway')

  const ownStage = getStageFromAgeBand(((child as { age_band?: string | null }).age_band as AgeBand | null) ?? '8-10')
  const asked = Number(stageParam)
  const stage = Number.isInteger(asked) && asked >= 1 && asked < ownStage.id
    ? STAGES.find(st => st.id === asked) ?? ownStage
    : ownStage

  // Ordered by this child's own history (migration 239): missed questions
  // first, never met next, already held last. The component runs the front
  // of the pool, so the wobbly ones come round first.
  const { questions } = await stageQuizPool(supabase, stage.id)
  const facts = await fetchAnswerFacts(supabase, user.id, child.id)
  const ordered = orderPoolByHistory(questions, facts)
  const stampName = READINESS[Math.min(4, Math.max(0, stage.id - 1))].stamp
  const kidName = child.name && child.name !== 'Your child' ? child.name : 'your child'
  const backHref = withChild('/dashboard/pathway#passport', childParam)

  return (
    <div style={{ padding: '20px 20px 40px', maxWidth: 640, margin: '0 auto' }}>
      <BackTo from={from ?? 'passport'} fallback={{ href: backHref, label: 'Passport' }} />
      <p className="eyebrow" style={{ marginBottom: 4 }}>Sit it together</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.2 }}>
        {kidName === 'your child' ? 'The' : `${kidName}'s`} {stage.name} check
      </h1>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
        Five questions from the lessons, asked out loud, answered together.
        Four of five earns the {stampName} stamp. No marks lost for a retry.
      </p>
      <ParentStageCheck
        childId={child.id}
        childName={kidName === 'your child' ? 'Your child' : kidName}
        stageId={stage.id}
        stageName={stage.name}
        stampName={stampName}
        pool={ordered}
        backHref={backHref}
      />
    </div>
  )
}
