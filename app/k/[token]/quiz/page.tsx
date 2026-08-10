import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { stageQuizPool } from '@/lib/pathway/stage-quiz-gather'
import { READINESS } from '@/lib/content/readiness'
import KidStageQuiz from '@/components/kid/KidStageQuiz'
import { resolveTheme } from '@/lib/kid/theme'

// The big check at the end of a stage, on the child's side. No account, no
// login; the token scopes everything, exactly like their lessons.
//
// The child sits it because the questions are their own lessons said back to
// them, and because passing it is what earns the stamp on their passport. The
// pass lands in stage_quiz_passes under the parent user_id, so the pathway page
// reads it as the last green without the child needing an account.

export const dynamic = 'force-dynamic'

export default async function KidStageQuizPage({ params }: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
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
    .select('name, age_band, accent')
    .eq('id', link.child_id)
    .maybeSingle()

  const stage = getStageFromAgeBand((child?.age_band as AgeBand | null) ?? '8-10')

  // The questions this stage's own lessons already asked.
  const { questions } = await stageQuizPool(supabase, stage.id)

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

  const stampName = READINESS[Math.min(4, Math.max(0, stage.id - 1))].stamp

  return (
    <KidStageQuiz
      theme={resolveTheme(child?.accent as string | null)}
      token={token}
      stageId={stage.id}
      stageName={stage.name}
      stampName={stampName}
      childName={child?.name ?? 'you'}
      pool={questions}
      alreadyPassed={alreadyPassed}
      lessonsHref={`/k/${token}/lessons`}
    />
  )
}
