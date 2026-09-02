import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { markStep, streakCount } from '@/lib/kid/day-store'

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
// Then, the same day, from the star chart's print page in Safari: "When I
// click print here it should update the 1 of 5 jobs on child app and go back
// to the 5 a day marked as completed and onto next." The tick was landing
// (his row had it) but the answer was a bare ok, so the button that sent it
// could not tell whether it had just finished one of today's five or ticked
// nothing at all, and nothing moved on the screen.
//
// So the route now answers with the day as it stands: whether THIS print
// landed a step (ticked: it was one of today's five and was still open), what
// is done, whether the day is complete and the streak. The app uses ticked to
// walk the child back to their five with the next step lit; the print page
// uses the count to say so. A day without a printable in it, or one already
// ticked, answers ticked false and the child stays where they are.
//
// Still no completion, no stars, no push of its own. Printing is the child's
// part of a printable done, and it is the one moment every printable shares,
// whichever button they reach for. Sending a finished sheet still goes
// through printable-done, which ticks too, so the two are idempotent
// together. Token is the auth, exactly like quest ticks. Nothing here may
// fail the print: a broken day answers ok false and the paper still prints.

export async function POST(req: NextRequest) {
  const { token } = await req.json().catch(() => ({}))
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  try {
    const result = await markStep(supabase, link.user_id as string, link.child_id as string, 'printable')
    const streak = result.ok ? await streakCount(supabase, link.child_id as string) : 0
    return NextResponse.json({
      ok: true,
      ticked: result.ok && !result.already,
      steps: result.steps,
      done: result.done,
      complete: result.complete,
      justCompleted: result.justCompleted,
      holidayMinutes: result.holidayMinutes,
      streak,
    })
  } catch (err) {
    console.error('five a day: printable tick threw:', err)
    return NextResponse.json({ ok: false, ticked: false })
  }
}
