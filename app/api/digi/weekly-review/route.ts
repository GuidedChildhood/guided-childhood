import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildWeeklyReview } from '@/lib/digi/weekly-review'

// The dashboard side of the weekly review. GET returns the parent's latest
// review for the card. PATCH marks it read or dismissed. POST builds this
// week's review on demand for the logged in family, so it can be seen without
// waiting for Sunday's cron.

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ review: null })

  const { data } = await supabase
    .from('digi_weekly_reviews')
    .select('id, week_start, stats, summary, watch_for, suggestion, suggestion_routine, status')
    .eq('user_id', user.id)
    .neq('status', 'dismissed')
    .order('week_start', { ascending: false })
    .limit(1)
    .maybeSingle()
  return NextResponse.json({ review: data ?? null })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id, status } = await req.json().catch(() => ({}))
  if (!id || !['read', 'dismissed'].includes(status)) {
    return NextResponse.json({ error: 'id and status required' }, { status: 400 })
  }
  const { error } = await supabase
    .from('digi_weekly_reviews').update({ status }).eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  try {
    const review = await buildWeeklyReview(user.id)
    return NextResponse.json({ ok: true, review })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'could not build' }, { status: 500 })
  }
}
