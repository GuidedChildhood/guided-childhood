import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { deviceLabel } from '@/lib/quests/device-time'
import { pushToChild } from '@/lib/quests/kid-push'
import { getStarBanks } from '@/lib/quests/bank'
import { getHolidayBanks } from '@/lib/quests/holiday-bank'
import { drawFromHolidayBank } from '@/lib/quests/holiday-spend'
import { getTimeSettings, getCoreUsedToday, planTieredSpend } from '@/lib/quests/time-tiers'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { getFamilyRegion } from '@/lib/learning/region'
import { jobsTodayCount } from '@/lib/pathway/jobs-streak'

// Resolve a child's ask first screen time request. Yes marks it approved and
// the child's own Start button begins the timer; not yet declines it warmly.
// Either way the child's device hears the answer straight away, best effort,
// and the banner on their screen says the same on the next poll. Scoped to
// the parent's own rows by session and RLS.

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id, status } = await req.json().catch(() => ({}))
  if (!id || !['approved', 'declined'].includes(status)) {
    return NextResponse.json({ error: 'id and status required' }, { status: 400 })
  }
  // A yes flips a PENDING ask only, so a second tap on the same ask (two
  // phones, a double tap) cannot charge the bank twice. A decline can follow
  // a yes, since a parent may change their mind before the child starts.
  let q = supabase.from('device_requests').update({ status }).eq('id', id).eq('user_id', user.id)
  if (status === 'approved') q = q.eq('status', 'pending')
  const { data: reqRow, error } = await q.select('child_id, device, minutes, family_device_id').maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!reqRow && status === 'approved') return NextResponse.json({ ok: true, already: true })

  // THE YES TAKES THE STARS. Justin, 2 September 2026: "pops up on parent app
  // so they can agree it, deducts from star account." The yes used to write a
  // status and nothing else; the stars came off when the child tapped Start,
  // a separate tap against a bank that might have changed, and a yes could
  // then fail as "not enough stars". Now the bank is charged here, the same
  // way a start charges it (core minutes first, then stars, then holiday
  // minutes), and the child's Start reuses the charge. When the bank cannot
  // cover the whole ask the yes covers the rest: named as the grown up's
  // treat, never a refusal. Every read fails soft, so a yes always lands.
  let charged = { stars: 0, coreMinutes: 0, holidayMinutes: 0, shortMinutes: 0, balanceAfter: 0 }
  if (reqRow?.child_id && status === 'approved') {
    try {
      const childId = String(reqRow.child_id)
      const mins = Number(reqRow.minutes) || 0
      const { data: child } = await supabase.from('children').select('age_band').eq('id', childId).maybeSingle()
      const ageBand = (child as { age_band?: string | null } | null)?.age_band ?? null
      const settings = await getTimeSettings(supabase, user.id, [{ id: childId, age_band: ageBand }]).then(m => m.get(childId) ?? null).catch(() => null)
      const rate = settings?.starMinutes ?? STAR_MINUTES
      let coreLeft = 0
      if (settings && settings.coreMinutesDaily > 0) {
        const used = await getCoreUsedToday(supabase, user.id, [childId]).catch(() => new Map<string, number>())
        coreLeft = Math.max(0, settings.coreMinutesDaily - (used.get(childId) ?? 0))
      }
      const [bank] = await getStarBanks(supabase, user.id, [childId], { [childId]: ageBand })
      const region = await getFamilyRegion(supabase, user.id)
      const [holidayBank] = await getHolidayBanks(supabase, user.id, [childId], new Date(), region)
      const plan = planTieredSpend(mins, coreLeft, bank?.balance ?? 0, holidayBank?.remaining ?? 0, holidayBank?.spendableNow ?? false, rate)
      // The star row is the marker the child's Start looks for, so the
      // charge (stars, and the holiday draw beside it) only happens here when
      // there are stars to charge. A block core or holiday minutes cover on
      // their own charges at the start, exactly as it always did, and can
      // never be drawn twice.
      let holidayDrawn = 0
      if (plan.starCost > 0) {
        if (plan.holidayMinutes > 0) {
          holidayDrawn = await drawFromHolidayBank(supabase, user.id, childId, plan.holidayMinutes)
        }
        let screen = deviceLabel(String(reqRow.device))
        const famId = (reqRow as { family_device_id?: string | null }).family_device_id
        if (famId) {
          const { data: fam } = await supabase.from('family_devices').select('label').eq('id', famId).eq('user_id', user.id).maybeSingle()
          if (fam?.label) screen = String(fam.label)
        }
        await supabase.from('star_spends').insert({
          user_id: user.id, child_id: childId, stars: plan.starCost, minutes: mins,
          // The ask id and the pockets ride in the note, so the child's Start
          // can find the charge and carry the parts into the session row.
          note: `Device time ask ${id} [${holidayDrawn}h ${plan.coreMinutes}c] ${screen}`,
        })
      }
      const covered = plan.coreMinutes + plan.starMinutes + (plan.starCost > 0 ? holidayDrawn : plan.holidayMinutes)
      charged = {
        stars: plan.starCost, coreMinutes: plan.coreMinutes, holidayMinutes: holidayDrawn,
        shortMinutes: Math.max(0, mins - covered),
        balanceAfter: Math.max(0, (bank?.balance ?? 0) - plan.starCost),
      }
    } catch { /* the yes still lands; the start charges as it always did */ }
  }

  // The day's jobs at a glance, so a yes is an informed one and both sides are
  // told to finish outstanding jobs first. Never a gate, just the count: the
  // child's own Start still works, this only nudges the order of the day.
  let jobsDue = 0
  let jobsDone = 0
  if (reqRow?.child_id && status === 'approved') {
    try {
      const today = new Date().toISOString().slice(0, 10)
      const { data: jq } = await supabase
        .from('family_quests')
        .select('id, schedule, schedule_days, created_at')
        .eq('user_id', user.id).eq('active', true)
        .or(`child_id.eq.${reqRow.child_id},child_id.is.null`)
      const { data: jt } = await supabase
        .from('quest_ticks').select('quest_id, tick_date, status')
        .eq('child_id', reqRow.child_id).eq('status', 'approved').eq('tick_date', today)
      const counts = jobsTodayCount(jq ?? [], jt ?? [])
      jobsDue = counts.due
      jobsDone = counts.done
    } catch { /* the yes still sends without the jobs count */ }
  }
  const jobsLeft = Math.max(0, jobsDue - jobsDone)

  // The answer lands on the child's own screen, never a silence. Approved:
  // one tap on Start and the timer runs, but if jobs are still to do today the
  // yes asks them to finish those first. Declined: warm, stars safe.
  if (reqRow?.child_id) {
    try {
      const mins = reqRow.minutes
      const dev = deviceLabel(String(reqRow.device))
      await pushToChild(
        createAdminClient(), user.id, String(reqRow.child_id),
        status === 'approved' ? 'Your grown up said yes! ⭐' : 'Not right now 💛',
        status === 'approved'
          ? `${charged.stars > 0 ? `${charged.stars} star${charged.stars === 1 ? '' : 's'} taken from your bank${charged.shortMinutes > 0 ? ', and your grown up covered the rest' : ''}. ` : charged.shortMinutes > 0 ? 'Your grown up covered it. ' : ''}${jobsLeft > 0
            ? `First finish your ${jobsLeft} job${jobsLeft === 1 ? '' : 's'} for today, then tap Start for your ${mins} minutes on the ${dev}.`
            : `Tap Start on your page when you are at the ${dev} for your ${mins} minutes.`}`
          : 'Your stars are safe. Ask again another time.',
      )
    } catch { /* push is best effort, the banner still says it */ }
  }
  // The counts go back so the parent's board can echo the same nudge in place.
  return NextResponse.json({ ok: true, jobsDue, jobsDone, jobsLeft, charged })
}
