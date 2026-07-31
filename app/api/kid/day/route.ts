import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pickDay, dayComplete, ukToday, STEPS, type StepKey } from '@/lib/kid/five-a-day'
import { grantDayMinutes, MINUTES_PER_COMPLETED_DAY } from '@/lib/quests/holiday-daily'

// The child's five a day: read it, and mark a step done.
//
// Same trust model as every other child route. The link token is the auth, there
// is no account and no login, and the token scopes everything to one child.
//
// The row is created on first read of the day rather than by a job, so a child
// who opens the app on a Tuesday gets a Tuesday, and a child who never opens it
// leaves no row. Nothing has to run overnight for the feature to work.

export const dynamic = 'force-dynamic'

const VALID = new Set(Object.keys(STEPS) as StepKey[])

async function linkFor(token: string) {
  if (!/^[0-9a-f]{18}$/.test(token)) return null
  const admin = createAdminClient()
  const { data } = await admin
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  return data ? { admin, userId: data.user_id as string, childId: data.child_id as string } : null
}

/**
 * Load today's row, creating it if this is the first look.
 *
 * The insert is upsert-on-conflict-do-nothing followed by a read, rather than
 * "check then insert". Two tabs opening at once is a real thing on a child's
 * phone, and the check-then-insert version races into a duplicate key error that
 * would show as a broken screen.
 */
async function loadDay(admin: ReturnType<typeof createAdminClient>, userId: string, childId: string, available?: Partial<Record<StepKey, boolean>>) {
  const day = ukToday()
  const { data: existing } = await admin
    .from('kid_days').select('steps, done, completed_at, streak_awarded')
    .eq('child_id', childId).eq('day', day).maybeSingle()
  if (existing) return { day, row: existing }

  const steps = pickDay(childId, day, available)
  await admin.from('kid_days')
    .upsert({ user_id: userId, child_id: childId, day, steps, done: [] }, { onConflict: 'child_id,day', ignoreDuplicates: true })
  const { data: row } = await admin
    .from('kid_days').select('steps, done, completed_at, streak_awarded')
    .eq('child_id', childId).eq('day', day).maybeSingle()
  return { day, row: row ?? { steps, done: [], completed_at: null, streak_awarded: false } }
}

/**
 * How many days in a row, ending today or yesterday.
 *
 * Ending YESTERDAY still counts, because a streak a child has not yet had the
 * chance to continue is not broken. Reading it as broken before the day is over
 * would show a child a zero every morning.
 *
 * Justin's call on a missed day: the run starts again and everything already
 * earned stays. There is no freeze to buy back, which is the pattern this
 * product exists to be the alternative to.
 */
async function streakCount(admin: ReturnType<typeof createAdminClient>, childId: string): Promise<number> {
  const { data } = await admin
    .from('kid_days').select('day')
    .eq('child_id', childId).not('completed_at', 'is', null)
    .order('day', { ascending: false }).limit(400)
  const days = new Set((data ?? []).map(r => String(r.day)))
  if (days.size === 0) return 0

  const stamp = (offset: number) => {
    const d = new Date(`${ukToday()}T12:00:00Z`)
    d.setUTCDate(d.getUTCDate() - offset)
    return d.toISOString().slice(0, 10)
  }
  // Start at today if today is done, else yesterday, else there is no live run.
  let cursor = days.has(stamp(0)) ? 0 : days.has(stamp(1)) ? 1 : -1
  if (cursor < 0) return 0
  let count = 0
  while (days.has(stamp(cursor))) { count++; cursor++ }
  return count
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''
  const link = await linkFor(token)
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const { day, row } = await loadDay(link.admin, link.userId, link.childId)
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

  const { day, row } = await loadDay(link.admin, link.userId, link.childId, available)
  const steps = row.steps as StepKey[]
  // A step that is not part of today is not marked done. Without this a stale
  // tab from yesterday could complete a day it was never shown.
  if (!steps.includes(step as StepKey)) {
    return NextResponse.json({ error: 'not part of today', steps }, { status: 400 })
  }

  const done = Array.from(new Set([...(row.done as StepKey[]), step as StepKey]))
  const complete = dayComplete(steps, done)
  // completed_at is only ever set, never cleared, so a day that landed stays
  // landed even if the pool later changes what today would have been.
  const patch: Record<string, unknown> = { done, updated_at: new Date().toISOString() }
  if (complete && !row.completed_at) patch.completed_at = new Date().toISOString()

  const { error } = await link.admin
    .from('kid_days').update(patch).eq('child_id', link.childId).eq('day', day)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await link.admin.from('kid_links').update({ last_seen_at: new Date().toISOString() }).eq('token', token)

  // Five minutes of holiday time for finishing the day, on the transition
  // only. justCompleted below is the same condition, and it is the same
  // condition on purpose: the reward and the celebration should be true
  // together or not at all, so a child never sees one without the other.
  const justCompleted = complete && !row.completed_at
  if (justCompleted) {
    await grantDayMinutes(link.admin, link.userId, link.childId, day)
  }

  const streak = await streakCount(link.admin, link.childId)
  return NextResponse.json({
    ok: true,
    done,
    // What the day just paid into the holiday bank, so the celebration can
    // name it. Zero on any day that was already finished.
    holidayMinutes: justCompleted ? MINUTES_PER_COMPLETED_DAY : 0,
    // justCompleted is what the celebration listens for. It is true only on the
    // transition, so a refresh of a finished day does not replay the takeover.
    justCompleted,
    complete,
    streak,
  })
}
