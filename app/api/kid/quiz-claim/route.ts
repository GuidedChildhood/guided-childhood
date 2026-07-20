import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { quizByKey } from '@/lib/content/school-quizzes'

// The school quiz behind the path character. Pass four of five and two bonus
// stars land through the star_bonuses ledger, one quiz a day, checked server
// side against the real quiz so a made up score cannot pay. Token is the
// auth, exactly like quest ticks, and everything fails soft before
// migration 086.

const PASS_MARK = 0.8

export async function POST(req: NextRequest) {
  const { token, quizKey, correct } = await req.json().catch(() => ({}))
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token) || typeof quizKey !== 'string') {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const quiz = quizByKey(quizKey)
  if (!quiz) return NextResponse.json({ error: 'unknown quiz' }, { status: 404 })
  const total = quiz.questions.length
  const right = Math.min(Math.max(0, Number(correct) || 0), total)
  if (right / total < PASS_MARK) {
    return NextResponse.json({ error: 'not passed' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const today = new Date().toISOString().slice(0, 10)
  const { data: already, error: readErr } = await supabase
    .from('star_bonuses')
    .select('id')
    .eq('user_id', link.user_id)
    .eq('child_id', link.child_id)
    .ilike('note', 'Path quiz%')
    .gte('created_at', `${today}T00:00:00Z`)
    .limit(1)
    .maybeSingle()
  if (readErr) return NextResponse.json({ error: 'not ready', needsMigration: true }, { status: 409 })
  if (already) return NextResponse.json({ error: 'already claimed today' }, { status: 409 })

  const { error } = await supabase.from('star_bonuses').insert({
    user_id: link.user_id, child_id: link.child_id, stars: 2,
    note: `Path quiz passed: ${quiz.title} (${right} of ${total}) ⭐`,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, stars: 2 })
}
