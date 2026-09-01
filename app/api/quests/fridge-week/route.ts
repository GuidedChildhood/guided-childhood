import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { starWeekStart, previousStarWeekStart, formatWeekBeginning } from '@/lib/quests/star-week'
import { sendPush } from '@/lib/push/send'

// The paper chart week, entered into the app. A family who ran the week on
// the fridge star chart taps in the stars the child earned offline, and they
// land in the same star_bonuses ledger the bank reads, spendable as screen
// time exactly like app earned stars.
//
// WEEK AWARE AND IDEMPOTENT from 10 August 2026. Justin: "parents should be
// able to enter the charts results on their app end of week to give stars if
// not done on child's phone." The old shape had no week identity at all, so
// entering twice doubled the stars and a Monday morning entry silently
// credited last week's paper to nothing in particular. Now:
//
//   The week rides in the note (the only free column the ledger has without
//   a migration), as `Star chart, week of YYYY-MM-DD`.
//
//   Entry REPLACES that child's rows for that week: read what is there,
//   delete by the same filter, insert the new total. Entering again is how a
//   parent corrects a slip, never how stars double.
//
//   Only this star week or the last one is accepted, computed server side.
//   End of week entry means Sunday night or Monday morning; arbitrary
//   backfill would turn a typo into a ledger archaeology problem.
//
// Accepted quirks, stated rather than hidden: the read, delete, insert is
// not one transaction through PostgREST, so a racing double submit can land
// twice, but the delete is by filter, so the very next entry for that week
// sweeps both and converges (the UI also disables the button while saving).
// A failed insert after the delete UNDER credits until the parent retries,
// which is the right way round. And the bank buckets bonuses into its weekly
// figure by created_at, so a Last week entry counts toward the CURRENT bank
// week's capped number; the all time balance, the number a child can spend,
// is exact either way, and entry happens at the week's end anyway.
//
// Legacy rows with note 'Fridge chart, this week' predate the week identity
// and are never matched, never deleted, never doubled. They stay what they
// were: stars honestly given.

const MAX_WEEK = 70 // five daily jobs across a week, plus a generous margin

export async function POST(req: NextRequest) {
  const { childId, stars, weekStart } = await req.json().catch(() => ({}))
  if (!childId || typeof childId !== 'string') {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const total = Math.round(Number(stars))
  if (!Number.isFinite(total) || total < 1 || total > MAX_WEEK) {
    return NextResponse.json({ error: 'bad stars' }, { status: 400 })
  }
  const validWeeks = [starWeekStart(), previousStarWeekStart()]
  if (typeof weekStart !== 'string' || !validWeeks.includes(weekStart)) {
    return NextResponse.json({ error: 'bad week' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data: child } = await supabase
    .from('children').select('id, name').eq('id', childId).eq('parent_id', user.id).maybeSingle()
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })

  const note = `Star chart, week of ${weekStart}`

  // What is already there for this child and week, so the response can say
  // updated rather than added and the ledger never double counts.
  const { data: existing, error: readError } = await supabase
    .from('star_bonuses')
    .select('id, stars')
    .eq('user_id', user.id)
    .eq('child_id', childId)
    .eq('note', note)
  if (readError) {
    if (/relation|does not exist|schema|constraint/i.test(readError.message)) {
      return NextResponse.json({ error: 'not ready', needsMigration: true }, { status: 409 })
    }
    return NextResponse.json({ error: readError.message }, { status: 500 })
  }
  const replaced = (existing ?? []).reduce((sum, r) => sum + (Number(r.stars) || 0), 0)

  // Delete by the same filter rather than by ids, so rows a racing submit
  // slipped in are swept too and the week converges on the entered total.
  if ((existing ?? []).length > 0) {
    const { error: delError } = await supabase
      .from('star_bonuses')
      .delete()
      .eq('user_id', user.id)
      .eq('child_id', childId)
      .eq('note', note)
    if (delError) return NextResponse.json({ error: delError.message }, { status: 500 })
  }

  // Chunk into rows of at most 20 to respect the ledger's per row check.
  const rows: { user_id: string; child_id: string; stars: number; note: string }[] = []
  let left = total
  while (left > 0) {
    const chunk = Math.min(20, left)
    rows.push({ user_id: user.id, child_id: childId, stars: chunk, note })
    left -= chunk
  }

  const { error } = await supabase.from('star_bonuses').insert(rows)
  if (error) {
    if (/relation|does not exist|schema|constraint/i.test(error.message)) {
      return NextResponse.json({ error: 'not ready', needsMigration: true }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // The child hears their paper week landed. Best effort, never awaited for
  // the response: a push hiccup must not read as a failed entry.
  try {
    void sendPush({
      userId: user.id,
      audience: 'kids',
      // The stars were banked for one child; only that child's phone hears it.
      childId,
      title: 'Your star chart stars landed ⭐',
      body: `${total} star${total === 1 ? '' : 's'} in the bank from your week beginning ${formatWeekBeginning(weekStart)}.`,
    }).catch(() => {})
  } catch { /* best effort */ }

  return NextResponse.json({ ok: true, added: total, replaced, updated: replaced > 0 })
}
