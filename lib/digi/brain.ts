import type { createClient } from '@/lib/supabase/server'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

// DiGi's brain: retrieval over the expert knowledge corpus, the family
// memory DiGi saves between conversations, and the trigger rules that make
// DiGi proactive instead of only reactive.

export async function getExpertKnowledge(
  supabase: SupabaseClient,
  ageBand: string | null,
  userMessage: string,
  limit = 6
): Promise<string> {
  const { data } = await supabase
    .from('expert_knowledge')
    .select('source_name, finding, topics, age_bands')
    .eq('active', true)

  if (!data || data.length === 0) return ''

  // Cheap relevance: age band match plus topic keyword overlap with the
  // message. Crisis guidance always qualifies so signposting never misses.
  const msg = userMessage.toLowerCase()
  const scored = data.map(k => {
    let score = 0
    if (!ageBand || k.age_bands.length === 0 || k.age_bands.includes(ageBand)) score += 1
    else score -= 2
    for (const t of k.topics as string[]) {
      if (t === 'crisis') score += 1
      if (msg.includes(t.replace('_', ' ')) || msg.includes(t.replace('_', ''))) score += 2
    }
    for (const word of ['sleep', 'mood', 'anxious', 'anxiety', 'sad', 'gaming', 'tiktok', 'instagram', 'phone', 'school run', 'meltdown', 'self harm', 'bullying', 'scared', 'worried']) {
      if (msg.includes(word)) {
        const map: Record<string, string> = {
          anxious: 'anxiety', sad: 'mood', tiktok: 'social_media', instagram: 'social_media',
          phone: 'screen_time', 'school run': 'routines', meltdown: 'mood', 'self harm': 'crisis',
          bullying: 'safety', scared: 'trauma', worried: 'anxiety',
        }
        const topic = map[word] ?? word
        if ((k.topics as string[]).includes(topic)) score += 2
      }
    }
    return { k, score }
  })

  const top = scored.sort((a, b) => b.score - a.score).slice(0, limit).filter(s => s.score > 0)
  if (top.length === 0) return ''

  return '\n\nEXPERT KNOWLEDGE BASE (cite the source by name when you use one of these):\n' +
    top.map(s => `- ${s.k.source_name}: ${s.k.finding}`).join('\n')
}

export async function getFamilyMemory(
  supabase: SupabaseClient,
  userId: string,
  limit = 12
): Promise<string> {
  const { data } = await supabase
    .from('digi_memory')
    .select('kind, content, created_at')
    .eq('user_id', userId)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (!data || data.length === 0) return ''

  return '\n\nWHAT YOU REMEMBER ABOUT THIS FAMILY (from previous conversations and check ins, use naturally, never recite as a list):\n' +
    data.map(m => `- [${m.kind}] ${m.content}`).join('\n')
}

export interface ProactiveTrigger {
  kind: 'watch_for' | 'tip' | 'parent_care' | 'celebration'
  reason: string
}

// Rules over real family data. Deliberately simple and inspectable: each
// returns the reason a prompt should exist, generation happens elsewhere.
export function findTriggers(
  checks: { week_start: string; mood_score: number | null; sleep_score: number | null; concern_level: string }[],
  streakWeeks: number,
  lastPromptAt: string | null
): ProactiveTrigger[] {
  const triggers: ProactiveTrigger[] = []
  const recent = [...checks].sort((a, b) => b.week_start.localeCompare(a.week_start))

  if (recent.length >= 2) {
    const [latest, prev] = recent
    if ((latest.mood_score ?? 5) <= (prev.mood_score ?? 5) - 2) {
      triggers.push({ kind: 'watch_for', reason: `Mood score dropped from ${prev.mood_score} to ${latest.mood_score} between weekly check ins.` })
    }
    if ((latest.sleep_score ?? 5) <= 2 && (prev.sleep_score ?? 5) <= 2) {
      triggers.push({ kind: 'watch_for', reason: 'Sleep score has been low for two consecutive weekly check ins.' })
    }
  }
  if (recent[0] && (recent[0].concern_level === 'medium' || recent[0].concern_level === 'high')) {
    triggers.push({ kind: 'watch_for', reason: `Parent marked concern level ${recent[0].concern_level} at the latest check in.` })
  }
  if (streakWeeks > 0 && streakWeeks % 4 === 0) {
    triggers.push({ kind: 'celebration', reason: `${streakWeeks} week practice streak.` })
  }

  // A steady drumbeat even when nothing is wrong: one daily life tip, and
  // parent care roughly weekly, because the parent's own mental health is
  // half of the child's environment.
  const stale = !lastPromptAt || (Date.now() - new Date(lastPromptAt).getTime()) > 3 * 24 * 60 * 60 * 1000
  if (stale) {
    triggers.push({ kind: 'tip', reason: 'Routine cadence: no proactive prompt in the last three days.' })
    triggers.push({ kind: 'parent_care', reason: 'Routine cadence: parent wellbeing check due.' })
  }

  return triggers.slice(0, 2)
}
