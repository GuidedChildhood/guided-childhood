import { createClient } from '@/lib/supabase/server'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'

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

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { momentId, childName, ageBand } = await request.json()
  if (!momentId) return NextResponse.json({ error: 'momentId required' }, { status: 400 })

  // Fetch the moment
  const { data: moment } = await supabase
    .from('daily_moments')
    .select('title, category, science_brief, digi_opener, solutions')
    .eq('id', momentId)
    .single()

  if (!moment) return NextResponse.json({ error: 'Moment not found' }, { status: 404 })

  // Fetch child profile context
  const { data: child } = await supabase
    .from('children')
    .select('name, age_band, stage_id')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .maybeSingle()

  const resolvedName = childName ?? child?.name ?? 'their child'
  const resolvedAgeBand = ageBand ?? child?.age_band ?? null
  const stage = resolvedAgeBand ? getStageFromAgeBand(resolvedAgeBand as AgeBand) : null

  const systemPrompt = `You are DiGi, an AI advisor for Guided Childhood. A parent has flipped a moment card about "${moment.title}" in the ${moment.category} category.

The child: ${resolvedName}, ${resolvedAgeBand ? `age band ${resolvedAgeBand}` : 'age not specified'}${stage ? `, ${stage.name}` : ''}.

Your job is to respond with a personalised, context-aware JSON object. No prose outside the JSON.

Respond with exactly this JSON structure:
{
  "digiQuestion": "A single, specific opening question for this parent about their child's experience of this moment (max 25 words, warm, not generic)",
  "science": "One sentence (max 25 words) of the core research insight for this moment, grounded in child development science",
  "solutions": ["Action step 1 (max 20 words)", "Action step 2 (max 20 words)", "Action step 3 (max 20 words)"],
  "script": "The exact words a parent could say tonight about this moment (max 30 words, in quotes, warm and plain)"
}

Base knowledge for this moment:
Science: ${moment.science_brief}
Default opener: ${moment.digi_opener}
Existing solutions: ${JSON.stringify(moment.solutions)}

Personalise to the child's name and age. Make the digiQuestion specific to this family, not generic. The script must be words a parent can actually say.`

  try {
    const response = await callDigi({
      model: DIGI_MODEL,
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Generate the moment card response for "${moment.title}" for ${resolvedName}.` }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      return NextResponse.json({
        digiQuestion: moment.digi_opener,
        science: moment.science_brief,
        solutions: Array.isArray(moment.solutions) ? moment.solutions : [],
        script: null,
      })
    }

    const parsed = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      digiQuestion: parsed.digiQuestion ?? moment.digi_opener,
      science: parsed.science ?? moment.science_brief,
      solutions: parsed.solutions ?? (Array.isArray(moment.solutions) ? moment.solutions : []),
      script: parsed.script ?? null,
    })
  } catch {
    return NextResponse.json({
      digiQuestion: moment.digi_opener,
      science: moment.science_brief,
      solutions: Array.isArray(moment.solutions) ? moment.solutions : [],
      script: null,
    })
  }
}
