import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { REPLY_MAX, cleanLine, type DealChangeAsk } from '@/lib/deal/change-requests'

export const dynamic = 'force-dynamic'

// The grown up's side of the child's ask to change the deal (migration 381).
//
// GET   the asks waiting on an answer, with each child's name.
// POST  { id, answer: 'yes' | 'not_now' | 'talk', reply? } answers one.
//
// Row level security scopes both to this parent's own family; the explicit
// user_id filters say the same thing again so the intent reads in the code.
// Not behind the paywall on purpose: a child who made their case calmly gets
// an answer whatever plan the family is on.

const SELECT = 'id, child_id, promise_title, wish, reason, status, parent_reply, decided_at, created_at'
const ANSWERS = new Set(['yes', 'not_now', 'talk'])

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data, error } = await supabase
    .from('deal_change_requests').select(SELECT)
    .eq('user_id', user.id).eq('status', 'pending')
    .order('created_at', { ascending: true })
  // Before 381 is applied the table is missing: nothing is waiting.
  if (error) return NextResponse.json({ asks: [] })

  const asks = (data ?? []) as DealChangeAsk[]
  const ids = [...new Set(asks.map(a => a.child_id))]
  const names: Record<string, string> = {}
  if (ids.length) {
    const { data: kids } = await supabase.from('children').select('id, name').in('id', ids)
    for (const k of kids ?? []) names[k.id as string] = (k.name as string | null) ?? 'Your child'
  }
  return NextResponse.json({ asks: asks.map(a => ({ ...a, child_name: names[a.child_id] ?? 'Your child' })) })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const id = typeof body?.id === 'string' && /^[0-9a-f-]{36}$/.test(body.id) ? body.id : null
  const answer = typeof body?.answer === 'string' && ANSWERS.has(body.answer) ? body.answer : null
  if (!id || !answer) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const reply = cleanLine(body?.reply, REPLY_MAX) || null

  // Only an ask still waiting can be answered, so a double tap or a second
  // device cannot overwrite the first answer the child has already read.
  const { data, error } = await supabase
    .from('deal_change_requests')
    .update({ status: answer, parent_reply: reply, decided_at: new Date().toISOString() })
    .eq('id', id).eq('user_id', user.id).eq('status', 'pending')
    .select(SELECT).maybeSingle()
  if (error) return NextResponse.json({ error: 'Did not save' }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Already answered' }, { status: 409 })

  return NextResponse.json({ ok: true, ask: data })
}
