import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// A child asks for their own quest: clean my room, wash the car, help
// with dinner. Same trust model as ticking, the link token is the auth.
// The ask lands as pending, the parent's phone gets a nudge, and one tap
// on the board turns it into a real quest with stars attached.

// Open asks waiting on a parent at any one moment.
const MAX_PENDING_ASKS = 5
// And asks made in a single day, whatever happened to them afterwards. Five is
// plenty for a real day and low enough that a board stays readable.
const MAX_ASKS_PER_DAY = 5

// Midnight tonight in London, as an ISO instant. The rest of the app reads
// dates in Europe/London rather than the server's zone, and a day boundary that
// disagreed with the one on the parent's screen would hand a child a fresh
// allowance in the middle of the evening.
function ukMidnightIso(): string {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now)
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? ''
  const ymd = `${get('year')}-${get('month')}-${get('day')}`
  // London is UTC or UTC+1, so the instant of local midnight is found by
  // measuring the offset in force right now rather than assuming either.
  const guess = new Date(`${ymd}T00:00:00Z`)
  const localAtGuess = new Date(guess.toLocaleString('en-US', { timeZone: 'Europe/London' }))
  const utcAtGuess = new Date(guess.toLocaleString('en-US', { timeZone: 'UTC' }))
  return new Date(guess.getTime() - (localAtGuess.getTime() - utcAtGuess.getTime())).toISOString()
}

export async function POST(req: NextRequest) {
  const { token, title, emoji } = await req.json()
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const cleanTitle = String(title ?? '').replace(/\s+/g, ' ').trim().slice(0, 60)
  if (cleanTitle.length < 3) {
    return NextResponse.json({ error: 'title too short' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // A handful of open asks at a time keeps it an ask, not a flood
  const { count } = await supabase
    .from('quest_requests')
    .select('id', { count: 'exact', head: true })
    .eq('child_id', link.child_id)
    .eq('status', 'pending')
  if ((count ?? 0) >= MAX_PENDING_ASKS) {
    return NextResponse.json({ error: 'too many pending' }, { status: 429 })
  }

  // And a ceiling on the day, which the pending cap alone never gave.
  //
  // Capping only what is OPEN means a keen child empties the queue the moment
  // a parent approves and immediately asks five more. That is how one test
  // child reached 43 quests and another 49: nothing was broken, the limit
  // simply reset every time a parent said yes.
  //
  // Counted from midnight UK, like every other date in the app, and counted
  // across every status, because an ask that was approved or turned down still
  // happened. The child is told plainly rather than silently ignored.
  const since = ukMidnightIso()
  const { count: today } = await supabase
    .from('quest_requests')
    .select('id', { count: 'exact', head: true })
    .eq('child_id', link.child_id)
    .gte('created_at', since)
  if ((today ?? 0) >= MAX_ASKS_PER_DAY) {
    return NextResponse.json(
      { error: 'enough for today', reason: 'daily_limit', max: MAX_ASKS_PER_DAY },
      { status: 429 },
    )
  }

  const { data: request, error } = await supabase.from('quest_requests').insert({
    user_id: link.user_id,
    child_id: link.child_id,
    title: cleanTitle,
    emoji: typeof emoji === 'string' && emoji ? emoji.slice(0, 8) : '⭐',
  }).select('id, title, emoji, status, created_at').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('kid_links').update({ last_seen_at: new Date().toISOString() }).eq('token', token)

  const { data: child } = await supabase
    .from('children').select('name').eq('id', link.child_id).maybeSingle()
  const name = child?.name ?? 'Your child'

  // Nudge the parent's phone, best effort
  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
    await fetch(`${origin}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
      body: JSON.stringify({
        userId: link.user_id,
        title: `${name} is asking for a quest ⭐`,
        body: `"${cleanTitle}" is their idea. One tap to make it a real quest with stars.`,
        url: '/dashboard/quests/manage',
      }),
    })
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, request })
}
