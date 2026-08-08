import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { trialEndsFromNow } from '@/lib/access'

// Start the free trial, once, ever.
//
// Justin, 8 August 2026: "we must make sure real users can not continue without
// subscribing."
//
// The trial used to be granted by the browser: the starter pack finished and
// wrote trial_ends_at straight onto the parent's own profile row. Two things
// were wrong with that and only one of them is obvious.
//
// The obvious one is that a client write can be repeated. Run the starter pack
// again, or call the same update from the console, and the four days start
// again, for ever.
//
// The other is that granting it client side REQUIRED the column to be writable
// by `authenticated`, and the same grant let anyone set subscription_status to
// active and take the whole product. Migration 175 closes that, and closing it
// is what makes this route necessary rather than merely tidier.
//
// SO THE RULE LIVES HERE, on the server, with the service role:
//
//   never had a trial   grant it, four days from now
//   had one already     say so and change nothing, whether it is running or
//                       long expired
//   already paying      change nothing. A subscriber does not need a trial and
//                       writing one would only muddy what their status means.
//
// The check and the write are one statement. Reading first and writing second
// leaves a gap two tabs can both pass through, and the whole point of this
// route is that the grant happens exactly once.

export async function POST() {
  // Who is asking is decided by their session, never by anything in the body.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  // Grant only when trial_ends_at is still null AND they are not already
  // paying. Expressed as filters on the update rather than as an if, so two
  // requests racing cannot both see null and both write.
  const { data, error } = await admin
    .from('profiles')
    .update({ trial_ends_at: trialEndsFromNow() })
    .eq('id', user.id)
    .is('trial_ends_at', null)
    .neq('subscription_status', 'active')
    .select('trial_ends_at')

  if (error) return NextResponse.json({ error: 'could not start the trial' }, { status: 500 })

  // No rows changed means they had one already, which is not a failure and must
  // not read as one to the caller: the starter pack carries on either way.
  const granted = (data ?? []).length > 0
  return NextResponse.json({ ok: true, granted })
}
