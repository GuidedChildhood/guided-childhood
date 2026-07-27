import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The daily chest on the child's pathway. It only opens on a day a real job
// was ticked, and opening it drops one bonus star in the bank through the
// star_bonuses ledger (migration 086). One chest a day, checked server side,
// so the path stays a game and never a loophole. Token is the auth, exactly
// like quest ticks.

export async function POST(req: NextRequest) {
  const { token } = await req.json().catch(() => ({}))
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // The chest only opens on a day with a real job behind it.
  const today = new Date().toISOString().slice(0, 10)
  const { data: ticks } = await supabase
    .from('quest_ticks')
    .select('id, child_id, status')
    .eq('user_id', link.user_id)
    .eq('tick_date', today)
    .neq('status', 'rejected')
    .limit(50)
  const hasJob = (ticks ?? []).some(t => t.child_id === link.child_id || t.child_id === null)
  if (!hasJob) return NextResponse.json({ error: 'no job yet' }, { status: 400 })

  // One chest a day, enforced on the ledger itself.
  const { data: already, error: readErr } = await supabase
    .from('star_bonuses')
    .select('id')
    .eq('user_id', link.user_id)
    .eq('child_id', link.child_id)
    .ilike('note', 'Path chest%')
    .gte('created_at', `${today}T00:00:00Z`)
    .limit(1)
    .maybeSingle()
  if (readErr) {
    // Before migration 086 the ledger does not exist: the chest stays shut
    // rather than pretending, and the client shows it plainly.
    return NextResponse.json({ error: 'not ready', needsMigration: true }, { status: 409 })
  }
  if (already) return NextResponse.json({ error: 'already opened today' }, { status: 409 })

  const { error } = await supabase.from('star_bonuses').insert({
    user_id: link.user_id, child_id: link.child_id, stars: 1,
    note: 'Path chest: a job done today ⭐',
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // The grown up hears the good news, best effort: a job ticked and the
  // pathway rewarding it is exactly what they want to know is working.
  try {
    const { data: child } = await supabase.from('children').select('name').eq('id', link.child_id).maybeSingle()
    const name = child?.name && child.name !== 'Your child' ? child.name : 'Your child'
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
    await fetch(`${origin}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
      body: JSON.stringify({
        userId: link.user_id,
        title: `${name} opened today's path chest 🎁`,
        body: `A job ticked and 1 bonus star banked on the pathway. The loop is working.`,
        url: '/dashboard/quests',
      }),
    })
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, stars: 1 })
}
