import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'
import { getPrintable } from '@/lib/printables/registry'

// The parent confirms (or declines) a printable the child said they finished.
// GET lists what is waiting; POST decides one. On confirm the stars land
// through the star_bonuses ledger and the child's app flips to done, told
// two ways: an in app nudge (the reliable channel their poll reads) and a
// best effort push. Session auth, scoped to the parent's own rows by RLS.
//
// POST also takes a printable_key instead of an id, which is the parent
// recording a printable done themselves. A young child colouring at the table
// never taps "I did it", and a family with no child app never can, so without
// this the sheet is finished in real life and invisible in the app. Recording it
// lands the same confirmed row, the same stars and the same offline credit as a
// child led one, so the off screen total tells the truth either way.

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ items: [] })

  const { data, error } = await supabase
    .from('printable_completions')
    .select('id, child_id, printable_key, title, emoji, stars, created_at')
    .eq('user_id', user.id).eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) return NextResponse.json({ items: [] })

  const { data: kids } = await supabase.from('children').select('id, name').eq('parent_id', user.id)
  const nameOf = new Map((kids ?? []).map(k => [k.id as string, k.name as string]))
  const items = (data ?? []).map(r => ({
    id: r.id, title: r.title, emoji: r.emoji, stars: r.stars,
    childId: r.child_id,
    childName: (nameOf.get(r.child_id as string) && nameOf.get(r.child_id as string) !== 'Your child')
      ? nameOf.get(r.child_id as string) : 'Your child',
  }))
  return NextResponse.json({ items })
}

type SessionClient = Awaited<ReturnType<typeof createClient>>

