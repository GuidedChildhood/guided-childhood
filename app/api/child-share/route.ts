import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'

// Share something to a child's own app: a note from a script, or anything
// meant for them. It is stored so they can read and re-read it on their quest
// link, and their phone is pinged through the reminders they turned on. Always
// the parent's own child, always from the parent, never a message from us.

export const dynamic = 'force-dynamic'

const KINDS = ['note', 'script'] as const

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const childId = typeof body.child_id === 'string' ? body.child_id : null
  const kind = KINDS.includes(body.kind) ? body.kind : 'note'
  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 120) : ''
  const text = typeof body.body === 'string' ? body.body.trim().slice(0, 2000) : ''
  const ref = typeof body.ref === 'string' ? body.ref.slice(0, 60) : null
  if (!childId || !title || !text) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  // The child must belong to this parent.
  const { data: child } = await supabase
    .from('children').select('id').eq('id', childId).eq('parent_id', user.id).maybeSingle()
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })

  const { error } = await supabase.from('child_shares').insert({
    user_id: user.id, child_id: childId, kind, title, body: text, ref,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Does the child have their app set up? If so, it is on their phone now; if
  // not, it still waits on their link for the next open.
  const admin = createAdminClient()
  const { data: link } = await admin
    .from('kid_links').select('token').eq('user_id', user.id).eq('child_id', childId).maybeSingle()
  const hasApp = Boolean((link as { token?: string } | null)?.token)

  // Best effort ping to their device, deep linked to their own page.
  try {
    await pushToChild(admin, user.id, childId, kind === 'script' ? 'A note from your grown up ⭐' : title, text.slice(0, 120))
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, stored: true, hasApp })
}

// The child marks a share as read from their own link (token is the auth,
// exactly like ticking a quest). Scoped so a token can only clear its own
// child's notes.
export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const token = typeof body.token === 'string' ? body.token : ''
  const id = typeof body.id === 'string' ? body.id : ''
  if (!/^[0-9a-f]{18}$/.test(token) || !id) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const admin = createAdminClient()
  const { data: link } = await admin
    .from('kid_links').select('child_id').eq('token', token).maybeSingle()
  const childId = (link as { child_id?: string } | null)?.child_id
  if (!childId) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const { error } = await admin
    .from('child_shares').update({ read_at: new Date().toISOString() })
    .eq('id', id).eq('child_id', childId).is('read_at', null)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
