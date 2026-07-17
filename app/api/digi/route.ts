import { createClient } from '@/lib/supabase/server'
import { firstText } from '@/lib/digi/text'
import { hasFullAccess } from '@/lib/access'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS, digiModelsFor } from '@/lib/config/digi'
import { NextResponse, after } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getStageFromAgeBand, STAGES, type AgeBand, type ChallengeId } from '@/lib/content/stages'
import { getRecommendedScript } from '@/lib/pathway/recommend'
import type { StageId } from '@/lib/pathway/progress'
import { getExpertKnowledge, getFamilyMemory, getWhatWorked } from '@/lib/digi/brain'
import { getAggregateWisdom } from '@/lib/digi/wisdom'
import { lexicalFlags, highestSeverity } from '@/lib/digi/safety'
import { STATIC_SYSTEM } from '@/lib/digi/system'
import { createAdminClient } from '@/lib/supabase/admin'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
  timeout: 45_000,
  maxRetries: 1,
})

const WARM_ERROR = 'DiGi took too long to think just then. Ask again, your message was not lost.'
const BUSY_ERROR = 'DiGi is helping a lot of parents right now. Give it a minute and ask again, your message was not lost.'

async function callDigi(params: Anthropic.MessageCreateParamsNonStreaming): Promise<Anthropic.Message> {
  const modelsToTry = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  let lastError: unknown
  for (const model of modelsToTry) {
    try {
      return await anthropic.messages.create({ ...params, model })
    } catch (err) {
      const isModelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!isModelError) throw err
      lastError = err
    }
  }
  throw lastError
}

