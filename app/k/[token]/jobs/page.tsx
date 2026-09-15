import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import KidScreenChrome from '@/components/kid/KidScreenChrome'
import { readTodayState } from '@/lib/kid/today-state'
import { readKidJobs } from '@/lib/kid/jobs-read'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import KidJobsScreen from './KidJobsScreen'

// The child's jobs page: the do these jobs list, and the pay back message
// when gifted screen time is still owed.
//
// Justin, 9 August 2026, reorganising the home screen: the five a day's
// today's jobs step should "open the jobs page carrying the do these jobs
// list and the payback message", and the duplicate list that sat under the
// five a day on the home screen folds into it. So the home leads with the
// day (the five a day) and this page is where the jobs themselves get done.
//
// Which jobs are due comes from lib/kid/jobs-read, the same read the home
// screen uses, so the number on the five a day's jobs row and the list here
// can never disagree.
//
// Same trust model as the rest of the child app: no account, no login, the
// link token scopes everything to one child.

export const dynamic = 'force-dynamic'

export default async function KidJobsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) notFound()

  const [childRes, jobs] = await Promise.all([
    supabase.from('children').select('name, age_band, buddy').eq('id', link.child_id).maybeSingle(),
    readKidJobs(supabase, link.user_id, link.child_id),
  ])

  // Stars still owed in jobs from gifted screen time: the pay back message.
  // Fails soft to zero, same as the home screen's read of the same table.
  let giftStarsOwed = 0
  {
    const { data, error } = await supabase
      .from('gift_debts').select('stars_owed')
      .eq('child_id', link.child_id).eq('settled', false)
    if (!error) giftStarsOwed = (data ?? []).reduce((sum, d) => sum + (Number(d.stars_owed) || 0), 0)
  }

  const ageBand = childRes.data?.age_band as AgeBand | undefined
  const stageId = ageBand ? getStageFromAgeBand(ageBand).id : 2

  // The bar's Today entry, which is what replaces the KidTodayReturn pill that
  // used to float here. Two cheap reads that fail soft to an empty day.
  const todayState = await readTodayState(supabase, link.child_id)
  const todayTab = {
    left: todayState.left,
    total: todayState.steps.length,
    complete: todayState.complete,
    opened: todayState.done.length > 0,
  }

  return (
    <KidScreenChrome token={token} current="quests" today={todayTab}>
    <KidJobsScreen
      token={token}
      childName={childRes.data?.name ?? 'Superstar'}
      buddy={(childRes.data?.buddy as string | null) ?? null}
      stageId={stageId}
      ageBand={ageBand ?? null}
      quests={jobs.dueQuests.map(q => ({
        id: q.id, title: q.title, emoji: q.emoji, stars: q.stars, blocks_screens: q.blocks_screens,
        // The flag rides through, so a family job says thank you rather than
        // pricing itself in stars on this list (the main list already did).
        is_family_job: Boolean((q as { is_family_job?: boolean | null }).is_family_job),
      }))}
      todayTicks={jobs.todayTicks}
      giftStarsOwed={giftStarsOwed}
    />
    </KidScreenChrome>
  )
}
