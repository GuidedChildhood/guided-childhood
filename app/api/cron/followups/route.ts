import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { planDeliveries, staleBefore, issueLabelFrom, followUpOpener, CARD_STALE_DAYS, CHECKIN_INVITE_DAYS } from '@/lib/digi/followup-queue'
import { raiseConcern, toSlug } from '@/lib/concerns/raise'

// DiGi keeps its promise.
//
// A follow up DiGi scheduled during a conversation becomes a prompt card on the
// morning it falls due. It joins digi_prompts, which is the proactive queue the
// dashboard already renders and the push cron already sends, so it inherits the
// quiet hours, the dismiss button and the mute settings that queue already
// respects. Building a second channel would have meant two places to be
// interrupted from and two ways to get that wrong.
//
// 07:15, after the age up sweep and before the daily insight agent. Morning
// rather than evening because a question about how something went is easier to
// answer at the start of a day than at the end of one.
//
// OVERDUE ONES GO OUT TOO (lte, not eq). If a run is missed, the promise is
// still a promise. Better a day late than silently dropped, which is the failure
// a parent would actually notice.

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/** Today in Europe/London, because the due date was written in their days. */
function londonToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date())
}

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const today = londonToday()

  // ── CARDS EXPIRE, FIRST (7 October 2026) ──────────────────────────────────
  //
  // An unanswered "How did that go?" older than a fortnight is dismissed, and
  // a check in invite older than a week with it. Justin's own page carried
  // three of the former, the oldest from August. The outcome row underneath
  // keeps its null verdict: we do not know how it went, and that is the
  // record. See lib/digi/followup-queue.ts for the rules in one place.
  const now = new Date()
  // ── BUT THE ISSUE IS NOT LOST ─────────────────────────────────────────────
  //
  // Justin: "we don't want to miss those issues if dropped off after 2
  // weeks." A stale card whose thread was never attached to a worry becomes
  // one before the card goes: named from the parent's own trigger words or
  // the topic, raised through the one raiser every surface uses, and linked
  // back to the outcome so DiGi's strand knows the two are the same thing.
  // From then on the daily check in asks about it, which is where parents
  // answer. A thread with nothing honest to name stays an unanswered outcome.
  const { data: stale } = await admin.from('digi_prompts').select('id, user_id, child_id, outcome_id')
    .eq('kind', 'follow_up').in('status', ['pending', 'seen']).lt('created_at', staleBefore(now, CARD_STALE_DAYS)).limit(200)
  const staleRows = (stale ?? []) as { id: string; user_id: string; child_id: string | null; outcome_id: string | null }[]
  const outcomeIds = staleRows.map(r => r.outcome_id).filter((id): id is string => !!id)
  type StaleOutcome = { id: string; concern_id: string | null; topic: string | null; trigger: string | null }
  const { data: outcomes } = outcomeIds.length
    ? await admin.from('digi_outcomes').select('id, concern_id, topic, trigger').in('id', outcomeIds)
    : { data: [] as StaleOutcome[] }
  const outcomeById = new Map(((outcomes ?? []) as StaleOutcome[]).map(o => [o.id, o]))
  let raised = 0
  for (const card of staleRows) {
    const o = card.outcome_id ? outcomeById.get(card.outcome_id) : null
    if (!o || o.concern_id) continue
    const label = issueLabelFrom({ trigger: o.trigger, topic: o.topic })
    if (!label) continue
    const slug = await raiseConcern(admin, card.user_id, card.child_id, { slug: toSlug(label), label, source: 'digi' })
    if (!slug) continue
    raised++
    let q = admin.from('concerns').select('id').eq('user_id', card.user_id).eq('slug', slug)
    q = card.child_id ? q.eq('child_id', card.child_id) : q.is('child_id', null)
    const { data: row } = await q.maybeSingle()
    if (row?.id) await admin.from('digi_outcomes').update({ concern_id: row.id }).eq('id', o.id)
  }
  await admin.from('digi_prompts').update({ status: 'dismissed' })
    .eq('kind', 'follow_up').in('status', ['pending', 'seen']).lt('created_at', staleBefore(now, CARD_STALE_DAYS))
  await admin.from('digi_prompts').update({ status: 'dismissed' })
    .like('source', 'checkin:%').in('status', ['pending', 'seen']).lt('created_at', staleBefore(now, CHECKIN_INVITE_DAYS))

  const { data: dueRows } = await admin
    .from('digi_followups')
    .select('id, user_id, child_id, due_on, question, context, suggestion, situation, moment_id, concern_id, approach, band_at_suggestion')
    .eq('status', 'pending')
    .lte('due_on', today)
    .limit(200)
  if (!dueRows || dueRows.length === 0) {
    return NextResponse.json({ ok: true, delivered: 0, day: today })
  }

  // ── ONE CARD PER CHILD ────────────────────────────────────────────────────
  //
  // A due follow up whose child already has an unanswered card waits, and a
  // follow up that has waited too long is let go. The rule is pure and the
  // guard runs it; this is only the reading of who already has a card.
  const userIds = [...new Set(dueRows.map(f => f.user_id as string))]
  const { data: openCards } = await admin
    .from('digi_prompts').select('user_id, child_id')
    .eq('kind', 'follow_up').in('status', ['pending', 'seen']).in('user_id', userIds)
  const keyOf = (userId: string, childId: string | null) => `${userId}:${childId ?? 'family'}`
  const pendingKeys = new Set(((openCards ?? []) as { user_id: string; child_id: string | null }[]).map(c => keyOf(c.user_id, c.child_id)))
  const plan = planDeliveries(
    dueRows.map(f => ({ id: f.id as string, key: keyOf(f.user_id as string, (f.child_id as string | null) ?? null), onWorry: !!f.concern_id, dueOn: String(f.due_on) })),
    pendingKeys,
    today,
  )
  if (plan.cancel.length > 0) {
    await admin.from('digi_followups').update({ status: 'cancelled' }).in('id', plan.cancel)
  }
  const deliverIds = new Set(plan.deliver)
  const due = dueRows.filter(f => deliverIds.has(f.id as string))
  if (due.length === 0) {
    return NextResponse.json({ ok: true, delivered: 0, held: plan.hold.length, cancelled: plan.cancel.length, day: today })
  }

  // Age bands, read once. Copied onto the outcome rather than joined later, so
  // "this worked for an eight year old" stays true after the child turns nine.
  const childIds = [...new Set(due.map(f => f.child_id).filter((id): id is string => !!id))]
  const ageByChild = new Map<string, string | null>()
  if (childIds.length > 0) {
    const { data: kids } = await admin.from('children').select('id, age_band').in('id', childIds)
    for (const k of (kids ?? []) as { id: string; age_band: string | null }[]) ageByChild.set(k.id, k.age_band)
  }

  let delivered = 0
  for (const f of due) {
    // The ledger row is created HERE rather than when the follow up was
    // scheduled, because a cancelled follow up is not a suggestion that was
    // tried and never rated, it is a suggestion nobody was ever asked about.
    // Only a delivered card earns a row waiting for a verdict.
    const situation = (f.situation ?? {}) as { topic?: string; time_band?: string; trigger?: string }
    const { data: outcome } = await admin.from('digi_outcomes').insert({
      user_id: f.user_id,
      child_id: f.child_id,
      followup_id: f.id,
      age_band: f.child_id ? ageByChild.get(f.child_id) ?? null : null,
      topic: situation.topic ?? null,
      time_band: situation.time_band ?? null,
      trigger: situation.trigger ?? null,
      suggestion: f.suggestion ?? f.question,
      // Carried through, so a verdict can be counted back to the moment it was
      // about. Null for an ordinary DiGi suggestion.
      moment_id: f.moment_id ?? null,
      // ── THE STRAND (18 September 2026, migration 307) ────────────────────
      //
      // concern_id has existed on both tables since 154 and this insert has
      // never written it: read live before the fix, 6 outcome rows, 0 with a
      // worry attached. So the per worry record of what has been tried was a
      // column of nulls, and the moment_id line directly above is the tell,
      // since the two were added in the same migration for the same reason.
      //
      // approach and band_at_suggestion ride along because both are facts
      // about the day the suggestion was made, not the day the card goes out.
      // Recomputing them here would record the wrong band whenever a family
      // rated the worry in between, which is most of the time.
      concern_id: f.concern_id ?? null,
      approach: f.approach ?? null,
      band_at_suggestion: f.band_at_suggestion ?? null,
    }).select('id').single()

    // ── A WORRY'S QUESTION IS THE CHECK IN'S JOB NOW (21 September 2026) ──
    //
    // Measured on this product: the same three taps asked inside the check in
    // were answered 15 times out of 40, and asked on a card days later 0 times
    // out of 6. So a follow up ATTACHED TO A WORRY no longer becomes a card.
    // The check in reads the waiting outcome straight off digi_outcomes and
    // asks it one line above that worry's stars, where the parent is already
    // thinking about it (lib/checkin/today.ts).
    //
    // Nothing is lost by not making the card. The outcome row is the record,
    // it is made above either way, and the daily check in already has its own
    // reminder, so this removes a second interruption rather than a nudge.
    //
    // Advice NOT tied to a worry still becomes a card, because there is no
    // worry for it to ride in on.
    if (f.concern_id) {
      await admin.from('digi_followups')
        .update({ status: 'delivered', delivered_at: new Date().toISOString() })
        .eq('id', f.id)
      delivered++
      continue
    }

    // One at a time, and the status only moves after the card is safely in.
    // The other order loses the promise entirely if the insert fails, which is
    // the one outcome worth writing a loop to avoid.
    const { error: cardError } = await admin.from('digi_prompts').insert({
      user_id: f.user_id,
      child_id: f.child_id,
      kind: 'follow_up',
      title: 'How did that go?',
      body: f.question,
      // The reason field is what the dashboard shows underneath, so the card
      // carries the thread rather than arriving as a question with no history.
      reason: f.context ?? 'A follow up DiGi promised during a conversation.',
      // Null when the ledger insert failed. The card still goes out: a kept
      // promise with nothing learned from it beats a dropped promise.
      outcome_id: outcome?.id ?? null,
      // The thread itself, so tapping the card opens DiGi on what it was
      // about rather than on the words "How did that go?".
      href: `/dashboard/digi?${f.child_id ? `child=${f.child_id}&` : ''}q=${encodeURIComponent(followUpOpener(f.question))}`,
    })
    if (cardError) continue

    await admin.from('digi_followups')
      .update({ status: 'delivered', delivered_at: new Date().toISOString() })
      .eq('id', f.id)
    delivered++
  }

  return NextResponse.json({ ok: true, delivered, found: dueRows.length, held: plan.hold.length, cancelled: plan.cancel.length, raised, day: today })
}

export const GET = withHeartbeat('/api/cron/followups', handler)
