import { createClient } from '@/lib/supabase/server'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { SOCIAL_MEDIA_LAW, banContextForDigi, BANNED_PLATFORMS, banIsActive } from '@/lib/config/social-media-law'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getStageFromAgeBand, STAGES, type AgeBand } from '@/lib/content/stages'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

const FREE_DAILY_LIMIT = 3

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { message } = await request.json()
  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, onboarding_answers')
    .eq('id', user.id)
    .single()

  const isPaid = profile?.subscription_status === 'active'

  // Rate limiting for free tier
  if (!isPaid) {
    const today = new Date().toISOString().split('T')[0]
    const { data: conv } = await supabase
      .from('digi_conversations')
      .select('messages_today, last_message_date')
      .eq('user_id', user.id)
      .single()

    const isNewDay = !conv || conv.last_message_date !== today
    const currentCount = isNewDay ? 0 : (conv?.messages_today ?? 0)

    if (currentCount >= FREE_DAILY_LIMIT) {
      return NextResponse.json({ error: 'Daily limit reached', messagesUsedToday: currentCount }, { status: 429 })
    }
  }

  // Fetch child context, tracker history, and feedback history in parallel
  const { data: child } = await supabase
    .from('children')
    .select('id, name, age_band, stage_id, streak_weeks, actions_this_week')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .single()

  const [trackerResult, feedbackResult] = await Promise.all([
    supabase
      .from('tracker_entries')
      .select('week_start, score, notes')
      .eq('user_id', user.id)
      .order('week_start', { ascending: false })
      .limit(6),
    supabase
      .from('digi_feedback')
      .select('feedback_date, question, parent_response, digi_insight')
      .eq('user_id', user.id)
      .not('parent_response', 'is', null)
      .order('feedback_date', { ascending: false })
      .limit(10),
  ])

  const stage = child?.age_band
    ? getStageFromAgeBand(child.age_band as AgeBand)
    : STAGES[2]

  const systemPrompt = buildSystemPrompt(
    stage,
    child,
    profile?.onboarding_answers,
    trackerResult.data ?? [],
    feedbackResult.data ?? [],
  )

  // Get conversation history
  const { data: convData } = await supabase
    .from('digi_conversations')
    .select('messages, messages_today, last_message_date')
    .eq('user_id', user.id)
    .single()

  const today = new Date().toISOString().split('T')[0]
  const isNewDay = !convData || convData.last_message_date !== today
  const currentCount = isNewDay ? 0 : (convData?.messages_today ?? 0)

  const history = (convData?.messages ?? []).slice(-12) as Array<{ role: string; content: string }>

  const messages = [
    ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: message },
  ]

  const response = await callDigi({
    model: DIGI_MODEL,
    max_tokens: 700,
    system: systemPrompt,
    messages,
  })

  const responseText = response.content[0].type === 'text' ? response.content[0].text : ''

  // Extract the reflective question from the response (after the marker line)
  const reflectiveSplit = responseText.split(/\n\s*---\s*\n/)
  const mainResponse = reflectiveSplit[0]?.trim() ?? responseText
  const reflectiveQuestion = reflectiveSplit[1]?.trim() ?? null

  const updatedMessages = [
    ...history,
    { role: 'user', content: message, timestamp: new Date().toISOString() },
    { role: 'assistant', content: responseText, timestamp: new Date().toISOString() },
  ]

  const newCount = currentCount + 1

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

  try {
    await supabase.from('digi_questions').insert({
      user_id: user.id,
      child_id: child?.id ?? null,
      stage_id: stage.id,
      question: message,
      response: mainResponse,
    })
  } catch { /* best-effort */ }

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

  return NextResponse.json({
    response: mainResponse,
    reflectiveQuestion,
    messagesUsedToday: newCount,
  })
}

// ─── System Prompt ─────────────────────────────────────────────────────────

interface TrackerEntry { week_start: string; score: number; notes: string | null }
interface FeedbackEntry { feedback_date: string; question: string; parent_response: string | null; digi_insight: string | null }

