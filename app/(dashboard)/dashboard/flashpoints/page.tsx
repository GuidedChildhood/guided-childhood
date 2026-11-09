import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { getChildren } from '@/lib/children/server'
import type { AgeBand } from '@/lib/content/stages'
import { FAMILY_FLASHPOINTS } from '@/lib/content/family-flashpoints'
import { claimedFlashpoints } from '@/lib/push/flashpoint-heads-up'
import FlashpointsView from './FlashpointsView'

// THE USUAL ROWS. Justin, 9 November 2026: "some way of letting parents know
// these things happen and we are here to pre empt and assist."
//
// So the page says it first, in the heading: these happen in every house. Then
// the thirty, the ones this child's age brings first, each opening to the same
// five parts in the same order: the line for you, what is going on, the plan,
// the child's part, and the real scripts. One tap says a row is yours, which
// raises it as a worry the check in tracks and turns on the heads up just
// before it. Laid out like a help topic list that opens in place (Ro's support
// list, Brainly's stacked tip and steps on Mobbin), in our cream, ink and
// butter, with the parent's line on butter because it is the one to read
// first when there is no time to read the rest.

export const dynamic = 'force-dynamic'
export const metadata = { title: 'The usual rows · Guided Childhood' }

export default async function FlashpointsPage({ searchParams }: { searchParams: Promise<{ child?: string; from?: string }> }) {
  const { child: childParam, from } = await searchParams
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')

  const { child } = await getChildren<{ id: string; name: string | null; age_band: string | null }>(supabase, user.id, childParam, 'name, age_band')
  const kid = child?.name && child.name !== 'Your child' ? child.name : null
  const band = (child?.age_band as AgeBand | null) ?? null

  const titles = [...new Set(FAMILY_FLASHPOINTS.flatMap(f => f.proof.scripts))]
  let concernsQ = supabase.from('concerns').select('slug, label, child_id').eq('user_id', user.id).in('status', ['open', 'improving'])
  concernsQ = child ? concernsQ.or(`child_id.eq.${child.id},child_id.is.null`) : concernsQ
  const [{ data: scripts }, { data: concerns }] = await Promise.all([
    supabase.from('scripts').select('sort_order, title').in('title', titles),
    concernsQ,
  ])
  const scriptAt = new Map(((scripts ?? []) as { sort_order: number; title: string }[]).map(s => [s.title, s.sort_order]))
  const mine = new Set(claimedFlashpoints((concerns ?? []) as { slug: string; label: string | null; child_id: string | null }[]).map(c => c.flashpoint.key))

  return <FlashpointsView kid={kid} band={band} childId={child?.id ?? null} mine={mine} scriptAt={scriptAt} from={from} />
}
