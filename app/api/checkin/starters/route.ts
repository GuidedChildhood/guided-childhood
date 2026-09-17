import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { resolveWorry } from '@/lib/concerns/normalise'
import { raiseConcern } from '@/lib/concerns/raise'

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
// safety rule rather than a tidiness one. Remove here DELETES the row, which is
// the honest thing to do with a worry that was never meant and has no history
// yet. The same call a fortnight later would throw away a fortnight of
// readings, the weekly email's comparison and any passport stamp earned from
// it. After day one the way to finish with a worry is to say it is going great,
// which rests it and keeps every reading it ever had.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await request.json() as { action?: string; id?: string; text?: string; childId?: string | null }
  const action = body.action

  // The gate. A missing column reads as not confirmed, which is the safe way
  // round here: the screen that calls this cannot appear at all unless the
  // loader also saw it missing and sent everyone straight to the stars.
  const { data: profile } = await supabase
    .from('profiles').select('concerns_confirmed_at').eq('id', user.id).maybeSingle()
  if ((profile as { concerns_confirmed_at?: string | null } | null)?.concerns_confirmed_at) {
    return NextResponse.json({ error: 'The starting list is already confirmed' }, { status: 409 })
  }

  if (action === 'remove') {
    if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    // Scoped to this parent by the query as well as by RLS, because a delete is
    // the one verb where being wrong is not recoverable.
    const { error } = await supabase
      .from('concerns').delete().eq('id', body.id).eq('user_id', user.id)
    if (error) return NextResponse.json({ error: 'could not remove' }, { status: 500 })
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

  return NextResponse.json({ error: 'action must be add or remove' }, { status: 400 })
}
