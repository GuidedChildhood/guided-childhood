import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ageFromDob } from '@/lib/children/age'

// The fortnightly device sweep, and DiGi's brain behind it. Separate from the
// usage signal check ins: this one asks every parent, every two weeks, whether
// a new device has come into the house, and to check the settings still match
// the child's age. It runs on a plain 14 day clock, not on device_sessions
// data, so it reaches families whose child app is not tracking usage yet.
//
// It is clever from what the family has already told us. It reads the devices
// they marked set up, and the child's birthday, and leads with the most useful
// thing:
//   just had a birthday  -> the settings shift with age, take another look
//   a console is set up   -> which games are they on, DiGi will flag warnings
//   otherwise             -> the plain any new devices nudge
//
// Cadence is stored in digi_device_checkins under a fixed prompt_id, reusing
// the same table as the signal cards. GET says whether one is due for the
// primary child, and what to lead with. POST 'seen' stamps the clock, 'done'
// records the confirm.

const SWEEP_PROMPT = 'device_sweep'
const SWEEP_GAP_DAYS = 14
const BIRTHDAY_RECENT_DAYS = 30

export const dynamic = 'force-dynamic'

// Whole days since the child's most recent birthday, or null with no birthday.
function daysSinceBirthday(dob: string | null | undefined, on = new Date()): number | null {
  if (!dob) return null
  const birth = new Date(`${dob.slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(birth.getTime())) return null
  let bday = new Date(Date.UTC(on.getUTCFullYear(), birth.getUTCMonth(), birth.getUTCDate()))
  if (bday.getTime() > on.getTime()) bday = new Date(Date.UTC(on.getUTCFullYear() - 1, birth.getUTCMonth(), birth.getUTCDate()))
  return Math.floor((on.getTime() - bday.getTime()) / 86_400_000)
}

type Focus =
  | { kind: 'birthday' | 'games' | 'generic'; headline: string; sub: string; chat?: { label: string; q: string } }

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ due: false })

  const { data: child } = await supabase
    .from('children')
    .select('id, name, date_of_birth')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .maybeSingle()
  if (!child) return NextResponse.json({ due: false })

  const since = new Date(Date.now() - SWEEP_GAP_DAYS * 86_400_000).toISOString()
  const { data: recent, error } = await supabase
    .from('digi_device_checkins')
    .select('id')
    .eq('user_id', user.id)
    .eq('child_id', child.id)
    .eq('prompt_id', SWEEP_PROMPT)
    .gte('shown_at', since)
    .limit(1)
    .maybeSingle()

  // No table yet (migration 082 not applied) means we cannot honour the
  // fortnight cap, so say nothing rather than nag every visit.
  if (error) return NextResponse.json({ due: false })
  if (recent) return NextResponse.json({ due: false })

  const name = child.name && child.name !== 'Your child' ? child.name : null
  const ageNow = ageFromDob(child.date_of_birth)
  const bdayDays = daysSinceBirthday(child.date_of_birth as string | null)

  // Which devices this family has actually set up, so DiGi can talk about
  // the real thing in the house rather than a generic list.
  const { data: progress } = await supabase
    .from('device_setup_progress')
    .select('device_key, status')
    .eq('user_id', user.id)
  const doneKeys = (progress ?? [])
    .filter(p => (p.status ?? 'done') === 'done')
    .map(p => p.device_key as string)

  let consoleName: string | null = null
  if (doneKeys.length) {
    const { data: guides } = await supabase
      .from('device_guides')
      .select('device_key, name, category')
      .in('device_key', doneKeys)
    const gaming = (guides ?? []).find(g => /gaming|console/i.test(g.category as string))
    if (gaming) consoleName = gaming.name as string
  }

  const forName = name ? ` for ${name}` : ''
  let focus: Focus

  if (ageNow != null && bdayDays != null && bdayDays <= BIRTHDAY_RECENT_DAYS) {
    // A birthday just landed: the right settings shift with age.
    const who = name ?? 'They'
    focus = {
      kind: 'birthday',
      headline: name ? `${name} is ${ageNow} now.` : `They are ${ageNow} now.`,
      sub: 'The right settings shift as they grow. Give the guides another look so everything still fits their age, and set up anything new from their birthday here.',
      chat: {
        label: `Ask DiGi what changes at ${ageNow}`,
        q: `${who} just turned ${ageNow}. Which device and app settings should I update now they are this age, and what changes at this stage?`,
      },
    }
  } else if (consoleName) {
    // A console is in the house: DiGi can research the games they play.
    focus = {
      kind: 'games',
      headline: `Any new devices${forName}?`,
      sub: `And how is the ${consoleName} going? Tell DiGi which games they play the most and I will flag anything worth knowing about them.`,
      chat: {
        label: 'Talk to DiGi about their games',
        q: `${name ?? 'My child'} plays on the ${consoleName}. Which of the popular games should I know the age ratings and warnings for, and what should I check in the settings?`,
      },
    }
  } else {
    focus = {
      kind: 'generic',
      headline: `Any new devices${forName}?`,
      sub: 'A new phone, console or tablet? Set it up here, and give the settings a look so they still match their age.',
    }
  }

  return NextResponse.json({ due: true, childId: child.id, childName: name, focus })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })

  let body: { event?: string; childId?: string }
  try { body = await req.json() } catch { return NextResponse.json({ ok: false }, { status: 400 }) }
  if (!body.childId) return NextResponse.json({ ok: false }, { status: 400 })

  if (body.event === 'seen') {
    // Start the fortnight clock the moment the card is shown.
    const { data, error } = await supabase.from('digi_device_checkins').insert({
      user_id: user.id, child_id: body.childId, prompt_id: SWEEP_PROMPT,
    }).select('id').maybeSingle()
    if (error) return NextResponse.json({ ok: false })
    return NextResponse.json({ ok: true, id: data?.id ?? null })
  }

  if (body.event === 'done') {
    // Best effort: mark the most recent sweep row for this child as answered.
    const { data: row } = await supabase.from('digi_device_checkins')
      .select('id')
      .eq('user_id', user.id).eq('child_id', body.childId).eq('prompt_id', SWEEP_PROMPT)
      .order('shown_at', { ascending: false }).limit(1).maybeSingle()
    if (row?.id) {
      await supabase.from('digi_device_checkins')
        .update({ response: 'yes', responded_at: new Date().toISOString() })
        .eq('id', row.id).eq('user_id', user.id)
    }
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: false }, { status: 400 })
}
