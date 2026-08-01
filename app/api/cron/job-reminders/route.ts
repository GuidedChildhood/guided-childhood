import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'
import { bandForQuest, isBand, bandLabelOn, type JobBand } from '@/lib/quests/job-time'
import { isRegion, DEFAULT_REGION } from '@/lib/learning/region'

// A nudge on the child's own phone, at the hour the job can still be done.
//
// Justin: "jobs still outstanding but around job time, either before school or
// after school, so clever enough that bed not made before, clothes ready for
// tomorrow, so looks at job type and works out timely reminder."
//
// Three firings a day, one per band, and the band is worked out from the job's
// own words (lib/quests/job-time.ts). Telling a child at 8pm that their bed is
// not made is worse than saying nothing: the moment has gone and all it does is
// end the day on a telling off. Telling them at 7:15 is a help.
//
// The restraint here is deliberate and is the difference between a reminder and
// a nag:
//   - ONE push per child per band, however many jobs are outstanding. A child
//     with five things left gets one message, not five.
//   - Nothing at all when nothing is outstanding, so a child who is on top of
//     it never hears from us. Being quiet when there is nothing to say is what
//     makes the message mean something when it arrives.
//   - Only children with their own app and a push subscription. There is no
//     fallback to the parent, because chasing a parent about their child's bed
//     is the nagging this product exists to replace.
//
// This is a child facing notification, so it stays a plain factual reminder
// about a thing they agreed to. No streaks at risk, no countdowns, nothing
// engineered to pull them back into the app. The ICO Children's Code is
// explicit that nudges must not be used to keep a child engaged, and a reminder
// that a job is undone is a different thing from a reminder that we miss them.

export const dynamic = 'force-dynamic'

type Quest = { id: string; title: string; user_id: string; child_id: string | null; schedule: string | null; schedule_days: number[] | null; band: string | null }

/** Does this quest fall today? Mirrors the board's own rules. */
function dueToday(q: Quest, dow: number): boolean {
  if (Array.isArray(q.schedule_days) && q.schedule_days.length > 0) return q.schedule_days.includes(dow)
  switch (q.schedule) {
    case 'weekdays': return dow >= 1 && dow <= 5
    case 'weekend': return dow === 0 || dow === 6
    default: return true
  }
}

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const raw = url.searchParams.get('band')
  if (!isBand(raw)) {
    return NextResponse.json({ error: 'band must be morning, after_school or evening' }, { status: 400 })
  }
  const band: JobBand = raw

  const admin = createAdminClient()
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const dow = now.getDay()

  // Only children who actually have their own app. No link, no push, and no
  // point in the parent hearing about it either.
  const { data: links } = await admin.from('kid_links').select('child_id, user_id')
  if (!links || links.length === 0) return NextResponse.json({ ok: true, sent: 0, reason: 'no linked children' })

  const childIds = links.map(l => l.child_id as string)

  const [{ data: questRows }, { data: tickRows }, { data: kidRows }, { data: profileRows }] = await Promise.all([
    admin.from('family_quests').select('id, title, user_id, child_id, schedule, schedule_days, band').eq('active', true).in('child_id', childIds),
    admin.from('quest_ticks').select('quest_id, child_id, status').eq('tick_date', today).in('child_id', childIds),
    admin.from('children').select('id, name').in('id', childIds),
    // The family's own school calendar. Scottish and US terms differ enough
    // that "after school" would be wrong for weeks at a time if we assumed
    // England for everyone.
    admin.from('profiles').select('id, school_region').in('id', [...new Set(links.map(l => l.user_id as string))]),
  ])

  const quests = (questRows ?? []) as Quest[]
  // Anything ticked today counts as handled, pending included: the child has
  // done their part and is waiting on a grown up, so chasing them would be
  // wrong and would read as us not noticing.
  const handled = new Set((tickRows ?? []).filter(t => t.status !== 'rejected').map(t => `${t.child_id}|${t.quest_id}`))
  const nameOf = new Map((kidRows ?? []).map(k => [k.id as string, (k.name as string) ?? 'you']))
  const regionOf = new Map((profileRows ?? []).map(p => [p.id as string, isRegion(p.school_region) ? p.school_region : DEFAULT_REGION]))

  let sent = 0
  for (const link of links) {
    const childId = link.child_id as string
    const userId = link.user_id as string

    const outstanding = quests.filter(q =>
      q.child_id === childId &&
      dueToday(q, dow) &&
      // The band the family chose, falling back to the guess from the title
      // for every job written before they could choose.
      bandForQuest(q) === band &&
      !handled.has(`${childId}|${q.id}`)
    )
    if (outstanding.length === 0) continue

    // One message, naming one job. Naming the actual job is what makes it
    // useful rather than a number a child learns to swipe away.
    const first = outstanding[0].title
    const more = outstanding.length - 1
    const name = nameOf.get(childId)
    const title = outstanding.length === 1 ? 'One job left' : `${outstanding.length} jobs left`
    // What to call the slot TODAY, not what it is called in term time. On a
    // Saturday or in the holidays "after school" is simply false, and a child
    // reading something obviously untrue learns to stop reading it.
    const whenLabel = bandLabelOn(band, now, regionOf.get(userId) ?? DEFAULT_REGION)
    const body = more > 0
      ? `${first}, and ${more} more to do ${whenLabel}. Tap to tick them off.`
      : `${first}. Still time to do it ${whenLabel}.`

    try {
      await pushToChild(admin, userId, childId, `${title}${name && name !== 'you' ? `, ${name}` : ''}`, body)
      sent++
    } catch { /* one child's dead subscription never stops the rest */ }
  }

  return NextResponse.json({ ok: true, band, sent })
}

// Three cron entries share this route, separated only by ?band=. Each band
// records under its own name so one going quiet is visible on its own.
export const GET = withHeartbeat(
  (req: Request) => `/api/cron/job-reminders?band=${new URL(req.url).searchParams.get('band') ?? 'unknown'}`,
  handler,
)
