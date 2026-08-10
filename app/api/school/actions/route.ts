import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendPush } from '@/lib/push/send'

// The parent's open school actions: the Things you need to know card reads
// them via the dashboard's server render and marks them done or dismissed
// through PATCH here. POST adds one by hand, for the school that never
// emails or the one off reminder DiGi would never catch on its own.

const KINDS = ['kit', 'payment', 'homework', 'event', 'deadline', 'notice'] as const

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('school_actions')
    .select('id, kind, title, detail, due_date, due_time, sent_to_child, recurs_weekday, auto_send_to_child')
    .eq('user_id', user.id)
    .eq('status', 'open')
    .order('due_date', { ascending: true, nullsFirst: false })
    .limit(20)
  return NextResponse.json({ actions: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const title = typeof body?.title === 'string' ? body.title.trim().slice(0, 140) : ''
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })
  // One stray character is a slip, not a reminder. Two is the floor rather
  // than three because PE is a real thing a parent types.
  if (title.length < 2) return NextResponse.json({ error: 'title too short' }, { status: 400 })

  const kind = KINDS.includes(body.kind) ? body.kind : 'notice'
  const detail = typeof body.detail === 'string' ? body.detail.trim().slice(0, 400) || null : null
  const dueDate = typeof body.due_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.due_date) ? body.due_date : null
  // A written time (dentist at 09:00) that lets the reminder escalate as it
  // nears. Only kept for a dated one off, never for a weekly routine.
  const dueTime = typeof body.due_time === 'string' && /^\d{2}:\d{2}$/.test(body.due_time) ? body.due_time : null
  const recursWeekday = Number.isInteger(body.recurs_weekday) && body.recurs_weekday >= 0 && body.recurs_weekday <= 6
    ? body.recurs_weekday
    : null
  const autoSendToChild = recursWeekday !== null && body.auto_send_to_child === true
  // School time or home life (migration 182). Only a weekly routine carries
  // it: school time routines rest through the school holidays.
  const runsInHolidays = recursWeekday !== null && body.runs_in_holidays === true

  // Already on the list? Then this is the same reminder being typed again, not
  // a second one. Justin's Thursday had PE kit, PE, Pe and Pr all open at once,
  // every one of them a fresh insert of a thing already there.
  //
  // Matched case insensitively on the same day, because Pe and PE are one
  // reminder and the database is the only place that can know it. A weekly
  // routine collides on its weekday, a one off on its date, and two undated
  // notices with the same title collide outright.
  //
  // It returns the row that already exists rather than erroring. The parent
  // wanted this reminder on this day, and it is: saying so is a better answer
  // than a red message, and it makes the save idempotent, which is what stops
  // a double tap on a slow phone leaving two behind.
  const { data: clash } = await supabase
    .from('school_actions')
    .select('id, kind, title, detail, due_date, due_time, sent_to_child, recurs_weekday, auto_send_to_child')
    .eq('user_id', user.id)
    .eq('status', 'open')
    // Escaped, because ilike reads % and _ as wildcards and a title is free
    // text: "50% day" unescaped would collide with half the list.
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

  const insertRow = {
    user_id: user.id, kind, title, detail,
    due_date: recursWeekday !== null ? null : dueDate,
    // A routine keeps no date, because a weekly thing has no single one. It
    // does have a time of day, and this used to throw it away: Cubs every
    // Tuesday stored a weekday and nothing else, so the child's card had no
    // when to show and no reminder could fire an hour before something whose
    // hour was never recorded.
    due_time: dueTime,
    recurs_weekday: recursWeekday,
    auto_send_to_child: autoSendToChild,
    status: 'open',
  }
  // runs_in_holidays lands with migration 182, run by hand, so the insert
  // retries without it rather than failing the save before the SQL has run.
  let { data, error } = await supabase
    .from('school_actions')
    .insert({ ...insertRow, runs_in_holidays: runsInHolidays })
    .select('id, kind, title, detail, due_date, due_time, sent_to_child, recurs_weekday, auto_send_to_child')
    .single()
  if (error) {
    const retry = await supabase
      .from('school_actions')
      .insert(insertRow)
      .select('id, kind, title, detail, due_date, due_time, sent_to_child, recurs_weekday, auto_send_to_child')
      .single()
    data = retry.data
    error = retry.error
  }
  if (error || !data) return NextResponse.json({ error: error?.message ?? 'could not save' }, { status: 500 })

  // Tell both phones it has been added, with a link that adds it straight to
  // their calendar. Best effort, so a push hiccup never blocks the save.
  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
    const ics = `${origin}/api/school/${data.id}/ics`
    const send = (extra: Record<string, unknown>) => sendPush({ userId: user.id, title: `Added: ${title} 🎒`, body: 'Tap to add it to your calendar.', url: ics, ...extra })
    await Promise.allSettled([send({}), send({ audience: 'kids' })])
  } catch { /* best effort */ }

  return NextResponse.json({ action: data })
}

