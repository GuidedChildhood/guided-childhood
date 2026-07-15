import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    .select('id, kind, title, detail, due_date, sent_to_child, recurs_weekday, auto_send_to_child')
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

  const kind = KINDS.includes(body.kind) ? body.kind : 'notice'
  const detail = typeof body.detail === 'string' ? body.detail.trim().slice(0, 400) || null : null
  const dueDate = typeof body.due_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.due_date) ? body.due_date : null
  const recursWeekday = Number.isInteger(body.recurs_weekday) && body.recurs_weekday >= 0 && body.recurs_weekday <= 6
    ? body.recurs_weekday
    : null
  const autoSendToChild = recursWeekday !== null && body.auto_send_to_child === true

  const { data, error } = await supabase
    .from('school_actions')
    .insert({
      user_id: user.id, kind, title, detail,
      due_date: recursWeekday !== null ? null : dueDate,
      recurs_weekday: recursWeekday,
      auto_send_to_child: autoSendToChild,
      status: 'open',
    })
    .select('id, kind, title, detail, due_date, sent_to_child, recurs_weekday, auto_send_to_child')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Tell both phones it has been added, with a link that adds it straight to
  // their calendar. Best effort, so a push hiccup never blocks the save.
  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
    const ics = `${origin}/api/school/${data.id}/ics`
    const send = (extra: Record<string, unknown>) => fetch(`${origin}/api/push/send`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.CRON_SECRET}` },
      body: JSON.stringify({ userId: user.id, title: `Added: ${title} 🎒`, body: 'Tap to add it to your calendar.', url: ics, ...extra }),
    })
    await Promise.allSettled([send({}), send({ audience: 'kids' })])
  } catch { /* best effort */ }

  return NextResponse.json({ action: data })
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  if (!id || !['done', 'dismissed'].includes(status)) {
    return NextResponse.json({ error: 'missing or invalid id / status' }, { status: 400 })
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('school_actions').update({ status }).eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
