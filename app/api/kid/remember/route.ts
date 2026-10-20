import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizeAnswers, recordQuestionAnswers } from '@/lib/lessons/answers'
import { loadRememberCheck, markRemember } from '@/lib/kid/remember-server'

// A Remember check finished on the child's own link (lib/kid/remember-due.ts).
// Token is the auth. The server rebuilds the due questions and marks each
// answer against them; the phone's tally is never read. Each answer lands under
// source 'remember' against its lesson, which is what moves the next date and
// what the passport reads as "kept". No stars, no stamp.

export async function POST(req: NextRequest) {
  let body: { token?: string; answers?: unknown }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }
  const { token } = body
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { data: link } = await supabase.from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const check = await loadRememberCheck(supabase, { userId: link.user_id, childId: link.child_id })
  if (!check.questions.length) return NextResponse.json({ ok: true, right: 0, total: 0, nothingDue: true })
  const marking = markRemember(check.questions, sanitizeAnswers(body.answers))
  for (const m of marking.marked) {
    await recordQuestionAnswers(
      supabase,
      { userId: link.user_id, childId: link.child_id, source: 'remember', lessonId: m.lessonId },
      [{ question: m.question, chosen: m.chosen, correct: m.correct }],
    )
  }
  return NextResponse.json({ ok: true, right: marking.right, total: marking.total })
}
