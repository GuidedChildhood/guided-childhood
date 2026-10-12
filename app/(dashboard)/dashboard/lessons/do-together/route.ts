import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sessionUser } from '@/lib/supabase/session'
import { getStarLesson } from '@/lib/quests/star-lesson-catalogue'
import { TOGETHER_COOKIE, TOGETHER_TTL_SECONDS, togetherToken } from '@/lib/lessons/together'

// DO IT TOGETHER, FROM THE GROWN UP'S OWN SESSION (plan v10, item 1.5).
//
// A lesson done together passes when every check question is answered,
// because the grown up is the check. So "together" is proved by the grown up's
// own signed in session, never by a link a child could visit: this route
// checks the child is theirs, sets a short lived signed httpOnly cookie naming
// the child and the lesson (lib/lessons/together), and hands over to the
// child's own opener, which finds or makes the mission and plays it on this
// phone. It is also the second go after a miss on a lesson with no spare
// questions, and the third go on any lesson.
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const childId = req.nextUrl.searchParams.get('child') ?? ''
  const lessonId = req.nextUrl.searchParams.get('lesson') ?? ''
  const back = new URL('/dashboard/lessons/path', req.url)
  if (!/^[0-9a-f-]{36}$/.test(childId) || !/^[0-9a-f-]{36}$/.test(lessonId)) return NextResponse.redirect(back)

  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  const [{ data: child }, { data: link }] = await Promise.all([
    supabase.from('children').select('id').eq('id', childId).eq('parent_id', user.id).maybeSingle(),
    supabase.from('kid_links').select('token').eq('child_id', childId).maybeSingle(),
  ])
  if (!child || !link?.token) return NextResponse.redirect(back)
  const lesson = await getStarLesson(createAdminClient(), lessonId, 'id')
  if (!lesson) return NextResponse.redirect(back)

  const res = NextResponse.redirect(new URL(`/k/${link.token}/school/${lessonId}`, req.url))
  res.cookies.set(TOGETHER_COOKIE, togetherToken(childId, lessonId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TOGETHER_TTL_SECONDS,
  })
  return res
}
