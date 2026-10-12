import { createClient } from '@/lib/supabase/server'
import { firstText } from '@/lib/digi/text'
import { createAdminClient } from '@/lib/supabase/admin'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Scripts got longer. The original four steps stay hand written in the
// database. Three deeper fields are generated ONCE per script by DiGi,
// then stored back on the scripts row so every later visit reads from
// the database (migration 032). One model call per script, ever.
//
// ── WHY THIS IS PER FIELD AND NOT ALL THREE ─────────────────────────────────
//
// It was all or nothing: generate unless every one of the three was present,
// and write all three back. On 12 October 2026 the live table held 54 scripts
// with a hand written `if_they_push_back` and `check_back` and a NULL
// `for_your_child`. All or nothing read that as "not expanded", so every page
// view of any of those 54 called the model and overwrote the two hand written
// fields with generated prose, and did it again on the next view. 54 scripts
// quietly rewriting themselves, and one DIGI_MODEL call per view of each.
//
// So the unit is the field. We ask DiGi only for what is actually missing,
// write back only those columns, and return the stored text untouched for the
// rest. A field a human wrote is never sent to the model and never overwritten.

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

  // What is actually stored, keyed the way the client reads it.
  const stored = {
    ifTheyPushBack: script.if_they_push_back?.trim() || null,
    checkBack: script.check_back?.trim() || null,
    forYourChild: script.for_your_child?.trim() || null,
  }

  // Only the empty ones are the model's business.
  const missing = (Object.keys(stored) as (keyof typeof stored)[]).filter(k => !stored[k])

  if (missing.length === 0) {
    return NextResponse.json(stored)
  }

  const ages = STAGE_AGES[script.stage_id] ?? 'ages 4 to 16'

  // One brief per field. Only the missing ones go into the JSON shape we ask
  // for, so the model cannot return, and we cannot store, a field a human
  // already wrote.
  const FIELD_BRIEFS: Record<keyof typeof stored, string> = {
    ifTheyPushBack: `"ifTheyPushBack": "What the parent says when the child argues, sulks or negotiates. Include the child's likely comeback and the parent's exact reply in quotes. Two or three sentences, max 60 words. Stay calm and hold the line warmly, never punish, never lecture."`,
    checkBack: `"checkBack": "How the parent follows up two or three days later. One concrete thing to notice and one exact sentence to say, in quotes. Max 50 words."`,
    forYourChild: `"forYourChild": "A short note from the parent straight to the child about this topic. Written at a level a child ${ages} reads easily. Warm, a little playful, zero lecture, ends with love or a nickname placeholder like 'Love, Mum or Dad'. First person from the parent. Max 55 words."`,
  }

  // The fields already written are shown to the model as context, so a
  // generated follow up sits against the real push back reply rather than one
  // the model imagined.
  const alreadyWritten = (Object.keys(stored) as (keyof typeof stored)[])
    .filter(k => stored[k])
    .map(k => `${k}: "${stored[k]}"`)
    .join('\n')

  const systemPrompt = `You are DiGi, the advisor inside Guided Childhood, a UK platform that helps parents guide their children through the digital world. You are extending a parenting script. The script already has four steps written by the team. Match their voice exactly: warm, plain, direct, like a wise friend, never clinical, never preachy. British English. Never use any dash character anywhere, not in any form. Use commas and full stops instead.

The script, written for a child ${ages}:
Title: ${script.title}
Situation: ${script.situation}
Say this: "${script.say_this}"
Not this: "${script.not_this}"
Why it works: ${script.why_it_works}
Before the moment: ${script.tonight}
${alreadyWritten ? `\nAlready written by the team, for context only. Do not rewrite these:\n${alreadyWritten}\n` : ''}
Respond with exactly this JSON object and no prose outside it:
{
  ${missing.map(k => FIELD_BRIEFS[k]).join(',\n  ')}
}

Return only the ${missing.length === 1 ? 'one key' : `${missing.length} keys`} asked for and nothing else.${missing.includes('forYourChild') ? `

The forYourChild note is the one the parent will actually send from their own phone, so it must sound like a real parent texting, not an app.` : ''}`

  try {
    const response = await callDigi({
      model: DIGI_MODEL,
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Generate the ${missing.length === 1 ? 'missing section' : 'missing sections'} for "${script.title}".` }],
    })

    const text = firstText(response)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'Generation failed' }, { status: 502 })

    const parsed = JSON.parse(jsonMatch[0])

    // Every field we asked for has to come back, or nothing is stored. A half
    // written expansion on the row would read as expanded on the next view.
    const generated: Partial<Record<keyof typeof stored, string>> = {}
    for (const k of missing) {
      const value = parsed[k] ? String(parsed[k]).trim() : ''
      if (!value) return NextResponse.json({ error: 'Generation failed' }, { status: 502 })
      generated[k] = value
    }

    const COLUMN: Record<keyof typeof stored, string> = {
      ifTheyPushBack: 'if_they_push_back',
      checkBack: 'check_back',
      forYourChild: 'for_your_child',
    }

    // Store once, and only the columns that were empty, so the whole
    // membership reads this from the database from here on.
    const update: Record<string, string> = {}
    for (const k of missing) update[COLUMN[k]] = generated[k]!

    const admin = createAdminClient()
    await admin.from('scripts').update(update).eq('id', script.id)

    return NextResponse.json({ ...stored, ...generated })
  } catch {
    return NextResponse.json({ error: 'DiGi is busy, try again in a moment' }, { status: 503 })
  }
}