// Streaming variant of callDigi with the same model fallback chain. The await
// resolves once response headers arrive, so 404/400 model errors throw here
// and the next model is tried before any text has been sent to the client.
async function callDigiStream(params: Omit<Anthropic.MessageCreateParamsStreaming, 'stream'>) {
  const modelsToTry = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  let lastError: unknown
  for (const model of modelsToTry) {
    try {
      return await anthropic.messages.create({ ...params, model, stream: true })
    } catch (err) {
      const isModelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!isModelError) throw err
      lastError = err
    }
  }
  throw lastError
}

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const FREE_DAILY_LIMIT = 3

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { message, device_key } = await request.json()
  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  // Gather all independent context in one parallel round trip: profile,
  // conversation (rate limit + history), child, tracker history, reflection
  // feedback, script feedback, AI lessons, device guide, live concerns,
  // family memory.
  const [
    profileResult,
    convResult,
    childResult,
    trackerResult,
    feedbackResult,
    scriptFeedbackResult,
    aiLessonsResult,
    deviceGuideResult,
    concernsResult,
    familyMemory,
    whatWorked,
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('subscription_status, trial_ends_at, onboarding_answers')
      .eq('id', user.id)
      .single(),
    supabase
      .from('digi_conversations')
      .select('messages, messages_today, last_message_date')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('children')
      .select('id, name, age_band, stage_id, streak_weeks, actions_this_week')
      .eq('parent_id', user.id)
      .eq('is_primary', true)
      .single(),
    supabase
      .from('wellbeing_checks')
      .select('week_start, mood_score, sleep_score, social_score, screen_mood_score, open_communication, concern_level, notes')
      .eq('parent_id', user.id)
      .order('week_start', { ascending: false })
      .limit(6),
    supabase
      .from('digi_feedback')
      .select('feedback_date, question, parent_response, digi_insight')
      .eq('user_id', user.id)
      .not('parent_response', 'is', null)
      .order('feedback_date', { ascending: false })
      .limit(10),
    supabase
      .from('script_completions')
      .select('script_sort_order, worked, completed_at')
      .eq('user_id', user.id)
      .not('worked', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(10),
    supabase
      .from('ai_lessons')
      .select('title, key_message, the_idea')
      .eq('audience', 'parent')
      .order('sort_order', { ascending: true }),
    device_key && typeof device_key === 'string'
      ? supabase
          .from('device_guides')
          .select('name, subtitle, why, steps, note')
          .eq('device_key', device_key)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from('concerns')
      .select('slug, label, status, times_flagged')
      .eq('user_id', user.id)
      .in('status', ['open', 'improving'])
      .order('last_flagged_at', { ascending: false })
      .limit(6),
    getFamilyMemory(supabase, user.id, message),
    getWhatWorked(supabase, user.id),
  ])

  const profile = profileResult.data
  const convData = convResult.data
  const child = childResult.data

  const isPaid = hasFullAccess(profile, user.email)

  const today = new Date().toISOString().split('T')[0]
  const isNewDay = !convData || convData.last_message_date !== today
  const currentCount = isNewDay ? 0 : (convData?.messages_today ?? 0)

  // Rate limiting for free tier — checked before any streaming starts
  if (!isPaid && currentCount >= FREE_DAILY_LIMIT) {
    return NextResponse.json({ error: 'Daily limit reached', messagesUsedToday: currentCount }, { status: 429 })
  }

  const stage = child?.age_band
    ? getStageFromAgeBand(child.age_band as AgeBand)
    : STAGES[2]

  const aiKnowledge = (aiLessonsResult.data ?? [])
    .map(l => `- ${l.title}: ${l.key_message} (${l.the_idea})`)
    .join('\n')

  const scriptFeedback = scriptFeedbackResult.data ?? []
  const parentChallenge = (profile?.onboarding_answers as Record<string, string> | null)?.challenge as ChallengeId | undefined

  // Second parallel round trip for the queries that depend on the first
  const [expertKnowledge, aggregateWisdom, recommended, matchingScriptsResult] = await Promise.all([
    getExpertKnowledge(supabase, child?.age_band ?? null, message),
    getAggregateWisdom(supabase, child?.age_band ?? null, message),
    child?.stage_id
      ? getRecommendedScript(supabase, user.id, child.stage_id as StageId, parentChallenge ?? null, { preferFree: !isPaid })
      : Promise.resolve(null),
    scriptFeedback.length > 0
      ? supabase
          .from('scripts')
          .select('sort_order, title')
          .in('sort_order', scriptFeedback.map(f => f.script_sort_order))
      : Promise.resolve({ data: null }),
  ])

  let nextStepKnowledge = ''
  if (recommended) {
    nextStepKnowledge = `\n\nRECOMMENDED NEXT STEP ON THE PATHWAY: The next script this parent has not yet completed is "${recommended.title}" (${recommended.situation}). ${recommended.matchesChallenge ? 'This directly matches the main concern they told us about at signup.' : ''} If the conversation naturally allows it, or if they ask what to do next, mention this specific script by name as the next concrete step, do not just give generic advice when a specific next step already exists.`
  }

  let scriptFeedbackKnowledge = ''
  if (scriptFeedback.length > 0) {
    const matchingScripts = matchingScriptsResult.data
    const titleFor = (sortOrder: number) => matchingScripts?.find(s => s.sort_order === sortOrder)?.title ?? `script ${sortOrder}`
    scriptFeedbackKnowledge = `\n\nSCRIPTS THIS PARENT HAS TRIED, AND WHETHER THEY WORKED (use this, do not suggest a script that already failed without acknowledging it first, and lean on ones that worked):\n` +
      scriptFeedback.map(f => `- "${titleFor(f.script_sort_order)}": ${f.worked === 'yes' ? 'worked well' : f.worked === 'somewhat' ? 'partly worked' : 'did not work'}`).join('\n')
  }

  let deviceGuideKnowledge = ''
  const deviceGuide = deviceGuideResult.data
  if (deviceGuide) {
    const steps = ((deviceGuide.steps as string[] | null) ?? [])
      .map(s => s.replace(/\*\*/g, ''))
      .map((s, i) => `  ${i + 1}. ${s}`)
      .join('\n')
    deviceGuideKnowledge = `\n\nDEVICE SETUP GUIDE — the parent is asking about ${deviceGuide.name} (${deviceGuide.subtitle}). Walk them through this step by step, one step at a time, checking in before moving to the next rather than dumping all steps at once. Why this matters: ${deviceGuide.why}\nSteps:\n${steps}\nClosing note: ${deviceGuide.note}`
  }

  let concernsKnowledge = ''
  const liveConcerns = concernsResult.data ?? []
  if (liveConcerns.length > 0) {
    concernsKnowledge = `\n\nLIVE CONCERNS THIS FAMILY HAS FLAGGED (from daily check ins and flagged moments, most recent first):\n` +
      liveConcerns.map(c => `- ${c.label}: ${c.status}, flagged ${c.times_flagged} time${c.times_flagged === 1 ? '' : 's'}`).join('\n') +
      `\nWhen the conversation touches one of these, acknowledge it with empathy as something you know has been coming up for them, and move them to the NEXT practical step rather than repeating what they have already tried. A concern that keeps returning means the approach needs adjusting, never that the parent is failing. No guilt, ever.`
  }

  const familyContext = buildSystemPrompt(
    stage,
    child,
    profile?.onboarding_answers,
    trackerResult.data ?? [],
    feedbackResult.data ?? [],
    aiKnowledge,
    deviceGuideKnowledge + scriptFeedbackKnowledge + nextStepKnowledge + concernsKnowledge + whatWorked + aggregateWisdom + expertKnowledge + familyMemory,
  )

  // Drop any malformed or empty entries before the history reaches the model:
  // the API rejects a conversation containing an empty message, so one bad
  // saved row would otherwise poison every future call.
  const history = ((convData?.messages ?? []) as Array<{ role: string; content: string }>)
    .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-12)

  const messages = [
    ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: message },
  ]

  const newCount = currentCount + 1

  // Open the model stream. Failures here happen before any bytes reach the
  // client, so the warm error can still go out as JSON like before.
  let modelStream: Awaited<ReturnType<typeof callDigiStream>>
  try {
    modelStream = await callDigiStream({
      model: DIGI_MODEL,
      max_tokens: 700,
      system: [
        { type: 'text', text: STATIC_SYSTEM, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: familyContext },
      ],
      messages,
    })
  } catch (err) {
    const status = err instanceof Anthropic.APIError ? err.status : null
    return NextResponse.json({ error: status === 429 || status === 529 ? BUSY_ERROR : WARM_ERROR }, { status: 503 })
  }

  // The post-response work (saving the conversation, memory extraction, the
  // reflective question) runs after the stream completes, once the full text
  // has been collected. `after` keeps the serverless function alive for it.
  let resolveDone: (fullText: string) => void = () => {}
  const donePromise = new Promise<string>(resolve => { resolveDone = resolve })

  after(async () => {
    const responseText = await donePromise
    if (!responseText.trim()) return

    // Extract the reflective question from the response (after the marker line)
    const reflectiveSplit = responseText.split(/\n\s*---\s*\n/)
    const mainResponse = reflectiveSplit[0]?.trim() ?? responseText
    const reflectiveQuestion = reflectiveSplit[1]?.trim() ?? null

    // Save the main reply only. The reflective question lives in digi_feedback,
    // and saving the filtered history heals any poisoned rows already stored.
    const updatedMessages = [
      ...history,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: mainResponse || responseText, timestamp: new Date().toISOString() },
    ]

    if (convData) {
      await supabase.from('digi_conversations').update({
        messages: updatedMessages,
        message_count: Math.floor(updatedMessages.length / 2),
        messages_today: newCount,
        last_message_date: today,
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id)
    } else {
      await supabase.from('digi_conversations').insert({
        user_id: user.id,
        messages: updatedMessages,
        message_count: 1,
        messages_today: newCount,
        last_message_date: today,
      })
    }

    // DiGi learns: extract one durable memory from the exchange when there is
    // one worth keeping, so future conversations start from what is known.
    // When the memory is a concern, it also joins the same concerns ledger
    // Right now and the daily moments tagger write to, so a worry raised only
    // in chat still gets carried forward and asked about again tomorrow,
    // exactly like one flagged any other way. Existing slugs are offered back
    // so a repeat of the same theme bumps the same row instead of forking it.
    try {
      const existingConcernList = liveConcerns.length > 0
        ? liveConcerns.map(c => `${c.slug}: ${c.label}`).join('; ')
        : 'none yet'
      const extraction = await callDigi({
        model: digiModelsFor('extract')[0],
        max_tokens: 220,
        messages: [{
          role: 'user',
          content: `From this parent coaching exchange, extract at most ONE durable fact worth remembering for future conversations (a concern, a win, a preference, or lasting context about the child or family). Skip small talk and one off logistics. If nothing durable, reply exactly NONE.\n\nParent: ${message}\nAdvisor: ${mainResponse.slice(0, 600)}\n\nThis family's existing tracked concerns (slug: label): ${existingConcernList}\n\nReply as JSON only: {"kind":"observation|concern|win|preference|context","content":"one sentence, third person","concern_slug":"kebab-case-2-to-4-words","concern_label":"Short label, sentence case"} or NONE. Only include concern_slug and concern_label when kind is concern: reuse an existing slug above verbatim if this is the same theme, otherwise invent a new short one.`,
        }],
      })
      const memText = firstText(extraction).trim() || 'NONE'
      if (memText !== 'NONE') {
        const memMatch = memText.match(/\{[\s\S]*\}/)
        if (memMatch) {
          const mem = JSON.parse(memMatch[0]) as { kind: string; content: string; concern_slug?: string; concern_label?: string }
          if (['observation', 'concern', 'win', 'preference', 'context'].includes(mem.kind) && mem.content) {
            // Embed at write time so the memory is findable by meaning from
            // the very next question. No key or a failed call stores null and
            // the backfill sweeps it up later.
            const { embedText } = await import('@/lib/digi/embeddings')
            const embedding = await embedText(mem.content.slice(0, 400), 'document').catch(() => null)
            await supabase.from('digi_memory').insert({
              user_id: user.id, child_id: child?.id ?? null,
              kind: mem.kind, content: mem.content.slice(0, 400), source: 'chat',
              ...(embedding ? { embedding } : {}),
            })

            if (mem.kind === 'concern' && mem.concern_slug && mem.concern_label) {
              const slug = mem.concern_slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
              if (slug) {
                const prior = liveConcerns.find(c => c.slug === slug)
                await supabase.from('concerns').upsert({
                  user_id: user.id,
                  child_id: child?.id ?? null,
                  source: 'digi',
                  slug,
                  label: mem.concern_label.slice(0, 200),
                  status: prior ? (prior.status === 'resolved' ? 'open' : prior.status) : 'open',
                  times_flagged: prior ? prior.times_flagged + 1 : 1,
                  last_flagged_at: new Date().toISOString(),
                }, { onConflict: 'user_id,slug' })
              }
            }
          }
        }
      }
    } catch { /* memory is best effort, never blocks the reply */ }

    try {
      await supabase.from('digi_questions').insert({
        user_id: user.id,
        child_id: child?.id ?? null,
        stage_id: stage.id,
        question: message,
        response: mainResponse,
      })
    } catch { /* best-effort */ }

    // The safety verifier's cheap deterministic pass runs on the finished
    // reply. It never touched the parent's stream and cannot change it, it only
    // records anything it caught so the founder can review it and the evals can
    // trust the same check. Service role write, so the admin client, and the
    // whole thing is best effort: a flag that fails to save must never surface
    // to the parent.
    try {
      const flags = lexicalFlags(message, mainResponse)
      if (flags.length > 0) {
        await createAdminClient().from('digi_safety_flags').insert({
          user_id: user.id,
          stage_id: stage.id,
          question: message.slice(0, 1000),
          reply: mainResponse.slice(0, 2000),
          violations: flags,
          severity: highestSeverity(flags),
          source: 'live',
        })
      }
    } catch { /* best-effort, never blocks the reply */ }

    // Save the reflective question for today (upsert — only keeps the latest per day)
    if (reflectiveQuestion) {
      try {
        await supabase.from('digi_feedback').upsert({
          user_id: user.id,
          child_id: child?.id ?? null,
          feedback_date: today,
          question: reflectiveQuestion,
        }, { onConflict: 'user_id,feedback_date', ignoreDuplicates: true })
      } catch { /* best-effort */ }
    }
  })

  // Stream the reply to the client as plain text. The reflective question
  // travels inside the stream after the --- marker and the client splits on
  // it, exactly as the model writes it.
  const encoder = new TextEncoder()
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let fullText = ''
      try {
        for await (const event of modelStream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            fullText += event.delta.text
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
      } catch {
        // Stream failed. If nothing reached the client yet, send the warm
        // apology as the reply. Partial replies are kept and not saved.
        if (!fullText) {
          try { controller.enqueue(encoder.encode(WARM_ERROR)) } catch { /* client gone */ }
        }
        fullText = ''
      } finally {
        resolveDone(fullText)
        try { controller.close() } catch { /* already closed */ }
      }
    },
  })

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Messages-Used-Today': String(newCount),
    },
  })
}

