import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStageFromAgeBand, STAGES, type AgeBand } from '@/lib/content/stages'
import { childStageCheckPool, checkShape } from '@/lib/pathway/child-stage-check'
import { fetchAnswerFacts, orderPoolByHistory } from '@/lib/lessons/answers'
import { STAGE_PAGES } from '@gc/shared/stage-map'
import KidStageQuiz from '@/components/kid/KidStageQuiz'
import { resolveTheme } from '@/lib/kid/theme'
import { passportStageFor } from '@/lib/lessons/school-path'

const STAGE_NUM_OF: Record<string, number> = { foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5 }

// The big check at the end of a stage, on the child's side. No account, no
// login; the token scopes everything, exactly like their lessons.
//
// The child sits it because the questions are their own lessons said back to
// them, and because passing it is what earns the stamp on their passport. The
// pass lands in stage_quiz_passes under the parent user_id, so the pathway page
// reads it as the last green without the child needing an account.

export const dynamic = 'force-dynamic'

export default async function KidStageQuizPage({ params, searchParams }: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ stage?: string }>
}) {
  const { token } = await params
  const { stage: stageParam } = await searchParams
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) notFound()

  const { data: child } = await supabase
    .from('children')
    .select('name, age_band, accent, date_of_birth')
    .eq('id', link.child_id)
    .maybeSingle()

  // The page their class is on (one clock, decision 1, 17 October 2026): the
  // school year, the same clock as their lessons and the parent's passport.
  const ownNum = STAGE_NUM_OF[passportStageFor(child as { date_of_birth?: string | null; age_band?: string | null } | null)]
  const ownStage = STAGES.find(st => st.id === ownNum) ?? getStageFromAgeBand((child?.age_band as AgeBand | null) ?? '8-10')

  // ?stage=N opens an EARLIER stage's check, for catch up. Until 18 August
  // 2026 this page always served the current band's stage, so a family who
  // joined late could fill an earlier page completely and never sit its
  // check: the stamp was unreachable from the child's side. Earlier only,
  // never ahead: the API route has always enforced stage <= theirs, and this
  // page now mirrors it rather than silently ignoring the ask.
  const asked = Number(stageParam)
  const stage = Number.isInteger(asked) && asked >= 1 && asked < ownStage.id
    ? STAGES.find(st => st.id === asked) ?? ownStage
    : ownStage

  // The questions this stage's own lessons already asked, ordered by this
  // child's own history (migration 239): missed first, never met next,
  // already held last. The component runs the front of the pool, so the
  // check is retrieval practice by design rather than luck.
  //
  // Since 17 October 2026 the pool is THIS child's own passed lessons on the
  // page, never the parent library (passport journey plan, 1.6), and the check
  // opens once every lesson on the page is passed, so the pool exists.
  const pool = await childStageCheckPool(supabase, { userId: link.user_id, childId: link.child_id, stageNum: stage.id })
  const facts = await fetchAnswerFacts(supabase, link.user_id, link.child_id)
  const ordered = orderPoolByHistory(pool.questions, facts)
  const lessonsLeft = Math.max(0, pool.lessonsTotal - pool.lessonsDone)
  const { length, passMark } = checkShape(ordered.length)
  // A miss today comes back tomorrow (the route enforces it too).
  let triedToday = false
  {
    const todayLondon = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/London' })
    const { data } = await supabase
      .from('stage_quiz_passes').select('passed, taken_at')
      .eq('user_id', link.user_id).eq('child_id', link.child_id).eq('stage_id', stage.id)
      .order('taken_at', { ascending: false }).limit(5)
    triedToday = ((data ?? []) as { passed: boolean; taken_at: string }[])
      .some(r => !r.passed && new Date(r.taken_at).toLocaleDateString('en-CA', { timeZone: 'Europe/London' }) === todayLondon)
  }

  // Already stamped? Read it the same way the pathway page does, so the child
  // is told rather than quietly given the quiz again. Fails soft to not passed
  // before migration 098, which offers the quiz rather than hiding it.
  let alreadyPassed = false
  {
    const { data } = await supabase
      .from('stage_quiz_passes')
      .select('stage_id')
      .eq('user_id', link.user_id)
      .eq('child_id', link.child_id)
      .eq('stage_id', stage.id)
      .eq('passed', true)
      .limit(1)
    alreadyPassed = !!data?.length
  }

  // The child names the stamp by its Planet Friend, "the Orbit stamp", never
  // the parent's readiness label (passport journey plan, names rule).
  const stampName = STAGE_PAGES[(['foundation', 'builder', 'explorer', 'shaper', 'independent'] as const)[stage.id - 1]].stamp

  return (
    <KidStageQuiz
      theme={resolveTheme(child?.accent as string | null)}
      token={token}
      stageId={stage.id}
      stageName={stage.name}
      stampName={stampName}
      childName={child?.name ?? 'you'}
      pool={ordered}
      alreadyPassed={alreadyPassed}
      lessonsHref={`/k/${token}/lessons`}
      runLength={length}
      passMark={passMark}
      lessonsLeft={lessonsLeft}
      comeBackTomorrow={triedToday && !alreadyPassed}
      tellHref={`/k/${token}/tell`}
    />
  )
}
