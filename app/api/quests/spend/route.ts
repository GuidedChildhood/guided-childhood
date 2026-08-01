import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStarBanks } from '@/lib/quests/bank'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { isDeviceKey, isActivityKey, asksActivity, deviceLabel } from '@/lib/quests/device-time'

// Screen time gets used: the parent marks the minutes and the stars come
// off the bank. The whole point of the deal is that earned time is real,
// so spending it is one tap, never a negotiation. Balance is computed
// server side and a spend can never take the bank below zero.
//
// It also writes the session, which is the part that was missing. A spend on
// its own is minutes and stars: no device, no activity, no trace of which
// screen the time went on. Every weekly breakdown reads device_sessions, so a
// family who marks time by hand had a balance report that showed them almost
// no screen use at all while the stars drained out of the bank. The session
// written here carries the device and is tied to its spend by spend_id, which
// getMinutesUsedToday already skips, so today's total still counts it once.

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { child_id, minutes, device, familyDeviceId, activity } = await req.json().catch(() => ({}))
  const mins = Number(minutes)
  if (!child_id || !Number.isFinite(mins) || mins < STAR_MINUTES || mins > 480) {
    return NextResponse.json({ error: 'child_id and minutes required' }, { status: 400 })
  }

  // Which screen. Optional, because this endpoint predates the question and a
  // caller that cannot answer it should still be able to spend the stars: the
  // economy is the part that must never break. When it is given it has to be
  // one of the real kinds rather than whatever arrived in the body.
  if (device !== undefined && device !== null && !isDeviceKey(device)) {
    return NextResponse.json({ error: 'bad device' }, { status: 400 })
  }
  const kind: string | null = isDeviceKey(device) ? device : null

  // A computer is the one device whose bucket cannot be read off the device, so
  // the child or parent names it. Anything else ignores the field rather than
  // storing a claim nobody made.
  const named = kind && asksActivity(kind) && isActivityKey(activity) ? activity : null

  const { data: child } = await supabase
    .from('children').select('id, age_band').eq('id', child_id).eq('parent_id', user.id).maybeSingle()
  if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })

  // THIS WEEK's balance, not the lifetime one. Screen time is the one thing that
  // must not hoard, which is the whole point of the Monday reset: a child cannot
  // save up eight weeks of unspent time and then spend 28 hours of it. What they
  // did not use converts to sticker credits instead, so restraint still pays.
  const [bank] = await getStarBanks(supabase, user.id, [child_id], { [child_id]: (child as { age_band?: string | null }).age_band ?? null })
  if (!bank || bank.balance <= 0) {
    return NextResponse.json({ error: 'Nothing left this week' }, { status: 400 })
  }

  // The real screen, when the family has listed theirs. Read back rather than
  // trusted: it has to be one of this parent's own devices, and its name is
  // what the spend note will say.
  let homeDevice: { id: string; label: string; kind: string } | null = null
  if (typeof familyDeviceId === 'string' && familyDeviceId) {
    const { data } = await supabase
      .from('family_devices').select('id, label, kind')
      .eq('id', familyDeviceId).eq('user_id', user.id).maybeSingle()
    homeDevice = (data as { id: string; label: string; kind: string } | null) ?? null
  }
  // The kind the session is keyed on comes from the named device when there is
  // one, so picking "Ella's iPad" can never file the minutes under the TV.
  const sessionKind = homeDevice && isDeviceKey(homeDevice.kind) ? homeDevice.kind : kind
  const screenName = homeDevice?.label ?? (sessionKind ? deviceLabel(sessionKind) : null)

  // Round the ask to whole stars and never spend more than is there
  const stars = Math.min(bank.balance, Math.max(1, Math.round(mins / STAR_MINUTES)))
  const spentMinutes = stars * STAR_MINUTES
  const { data: spend, error } = await supabase.from('star_spends').insert({
    user_id: user.id,
    child_id,
    stars,
    minutes: spentMinutes,
    note: screenName ? `Screen time: ${screenName} (marked by hand)` : 'Screen time (marked by hand)',
  }).select('id').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // The matching session, so the week's breakdown can see these minutes at all.
  // Already over when it is written: this is a record of time that has been
  // used, not a countdown, so it never shows up as a live block on the child's
  // phone. Best effort on purpose. The stars are already off the bank and the
  // parent has been told so, and failing the whole request here would leave
  // them tapping again and spending twice.
  let logged = false
  if (sessionKind) {
    // Stamped now, not backdated by the minutes. Both windows that matter read
    // started_at: today's total from midnight UTC, the weekly breakdown from
    // Monday. Backdating an hour marked just after either boundary would drop
    // the session out of the window its own spend sits in, which is the exact
    // hole this is here to close. Nobody told us when the time actually
    // happened, so the honest stamp is when it was recorded, and `minutes`
    // carries the length.
    const now = new Date().toISOString()
    const { error: sessionError } = await supabase.from('device_sessions').insert({
      user_id: user.id,
      child_id,
      device: sessionKind,
      minutes: spentMinutes,
      stars,
      spend_id: spend.id,
      status: 'ended',
      started_at: now,
      ends_at: now,
      ended_at: now,
      manual: true,
      ...(named ? { activity: named } : {}),
      ...(homeDevice ? { family_device_id: homeDevice.id } : {}),
    })
    logged = !sessionError
  }

  // What is left THIS WEEK, matching what was just gated on. Returning the
  // lifetime figure here would have the screen say a child still has hours left
  // immediately after telling them the week was spent.
  const balance = bank.balance - stars
  return NextResponse.json({
    ok: true,
    spent_stars: stars,
    spent_minutes: spentMinutes,
    balance,
    balance_minutes: balance * STAR_MINUTES,
    device: sessionKind,
    device_label: screenName,
    // Whether the week's breakdown will show these minutes. False means the
    // spend landed but the session did not, so the stars are right and the
    // per device chart is one block short.
    logged,
  })
}
