import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPush } from '@/lib/push/send'
import { getRecommendedScript } from '@/lib/pathway/recommend'
import { hasFullAccess } from '@/lib/access'
import { prepareNudge } from '@/lib/scripts/nudge-server'
import { pushLine } from '@/lib/scripts/nudge'
import { withHeartbeat } from '@/lib/ops/heartbeat'
import type { StageId } from '@/lib/pathway/progress'
import type { ChallengeId } from '@/lib/content/stages'

// THE WORDS FOR THIS WEEK, Sunday evening (18 November 2026).
//
// One push to each parent who has push switched on: the line to say for the
// worry they raised, picked the way the scripts page picks "start with this
// one" (getRecommendedScript), so the push and the page agree. It counts
// toward the same cap as the timer words (two a week, never two in a day,
// lib/scripts/nudge.ts), so a parent whose timer already sent two this week
// hears nothing. Next time they open Scripts, a one tap "did it work" waits.
// Plan: plans/2026-11-18-scripts-system.md.

export const dynamic = 'force-dynamic'
export const maxDuration = 60

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorised' }, { status: 401 })
  }
  const admin = createAdminClient()
  const results = { sent: 0, skipped: 0, errors: 0 }

  // Parents with a push subscription: the only ones this can reach.
  const { data: subs } = await admin.from('push_subscriptions').select('user_id').limit(2000)
  const parentIds = [...new Set((subs ?? []).map(s => s.user_id as string))]
  if (parentIds.length === 0) return NextResponse.json(results)

  const [{ data: profiles }, { data: kids }] = await Promise.all([
    admin.from('profiles').select('id, subscription_status, trial_ends_at, onboarding_answers').in('id', parentIds),
    admin.from('children').select('id, parent_id, name, stage_id, is_primary').in('parent_id', parentIds),
  ])

  for (const p of profiles ?? []) {
    try {
      const mine = (kids ?? []).filter(k => k.parent_id === p.id)
      const child = mine.find(k => k.is_primary) ?? mine[0]
      if (!child?.stage_id) { results.skipped++; continue }
      const challenge = (p.onboarding_answers as Record<string, string> | null)?.challenge as ChallengeId | undefined
      const paid = hasFullAccess(p as Parameters<typeof hasFullAccess>[0])
      const rec = await getRecommendedScript(admin, p.id as string, child.stage_id as StageId, challenge ?? null, { preferFree: !paid, childId: child.id as string })
      const words = await prepareNudge(admin, p.id as string, { kind: 'weekly', childId: child.id as string, preferSortOrder: rec?.sort_order ?? null })
      if (!words) { results.skipped++; continue }
      await sendPush({
        userId: p.id as string,
        title: 'Your words for this week 💬',
        body: `"${pushLine(words.say, 120)}" Tap for what to say if they push back.`,
        url: `/dashboard/scripts/${words.sortOrder}?from=week`,
      })
      results.sent++
    } catch {
      results.errors++
    }
  }
  return NextResponse.json(results)
}

export const GET = withHeartbeat('/api/cron/script-week', handler)
