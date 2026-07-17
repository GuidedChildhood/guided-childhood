import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { deviceLabel } from '@/lib/quests/device-time'
import { getMinutesUsedToday } from '@/lib/quests/usage'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'

// The end of session warning to the parent. The child's own screen alarms
// itself when the countdown hits zero, but a parent who is not looking at the
// board would miss it, so this runs every minute, finds device sessions whose
// time is up but are still marked active, closes them, and pushes the parent
// that time is up and it is time to set the next quests. Gated on CRON_SECRET
// like the other crons, so only Vercel's scheduler can trigger it.

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  const admin = createAdminClient()
  const nowIso = new Date().toISOString()

  // Sessions whose time has just run out but are still open.
  const { data: due } = await admin
    .from('device_sessions')
    .select('id, user_id, child_id, device, minutes')
    .eq('status', 'active')
    .lte('ends_at', nowIso)
    .limit(200)

  if (!due || due.length === 0) return NextResponse.json({ ok: true, ended: 0 })

  // Close them all first so a slow push never leaves a stuck countdown or
  // double warns on the next run.
  await admin.from('device_sessions')
    .update({ status: 'ended', ended_at: nowIso })
    .in('id', due.map(s => s.id))

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin
  const kids = new Map<string, { name: string; ageBand: string | null }>()
  for (const s of due) {
    const cid = s.child_id as string
    let kid = kids.get(cid)
    if (!kid) {
      const { data: row } = await admin.from('children').select('name, age_band').eq('id', cid).maybeSingle()
      kid = { name: row?.name ?? 'Your child', ageBand: (row?.age_band as string | null) ?? null }
      kids.set(cid, kid)
    }
    // Two different endings, so the parent knows which one this is. If the day's
    // healthy amount for their age is now reached, say so calmly (the daily
    // allowance signal). Otherwise it is just this block finishing.
    let allowanceReached = false
    try {
      const rec = recommendedDailyMinutes(kid.ageBand)
      if (rec > 0) {
        const usedMap = await getMinutesUsedToday(admin, s.user_id as string, [cid])
        allowanceReached = (usedMap.get(cid) ?? 0) >= rec
      }
    } catch { /* fall back to the plain timer up message */ }

    const push = allowanceReached
      ? {
          title: `${kid.name} has had their screen time today 🌱`,
          body: `That is the healthy amount for their age. Their stars keep earning for tomorrow.`,
        }
      : {
          title: `${kid.name}'s screen time is up ⏰`,
          body: `The ${deviceLabel(s.device as string)} timer has finished. Time to set the next quests.`,
        }
    try {
      await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
        body: JSON.stringify({ userId: s.user_id, ...push, url: '/dashboard/quests#screen-time' }),
      })
    } catch { /* best effort per session */ }
  }

  return NextResponse.json({ ok: true, ended: due.length })
}
