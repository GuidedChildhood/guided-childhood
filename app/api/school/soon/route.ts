import { withHeartbeat } from '@/lib/ops/heartbeat'
import { londonNow } from '@/lib/time/london'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendPush } from '@/lib/push/send'
import { isHeldForHolidays } from '@/lib/school/child-items'
import { DEFAULT_REGION, isRegion } from '@/lib/learning/region'
import type { Region } from '@/lib/learning/holidays'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// The hour before.
//
// Justin: a school alert with a time should "give a alert PWA and dashboard
// about an hour before time set if time", and go to the parent and the child.
//
// The other two school crons are day granularity and always were: the evening
// one warns about tomorrow at 18:00, the morning one lists today at 06:45.
// Neither can help with Cubs at 18:15, because by the time you are reading the
// morning list you have a whole day between you and it. This is the one that
// lands while you can still do something.
//
// Only for reminders that HAVE a time. A reminder with no time is a bring it
// today reminder and the morning cron already has it covered; inventing an
// hour for it would mean guessing, and a guessed alarm about a child's school
// day is worse than silence.
//
// Runs every fifteen minutes, which is what makes "about an hour" true rather
// than "some time between one and two hours". That cadence means the same
// reminder sits inside the window on more than one tick, so the once only
// guard is a table with a unique key rather than a flag anyone has to
// remember to set. See migration 135.

// Anything landing inside this many minutes gets the alert. Wider than the
// fifteen minute tick on purpose: a tick that fails, or a deploy that eats
// one, should still produce a late alert rather than none, and forty minutes
// notice is worth having when the alternative is finding out at the door.
const WINDOW_MINUTES = 75

// What a child can act on themselves, matching the morning cron exactly: kit,
// events and homework. Never a payment, never a plain notice. A child cannot
// pay for the trip and telling them about it only hands them a worry.
const CHILD_KINDS = new Set(['kit', 'event', 'homework'])

const KIND_EMOJI: Record<string, string> = {
  kit: '🎒', payment: '💷', homework: '📖', event: '📅', deadline: '⏰', notice: '📌',
}

/** "18:15:00" or "18:15" to minutes past midnight, or null if unreadable. */
function timeToMinutes(value: string | null): number | null {
  if (!value) return null
  const m = /^(\d{1,2}):(\d{2})/.exec(value)
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  if (!Number.isFinite(h) || !Number.isFinite(min) || h > 23 || min > 59) return null
  return h * 60 + min
}