// ─── System Prompt ─────────────────────────────────────────────────────────

interface TrackerEntry {
  week_start: string
  mood_score: number | null
  sleep_score: number | null
  social_score: number | null
  screen_mood_score: number | null
  open_communication: number | null
  concern_level: string
  notes: string | null
}
interface FeedbackEntry { feedback_date: string; question: string; parent_response: string | null; digi_insight: string | null }

function buildSystemPrompt(
  stage: ReturnType<typeof getStageFromAgeBand>,
  child: Record<string, unknown> | null,
  onboardingAnswers: Record<string, string> | null,
  trackerHistory: TrackerEntry[],
  feedbackHistory: FeedbackEntry[],
  aiKnowledge: string = '',
  deviceGuideKnowledge: string = ''
): string {
  const aiKnowledgeBlock = aiKnowledge ? `

AI LITERACY KNOWLEDGE (the platform's curated, accurate framing on AI. When a parent asks about AI, chatbots, deepfakes, hallucinations, or using AI with their child, ground your answer in this. Do not contradict it, and never claim to know the very latest model release):
${aiKnowledge}` : ''

  // Build tracker context
  let trackerContext = ''
  if (trackerHistory.length > 0) {
    const weekAvg = (t: TrackerEntry) => {
      const vals = [t.mood_score, t.sleep_score, t.social_score, t.screen_mood_score, t.open_communication]
        .filter((v): v is number => typeof v === 'number')
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
    }
    trackerContext = `\nWELLBEING TRACKER — PARENT'S OWN DATA (last ${trackerHistory.length} weeks, 1 to 5 scale):\n`
    trackerContext += trackerHistory.map(t => {
      const avg = weekAvg(t)
      return `  ${t.week_start}: ${avg !== null ? avg.toFixed(1) : 'n/a'}/5, concern ${t.concern_level}${t.notes ? ` — "${t.notes}"` : ''}`
    }).join('\n')
    const scores = trackerHistory.map(weekAvg).filter((v): v is number => v !== null)
    if (scores.length >= 2) {
      const trend = scores[0] > scores[scores.length - 1] ? 'improving' : scores[0] < scores[scores.length - 1] ? 'declining' : 'stable'
      const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      trackerContext += `\n  Average: ${avg}/5. Trend: ${trend}.`
    }
  }

  // Build feedback context (what this parent has told DiGi previously)
  let feedbackContext = ''
  const answeredFeedback = feedbackHistory.filter(f => f.parent_response)
  if (answeredFeedback.length > 0) {
    feedbackContext = `\nWHAT THIS PARENT HAS TOLD DiGi (from daily reflections):\n`
    feedbackContext += answeredFeedback.map(f =>
      `  ${f.feedback_date}: "${f.question}" → Parent: "${f.parent_response}"`
    ).join('\n')
    feedbackContext += `\n\nUSE THIS to personalise today's advice. If they said something worked, acknowledge it. If something failed, adjust your approach.`
  }

  const childName = (child?.name as string | null) ?? null
  const nameRef = childName && childName !== 'Your child' ? childName : 'their child'

  // What time it actually is for the parent (UK), so DiGi never says tonight in
  // the morning. Server clock is UTC, so read it in Europe/London.
  const now = new Date()
  const londonHour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: 'numeric', hour12: false }).format(now))
  const weekday = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long' }).format(now)
  const daypart = londonHour < 6 ? 'the middle of the night' : londonHour < 12 ? 'the morning' : londonHour < 17 ? 'the afternoon' : londonHour < 21 ? 'the evening' : 'late at night'

  // A hard guard against inventing a child's name, the source of the wrong name
  // a parent saw. Use only the real name, or "your child", never anything else.
  const nameRule = childName && childName !== 'Your child'
    ? `The child's name is ${childName}. Use only this name. Never invent, guess, shorten, or use any other name for the child, not even once.`
    : `No child name has been given. Always say "your child". Never invent or use a made up name.`

  return `RIGHT NOW: it is ${daypart} on ${weekday}, UK time. Match every time reference to this. Do not say tonight, this evening, or an evening off unless it is actually evening or night. If it is morning or afternoon and you want them to wait, say later today or this evening, never tonight.

CHILD NAME RULE: ${nameRule}

THE CHILD'S CONTEXT:
- Name: ${nameRef}
- Stage: ${stage.id} (${stage.name}, ${stage.ages})
- Key Stage: ${stage.keyStage}, ${stage.yearGroup}
- Main challenge at onboarding: ${onboardingAnswers?.challenge ?? 'not specified'}
- Daily time this parent committed to at signup: ${onboardingAnswers?.timeCommitment ?? 'not specified'}. Keep advice and suggested actions within this budget, do not casually suggest things that need more time than they said they have.
- Streak: ${(child?.streak_weeks as number | null) ?? 0} weeks on the pathway
${trackerContext}
${feedbackContext}

STAGE-SPECIFIC CONTEXT:
${stage.digiContext}
${aiKnowledgeBlock}
${deviceGuideKnowledge}

The child's name for the reflective question example is ${nameRef}.`
}
