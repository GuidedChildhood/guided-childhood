import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The child's path has shown the unlock celebration for these stickers, so
// mark them celebrated and the moment never repeats. Token is the auth, exactly
// like the quest ticks and printable done routes. Fails soft before migration
// 109 (the column simply does not exist yet).

export async function POST(req: NextRequest) {
  const { token, keys } = await req.json().catch(() => ({}))
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token) || !Array.isArray(keys)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const clean = keys.filter((k): k is string => typeof k === 'string').slice(0, 40)
  if (clean.length === 0) return NextResponse.json({ ok: true })

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const { error } = await supabase
    .from('earned_stickers')
    .update({ celebrated: true })
    .eq('child_id', link.child_id)
    .in('sticker_key', clean)
  if (error) return NextResponse.json({ ok: true, needsMigration: true })
  return NextResponse.json({ ok: true })
}
