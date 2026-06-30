import { createClient } from '@/lib/supabase/server'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export const dynamic = 'force-dynamic'

async function generateInsight(question: string, answer: string, childName: string | null, ageBand: string | null): Promise<string | null> {
  const name = (childName && childName !== 'Your child') ? childName : 'their child'
  const modelsToTry = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  for (const model of modelsToTry) {
    try {
      const res = await Promise.race([
        anthropic.messages.create({
          model,
          max_tokens: 120,
          system: `You are DiGi, a digital parenting advisor. A parent has answered a reflective question you asked. Write 2-3 sentences for them to see tomorrow morning. Acknowledge what they said specifically, then give one concrete next step. Warm and plain. No hedging. No bullet points. Use their child's name (${name}). Age band: ${ageBand ?? 'unknown'}.`,
          messages: [{ role: 'user', content: `Question you asked: "${question}"\nParent answered: "${answer}"\n\nWrite the follow-up they will see tomorrow.` }],
        }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000)),
      ])
      const text = res.content[0].type === 'text' ? res.content[0].text.trim() : null
      return text
    } catch (err) {
      const isModelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!isModelError) return null
    }
  }
  return null
}

// Save a parent's response to today's reflective question
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { question, response } = await request.json()
  if (!question?.trim()) return NextResponse.json({ error: 'question is required' }, { status: 400 })

  const today = new Date().toISOString().split('T')[0]

  const [childResult] = await Promise.all([
    supabase.from('children').select('id, name, age_band').eq('parent_id', user.id).eq('is_primary', true).single(),
  ])
  const child = childResult.data

  const { error } = await supabase
    .from('digi_feedback')
    .upsert({
      user_id: user.id,
      child_id: child?.id ?? null,
      feedback_date: today,
      question: question.trim(),
      parent_response: response?.trim() ?? null,
      responded_at: response?.trim() ? new Date().toISOString() : null,
    }, { onConflict: 'user_id,feedback_date' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Generate and save a DiGi insight for tomorrow's dashboard (best-effort, ~4s timeout)
  if (response?.trim()) {
    const insight = await generateInsight(question.trim(), response.trim(), child?.name ?? null, child?.age_band ?? null)
    if (insight) {
      await supabase.from('digi_feedback').update({ digi_insight: insight }).eq('user_id', user.id).eq('feedback_date', today)
    }
  }

  return NextResponse.json({ ok: true })
}

// Return today's pending feedback question (if any)
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('digi_feedback')
    .select('question, parent_response, responded_at')
    .eq('user_id', user.id)
    .eq('feedback_date', today)
    .single()

  return NextResponse.json(data ?? null)
}
