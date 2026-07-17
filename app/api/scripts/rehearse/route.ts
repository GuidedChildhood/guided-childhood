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

// No dashes in any copy, ever. Turn stray em, en and spaced hyphens into commas
// so a model line never slips a dash through.
function noDashes(s: string): string {
  return s.replace(/\s*[—–]\s*/g, ', ').replace(/\s+-\s+/g, ', ').trim()
}

// The safety net for Stuck for words: three genuinely good lines grounded in the
// expert canon (Dr Becky Kennedy, connection before correction and two things
// are true; Sue Atkins, the calm confident boundary; emotion coaching, name the
// feeling first). Built from this script so they always fit the moment, even
// with no model. Never leaves the parent with a dead button.
function expertFallbackLines(childName: string, situation: string, sayThis: string): string[] {
  const lines: string[] = [
    `I can see this feels really unfair right now, and it makes sense you are frustrated.`,
  ]
  const say = noDashes((sayThis ?? '').trim())
  if (say) lines.push(say)
  else lines.push(`Two things are true. You are allowed to be cross, and it is still time to stop.`)
  lines.push(`Shall we figure out a good stopping point together, so it is not so sudden next time?`)
  return lines.slice(0, 3).map(noDashes)
}

type Body = {
  mode: 'child' | 'coach' | 'suggest'
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
  if (!hasFullAccess(profile, user.email)) {
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

You are ${childName}, ${stage.ages}. The situation: ${situation}. Your parent is about to talk to you about it. React the way a real child this age genuinely might: a little defensive or testing at first, wanting to be understood, softening if the parent stays calm and connected, pushing back if they come in with a flat no. Keep every reply to one or two natural sentences, the way a child actually talks, never a speech. Use age appropriate language, the real slang and half sentences of a child this age, not a tidy grown up version. Ground it in the real world: name the actual app or game, invent a friend's name, mention being the only one left out, homework, being tired, whatever a child this age would really bring up in this exact situation, so it feels like a real moment and not a script. Never be abusive or use profanity. No dashes anywhere in what you say. If the parent handles it really well, let it show. This is practice, so make it feel real but winnable.`

  const messages = body.messages
    .filter(m => (m.role === 'user' || m.role === 'assistant') && m.content?.trim())
    .slice(-16)

  // Suggest mode: the parent is stuck for words, so DiGi hands three short
  // lines they could say next, grounded in the evidence on what actually helps
  // a child in a hard moment (connection before correction, name the feeling,
  // hold the limit warmly, never a flat no), calibrated to this script. Non
  // streaming, returns a plain JSON array of options. Runs the full model
  // fallback ladder so a 404 on the first model never leaves the parent with a
  // dead button, and falls back to line parsing if the JSON is imperfect.
  if (mode === 'suggest') {
    const suggestSystem = `You are DiGi, a sharp, evidence led parenting guide coaching a parent mid rehearsal. Your job is to hand them the exact words to say next to ${childName} (${stage.ages}) about: ${situation}.

Draw on the actual playbook the leading child and parent wellbeing experts teach:
- Dr Becky Kennedy: connection before correction, and "two things are true" (the child's feeling is real AND the limit still holds).
- Sue Atkins: the calm, confident boundary, said once, warmly, without wobble or lecture.
- Emotion coaching (Gottman, Tina Payne Bryson): name and validate the feeling first, so the child feels felt before anything is asked of them.
- Give a real element of choice or collaboration so the child keeps their dignity and some control.

Each line should do one of these well: name and validate what ${childName} is feeling, hold the limit warmly WITH the empathy rather than instead of it, or offer a choice or a way to solve it together. Never a flat no, never a lecture, never shame, never sarcasm.

Suggest exactly 3 short lines the parent could say next, each ONE natural spoken British sentence a real parent would actually say out loud in this moment, responding to what the child just said. Lean towards the spirit of: "${sayThis}". Steer clear of the spirit of: "${notThis}". Return ONLY a JSON array of 3 strings, nothing else. Never use a dash of any kind.`

    // Build our own single user turn so the model always answers as the coach.
    // Passing the rehearsal messages straight through ends on the child's line,
    // which makes the model continue in the child's voice instead of coaching,
    // the exact reason the button was dying. Fold the recent exchange into
    // context text and ask plainly for the three lines.
    const recent = messages.slice(-6)
      .map(m => `${m.role === 'user' ? 'Parent' : childName}: ${m.content}`).join('\n')
    const lastChild = [...messages].reverse().find(m => m.role === 'assistant')?.content
    const ask = recent
      ? `Here is how the rehearsal is going so far:\n${recent}\n\n${lastChild ? `${childName} has just said: "${lastChild}". ` : ''}Give me three lines I could say back right now, as a JSON array of 3 strings.`
      : `Give me three strong opening lines I could start this conversation with, as a JSON array of 3 strings.`

    const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
    for (const model of models) {
      try {
        const r = await anthropic.messages.create({
          model, max_tokens: 400,
          system: suggestSystem,
          messages: [{ role: 'user', content: ask }],
        })
        const text = r.content.filter(b => b.type === 'text').map(b => (b as { text: string }).text).join('').trim()
        let options: string[] = []
        const match = text.match(/\[[\s\S]*\]/)
        if (match) {
          try { options = (JSON.parse(match[0]) as unknown[]).filter(x => typeof x === 'string') } catch { /* fall through to line parse */ }
        }
        // Fallback parse: a plain list, one line each, strip bullets and quotes.
        if (options.length === 0 && text) {
          options = text.split('\n')
            .map(l => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').replace(/^["'"]|["'"]$/g, '').trim())
            .filter(l => l.length > 0 && !/^\[|\]$/.test(l))
        }
        options = options.slice(0, 3).map(noDashes).filter(Boolean)
        if (options.length > 0) return NextResponse.json({ options })
      } catch (err) {
        const isModelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
        if (!isModelError) break
        // try the next model in the ladder
      }
    }
    // Never a dead button: hand back the expert grounded lines built from this
    // very script, so the parent always has three real things to say.
    return NextResponse.json({ options: expertFallbackLines(childName, situation, sayThis) })
  }

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
