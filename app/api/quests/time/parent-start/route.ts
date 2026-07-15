import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStarBanks } from '@/lib/quests/bank'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { isDeviceKey, minutesToStars, deviceLabel } from '@/lib/quests/device-time'
import { pushToChild } from '@/lib/quests/kid-push'

// The parent grants device time to a child from their own dashboard. Same
// countdown both sides watch, but started by the parent. By default it spends
// the child's earned stars, exactly like the child doing it themselves, so the
// star economy holds. A bonus grant gives free minutes for a treat, spending
// no stars. Auth is the parent's own session, and RLS plus an explicit parent
// check keep it to their own children.

export async function POST(req: NextRequest) {
  const { childId, device, minutes, bonus } = await req.json().catch(() => ({}))
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
    .from('children').select('id, name').eq('id', childId).eq('parent_id', user.id).maybeSingle()
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })

  const isBonus = bonus === true
  const stars = isBonus ? 0 : minutesToStars(mins)

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
    spend_id: spendId, ends_at: endsAt,
  }).select('id, device, minutes, stars, ends_at, started_at').single()
  if (sessionError) return NextResponse.json({ error: sessionError.message }, { status: 500 })

  // Tell the child their time has started, best effort, using the admin
  // client so the push helper can read the child's link and subscription.
  try {
    const admin = createAdminClient()
    await pushToChild(
      admin, user.id, childId,
      isBonus ? `${mins} bonus minutes on the ${deviceLabel(device)} 🎁` : `${mins} minutes on the ${deviceLabel(device)} ⏱️`,
      isBonus ? 'A treat from your grown up. Open to start the timer.' : 'Your grown up set your screen time. Open to see the countdown.',
    )
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, session, bonus: isBonus })
}