export async function PATCH(req: NextRequest) {
  const { id, status, clear_today, edit } = await req.json()
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // Editing in place. Justin, 10 August 2026: "a way for them to click in
  // and simply stop it edit it if wrong." Stop already existed (Done and
  // Dismiss); this is the edit half, taking the same fields as POST and
  // keeping the row's identity, history and sent to child state.
  if (edit && typeof edit === 'object') {
    const title = typeof edit.title === 'string' ? edit.title.trim().slice(0, 140) : ''
    if (title.length < 2) return NextResponse.json({ error: 'title too short' }, { status: 400 })
    const kind = KINDS.includes(edit.kind) ? edit.kind : 'notice'
    const dueDate = typeof edit.due_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(edit.due_date) ? edit.due_date : null
    const dueTime = typeof edit.due_time === 'string' && /^\d{2}:\d{2}$/.test(edit.due_time) ? edit.due_time : null
    const recursWeekday = Number.isInteger(edit.recurs_weekday) && edit.recurs_weekday >= 0 && edit.recurs_weekday <= 6
      ? edit.recurs_weekday
      : null
    const patch = {
      kind, title,
      due_date: recursWeekday !== null ? null : dueDate,
      due_time: dueTime,
      recurs_weekday: recursWeekday,
      auto_send_to_child: recursWeekday !== null && edit.auto_send_to_child === true,
      // A fixed reminder starts fresh: a routine cleared for today that gets
      // its day changed should show on the new day, not stay stepped back.
      cleared_on: null,
    }
    // Same soft landing as POST: runs_in_holidays waits on migration 182.
    let { error } = await supabase
      .from('school_actions')
      .update({ ...patch, runs_in_holidays: recursWeekday !== null && edit.runs_in_holidays === true })
      .eq('id', id).eq('user_id', user.id)
    if (error) {
      const retry = await supabase.from('school_actions').update(patch).eq('id', id).eq('user_id', user.id)
      error = retry.error
    }
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const { data } = await supabase
      .from('school_actions')
      .select('id, kind, title, detail, due_date, due_time, sent_to_child, recurs_weekday, auto_send_to_child, cleared_on')
      .eq('id', id).eq('user_id', user.id)
      .maybeSingle()
    return NextResponse.json({ ok: true, action: data ?? null })
  }

  // Clear a weekly routine for today only: it stays open and comes back on its
  // next day, rather than being marked done or removed. The date is stamped
  // server side so a client clock can never fake it.
  if (clear_today === true) {
    const today = new Date().toISOString().slice(0, 10)
    const { error } = await supabase
      .from('school_actions').update({ cleared_on: today }).eq('id', id).eq('user_id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (!['done', 'dismissed'].includes(status)) {
    return NextResponse.json({ error: 'missing or invalid id / status' }, { status: 400 })
  }
  const { error } = await supabase
    .from('school_actions').update({ status }).eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
