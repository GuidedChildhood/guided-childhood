import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTimeSettings } from '@/lib/quests/time-tiers'

// The parent sets a child's three tier time: the core baseline (unconditional
// daily minutes, 0 means off), the bedtime window, and the mealtime and
// school hour protections. Per child, like trust. Scoped to their own
// children by session and RLS, same shape as the trust route.

const HM = /^([01]?\d|2[0-3]):[0-5]\d$/

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const childId = req.nextUrl.searchParams.get('childId')
  if (!childId) return NextResponse.json({ error: 'childId required' }, { status: 400 })

  const { data: child } = await supabase
    .from('children').select('id, age_band').eq('id', childId).eq('parent_id', user.id).maybeSingle()
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })

  // Effective settings, age band defaults applied, so the card always shows
  // what the timer will actually do rather than a row of blanks.
  const map = await getTimeSettings(supabase, user.id, [
    { id: childId, age_band: (child as { age_band?: string | null }).age_band ?? null },
  ])
  const s = map.get(childId)
  const toHm = (m: number | null) => m === null ? null
    : `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
  return NextResponse.json({
    coreMinutesDaily: s?.coreMinutesDaily ?? 0,
    bedtimeStart: toHm(s?.bedtimeStartMin ?? null),
    bedtimeEnd: toHm(s?.bedtimeEndMin ?? null),
    protectMealtimes: s?.protectMealtimes ?? false,
    protectSchoolHours: s?.protectSchoolHours ?? false,
  })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { childId, coreMinutesDaily, bedtimeStart, bedtimeEnd, protectMealtimes, protectSchoolHours } =
    await req.json().catch(() => ({}))
  if (!childId || typeof childId !== 'string') {
    return NextResponse.json({ error: 'childId required' }, { status: 400 })
  }
  const core = Number(coreMinutesDaily)
  if (!Number.isFinite(core) || core < 0 || core > 240) {
    return NextResponse.json({ error: 'bad core minutes' }, { status: 400 })
  }
  const start = typeof bedtimeStart === 'string' && HM.test(bedtimeStart) ? bedtimeStart : null
  const end = typeof bedtimeEnd === 'string' && HM.test(bedtimeEnd) ? bedtimeEnd : null

  const { data: child } = await supabase
    .from('children').select('id').eq('id', childId).eq('parent_id', user.id).maybeSingle()
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })

  const { error } = await supabase.from('child_time_settings').upsert({
    user_id: user.id,
    child_id: childId,
    core_minutes_daily: Math.round(core),
    bedtime_start: start,
    bedtime_end: end,
    protect_mealtimes: protectMealtimes === true,
    protect_school_hours: protectSchoolHours === true,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'child_id' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
