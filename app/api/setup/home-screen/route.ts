import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// The app has just been opened from the home screen. Stamp it once.
//
// This is the write half of the third Setup Quest step, and the whole design
// of it is in what CALLS this: InstallPrompt, and only when the browser
// reports display-mode: standalone. That is the browser telling us the app is
// genuinely on a home screen and was launched from there. It is never called
// from the "Done, it is on my Home Screen" button, which is a parent's
// assertion rather than a fact, and a step that ticks on an assertion is the
// same fault as a step that ticks on being looked at.
//
// Written once and never moved. The column is "when this first became true",
// so a parent who opens the app from their home screen every morning for a
// year rewrites nothing, and the one row that matters is not churned by the
// most common event in the product.
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // `is null` rather than a read then a write. One statement, so two tabs
  // opening at once cannot both decide it is unset and race to stamp it.
  const { error } = await supabase
    .from('profiles')
    .update({ home_screen_at: new Date().toISOString() })
    .eq('id', user.id)
    .is('home_screen_at', null)

  // Before migration 197 the column does not exist and this fails. The caller
  // fires and forgets, so a deploy that has run the code and not the migration
  // simply leaves the step to be finished by turning reminders on, which is
  // the other half of it. Nothing a parent can see breaks.
  if (error) return NextResponse.json({ ok: false }, { status: 200 })
  return NextResponse.json({ ok: true })
}
