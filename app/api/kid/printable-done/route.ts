import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPrintable } from '@/lib/printables/registry'

// The child did a printable at home and taps "show my grown up". That writes
// a PENDING completion here (keyed by the stable printable key) and pings the
// parent to confirm it. The stars land only when the parent confirms, so the
// printable is a real thing done together, not a self award. Token is the
// auth, exactly like quest ticks. Fails soft before migration 087.

export async function POST(req: NextRequest) {
  const { token, printable_key } = await req.json().catch(() => ({}))
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token) || typeof printable_key !== 'string') {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const printable = getPrintable(printable_key)
  if (!printable) return NextResponse.json({ error: 'unknown printable' }, { status: 404 })

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // Already confirmed today or already waiting: nothing more to do, return the
  // current state so the app can render it.
  const { data: existing, error: readErr } = await supabase
    .from('printable_completions')
    .select('status')
    .eq('user_id', link.user_id).eq('child_id', link.child_id).eq('printable_key', printable_key)
    .in('status', ['pending', 'confirmed'])
    .order('created_at', { ascending: false })
    .limit(1).maybeSingle()
  if (readErr) return NextResponse.json({ error: 'not ready', needsMigration: true }, { status: 409 })
  if (existing) return NextResponse.json({ ok: true, status: existing.status })

  const { error } = await supabase.from('printable_completions').insert({
    user_id: link.user_id, child_id: link.child_id,
    printable_key, title: printable.title, emoji: printable.emoji, stars: printable.stars,
  })
  // A racing double tap trips the pending unique index: treat it as already
  // pending, never an error.
  if (error && !/duplicate|unique/i.test(error.message)) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // The grown up is asked to confirm, best effort push. Their phone opens the
  // quests board where the confirm control lives.
  try {
    const { data: child } = await supabase.from('children').select('name').eq('id', link.child_id).maybeSingle()
    const name = child?.name && child.name !== 'Your child' ? child.name : 'Your child'
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
    await fetch(`${origin}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
      body: JSON.stringify({
        userId: link.user_id,
        title: `${name} finished a printable 🖍️`,
        body: `${printable.emoji} ${printable.title}. Have a look and confirm it to land their ${printable.stars} stars.`,
        url: '/dashboard/quests',
      }),
    })
  } catch { /* best effort */ }

  return NextResponse.json({ ok: true, status: 'pending' })
}
