import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { firstText } from '@/lib/digi/text'
import { runEvals } from '@/lib/digi/evals'

// The monthly review of how DiGi ANSWERS.
//
// Justin: "build 1 to 5." This is number five, and it is the odd one out.
//
// Every other loop in this product improves what DiGi KNOWS. Wisdom turns
// resolved concerns into patterns. The research updater adds findings. The
// management review tells Justin what worked. None of them touch the thing that
// decides the shape, the tone and the judgement of every single reply, which is
// the prompt, and the prompt only ever changes when a human notices something.
//
// So once a month an agent reads DiGi's own worst work and says what it would
// change. It proposes. It never applies.
//
// THAT LINE IS THE WHOLE DESIGN. A system that rewrites its own instructions is
// one where nobody can say what it was told to do last Tuesday, and for a product
// that answers questions about children that is not a trade worth making for any
// amount of convenience. Suggestions land in a table, Justin reads them, and a
// prompt change is still a commit with his name on it. The same gate the research
// bank has, for the same reason.
//
// THE INPUTS, and why these three:
//   Eval scores are the only quality measure comparable over time, because the
//   cases never change. Safety flags are the failures that matter most. Parent
//   reflections are the only signal from the person actually being helped.
//   Together: did it break a rule, did it do the job, did it land.

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
  timeout: 120_000,
  maxRetries: 1,
})

export interface AnswerSuggestion {
  /** What the agent saw, tied to a case id, a flag or a count. */
  observation: string
  /** What it would change. */
  change: string
  /** Where: prompt, knowledge, evals, product. */
  target: string
}

export interface AnswerReview {
  period: string
  summary: string
  suggestions: AnswerSuggestion[]
  metrics: Record<string, unknown>
  model: string | null
}

const PROMPT = `You are reviewing the quality of DiGi's answers over the last month. DiGi is the AI guide inside Guided Childhood, a UK digital parenting platform whose philosophy is a calibrated pathway from 4 to 16: educate, never ban, never allow or deny, structure and relationship over blanket limits.

You are reviewing HOW IT ANSWERS, not what it knows. Its research bank is improved elsewhere.

Below you have its eval scores (a fixed set of adversarial cases, so the numbers are comparable month to month), the replies its safety verifier flagged, and what parents wrote back when asked how something went.

Rules:
- Tie every observation to a case id, a flag or a number that is actually below. Never invent one.
- Say when the sample is too small to conclude anything. A month with four data points is a month with four data points.
- Prefer the uncomfortable finding. This exists to make the product better, not to reassure anyone.
- A suggestion must be specific enough to act on. "Be warmer" is useless. "Case crisis-selfharm scored 0.6 because the reply named the helpline only at the end; move the signpost to the first sentence" is a suggestion.
- If the month was fine, say so and return few or no suggestions. Inventing five would teach the reader to stop reading these.
- target must be one of: prompt, knowledge, evals, product.
- British English, plain, no jargon, no dashes of any kind.

Return ONLY compact JSON:
{"summary":"three or four sentences","suggestions":[{"observation":"what the data shows","change":"what to change, specifically","target":"prompt"}]}`

/** The first day of the month just gone, in Europe/London. */
export function previousMonthStart(): string {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit' })
    .format(now).split('-')
  const year = Number(parts[0])
  const month = Number(parts[1])
  // Month is 1 based here; going back one lands on the previous month, and
  // January rolls to December of the year before.
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year
  return `${prevYear}-${String(prevMonth).padStart(2, '0')}-01`
}

function monthEnd(start: string): string {
  const [y, m] = start.split('-').map(Number)
  const nextMonth = m === 12 ? 1 : m + 1
  const nextYear = m === 12 ? y + 1 : y
  return `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`
}

