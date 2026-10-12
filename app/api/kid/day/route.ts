import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { STEPS, type StepKey } from '@/lib/kid/five-a-day'
import { loadDay, streakCount, markStep } from '@/lib/kid/day-store'
import { isSchoolHoliday } from '@/lib/learning/holidays'
import { getFamilyRegion } from '@/lib/learning/region'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import type { StageNum } from '@/lib/kid/five-a-day'

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
  // ── ONE WAVE FOR THE THREE READS THAT NEED ONLY THE LINK ─────────────────
  //
  // Region, this week's lesson count and the age band each depend on nothing
  // but link.userId and link.childId, so they go to the database together and
  // the route waits once instead of three times. Each keeps the fail soft it
  // had: region to uk, stage to undefined. The comment
  // for each sits beside its read below.
  const [region, stage] = await Promise.all([
    getFamilyRegion(link.admin, link.userId).catch(() => 'uk' as const),

    // ── WHOSE DAY, BY AGE ──────────────────────────────────────────────────
    //
    // The Passport brief: "DO NOT hard-code the same checklist for every age. Use
    // the existing age/stage pathway as the source of truth." pickDay took a
    // child and a date and nothing else, so this is where the age band it already
    // had on file finally reaches it.
    //
    // Fails soft to undefined, which pickDay reads as Builder: a lookup that
    // cannot answer should cost a child a slightly wrong shaped day, never a day
    // they cannot load at all.
    (async (): Promise<StageNum | undefined> => {
      try {
        const { data: kid } = await link.admin
          .from('children').select('age_band').eq('id', link.childId).maybeSingle()
        const band = (kid as { age_band?: string | null } | null)?.age_band
        return band ? getStageFromAgeBand(band as AgeBand).id as StageNum : undefined
      } catch { return undefined }
    })(),
  ])

  // The weekly lesson is no longer one of the five (plan v10, item 1.6): it
  // is the week's own thing, on the week card and the child's list, so the
  // day never draws it and never needs to ask whether this week's is done.
  const available = {
    printable: isSchoolHoliday(new Date(), region),
  }

  // Today's row and the streak, one wave. loadDay may create today's row on
  // first open, and streakCount only counts rows with completed_at set, so a
  // row born blank a moment earlier changes nothing in the count and the two
  // can safely run side by side.
  const [{ day, row }, streak] = await Promise.all([
    loadDay(link.admin, link.userId, link.childId, available, stage),
    streakCount(link.admin, link.childId),
  ])
  return NextResponse.json({
    day,
    steps: row.steps as StepKey[],
    done: row.done as StepKey[],
    complete: !!row.completed_at,
    // Today's sticker, read from the day's own row. See migration 284.
    sticker: !!row.sticker_awarded_at,
    streak,
  })
}

export async function POST(request: NextRequest) {
  const { token, step, available, note } = await request.json().catch(() => ({}))
  const link = await linkFor(typeof token === 'string' ? token : '')
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })
  if (typeof step !== 'string' || !VALID.has(step as StepKey)) {
    return NextResponse.json({ error: 'unknown step' }, { status: 400 })
  }

  // What the child said they did, from the confirm sheet. Typed loosely here
  // and sanitised in markStep, because it arrives from a client and ends up on
  // a parent's screen.
  const cleanNote = typeof note === 'string' ? note : null
  const result = await markStep(link.admin, link.userId, link.childId, step as StepKey, available, cleanNote)
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
    sticker: result.sticker,
    streak,
  })
}
