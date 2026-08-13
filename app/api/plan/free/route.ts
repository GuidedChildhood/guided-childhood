import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Door two: no card, the free days they already have, and the DiGi limit.
//
// It records the ANSWER, not the access. trial_ends_at was written when
// setup finished and is not touched here, which is what makes the Home
// countdown able to read one field and not care which door was taken.
//
// The failure is reported rather than swallowed. This write is the only thing
// that lets a parent past the block, so a silent failure would leave them
// tapping a button that does nothing on the page in front of the app.
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { error } = await supabase
    .from('profiles')
    .update({ plan_choice: 'free', plan_choice_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) {
    return NextResponse.json({ error: 'Could not save that' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, plan: 'free' })
}
