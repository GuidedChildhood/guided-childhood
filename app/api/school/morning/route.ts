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

// The morning nudge. The evening remind cron warns the night before; this one
// runs first thing (about 7:45 UK) and tells BOTH the parent and the child
// what is needed today, whether a one off due today or a weekly routine that
// lands on this weekday, so nobody is packing the kit at the door. One grouped
// message per family, to the parent's phone and to the child's, best effort.

function ukToday(): { dateStr: string; weekday: number } {
  const uk = londonNow()
  return { dateStr: uk.dateStr, weekday: uk.weekday }
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

  const { dateStr: today, weekday } = ukToday()

  const [{ data: dueToday }, { data: routineRows }] = await Promise.all([
    supabase.from('school_actions').select('user_id, child_id, title, kind').eq('status', 'open').eq('due_date', today),
    supabase.from('school_actions').select('id, user_id, child_id, title, kind').eq('status', 'open').eq('recurs_weekday', weekday),
  ])

  // The holiday hold: a school time routine rests through the school
  // holidays, so the morning push skips it, the same rule the screens and
  // the evening remind keep. Both reads guarded (migrations 182 and 129 run
  // by hand); errors read as school time and UK.
  const holidayFlag = new Map<string, boolean>()
  try {
    const ids = (routineRows ?? []).map(r => r.id)
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
    const userIds = [...new Set((routineRows ?? []).map(r => r.user_id as string))]
    if (userIds.length) {
      const { data, error } = await supabase
        .from('profiles').select('id, school_region').in('id', userIds)
      if (!error) for (const p of (data ?? []) as { id: string; school_region?: unknown }[]) {
        if (isRegion(p.school_region)) regionOf.set(String(p.id), p.school_region)
      }
    }
  } catch { /* pre 129, UK */ }
  const todayDate = new Date(`${today}T12:00:00`)
  const routines = (routineRows ?? []).filter(r => !isHeldForHolidays(
    { recurs_weekday: weekday, runs_in_holidays: holidayFlag.get(String(r.id)) ?? false },
    todayDate,
    regionOf.get(String(r.user_id)) ?? DEFAULT_REGION,
  ))

  // The parent hears about everything; the child only about the things they
  // can act on themselves (kit, events, homework), never payments or notices.
  //
  // ── AND EVERYTHING SAYS WHOSE (19 August 2026) ─────────────────────────────
  //
  // Justin: "school reminders are per child and the parent can see the name of
  // the child in the reminder." school_actions gained child_id in migration 215
  // and this route was still reading around it, so the parent's push said
  // "Today: PE kit" with no owner, and the CHILD sends went to every child's
  // device: the seven year old's phone buzzed about GCSE coursework, because
  // sendPush could say "children" but never which child.
  //
  // The parent still gets ONE push, with each item wearing its child's name
  // inline, because three pushes at 7am is a worse morning than one. The child
  // sends are per child now: their own items plus the household's, and only
  // theirs. An item with no child (added before 215, or genuinely household)
  // reaches everybody, which is what it meant.
  type Item = { user_id: string; child_id?: string | null; title: string; kind?: string | null }
  const allItems: Item[] = [...(dueToday ?? []), ...(routines ?? [])] as Item[]

  // The names, one read for every family in tonight's batch.
  const nameOf = new Map<string, string>()
  const kidsOf = new Map<string, { id: string; name: string | null }[]>()
  {
    const userIds = [...new Set(allItems.map(a => a.user_id))]
    if (userIds.length) {
      const { data } = await supabase.from('children').select('id, name, parent_id').in('parent_id', userIds)
      for (const c of (data ?? []) as { id: string; name: string | null; parent_id: string }[]) {
        if (c.name && c.name !== 'Your child') nameOf.set(c.id, c.name)
        kidsOf.set(c.parent_id, [...(kidsOf.get(c.parent_id) ?? []), { id: c.id, name: c.name }])
      }
    }
  }

  const CHILD_KINDS = new Set(['kit', 'event', 'homework'])
  const byUser = new Map<string, string[]>()
  for (const a of allItems) {
    const who = a.child_id ? nameOf.get(a.child_id) : null
    const label = who ? `${a.title} (${who})` : a.title
    const list = byUser.get(a.user_id) ?? []
    if (!list.includes(label)) list.push(label)
    byUser.set(a.user_id, list)
  }

  let parents = 0
  let kids = 0

  for (const [userId, titles] of byUser) {
    const body = titles.length === 1
      ? `Today: ${titles[0]}.`
      : `Today: ${titles.slice(0, 3).join(', ')}${titles.length > 3 ? ', and more' : ''}.`
    try {
      const r = await sendPush({ userId, title: 'This morning, for school 🎒', body, url: '/dashboard/school' })
      if ((r).sent > 0) parents++
    } catch { /* best effort */ }

    // Each child hears about their own morning: their items plus the
    // household's, never a sibling's.
    for (const kid of kidsOf.get(userId) ?? []) {
      const mine = allItems
        .filter(a => a.user_id === userId && a.kind && CHILD_KINDS.has(a.kind))
        .filter(a => !a.child_id || a.child_id === kid.id)
        .map(a => a.title)
      const childTitles = [...new Set(mine)]
      if (childTitles.length === 0) continue
      const childBody = childTitles.length === 1
        ? `Today: ${childTitles[0]}.`
        : `Today: ${childTitles.slice(0, 3).join(', ')}${childTitles.length > 3 ? ', and more' : ''}.`
      try {
        const r = await sendPush({ userId, audience: 'kids', childId: kid.id, title: 'For school today 🎒', body: childBody })
        if ((r).sent > 0) kids++
      } catch { /* best effort */ }
    }
  }

  return NextResponse.json({ ok: true, families: byUser.size, parents, kids })
}

export const GET = withHeartbeat('/api/school/morning', handler)
