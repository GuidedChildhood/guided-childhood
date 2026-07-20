import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStarBanks } from '@/lib/quests/bank'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { isDeviceKey, minutesToStars, deviceLabel } from '@/lib/quests/device-time'
import { getMinutesUsedToday } from '@/lib/quests/usage'
import { wouldExceedGuide } from '@/lib/quests/daily-guide'
import { pushToChild } from '@/lib/quests/kid-push'

// The parent grants device time to a child from their own dashboard. Same
// countdown both sides watch, but started by the parent. By default it spends
// the child's earned stars, exactly like the child doing it themselves, so the
// star economy holds. A bonus grant gives free minutes for a treat, spending
// no stars. Auth is the parent's own session, and RLS plus an explicit parent
// check keep it to their own children.

export async function POST(req: NextRequest) {
  const { childId, device, minutes, bonus, gift } = await req.json().catch(() => ({}))
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

  if (!isBonus) {
    const [bank] = await getStarBanks(supabase, user.id, [childId])
    if (!bank || bank.balance < stars) {
      return NextResponse.json({ error: 'not enough stars', balance: bank?.balance ?? 0 }, { status: 400 })
    }
  }

  // One live session at a time.
  await supabase.from('device_sessions')
    .update({ status: 'ended', ended_at: new Date().toISOString() })
    .eq('child_id', childId).eq('status', 'active')

  // Spend the stars now, unless this is a bonus grant.
  let spendId: string | null = null
  if (!isBonus) {
    const { data: spend, error: spendError } = await supabase.from('star_spends').insert({
      user_id: user.id, child_id: childId, stars, minutes: mins,
      note: `Device time: ${deviceLabel(device)} (set by grown up)`,
    }).select('id').single()
    if (spendError) return NextResponse.json({ error: spendError.message }, { status: 500 })
    spendId = spend.id
  }

  const endsAt = new Date(Date.now() + mins * 60000).toISOString()
  const { data: session, error: sessionError } = await supabase.from('device_sessions').insert({
    user_id: user.id, child_id: childId, device, minutes: mins, stars,
    spend_id: spendId, ends_at: endsAt, treat,
  }).select('id, device, minutes, stars, ends_at, started_at, treat').single()
  if (sessionError) return NextResponse.json({ error: sessionError.message }, { status: 500 })

  // Record the gift's pay back: the stars these minutes would have cost,
  // owed in jobs. Fails soft before migration 080: the time still starts,
  // because a gift is a gift either way.
  if (isGift) {
    await supabase.from('gift_debts').insert({
      user_id: user.id, child_id: childId, minutes: mins,
      stars_owed: minutesToStars(mins),
      note: `Gifted device time: ${deviceLabel(device)}`,
    })
  }

  // Tell the child their time has started, best effort, using the admin
  // client so the push helper can read the child's link and subscription.
  try {
    const admin = createAdminClient()
    await pushToChild(
      admin, user.id, childId,
      isGift ? `A gift: ${mins} minutes on the ${deviceLabel(device)} 💛`
        : isBonus ? `${mins} bonus minutes on the ${deviceLabel(device)} 🎁`
        : `${mins} minutes on the ${deviceLabel(device)} ⏱️`,
      isGift ? 'From your grown up, no stars spent. Do a job later to say thanks!'
        : isBonus ? 'A treat from your grown up. Open to start the timer.'
        : 'Your grown up set your screen time. Open to see the countdown.',
    )
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, session, bonus: isBonus })
}
