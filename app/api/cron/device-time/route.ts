import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { deviceLabel } from '@/lib/quests/device-time'
import { getMinutesUsedToday } from '@/lib/quests/usage'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'
import { pushToChild } from '@/lib/quests/kid-push'

// The parent's eyes on device time, every minute. Two jobs:
//
// 1. Sessions whose time is up but still marked active get closed, and the
//    parent is told the block finished (or that today's healthy amount is now
//    reached, when that is the news).
// 2. Sessions still RUNNING that have just crossed the day's healthy amount
//    for the child's age get flagged once (guide_alerted_at) and the parent
//    gets the heads up. The cron never ends these: the child's own screen
//    does the warm divert to offline ideas, this is only so the parent knows
//    the moment it happens. A treat block the parent knowingly granted past
//    the guide is left entirely alone.
//
// Gated on CRON_SECRET like the other crons, so only Vercel's scheduler can
// trigger it.

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  const admin = createAdminClient()
  const nowIso = new Date().toISOString()
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin

  // One small cache of child name and age band per run, shared by both jobs.
  const kids = new Map<string, { name: string; ageBand: string | null }>()
  async function kidFor(childId: string): Promise<{ name: string; ageBand: string | null }> {
    let kid = kids.get(childId)
    if (!kid) {
      const { data: row } = await admin.from('children').select('name, age_band').eq('id', childId).maybeSingle()
      kid = { name: row?.name ?? 'Your child', ageBand: (row?.age_band as string | null) ?? null }
      kids.set(childId, kid)
    }
    return kid
  }
  async function push(userId: string, title: string, body: string) {
    try {
      await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
        body: JSON.stringify({ userId, title, body, url: '/dashboard/quests#screen-time' }),
      })
    } catch { /* best effort per session */ }
  }

  // ── Job 1: close sessions whose time has just run out ──
  const { data: due } = await admin
    .from('device_sessions')
    .select('id, user_id, child_id, device, minutes, guide_alerted_at')
    .eq('status', 'active')
    .lte('ends_at', nowIso)
    .limit(200)

  if (due && due.length > 0) {
    // Close them all first so a slow push never leaves a stuck countdown or
    // double warns on the next run.
    await admin.from('device_sessions')
      .update({ status: 'ended', ended_at: nowIso })
      .in('id', due.map(s => s.id))

    for (const s of due) {
      const cid = s.child_id as string
      const kid = await kidFor(cid)
      // Two different endings, so the parent knows which one this is. If the day's
      // healthy amount for their age is now reached, say so calmly (the daily
      // allowance signal). Otherwise it is just this block finishing. A session
      // whose guide crossing was already flagged mid run keeps to the plain
      // ending, so the parent never hears the same news twice.
      let allowanceReached = false
      if (!s.guide_alerted_at) {
        try {
          const rec = recommendedDailyMinutes(kid.ageBand)
          if (rec > 0) {
            const usedMap = await getMinutesUsedToday(admin, s.user_id as string, [cid])
            allowanceReached = (usedMap.get(cid) ?? 0) >= rec
          }
        } catch { /* fall back to the plain timer up message */ }
      }

      if (allowanceReached) {
        await push(
          s.user_id as string,
          `${kid.name} has had their screen time today 🌱`,
          `That is the healthy amount for their age. Their stars keep earning for tomorrow.`,
        )
      } else {
        await push(
          s.user_id as string,
          `${kid.name}'s screen time is up ⏰`,
          `The ${deviceLabel(s.device as string)} timer has finished. Time to set the next quests.`,
        )
      }

      // The child hears it too, on their own device. They may be across the
      // room on the TV or the console, nowhere near their quest page, so the
      // screen alarm alone is not enough. Best effort like every push.
      try {
        if (allowanceReached) {
          await pushToChild(
            admin, s.user_id as string, cid,
            'That is your screen time for today 🌱',
            'Nice one. Your stars keep earning for tomorrow. Open your page for good things to do instead.',
          )
        } else {
          await pushToChild(
            admin, s.user_id as string, cid,
            'Time is up ⏰',
            `Your ${deviceLabel(s.device as string)} timer has finished. Open your page for good things to do instead.`,
          )
        }
      } catch { /* best effort per session */ }
    }
  }

  // ── Job 2: running sessions that have just crossed the day's guide ──
  // Not a treat, not yet flagged, still inside their own minutes. Today's
  // total is counted with only the ELAPSED part of the running block, since
  // the usage helper counts a running block at its full planned length.
  const { data: running } = await admin
    .from('device_sessions')
    .select('id, user_id, child_id, device, minutes, started_at')
    .eq('status', 'active')
    .eq('treat', false)
    .is('guide_alerted_at', null)
    .gt('ends_at', nowIso)
    .limit(200)

  let alerted = 0
  for (const s of running ?? []) {
    const cid = s.child_id as string
    try {
      const kid = await kidFor(cid)
      const rec = recommendedDailyMinutes(kid.ageBand)
      if (rec <= 0) continue

      const planned = Number(s.minutes) || 0
      const elapsedMin = Math.min(planned, Math.max(0, Math.ceil((Date.now() - new Date(s.started_at as string).getTime()) / 60000)))
      const usedMap = await getMinutesUsedToday(admin, s.user_id as string, [cid])
      const totalWithElapsed = (usedMap.get(cid) ?? 0) - planned + elapsedMin
      if (totalWithElapsed < rec) continue

      // Flag first so a slow push can never fire this twice, and never end
      // the session here: the child's screen owns the warm divert.
      const { error } = await admin.from('device_sessions')
        .update({ guide_alerted_at: new Date().toISOString() })
        .eq('id', s.id)
        .is('guide_alerted_at', null)
      if (error) continue

      await push(
        s.user_id as string,
        `${kid.name} has reached the healthy amount for today 🌱`,
        `The ${deviceLabel(s.device as string)} timer is wrapping up with some offline ideas. Anything more today is a treat you can grant from the board.`,
      )
      try {
        await pushToChild(
          admin, s.user_id as string, cid,
          'Nearly time to wrap up 🌱',
          'You have reached the healthy amount for today. When the timer ends, pick a job or something fun offline.',
        )
      } catch { /* best effort per session */ }
      alerted += 1
    } catch { /* best effort per session */ }
  }

  return NextResponse.json({ ok: true, ended: due?.length ?? 0, guideAlerts: alerted })
}
