import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Scripts got longer. The original four steps stay hand written in the
// database. Three deeper fields are generated ONCE per script by DiGi,
// then stored back on the scripts row so every later visit reads from
// the database (migration 032). One model call per script, ever.

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder' })

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

const STAGE_AGES: Record<string, string> = {
  foundation: 'ages 4 to 7',
  builder: 'ages 8 to 10',
  explorer: 'ages 11 to 13',
  shaper: 'ages 13 to 15',
  independent: 'age 16 and above',
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { sortOrder } = await request.json()
  const order = parseInt(String(sortOrder), 10)
  if (isNaN(order) || order < 1) {
    return NextResponse.json({ error: 'sortOrder required' }, { status: 400 })
  }

  const { data: script } = await supabase
    .from('scripts')
    .select('id, title, situation, say_this, not_this, why_it_works, tonight, stage_id, if_they_push_back, check_back, for_your_child')
    .eq('sort_order', order)
    .single()

  if (!script) return NextResponse.json({ error: 'Script not found' }, { status: 404 })

  // Already expanded: serve straight from the database.
  if (script.if_they_push_back && script.check_back && script.for_your_child) {
    return NextResponse.json({
      ifTheyPushBack: script.if_they_push_back,
      checkBack: script.check_back,
      forYourChild: script.for_your_child,
    })
  }

  const ages = STAGE_AGES[script.stage_id] ?? 'ages 4 to 16'

  const systemPrompt = `You are DiGi, the advisor inside Guided Childhood, a UK platform that helps parents guide their children through the digital world. You are extending a parenting script with three deeper sections. The script already has four steps written by the team. Match their voice exactly: warm, plain, direct, like a wise friend, never clinical, never preachy. British English. Never use any dash character anywhere, not in any form. Use commas and full stops instead.

The script, written for a child ${ages}:
Title: ${script.title}
Situation: ${script.situation}
Say this: "${script.say_this}"
Not this: "${script.not_this}"
Why it works: ${script.why_it_works}
Tonight: ${script.tonight}

Respond with exactly this JSON object and no prose outside it:
{
  "ifTheyPushBack": "What the parent says when the child argues, sulks or negotiates. Include the child's likely comeback and the parent's exact reply in quotes. Two or three sentences, max 60 words. Stay calm and hold the line warmly, never punish, never lecture.",
  "checkBack": "How the parent follows up two or three days later. One concrete thing to notice and one exact sentence to say, in quotes. Max 50 words.",
  "forYourChild": "A short note from the parent straight to the child about this topic. Written at a level a child ${ages} reads easily. Warm, a little playful, zero lecture, ends with love or a nickname placeholder like 'Love, Mum or Dad'. First person from the parent. Max 55 words."
}

The forYourChild note is the one the parent will actually send from their own phone, so it must sound like a real parent texting, not an app.`

  try {
    const response = await callDigi({
      model: DIGI_MODEL,
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Generate the three deeper sections for "${script.title}".` }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'Generation failed' }, { status: 502 })

    const parsed = JSON.parse(jsonMatch[0])
    const ifTheyPushBack = parsed.ifTheyPushBack ? String(parsed.ifTheyPushBack) : null
    const checkBack = parsed.checkBack ? String(parsed.checkBack) : null
    const forYourChild = parsed.forYourChild ? String(parsed.forYourChild) : null
    if (!ifTheyPushBack || !checkBack || !forYourChild) {
      return NextResponse.json({ error: 'Generation failed' }, { status: 502 })
    }

    // Store once so the whole membership reads this from the database.
    const admin = createAdminClient()
    await admin
      .from('scripts')
      .update({ if_they_push_back: ifTheyPushBack, check_back: checkBack, for_your_child: forYourChild })
      .eq('id', script.id)

    return NextResponse.json({ ifTheyPushBack, checkBack, forYourChild })
  } catch {
    return NextResponse.json({ error: 'DiGi is busy, try again in a moment' }, { status: 503 })
  }
}
