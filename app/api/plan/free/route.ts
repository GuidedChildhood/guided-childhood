import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { trialEndsAtFromNow } from '@/lib/config/trial'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Path two: no card, four free days, and then the standard rate.
//
// It records the ANSWER and makes sure the clock is running. No founder place
// is held and none is counted, which is the whole difference between the two
// paths and is enforced by this route simply never touching Stripe.
//
// ── WHY THE SERVICE ROLE, AND WHY THIS WAS BROKEN ───────────────────────────
//
// This used to write plan_choice with the parent's own client, and it could
// not have worked. Migration 175 revoked the table wide UPDATE grant on
// profiles and granted back nineteen columns by name. plan_choice arrived
// later, in migration 191, and was never added to that list, so `authenticated`
// holds no privilege on it: PostgREST rejects the write and the no card door
// answers "That did not save" every time.
//
// The grant is right and the client was wrong. plan_choice must NOT be
// writable from a browser, because a parent who can write it can set it to
// 'founder' and walk past the one screen in the product that asks for money,
// exactly as the free trial and subscription_status could be self granted
// before 175 closed them. So the rule moves to the server, where the session
// decides who is asking and nothing in the body does.
//
// trial_ends_at is on the same footing and for the same reason, which is why
// starting the clock is done here too rather than by the page.

export async function POST() {
  // Who is asking is decided by their session, never by anything in the body.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const admin = createAdminClient()

  const { error } = await admin
    .from('profiles')
    .update({ plan_choice: 'free', plan_choice_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) {
    // Reported rather than swallowed. This write is the only thing that lets a
    // parent past the block, so a silent failure leaves them tapping a button
    // that does nothing on the screen in front of the app they just set up.
    return NextResponse.json({ error: 'Could not save that' }, { status: 500 })
  }

  // Belt and braces on the clock. Setup normally starts it, but a parent whose
  // trial grant failed on a flaky connection would otherwise take the no card
  // path and land straight on the paywall with no free days at all, which is
  // the worst possible reading of the offer they just accepted.
  //
  // Same once ever guard as /api/trial/start: the filters are on the update, so
  // this can never restart days that are already running or hand a second trial
  // to somebody who has had one.
  await admin
    .from('profiles')
    .update({
      trial_ends_at: await trialEndsAtFromNow(),
      trial_started_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .is('trial_ends_at', null)
    .neq('subscription_status', 'active')

  return NextResponse.json({ ok: true, plan: 'free' })
}
