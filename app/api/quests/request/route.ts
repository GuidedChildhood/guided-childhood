import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPush } from '@/lib/push/send'

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
  const { token, title, emoji, swapQuestId } = await req.json()
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

  // A SWAP ask names the job it wants to trade away (migration 184). Read
  // back against this family and this child's own view rather than trusted,
  // because the id decides which job the parent's yes retires: a made up or
  // sibling's id must degrade to an ordinary pitch, never reach the board.
  let swapQuest: { id: string; title: string } | null = null
  if (typeof swapQuestId === 'string' && /^[0-9a-f-]{36}$/.test(swapQuestId)) {
    const { data: sq } = await supabase
      .from('family_quests')
      .select('id, title, child_id')
      .eq('id', swapQuestId)
      .eq('user_id', link.user_id)
      .eq('active', true)
      .maybeSingle()
    if (sq && (sq.child_id === null || sq.child_id === link.child_id)) {
      swapQuest = { id: sq.id as string, title: sq.title as string }
    }
  }

  const baseRow = {
    user_id: link.user_id,
    child_id: link.child_id,
    title: cleanTitle,
    emoji: typeof emoji === 'string' && emoji ? emoji.slice(0, 8) : '⭐',
  }
  // Guarded insert, the deploy before migration pattern: try with the swap
  // column, and if the database has not run 184 yet retry as a plain pitch,
  // which is a true ask either way rather than an error in the child's face.
  let request: { id: string; title: string; emoji: string; status: string; created_at: string } | null = null
  {
    const row: Record<string, unknown> = swapQuest ? { ...baseRow, swap_quest_id: swapQuest.id } : { ...baseRow }
    const first = await supabase.from('quest_requests')
      .insert(row)
      .select('id, title, emoji, status, created_at').single()
    if (first.error && swapQuest && /swap_quest_id|column|schema/i.test(first.error.message)) {
      swapQuest = null
      const retry = await supabase.from('quest_requests')
        .insert(baseRow).select('id, title, emoji, status, created_at').single()
      if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 500 })
      request = retry.data
    } else if (first.error) {
      return NextResponse.json({ error: first.error.message }, { status: 500 })
    } else {
      request = first.data
    }
  }

  await supabase.from('kid_links').update({ last_seen_at: new Date().toISOString() }).eq('token', token)

  const { data: child } = await supabase
    .from('children').select('name').eq('id', link.child_id).maybeSingle()
  const name = child?.name ?? 'Your child'

  // Nudge the parent's phone, best effort. A swap ask says both halves, so
  // the yes can be an informed one straight from the notification.
  try {
    await sendPush({
        userId: link.user_id,
        title: swapQuest ? `${name} asks to swap a job 🔁` : `${name} is asking for a quest ⭐`,
        body: swapQuest
          ? `Instead of "${swapQuest.title}" they would like "${cleanTitle}". One tap to decide.`
          : `"${cleanTitle}" is their idea. One tap to make it a real quest with stars.`,
        url: '/dashboard/quests/manage',
      })
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, request })
}
