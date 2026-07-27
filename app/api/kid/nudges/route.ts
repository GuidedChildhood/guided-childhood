import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The child taps a nudge away: it is marked seen and never shows again. The
// kid link token is the auth, same trust model as ticking, and the update is
// scoped hard to that child's own rows.

export async function POST(req: NextRequest) {
  const { token, ids } = await req.json().catch(() => ({}))
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const list = Array.isArray(ids) ? ids.filter((i): i is string => typeof i === 'string').slice(0, 20) : []
  if (list.length === 0) return NextResponse.json({ ok: true })

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // Fails soft before migration 081: without the table there is nothing to
  // mark, and the child's screen already dropped the card locally.
  try {
    await supabase.from('kid_nudges')
      .update({ seen: true })
      .eq('child_id', link.child_id)
      .in('id', list)
  } catch { /* pre migration database */ }
  return NextResponse.json({ ok: true })
}
