import { createClient } from '@/lib/supabase/server'
import { getRecommendedScript } from '@/lib/pathway/recommend'
import type { StageId } from '@/lib/pathway/progress'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Resolves the one script a parent should open the moment onboarding ends:
// their stage, matched to the challenge they just told us about, free
// unless they have already paid, never one they have completed.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const [{ data: profile }, { data: child }] = await Promise.all([
    supabase
      .from('profiles')
      .select('subscription_status, onboarding_answers')
      .eq('id', user.id)
      .single(),
    supabase
      .from('children')
      .select('stage_id')
      .eq('parent_id', user.id)
      .eq('is_primary', true)
      .maybeSingle(),
  ])

  if (!child?.stage_id) {
    return NextResponse.json({ sort_order: null })
  }

  const isPaid = profile?.subscription_status === 'active'
  const challenge = (profile?.onboarding_answers as Record<string, string> | null)?.challenge ?? null

  const recommended = await getRecommendedScript(
    supabase,
    user.id,
    child.stage_id as StageId,
    challenge,
    { preferFree: !isPaid }
  )

  return NextResponse.json(
    recommended
      ? { sort_order: recommended.sort_order, title: recommended.title }
      : { sort_order: null }
  )
}
