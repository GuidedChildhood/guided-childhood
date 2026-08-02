import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import InsightsBoard from '@/components/insights/InsightsBoard'
import ManagementReviewPanel, { type ManagementFindingRow } from '@/components/insights/ManagementReviewPanel'
import DigiChecksPanel from '@/components/insights/DigiChecksPanel'
import LaneMissesPanel from '@/components/insights/LaneMissesPanel'
import { createAdminClient } from '@/lib/supabase/admin'

// Founder only. The daily insight agent's dashboard: run it on demand, read
// what parents asked DiGi, and see what to build next. Gated server side so
// the route and the page share one rule.

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export default async function InsightsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if ((user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) notFound()

  // Read server side with the admin client, AFTER the founder check above.
  // management_findings deliberately has no parent readable policy, because it
  // is aggregate across every family, so it must never be reachable from a
  // browser holding an ordinary session.
  //
  // Fails soft to null before migration 140 has run, so the page keeps working
  // and the panel says so rather than the whole board erroring.
  let review: ManagementFindingRow | null = null
  try {
    const { data } = await createAdminClient()
      .from('management_findings')
      .select('week_start, summary, findings, metrics, model')
      .order('week_start', { ascending: false })
      .limit(1)
      .maybeSingle()
    review = (data as ManagementFindingRow | null) ?? null
  } catch { /* pre migration 140 */ }

  return (
    <>
      <ManagementReviewPanel row={review} />
      {/* Below the week's read, above the daily detail. It answers "is the
          machine actually running", which is the question you only think to ask
          after it has quietly not been for a month. */}
      <DigiChecksPanel />
      {/* The weekly review Justin asked for: what DiGi failed to understand,
          and one tap to teach it. Sits under the machine check because it is
          the same question one level down, from "is it running" to "is it
          keeping up with how families actually talk". */}
      <LaneMissesPanel />
      <InsightsBoard />
    </>
  )
}
