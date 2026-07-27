import { createClient } from '@/lib/supabase/server'
import { hasFullAccess } from '@/lib/access'
import { redirect } from 'next/navigation'
import type { StageId } from '@/lib/pathway/progress'
import AgreementBuilder from '@/components/agreement/AgreementBuilder'

export const dynamic = 'force-dynamic'

const STAGE_LABELS: Record<StageId, string> = {
  foundation: 'Stage 1 · Foundation',
  builder: 'Stage 2 · Builder',
  explorer: 'Stage 3 · Explorer',
  shaper: 'Stage 4 · Shaper',
  independent: 'Stage 5 · Independent',
}

export default async function AgreementPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: child }, { data: agreement }] = await Promise.all([
    supabase.from('profiles').select('subscription_status, trial_ends_at').eq('id', user.id).single(),
    supabase.from('children').select('id, name, stage_id, phone').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
    supabase.from('family_agreements').select('*').eq('user_id', user.id).maybeSingle(),
  ])

  // Whether the child has ever opened their app. The agreement is already
  // pushed to their side automatically, so the honest thing to tell a parent is
  // either 'it is on their app' or 'they have not opened their app yet, here is
  // the code', never a Send button that pretends a send happened.
  let childAppLive = false
  try {
    const { data: link } = await supabase
      .from('kid_links').select('last_seen_at').eq('user_id', user.id).limit(1).maybeSingle()
    childAppLive = !!link?.last_seen_at
  } catch { childAppLive = false }

  // Last week's check, read off the same quest tick the verdict writes, so the
  // block can point back at what was actually said rather than starting cold
  // every Friday.
  let lastCheck: { date: string; stars: number } | null = null
  if (child?.id) {
    try {
      const { data: quest } = await supabase
        .from('family_quests').select('id, stars')
        .eq('user_id', user.id).eq('child_id', child.id)
        .eq('title', 'Kept our family agreement').maybeSingle()
      if (quest?.id) {
        const { data: tick } = await supabase
          .from('quest_ticks').select('tick_date')
          .eq('quest_id', quest.id).order('tick_date', { ascending: false }).limit(1).maybeSingle()
        if (tick?.tick_date) lastCheck = { date: tick.tick_date as string, stars: Number(quest.stars) || 0 }
      }
    } catch { lastCheck = null }
  }

  const isPaid = hasFullAccess(profile, user.email)
  const stageId = (child?.stage_id ?? null) as StageId | null
  const childName = child?.name ?? 'your child'

  // Free to build and preview the whole agreement. Saving and the printable
  // signed copy are the membership payoff, gated inside the builder and on
  // the save API, so the value is felt before the wall.
  return (
    <AgreementBuilder
      childName={childName}
      stageId={stageId ?? 'explorer'}
      stageLabel={STAGE_LABELS[stageId ?? 'explorer']}
      saved={agreement ?? null}
      childPhone={(child as { phone?: string | null } | null)?.phone ?? null}
      isPaid={isPaid}
      childAppLive={childAppLive}
      lastCheck={lastCheck}
    />
  )
}
