import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStarBanks } from '@/lib/quests/bank'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { isDeviceKey, minutesToStars, deviceLabel } from '@/lib/quests/device-time'
import { getMinutesUsedToday } from '@/lib/quests/usage'
import { wouldExceedGuide } from '@/lib/quests/daily-guide'
import { getTimeSettings, getCoreUsedToday, checkProtectedWindow, planTieredSpend } from '@/lib/quests/time-tiers'
import { pushToChild } from '@/lib/quests/kid-push'

// The parent grants device time to a child from their own dashboard. Same
// countdown both sides watch, but started by the parent. By default it spends
// the child's earned stars, exactly like the child doing it themselves, so the
// star economy holds. A bonus grant gives free minutes for a treat, spending
// no stars. Auth is the parent's own session, and RLS plus an explicit parent
// check keep it to their own children.

export async function POST(req: NextRequest) {
  const { childId, device, familyDeviceId, minutes, bonus, gift } = await req.json().catch(() => ({}))
  if (!childId || typeof childId !== 'string') {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  if (!isDeviceKey(device)) {
    return NextResponse.json({ error: 'bad device' }, { status: 400 })
  }
  const mins = Number(minutes)
  if (!Number.isFinite(mins) || mins < STAR_MINUTES || mins > 600 || mins % STAR_MINUTES !== 0) {
    return NextResponse.json({ error: 'bad minutes' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // The child must belong to this parent.
  const { data: child } = await supabase
    .from('children').select('id, name, age_band').eq('id', childId).eq('parent_id', user.id).maybeSingle()
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })

  // Which actual screen this is for, when the family has listed theirs. The
  // row is read back rather than trusted, both because it must be one of this
  // parent's own devices and because its name is what every message about this
  // block will use. Unknown or missing simply falls back to the kind, which is
  // how every session before migration 106 reads.
  let homeDevice: { id: string; label: string } | null = null
  if (typeof familyDeviceId === 'string' && familyDeviceId) {
    const { data } = await supabase
      .from('family_devices').select('id, label')
      .eq('id', familyDeviceId).eq('user_id', user.id).maybeSingle()
    homeDevice = (data as { id: string; label: string } | null) ?? null
  }
  // "on the tablet" but "on Ella's iPad": a named device does not take the
  // article, and reading "on the Ella's iPad" in a push notification is the
  // kind of thing that makes a product feel machine written.
  const screenName = homeDevice?.label ?? deviceLabel(device)
  const onScreen = homeDevice ? screenName : `the ${screenName.toLowerCase()}`

  // A gift starts the block without spending stars, like a bonus, but it
  // records a debt of jobs to do later: the pay back is saying thanks. The
  // next approved quest tick settles the oldest open debt by itself.
  const isGift = gift === true
  const isBonus = bonus === true || isGift
  const stars = isBonus ? 0 : minutesToStars(mins)

  // A grant that takes the child past the day's healthy amount for their age
  // is a treat: the parent knowingly gives it, it runs its full length, and
  // the guide crossing never cuts it short. Never a block, always their call.
  let treat = false
  try {
    const ageBand = (child as { age_band?: string | null }).age_band ?? null
    const usedMap = await getMinutesUsedToday(supabase, user.id, [childId])
    treat = wouldExceedGuide(ageBand, usedMap.get(childId) ?? 0, mins)
  } catch { /* without the read, the grant simply starts untagged */ }

  // The tiers (migration 223). A parent granted block inside a protected
  // window still runs, the parent is always the override, it is only tagged so
  // the weekly review can name it gently. And a paid grant draws today's core
  // baseline before stars, exactly like the child starting it themselves, so
  // the free part of the day is never quietly skipped. Fails open.
  let inProtectedWindow = false
  let coreLeftToday = 0
  try {
    const settingsMap = await getTimeSettings(supabase, user.id, [
      { id: childId, age_band: (child as { age_band?: string | null }).age_band ?? null },
    ])
    const settings = settingsMap.get(childId)
    if (settings) {
      inProtectedWindow = checkProtectedWindow(settings).protected
      if (!isBonus && settings.coreMinutesDaily > 0) {
        const coreUsed = await getCoreUsedToday(supabase, user.id, [childId])
        coreLeftToday = Math.max(0, settings.coreMinutesDaily - (coreUsed.get(childId) ?? 0))
      }
    }
  } catch { /* fail open */ }

  let coreMinutes = 0
  let paidStars = stars
  if (!isBonus) {
    // This week's balance, like /api/quests/spend. Screen time comes out of the
    // current star week only, so a long unspent run cannot be cashed in at once.
    // Core pays first, stars cover the rest, and the holiday bank stays the
    // child route's pocket.
    const [bank] = await getStarBanks(supabase, user.id, [childId], { [childId]: (child as { age_band?: string | null }).age_band ?? null })
    const plan = planTieredSpend(mins, coreLeftToday, bank?.balance ?? 0, 0, false)
    if (!bank || !plan.enough) {
      return NextResponse.json({ error: 'not enough stars this week', balance: bank?.balance ?? 0 }, { status: 400 })
    }
    coreMinutes = plan.coreMinutes
    paidStars = plan.starCost
  }

  // One live session at a time.
  await supabase.from('device_sessions')
    .update({ status: 'ended', ended_at: new Date().toISOString() })
    .eq('child_id', childId).eq('status', 'active')

  // Spend the stars now, unless this is a bonus grant. A block the core
  // baseline covered entirely plans zero stars, and star_spends checks stars
  // between 1 and 1000 (migration 047), so a zero star block simply has no
  // bank row, the same as a fully holiday funded start.
  let spendId: string | null = null
  if (!isBonus && paidStars > 0) {
    const { data: spend, error: spendError } = await supabase.from('star_spends').insert({
      user_id: user.id, child_id: childId, stars: paidStars, minutes: mins,
      note: coreMinutes > 0
        ? `Device time: ${screenName} (set by grown up, ${coreMinutes} free min)`
        : `Device time: ${screenName} (set by grown up)`,
    }).select('id').single()
    if (spendError) return NextResponse.json({ error: spendError.message }, { status: 500 })
    spendId = spend.id
  }

  const endsAt = new Date(Date.now() + mins * 60000).toISOString()
  const { data: session, error: sessionError } = await supabase.from('device_sessions').insert({
    user_id: user.id, child_id: childId, device, minutes: mins, stars: isBonus ? 0 : paidStars,
    spend_id: spendId, ends_at: endsAt, treat,
    ...(homeDevice ? { family_device_id: homeDevice.id } : {}),
    // Spread like activity in the child route, so a database still short of
    // migration 223 keeps taking sessions.
    ...(coreMinutes > 0 ? { core_minutes: coreMinutes } : {}),
    ...(inProtectedWindow ? { in_protected_window: true } : {}),
  }).select('id, device, minutes, stars, ends_at, started_at, treat').single()
  if (sessionError) return NextResponse.json({ error: sessionError.message }, { status: 500 })

  // Record the gift's pay back: the stars these minutes would have cost,
  // owed in jobs. Fails soft before migration 080: the time still starts,
  // because a gift is a gift either way.
  if (isGift) {
    await supabase.from('gift_debts').insert({
      user_id: user.id, child_id: childId, minutes: mins,
      stars_owed: minutesToStars(mins),
      note: `Gifted device time: ${screenName}`,
    })
  }

  // Tell the child their time has started, best effort, using the admin
  // client so the push helper can read the child's link and subscription.
  try {
    const admin = createAdminClient()
    await pushToChild(
      admin, user.id, childId,
      isGift ? `A gift: ${mins} minutes on ${onScreen} 💛`
        : isBonus ? `${mins} bonus minutes on ${onScreen} 🎁`
        : `${mins} minutes on ${onScreen} ⏱️`,
      isGift ? 'From your grown up, no stars spent. Do a job later to say thanks!'
        : isBonus ? 'A treat from your grown up. Open to start the timer.'
        : 'Your grown up set your screen time. Open to see the countdown.',
    )
  } catch { /* push is best effort */ }

  return NextResponse.json({
    ok: true,
    session: { ...session, family_device_id: homeDevice?.id ?? null },
    bonus: isBonus,
  })
}
