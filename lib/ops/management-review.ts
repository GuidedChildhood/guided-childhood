import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { starWeekStart, previousStarWeekStart } from '@/lib/quests/star-week'

// The Monday management review.
//
// Justin: "so that we are saving data gathering on my management board and
// weekly meetings where an agent reviews it for findings."
//
// The daily insight agent already reads the QUESTIONS parents asked. This reads
// the OUTCOMES: what families marked resolved, which scripts they said worked,
// what the wisdom engine has accumulated evidence for, and which topics keep
// coming back. A product whose whole claim is that it learns from what works
// had no report on what worked.
//
// Two rules this is built under, and they matter more than the output:
//
//   NOTHING PER FAMILY LEAVES. Every number here is a count or a de-identified
//   label. No parent's words, no child's name, no user id reaches the model.
//   Justin does not need to read one family's week to decide what to build, and
//   a founder dashboard that quietly becomes a surveillance tool is exactly the
//   thing this product tells parents it is not.
//
//   THE COUNTS ARE KEPT ALONGSIDE THE WORDS. A finding you cannot check later
//   is an opinion with a date on it. metrics goes in the row next to the prose.

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
  timeout: 60_000,
  maxRetries: 1,
})

export type ManagementFinding = {
  /** What the agent saw, in one sentence, tied to a number. */
  observation: string
  /** What it suggests doing about it. */
  suggestion: string
  /** growth, product, content, risk. Lets the board group them. */
  area: string
}

export type ManagementReview = {
  weekStart: string
  summary: string
  findings: ManagementFinding[]
  metrics: Record<string, unknown>
  model: string | null
}

/** Counts only, gathered across every family, nothing identifying. */
export async function gatherWeekMetrics(weekStart: string, weekEnd: string) {
  const admin = createAdminClient()
  const sinceIso = `${weekStart}T00:00:00Z`
  const untilIso = `${weekEnd}T00:00:00Z`

  const [
    resolved, worked, didNotWork, questions, feedback,
    wisdom, concernsOpen, newFamilies, ticks, credits, days,
  ] = await Promise.all([
    admin.from('concerns').select('label, status').in('status', ['resolved', 'improving']),
    admin.from('script_completions').select('id', { count: 'exact', head: true }).eq('worked', 'yes').gte('completed_at', sinceIso).lt('completed_at', untilIso),
    admin.from('script_completions').select('id', { count: 'exact', head: true }).eq('worked', 'no').gte('completed_at', sinceIso).lt('completed_at', untilIso),
    admin.from('digi_questions').select('id', { count: 'exact', head: true }).gte('created_at', sinceIso).lt('created_at', untilIso),
    admin.from('digi_feedback').select('id', { count: 'exact', head: true }).not('parent_response', 'is', null).gte('feedback_date', weekStart).lt('feedback_date', weekEnd),
    admin.from('digi_wisdom').select('topic, evidence_count').eq('active', true).order('evidence_count', { ascending: false }).limit(12),
    admin.from('concerns').select('label').eq('status', 'open'),
    admin.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', sinceIso).lt('created_at', untilIso),
    admin.from('quest_ticks').select('id', { count: 'exact', head: true }).eq('status', 'approved').gte('tick_date', weekStart).lt('tick_date', weekEnd),
    admin.from('sticker_credits').select('credits').eq('week_start', weekStart),
    admin.from('kid_days').select('id', { count: 'exact', head: true }).not('completed_at', 'is', null).gte('day', weekStart).lt('day', weekEnd),
  ])

  // Which worries come up most, by label only. A label is a category we chose
  // ("bedtime battles"), never anything a parent typed.
  const tally = (rows: { label?: unknown }[] | null) => {
    const m = new Map<string, number>()
    for (const r of rows ?? []) {
      const l = String(r.label ?? '').trim()
      if (l) m.set(l, (m.get(l) ?? 0) + 1)
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([label, count]) => ({ label, count }))
  }

  const workedN = worked.count ?? 0
  const failedN = didNotWork.count ?? 0

  return {
    week_start: weekStart,
    new_families: newFamilies.count ?? 0,
    questions_asked: questions.count ?? 0,
    reflections_answered: feedback.count ?? 0,
    scripts_worked: workedN,
    scripts_did_not_work: failedN,
    // The honest ratio, null rather than a fake 100% when nobody reported.
    script_success_rate: workedN + failedN > 0 ? Math.round((workedN / (workedN + failedN)) * 100) : null,
    jobs_approved: ticks.count ?? 0,
    days_all_five_done: days.count ?? 0,
    sticker_credits_awarded: (credits.data ?? []).reduce((s, r) => s + (Number(r.credits) || 0), 0),
    concerns_turned_around: tally(resolved.data as { label?: unknown }[] | null),
    concerns_still_open: tally(concernsOpen.data as { label?: unknown }[] | null),
    proven_patterns: (wisdom.data ?? []).map(w => ({ topic: w.topic, families: w.evidence_count })),
  }
}

