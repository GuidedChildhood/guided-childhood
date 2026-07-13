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
    supabase.from('children').select('name, stage_id, phone').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
    supabase.from('family_agreements').select('*').eq('user_id', user.id).maybeSingle(),
  ])

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
    />
  )
}
