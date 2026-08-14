import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSetupState } from '@/lib/setup/flags'

// The next setup step for this parent, so the floating next step bar can walk
// them from one to the next across the app. Returns the next incomplete step,
// or null when the Setup Quest is done.
//
// It used to repeat the whole flag computation by hand, nine reads inline, a
// second copy of the same rules as lib/setup/flags.ts. That was survivable at
// seven steps and is not worth keeping at three: two copies of "what counts as
// done" is two answers to the same question, and the day they drift is the day
// the bar nags a parent about a step the page is already showing as green.
// One read, one set of rules, one answer.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { current } = await getSetupState(supabase, user.id)
  return NextResponse.json({ next: current, done: current === null })
}