/** "18:15:00" to "6:15pm", in the words a card would use. */
function clock(value: string): string {
  const mins = timeToMinutes(value)
  if (mins === null) return value
  const h24 = Math.floor(mins / 60)
  const m = mins % 60
  const suffix = h24 < 12 ? 'am' : 'pm'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, '0')}${suffix}`
}

type Action = {
  id: string
  user_id: string
  title: string
  kind: string | null
  due_time: string | null
}

async function handler(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const uk = londonNow()
  const today = uk.dateStr
  const nowMinutes = uk.hour * 60 + uk.minute

  // Due today either because it is dated today, or because it is the weekly
  // routine that lands on this weekday. Both only matter here if they carry a
  // time, which routines could not until the form and the API stopped throwing
  // it away.
  const [dated, routines] = await Promise.all([
    supabase.from('school_actions')
      .select('id, user_id, title, kind, due_time')
      .eq('status', 'open').eq('due_date', today).not('due_time', 'is', null),
    supabase.from('school_actions')
      .select('id, user_id, title, kind, due_time')
      .eq('status', 'open').eq('recurs_weekday', uk.weekday).not('due_time', 'is', null),
  ])

  // The holiday hold, matching the screens and the other two crons: a school
  // time routine rests through the school holidays, so its hour before alert
  // stays quiet too. Dated one offs are never held, they were typed on
  // purpose. Guarded reads (migrations 182 and 129 run by hand); errors read
  // as school time and UK.
  const holidayFlag = new Map<string, boolean>()
  try {
    const ids = (routines.data ?? []).map(r => r.id)
    if (ids.length) {
      const { data, error } = await supabase
        .from('school_actions').select('id, runs_in_holidays').in('id', ids)
      if (!error) for (const r of (data ?? []) as { id: string; runs_in_holidays?: boolean | null }[]) {
        holidayFlag.set(String(r.id), r.runs_in_holidays === true)
      }
    }
  } catch { /* pre 182, school time */ }
  const regionOf = new Map<string, Region>()
  try {
    const userIds = [...new Set((routines.data ?? []).map(r => r.user_id as string))]
    if (userIds.length) {
      const { data, error } = await supabase
        .from('profiles').select('id, school_region').in('id', userIds)
      if (!error) for (const p of (data ?? []) as { id: string; school_region?: unknown }[]) {
        if (isRegion(p.school_region)) regionOf.set(String(p.id), p.school_region)
      }
    }
  } catch { /* pre 129, UK */ }
  const todayDate = new Date(`${today}T12:00:00`)
  const liveRoutines = ((routines.data ?? []) as Action[]).filter(a => !isHeldForHolidays(
    { recurs_weekday: uk.weekday, runs_in_holidays: holidayFlag.get(String(a.id)) ?? false },
    todayDate,
    regionOf.get(String(a.user_id)) ?? DEFAULT_REGION,
  ))

  const seen = new Set<string>()
  const due: { action: Action; minutesAway: number }[] = []
  for (const a of [...(dated.data ?? []), ...liveRoutines] as Action[]) {
    if (seen.has(a.id)) continue
    seen.add(a.id)
    const at = timeToMinutes(a.due_time)
    if (at === null) continue
    const away = at - nowMinutes
    // Still ahead, and close enough to be worth saying. Something already past
    // is not an alert, it is a reproach.
    if (away <= 0 || away > WINDOW_MINUTES) continue
    due.push({ action: a, minutesAway: away })
  }

  if (due.length === 0) {
    return NextResponse.json({ ok: true, checked: seen.size, alerted: 0 })
  }

  // Claim each one BEFORE sending. The unique key means a second tick inside
  // the same window loses the race and sends nothing. Claiming first rather
  // than after means a push that fails is never retried, which is the right way
  // round: a reminder that goes missing is a disappointment, and one that fires
  // four times on a child's phone at teatime is the thing this product exists
  // not to be.
  const toSend: { action: Action; minutesAway: number }[] = []
  for (const item of due) {
    const { error } = await supabase
      .from('school_alert_sent')
      .insert({ action_id: item.action.id, on_date: today })
    // A duplicate key is the guard doing its job, not a failure. Anything else
    // is a real error, and skipping is still the safe direction.
    if (!error) toSend.push(item)
  }

  if (toSend.length === 0) {
    return NextResponse.json({ ok: true, checked: seen.size, alerted: 0, alreadySent: due.length })
  }

  // One message per family, the same as the other two crons. Three separate
  // buzzes for three things at six o'clock is how a parent turns notifications
  // off altogether.
  const byUser = new Map<string, { action: Action; minutesAway: number }[]>()
  for (const item of toSend) {
    const list = byUser.get(item.action.user_id) ?? []
    list.push(item)
    byUser.set(item.action.user_id, list)
  }

  let parents = 0
  let kids = 0

  const line = (i: { action: Action; minutesAway: number }) =>
    `${KIND_EMOJI[i.action.kind ?? 'notice'] ?? '📌'} ${i.action.title} at ${clock(i.action.due_time!)}`

  for (const [userId, items] of byUser) {
    items.sort((a, b) => a.minutesAway - b.minutesAway)
    const soonest = items[0]
    const body = items.length === 1
      ? `${line(soonest)}, in about ${soonest.minutesAway} minutes.`
      : `${items.map(line).join('. ')}.`

    try {
      const r = await sendPush({ userId, title: 'Coming up soon ⏰', body, url: '/dashboard/school' })
      if ((r).sent > 0) parents++
    } catch { /* best effort, the same as every other push in this product */ }

    const childItems = items.filter(i => i.action.kind && CHILD_KINDS.has(i.action.kind))
    if (childItems.length > 0) {
      const childBody = childItems.length === 1
        ? `${line(childItems[0])}, in about ${childItems[0].minutesAway} minutes.`
        : `${childItems.map(line).join('. ')}.`
      try {
        const r = await sendPush({ userId, audience: 'kids', title: 'Almost time ⏰', body: childBody })
        if ((r).sent > 0) kids++
      } catch { /* best effort */ }
    }
  }

  return NextResponse.json({
    ok: true, checked: seen.size, alerted: toSend.length, families: byUser.size, parents, kids,
  })
}

export const GET = withHeartbeat('/api/school/soon', handler)
