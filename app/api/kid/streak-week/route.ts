import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { starWeekStart } from '@/lib/quests/star-week'

// The child has seen this week's streak screen, so it does not come back until
// next Monday.
//
// Justin, 8 August 2026: the streak "come up once per week so reminds them once
// per week what they have achieved, as we show streaks in other places."
//
// The week is stamped from the SERVER's clock, not from anything the client
// sends. A device with the wrong date would otherwise write a week key that
// never matches, and the screen would be either stuck open or gone for good.
//
// Fails soft before migration 172. The column not being there means the screen
// behaves as it did, which is to say it shows on a completed day, and that is a
// far better failure than a child's home screen erroring over a bookmark.

export async function POST(req: NextRequest) {
  const { token } = await req.json().catch(() => ({}))
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const week = starWeekStart()
  const { error } = await supabase
    .from('children')
    .update({ streak_week_seen: week })
    .eq('id', link.child_id)

  if (error) return NextResponse.json({ ok: true, week, needsMigration: true })
  return NextResponse.json({ ok: true, week })
}
