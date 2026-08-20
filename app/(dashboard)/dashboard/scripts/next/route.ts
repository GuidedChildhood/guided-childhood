import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getChildren } from '@/lib/children/server'
import { hasFullAccess } from '@/lib/access'
import { getRecommendedScript } from '@/lib/pathway/recommend'
import type { StageId } from '@/lib/pathway/progress'

// The pathway hands a parent a SCRIPT, not a library.
//
// Justin, 10 August 2026: "the pathway OS still not taking me to the related
// script, and then once read through needs to update pathway."
//
// The road and the passport used to link at /dashboard/scripts?stage=<slug>,
// which is a shelf. Even once the stage filter worked, a parent following
// "use the scripts" still had to choose one, and choosing is the thing the
// pathway is supposed to have done for them.
//
// So this route does the choosing and gets out of the way: it runs the same
// recommender the Scripts tab uses, pinned to the stage the pathway asked for,
// and redirects to that one script. No page of its own, nothing to render, and
// nothing new to keep in step with the ranking.
//
// It falls back to the stage list rather than erroring, because a stage where
// every script is finished is a good problem and a parent who lands on a list
// they can still browse has lost nothing.

export const dynamic = 'force-dynamic'

const STAGES: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const asked = url.searchParams.get('stage')
  const childParam = url.searchParams.get('child')
  const origin = url.origin

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(`${origin}/login`)

  const [{ data: profile }, { child }] = await Promise.all([
    supabase.from('profiles').select('subscription_status, trial_ends_at, onboarding_answers').eq('id', user.id).maybeSingle(),
    // The child the link named, primary as the fallback, same as every page.
    // This read the primary child by hand, so "the next one for this stage"
    // tapped on Olga's tab chose from Teo's signals.
    getChildren<{ id: string; stage_id: string | null; is_primary: boolean | null }>(
      supabase, user.id, childParam, 'stage_id'),
  ])

  // The ?child= survives both exits, so the reader it lands on ticks the
  // right child. The primary child keeps the clean URL.
  const childQS = childParam && child && !child.is_primary ? `&child=${child.id}` : ''

  // The stage in the link wins, because the parent tapped a specific stage on
  // the road. Their child's own stage is the fallback for a bare link.
  const stage = (STAGES.includes(asked as StageId) ? asked : child?.stage_id) as StageId | undefined
  if (!stage) return NextResponse.redirect(`${origin}/dashboard/scripts?from=pathway${childQS}`)

  const list = `${origin}/dashboard/scripts?stage=${stage}&from=pathway${childQS}`

  const isPaid = hasFullAccess(profile, user.email)
  const challenge = (profile?.onboarding_answers as Record<string, string> | null)?.challenge
  const pick = await getRecommendedScript(
    supabase, user.id, stage, (challenge ?? null) as never,
    // preferFree for an unpaid parent, so the pathway never hands them a script
    // that bounces straight into the paywall. Following your own pathway into a
    // locked door is the worst possible first impression of it.
    { preferFree: !isPaid, childId: child?.id ?? null },
  ).catch(() => null)

  if (!pick) return NextResponse.redirect(list)
  return NextResponse.redirect(`${origin}/dashboard/scripts/${pick.sort_order}?from=pathway&stage=${stage}${childQS}`)
}
