import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { deviceLabel } from '@/lib/quests/device-time'
import { pushToChild } from '@/lib/quests/kid-push'
import { jobsTodayCount } from '@/lib/pathway/jobs-streak'

// Resolve a child's ask first screen time request. Yes marks it approved and
// the child's own Start button begins the timer; not yet declines it warmly.
// Either way the child's device hears the answer straight away, best effort,
// and the banner on their screen says the same on the next poll. Scoped to
// the parent's own rows by session and RLS.

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id, status } = await req.json().catch(() => ({}))
  if (!id || !['approved', 'declined'].includes(status)) {
    return NextResponse.json({ error: 'id and status required' }, { status: 400 })
  }
  const { data: reqRow, error } = await supabase
    .from('device_requests').update({ status }).eq('id', id).eq('user_id', user.id)
    .select('child_id, device, minutes').maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // The day's jobs at a glance, so a yes is an informed one and both sides are
  // told to finish outstanding jobs first. Never a gate, just the count: the
  // child's own Start still works, this only nudges the order of the day.
  let jobsDue = 0
  let jobsDone = 0
  if (reqRow?.child_id && status === 'approved') {
    try {
      const today = new Date().toISOString().slice(0, 10)
      const { data: jq } = await supabase
        .from('family_quests')
        .select('id, schedule, schedule_days, created_at')
        .eq('user_id', user.id).eq('active', true)
        .or(`child_id.eq.${reqRow.child_id},child_id.is.null`)
      const { data: jt } = await supabase
        .from('quest_ticks').select('quest_id, tick_date, status')
        .eq('child_id', reqRow.child_id).eq('status', 'approved').eq('tick_date', today)
      const counts = jobsTodayCount(jq ?? [], jt ?? [])
      jobsDue = counts.due
      jobsDone = counts.done
    } catch { /* the yes still sends without the jobs count */ }
  }
  const jobsLeft = Math.max(0, jobsDue - jobsDone)

  // The answer lands on the child's own screen, never a silence. Approved:
  // one tap on Start and the timer runs, but if jobs are still to do today the
  // yes asks them to finish those first. Declined: warm, stars safe.
  if (reqRow?.child_id) {
    try {
      const mins = reqRow.minutes
      const dev = deviceLabel(String(reqRow.device))
      await pushToChild(
        createAdminClient(), user.id, String(reqRow.child_id),
        status === 'approved' ? 'Your grown up said yes! ⭐' : 'Not right now 💛',
        status === 'approved'
          ? jobsLeft > 0
            ? `First finish your ${jobsLeft} job${jobsLeft === 1 ? '' : 's'} for today, then open your page and tap Start for your ${mins} minutes on the ${dev}.`
            : `Open your page and tap Start to begin your ${mins} minutes on the ${dev}.`
          : 'Your stars are safe. Ask again another time.',
      )
    } catch { /* push is best effort, the banner still says it */ }
  }
  // The counts go back so the parent's board can echo the same nudge in place.
  return NextResponse.json({ ok: true, jobsDue, jobsDone, jobsLeft })
}
