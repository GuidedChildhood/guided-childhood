import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { readMoment } from '@/lib/digi/moment'

// GET: the parent's pending proactive prompts. When nothing is pending, DiGi
// reads the moment (lib/digi/moment.ts) and steps in only if there is
// something worth saying, under the cap. This runs on dashboard visits, so
// DiGi leads without needing the parent to ask, and stays quiet most days.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const pendingQuery = () => supabase
    .from('digi_prompts').select('id, kind, title, body, href, created_at, outcome_id')
    .eq('user_id', user.id).eq('status', 'pending').neq('kind', 'insight')
    .order('created_at', { ascending: false }).limit(3)

  const { data: pending } = await pendingQuery()
  const shown = await withoutWorryFollowUps(supabase, pending ?? [])
  if (shown.length > 0) return NextResponse.json({ prompts: shown })

  // ── THE MOMENT READER, NOT THE CALENDAR ────────────────────────────────────
  //
  // This used to run four hard rules and a drumbeat (a tip every three days,
  // a parent care nudge, a printable nudge on alternate days), then ask the
  // model to write a card per trigger. Since 13 September 2026 the question is
  // the other way round: DiGi reads what changed for this family and decides
  // whether anything is worth saying today, under a cap that is code. See
  // lib/digi/moment.ts. Most visits it stays quiet, and that is the product.
  try {
    await readMoment(supabase, user.id)
  } catch { /* a dashboard visit never fails on a step in */ }

  const { data: fresh } = await pendingQuery()
  return NextResponse.json({ prompts: await withoutWorryFollowUps(supabase, fresh ?? []) })
}

/**
 * Drop the follow up cards that belong to a worry.
 *
 * THE QUESTION MOVED (21 September 2026). A follow up attached to a worry is
 * now asked inside the check in, one line above that worry's stars, because
 * that is where parents actually answer it: 15 of 40 there against 0 of 6 on
 * a card. The cron stopped making these cards on the same day, and this
 * filter is for the ones already sitting in the queue, which on the live
 * account is every unanswered follow up there is.
 *
 * Read only and per request: no migration, nothing deleted, and a card whose
 * worry is later answered simply stops existing on both screens at once.
 * Advice with no worry attached still shows here, exactly as before.
 */
async function withoutWorryFollowUps(
  supabase: Awaited<ReturnType<typeof createClient>>,
  prompts: { kind?: string | null; outcome_id?: string | null }[],
) {
  const ids = prompts.filter(p => p.kind === 'follow_up' && p.outcome_id).map(p => p.outcome_id as string)
  if (ids.length === 0) return prompts
  try {
    const { data } = await supabase
      .from('digi_outcomes').select('id, concern_id').in('id', ids)
    const onAWorry = new Set(
      ((data ?? []) as { id: string; concern_id: string | null }[])
        .filter(o => o.concern_id).map(o => o.id),
    )
    return prompts.filter(p => !(p.outcome_id && onAWorry.has(p.outcome_id)))
  } catch {
    // Unreadable means show it. A question asked twice is a worse day than a
    // question asked once, but a promise silently dropped is worse than both.
    return prompts
  }
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  if (!id || !['seen', 'dismissed', 'acted'].includes(status)) {
    return NextResponse.json({ error: 'missing or invalid id / status' }, { status: 400 })
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase.from('digi_prompts').update({ status }).eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
