import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// The parent has closed the share step themselves.
//
// Justin, 17 August 2026: "if we are saying share screens is done when they
// either skip or say done it needs to tick off set up to be able to move onto
// next set up step."
//
// Two doors reach here and they write the same thing: "I have shared it" and
// "I will run it on my phone". The difference matters to the words on the day
// and to nothing downstream, because both mean the child's side is handled and
// both should stop the step asking. See migration 204.
//
// It is deliberately NOT the same as the two answers that already existed. A
// kid_links row means the code was genuinely generated; children.no_phone means
// there is no device at all and lib/handover/settled.ts owns the six month
// re-offer for it. This is the third case, the one that had no answer: a parent
// who has dealt with it and wants to get on.
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // `is null` so the first answer is the one that sticks. The monthly reminder
  // is measured from this, and a parent who taps through the step twice should
  // not have their clock restarted by the second tap.
  const { error } = await supabase
    .from('profiles')
    .update({ child_app_settled_at: new Date().toISOString() })
    .eq('id', user.id)
    .is('child_app_settled_at', null)

  // Before migration 204 the column is not there. The caller checks the
  // response and shows a retry, so a deploy that ran the code and not the
  // migration tells the parent honestly rather than going green over nothing.
  if (error) return NextResponse.json({ error: 'not saved' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
