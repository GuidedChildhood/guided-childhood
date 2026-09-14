import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The child taps I agree on the family deal, from their own app.
//
// Justin, 14 September 2026: the agreement "determines how jobs, device time
// is all agreed ... and we need to agree, to remind, maybe print, appears on
// child phone". It appeared on the child's phone already, as a list of the
// promises with a line saying both had agreed, but the child's signature was
// a box the PARENT ticked on their behalf in the builder. A deal the child
// agrees to on their own screen is the one they will hold themselves to.
//
// Same trust model as every kid route: the link token is the auth and scopes
// the write to one family's agreement. It only ever sets the child's
// signature to true, never clears it, and it stamps agreed_date only when
// the parent has already signed, which is the same rule the parent's save
// route applies: agreed means both.

export async function POST(req: NextRequest) {
  const { token } = await req.json().catch(() => ({}))
  if (typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad token' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: link } = await admin
    .from('kid_links').select('user_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const { data: row } = await admin
    .from('family_agreements')
    .select('id, signed_by_parent, signed_by_child, agreed_date')
    .eq('user_id', link.user_id)
    .limit(1)
    .maybeSingle()
  if (!row) return NextResponse.json({ ok: false, reason: 'no deal yet' }, { status: 404 })

  const parentSigned = !!row.signed_by_parent
  const update: { signed_by_child: boolean; agreed_date?: string } = { signed_by_child: true }
  if (parentSigned && !row.agreed_date) update.agreed_date = new Date().toISOString().slice(0, 10)

  const { error } = await admin.from('family_agreements').update(update).eq('id', row.id)
  if (error) return NextResponse.json({ ok: false }, { status: 500 })

  return NextResponse.json({ ok: true, parentSigned, signed: parentSigned })
}
