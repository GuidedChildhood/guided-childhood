import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { findTriggers } from '@/lib/digi/brain'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder' })

async function createWithFallback(params: Omit<Anthropic.MessageCreateParamsNonStreaming, 'model'>) {
  const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  let lastError: unknown
  for (const model of models) {
    try {
      return await anthropic.messages.create({ ...params, model })
    } catch (e) { lastError = e }
  }
  throw lastError
}

// GET: the parent's pending proactive prompts. If the family's data has
// tripped a trigger and nothing is pending, DiGi writes fresh prompts first,
// grounded in the expert knowledge base and what it remembers. This runs on
// dashboard visits, so DiGi leads without needing the parent to ask.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const [{ data: pending }, { data: child }, { data: lastPrompt }] = await Promise.all([
    supabase.from('digi_prompts').select('id, kind, title, body, created_at').eq('user_id', user.id).eq('status', 'pending').order('created_at', { ascending: false }).limit(3),
    supabase.from('children').select('id, name, age_band, stage_id, streak_weeks').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
    supabase.from('digi_prompts').select('created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ])

  if ((pending ?? []).length > 0 || !child) {
    return NextResponse.json({ prompts: pending ?? [] })
  }

  const { data: checks } = await supabase
    .from('wellbeing_checks')
    .select('week_start, mood_score, sleep_score, concern_level')
    .eq('child_id', child.id)
    .order('week_start', { ascending: false })
    .limit(4)

  const triggers = findTriggers(checks ?? [], child.streak_weeks ?? 0, lastPrompt?.created_at ?? null)
  if (triggers.length === 0) return NextResponse.json({ prompts: [] })

  const [{ data: knowledge }, { data: memory }] = await Promise.all([
    supabase.from('expert_knowledge').select('source_name, finding').eq('active', true).limit(24),
    supabase.from('digi_memory').select('kind, content').eq('user_id', user.id).eq('active', true).order('created_at', { ascending: false }).limit(8),
  ])

  try {
    const response = await createWithFallback({
      max_tokens: 900,
      messages: [{
        role: 'user',
        content: `You are DiGi, the warm and evidence grounded parenting guide inside Guided Childhood. Write ${triggers.length} short proactive prompts for this parent, one per trigger below. Each prompt is a small card the parent sees on their dashboard before they ask anything.

Child: ${child.name}, age band ${child.age_band}.
Triggers:
${triggers.map((t, i) => `${i + 1}. kind=${t.kind}: ${t.reason}`).join('\n')}

What you remember about this family:
${(memory ?? []).map(m => `- ${m.content}`).join('\n') || '- nothing yet'}

Expert knowledge you may draw on (cite the source name inside the body when used):
${(knowledge ?? []).map(k => `- ${k.source_name}: ${k.finding}`).join('\n')}

Rules: warm, plain, direct, no alarmism, never diagnose. watch_for prompts describe one concrete thing to notice this week and one gentle action. tip prompts give one small daily life improvement (school run conversations, mealtimes, bedtime handover). parent_care prompts are about the parent's own wellbeing, permission giving in tone. celebration prompts are short and genuinely warm. If anything suggests crisis, the action is always a human: GP, NHS 111, Childline 0800 1111. No dashes in the text. Return ONLY a JSON array: [{"kind":"...","title":"max 8 words","body":"2 to 3 sentences","reason":"the trigger reason verbatim"}]`,
      }],
    })

    const text = response.content.filter(b => b.type === 'text').map(b => (b as { text: string }).text).join('')
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) return NextResponse.json({ prompts: [] })
    const items = JSON.parse(match[0]) as { kind: string; title: string; body: string; reason: string }[]

    const rows = items
      .filter(p => ['watch_for', 'tip', 'parent_care', 'new_research', 'celebration'].includes(p.kind))
      .slice(0, 2)
      .map(p => ({ user_id: user.id, child_id: child.id, kind: p.kind, title: p.title, body: p.body, reason: p.reason }))

    if (rows.length > 0) await supabase.from('digi_prompts').insert(rows)

    const { data: fresh } = await supabase
      .from('digi_prompts').select('id, kind, title, body, created_at')
      .eq('user_id', user.id).eq('status', 'pending')
      .order('created_at', { ascending: false }).limit(3)
    return NextResponse.json({ prompts: fresh ?? [] })
  } catch {
    return NextResponse.json({ prompts: [] })
  }
}

// PATCH: mark a prompt seen, dismissed or acted.
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  if (!id || !['seen', 'dismissed', 'acted'].includes(status)) {
    return NextResponse.json({ error: 'missing or invalid id / status' }, { status: 400 })
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase.from('digi_prompts').update({ status }).eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