// The parent says it is done. One confirmed row, the stars, the assignment
// cleared and the child told, all the same as a child led confirm. Already done
// is a quiet success, so a double tap never double awards.
async function recordDoneByParent(
  supabase: SessionClient,
  userId: string,
  printableKey: string,
  childIdIn: string | null,
) {
  const printable = getPrintable(printableKey)
  if (!printable) return NextResponse.json({ error: 'unknown printable' }, { status: 404 })

  // Which child: the one named, or the primary, and always the parent's own.
  let childId = childIdIn
  if (childId) {
    const { data: owned } = await supabase
      .from('children').select('id').eq('id', childId).eq('parent_id', userId).maybeSingle()
    if (!owned) return NextResponse.json({ error: 'unknown child' }, { status: 404 })
  } else {
    const { data: primary } = await supabase
      .from('children').select('id').eq('parent_id', userId)
      .order('is_primary', { ascending: false }).limit(1).maybeSingle()
    childId = (primary?.id as string | undefined) ?? null
  }
  if (!childId) return NextResponse.json({ error: 'no child yet' }, { status: 400 })

  const stars = printable.stars
  const nowIso = new Date().toISOString()

  // A child led ask already waiting is simply confirmed, so the two paths can
  // never both award. The guarded flip is the same gate the child path uses.
  const { data: existing, error: readErr } = await supabase
    .from('printable_completions')
    .select('id, status')
    .eq('user_id', userId).eq('child_id', childId).eq('printable_key', printableKey)
    .in('status', ['pending', 'confirmed'])
    .order('created_at', { ascending: false })
    .limit(1).maybeSingle()
  if (readErr) return NextResponse.json({ error: 'not ready', needsMigration: true }, { status: 409 })
  if (existing?.status === 'confirmed') return NextResponse.json({ ok: true, already: true })

  if (existing?.status === 'pending') {
    const { data: flipped } = await supabase
      .from('printable_completions')
      .update({ status: 'confirmed', decided_at: nowIso })
      .eq('id', existing.id).eq('user_id', userId).eq('status', 'pending')
      .select('id')
    if (!flipped || flipped.length === 0) return NextResponse.json({ ok: true, already: true })
  } else {
    const { error } = await supabase.from('printable_completions').insert({
      user_id: userId, child_id: childId,
      printable_key: printableKey, title: printable.title, emoji: printable.emoji,
      stars, status: 'confirmed', decided_at: nowIso,
    })
    if (error) {
      // A racing child tap got there first: their row is the record, nothing
      // more to do and nothing awarded twice.
      if (/duplicate|unique/i.test(error.message)) return NextResponse.json({ ok: true, already: true })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  // The stars land through the same ledger the bank reads.
  try {
    await supabase.from('star_bonuses').insert({
      user_id: userId, child_id: childId, stars,
      note: `Printable done: ${printable.title} 🖍️`,
    })
  } catch { /* the record still stands */ }

  // Clear the assignment so a sent sheet drops off the child's to do.
  try {
    await supabase.from('printable_assignments')
      .update({ cleared_at: nowIso })
      .eq('child_id', childId).eq('printable_key', printableKey).is('cleared_at', null)
  } catch { /* pre 089, nothing to clear */ }

  // Tell the child, so the stars arriving are never a mystery.
  const message = `Your ${printable.emoji} ${printable.title} is done! ${stars} stars are in your bank.`
  try {
    await supabase.from('kid_nudges').insert({ user_id: userId, child_id: childId, quest_id: null, message })
  } catch { /* pre migration 081, push only */ }
  try {
    await pushToChild(createAdminClient(), userId, childId, 'Printable done! ⭐', message)
  } catch { /* best effort */ }

  return NextResponse.json({ ok: true, stars })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { id, decision } = body

  // The parent recording it done: no pending row to decide, just the sheet and
  // (optionally) which child. Falls through to the child led path when an id is
  // given instead.
  if (!id && typeof body.printable_key === 'string') {
    return recordDoneByParent(supabase, user.id, body.printable_key, typeof body.child_id === 'string' ? body.child_id : null)
  }

  if (!id || typeof id !== 'string' || (decision !== 'confirm' && decision !== 'decline')) {
    return NextResponse.json({ error: 'id and decision required' }, { status: 400 })
  }

  // Read the pending row, scoped to this parent, so we know the child, stars
  // and title before we flip it.
  const { data: row } = await supabase
    .from('printable_completions')
    .select('id, child_id, printable_key, title, emoji, stars, status')
    .eq('id', id).eq('user_id', user.id).maybeSingle()
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (row.status !== 'pending') return NextResponse.json({ ok: true, already: true })

  // The flip IS the gate for the award: the database serialises the
  // pending -> decided transition, so only the request that actually moved a
  // row lands the stars. A concurrent double submit (two taps, a retry) finds
  // zero rows on the loser and awards nothing, so a 5 star printable can never
  // bank 10.
  const status = decision === 'confirm' ? 'confirmed' : 'declined'
  const { data: flipped, error } = await supabase
    .from('printable_completions')
    .update({ status, decided_at: new Date().toISOString() })
    .eq('id', id).eq('user_id', user.id).eq('status', 'pending')
    .select('id')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!flipped || flipped.length === 0) return NextResponse.json({ ok: true, already: true })

  const stars = Number(row.stars) || 5
  if (decision === 'confirm') {
    // The stars land through the ledger the bank already reads.
    try {
      await supabase.from('star_bonuses').insert({
        user_id: user.id, child_id: row.child_id, stars,
        note: `Printable done: ${row.title} 🖍️`,
      })
    } catch { /* the confirm still stands */ }

    // The child hears it two ways. The nudge is the reliable one their poll
    // reads; the push is the best effort buzz.
    const message = `Your ${row.emoji ?? '🖍️'} ${row.title} is confirmed! ${stars} stars are in your bank.`
    try {
      await supabase.from('kid_nudges').insert({
        user_id: user.id, child_id: row.child_id, quest_id: null, message,
      })
    } catch { /* pre migration 081, push only */ }
    try {
      await pushToChild(createAdminClient(), user.id, row.child_id as string, 'Printable confirmed! ⭐', message)
    } catch { /* best effort */ }
  } else {
    // Declined warmly: tell the child so it never just silently resets. Their
    // path node returns to tappable so they can have another go.
    const message = `Have another go at your ${row.emoji ?? '🖍️'} ${row.title}, then show your grown up again.`
    try {
      await supabase.from('kid_nudges').insert({
        user_id: user.id, child_id: row.child_id, quest_id: null, message,
      })
    } catch { /* pre migration 081 */ }
    try {
      await pushToChild(createAdminClient(), user.id, row.child_id as string, 'One more go 🖍️', message)
    } catch { /* best effort */ }
  }

  return NextResponse.json({ ok: true })
}
