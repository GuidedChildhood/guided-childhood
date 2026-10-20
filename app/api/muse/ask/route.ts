import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { firstText } from '@/lib/digi/text'
import { digiModelsFor } from '@/lib/config/digi'
import { hasCrisisLanguage, hasSafeguardingLanguage, SAFEGUARDING_OPENER, lexicalFlags, highestSeverity } from '@/lib/digi/safety'
import {
  museAuthorised, cleanQuestion, stageForAge, dailyCap, buildAskPrompt, parseAskParts, partsFromScript,
  composeAnswer, scriptUrl, GENERIC_PARTS, PRESENTATION_NOTE, CRISIS_NOTE, STAGE_CHECK_URL, STAGE_CHECK_LINE, type AskParts, type FreeScript,
} from '@/lib/muse/connector'
import { findFreeScripts } from '@/lib/muse/scripts'

// POST /api/muse/ask: a parent's question from Meta's Muse, answered by DiGi.
// The why of the whole connector is in lib/muse/connector.ts.
//
// The order matters and is the app's order:
//   1. Crisis language never reaches a model. Humans first, the numbers, the
//      stage check, nothing generated (the Right Now rescue does the same).
//   2. Safeguarding language gets the CEOP opener ahead of the words.
//   3. Under the day's cap, DiGi writes the answer around the best free script.
//   4. Over the cap, or if the model fails, the best free script IS the answer.
//      The connector degrades to our own words, it never answers with an error
//      a parent would have to read.

export const maxDuration = 30
export const dynamic = 'force-dynamic'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
  timeout: 20_000,
  maxRetries: 1,
})

// Deterministic, like CRISIS_OPENER in lib/digi/safety.ts, and worded for a
// parent reading it inside another app with no conversation to fall back on.
const CRISIS_SIGNPOST =
  'This needs a real person before anything else. If anyone is in immediate danger, call 999. Samaritans are on 116 123, any hour. Childline is 0800 1111 for your child themselves. Your GP is the door to CAMHS tomorrow. You do not have to handle this alone.'
const CRISIS_SAY =
  'You matter to me more than anything on that screen. I am here, I am not angry, and we are going to get through this together.'

type Kind = 'ask' | 'ask_fallback' | 'signpost'

async function generate(prompt: string): Promise<string> {
  let lastError: unknown
  for (const model of digiModelsFor('rescue')) {
    try {
      const msg = await anthropic.messages.create({ model, max_tokens: 1200, messages: [{ role: 'user', content: prompt }] })
      return firstText(msg)
    } catch (err) {
      const isModelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!isModelError) throw err
      lastError = err
    }
  }
  throw lastError
}

/** Model answers already given today (UTC), or null when the count cannot be read. */
type Admin = ReturnType<typeof createAdminClient> | null

async function answersToday(admin: Admin): Promise<number | null> {
  if (!admin) return null
  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)
  const { count, error } = await admin
    .from('muse_calls')
    .select('id', { count: 'exact', head: true })
    .eq('kind', 'ask')
    .gte('created_at', start.toISOString())
  return error ? null : (count ?? 0)
}

async function logCall(admin: Admin, kind: Kind) {
  if (!admin) return
  try { await admin.from('muse_calls').insert({ kind }) } catch { /* counting never blocks an answer */ }
}

function respond(body: {
  parts: AskParts | null
  signpost: string | null
  script: FreeScript | null
  staged: ReturnType<typeof stageForAge>
  source: 'digi' | 'scripts' | 'signpost'
}) {
  const { parts, signpost, staged, source } = body
  const crisis = source === 'signpost'
  // The matcher works on words and can be wrong; DiGi says whether it used the
  // script, and a link to one it set aside would contradict the answer above it.
  const script = parts?.used_script ? body.script : null
  return NextResponse.json({
    answer: composeAnswer(parts, { signpost, script, crisis }),
    signpost,
    where_you_are: parts?.where_you_are ?? null,
    next_step: parts?.next_step ?? null,
    say_this: parts?.say_this ?? null,
    not_this: parts?.not_this ?? null,
    why: parts?.why || null,
    script: script ? { title: script.title, url: scriptUrl(script.id) } : null,
    stage: staged ? { number: staged.stage.id, name: staged.stage.name, ages: staged.stage.ages } : null,
    stage_check: crisis ? null : { url: STAGE_CHECK_URL, line: STAGE_CHECK_LINE },
    source,
    presentation_note: crisis ? CRISIS_NOTE : PRESENTATION_NOTE,
  })
}

export async function POST(request: Request) {
  if (!museAuthorised(request)) return NextResponse.json({ error: 'Missing or wrong API key' }, { status: 401 })

  const body = await request.json().catch(() => ({})) as { question?: unknown; child_age?: unknown }
  const question = cleanQuestion(body.question)
  if (!question) return NextResponse.json({ error: 'Send the parent\'s question in "question".' }, { status: 400 })
  const staged = stageForAge(body.child_age)

  // No database is a degraded answer, never a 500: the crisis route and the
  // generic words need nothing from it.
  let admin: Admin = null
  try { admin = createAdminClient() } catch { /* no service key */ }

  if (hasCrisisLanguage(question)) {
    await logCall(admin, 'signpost')
    return respond({
      parts: { where_you_are: '', next_step: 'Talk to a real person today, using the numbers above.', say_this: CRISIS_SAY, not_this: '', why: '' },
      signpost: CRISIS_SIGNPOST, script: null, staged, source: 'signpost',
    })
  }
  const signpost = hasSafeguardingLanguage(question) ? SAFEGUARDING_OPENER.trim() : null

  const scripts = admin ? await findFreeScripts(admin, question, staged?.scriptStage ?? null, 1).catch(() => []) : []
  const script = scripts[0] ?? null

  const used = await answersToday(admin)
  const underCap = used !== null && used < dailyCap()

  let parts: AskParts | null = null
  if (underCap) {
    try {
      parts = parseAskParts(await generate(buildAskPrompt(question, staged, script)))
    } catch { /* fall through to the script */ }
  }

  if (parts) {
    await logCall(admin, 'ask')
    // The same lexical pass every DiGi reply gets, logged, never blocking.
    // No user to attach; the question is kept only because something was
    // caught, which is the safety log's whole purpose.
    if (admin) try {
      const flags = lexicalFlags(question, `${parts.where_you_are} ${parts.next_step} ${parts.say_this} ${parts.not_this} ${parts.why}`)
      if (flags.length > 0) {
        await admin.from('digi_safety_flags').insert({
          user_id: null,
          stage_id: staged ? String(staged.stage.id) : null,
          question: `Muse: ${question}`,
          reply: `${parts.next_step} || ${parts.say_this} || ${parts.not_this}`,
          violations: flags,
          severity: highestSeverity(flags),
          source: 'live',
        })
      }
    } catch { /* best effort */ }
    return respond({ parts, signpost, script, staged, source: 'digi' })
  }

  await logCall(admin, 'ask_fallback')
  return respond({ parts: script ? partsFromScript(script) : GENERIC_PARTS, signpost, script, staged, source: 'scripts' })
}
