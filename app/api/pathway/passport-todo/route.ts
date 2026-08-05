import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'
import { gatherChildPassportToDo } from '@/lib/pathway/passport-todo-gather'
import { childToDoMessage, childToDoTitle } from '@/lib/pathway/passport-todo'

// Send the child their bit of the passport, on the parent's tap.
//
// The monthly sweep does this on its own (see /api/cron/passport-check). This
// is the same send, on demand, for the parent who has just read the TO DO above
// the book and wants it to land now rather than on the first of next month.
//
// The list is rebuilt HERE from the database rather than taken from the body.
// The client already has it, because the page rendered it, and it still gets
// rebuilt: a request body is a thing anybody can write, and this one ends up on
// a child's screen.

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { childId } = await req.json().catch(() => ({}))
  if (!childId || typeof childId !== 'string') {
    return NextResponse.json({ error: 'childId required' }, { status: 400 })
  }

  const { data: child } = await supabase
    .from('children').select('id, name, stage_id, streak_weeks')
    .eq('id', childId).eq('parent_id', user.id).maybeSingle()
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })

  // No app, no send. The passport TO DO stays on the parent's page in that
  // case, which is where it can still be acted on.
  const { data: link } = await supabase
    .from('kid_links').select('token').eq('child_id', childId).maybeSingle()
  if (!link) return NextResponse.json({ error: 'no app', onApp: false }, { status: 409 })

  const items = await gatherChildPassportToDo(supabase, user.id, child)
  const message = childToDoMessage(items)
  if (!message) return NextResponse.json({ ok: true, sent: false, reason: 'nothing to send', items: [] })

  // One unread passport note at a time. Tapping Send twice, or a parent
  // sending it a fortnight before the monthly sweep runs, must not stack two
  // near identical notes on a child's screen. Matched on the message prefix
  // rather than on quest_id, since a passport note never belongs to a job.
  let stored = false
  try {
    const { data: existing } = await supabase
      .from('kid_nudges').select('id, message')
      .eq('child_id', childId).eq('seen', false).is('quest_id', null)
      .like('message', 'Your passport this month:%')
      .limit(1).maybeSingle()
    if (existing?.id) {
      // Refreshed rather than duplicated: the child sees the CURRENT list, and
      // still only one row of it.
      const { error } = await supabase.from('kid_nudges').update({ message }).eq('id', existing.id)
      stored = !error
    } else {
      const { error } = await supabase.from('kid_nudges').insert({
        user_id: user.id, child_id: childId, quest_id: null, message,
      })
      stored = !error
    }
  } catch { /* pre migration database, the push can still carry it */ }

  try {
    await pushToChild(createAdminClient(), user.id, childId, childToDoTitle(child.name ?? null), message)
  } catch { /* best effort, the in app note is the one that has to land */ }

  return NextResponse.json({ ok: true, sent: true, stored, items, message })
}
