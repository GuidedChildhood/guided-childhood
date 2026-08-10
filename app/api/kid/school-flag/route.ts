import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPush } from '@/lib/push/send'

// The child says a grown up's diary entry looks wrong.
//
// Justin, 10 August 2026, on a Show and tell routine firing in the summer
// holidays: "we need a way for them to click in and simply stop it edit it
// if wrong." The child's half of that is this: they cannot edit or stop a
// grown up's reminder (the same reason they cannot tick one off, a wrong
// fact on the parent's list is worse than a wrong fact reported), but one
// tap tells the grown up which entry to look at, and the parent's card is
// where the fix is one more tap.
//
// Same trust model as the rest of the child app: the link token is the auth
// and scopes everything to one family.

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const token = typeof body?.token === 'string' ? body.token : ''
  if (!/^[0-9a-f]{18}$/.test(token)) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const admin = createAdminClient()
  const { data: link } = await admin
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const id = typeof body?.id === 'string' ? body.id : ''
  const { data: action } = id
    ? await admin
        .from('school_actions')
        .select('id, title')
        .eq('id', id)
        .eq('user_id', link.user_id)
        .maybeSingle()
    : { data: null }
  if (!action) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const { data: child } = await admin.from('children').select('name').eq('id', link.child_id).maybeSingle()
  const who = (child?.name as string | undefined) || 'Your child'
  await sendPush({
    userId: link.user_id,
    title: `${who} says a diary entry looks wrong 🙋`,
    body: `${action.title}. Tap to check it, then edit or stop it if they are right.`,
    url: '/dashboard/school',
  })

  return NextResponse.json({ ok: true })
}
