import { createClient } from '@/lib/supabase/server'
import { hasFullAccess } from '@/lib/access'
import { redirect } from 'next/navigation'
import { getRecommendedScript } from '@/lib/pathway/recommend'
import type { ChallengeId } from '@/lib/content/stages'
import type { StageId } from '@/lib/pathway/progress'

export const dynamic = 'force-dynamic'

// The activation moment: onboarding (and anything else that wants "just
// open the right script") lands here, we work out the single best next
// script for this parent and send them straight into it.
export default async function RecommendedScriptRedirect() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: child }] = await Promise.all([
    supabase.from('profiles').select('onboarding_answers, subscription_status, trial_ends_at').eq('id', user.id).single(),
    supabase.from('children').select('stage_id').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
  ])

  const stageId = (child?.stage_id ?? null) as StageId | null
  const challenge = (profile?.onboarding_answers as Record<string, string> | null)?.challenge as ChallengeId | undefined

  // Unpaid parents (including fresh payers whose webhook has not landed
  // yet) get a free script, so this redirect can never dead end on the
  // script reader's upgrade wall.
  const recommended = stageId
    ? await getRecommendedScript(supabase, user.id, stageId, challenge ?? null, {
        preferFree: !hasFullAccess(profile),
      })
    : null

  redirect(recommended ? `/dashboard/scripts/${recommended.sort_order}` : '/dashboard/scripts')
}
