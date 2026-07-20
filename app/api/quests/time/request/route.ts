import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { deviceLabel } from '@/lib/quests/device-time'
import { pushToChild } from '@/lib/quests/kid-push'

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

  // The answer lands on the child's own screen, never a silence. Approved:
  // one tap on Start and the timer runs. Declined: warm, stars safe.
  if (reqRow?.child_id) {
    try {
      await pushToChild(
        createAdminClient(), user.id, String(reqRow.child_id),
        status === 'approved' ? 'Your grown up said yes! ⭐' : 'Not right now 💛',
        status === 'approved'
          ? `Open your page and tap Start to begin your ${reqRow.minutes} minutes on the ${deviceLabel(String(reqRow.device))}.`
          : 'Your stars are safe. Ask again another time.',
      )
    } catch { /* push is best effort, the banner still says it */ }
  }
  return NextResponse.json({ ok: true })
}
