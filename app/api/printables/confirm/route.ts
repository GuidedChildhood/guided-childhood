import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'

// The parent confirms (or declines) a printable the child said they finished.
// GET lists what is waiting; POST decides one. On confirm the stars land
// through the star_bonuses ledger and the child's app flips to done, told
// two ways: an in app nudge (the reliable channel their poll reads) and a
// best effort push. Session auth, scoped to the parent's own rows by RLS.

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ items: [] })

  const { data, error } = await supabase
    .from('printable_completions')
    .select('id, child_id, printable_key, title, emoji, stars, created_at')
    .eq('user_id', user.id).eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) return NextResponse.json({ items: [] })

  const { data: kids } = await supabase.from('children').select('id, name').eq('parent_id', user.id)
  const nameOf = new Map((kids ?? []).map(k => [k.id as string, k.name as string]))
  const items = (data ?? []).map(r => ({
    id: r.id, title: r.title, emoji: r.emoji, stars: r.stars,
    childId: r.child_id,
    childName: (nameOf.get(r.child_id as string) && nameOf.get(r.child_id as string) !== 'Your child')
      ? nameOf.get(r.child_id as string) : 'Your child',
  }))
  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id, decision } = await req.json().catch(() => ({}))
  if (!id || typeof id !== 'string' || (decision !== 'confirm' && decision !== 'decline')) {
    return NextResponse.json({ error: 'id and decision required' }, { status: 400 })
  }

  // Read the pending row, scoped to this parent, so we know the child, stars
  // and title before we flip it.
  const { data: row } = await supabase
    .from('printable_completions')
    .select('id, child_id, printable_key, title, emoji, stars, status')
    .eq('id', id).eq('user_id', user.id).maybeSingle()
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (row.status !== 'pending') return NextResponse.json({ ok: true, already: true })

  const status = decision === 'confirm' ? 'confirmed' : 'declined'
  const { error } = await supabase
    .from('printable_completions')
    .update({ status, decided_at: new Date().toISOString() })
    .eq('id', id).eq('user_id', user.id).eq('status', 'pending')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (decision === 'confirm') {
    // The stars land through the ledger the bank already reads.
    try {
      await supabase.from('star_bonuses').insert({
        user_id: user.id, child_id: row.child_id, stars: Number(row.stars) || 5,
        note: `Printable done: ${row.title} 🖍️`,
      })
    } catch { /* the confirm still stands */ }

    // The child hears it two ways. The nudge is the reliable one their poll
    // reads; the push is the best effort buzz.
    const message = `Your ${row.emoji ?? '🖍️'} ${row.title} is confirmed! ${Number(row.stars) || 5} stars are in your bank.`
    try {
      await supabase.from('kid_nudges').insert({
        user_id: user.id, child_id: row.child_id, quest_id: null, message,
      })
    } catch { /* pre migration 081, push only */ }
    try {
      await pushToChild(createAdminClient(), user.id, row.child_id as string, 'Printable confirmed! ⭐', message)
    } catch { /* best effort */ }
  }

  return NextResponse.json({ ok: true })
}
