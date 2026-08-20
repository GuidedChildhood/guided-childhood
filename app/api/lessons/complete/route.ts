import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// The pass mark for the end of lesson check: at least 70 percent of the
// choice questions right. A lesson with no choice slides passes on finishing.
const PASS_MARK = 0.7

export async function POST(req: NextRequest) {
  const { lesson_id, lesson_source, correct, total, child_id } = await req.json()
  if (!lesson_id || !['lesson', 'ai_lesson', 'school_lesson'].includes(lesson_source)) {
    return NextResponse.json({ error: 'missing or invalid lesson_id / lesson_source' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // Score this run. No questions in the deck means finishing is the pass.
  const totalQ = Number(total) || 0
  const correctQ = Math.min(Number(correct) || 0, totalQ)
  const passedNow = totalQ === 0 || correctQ / totalQ >= PASS_MARK

  // A pass is never taken away by a later wobbly replay: if an earlier run
  // already passed, the row stays passed and keeps its best score.
  const { data: existing } = await supabase
    .from('lesson_completions')
    .select('score, passed')
    .eq('user_id', user.id)
    .eq('lesson_id', lesson_id)
    .eq('lesson_source', lesson_source)
    .maybeSingle()
  const priorPassScore = existing?.passed === true ? existing.score ?? null : null
  const passed = passedNow || existing?.passed === true
  const score = totalQ === 0
    ? priorPassScore
    : passedNow
    ? Math.max(correctQ, priorPassScore ?? 0)
    : priorPassScore ?? correctQ

  // Whose lesson (migration 213, key 219): the completion belongs to the open
  // child, so Jody's pass stops marking Tray's library done. Checked, and null
  // (no child sent, or not theirs) stays the household row.
  let forChild: string | null = null
  if (typeof child_id === 'string' && child_id) {
    const { data: owned } = await supabase
      .from('children').select('id').eq('id', child_id).eq('parent_id', user.id).maybeSingle()
    forChild = owned?.id ?? null
  }

  const { error } = await supabase
    .from('lesson_completions')
    .upsert(
      { user_id: user.id, child_id: forChild, lesson_id, lesson_source, score, passed },
      { onConflict: 'user_id,child_id,lesson_id,lesson_source' }
    )

  if (error) {
    // Safety net for a deploy that lands moments before migration 079 is
    // applied: fall back to the plain completion write so nothing is lost.
    if (/column|schema/i.test(error.message)) {
      const { error: retryError } = await supabase
        .from('lesson_completions')
        .upsert(
          { user_id: user.id, child_id: forChild, lesson_id, lesson_source },
          { onConflict: 'user_id,child_id,lesson_id,lesson_source' }
        )
      if (retryError) return NextResponse.json({ error: retryError.message }, { status: 500 })
      return NextResponse.json({ ok: true, passed: true })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // WHO passed it, alongside the shared family row.
  //
  // lesson_completions cannot answer this: the child's own link upserts the
  // very same row, so either side doing a lesson looks like both. The road to
  // social media is the one place that difference matters, since a leg only
  // counts when the parent AND the child have each walked it. See migration 162
  // and lib/pathway/social-road.ts.
  //
  // child_id null: a parent watching a lesson is watching it for the family,
  // not for one child. Best effort throughout, because a missing row here costs
  // a tick on one card and must never cost somebody their pass.
  //
  // A plain insert, with the duplicate swallowed. Not an upsert: the uniqueness
  // is a PARTIAL index (one per lesson where child_id is null), and a partial
  // index is not a target PostgREST can name in an on conflict clause.
  if (passed && lesson_source === 'lesson') {
    try {
      // WHICH CHILD THE PARENT WATCHED IT FOR.
      //
      // This wrote child_id: null unconditionally, on the doctrine in migration
      // 162 that a parent watching a lesson watches it for the household.
      // Justin ended that on 18 August: "lessons are child related not family."
      // A parent who switched to Alma and sat down with her watched it for her.
      //
      // Checked, not trusted, and null when there is nothing to check, which is
      // exactly the old behaviour for a family with one child who never touches
      // the switcher.
      await supabase.from('lesson_pass_by')
        .insert({ user_id: user.id, lesson_id, who: 'parent', child_id: forChild })
    } catch { /* already recorded, or pre migration 162 */ }
  }

  return NextResponse.json({ ok: true, passed })
}

export async function DELETE(req: NextRequest) {
  const { lesson_id, lesson_source, child_id: forChild } = await req.json()
  if (!lesson_id || !['lesson', 'ai_lesson', 'school_lesson'].includes(lesson_source)) {
    return NextResponse.json({ error: 'missing or invalid lesson_id / lesson_source' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // Only THIS child's completion, mirroring the pass_by delete below. Without
  // the filter, un ticking a lesson on one child's page deleted every child's
  // row for it: the sibling's pass gone, from a page that never showed them.
  const del = supabase
    .from('lesson_completions')
    .delete()
    .eq('user_id', user.id)
    .eq('lesson_id', lesson_id)
    .eq('lesson_source', lesson_source)
  const { error } = await (typeof forChild === 'string' && forChild
    ? del.eq('child_id', forChild)
    : del.is('child_id', null))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // The parent's side of the social road goes with it. Only theirs: a parent
  // un ticking their own completion has not undone the lesson their child sat.
  try {
    // Only the PARENT's row, whichever child it was for. It used to match on
    // child_id is null, which was the same thing while every parent row had a
    // null child. Now that a parent's pass can name a child, matching on null
    // would leave the named ones behind for ever: the parent un ticks the
    // lesson, the card goes back to undone, and the road still counts their
    // side as walked.
    // forChild comes from the SAME parse as lesson_id above. A request body can
    // only be read once, so a second await req.json() here would throw.
    const del = supabase.from('lesson_pass_by')
      .delete().eq('user_id', user.id).eq('lesson_id', lesson_id).eq('who', 'parent')
    // No child named means the family wide row, which is exactly what this
    // matched before. Deliberately NOT "every parent row for this lesson": on an
    // account with three children that would un tick the other two as well,
    // from a page that never showed them.
    await (typeof forChild === 'string' && forChild
      ? del.eq('child_id', forChild)
      : del.is('child_id', null))
  } catch { /* pre migration 162 */ }

  return NextResponse.json({ ok: true })
}
