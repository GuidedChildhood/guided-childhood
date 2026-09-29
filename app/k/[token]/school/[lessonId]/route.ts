import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStarLesson } from '@/lib/quests/star-lesson-catalogue'

// Open one school lesson for the child, from their own list.
//
// Justin, 29 September 2026, chose "the child learns, the parent closes it":
// the child's lessons are the school modules for their stage, and they can
// start the next one themselves without a grown up sending it first. The
// star lesson machinery (kid_lesson_missions, the kid player, the stars, the
// push to the parent) already did everything else, so this only makes sure a
// mission row exists and sends the child into it.
//
// One mission per child per lesson, reused for every replay. The stars are
// paid once when that row first goes to done (app/api/quests/lesson-complete),
// so a replay can still pass the check and tick the passport but can never
// mint stars a second time.

export const dynamic = 'force-dynamic'

// The stars a self started lesson is worth: the same default a parent's send
// uses (app/api/quests/lessons).
const SELF_STARTED_STARS = 3

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string; lessonId: string }> }) {
  const { token, lessonId } = await params
  const home = new URL(`/k/${token}`, req.url)
  if (!/^[0-9a-f]{18}$/.test(token) || !/^[0-9a-f-]{36}$/.test(lessonId)) return NextResponse.redirect(home)

  const supabase = createAdminClient()
  const { data: link } = await supabase.from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.redirect(home)

  // The lesson has to be a real school lesson: there is no foreign key on the
  // mission row, so this is the only check between a bad id and a dead link.
  const lesson = await getStarLesson(supabase, lessonId, 'id')
  if (!lesson) return NextResponse.redirect(new URL(`/k/${token}/lessons`, req.url))

  const { data: existing } = await supabase
    .from('kid_lesson_missions')
    .select('id')
    .eq('child_id', link.child_id)
    .eq('lesson_id', lessonId)
    .order('sent_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  let missionId = existing?.id as string | undefined
  if (!missionId) {
    const { data: created } = await supabase
      .from('kid_lesson_missions')
      .insert({ user_id: link.user_id, child_id: link.child_id, lesson_id: lessonId, stars: SELF_STARTED_STARS, status: 'sent' })
      .select('id')
      .single()
    missionId = created?.id as string | undefined
  }
  if (!missionId) return NextResponse.redirect(new URL(`/k/${token}/lessons`, req.url))

  return NextResponse.redirect(new URL(`/k/${token}/lesson/${missionId}`, req.url))
}
