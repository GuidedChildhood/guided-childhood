import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Are check ins on, and specifically are they on for THE DEVICE ASKING?
//
// This used to answer only the account question: one row anywhere means the
// setup is done. That was the right fix for the problem it was built for (a
// parent being told "Important step" on their laptop forever after setting it up
// on their phone) and it was wrong about the thing that actually matters.
//
// Push delivery is per device. A subscription is one browser on one machine, so
// a parent subscribed on their laptop and not on their phone gets NOTHING on the
// phone. The card read the account count, found one, and said "Check ins are on.
// Nothing more to do." On the phone in their hand that sentence was false, and it
// is exactly why Justin's pings never arrived: the app was telling him the job
// was finished on the one device where it had never been started.
//
// So the answer needs both numbers. The account count still stops the nagging on
// a second device, and thisDevice is what decides whether this browser will ever
// hear anything.

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // The caller passes its own endpoint when it has one. No endpoint means the
  // browser has no subscription at all, which is itself the answer.
  const endpoint = request.nextUrl.searchParams.get('endpoint')

  try {
    const admin = createAdminClient()
    const { count } = await admin
      .from('push_subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('child_id', null)

    let thisDevice = false
    if (endpoint) {
      const { count: mine } = await admin
        .from('push_subscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('endpoint', endpoint)
      thisDevice = (mine ?? 0) > 0
    }

    return NextResponse.json({ devices: count ?? 0, thisDevice })
  } catch {
    // Unknown is not the same as none. Answering 0 here would put the big
    // setup card back in front of a parent who has already done it, which is
    // the exact thing this endpoint exists to stop. thisDevice stays null for
    // the same reason: do not claim a device is unsubscribed on a lookup that
    // simply failed.
    return NextResponse.json({ devices: null, thisDevice: null })
  }
}
