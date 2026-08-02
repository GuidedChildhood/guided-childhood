import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { embeddingsConfigured } from '@/lib/digi/embeddings'
import { embedMissingKnowledge } from '@/lib/digi/knowledge-embed'
import { NextResponse } from 'next/server'

// Is DiGi's machinery actually running, and can it be seen without a terminal.
//
// Justin: "show me how to check the embedding api, and that DiGi running checks
// are added to the insight dashboard we have."
//
// The second half is the important one. Semantic retrieval fails SILENTLY: with
// no EMBEDDING_API_KEY, or an unembedded bank, everything falls back to keyword
// matching and the product looks exactly the same from the outside. The only way
// to know was to run SQL by hand, which means in practice nobody would, and the
// upgrade Justin paid for could sit switched off for months without a single
// symptom.
//
// So the check lives on the board he already reads, next to the review it
// belongs with. Anything that can be off without looking broken has to be
// visible somewhere a person actually goes.
//
// Founder gated, same rule as the page.

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

/** The scheduled jobs that make up DiGi's own upkeep, in the order they matter. */
const DIGI_JOBS: { job: string; label: string; everyHours: number }[] = [
  { job: '/api/cron/knowledge-embed', label: 'Research bank embedding', everyHours: 24 },
  { job: '/api/cron/followups', label: 'Follow ups delivered', everyHours: 24 },
  { job: '/api/cron/digi-insights', label: 'Daily insight agent', everyHours: 24 },
  { job: '/api/cron/digi-wisdom', label: 'Shared wisdom rebuild', everyHours: 24 * 7 },
  { job: '/api/cron/digi-quality', label: 'Weekly evals', everyHours: 24 * 7 },
  { job: '/api/cron/management-review', label: 'Monday management review', everyHours: 24 * 7 },
  { job: '/api/cron/answer-review', label: 'Monthly answer review', everyHours: 24 * 31 },
]

async function requireFounder() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) return null
  return user
}

export async function GET() {
  if (!await requireFounder()) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  }
  const admin = createAdminClient()

  // Counted rather than estimated. "Roughly all of them" is how a half embedded
  // bank passes for a whole one.
  const [total, embedded, memTotal, memEmbedded, review, pending, flags, runs] = await Promise.all([
    admin.from('expert_knowledge').select('id', { count: 'exact', head: true }).eq('active', true),
    admin.from('expert_knowledge').select('id', { count: 'exact', head: true }).eq('active', true).not('embedding', 'is', null),
    admin.from('digi_memory').select('id', { count: 'exact', head: true }).eq('active', true),
    admin.from('digi_memory').select('id', { count: 'exact', head: true }).eq('active', true).not('embedding', 'is', null),
    admin.from('digi_answer_reviews').select('period, summary, suggestions, metrics, model').order('period', { ascending: false }).limit(1).maybeSingle(),
    admin.from('digi_followups').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    admin.from('digi_safety_flags').select('severity').eq('source', 'live').gte('created_at', new Date(Date.now() - 30 * 86_400_000).toISOString()),
    // Filtered to OUR seven jobs, not the last N rows of everything.
    //
    // The first version read the most recent 400 rows across all jobs and took
    // the first hit per name. device-time runs every minute, so 400 rows is
    // under seven hours of that one job alone, and every DiGi job fell outside
    // the window and reported "never". A monitoring board that says a healthy
    // daily job has never run is worse than no board, because the first person
    // to check it learns not to believe it.
    admin.from('cron_runs').select('job, started_at, ok')
      .in('job', DIGI_JOBS.map(j => j.job))
      .order('started_at', { ascending: false })
      .limit(200),
  ])

  // Last run per job, from one query rather than seven.
  const lastRun = new Map<string, { started_at: string; ok: boolean | null }>()
  for (const r of (runs.data ?? []) as { job: string; started_at: string; ok: boolean | null }[]) {
    if (!lastRun.has(r.job)) lastRun.set(r.job, { started_at: r.started_at, ok: r.ok })
  }

  const severities = (flags.data ?? []).map(f => String(f.severity))

  return NextResponse.json({
    knowledge: {
      configured: embeddingsConfigured(),
      total: total.count ?? 0,
      embedded: embedded.count ?? 0,
    },
    memory: { total: memTotal.count ?? 0, embedded: memEmbedded.count ?? 0 },
    answerReview: review.data ?? null,
    followupsPending: pending.count ?? 0,
    safety30d: {
      total: severities.length,
      serious: severities.filter(s => s !== 'low').length,
    },
    jobs: DIGI_JOBS.map(j => {
      const last = lastRun.get(j.job) ?? null
      const hoursAgo = last ? (Date.now() - new Date(last.started_at).getTime()) / 3_600_000 : null
      return {
        label: j.label,
        lastRun: last?.started_at ?? null,
        ok: last?.ok ?? null,
        // Overdue at twice the interval, not at one. A job that runs daily and
        // last ran 25 hours ago is fine; flagging that would make this board
        // cry wolf and get ignored, which is worse than not having it.
        overdue: hoursAgo === null || hoursAgo > j.everyHours * 2,
      }
    }),
  })
}

/** Embed whatever in the research bank has no vector yet. */
export async function POST() {
  if (!await requireFounder()) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  }
  const result = await embedMissingKnowledge()
  return NextResponse.json(result)
}
