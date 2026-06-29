import { createClient } from '@/lib/supabase/server'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CHALLENGE_LABELS: Record<string, string> = {
  morning_tv: 'morning TV battles',
  controller_fights: 'controller and gaming fights',
  wont_put_down: 'not being able to put the device down',
  bedtime_screens: 'screens at bedtime',
  mood_after_screens: 'mood changes after screen time',
  something_else: 'managing screens generally',
}

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

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { childName, ageBand, challenges } = await request.json()

  const stage = getStageFromAgeBand((ageBand ?? '8-10') as AgeBand)
  const name = (childName ?? 'your child').trim() || 'your child'
  const challengeList = (challenges as string[] ?? [])
    .map((c: string) => CHALLENGE_LABELS[c] ?? c)
    .join(', ')
  const primaryChallenge = challengeList || 'managing screens'
  const tomorrow = primaryChallenge.split(',')[0].trim()

  const systemPrompt = `You are DiGi, the AI advisor for Guided Childhood. You are not a chatbot — you are the most knowledgeable digital parenting advisor a parent could access. Plain. Direct. Warm. No bullet points. No hedging. No "I understand how you feel."

A parent has just joined. Return ONLY a JSON object — no markdown, no commentary, just the raw JSON:

{
  "intro": "2-3 sentences. Reference ${name} by name and the specific challenge (${primaryChallenge}). Be specific and warm. Do not list features. Do not say 'Great' or 'I understand'. End with one line about what you will give them.",
  "taskQuestion": "One short, specific, observational question about ${name} and the ${tomorrow} challenge. Rhetorical or confirmatory — not a quiz. 1 sentence.",
  "taskAction": "One concrete action for tomorrow related to ${tomorrow}. Start with a verb. 1-2 sentences. No options, no 'you could'. One thing.",
  "taskScript": "Word-for-word what the parent says to ${name} about this specific moment. Put it in quotation marks. 1-3 sentences. Calm, firm, warm. The kind of thing that actually works."
}

Stage context: ${name} is Stage ${stage.id} (${stage.name}, ${stage.ages}). ${stage.digiContext}`

  const response = await callDigi({
    model: DIGI_MODEL,
    max_tokens: 600,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Generate the onboarding content.' }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

  let parsed: { intro: string; taskQuestion: string; taskAction: string; taskScript: string }
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    parsed = JSON.parse(jsonMatch?.[0] ?? raw)
  } catch {
    parsed = {
      intro: `Hi, I'm DiGi. You mentioned ${primaryChallenge} with ${name} — that's one of the most common challenges at this stage, and it is very fixable. I will give you the exact words, not just theory.`,
      taskQuestion: `Does ${name} usually push back immediately when you mention putting the device down?`,
      taskAction: `Give ${name} a five-minute warning before asking them to stop. Say it once, calmly, then follow through.`,
      taskScript: `"Five more minutes, then we're done." Say it once. Do not negotiate. The firmness is the message.`,
    }
  }

  // Save the first task interaction as the opening digi_questions entry
  const { data: childData } = await supabase
    .from('children')
    .select('id')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .single()

  try {
    await supabase.from('digi_questions').insert({
      user_id: user.id,
      child_id: childData?.id ?? null,
      stage_id: stage.id,
      question: `[Onboarding first task] Challenge: ${primaryChallenge}`,
      response: `${parsed.taskAction} ${parsed.taskScript}`,
    })
  } catch {
    // Best-effort — do not block the response
  }

  return NextResponse.json(parsed)
}
