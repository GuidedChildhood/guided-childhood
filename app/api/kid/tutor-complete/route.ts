import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPush } from '@/lib/push/send'

// A child finished the tutor lesson their grown up sent.
//
// Token is the auth, exactly like every other tick on the child's side. The
// stars are the ones on the row, decided when the parent sent it and never
// taken from the client, so a child cannot post themselves a better score.
//
// ── WHY THESE STARS DO NOT NEED APPROVING ───────────────────────────────────
//
// Chores go through the parent approve loop because we cannot see whether the
// bins went out. A lesson is different: the doing of it happened here, in the
// player, and the parent already agreed to the whole thing when they sent it.
// Star lessons have worked this way since they were built, and this is the same
// shape.
//
// ── AND NOTHING ABOUT HOW THEY DID IS STORED ────────────────────────────────
//
// The player sends its correct and total counts, which every completion
// endpoint accepts, and this one deliberately writes neither. We hold no
// assessment data about a child and are not starting now. done_at says they
// finished it. The rest is theirs, and the parent hears that it happened rather
// than how it went.

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { token?: string; lesson_id?: string }
  const { token, lesson_id: lessonId } = body
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  if (!lessonId || typeof lessonId !== 'string' || !/^[0-9a-f-]{36}$/.test(lessonId)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const { data: lesson } = await supabase
    .from('tutor_lessons')
    .select('id, child_id, title, stars, sent_at, done_at')
    .eq('id', lessonId)
    .maybeSingle()
  if (!lesson || lesson.child_id !== link.child_id) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  if (!lesson.sent_at) return NextResponse.json({ error: 'not found' }, { status: 404 })
  // A replay is welcome and pays nothing. Reading it again is a good thing for
  // a child to do, and it must not be a way to print stars.
  if (lesson.done_at) return NextResponse.json({ stars: 0, already_done: true })

  // The done_at guard in the update is what actually makes this once only. Two
  // taps arriving together both pass the read above; only one of them matches
  // `is('done_at', null)` and comes back with a row.
  const { data: updated, error } = await supabase
    .from('tutor_lessons')
    .update({ done_at: new Date().toISOString() })
    .eq('id', lesson.id)
    .is('done_at', null)
    .select('id')
  if (error) return NextResponse.json({ error: 'update failed' }, { status: 500 })
  if (!updated || updated.length === 0) return NextResponse.json({ stars: 0, already_done: true })

  try {
    const { data: child } = await supabase
      .from('children').select('name').eq('id', link.child_id).maybeSingle()
    await sendPush({
      userId: link.user_id,
      title: `${child?.name ?? 'Your child'} finished their lesson 📘`,
      body: `${lesson.title}. ${lesson.stars} star${lesson.stars === 1 ? '' : 's'} landed in their bank.`,
      url: '/dashboard',
    })
  } catch { /* push is best effort, the stars are already banked */ }

  return NextResponse.json({ stars: lesson.stars })
}