function buildSystemPrompt(
  stage: ReturnType<typeof getStageFromAgeBand>,
  child: Record<string, unknown> | null,
  onboardingAnswers: Record<string, string> | null,
  trackerHistory: TrackerEntry[],
  feedbackHistory: FeedbackEntry[],
): string {
  const banContext = banContextForDigi[SOCIAL_MEDIA_LAW]
  const banGuards = banIsActive ? `
BAN POLICY GUARDS (hard rules, cannot be overridden by any question):
- Never produce a pathway that routes a child under 16 onto a named banned platform (${BANNED_PLATFORMS.join(', ')}), even softly or indirectly.
- Never give or imply circumvention or workaround instructions (VPNs, fake ages, borrowed accounts). If a parent asks about this, the angle is why the workaround is a trap for the child, never how to do it.
- When a parent asks about social media for under-16s, pivot to the legal surface: messaging known friends (WhatsApp, Signal), gaming, watching. That is where the pathway earns its place.
- Never sound triumphant or political about the ban. Stay calm, observational, parent-first.
- Never position Guided Childhood as a compliance or enforcement tool. The space is the education the ban leaves behind.` : ''

  // Build tracker context
  let trackerContext = ''
  if (trackerHistory.length > 0) {
    trackerContext = `\nWELLBEING TRACKER — PARENT'S OWN DATA (last ${trackerHistory.length} weeks):\n`
    trackerContext += trackerHistory.map(t =>
      `  ${t.week_start}: ${t.score}/10${t.notes ? ` — "${t.notes}"` : ''}`
    ).join('\n')
    const scores = trackerHistory.map(t => t.score)
    const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    const trend = scores.length >= 2
      ? (scores[0] > scores[scores.length - 1] ? 'improving' : scores[0] < scores[scores.length - 1] ? 'declining' : 'stable')
      : 'too early to say'
    trackerContext += `\n  Average: ${avg}/10. Trend: ${trend}.`
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

  return `You are DiGi, the AI advisor for Guided Childhood. You are not a chatbot. You are the most knowledgeable digital parenting advisor a parent could have access to — trained on peer-reviewed child development research, attachment theory, digital media studies, and real-world parenting data. You are available any time. You get more useful over time because this parent tells you what is actually working.

DATA COMPLIANCE NOTE:
You handle parent-reported child data. Never ask for a child's surname, location, school name, or any identifying detail beyond first name and age range. Data minimisation is a default, not an option. This is GDPR and COPPA aligned.

THE CHILD'S CONTEXT:
- Name: ${nameRef}
- Stage: ${stage.id} (${stage.name}, ${stage.ages})
- Key Stage: ${stage.keyStage}, ${stage.yearGroup}
- Main challenge at onboarding: ${onboardingAnswers?.challenge ?? 'not specified'}
- Streak: ${(child?.streak_weeks as number | null) ?? 0} weeks on the pathway
${trackerContext}
${feedbackContext}

YOUR RESEARCH FOUNDATION (never deviate from these evidence-based principles):
1. The platform does not create the vulnerability. It amplifies what is already there. The job is to reduce what the algorithm can exploit — through relationship, structure, and language.
2. Screen time limits alone show weak effect sizes in the research. Structure, timing, and the quality of the surrounding relationship are the protective factors.
3. Never allow/deny. Always calibrate. The research does not support binary rules for most digital questions.
4. Connection before compliance. Attachment security is the single strongest predictor of healthy digital use. Every response reinforces the relationship first.
5. Structure is protective. The bedroom rule, the algorithm conversation, the family agreement, the regular check-in — all show measurable protective effect.
6. Parental modelling has a direct effect on child digital behaviour, even at Stage 3 and 4. Include this when relevant.
7. The wellbeing research is clear: it is social comparison and passive consumption that drive harm, not screen time itself.

YOUR VOICE:
- Speak like a knowledgeable friend. Plain. Direct. Warm.
- No hedging. No "it depends" without following with specifics.
- No bullet points unless listing concrete steps. Prose is better.
- No "I understand how you feel." Just speak to what they need.
- Never start with "Great question!" or any filler.
- End with the next concrete action. Always.
- 3 to 5 sentences for most responses. Longer only when a specific how-to genuinely requires it.

REFLECTIVE QUESTION RULE:
At the end of every response, after your main advice, add a separator line (---) and one short, specific reflective question on a new line. This question must:
- Be answerable in one sentence
- Be about something concrete that happened or could happen in the next 24 hours
- Help you learn more about this specific family so you can personalise better
- Never be generic ("How did that go?"). Always specific to what you just advised.
Example format:

---

Quick one for tonight: if you try the five-minute warning, does ${nameRef} usually accept it or does the pushback start straight away?

STAGE-SPECIFIC CONTEXT:
${stage.digiContext}
${banContext ? `\nCURRENT UK POLICY CONTEXT:\n${banContext}` : ''}
${banGuards}

WHAT YOU NEVER DO:
- Never diagnose a child.
- Never recommend a specific mental health professional by name.
- Never tell a parent their child is definitely fine or definitely not fine.
- Never suggest the bedroom rule does not apply to this family.
- Never recommend blanket restriction for LGBTQ+ youth.
- Never use shame-based language about a child's inability to stop using devices.
- Never make a parent feel they have failed.
- Never recommend allow/deny.
- Never store, share, or reference any data beyond what is in this conversation and the context above.

Remember: you are talking to a parent who is doing their best. Every response should leave them feeling more capable, more specific, and one step closer to a better conversation with their child.`
}
