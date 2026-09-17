import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { resolveWorry } from '@/lib/concerns/normalise'
import { raiseConcern } from '@/lib/concerns/raise'
import { logConcernEventById } from '@/lib/concerns/events'

// THE DAY ONE LIST, EDITABLE WHILE IT IS STILL DAY ONE.
//
// Justin, 17 September 2026: "maybe we should just acknowledge they are added
// to solve first and are on next day ... and if any more moments to add so we
// keep addressing the issues and helping until they go away."
//
// Reading your own worries back is the moment you remember the one you forgot,
// and the moment you notice the one the app guessed at that does not apply. So
// the acknowledgement screen can add and remove, and this is what it calls.
//
// ── IT ONLY WORKS BEFORE THE LIST IS CONFIRMED ──────────────────────────────
//
// Both actions are refused once concerns_confirmed_at is set, and that is a
// safety rule rather than a tidiness one: after day one, a worry leaves the
// check in by being rated going great twice, which keeps every reading it ever
// had. This screen is the one moment where a parent can sort the list before
// any of that history exists.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await request.json() as { action?: string; id?: string; on?: boolean; text?: string; childId?: string | null }
  const action = body.action

  // The gate. A missing column reads as not confirmed, which is the safe way
  // round here: the screen that calls this cannot appear at all unless the
  // loader also saw it missing and sent everyone straight to the stars.
  const { data: profile } = await supabase
    .from('profiles').select('concerns_confirmed_at').eq('id', user.id).maybeSingle()
  if ((profile as { concerns_confirmed_at?: string | null } | null)?.concerns_confirmed_at) {
    return NextResponse.json({ error: 'The starting list is already confirmed' }, { status: 409 })
  }

  // ── ALREADY FINE, WHICH IS NOT THE SAME AS NEVER HAPPENED ────────────────
  //
  // Justin, 17 September 2026, looking at the day one screen: "surely not us is
  // a bad option? Should be let's fix or fixed?"
  //
  // He is right twice over. "Not us" was a judgement about a family rather than
  // a statement about a situation, and worse, it DELETED the row. Two things
  // wrong with that:
  //
  //   A worry that was never theirs and a worry they have already sorted both
  //   end up off the check in, but only one of them is nothing. "We fixed the
  //   Switch at bedtime last year" is the best news in the account and the old
  //   button threw it in the bin.
  //
  //   Deleting is the only irreversible verb in this product, and it was sitting
  //   on a screen a parent sees in their first two minutes, next to a list the
  //   app itself guessed at.
  //
  // So it rests the worry instead, which is the rule this product already has
  // for a thing that is going well: off the check in, kept in the record, and
  // it comes back on its own if a moment or DiGi raises it again. It is
  // reversible, because a parent who taps the wrong row should not need us.
  //
  // NO SCORE IS WRITTEN. Resting through a status rather than a top band
  // reading is the whole point of day one: the first real number still lands
  // tomorrow, with a day of watching behind it, rather than being invented here
  // to make a row disappear.
  if (action === 'sorted') {
    if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const sorted = body.on !== false
    // Scoped to this parent in the query as well as by RLS. Row level security
    // is the floor, not the whole wall.
    const { error } = await supabase
      .from('concerns')
      .update({ status: sorted ? 'resolved' : 'open', last_checked_at: new Date().toISOString() })
      .eq('id', body.id).eq('user_id', user.id)
    if (error) return NextResponse.json({ error: 'could not save' }, { status: 500 })
    // The record of the tap, so the passport's solved side and the weekly email
    // can tell an already fine from a worked on and fixed.
    if (sorted) {
      await logConcernEventById(supabase, user.id, body.id, { event: 'resolved', source: 'onboarding' })
    }
    return NextResponse.json({ ok: true })
  }

  if (action === 'add') {
    // THEIR WORDS, OUR SPELLING WHERE IT IS ONE OF OURS. Same resolveWorry the
    // sign up answer goes through, so a worry typed here and the same worry
    // typed at sign up land on ONE row that shares the scripts and pathway
    // content already written for it, rather than a lonely near duplicate. A
    // genuinely new worry keeps their words, tidied and never corrected.
    const worry = resolveWorry(String(body.text ?? ''))
    if (!worry.slug) return NextResponse.json({ error: 'Type the worry first' }, { status: 400 })
    const slug = await raiseConcern(supabase, user.id, body.childId ?? null, {
      slug: worry.slug, label: worry.label, source: 'onboarding',
    })
    if (!slug) return NextResponse.json({ error: 'could not add' }, { status: 500 })
    return NextResponse.json({ ok: true, slug, label: worry.label })
  }

  return NextResponse.json({ error: 'action must be add or sorted' }, { status: 400 })
}