export async function runAnswerReview(period?: string): Promise<AnswerReview> {
  const start = period ?? previousMonthStart()
  const end = monthEnd(start)
  const admin = createAdminClient()

  // The evals run live rather than being read from a log, because there is no
  // log: only breaches are stored. Running them here also means the review is
  // always scoring the prompt as it stands TODAY, which is the thing anyone
  // would be changing on the strength of it.
  let evalRun: Awaited<ReturnType<typeof runEvals>> | null = null
  try { evalRun = await runEvals() } catch { /* the review is still worth having without it */ }

  const [flags, reflections] = await Promise.all([
    admin.from('digi_safety_flags')
      .select('question, reply, violations, severity, source')
      .gte('created_at', `${start}T00:00:00Z`).lt('created_at', `${end}T00:00:00Z`)
      .neq('severity', 'low').limit(40),
    admin.from('digi_feedback')
      .select('question, parent_response')
      .not('parent_response', 'is', null)
      .gte('feedback_date', start).lt('feedback_date', end).limit(60),
  ])

  const weakest = (evalRun?.results ?? [])
    .slice().sort((a, b) => a.score - b.score).slice(0, 6)
    .map(r => ({ id: r.id, category: r.category, score: Number(r.score.toFixed(2)), notes: r.rubricNotes, missed: r.violations.map(v => v.code) }))

  const metrics = {
    period: start,
    eval_average: evalRun ? Number(evalRun.averageScore.toFixed(3)) : null,
    eval_cases: evalRun?.cases ?? 0,
    eval_safety_breaches: evalRun?.safetyBreaches ?? 0,
    weakest_cases: weakest,
    safety_flags_live: (flags.data ?? []).filter(f => f.source === 'live').length,
    reflections_answered: (reflections.data ?? []).length,
  }

  // Parent words are the one place raw content is involved, so they are clipped
  // hard and arrive with no id, no name and no ordering that could reconstruct a
  // family's month.
  const parentVoice = (reflections.data ?? [])
    .map(r => `- asked "${String(r.question).slice(0, 120)}" and the parent said "${String(r.parent_response).slice(0, 200)}"`)
    .slice(0, 30)

  const flagLines = (flags.data ?? []).slice(0, 20).map(f => {
    const codes = Array.isArray(f.violations) ? (f.violations as { code?: string }[]).map(v => v.code).join(', ') : ''
    return `- [${f.severity}, ${f.source}] ${codes} on a reply to "${String(f.question ?? '').slice(0, 120)}"`
  })

  const body = [
    `THE MONTH (${start} to ${end}):`,
    JSON.stringify(metrics, null, 2),
    flagLines.length ? `\nSAFETY FLAGS:\n${flagLines.join('\n')}` : '\nSAFETY FLAGS: none above low severity.',
    parentVoice.length ? `\nWHAT PARENTS WROTE BACK:\n${parentVoice.join('\n')}` : '\nWHAT PARENTS WROTE BACK: nothing this month.',
  ].join('\n')

  const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  for (const model of models) {
    try {
      const msg = await anthropic.messages.create({
        model, max_tokens: 2000,
        messages: [{ role: 'user', content: `${PROMPT}\n\n${body}` }],
      })
      const match = firstText(msg).match(/\{[\s\S]*\}/)
      if (!match) continue
      const parsed = JSON.parse(match[0]) as { summary?: string; suggestions?: AnswerSuggestion[] }
      return {
        period: start,
        summary: String(parsed.summary ?? '').trim() || 'No written summary came back for this month.',
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 6) : [],
        metrics,
        model,
      }
    } catch { /* try the next model */ }
  }

  // Same principle as the management review: the numbers are the durable part
  // and the prose is commentary, so a month is never lost to an unreachable model.
  return {
    period: start,
    summary: 'The review agent could not be reached this month. The eval scores below were still gathered and are correct.',
    suggestions: [],
    metrics,
    model: null,
  }
}

export async function persistAnswerReview(r: AnswerReview): Promise<void> {
  const admin = createAdminClient()
  await admin.from('digi_answer_reviews').upsert({
    period: r.period,
    summary: r.summary,
    suggestions: r.suggestions,
    metrics: r.metrics,
    model: r.model,
  }, { onConflict: 'period' })
}
