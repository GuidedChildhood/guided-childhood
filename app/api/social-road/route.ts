import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// "We did this one together": the parent marking the CHILD's side of a leg.
//
// A leg of the road to social media only counts when both sides have walked it,
// and the child's side normally lands on its own when they pass the lesson on
// their link. Not every family has the child on the app, and plenty of these
// eighteen lessons are better done side by side on a sofa than alone on a phone
// (Nudes, the law and sextortion is not homework). Without this the road would
// be permanently half ticked for those families, which would make the whole
// card read as broken rather than as a thing they had done.
//
// So the parent can say it happened. It is recorded exactly as the child's pass
// is recorded, because that is what it is: this child has now covered this
// lesson. The button says together in as many words, so nobody is ticking a box
// they think means something else.

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { childId, lessonId } = await req.json().catch(() => ({}))
  if (!childId || typeof childId !== 'string' || !lessonId || typeof lessonId !== 'string') {
    return NextResponse.json({ error: 'childId and lessonId required' }, { status: 400 })
  }

  // Their own child, and a real social media lesson. Neither is taken on trust
  // from the body: this writes a row that unlocks a leg of the road.
  const [{ data: child }, { data: lesson }] = await Promise.all([
    supabase.from('children').select('id').eq('id', childId).eq('parent_id', user.id).maybeSingle(),
    supabase.from('lessons').select('id').eq('id', lessonId)
      .eq('audience', 'parent').eq('category', 'social media').eq('status', 'live').maybeSingle(),
  ])
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })
  if (!lesson) return NextResponse.json({ error: 'not a road lesson' }, { status: 404 })

  // A plain insert with the duplicate swallowed, the same shape the two lesson
  // routes use: the uniqueness here is a partial index, which is not a target
  // an on conflict clause can name through PostgREST.
  const { error } = await supabase.from('lesson_pass_by')
    .insert({ user_id: user.id, lesson_id: lessonId, who: 'child', child_id: childId })
  if (error && !/duplicate|unique/i.test(error.message)) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
