import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

  const { data: due } = await admin
    .from('digi_followups')
    .select('id, user_id, child_id, question, context, suggestion, situation')
    .eq('status', 'pending')
    .lte('due_on', today)
    .limit(200)

  if (!due || due.length === 0) {
    return NextResponse.json({ ok: true, delivered: 0, day: today })
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
    }).select('id').single()

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
    })
    if (cardError) continue

    await admin.from('digi_followups')
      .update({ status: 'delivered', delivered_at: new Date().toISOString() })
      .eq('id', f.id)
    delivered++
  }

  return NextResponse.json({ ok: true, delivered, found: due.length, day: today })
}

export const GET = withHeartbeat('followups', handler)
