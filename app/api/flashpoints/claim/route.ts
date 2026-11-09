import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { raiseConcern } from '@/lib/concerns/raise'
import { flashpointByKey } from '@/lib/content/family-flashpoints'
import { concernMeansFlashpoint } from '@/lib/content/family-flashpoints-match'

// "This happens in our house." One tap on /dashboard/flashpoints says a row is
// this family's, and that tap does three things the product already knows
// how to do: it raises the row as a worry (so the five face check in tracks
// it and the first rating is the baseline), it switches on the heads up in
// the family's own window (lib/push/flashpoint-heads-up.ts reads open
// worries), and DiGi sees it among the family's concerns.
//
// "Sorted for now" rests it, the same way a worry is resolved anywhere else,
// and the heads up stops.

export async function POST(req: Request) {
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const body = await req.json().catch(() => ({})) as { key?: unknown; childId?: unknown; claimed?: unknown }
  const f = typeof body.key === 'string' ? flashpointByKey(body.key) : null
  if (!f) return NextResponse.json({ error: 'Unknown flashpoint' }, { status: 400 })

  // The child must be this parent's. Anything else is treated as no child.
  let childId: string | null = null
  if (typeof body.childId === 'string' && body.childId) {
    const { data: kid } = await supabase.from('children').select('id').eq('id', body.childId).eq('parent_id', user.id).maybeSingle()
    childId = kid?.id ?? null
  }

  if (body.claimed === false) {
    // Every open worry that means this row, the same reading the heads up
    // uses, so "sorted for now" really does stop it.
    let q = supabase.from('concerns').select('id, slug, label').eq('user_id', user.id).in('status', ['open', 'improving'])
    q = childId ? q.or(`child_id.eq.${childId},child_id.is.null`) : q.is('child_id', null)
    const { data: rows, error: readError } = await q
    if (readError) return NextResponse.json({ error: 'Could not update' }, { status: 500 })
    const ids = ((rows ?? []) as { id: string; slug: string; label: string | null }[])
      .filter(r => concernMeansFlashpoint(f, r)).map(r => r.id)
    if (ids.length > 0) {
      const { error } = await supabase.from('concerns').update({ status: 'resolved' }).in('id', ids).eq('user_id', user.id)
      if (error) return NextResponse.json({ error: 'Could not update' }, { status: 500 })
    }
    return NextResponse.json({ ok: true, claimed: false })
  }

  const slug = await raiseConcern(supabase, user.id, childId, {
    slug: f.proof.concernSlug,
    label: f.name,
    source: 'rightnow',
  })
  if (!slug) return NextResponse.json({ error: 'Could not save' }, { status: 500 })
  return NextResponse.json({ ok: true, claimed: true })
}
