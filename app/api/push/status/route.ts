import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Does this ACCOUNT already have check ins on, anywhere?
//
// Notification.permission only ever answers for the browser asking, so a parent
// who turned check ins on inside the installed app on their phone was still
// being told "Important step: turn on your daily check ins" on their laptop,
// forever, with no way to dismiss it. The card had no idea the job was done.
//
// The subscriptions table knows, because it is per device and per account. One
// row anywhere means this parent has done the setup at least once.

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    const admin = createAdminClient()
    const { count } = await admin
      .from('push_subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('child_id', null)
    return NextResponse.json({ devices: count ?? 0 })
  } catch {
    // Unknown is not the same as none. Answering 0 here would put the big
    // setup card back in front of a parent who has already done it, which is
    // the exact thing this endpoint exists to stop.
    return NextResponse.json({ devices: null })
  }
}
