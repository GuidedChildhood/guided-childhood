import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildWeeklyReview } from '@/lib/digi/weekly-review'

// The dashboard side of the weekly review. GET returns the parent's latest
// review for the card. PATCH marks it read or dismissed. POST builds this
// week's review on demand for the logged in family, so it can be seen without
// waiting for Sunday's cron.

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ review: null })

  // Dismissing is about the card on Home, not about the round up itself.
  //
  // It used to be about both: the card's cross set the row to dismissed, this
  // read filtered dismissed out, and the round up page reads through the same
  // endpoint, so one tap on Home permanently hid the week from the page built
  // to show it. The page then offered to build a fresh one, which is how a
  // written round up came to look like a round up that had never existed.
  //
  // The page asks with any=1 and gets the latest week whatever its status. The
  // card asks without it, so a cross still puts the card away.
  const includeDismissed = req.nextUrl.searchParams.get('any') === '1'

  let q = supabase
    .from('digi_weekly_reviews')
    .select('id, week_start, stats, summary, watch_for, suggestion, suggestion_routine, status')
    .eq('user_id', user.id)
  if (!includeDismissed) q = q.neq('status', 'dismissed')

  const { data } = await q
    .order('week_start', { ascending: false })
    .limit(1)
    .maybeSingle()

  // The week's check in movement, computed live rather than stored: for each
  // concern scored this week, the newest score against the last one before
  // the week began. Scores climb as things improve (1 really tough, 10 going
  // great), so up is good on every line this feeds. Best effort: a read
  // error just means the round up shows no moves, never an error.
  const scoreMoves: { label: string; from: number | null; to: number }[] = []
  try {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
    const [{ data: concerns }, { data: events }] = await Promise.all([
      supabase.from('concerns').select('id, label').eq('user_id', user.id),
      supabase.from('concern_events')
        .select('concern_id, score, created_at')
        .eq('user_id', user.id)
        .not('score', 'is', null)
        .order('created_at', { ascending: true })
        .limit(400),
    ])
    const labelById = new Map((concerns ?? []).map(c => [c.id as string, c.label as string]))
    const byConcern = new Map<string, { score: number; created_at: string }[]>()
    for (const e of (events ?? []) as { concern_id: string; score: number; created_at: string }[]) {
      const list = byConcern.get(e.concern_id)
      if (list) list.push(e)
      else byConcern.set(e.concern_id, [e])
    }
    for (const [concernId, rows] of byConcern) {
      const thisWeek = rows.filter(r => r.created_at >= weekAgo)
      if (thisWeek.length === 0) continue
      const before = rows.filter(r => r.created_at < weekAgo)
      scoreMoves.push({
        label: labelById.get(concernId) ?? 'Something you raised',
        from: before.length ? before[before.length - 1].score : null,
        to: thisWeek[thisWeek.length - 1].score,
      })
    }
  } catch { /* the round up simply shows no moves */ }

  return NextResponse.json({ review: data ?? null, scoreMoves })
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
