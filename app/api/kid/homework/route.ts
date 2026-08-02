import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { markStep } from '@/lib/kid/day-store'
import { ukToday } from '@/lib/kid/five-a-day'

// What the child wrote down for their homework, saved, and the step ticked.
//
// The note IS the completion. "Homework done" used to be a self tick that
// recorded nothing, which is the weakest thing a row can be: no parent could see
// what was set and the child got no credit for the work itself. Writing it down
// is the act, so saving the note is what marks the step.
//
// Same trust model as the rest of the child app: the link token is the auth,
// there is no account, and the token scopes everything to one child.

export const dynamic = 'force-dynamic'

// Long enough for a real homework list, short enough that nobody can paste a
// novel into a child's row. A note over the limit is trimmed rather than
// refused: losing a child's typing to a validation error would be the worst
// outcome here.
const MAX_NOTE = 2000

async function linkFor(token: string) {
  if (!/^[0-9a-f]{18}$/.test(token)) return null
  const admin = createAdminClient()
  const { data } = await admin
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  return data ? { admin, userId: data.user_id as string, childId: data.child_id as string } : null
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''
  const link = await linkFor(token)
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // Today's note, so reopening the row shows what was already written rather
  // than an empty box that looks like the save was lost.
  const { data } = await link.admin
    .from('kid_homework_notes').select('note')
    .eq('child_id', link.childId).eq('day', ukToday()).maybeSingle()
  return NextResponse.json({ note: (data as { note?: string } | null)?.note ?? '' })
}

export async function POST(request: NextRequest) {
  const { token, note } = await request.json().catch(() => ({}))
  const link = await linkFor(typeof token === 'string' ? token : '')
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const text = typeof note === 'string' ? note.trim().slice(0, MAX_NOTE) : ''
  if (!text) return NextResponse.json({ error: 'nothing written' }, { status: 400 })

  // The note is best effort and the tick is not.
  //
  // This row is one of a child's five, and the five are what the streak is made
  // of. Refusing the step because the note could not be stored would hold a
  // child's whole day, and their run, hostage to a migration they cannot see and
  // cannot do anything about: before 147 the table does not exist, and every
  // child on that build would simply stop being able to finish a day.
  //
  // So the child's day always moves. A lost note is a server side problem that
  // shows up in the logs and in `saved`; it is not the child's to carry.
  const day = ukToday()
  const { error } = await link.admin.from('kid_homework_notes').upsert({
    user_id: link.userId,
    child_id: link.childId,
    day,
    note: text,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'child_id,day' })
  if (error) console.error('homework note not stored:', error.message)

  const result = await markStep(link.admin, link.userId, link.childId, 'homework')
  await link.admin.from('kid_links').update({ last_seen_at: new Date().toISOString() }).eq('token', token)

  return NextResponse.json({
    ok: true,
    // Whether the writing itself was kept. False means the step still ticked and
    // the child's day still moved, but the note did not land.
    saved: !error,
    // Not an error when homework was not one of today's five: the note is still
    // worth keeping, and a child should never be told their writing did not
    // count because of a checklist they cannot see.
    marked: result.ok,
    justCompleted: result.justCompleted,
    holidayMinutes: result.holidayMinutes,
  })
}
