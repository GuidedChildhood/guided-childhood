import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStarBanks } from '@/lib/quests/bank'
import { getHolidayBanks } from '@/lib/quests/holiday-bank'
import { getFamilyRegion } from '@/lib/learning/region'
import { getMinutesUsedToday } from '@/lib/quests/usage'
import { pushToChild } from '@/lib/quests/kid-push'
import { scheduleLabel } from '@/lib/quests/due'
import { getChildStarRate } from '@/lib/quests/time-tiers'
import { isPrintableAskTitle } from '@/lib/quests/printable-ask'
import { seedChildBaseline } from '@/lib/concerns/baseline'

// The parent's quest manager API. GET returns everything the manager and
// the board need in one call: children, their quests, today's ticks, the
// pending approval queue, the kids' own quest asks, each child's star
// bank and the goal. POST creates or updates a quest, decides a child's
// ask, DELETE deactivates. The kid link is created lazily the first time
// a child's quests are managed, so sharing is always possible.

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
  const monthAgoIso = new Date(Date.now() - 30 * 86400000).toISOString()

  const [childrenRes, questsRes, retiredRes, ticksRes, pendingRes, goalsRes, linksRes, requestsRes, spendsRes] = await Promise.all([
    // select * so the optional phone column (migration 030) is included
    // when present and its absence never breaks the whole board
    supabase.from('children').select('*').eq('parent_id', user.id).order('created_at'),
    supabase.from('family_quests').select('*').eq('user_id', user.id).eq('active', true).order('created_at'),
    // Jobs this family has used before and turned off.
    //
    // Removing a job sets active false rather than deleting it, which is the
    // right call, but nothing ever read them back. So a parent who took the
    // reading job off in the holidays had no way to put it back in September
    // except to type it out again from memory, and the app was quietly sitting
    // on the answer the whole time. This is the "show ones we added before"
    // list: their own history, one tap to restore.
    supabase.from('family_quests').select('*').eq('user_id', user.id).eq('active', false)
      .order('created_at', { ascending: false }).limit(40),
    supabase.from('quest_ticks').select('*').eq('user_id', user.id).gte('tick_date', weekAgo),
    // Pending ticks, with NO date window.
    //
    // The seven day window above is right for history: the board shows this
    // week and nobody needs last month's approved ticks in memory. It was very
    // wrong for pending ones. A child ticked a job, the parent did not open the
    // app for eight days, and the tick fell out of the window: still pending in
    // the database, never rendered, so never approvable, so the stars were gone
    // with nothing on either screen admitting it. Silently losing a child's
    // earned stars is about the worst thing this economy can do, because the
    // whole deal rests on the child believing the stars are real.
    //
    // Anything still waiting on a parent is loaded however old it is. There is
    // no natural cap on how long a parent takes to say yes.
    supabase.from('quest_ticks').select('*').eq('user_id', user.id).eq('status', 'pending'),
    supabase.from('star_goals').select('*').eq('user_id', user.id),
    supabase.from('kid_links').select('child_id, token').eq('user_id', user.id),
    supabase.from('quest_requests').select('*').eq('user_id', user.id)
      .gte('created_at', monthAgoIso).order('created_at', { ascending: false }),
    supabase.from('star_spends').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(20),
  ])

  // Merge the windowed history with every still pending tick, deduped by id.
  // A tick inside the last seven days comes back from both queries.
  const ticksById = new Map<string, Record<string, unknown>>()
  for (const t of [...(ticksRes.data ?? []), ...(pendingRes.data ?? [])]) {
    ticksById.set(t.id as string, t)
  }
  const ticks = [...ticksById.values()]

  const children = childrenRes.data ?? []
  const banks = await getStarBanks(supabase, user.id, children.map(c => c.id))

  // The holiday bank, alongside the ordinary star bank rather than folded into
  // it. The two are different kinds of money and the board was adding them up
  // into one number: this week's earned stars, which reset, and minutes banked
  // above the weekly cap, which do not and can only be spent while school is
  // out. Read together they looked like a runaway total. Read apart they are
  // the mechanic working. Fails soft to nothing, the same as every other read
  // on this route, so a family on a deploy without migration 127 sees the
  // ordinary balance and no holiday line rather than an error.
  let holidayBanks: Awaited<ReturnType<typeof getHolidayBanks>> = []
  try {
    const region = await getFamilyRegion(supabase, user.id)
    holidayBanks = await getHolidayBanks(supabase, user.id, children.map(c => c.id as string), new Date(), region)
  } catch { holidayBanks = [] }

  // Minutes of screen time each child has actually used today, so the balance
  // insight can show a real, moving level rather than a fixed age guide.
  const usedTodayMap = await getMinutesUsedToday(supabase, user.id, children.map(c => c.id))
  const usage: Record<string, number> = {}
  for (const c of children) usage[c.id as string] = usedTodayMap.get(c.id as string) ?? 0

  // Live device time sessions, so the board can show a running countdown
  // next to the child who is using their screen time right now.
  const { data: sessionRows } = await supabase
    .from('device_sessions')
    .select('id, child_id, device, minutes, stars, ends_at, started_at')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .gt('ends_at', new Date().toISOString())
  const sessions = sessionRows ?? []

  return NextResponse.json({
    children,
    quests: questsRes.data ?? [],
    // Deduped by title per child, because a job added and removed three times
    // should offer itself back once, not three times.
    previous: (() => {
      const live = new Set((questsRes.data ?? []).map(q => `${q.child_id ?? ''}|${String(q.title).toLowerCase()}`))
      const seen = new Set<string>()
      return (retiredRes.data ?? []).filter(q => {
        const key = `${q.child_id ?? ''}|${String(q.title).toLowerCase()}`
        if (live.has(key) || seen.has(key)) return false
        seen.add(key)
        return true
      })
    })(),
    ticks,
    goals: goalsRes.data ?? [],
    links: linksRes.data ?? [],
    requests: requestsRes.data ?? [],
    spends: spendsRes.data ?? [],
    banks,
    holidayBanks,
    sessions,
    usage,
  })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()

  // Add a child directly from the quest manager: no trip back through
  // onboarding, and the door to multi child families.
  if (body.action === 'child' && body.name && body.age_band) {
    const AGE_TO_STAGE: Record<string, string> = {
      '4-7': 'foundation', '8-10': 'builder', '11-13': 'explorer', '13-15': 'shaper', '16+': 'independent',
    }
    const stageId = AGE_TO_STAGE[body.age_band]
    if (!stageId) return NextResponse.json({ error: 'bad age band' }, { status: 400 })
    const { count } = await supabase
      .from('children').select('id', { count: 'exact', head: true }).eq('parent_id', user.id)
    // How they use it: explicit choice, else a sensible default by age. Under 11
    // (Foundation and Builder) defaults to parent led, no child device, because
    // that is the stance: we do not put a phone in a young child's hand. Their
    // own app is a deliberate choice for an older child who already has a device.
    const useMode = ['own', 'coview'].includes(body.use_mode) ? body.use_mode : (['4-7', '8-10'].includes(body.age_band) ? 'coview' : 'own')
    const { data, error } = await supabase.from('children').insert({
      parent_id: user.id,
      name: String(body.name).slice(0, 60),
      age_band: body.age_band,
      stage_id: stageId,
      is_primary: (count ?? 0) === 0,
      use_mode: useMode,
    }).select('id, name, age_band, use_mode').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // GIVE THEM SOMETHING TO BE ASKED ABOUT (15 August 2026).
    //
    // A child added here used to arrive with no concerns of their own, and the
    // family baseline only ever seeds a family with an empty ledger, so every
    // child after the first was invisible to the check in for ever. On the live
    // account that is exactly what had happened: 27 concerns, all Teo's, and
    // Olga with none.
    //
    // Fire and forget. A child who is added is added; a baseline that failed to
    // seed is a check in with one fewer row on it, and must never be the reason
    // the parent sees an error after typing a name.
    if (data?.id) {
      await seedChildBaseline(supabase, user.id, data.id as string)
        .catch(() => { /* the child still exists, which is the thing they asked for */ })
    }
    return NextResponse.json({ child: data })
  }

  // Change how a child uses it: their own app, or co-view together.
  if (body.action === 'usemode' && body.child_id && ['own', 'coview'].includes(body.use_mode)) {
    const { error } = await supabase
      .from('children').update({ use_mode: body.use_mode }).eq('id', body.child_id).eq('parent_id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // Save the child's daily screen time limit. A number is clamped to a sane
  // range, and null resets it back to the age based recommendation.
  if (body.action === 'dailylimit' && body.child_id) {
    const raw = body.minutes
    const limit = raw == null || raw === '' ? null : Math.max(15, Math.min(300, Math.round(Number(raw))))
    if (limit !== null && !Number.isFinite(limit)) {
      return NextResponse.json({ error: 'bad minutes' }, { status: 400 })
    }
    const { error } = await supabase
      .from('children').update({ daily_limit_minutes: limit }).eq('id', body.child_id).eq('parent_id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // Save the child's phone number (optional, drives send to phone)
  if (body.action === 'phone' && body.child_id) {
    const phone = String(body.phone ?? '').replace(/[^0-9+ ]/g, '').slice(0, 20)
    const { error } = await supabase
      .from('children').update({ phone: phone || null }).eq('id', body.child_id).eq('parent_id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // Create the kid link for a child on demand
  if (body.action === 'link' && body.child_id) {
    const { data: existing } = await supabase
      .from('kid_links').select('token').eq('child_id', body.child_id).maybeSingle()
    if (existing) return NextResponse.json({ token: existing.token })
    const token = randomBytes(9).toString('hex')
    const { error } = await supabase.from('kid_links').insert({
      user_id: user.id, child_id: body.child_id, token,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ token })
  }

  // Set or update the star goal for a child
  if (body.action === 'goal' && body.child_id && body.title) {
    const row = {
      user_id: user.id, child_id: body.child_id,
      title: String(body.title).slice(0, 120),
      stars_needed: Math.min(500, Math.max(1, Number(body.stars_needed) || 20)),
      daily_stars: body.daily_stars ? Math.min(100, Math.max(1, Number(body.daily_stars))) : null,
      achieved_at: null,
    }
    const { data: existing } = await supabase
      .from('star_goals').select('id').eq('child_id', body.child_id).maybeSingle()
    const { error } = existing
      ? await supabase.from('star_goals').update(row).eq('id', existing.id)
      : await supabase.from('star_goals').insert(row)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // Mark the saving goal complete from the parent side: the child saved
  // enough, the parent hands over the real reward, so the stars are spent and
  // the goal is marked redeemed. Same honest bank as the child's own redeem,
  // just driven by the grown up. One redemption per goal, until a new one is
  // set. The child gets a little cheer on their page.
  if (body.action === 'goal_redeem' && body.child_id) {
    const { data: goal } = await supabase
      .from('star_goals').select('id, title, stars_needed, achieved_at')
      .eq('child_id', body.child_id).eq('user_id', user.id).maybeSingle()
    if (!goal) return NextResponse.json({ error: 'no goal' }, { status: 404 })
    if (goal.achieved_at) return NextResponse.json({ error: 'already redeemed', already: true }, { status: 400 })

      // Lifetime balance on purpose, NOT the weekly one. A goal is a real world
      // reward a child saves towards over weeks, so hoarding stars for it is the
      // behaviour we want. The Monday reset exists to stop screen time being
      // hoarded, which is a different thing entirely. Switching this to weekBalance
      // would make any goal costing more than one week's cap unreachable for ever.
    const cost = goal.stars_needed
    const [bank] = await getStarBanks(supabase, user.id, [body.child_id])
    if (!bank || bank.lifetimeBalance < cost) {
      return NextResponse.json({ error: 'not enough stars', balance: bank?.lifetimeBalance ?? 0 }, { status: 400 })
    }

    // Spend the stars (a reward has no minutes) and mark the goal redeemed.
    const { error: spendError } = await supabase.from('star_spends').insert({
      user_id: user.id, child_id: body.child_id, stars: cost, minutes: 0,
      note: `🎁 Reward: ${goal.title}`,
    })
    if (spendError) return NextResponse.json({ error: spendError.message }, { status: 500 })
    await supabase.from('star_goals').update({ achieved_at: new Date().toISOString() }).eq('id', goal.id)

    // Cheer the child on their own page.
    await pushToChild(
      createAdminClient(), user.id, body.child_id,
      'You earned your reward! 🎉',
      `You saved ${cost} star${cost === 1 ? '' : 's'} for "${goal.title}". Enjoy it, then pick a new thing to save for.`
    )
    return NextResponse.json({ ok: true, balance: bank.lifetimeBalance - cost })
  }

  // Decide a child's own quest ask: added turns it into a real quest with
  // the stars the parent sets, declined closes it kindly. Either way the
  // child's page shows the answer, and their device gets a nudge if their
  // reminders are on.
  if (body.action === 'request_decide' && body.request_id && ['added', 'declined'].includes(body.decision)) {
    const { data: request } = await supabase
      .from('quest_requests')
      .select('id, child_id, title, emoji, status')
      .eq('id', body.request_id)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .maybeSingle()
    if (!request) return NextResponse.json({ error: 'unknown request' }, { status: 404 })

    // A swap ask trades one of today's jobs for this new one (migration 184).
    // Read in its own guarded query so a database still short of the column
    // treats the ask as an ordinary pitch rather than failing the decide.
    let swapOld: { id: string; title: string; stars: number; child_id: string | null } | null = null
    try {
      const { data: swapRow } = await supabase
        .from('quest_requests').select('swap_quest_id').eq('id', request.id).maybeSingle()
      const swapId = (swapRow as { swap_quest_id?: string | null } | null)?.swap_quest_id
      if (swapId) {
        const { data: oldQ } = await supabase
          .from('family_quests')
          .select('id, title, stars, child_id')
          .eq('id', swapId).eq('user_id', user.id).eq('active', true)
          .maybeSingle()
        if (oldQ) swapOld = oldQ as { id: string; title: string; stars: number; child_id: string | null }
      }
    } catch { /* pre migration 184: an ordinary pitch */ }

    if (body.decision === 'added') {
      // A printable ask is not a job: turning "Please can I do the X printable"
      // into a family_quest would drop the child's own asking phrase into their
      // daily list as a task. Printables live in the printables flow, where the
      // child does the sheet and claims its own stars, so here the ask is simply
      // said yes to and closed, and the child is pointed at their Printables tab.
      if (isPrintableAskTitle(request.title)) {
        await pushToChild(
          createAdminClient(), user.id, request.child_id,
          'Yes to your printable! 🖍️',
          'Your grown up said yes. Open your Printables to colour it in and earn the stars.'
        )
      } else {
        // A swap is like for like: the new job is worth what the old one was,
        // whatever default the deciding surface happened to send, because a
        // trade that quietly changed the price is not the trade the child
        // proposed or the parent read.
        const stars = swapOld
          ? Math.min(10, Math.max(1, Number(swapOld.stars) || 2))
          : Math.min(10, Math.max(1, Number(body.stars) || 2))
        const schedule = ['daily', 'weekdays', 'weekend', 'once'].includes(body.schedule) ? body.schedule : 'once'
        const { error: questError } = await supabase.from('family_quests').insert({
          user_id: user.id,
          child_id: request.child_id,
          title: request.title,
          emoji: request.emoji ?? '⭐',
          stars,
          schedule,
        })
        if (questError) return NextResponse.json({ error: questError.message }, { status: 500 })

        // The other half of the trade: the old job comes off the board, but
        // ONLY when it belongs to this child alone. A whole family job also
        // belongs to their siblings, and one child's swap must never delete a
        // job from somebody else's day; there it stays, and the parent can
        // retire it by hand from Manage if they want to.
        if (swapOld && swapOld.child_id === request.child_id) {
          await supabase.from('family_quests')
            .update({ active: false })
            .eq('id', swapOld.id).eq('user_id', user.id)
        }

        // Priced at THIS child's star rate (migration 225), so the promise in
        // the push matches what the timer will actually hand over.
        const rate = await getChildStarRate(supabase, user.id, request.child_id)
        await pushToChild(
          createAdminClient(), user.id, request.child_id,
          swapOld ? 'Your swap is on! 🔁' : 'Your quest idea is on! ⭐',
          swapOld
            ? `"${request.title}" takes the place of "${swapOld.title}", worth the same ${stars} star${stars === 1 ? '' : 's'}. Go get it.`
            : `"${request.title}" is now a real quest worth ${stars} star${stars === 1 ? '' : 's'}, that is ${stars * rate} minutes. Go get it.`
        )
      }
    } else {
      await pushToChild(
        createAdminClient(), user.id, request.child_id,
        'About your quest idea',
        `"${request.title}" is not one for now, but keep the ideas coming.`
      )
    }

    const { error } = await supabase
      .from('quest_requests')
      .update({ status: body.decision, decided_at: new Date().toISOString() })
      .eq('id', request.id)
      .eq('user_id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // Create a quest
  const { title, emoji, stars, schedule, child_id, blocks_screens } = body
  // Suppress this job's own push. Set by callers adding several at once, which
  // then send one summary instead. See the note by the push below.
  const quiet = Boolean(body.quiet)
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'title required' }, { status: 400 })
  }
  const cleanDays = (v: unknown): number[] | null => {
    if (!Array.isArray(v)) return null
    const days = [...new Set(v.filter(n => Number.isInteger(n) && n >= 0 && n <= 6) as number[])]
    return days.length ? days.sort() : null
  }
  // Up to five short steps that chunk a big job (migration 224). Scaffolding
  // only: the stars sit on the finished job, never per step.
  const cleanSteps = (v: unknown): string[] | null => {
    if (!Array.isArray(v)) return null
    const steps = v.filter(s => typeof s === 'string' && s.trim()).map(s => (s as string).trim().slice(0, 60)).slice(0, 5)
    return steps.length ? steps : null
  }
  // A family job carries no stars because contribution is belonging, not
  // payment. The stars column keeps its constraint value; the bank zeroes it.
  const isFamilyJob = body.is_family_job === true
  const insertRow = (withSince: boolean) => supabase.from('family_quests').insert({
    user_id: user.id,
    child_id: child_id ?? null,
    title: title.slice(0, 120),
    emoji: (emoji ?? '⭐').slice(0, 8),
    stars: Math.min(10, Math.max(1, Number(stars) || 1)),
    schedule: ['daily', 'weekdays', 'weekend', 'once'].includes(schedule) ? schedule : 'daily',
    schedule_days: cleanDays(body.schedule_days),
    // Null when the parent left it on "work it out", which keeps the guess from
    // the title. Validated here as well as by the column's own check, so a bad
    // value is a 400 rather than a constraint error the caller cannot read.
    band: ['morning', 'after_school', 'evening'].includes(body.band) ? body.band : null,
    blocks_screens: Boolean(blocks_screens),
    // Spread so a database still short of migrations 223 and 224 keeps
    // creating quests instead of rejecting every one on an unknown column.
    // family_job_since makes the no stars rule forward only (migration 226):
    // set at creation it changes nothing today and protects the history if
    // the flag is ever flipped off and on again later.
    ...(isFamilyJob ? { is_family_job: true, ...(withSince ? { family_job_since: new Date().toISOString() } : {}) } : {}),
    ...(cleanSteps(body.steps) ? { steps: cleanSteps(body.steps) } : {}),
  }).select().single()
  let { data, error } = await insertRow(true)
  // Pre migration 226: retry without the since column so the job still lands.
  if (error && isFamilyJob && /family_job_since/i.test(error.message)) {
    ;({ data, error } = await insertRow(false))
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Tell the child a job has landed.
  //
  // This was the ONE creation path that did not. Approving a child's own idea
  // pushes, saying no to it pushes, a gift of screen time pushes, a printable
  // pushes, a nudge pushes. A parent adding a job from the Quests page, which is
  // the main way jobs get created, wrote the row and said nothing, so the job
  // appeared silently on the child's list whenever they next happened to open
  // their app. Justin saw exactly this: the gift arrived on the phone and the
  // job did not.
  //
  // Only when the job belongs to a child. A quest with no child_id is a family
  // one and has nobody in particular to tell. Best effort, same as everywhere
  // else here: a push that fails must never lose the job that was just saved.
  //
  // `quiet` is how a bulk add opts out, and it exists because adding the push
  // here quietly turned every routine into a barrage. A routine is five jobs,
  // added in a loop, and the caller was already sending one "New routine"
  // summary afterwards. So a parent tapping Morning routine sent the child SIX
  // notifications in a few seconds. A child who is buzzed six times for one
  // action learns to turn notifications off, which costs us every push after it.
  //
  // The rule now: this route owns the notification for ONE job. A caller adding
  // several passes quiet and sends a single summary of its own.
  if (data?.child_id && !quiet) {
    const mins = (data.stars ?? 1) * await getChildStarRate(supabase, user.id, data.child_id as string)
    // A before screens job is a different message, because it changes what the
    // child can do next rather than just adding to the list.
    const gate = data.blocks_screens
      ? ' This one comes before screens today.'
      : ''
    // A family job says belonging, never payment: no star count, no minutes,
    // because pricing it is exactly what the flag exists to avoid.
    if (isFamilyJob) {
      const everyFj = scheduleLabel(data.schedule as string | null, data.schedule_days as number[] | null)
      await pushToChild(
        createAdminClient(), user.id, data.child_id as string,
        `A new family job ${data.emoji ?? '🏠'}`,
        `"${data.title}" is one of the jobs we all do for each other.${everyFj ? ` It happens ${everyFj}.` : ''}${gate} Tap it done when it is finished.`
      )
      return NextResponse.json({ quest: data })
    }
    // How often it happens, said ONCE, here.
    //
    // Justin: "if it's set for weekdays it sends a notification for exact day
    // so 5, but only need to send one that job has been added and say if weekly
    // etc." The five are the reminder cron, not five adds. But this message
    // never named the cadence, so a child met the job and then five nudges
    // across the week having never been told it was a weekday job. Stated here,
    // the later nudges read as the thing already agreed rather than pestering.
    const every = scheduleLabel(data.schedule as string | null, data.schedule_days as number[] | null)
    const when = every ? ` It happens ${every}.` : ''
    await pushToChild(
      createAdminClient(), user.id, data.child_id as string,
      `A new job from your grown up ${data.emoji ?? '⭐'}`,
      `"${data.title}" is worth ${data.stars} star${data.stars === 1 ? '' : 's'}, that is ${mins} minutes.${when}${gate} Tap it done when it is finished.`
    )
  }
  return NextResponse.json({ quest: data })
}

// Edit a quest in place: title, stars, schedule.
export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { quest_id, title, stars, schedule, schedule_days, blocks_screens, is_family_job, steps } = await req.json()
  if (!quest_id) return NextResponse.json({ error: 'quest_id required' }, { status: 400 })

  const patch: Record<string, unknown> = {}
  if (typeof title === 'string' && title.trim()) patch.title = title.trim().slice(0, 120)
  if (stars !== undefined) patch.stars = Math.min(10, Math.max(1, Number(stars) || 1))
  if (typeof is_family_job === 'boolean') {
    patch.is_family_job = is_family_job
    // Forward only (migration 226): flipping an old job to family job stops
    // its stars from TODAY, never retroactively, so the child's lifetime
    // earned cannot drop for a decision made after the work was done.
    // Flipping it back clears the mark so a later re flip starts fresh.
    patch.family_job_since = is_family_job ? new Date().toISOString() : null
  }
  // Steps: an array sets them (up to five short lines), null clears them.
  if (Array.isArray(steps)) {
    const clean = steps.filter((s: unknown) => typeof s === 'string' && (s as string).trim())
      .map((s: unknown) => (s as string).trim().slice(0, 60)).slice(0, 5)
    patch.steps = clean.length ? clean : null
  } else if (steps === null) {
    patch.steps = null
  }
  if (['daily', 'weekdays', 'weekend', 'once'].includes(schedule)) patch.schedule = schedule
  // Chosen days: an array sets them, null clears back to the schedule text.
  if (Array.isArray(schedule_days)) {
    const days = [...new Set(schedule_days.filter((n: unknown) => Number.isInteger(n) && (n as number) >= 0 && (n as number) <= 6) as number[])].sort()
    patch.schedule_days = days.length ? days : null
  } else if (schedule_days === null) {
    patch.schedule_days = null
  }
  if (typeof blocks_screens === 'boolean') patch.blocks_screens = blocks_screens
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'nothing to update' }, { status: 400 })

  let { error } = await supabase
    .from('family_quests').update(patch).eq('id', quest_id).eq('user_id', user.id)
  // Pre migration 226: the since column does not exist yet. Retry without it
  // so the toggle itself still lands, with the old wholesale zeroing.
  if (error && 'family_job_since' in patch && /family_job_since/i.test(error.message)) {
    delete patch.family_job_since
    ;({ error } = await supabase
      .from('family_quests').update(patch).eq('id', quest_id).eq('user_id', user.id))
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { quest_id } = await req.json()
  if (!quest_id) return NextResponse.json({ error: 'quest_id required' }, { status: 400 })
  const { error } = await supabase
    .from('family_quests').update({ active: false }).eq('id', quest_id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
