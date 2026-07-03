import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { findTriggers } from '@/lib/digi/brain'

export const maxDuration = 300

// The full Duolingo loop: every morning DiGi thinks about each engaged
// family (those with push subscriptions), and if their real data has
// tripped a trigger, writes a grounded prompt and pushes it to the phone.
// Capped per run so cost stays bounded and inspectable.

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const USER_CAP = 200

async function generate(child: { name: string; age_band: string | null }, triggers: { kind: string; reason: string }[], knowledge: string, memory: string) {
  const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  for (const model of models) {
    try {
      const res = await anthropic.messages.create({
        model,
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `You are DiGi, the warm evidence grounded parenting guide. Write ONE short proactive prompt card for this parent based on the first trigger. Child: ${child.name}, age band ${child.age_band}. Trigger: kind=${triggers[0].kind}: ${triggers[0].reason}\nFamily memory:\n${memory || 'nothing yet'}\nKnowledge you may cite by source name:\n${knowledge}\nRules: warm, plain, no alarmism, never diagnose, crisis always routes to a human (GP, NHS 111, Childline 0800 1111). No dashes. Return ONLY JSON: {"kind":"${triggers[0].kind}","title":"max 8 words","body":"2 to 3 sentences"}`,
        }],
      })
      const text = res.content.filter(b => b.type === 'text').map(b => (b as { text: string }).text).join('')
      const m = text.match(/\{[\s\S]*\}/)
      return m ? JSON.parse(m[0]) as { kind: string; title: string; body: string } : null
    } catch { /* next model */ }
  }
  return null
}

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY!)

  const { data: subs } = await supabase.from('push_subscriptions').select('user_id').limit(USER_CAP)
  const userIds = [...new Set((subs ?? []).map(s => s.user_id))]

  const { data: knowledgeRows } = await supabase.from('expert_knowledge').select('source_name, finding').eq('active', true).limit(24)
  const knowledge = (knowledgeRows ?? []).map(k => `- ${k.source_name}: ${k.finding}`).join('\n')

  let generated = 0, pushed = 0
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.guidedchildhood.co.uk'

  for (const userId of userIds) {
    try {
      const [{ data: pending }, { data: child }, { data: lastPrompt }] = await Promise.all([
        supabase.from('digi_prompts').select('id').eq('user_id', userId).eq('status', 'pending').limit(1),
        supabase.from('children').select('id, name, age_band, streak_weeks').eq('parent_id', userId).eq('is_primary', true).maybeSingle(),
        supabase.from('digi_prompts').select('created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      ])
      if ((pending ?? []).length > 0 || !child) continue

      const [{ data: checks }, { data: memoryRows }] = await Promise.all([
        supabase.from('wellbeing_checks').select('week_start, mood_score, sleep_score, concern_level').eq('child_id', child.id).order('week_start', { ascending: false }).limit(4),
        supabase.from('digi_memory').select('content').eq('user_id', userId).eq('active', true).order('created_at', { ascending: false }).limit(6),
      ])

      const triggers = findTriggers(checks ?? [], child.streak_weeks ?? 0, lastPrompt?.created_at ?? null)
      if (triggers.length === 0) continue

      const memory = (memoryRows ?? []).map(m => `- ${m.content}`).join('\n')
      const prompt = await generate(child, triggers, knowledge, memory)
      if (!prompt?.title) continue

      await supabase.from('digi_prompts').insert({
        user_id: userId, child_id: child.id, kind: triggers[0].kind,
        title: prompt.title.slice(0, 120), body: prompt.body.slice(0, 500), reason: triggers[0].reason,
      })
      generated++

      const res = await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
        body: JSON.stringify({ userId, title: 'DiGi has something for you', body: prompt.title, url: '/dashboard' }),
      })
      if (res.ok) pushed++
    } catch { /* one family failing never stops the run */ }
  }

  return NextResponse.json({ users: userIds.length, generated, pushed })
}
