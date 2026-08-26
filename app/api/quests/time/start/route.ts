import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStarBanks } from '@/lib/quests/bank'
import { getHolidayBanks } from '@/lib/quests/holiday-bank'
import { drawFromHolidayBank, refundToHolidayBank } from '@/lib/quests/holiday-spend'
import { getTimeSettings, getCoreUsedToday, checkProtectedWindow, planTieredSpend, PROTECTED_CHILD_LINE, PROTECTED_PARENT_LINE, type ProtectedReason } from '@/lib/quests/time-tiers'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { isDeviceKey, isActivityKey, asksActivity, minutesToStars, deviceLabel, readTrust } from '@/lib/quests/device-time'
import { questDueToday } from '@/lib/quests/due'
import { getMinutesUsedToday } from '@/lib/quests/usage'
import { wouldExceedGuide } from '@/lib/quests/daily-guide'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'
import { jobsTodayCount } from '@/lib/pathway/jobs-streak'
import { getFamilyRegion } from '@/lib/learning/region'
import { sendPush } from '@/lib/push/send'

// The child spends earned stars as device time. The link token is the auth,
// same trust model as ticking. Starting a session records the spend against
// the bank straight away (so the balance can never be spent twice) and sets
// the countdown both sides watch. The parent's phone gets a heads up.

