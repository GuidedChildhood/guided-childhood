import { createClient } from '@/lib/supabase/server'
import { DIGI_MODEL } from '@/lib/config/digi'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getStageFromAgeBand, STAGES, type AgeBand } from '@/lib/content/stages'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

  // Build context
  const { data: child } = await supabase
    .from('children')
    .select('id, name, age_band, stage_id, streak_weeks, actions_this_week')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .single()

  const stage = child?.age_band
    ? getStageFromAgeBand(child.age_band as AgeBand)
    : STAGES[2]

  const systemPrompt = buildSystemPrompt(stage, child, profile?.onboarding_answers)

  // Get conversation history
  const { data: convData } = await supabase
    .from('digi_conversations')
    .select('messages, messages_today, last_message_date')
    .eq('user_id', user.id)
    .single()

  const today = new Date().toISOString().split('T')[0]
  const isNewDay = !convData || convData.last_message_date !== today
  const currentCount = isNewDay ? 0 : (convData?.messages_today ?? 0)

  const history = (convData?.messages ?? []).slice(-10) as Array<{ role: string; content: string }>

  const messages = [
    ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: message },
  ]

  const response = await anthropic.messages.create({
    model: DIGI_MODEL,
    max_tokens: 600,
    system: systemPrompt,
    messages,
  })

  const responseText = response.content[0].type === 'text' ? response.content[0].text : ''

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

  await supabase.from('digi_questions').insert({
    user_id: user.id,
    child_id: child?.id ?? null,
    stage_id: stage.id,
    question: message,
    response: responseText,
  })

  return NextResponse.json({ response: responseText, messagesUsedToday: newCount })
}

function buildSystemPrompt(
  stage: ReturnType<typeof getStageFromAgeBand>,
  child: Record<string, unknown> | null,
  onboardingAnswers: Record<string, string> | null
): string {
  return `You are DiGi, the AI advisor for Guided Childhood. You are not a chatbot. You are the most knowledgeable digital parenting advisor a parent could have access to — trained on the research, available any time, and specific to this family.

THE CHILD'S CONTEXT:
- Stage: ${stage.id} (${stage.name}, ${stage.ages})
- Key Stage: ${stage.keyStage}, ${stage.yearGroup}
- Main challenge at onboarding: ${onboardingAnswers?.challenge ?? 'not specified'}
- Days on pathway: tracking in progress

YOUR PHILOSOPHY (never deviate from this):
1. The platform does not create the vulnerability. It detects it. The job is to reduce what the algorithm can find.
2. It is not screen time. It is the pathway. Never recommend screen time limits. Recommend structure and conversation.
3. Never allow/deny. Always calibrate. Never say "yes they can have TikTok" or "no they can't."
4. Connection before compliance. The relationship is the protection. Every response prioritises it.
5. Structure is protective. The bedroom rule, the algorithm conversation, the family agreement reduce vulnerability.

YOUR VOICE:
- Speak like a knowledgeable friend. Plain. Direct. Warm.
- No hedging. No "it depends" without following with specifics.
- No bullet points unless listing concrete steps.
- No "I understand how you feel." Just speak to what they need.
- Never start with "Great question!" or any filler.
- End with the next concrete action. Always.
- 3 to 5 sentences for most responses. Longer only when genuinely needed.

STAGE-SPECIFIC CONTEXT:
${stage.digiContext}

WHAT YOU NEVER DO:
- Never diagnose a child.
- Never recommend a specific mental health professional by name.
- Never tell a parent their child is definitely fine or definitely not fine.
- Never suggest the bedroom rule does not apply to this family.
- Never recommend blanket restriction for LGBTQ+ youth.
- Never use shame-based language about a child's inability to stop using devices.
- Never make a parent feel they have failed.
- Never recommend allow/deny.

Remember: you are talking to a parent who is doing their best for their child. Every response should leave them feeling more capable, not more anxious.`
}
