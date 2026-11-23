import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStageFromAgeBand, STAGES, type AgeBand } from '@/lib/content/stages'
import { childStageCheckPool, type ChildCheckQuestion } from '@/lib/pathway/child-stage-check'
import { passportStageFor } from '@/lib/lessons/school-path'
import { resolveTheme } from '@/lib/kid/theme'
import KidVersus from '@/components/kid/KidVersus'

// ME V MY GROWN UP (22 November 2026).
//
// A two player game on one device: the child and their grown up race to the
// right answer, and every question ends on a talking point. Modelled on the
// grown up battle game in the French scheme's pupil games, which children
// asked for (plans/2026-11-22-french-games-review.md), and built for our own
// thesis: screens are better together. Plan:
// plans/2026-11-22-me-v-my-grown-up-plan.md.
//
// THE QUESTIONS are the ones this child's own passed lessons already asked,
// the same pool the stage check uses, so every answer was taught. The current
// stage first, then the one before it if the child has few. Safeguarding
// flagged questions are left out: they belong in the lesson with the tell
// page beside them, not in a race. The parent facing stage bank is never used.
//
// NOTHING IS SAVED. No stars, no record, no migration: this is a together
// game, never a way to earn screen time.

const STAGE_NUM_OF: Record<string, number> = { foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5 }

export const dynamic = 'force-dynamic'

export default async function KidVersusPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) notFound()

  const { data: child } = await supabase
    .from('children').select('name, age_band, accent, date_of_birth').eq('id', link.child_id).maybeSingle()

  const ownNum = STAGE_NUM_OF[passportStageFor(child as { date_of_birth?: string | null; age_band?: string | null } | null)]
  const stage = STAGES.find(st => st.id === ownNum) ?? getStageFromAgeBand((child?.age_band as AgeBand | null) ?? '8-10')

  const gather = async (n: number): Promise<ChildCheckQuestion[]> =>
    n >= 1 ? (await childStageCheckPool(supabase, { userId: link.user_id, childId: link.child_id, stageNum: n }).catch(() => ({ questions: [] as ChildCheckQuestion[] }))).questions : []
  let pool = (await gather(stage.id)).filter(q => !q.flagged)
  if (pool.length < 8) pool = pool.concat((await gather(stage.id-1)).filter(q => !q.flagged))

  return (
    <KidVersus
      token={token}
      childName={child?.name ?? 'You'}
      pool={pool.map(({ q, options, answer, why }) => ({ q, options, answer, why }))}
      theme={resolveTheme(child?.accent as string | null)}
    />
  )
}
