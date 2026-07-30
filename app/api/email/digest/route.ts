import { withHeartbeat } from '@/lib/ops/heartbeat'
import { pickSpotlight, renderSpotlight } from '@/lib/email/spotlights'
import { isSchoolHoliday } from '@/lib/learning/holidays'
import { NextRequest, NextResponse } from 'next/server'
import { emailConfigured, unsubscribeUrl } from '@/lib/email'
import { weeklyDigestEmail } from '@/lib/email/templates'
import { getWeekParentReport } from '@/lib/balance/week-report'
import { STAGES, getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import {
  adminClient, cronAuthorised, daysSince, deadline, deliverOnce, digestKey,
  loadSentKeys, type ProfileRow,
} from '@/lib/email/cron-kit'

// The weekly digest, on its own route and its own clock.
//
// It used to be the second to last block of one long daily handler, and it had
// stopped reaching anybody: last sent 13 July, with twelve parents eligible and
// weeks 30 and 31 sending nothing at all. Of the five it did reach in week 29,
// seven others never got it, because the run died partway down the loop and the
// Monday only gate meant next week carried a different key. They were skipped,
// not delayed.
//
// Runs DAILY now, not only on Mondays. The key is the ISO week, so Monday's run
// sends the week's digest to everyone and the rest of the week costs two
// queries and sends nothing. The only parents a later run finds are the ones a
// previous run could not reach, which is exactly the failure that was silent
// before.

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Stop with room to spare. The point is to finish properly and report what is
// left, rather than be killed mid loop with no record of how far it got.
const BUDGET_MS = 45_000

async function handler(req: NextRequest) {
  if (!cronAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!emailConfigured()) {
    return NextResponse.json({ skipped: true, reason: 'RESEND_API_KEY not set' })
  }

  const clock = deadline(BUDGET_MS)
  const supabase = adminClient()
  const now = new Date()
  const key = digestKey(now)

  const [sentKeys, { data: profiles }] = await Promise.all([
    loadSentKeys(supabase),
    supabase
      .from('profiles')
      .select('id, email, full_name, created_at, subscription_status, trial_ends_at, email_opt_out, onboarding_complete, school_id')
      .eq('onboarding_complete', true)
      .eq('email_opt_out', false),
  ])

  // Everyone still owed this week's digest, worked out up front so the reply
  // can say how many were left behind rather than leaving it to be guessed
  // from the absence of rows.
  const due = ((profiles ?? []) as ProfileRow[]).filter(p =>
    p.email && !sentKeys.has(`${p.id}:${key}`) && daysSince(p.created_at) >= 7,
  )

  let sent = 0, failed = 0, skipped = 0
  let remaining = due.length

  for (const profile of due) {
    // Checked between parents, never mid send. A stop here can only ever leave
    // work for tomorrow, never an email logged but not delivered.
    if (clock.out()) break
    remaining -= 1

    try {
      const [{ data: child }, { data: completions }, { data: shownRows }] = await Promise.all([
        supabase.from('children').select('id, name, age_band').eq('parent_id', profile.id).eq('is_primary', true).maybeSingle(),
        supabase.from('script_completions').select('completed_at').eq('user_id', profile.id),
        supabase.from('spotlight_shown').select('spotlight_key').eq('user_id', profile.id),
      ])
      const childName = child?.name && child.name !== 'Your child' ? child.name : 'your child'
      const stage = child?.age_band ? getStageFromAgeBand(child.age_band as AgeBand) : STAGES[2]
      const weekAgo = Date.now() - 7 * 86400000
      const total = (completions ?? []).length
      const thisWeek = (completions ?? []).filter(c => new Date(c.completed_at).getTime() >= weekAgo).length

      // The one balance signal worth reaching a parent who has not opened the
      // app: the young age phone flag. Deliberately the only screen time line in
      // the weekly digest (the monthly review carries the routine verdict), so a
      // parent is never marked on the clock every week. Fail soft, a balance
      // read that errors must never block the digest.
      let balanceNote: string | null = null
      if (child?.id) {
        const report = await getWeekParentReport(supabase, profile.id, { id: child.id, name: child.name, age_band: child.age_band }).catch(() => null)
        if (report?.topState.key === 'phone') {
          balanceNote = `One thing from ${childName}'s balance this week. Phone and social time showed up, and at this age we keep that near zero. It is the type of screen, not the total, so there is no need for alarm. A quick hands on swap sets it right.`
        }
      }

      // One service a week, newest first among the ones this parent has not had.
      // Null once they have seen them all, and a digest with no spotlight is a
      // perfectly good digest.
      const shown = new Set(((shownRows ?? []) as { spotlight_key: string }[]).map(r => r.spotlight_key))
      const chosen = pickSpotlight({
        childName,
        ageBand: (child?.age_band as AgeBand | null) ?? null,
        hasSchool: Boolean(profile.school_id),
        scriptsDoneTotal: total,
        inHolidays: isSchoolHoliday(now),
      }, shown)
      const spotlight = chosen ? renderSpotlight(chosen, childName) : null

      const result = await deliverOnce(supabase, profile.id, profile.email!, key, weeklyDigestEmail({
        childName, stageName: stage.name, scriptsDoneTotal: total, scriptsDoneThisWeek: thisWeek,
        unsubscribe: unsubscribeUrl(profile.id), balanceNote, spotlight,
      }))

      // Recorded only once the email actually went. A spotlight marked as shown
      // on a send that failed would be silently skipped forever, which is the
      // one way this feature could quietly lose a parent a service.
      if (chosen && result === 'sent') {
        await supabase.from('spotlight_shown')
          .insert({ user_id: profile.id, spotlight_key: chosen.key })
          .then(undefined, () => {}) // already shown, or unreadable. Never block the digest.
      }
      if (result === 'sent') sent += 1
      else if (result === 'failed') failed += 1
      else skipped += 1
    } catch {
      // One parent's bad data must never end the run for everyone behind them.
      // That is precisely how this whole route came to be silent. They are left
      // due, so tomorrow tries again.
      failed += 1
      remaining += 1
    }
  }

  return NextResponse.json({
    ok: true, key, due: due.length, sent, failed, skipped, remaining,
    spentMs: clock.spentMs(),
  })
}

export const GET = withHeartbeat('/api/email/digest', handler)
