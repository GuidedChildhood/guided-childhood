import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStarBanks } from '@/lib/quests/bank'
import { getMinutesUsedToday } from '@/lib/quests/usage'
import { pushToChild } from '@/lib/quests/kid-push'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { isPrintableAskTitle } from '@/lib/quests/printable-ask'

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

  const [childrenRes, questsRes, ticksRes, goalsRes, linksRes, requestsRes, spendsRes] = await Promise.all([
    // select * so the optional phone column (migration 030) is included
    // when present and its absence never breaks the whole board
    supabase.from('children').select('*').eq('parent_id', user.id).order('created_at'),
    supabase.from('family_quests').select('*').eq('user_id', user.id).eq('active', true).order('created_at'),
    supabase.from('quest_ticks').select('*').eq('user_id', user.id).gte('tick_date', weekAgo),
    supabase.from('star_goals').select('*').eq('user_id', user.id),
    supabase.from('kid_links').select('child_id, token').eq('user_id', user.id),
    supabase.from('quest_requests').select('*').eq('user_id', user.id)
      .gte('created_at', monthAgoIso).order('created_at', { ascending: false }),
    supabase.from('star_spends').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(20),
  ])

  const children = childrenRes.data ?? []
  const banks = await getStarBanks(supabase, user.id, children.map(c => c.id))

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
    ticks: ticksRes.data ?? [],
    goals: goalsRes.data ?? [],
    links: linksRes.data ?? [],
    requests: requestsRes.data ?? [],
    spends: spendsRes.data ?? [],
    banks,
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

    const cost = goal.stars_needed
    const [bank] = await getStarBanks(supabase, user.id, [body.child_id])
    if (!bank || bank.balance < cost) {
      return NextResponse.json({ error: 'not enough stars', balance: bank?.balance ?? 0 }, { status: 400 })
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
    return NextResponse.json({ ok: true, balance: bank.balance - cost })
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
        const stars = Math.min(10, Math.max(1, Number(body.stars) || 2))
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
        await pushToChild(
          createAdminClient(), user.id, request.child_id,
          'Your quest idea is on! ⭐',
          `"${request.title}" is now a real quest worth ${stars} star${stars === 1 ? '' : 's'}, that is ${stars * STAR_MINUTES} minutes. Go get it.`
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
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'title required' }, { status: 400 })
  }
  const cleanDays = (v: unknown): number[] | null => {
    if (!Array.isArray(v)) return null
    const days = [...new Set(v.filter(n => Number.isInteger(n) && n >= 0 && n <= 6) as number[])]
    return days.length ? days.sort() : null
  }
  const { data, error } = await supabase.from('family_quests').insert({
    user_id: user.id,
    child_id: child_id ?? null,
    title: title.slice(0, 120),
    emoji: (emoji ?? '⭐').slice(0, 8),
    stars: Math.min(10, Math.max(1, Number(stars) || 1)),
    schedule: ['daily', 'weekdays', 'weekend', 'once'].includes(schedule) ? schedule : 'daily',
    schedule_days: cleanDays(body.schedule_days),
    blocks_screens: Boolean(blocks_screens),
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ quest: data })
}

// Edit a quest in place: title, stars, schedule.
export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { quest_id, title, stars, schedule, schedule_days, blocks_screens } = await req.json()
  if (!quest_id) return NextResponse.json({ error: 'quest_id required' }, { status: 400 })

  const patch: Record<string, unknown> = {}
  if (typeof title === 'string' && title.trim()) patch.title = title.trim().slice(0, 120)
  if (stars !== undefined) patch.stars = Math.min(10, Math.max(1, Number(stars) || 1))
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

  const { error } = await supabase
    .from('family_quests').update(patch).eq('id', quest_id).eq('user_id', user.id)
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