const PROMPT = `You are reviewing one week of a UK digital parenting platform, Guided Childhood, for its founder.

Everything below is aggregate and de-identified. There is no parent or child in it and you must not ask for any.

Write a short, honest read of the week and up to five findings. Rules:
- Tie every observation to a number that is actually below. Never invent one.
- Say when a number is too small to mean anything. A week with four data points is a week with four data points, and saying so is worth more than a confident trend.
- Prefer the uncomfortable finding over the flattering one. This is for deciding what to build, not for reassurance.
- If nothing meaningful happened, say that plainly in the summary and return few or no findings.
- area must be one of: growth, product, content, risk.
- British English, plain, no jargon, no dashes of any kind.

Return ONLY compact JSON:
{"summary":"three or four sentences","findings":[{"observation":"what the data shows, with the number","suggestion":"what to do about it","area":"product"}]}`

export async function runManagementReview(weekStart?: string): Promise<ManagementReview> {
  const start = weekStart ?? previousStarWeekStart()
  // The week runs to the following Monday, which is the current week's start
  // when we are reviewing the week just gone.
  const end = start === previousStarWeekStart() ? starWeekStart() : addWeek(start)
  const metrics = await gatherWeekMetrics(start, end)

  const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  for (const model of models) {
    try {
      const msg = await anthropic.messages.create({
        model, max_tokens: 1600,
        messages: [{ role: 'user', content: `${PROMPT}\n\nTHE WEEK (${start} to ${end}):\n${JSON.stringify(metrics, null, 2)}` }],
      })
      const text = msg.content.filter(b => b.type === 'text').map(b => (b as { text: string }).text).join('')
      const match = text.match(/\{[\s\S]*\}/)
      if (!match) continue
      const parsed = JSON.parse(match[0]) as { summary?: string; findings?: ManagementFinding[] }
      return {
        weekStart: start,
        summary: String(parsed.summary ?? '').trim() || 'No written summary came back for this week.',
        findings: Array.isArray(parsed.findings) ? parsed.findings.slice(0, 5) : [],
        metrics,
        model,
      }
    } catch { /* try the next model */ }
  }

  // Every model failed. The metrics are still worth keeping: the numbers are the
  // durable part and the prose is the commentary, so a week is never lost just
  // because the agent could not be reached.
  return {
    weekStart: start,
    summary: 'The review agent could not be reached this week. The numbers below were still gathered and are correct.',
    findings: [],
    metrics,
    model: null,
  }
}

export async function persistManagementReview(r: ManagementReview): Promise<void> {
  const admin = createAdminClient()
  // Upsert on the week, so a re-run corrects rather than duplicates.
  await admin.from('management_findings').upsert({
    week_start: r.weekStart,
    summary: r.summary,
    findings: r.findings,
    metrics: r.metrics,
    model: r.model,
  }, { onConflict: 'week_start' })
}

function addWeek(ymd: string): string {
  const noon = new Date(`${ymd}T12:00:00Z`)
  noon.setUTCDate(noon.getUTCDate() + 7)
  return noon.toISOString().slice(0, 10)
}
