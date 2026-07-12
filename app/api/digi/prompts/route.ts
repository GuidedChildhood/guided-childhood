import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { digiModelsFor } from '@/lib/config/digi'
import { findTriggers } from '@/lib/digi/brain'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { hasFullAccess } from '@/lib/access'
import { getRecommendedScript } from '@/lib/pathway/recommend'
import { getStageProgress, type StageId } from '@/lib/pathway/progress'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder' })

async function createWithFallback(params: Omit<Anthropic.MessageCreateParamsNonStreaming, 'model'>) {
  const models = digiModelsFor('prompts')
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

  // DiGi knows the pathway: where this family stands on the road to 16, how
  // far through the stage they are, what they told us the problem was, what
  // keeps coming up, and the exact next script with their child's name on it.
  // This is what turns a generic tip into a prompt that reads like it was
  // written by someone walking beside them.
  const stage = child.age_band ? getStageFromAgeBand(child.age_band as AgeBand) : null
  const { data: profile } = await supabase
    .from('profiles').select('onboarding_answers, subscription_status, trial_ends_at').eq('id', user.id).maybeSingle()
  const challenge = (profile?.onboarding_answers as Record<string, string> | null)?.challenge ?? null

  const [{ data: knowledge }, { data: memory }, { data: concerns }, progress, recommended] = await Promise.all([
    supabase.from('expert_knowledge').select('source_name, finding').eq('active', true).limit(24),
    supabase.from('digi_memory').select('kind, content').eq('user_id', user.id).eq('active', true).order('created_at', { ascending: false }).limit(8),
    supabase.from('concerns').select('label, status, times_flagged').eq('user_id', user.id).in('status', ['open', 'improving']).order('last_flagged_at', { ascending: false }).limit(3),
    child.stage_id
      ? getStageProgress(supabase, user.id, child.stage_id as StageId, child.streak_weeks ?? 0).catch(() => null)
      : Promise.resolve(null),
    child.stage_id
      ? getRecommendedScript(supabase, user.id, child.stage_id as StageId, (challenge as never) ?? null, { preferFree: !hasFullAccess(profile, user.email) }).catch(() => null)
      : Promise.resolve(null),
  ])

  const pathwayContext = [
    stage ? `Stage ${stage.id} of 5, ${stage.name} (${stage.ages}).` : null,
    progress ? `${progress.overallPct}% of the way through this stage.` : null,
    (child.streak_weeks ?? 0) > 0 ? `${child.streak_weeks} week streak on the pathway.` : null,
    challenge ? `The problem they signed up with: ${String(challenge).replace(/_/g, ' ')}.` : null,
    (concerns ?? []).length > 0
      ? `Live concerns they keep flagging: ${(concerns ?? []).map(c => `${c.label} (${c.status === 'improving' ? 'getting better' : 'still open'}, flagged ${c.times_flagged}x)`).join('; ')}.`
      : null,
    recommended ? `The exact next script on their pathway: "${recommended.title}" (${recommended.situation}).` : null,
  ].filter(Boolean).join('\n')

  try {
    const response = await createWithFallback({
      max_tokens: 900,
      messages: [{
        role: 'user',
        content: `You are DiGi, the warm and evidence grounded parenting guide inside Guided Childhood. Write ${triggers.length} short proactive prompts for this parent, one per trigger below. Each prompt is a small card the parent sees on their dashboard before they ask anything.

Child: ${child.name}, age band ${child.age_band}.

WHERE THIS FAMILY IS ON THE PATHWAY (you know their road, use it: name the stage, the progress, the concern, or the exact next script by title when it makes the prompt land harder, so the parent feels you genuinely know where they are):
${pathwayContext || 'Just getting started.'}

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
