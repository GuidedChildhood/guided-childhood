import { createClient } from '@/lib/supabase/server'
import { hasFullAccess } from '@/lib/access'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getStageFromAgeBand, STAGES, type AgeBand } from '@/lib/content/stages'

// Rehearse with DiGi: a safe place to practise the words before the real
// conversation. DiGi plays the child, reacting the way a real child of this
// age might, so the parent can try the line, feel the pushback, and find
// their footing. On request DiGi steps out of character and coaches: what
// landed, what to adjust, one thing to try. This is not the advice engine,
// it is a rehearsal room, so it runs on its own tight prompt and never
// touches the family memory or the daily free limit.

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
  timeout: 45_000,
  maxRetries: 1,
})

async function stream(params: Omit<Anthropic.MessageCreateParamsStreaming, 'stream'>) {
  const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  let lastError: unknown
  for (const model of models) {
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

const WARM_ERROR = 'DiGi lost its place for a second. Try that line again, nothing was lost.'

type Body = {
  mode: 'child' | 'coach'
  scriptTitle: string
  situation: string
  sayThis: string
  notThis: string
  messages: { role: 'user' | 'assistant'; content: string }[]
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, trial_ends_at')
    .eq('id', user.id)
    .single()
  if (!hasFullAccess(profile)) {
    return NextResponse.json({ error: 'Rehearsing with DiGi is part of full access.' }, { status: 402 })
  }

  const body = (await request.json()) as Body
  const { mode, scriptTitle, situation, sayThis, notThis } = body
  if (!scriptTitle || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const { data: child } = await supabase
    .from('children')
    .select('name, age_band')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .maybeSingle()

  const stage = child?.age_band ? getStageFromAgeBand(child.age_band as AgeBand) : STAGES[2]
  const childName = child?.name && child.name !== 'Your child' ? child.name : 'your child'

  const system = mode === 'coach'
    ? `You are DiGi, a warm parenting coach reviewing a practice run. The parent has just rehearsed a real conversation with you playing their child. Now step OUT of character and coach them, briefly and kindly.

The script they were practising is "${scriptTitle}" (${situation}).
The line to aim for: "${sayThis}"
The line to avoid: "${notThis}"

Give feedback in 3 to 4 short chat messages separated by blank lines:
- One genuine thing that landed well in how they spoke.
- One small adjustment, specific to a thing they actually said, phrased as encouragement not correction.
- One sentence they could try if the real conversation gets stuck.
Warm, plain, direct. Never shame. No bullet points. No dashes anywhere. End on belief that they can do this.`
    : `You are role-playing a child so a parent can practise a hard conversation. Stay fully in character as the child. Do NOT give advice, do NOT break character, do NOT speak as an assistant.

You are ${childName}, ${stage.ages}. The situation: ${situation}. Your parent is about to talk to you about it. React the way a real child this age genuinely might: a little defensive or testing at first, wanting to be understood, softening if the parent stays calm and connected, pushing back if they come in with a flat no. Keep every reply to one or two natural sentences, the way a child actually talks, never a speech. Use age appropriate language. Never be abusive or use profanity. No dashes anywhere in what you say. If the parent handles it really well, let it show. This is practice, so make it feel real but winnable.`

  const messages = body.messages
    .filter(m => (m.role === 'user' || m.role === 'assistant') && m.content?.trim())
    .slice(-16)

  // Coach mode reviews the run just completed; if the parent has not said
  // anything yet in child mode, open with a natural first line from the child.
  if (mode === 'child' && messages.length === 0) {
    messages.push({ role: 'user', content: '(Your parent sits down next to you and says your name gently. Give your first, natural reaction.)' })
  }
  if (mode === 'coach') {
    messages.push({ role: 'user', content: 'That was the practice run. How did I do, and what would you tweak?' })
  }

  let modelStream: Awaited<ReturnType<typeof stream>>
  try {
    modelStream = await stream({
      model: DIGI_MODEL,
      max_tokens: mode === 'coach' ? 500 : 160,
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages,
    })
  } catch (err) {
    const status = err instanceof Anthropic.APIError ? err.status : null
    return NextResponse.json({ error: WARM_ERROR }, { status: status === 429 || status === 529 ? 503 : 503 })
  }

  const encoder = new TextEncoder()
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = ''
      try {
        for await (const event of modelStream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            sent += event.delta.text
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
      } catch {
        if (!sent) { try { controller.enqueue(encoder.encode(WARM_ERROR)) } catch { /* gone */ } }
      } finally {
        try { controller.close() } catch { /* already closed */ }
      }
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
