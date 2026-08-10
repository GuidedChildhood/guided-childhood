import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { CHILD_KINDS } from '@/lib/school/child-items'
import { sendPush } from '@/lib/push/send'

// The child adds to their own school diary.
//
// Justin, 9 August 2026: the school diary moves to the top of the child's home
// screen and the child "can add things themselves", with a visible difference
// between what they added and what their grown up added.
//
// Same trust model as the rest of the child app: the link token is the auth,
// no account, and the token scopes everything to one family's list. The row
// lands in the same school_actions table the parent reads, stamped
// added_by = child so both screens can tell who put it there. Provenance is
// stored, never inferred, so it survives an edit.
//
// Only the child kinds. A child can add a kit day, homework or a club, the
// things that are their own business and already reach their screen by
// default (lib/school/child-items). They cannot add a payment or a notice,
// which are grown up things, and which would otherwise be invisible to the
// child who just added them.

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const token = typeof body?.token === 'string' ? body.token : ''
  if (!/^[0-9a-f]{18}$/.test(token)) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const admin = createAdminClient()
  const { data: link } = await admin
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const title = typeof body?.title === 'string' ? body.title.replace(/\s+/g, ' ').trim().slice(0, 140) : ''
  // Two characters is the floor, same as the parent's route: PE is real.
  if (title.length < 2) return NextResponse.json({ error: 'title too short' }, { status: 400 })

  // The same fields the parent's add takes, because this IS the parent's
  // entry system, copied. Justin: "can we copy the parent calendar entry
  // system we built as that worked well." A one off keeps its date and time;
  // an every week item keeps its weekday and no date, exactly as the parent
  // route stores them, so the two kinds of add are indistinguishable in the
  // data apart from added_by.
  const kind = CHILD_KINDS.has(body?.kind) ? (body.kind as string) : 'kit'
  const dueDate = typeof body?.due_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.due_date) ? body.due_date : null
  const dueTime = typeof body?.due_time === 'string' && /^\d{2}:\d{2}$/.test(body.due_time) ? body.due_time : null
  const recursWeekday = Number.isInteger(body?.recurs_weekday) && body.recurs_weekday >= 0 && body.recurs_weekday <= 6
    ? (body.recurs_weekday as number)
    : null

  // A gentle ceiling, because this is a free text box on a child's screen. A
  // family diary is a handful of rows; twenty open child added items in a day
  // is a keyboard being enjoyed, not a diary being kept.
  const { count } = await admin
    .from('school_actions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', link.user_id)
    .eq('status', 'open')
  if ((count ?? 0) >= 60) return NextResponse.json({ error: 'list full' }, { status: 400 })

  // Same dedupe as the parent's add: typing a thing that is already on the
  // list, on the same day, returns the row that exists rather than a second
  // copy. Case insensitive, wildcards escaped because a title is free text.
  const { data: clash } = await admin
    .from('school_actions')
    .select('id, kind, title, due_date, due_time, recurs_weekday')
    .eq('user_id', link.user_id)
    .eq('status', 'open')
    .ilike('title', title.replace(/[\\%_]/g, (c: string) => `\\${c}`))
    .limit(20)
  const dupe = (clash ?? []).find(r =>
    recursWeekday !== null
      ? r.recurs_weekday === recursWeekday
      : dueDate !== null
        ? r.due_date === dueDate
        : r.recurs_weekday === null && r.due_date === null,
  )
  if (dupe) return NextResponse.json({ action: dupe, alreadyThere: true })

  const row = {
    user_id: link.user_id,
    kind,
    title,
    due_date: recursWeekday !== null ? null : dueDate,
    due_time: dueTime,
    recurs_weekday: recursWeekday,
    // A weekly routine the child made reaches the child automatically on its
    // day, the same flag the parent's sheet sets. The child kinds already
    // pass the visibility rule, so this is for the routine pushes.
    auto_send_to_child: recursWeekday !== null,
    status: 'open',
  }
  // Provenance rides on migration 179, and migrations here are run by hand.
  // If the columns are not there yet the add still has to work, so the insert
  // retries bare: the row lands reading as parent added until 179 runs, which
  // is a wrong badge for a day, not a broken button.
  let saved = null
  let error = null
  {
    const res = await admin
      .from('school_actions')
      .insert({ ...row, added_by: 'child', added_by_child_id: link.child_id })
      .select('id, kind, title, due_date')
      .single()
    saved = res.error ? null : res.data
    error = res.error
  }
  if (!saved && error) {
    const res = await admin.from('school_actions').insert(row).select('id, kind, title, due_date').single()
    saved = res.error ? null : res.data
    error = res.error
  }
  if (!saved) return NextResponse.json({ error: error?.message ?? 'could not save' }, { status: 500 })

  // The grown up hears about it straight away, because a child editing the
  // family diary is exactly the kind of thing a parent wants to know happened.
  // Best effort, never blocks the save.
  try {
    const { data: child } = await admin.from('children').select('name').eq('id', link.child_id).maybeSingle()
    const who = (child?.name as string | undefined) || 'Your child'
    await sendPush({
      userId: link.user_id,
      title: `${who} added to the school diary 🎒`,
      body: title,
      url: '/dashboard/school',
    })
  } catch { /* best effort */ }

  await admin.from('kid_links').update({ last_seen_at: new Date().toISOString() }).eq('token', token)

  return NextResponse.json({ action: saved })
}
