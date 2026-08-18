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

  // ── IT MUST TELL THE TRUTH, AND IT WAS NOT ────────────────────────────────
  //
  // Justin, 18 August 2026: "still when I click done on adding to home screen
  // it's not updating as done on setup."
  //
  // This returned 200 with { ok: false } on a failed write. That was written
  // for the ONLY caller it had at the time, the standalone ping, which fires and
  // forgets and genuinely should not care. Then the Done and Skip buttons
  // started using the same route, and they check `res.ok`, which is TRUE on a
  // 200. So a rejected write looked exactly like a successful one: the button
  // stopped spinning, router.refresh() ran, and the step stayed open with no
  // error anywhere.
  //
  // That is the same shape as the check in fault on 15 August and the third time
  // this pattern has cost a day: a failure dressed as a success, and a surface
  // downstream that then cannot explain itself.
  //
  // 500 now. The standalone ping already wraps its fetch in .catch() and ignores
  // the result, so nothing regresses for it, and the buttons can finally show
  // "that did not save" when it did not.
  if (error) {
    // Named in the response so the browser network tab says what went wrong,
    // rather than the next person having to reproduce it blind.
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