export async function POST(req: NextRequest) {
  const { token, device: rawDevice, familyDeviceId, minutes, requestId, activity: rawActivity } = await req.json()
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // Trust level decides how much the child can do alone: ask (the default,
  // needs the grown up's yes first), watch (starts freely, parent gets the
  // ping and countdown), trusted (starts freely, lighter touch, no per
  // session ping). Unset reads as ask.
  const { data: childRow } = await supabase
    .from('children').select('name, age_band, device_trust').eq('id', link.child_id).maybeSingle()
  const trust = readTrust(childRow?.device_trust)
  const childName = childRow?.name ?? 'Your child'

  // Which actual screen, when the family has listed theirs. Read back against
  // this family rather than trusted from the child's device, and its name is
  // what the parent's ping and the spend note will say. Missing, unknown or on
  // a database still short of migration 106 all fall back to the kind, which
  // is how every session read before this existed.
  let homeDevice: { id: string; label: string } | null = null
  if (typeof familyDeviceId === 'string' && familyDeviceId) {
    const { data } = await supabase
      .from('family_devices').select('id, label')
      .eq('id', familyDeviceId).eq('user_id', link.user_id).maybeSingle()
    homeDevice = (data as { id: string; label: string } | null) ?? null
  }

  // The child taps Start on an ask their grown up already said yes to: the
  // approved request itself carries the device and minutes, so nothing the
  // client sends can stretch what was agreed.
  let approvedAsk: { id: string; device: string; minutes: number; activity?: string | null } | null = null
  if (typeof requestId === 'string' && requestId) {
    const { data: reqRow } = await supabase
      .from('device_requests')
      .select('id, device, minutes, status, activity')
      .eq('id', requestId).eq('child_id', link.child_id)
      .maybeSingle()
    if (!reqRow || reqRow.status !== 'approved') {
      return NextResponse.json({ error: 'ask not approved' }, { status: 400 })
    }
    approvedAsk = {
      id: reqRow.id as string, device: reqRow.device as string, minutes: Number(reqRow.minutes),
      // What the child said when they asked. Without carrying this the child
      // picks Homework, waits for a yes, and the session that finally starts
      // has forgotten the answer and falls back to a guess.
      activity: (reqRow as { activity?: string | null }).activity ?? null,
    }
    // The ask already named a screen when it was sent. That is the one the
    // parent said yes to, so it wins over anything the client sends now.
    const { data: askDevice } = await supabase
      .from('device_requests').select('family_device_id').eq('id', requestId).maybeSingle()
    const askDeviceId = (askDevice as { family_device_id?: string | null } | null)?.family_device_id
    if (askDeviceId) {
      const { data } = await supabase
        .from('family_devices').select('id, label')
        .eq('id', askDeviceId).eq('user_id', link.user_id).maybeSingle()
      if (data) homeDevice = data as { id: string; label: string }
    }
  }

  const device = approvedAsk ? approvedAsk.device : rawDevice
  if (!isDeviceKey(device)) {
    return NextResponse.json({ error: 'bad device' }, { status: 400 })
  }
  // "on the tablet" but "on Ella's iPad": a named screen takes no article, and
  // "on the Ella's iPad" in a push notification reads as machine written.
  // What they are actually doing on it, for the one device that cannot say.
  //
  // Refused rather than guessed when it is missing. A computer session with no
  // activity is exactly the row that used to fall through to watching and
  // charge homework to the wrong guide, so writing one is the bug rather than a
  // graceful degradation. The child's card will not let them get here without
  // answering, so this only fires for a stale client or a hand made request.
  //
  // An approved ask carries the answer the child gave when they sent it, which
  // wins: that is what the parent said yes to.
  const activity = approvedAsk ? (approvedAsk.activity ?? null) : (rawActivity ?? null)
  if (activity !== null && !isActivityKey(activity)) {
    return NextResponse.json({ error: 'bad activity' }, { status: 400 })
  }
  if (asksActivity(device) && activity === null) {
    return NextResponse.json({ error: 'activity required for this device' }, { status: 400 })
  }

  const screenName = homeDevice?.label ?? deviceLabel(device)
  const onScreen = homeDevice ? screenName : `the ${screenName.toLowerCase()}`
  const mins = approvedAsk ? approvedAsk.minutes : Number(minutes)
  if (!Number.isFinite(mins) || mins < STAR_MINUTES || mins > 600 || mins % STAR_MINUTES !== 0) {
    return NextResponse.json({ error: 'bad minutes' }, { status: 400 })
  }

  // Vital chores gate: any quest the parent flagged before screens, due today
  // and not yet approved.
  //
  // WHAT IT NO LONGER BLOCKS, AND WHY. Justin: "seems a bit restrictive that
  // they can request device time unless all jobs are done that day? If they have
  // stars it should be ok to request."
  //
  // He is right, and the reason is the first non-negotiable. This route does two
  // different things: it ASKS a grown up, and it STARTS a timer. The gate sat in
  // front of both, so a child with a job outstanding could not even put the
  // question. That is a flat deny, from an app whose whole argument is that a
  // pathway beats a deny, and it takes the decision away from the parent, who is
  // the one person here allowed to make it.
  //
  // Asking is a conversation. The parent sees the ask WITH the jobs line already
  // attached ("2 of 4 jobs done today so far", built below), so they can say not
  // yet in one tap, knowing exactly what is outstanding. That is the pathway.
  //
  // What the gate still covers is a child STARTING a timer on their own, where
  // nobody has looked. And an approved ask is exempt for the same reason: the
  // parent has already looked and said yes, and a gate that overrules a parent's
  // yes is the app deciding it knows better than they do.
  const gateToday = new Date().toISOString().slice(0, 10)

  // THE GENTLE BRAKE. Justin, 11 August 2026, on the economy audit: "yes
  // gentle block." A child trusted to start their own timer could spend
  // several days of guide in one sitting, alerted but never slowed. Past one
  // and a half times the day's guide, the science's own "well over" line, a
  // self start now turns into an ASK rather than a session: the parent gets
  // it with the day's picture and one tap runs it as a treat or says not
  // today. Never a flat block, which is the first non-negotiable: the
  // pathway is ask, not no. An approved ask is exempt, the parent has
  // already looked; an ask mode child was always going to ask anyway. The
  // guide is holiday aware, so summer evenings get their bit of slack before
  // the brake touches anything. Fails open: if the reads fail, the start
  // behaves exactly as before, because a broken brake must never strand a
  // child who earned their time.
  const region = await getFamilyRegion(supabase, link.user_id)
  let overDayLine = false
  if (!approvedAsk && trust !== 'ask') {
    try {
      const usedMap = await getMinutesUsedToday(supabase, link.user_id, [link.child_id])
      const used = usedMap.get(link.child_id) ?? 0
      const guide = recommendedDailyMinutes(
        (childRow as { age_band?: string | null } | null)?.age_band ?? null,
        { on: new Date(), region },
      )
      overDayLine = guide > 0 && used + mins > guide * 1.5
    } catch { /* fail open */ }
  }

  // PROTECTED TIME (migration 223). Ten stars do not buy the timer at
  // midnight: a self start inside the child's bedtime, mealtime or school
  // window turns into an ask, exactly like the gentle brake, never a flat
  // block. The parent stays the override: an approved ask is exempt because
  // they already looked, and their own granted sessions run regardless (the
  // parent-start route just tags them). Also read here: the child's core
  // baseline, the unconditional daily minutes that spend before stars.
  // Fails open like the brake: a broken read must never strand a child.
  let protectedReason: ProtectedReason | null = null
  let coreLeftToday = 0
  try {
    const settingsMap = await getTimeSettings(supabase, link.user_id, [
      { id: link.child_id, age_band: (childRow as { age_band?: string | null } | null)?.age_band ?? null },
    ])
    const settings = settingsMap.get(link.child_id)
    if (settings) {
      if (!approvedAsk) {
        const check = checkProtectedWindow(settings, { region })
        if (check.protected) protectedReason = check.reason
      }
      if (settings.coreMinutesDaily > 0) {
        const coreUsed = await getCoreUsedToday(supabase, link.user_id, [link.child_id])
        coreLeftToday = Math.max(0, settings.coreMinutesDaily - (coreUsed.get(link.child_id) ?? 0))
      }
    }
  } catch { /* fail open */ }

  const willJustAsk = (trust === 'ask' || overDayLine || protectedReason !== null) && !approvedAsk
  if (!willJustAsk && !approvedAsk) {
    const { data: gateQuests } = await supabase
      .from('family_quests')
      .select('id, title, schedule, schedule_days')
      .eq('user_id', link.user_id)
      .eq('active', true)
      .eq('blocks_screens', true)
      .or(`child_id.eq.${link.child_id},child_id.is.null`)
    const dueGate = (gateQuests ?? []).filter(q => questDueToday(q.schedule, (q as { schedule_days?: number[] | null }).schedule_days))
    if (dueGate.length > 0) {
      const { data: approvedToday } = await supabase
        .from('quest_ticks').select('quest_id')
        .eq('child_id', link.child_id).eq('status', 'approved').eq('tick_date', gateToday)
      const doneIds = new Set((approvedToday ?? []).map(t => t.quest_id))
      const blocking = dueGate.filter(q => !doneIds.has(q.id))
      if (blocking.length > 0) {
        return NextResponse.json({ error: 'chores first', blocking: blocking.map(q => q.title) }, { status: 400 })
      }
    }
  }

  const stars = minutesToStars(mins)
  const [bank] = await getStarBanks(supabase, link.user_id, [link.child_id])

  // Two pockets pay for a block: this week's stars, and during a school holiday
  // the minutes banked from weeks the child did more than the cap had room for.
  // Stars go first and the holiday bank covers only the shortfall, because
  // stars reset every Monday and holiday minutes never expire.
  //
  // Without this the child app was lying. It shows "90 holiday minutes, ready
  // now" during a holiday and the gate below read the star balance alone, so a
  // child with an empty week was told the minutes were theirs and then refused.
  // The family's own school calendar, not the default one.
  //
  // This read had no region, so it fell back to England while the child's page
  // asks with the family's actual region. Whether it is "the holidays" therefore
  // had two answers, and the card can say "5 holiday minutes, ready now" while
  // this refuses to spend them. Exactly the lie the comment above says was
  // fixed: they fixed the pocket and left the calendar.
  // Three pockets since migration 223, most perishable first: today's core
  // baseline (dies at midnight), then this week's stars, then the holiday
  // bank. Core costs nothing, it is the unconditional part of the day.
  const [holidayBank] = await getHolidayBanks(supabase, link.user_id, [link.child_id], new Date(), region)
  const plan = planTieredSpend(mins, coreLeftToday, bank?.balance ?? 0, holidayBank?.remaining ?? 0, holidayBank?.spendableNow ?? false)
  if (!bank || !plan.enough) {
    return NextResponse.json({
      error: 'not enough stars',
      balance: bank?.balance ?? 0,
      holidayMinutes: plan.holidayMinutes,
    }, { status: 400 })
  }

  // Ask first: record the ask and nudge the parent, but do not start or spend.
  // The parent says yes from their screen time card or the locked banner, and
  // the child's own Start button then begins the timer. This branch also
  // carries the gentle brake: a trusted child past the day's line lands here
  // instead of starting, and the only difference is the words on the push.
  if (willJustAsk) {
    // Clear any earlier pending or approved but unstarted ask so one child
    // never stacks a queue.
    await supabase.from('device_requests')
      .update({ status: 'declined' })
      .eq('child_id', link.child_id).in('status', ['pending', 'approved'])
    const { data: askRow } = await supabase.from('device_requests').insert({
      user_id: link.user_id, child_id: link.child_id, device, minutes: mins, status: 'pending',
      ...(activity ? { activity } : {}),
      ...(homeDevice ? { family_device_id: homeDevice.id } : {}),
    }).select('id, device, minutes').single()

    // The jobs picture, so the yes is an informed one: never a gate, just the
    // day's jobs at a glance beside the ask. "All jobs done" when the day is
    // clear, otherwise the count still to go.
    let jobsLine = ''
    try {
      const { data: jq } = await supabase
        .from('family_quests')
        .select('id, schedule, schedule_days, created_at')
        .eq('user_id', link.user_id).eq('active', true)
        .or(`child_id.eq.${link.child_id},child_id.is.null`)
      const { data: jt } = await supabase
        .from('quest_ticks').select('quest_id, tick_date, status')
        .eq('child_id', link.child_id).eq('status', 'approved').eq('tick_date', gateToday)
      const { due, done } = jobsTodayCount(jq ?? [], jt ?? [])
      if (due > 0) jobsLine = done >= due ? ' All jobs done today ✅' : ` ${done} of ${due} jobs done today so far.`
    } catch { /* the ask still sends without the jobs line */ }

    try {
      await sendPush({
          userId: link.user_id,
          title: protectedReason
            ? `${childName} is asking for screen time in a protected window 🌙`
            : overDayLine
            ? `${childName} wants more screen time today ⏳`
            : `${childName} is asking for screen time ⏳`,
          // The ask says WHY it became an ask, so the yes is an informed one.
          // The brake: this block would take today well past the healthy
          // amount for their age. A protected window: it is bedtime, a meal
          // or school hours, and the parent is always the override.
          body: protectedReason
            ? `${mins} minutes on ${onScreen}. ${PROTECTED_PARENT_LINE[protectedReason]}${jobsLine} Yes runs it anyway, your call.`
            : overDayLine
            ? `${mins} more minutes on ${onScreen} would take today well past the healthy amount for their age.${jobsLine} Yes runs it as a treat, or say not today.`
            : `${mins} minutes on ${onScreen}, that is ${stars} star${stars === 1 ? '' : 's'}.${jobsLine} Tap to say yes on your board.`,
          url: '/dashboard/quests',
        })
    } catch { /* best effort */ }
    return NextResponse.json({
      pending: true,
      request: askRow ?? { device, minutes: mins },
      overGuide: overDayLine,
      // The child's screen shows the boundary in the sturdy leadership shape,
      // the boundary holds AND the feeling is real. Never a flat no.
      ...(protectedReason ? { protectedReason, protectedLine: PROTECTED_CHILD_LINE[protectedReason] } : {}),
    })
  }

  // A start the grown up said yes to past the day's healthy amount is a
  // treat: they granted it knowingly from the ask box (which names it), so it
  // runs its full length and the guide crossing never cuts it short.
  let treat = false
  if (approvedAsk) {
    try {
      const usedMap = await getMinutesUsedToday(supabase, link.user_id, [link.child_id])
      const ageBand = (childRow as { age_band?: string | null } | null)?.age_band ?? null
      treat = wouldExceedGuide(ageBand, usedMap.get(link.child_id) ?? 0, mins)
    } catch { /* without the read, the block simply starts untagged */ }
  }

  // One live session at a time: close any that is still open before the new
  // one starts, so two timers never run at once.
  await supabase.from('device_sessions')
    .update({ status: 'ended', ended_at: new Date().toISOString() })
    .eq('child_id', link.child_id).eq('status', 'active')

  // Take the holiday minutes first, because that is the draw that can come up
  // short: another device could have started a block between the read above and
  // now. A short draw is a failure, never a discount, so whatever was taken goes
  // straight back and the child is told to try again rather than quietly getting
  // a block they cannot pay for.
  let holidayDrawn = 0
  if (plan.holidayMinutes > 0) {
    holidayDrawn = await drawFromHolidayBank(supabase, link.user_id, link.child_id, plan.holidayMinutes)
    if (holidayDrawn < plan.holidayMinutes) {
      await refundToHolidayBank(supabase, link.user_id, link.child_id, holidayDrawn)
      return NextResponse.json({ error: 'not enough stars', balance: bank.balance }, { status: 400 })
    }
  }

  // Record the spend now (the balance drops immediately) then open the
  // session that points back at it, so stopping early can trim it. Only the
  // star funded part is charged to the bank; the minutes stay whole, since that
  // is what the row is a record of.
  //
  // NO SPEND ROW WHEN THE STARS COST NOTHING. Justin, 16:55, "They said yes!"
  // then "That did not start. Try again in a moment": a block paid entirely
  // from the holiday bank plans a starCost of zero, and star_spends has a
  // check of stars between 1 and 1000 (migration 047), so the insert died on
  // the constraint and every fully holiday funded start 500ed. In the school
  // holidays with an empty star week, which is August in one sentence, that
  // was every start. The session row happily carries stars 0 and a null
  // spend_id (052), and the stop route already guards both, so a zero star
  // block simply has no bank row to trim, the same as there being nothing
  // to refund.
  let spendId: string | null = null
  if (plan.starCost > 0) {
    const { data: spend, error: spendError } = await supabase.from('star_spends').insert({
      user_id: link.user_id, child_id: link.child_id, stars: plan.starCost, minutes: mins,
      note: holidayDrawn > 0
        ? `Device time: ${screenName} (${holidayDrawn} holiday min)`
        : `Device time: ${screenName}`,
    }).select('id').single()
    if (spendError) {
      await refundToHolidayBank(supabase, link.user_id, link.child_id, holidayDrawn)
      return NextResponse.json({ error: spendError.message }, { status: 500 })
    }
    spendId = spend.id
  }

  const endsAt = new Date(Date.now() + mins * 60000).toISOString()
  const { data: session, error: sessionError } = await supabase.from('device_sessions').insert({
    user_id: link.user_id, child_id: link.child_id, device, minutes: mins, stars: plan.starCost,
    spend_id: spendId, ends_at: endsAt, treat,
    // Spread rather than set, so a database still short of migration 138 keeps
    // taking sessions instead of rejecting every one of them on an unknown
    // column. Null there simply means infer from the device, as before.
    ...(activity ? { activity } : {}),
    // Zero on a database still short of migration 128 would silently make every
    // stop refund the holiday minutes to nowhere, so the column failing to exist
    // has to undo the draw rather than carry on without it.
    ...(holidayDrawn > 0 ? { holiday_minutes: holidayDrawn } : {}),
    // The part today's core baseline paid for (migration 223). Spread for the
    // same reason as the two above, and the drawdown is computed from these
    // rows, so a database without the column simply never has core to draw.
    ...(plan.coreMinutes > 0 ? { core_minutes: plan.coreMinutes } : {}),
    ...(homeDevice ? { family_device_id: homeDevice.id } : {}),
  }).select('id, device, minutes, stars, ends_at, started_at, treat').single()
  if (sessionError) {
    if (spendId) await supabase.from('star_spends').delete().eq('id', spendId)
    await refundToHolidayBank(supabase, link.user_id, link.child_id, holidayDrawn)
    return NextResponse.json({ error: sessionError.message }, { status: 500 })
  }

  // The yes is now spent, so no yes is left standing.
  //
  // THE BUG THIS FIXES. This used to close only the ask it was started FROM, so
  // a session begun any other way (the child's own device card, the parent's
  // card) left an approved request sitting in the table. The child's banner
  // reads that row, so it went on saying "They said yes! Tap to start your
  // timer" after the yes had already been used. Tapping it tried to spend a yes
  // that was gone, and the refusal came back as "That did not start. Try again
  // in a moment", which is the sentence Justin screenshotted at 08:53 after a
  // session had already run at 08:46.
  //
  // A start is a start. Whichever door it came through, every outstanding ask
  // for this child is now answered, because two live yeses for one child is not
  // a state that should exist.
  //
  // Fails soft: on a database still carrying the old status list the update
  // errors and the active session outranks the banner anyway.
  {
    const { error: startedErr } = await supabase.from('device_requests')
      .update({ status: 'started' })
      .eq('child_id', link.child_id)
      .in('status', ['approved', 'pending'])
    if (startedErr) { /* the active session already outranks the banner */ }
  }

  await supabase.from('kid_links').update({ last_seen_at: new Date().toISOString() }).eq('token', token)

  // Tell the parent their child has started, best effort. A trusted child
  // starts with a lighter touch, so no per session ping; watch still pings.
  // An approved ask start pings too, so the yes closes its loop both sides.
  if (trust !== 'trusted') {
    try {
      await sendPush({
          userId: link.user_id,
          title: `${childName} started ${mins} minutes on the ${deviceLabel(device)} ⏱️`,
          // Where it was paid from matters to a parent. Holiday minutes are
          // last summer's extra jobs being cashed in, not this week's allowance
          // running down, and a parent reading the balance later needs to know
          // which one they just watched happen.
          body: holidayDrawn > 0
            ? `${plan.starCost} star${plan.starCost === 1 ? '' : 's'} and ${holidayDrawn} minute${holidayDrawn === 1 ? '' : 's'} from their holiday savings. The timer is running, you can watch it on the quests board.`
            : plan.coreMinutes > 0 && plan.starCost === 0
            ? `All ${plan.coreMinutes} minutes from their free time today, no stars spent. The timer is running, you can watch it on the quests board.`
            : plan.coreMinutes > 0
            ? `${plan.coreMinutes} free minute${plan.coreMinutes === 1 ? '' : 's'} and ${plan.starCost} star${plan.starCost === 1 ? '' : 's'}. The timer is running, you can watch it on the quests board.`
            : `That is ${plan.starCost} star${plan.starCost === 1 ? '' : 's'} spent. The timer is running, you can watch it on the quests board.`,
          url: '/dashboard/quests',
        })
    } catch { /* push is best effort */ }
  }

  return NextResponse.json({ ok: true, session })
}
