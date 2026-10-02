import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// The reminders a parent asked DiGi for, listed in the DiGi chat, each one
// cancellable. The second rail on DiGi's tools: anything DiGi writes that
// reaches the parent later has to be visible now and easy to call off.
//
// The user's own client, so RLS (migration 359) does the scoping.

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data, error } = await supabase
    .from('digi_reminders')
    .select('id, body, remind_at, repeat_days')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .order('remind_at', { ascending: true })
    .limit(10)

  // Before migration 359 the table is not there. An empty list, not an error,
  // so the chat looks exactly as it did.
  if (error) return NextResponse.json({ reminders: [] })
  return NextResponse.json({ reminders: data ?? [] })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const id = new URL(request.url).searchParams.get('id') ?? ''
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'bad request' }, { status: 400 })

  // Marked cancelled rather than deleted, so a reminder that went missing can
  // always be explained.
  const { error } = await supabase
    .from('digi_reminders')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('status', 'pending')
  if (error) return NextResponse.json({ error: 'could not cancel' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
