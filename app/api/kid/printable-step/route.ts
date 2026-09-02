import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { markStepQuietly } from '@/lib/kid/day-store'

// The five a day's printable row, ticked because a printable was PRINTED.
//
// Justin, 2 September 2026: "make sure that it will complete one of the 5
// things as not doing that."
//
// It never did from the printables tab. The only caller of the tick was
// /api/kid/printable-done, reached from the one printable a grown up had
// assigned. The sheets on the tab sent "Finished the X sheet" through the
// quest ask pipeline instead, and the bucket list and star chart builders
// told nobody anything, so a child could print, colour and hand over a sheet
// and still see A printable sitting open on their day.
//
// This route ticks the row and nothing else: no completion, no stars, no
// push. Printing is the child's part of a printable done, and it is the one
// moment every printable shares, whichever button they reach for. Sending a
// finished sheet still goes through printable-done, which ticks too, so the
// two are idempotent together. Token is the auth, exactly like quest ticks.

export async function POST(req: NextRequest) {
  const { token } = await req.json().catch(() => ({}))
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  await markStepQuietly(supabase, link.user_id as string, link.child_id as string, 'printable')
  return NextResponse.json({ ok: true })
}
