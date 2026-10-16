import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPush } from '@/lib/push/send'
import { promisesFrom } from '@/lib/content/agreement-promises'
import {
  ANSWER_SHOWN_DAYS, MAX_DEAL_ASKS_PER_WEEK, MAX_OPEN_DEAL_ASKS, REASON_MAX, WISH_MAX,
  cleanLine, type DealChangeAsk,
} from '@/lib/deal/change-requests'

// The child asks to change a promise in the family deal (migration 381).
//
// Justin, 16 October 2026: yes to the child asking from their own app, with a
// reason, and the grown up deciding. Same trust model as every kid route: the
// link token is the auth and scopes everything to one family and one child.
//
// GET  ?token=   the child's latest ask, if it is open or was answered in the
//                last fortnight, so Our family deal can show where it stands.
// POST           { token, promise, wish, reason } makes the ask.
//
// The promise is checked against the deal as it is right now rather than
// trusted, so an ask can only ever be about a promise this family has. The
// grown up's phone gets one push, like a quest pitch does. Nothing is ever
// sent to the child, so the child's quiet hours never come into it.

const TOKEN = /^[0-9a-f]{18}$/
const SELECT = 'id, child_id, promise_title, wish, reason, status, parent_reply, decided_at, created_at'

async function linkFor(token: unknown) {
  if (typeof token !== 'string' || !TOKEN.test(token)) return null
  const admin = createAdminClient()
  const { data } = await admin.from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  return data ? { admin, userId: data.user_id as string, childId: data.child_id as string } : null
}

export async function GET(req: NextRequest) {
  const link = await linkFor(req.nextUrl.searchParams.get('token'))
  if (!link) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const { data, error } = await link.admin
    .from('deal_change_requests').select(SELECT)
    .eq('child_id', link.childId)
    .order('created_at', { ascending: false })
    .limit(1).maybeSingle()
  // Before 381 is applied the table is missing: the child simply sees the
  // button and no history, rather than an error.
  if (error) return NextResponse.json({ ask: null, ready: false })

  const ask = (data ?? null) as DealChangeAsk | null
  const fresh = ask && (
    ask.status === 'pending' ||
    Date.now() - new Date(ask.decided_at ?? ask.created_at).getTime() < ANSWER_SHOWN_DAYS * 86_400_000
  )
  return NextResponse.json({ ask: fresh ? ask : null, ready: true })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const link = await linkFor(body?.token)
  if (!link) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const promise = cleanLine(body?.promise, 120)
  const wish = cleanLine(body?.wish, WISH_MAX)
  const reason = cleanLine(body?.reason, REASON_MAX)
  if (wish.length < 3 || reason.length < 3) {
    return NextResponse.json({ error: 'too short', reason: 'too_short' }, { status: 400 })
  }

  // The promise must be one of this family's, as the deal stands now.
  const { data: agreement } = await link.admin
    .from('family_agreements')
    .select('agreement_type, clauses, family_values, bedroom_rule_time, bedroom_rule_location, social_media_terms, when_things_go_wrong, extra_agreements')
    .eq('user_id', link.userId).maybeSingle()
  const titles = promisesFrom(agreement as Parameters<typeof promisesFrom>[0]).map(p => p.title)
  if (!titles.includes(promise)) {
    return NextResponse.json({ error: 'unknown promise', reason: 'unknown_promise' }, { status: 400 })
  }

  // One open ask at a time, and three in any seven days. Counted across every
  // status for the week, because an ask that was answered still happened.
  const [{ count: open, error: openErr }, { count: week }] = await Promise.all([
    link.admin.from('deal_change_requests').select('id', { count: 'exact', head: true })
      .eq('child_id', link.childId).eq('status', 'pending'),
    link.admin.from('deal_change_requests').select('id', { count: 'exact', head: true })
      .eq('child_id', link.childId).gte('created_at', new Date(Date.now() - 7 * 86_400_000).toISOString()),
  ])
  if (openErr) return NextResponse.json({ error: 'not ready', reason: 'not_ready' }, { status: 503 })
  if ((open ?? 0) >= MAX_OPEN_DEAL_ASKS) {
    return NextResponse.json({ error: 'one at a time', reason: 'open_ask' }, { status: 429 })
  }
  if ((week ?? 0) >= MAX_DEAL_ASKS_PER_WEEK) {
    return NextResponse.json({ error: 'enough this week', reason: 'weekly_limit' }, { status: 429 })
  }

  const { data: ask, error } = await link.admin.from('deal_change_requests')
    .insert({ user_id: link.userId, child_id: link.childId, promise_title: promise, wish, reason })
    .select(SELECT).single()
  if (error) return NextResponse.json({ error: 'did not save' }, { status: 500 })

  const { data: child } = await link.admin.from('children').select('name').eq('id', link.childId).maybeSingle()
  const name = (child?.name as string | undefined) ?? 'Your child'
  try {
    await sendPush({
      userId: link.userId,
      title: `${name} has asked to change the deal`,
      body: `About "${promise}". They would like: ${wish}`,
      url: '/dashboard/quests#deal-asks',
    })
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, ask })
}
