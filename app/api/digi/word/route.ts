import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// DiGi's word, read and answered. GET is the recent insights for this
// parent (the unread one first). POST moves one along: seen when the page
// opens, acted when the button is tapped, dismissed, and a reaction (helped
// or not) that also lands in digi_feedback so the weekly wisdom rebuild and
// the next insight both read it.

const COLS = 'id, child_id, title, body, href, cta, source, status, reaction, created_at'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { data } = await supabase.from('digi_prompts').select(COLS)
    .eq('user_id', user.id).eq('kind', 'insight').neq('status', 'dismissed')
    .order('created_at', { ascending: false }).limit(6)
  const words = data ?? []
  return NextResponse.json({ words, unread: words.filter(w => w.status === 'pending').length })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({} as { id?: string; status?: string; reaction?: string }))
  const id = typeof body.id === 'string' ? body.id : ''
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const status = ['seen', 'acted', 'dismissed'].includes(String(body.status)) ? String(body.status) : null
  const reaction = body.reaction === 'helped' || body.reaction === 'not' ? body.reaction : null
  if (!status && !reaction) return NextResponse.json({ error: 'nothing to change' }, { status: 400 })

  const patch: Record<string, unknown> = {}
  if (status) {
    patch.status = status
    if (status === 'seen') patch.seen_at = new Date().toISOString()
  }
  if (reaction) patch.reaction = reaction

  const { data: row, error } = await supabase.from('digi_prompts').update(patch)
    .eq('id', id).eq('user_id', user.id).eq('kind', 'insight')
    .select('id, child_id, title').maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })

  // The reaction is the learning signal. It goes where the wisdom rebuild
  // already looks, in the parent's own words shape, never as a score.
  if (reaction) {
    await supabase.from('digi_feedback').insert({
      user_id: user.id,
      child_id: row.child_id,
      question: `DiGi's word: ${row.title}`,
      parent_response: reaction === 'helped' ? 'That helped.' : 'That did not really help.',
      responded_at: new Date().toISOString(),
    }).then(() => {}, () => { /* best effort */ })
  }
  return NextResponse.json({ ok: true })
}
