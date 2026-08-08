import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The child's path has shown the unlock celebration for these stickers, so
// mark them celebrated and the moment never repeats. Token is the auth, exactly
// like the quest ticks and printable done routes. Fails soft before migration
// 109 (the column simply does not exist yet).
//
// WHY IT UPSERTS RATHER THAN UPDATES.
//
// Justin, 8 August 2026, watching Pebble arrive over and over: the animation
// "should be only once".
//
// It updated, and an update over a row that is not there yet changes nothing.
// On the LIVE path, the path where a child finishes their fifth day and the
// Friend arrives in front of them, the earned_stickers row does not exist at
// that moment: it is written by the reconcile on the NEXT read. So the one
// thing that makes the moment once ever quietly did nothing, and the only guard
// left was a localStorage note, which an in app browser drops. Hence the
// replays, and hence a child watching the same rocket every time they came back
// to the app.
//
// Writing the row here closes it. The unique index on (child_id, sticker_key)
// makes it idempotent, the reconcile that writes the same row later hits the
// conflict and leaves the celebrated flag alone, and the child gets the moment
// exactly once on every device they own.

export async function POST(req: NextRequest) {
  const { token, keys } = await req.json().catch(() => ({}))
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token) || !Array.isArray(keys)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const clean = keys.filter((k): k is string => typeof k === 'string').slice(0, 40)
  if (clean.length === 0) return NextResponse.json({ ok: true })

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const { error } = await supabase
    .from('earned_stickers')
    .upsert(
      clean.map(sticker_key => ({
        user_id: link.user_id,
        child_id: link.child_id,
        sticker_key,
        celebrated: true,
        reason: 'seen on the child app',
      })),
      { onConflict: 'child_id,sticker_key' },
    )
  if (error) return NextResponse.json({ ok: true, needsMigration: true })
  return NextResponse.json({ ok: true })
}
