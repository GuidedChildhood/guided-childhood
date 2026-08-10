import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The child printed the star chart from their own app.
//
// One row in star_chart_prints, the same record the parent's builder writes,
// because the question the quest board's badge asks is "does the fridge have
// a sheet for Monday", not "which phone pressed print". A child printing
// their own chart quiets the parent's To print and For Monday badges with no
// changes to board-status at all.
//
// Same trust model as the rest of the child app: the link token is the auth,
// and the row is stamped with this child's id, which the parent's builder
// never does (it prints for the family). Fired from the print button and
// deliberately never awaited by the caller: pressing print IS the act, and a
// failed write must never stand between a child and their paper.

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const token = typeof body?.token === 'string' ? body.token : ''
  if (!/^[0-9a-f]{18}$/.test(token)) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const admin = createAdminClient()
  const { data: link } = await admin
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // Validated as a date rather than trusted, the same rule and the same
  // reason as the parent route: this value decides whether the family gets
  // the weekend nudge, and a junk value should read as "printed, week
  // unknown" rather than nag or silence anybody.
  const week = typeof body?.weekStart === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.weekStart) ? body.weekStart : null

  const { error } = await admin
    .from('star_chart_prints')
    .insert({ user_id: link.user_id, child_id: link.child_id, week_start: week })
  if (error) return NextResponse.json({ error: 'not saved' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
