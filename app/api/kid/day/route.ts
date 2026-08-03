import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { STEPS, type StepKey } from '@/lib/kid/five-a-day'
import { loadDay, streakCount, markStep } from '@/lib/kid/day-store'
import { isSchoolHoliday } from '@/lib/learning/holidays'
import { getFamilyRegion } from '@/lib/learning/region'

// The child's five a day: read it, and mark a step done.
//
// Same trust model as every other child route. The link token is the auth, there
// is no account and no login, and the token scopes everything to one child.
//
// The row is created on first read of the day rather than by a job, so a child
// who opens the app on a Tuesday gets a Tuesday, and a child who never opens it
// leaves no row. Nothing has to run overnight for the feature to work.
//
// The reading and ticking themselves live in lib/kid/day-store, because three
// other routes tick steps too now: passing a lesson, passing the quiz, and
// sending a printable to a grown up. This route is the list's own caller, not
// the owner of the rules.

export const dynamic = 'force-dynamic'

const VALID = new Set(Object.keys(STEPS) as StepKey[])

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

  // A printable is a holiday thing, not an everyday one.
  //
  // Justin: "printables should maybe be a holiday thing? Not every day to do?"
  // Colouring a sheet in is a holiday morning activity, and asking for one on a
  // school night competes with the homework that is actually due. Read against
  // the family's own region, so a US family is not offered a sheet because it is
  // half term in England.
  //
  // The freed slot goes to reading, which is already in the pool. Dropping
  // printable never empties the middle: five of the six rotating steps remain.
  const region = await getFamilyRegion(link.admin, link.userId).catch(() => 'uk' as const)

  // A lesson is a WEEKLY thing, not a daily one.
  //
  // Justin: "can we make sure the lessons for kids... we only feed one per week
  // at most."
  //
  // Two of the twelve rotating rows are learning (lesson and quiz), so on a bad
  // draw a child could meet one most days, and the Today list offers the focus
  // lesson alongside. A lesson a day is school, and this is the fifteen minutes
  // after school where a child has least appetite for more of it. One a week is
  // a thing to look forward to; five a week is a subject.
  //
  // Enforced through the SAME mechanism the printable already uses: a step that
  // cannot be completed must never be one of the five, because a child who
  // cannot finish the day can never earn the streak and has no way of knowing
  // why. So the row is simply not drawn once this week's lesson is done.
  //
  // The week is the last seven days rather than since Monday, deliberately. A
  // child who does their lesson on Sunday should not meet another on Monday
  // morning because a calendar boundary happened to fall between them.
  let lessonThisWeek = false
  try {
    const since = new Date(Date.now() - 7 * 86_400_000).toISOString()
    const { count } = await link.admin
      .from('kid_lesson_missions')
      .select('id', { count: 'exact', head: true })
      .eq('child_id', link.childId)
      .eq('status', 'done')
      .gte('completed_at', since)
    lessonThisWeek = (count ?? 0) > 0
  } catch { lessonThisWeek = false }

  const available = {
    printable: isSchoolHoliday(new Date(), region),
    // Fails soft to available: a read that cannot answer must not silently
    // remove a child's learning row for ever.
    lesson: !lessonThisWeek,
  }

  const { day, row } = await loadDay(link.admin, link.userId, link.childId, available)
  const streak = await streakCount(link.admin, link.childId)
  return NextResponse.json({
    day,
    steps: row.steps as StepKey[],
    done: row.done as StepKey[],
    complete: !!row.completed_at,
    streak,
  })
}

export async function POST(request: NextRequest) {
  const { token, step, available } = await request.json().catch(() => ({}))
  const link = await linkFor(typeof token === 'string' ? token : '')
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })
  if (typeof step !== 'string' || !VALID.has(step as StepKey)) {
    return NextResponse.json({ error: 'unknown step' }, { status: 400 })
  }

  const result = await markStep(link.admin, link.userId, link.childId, step as StepKey, available)
  if (!result.ok) {
    if (result.reason === 'not-part-of-today') {
      return NextResponse.json({ error: 'not part of today', steps: result.steps }, { status: 400 })
    }
    return NextResponse.json({ error: result.message ?? 'could not save' }, { status: 500 })
  }

  await link.admin.from('kid_links').update({ last_seen_at: new Date().toISOString() }).eq('token', token)

  const streak = await streakCount(link.admin, link.childId)
  return NextResponse.json({
    ok: true,
    done: result.done,
    // What the day just paid into the holiday bank, so the celebration can
    // name it. Zero on any day that was already finished.
    holidayMinutes: result.holidayMinutes,
    // justCompleted is what the celebration listens for. It is true only on the
    // transition, so a refresh of a finished day does not replay the takeover.
    justCompleted: result.justCompleted,
    complete: result.complete,
    streak,
  })
}
