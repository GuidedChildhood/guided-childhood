import type { createClient } from '@/lib/supabase/server'
import { getStageProgress, type StageId } from '@/lib/pathway/progress'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

// DiGi's brain: retrieval over the expert knowledge corpus, the family
// memory DiGi saves between conversations, and the trigger rules that make
// DiGi proactive instead of only reactive.

// The words a parent actually types, mapped to the topics a finding is tagged
// with. Scoring is a literal substring match, so anything missing here is a
// question the library cannot answer however well stocked it is.
//
// Grown from the original fifteen after the obvious gap: not one platform a
// child under thirteen actually uses was in it, and none of the ordinary words
// a worried parent reaches for. "Down", "quiet" and "withdrawn" are how people
// describe low mood; almost nobody types "mood".
const WORD_TO_TOPIC: Record<string, string> = {
  // Feeling, in the words people use
  anxious: 'anxiety', anxiety: 'anxiety', worried: 'anxiety', worry: 'anxiety',
  panic: 'anxiety', nervous: 'anxiety',
  sad: 'mood', down: 'mood', low: 'mood', mood: 'mood', tearful: 'mood',
  quiet: 'mood', withdrawn: 'mood', miserable: 'mood', meltdown: 'mood',
  angry: 'mood', 'lost it': 'mood',
  confidence: 'self_esteem', 'self esteem': 'self_esteem', ugly: 'self_esteem',
  comparing: 'self_esteem', 'left out': 'friendships', lonely: 'friendships',
  friends: 'friendships', friendship: 'friendships', fallen: 'friendships',
  // Platforms, which is how a parent names the problem
  tiktok: 'social_media', instagram: 'social_media', snapchat: 'social_media',
  snap: 'social_media', 'social media': 'social_media', youtube: 'social_media',
  whatsapp: 'social_media', discord: 'social_media', reddit: 'social_media',
  roblox: 'gaming', minecraft: 'gaming', fortnite: 'gaming', xbox: 'gaming',
  playstation: 'gaming', switch: 'gaming', gaming: 'gaming', game: 'gaming',
  // Devices and time
  phone: 'screen_time', ipad: 'screen_time', tablet: 'screen_time',
  screen: 'screen_time', 'screen time': 'screen_time', laptop: 'screen_time',
  // The day
  sleep: 'sleep', bedtime: 'sleep', tired: 'sleep', 'wont sleep': 'sleep',
  'school run': 'routines', homework: 'routines', morning: 'routines',
  routine: 'routines',
  // Safety, and the ones that must never be missed
  'self harm': 'crisis', suicide: 'crisis', 'hurt themselves': 'crisis',
  bullying: 'safety', bullied: 'safety', stranger: 'safety', grooming: 'safety',
  porn: 'safety', nudes: 'safety', scam: 'safety',
  scared: 'trauma', frightened: 'trauma',
  // "nightmares" and not "nightmare". The singular is how people describe an
  // ordinary bad morning ("the school run is a nightmare") and it was pulling
  // trauma findings into a question about routines. The plural is almost always
  // literal.
  nightmares: 'trauma',
}

export type KnowledgeRow = {
  source_name: string
  finding: string
  topics: string[]
  age_bands: string[]
}

/**
 * Search the research bank by meaning.
 *
 * This is the half of the brain that was missing. digi_memory has understood
 * what a parent MEANT since migration 45; expert_knowledge was matched against a
 * hand maintained list of about seventy words, so a finding was reachable only
 * if the parent happened to type one of them.
 *
 * Also exported on its own because it is what the search_knowledge tool calls.
 * The pre packed retrieval below is DiGi being handed six findings we guessed at.
 * This is DiGi going and looking for what it decided it needs, which is the
 * difference between a system that retrieves and one that searches.
 *
 * Returns [] on anything going wrong, including no EMBEDDING_API_KEY. Every
 * caller has a keyword path to fall back to.
 */
export async function searchKnowledge(
  supabase: SupabaseClient,
  query: string,
  ageBand: string | null,
  limit = 6,
): Promise<KnowledgeRow[]> {
  if (!query.trim()) return []
  try {
    const { embedText } = await import('@/lib/digi/embeddings')
    const vector = await embedText(query, 'query')
    if (!vector) return []
    const { data } = await supabase.rpc('match_expert_knowledge', {
      query_embedding: vector,
      match_count: limit,
      band: ageBand,
    })
    return (data ?? []) as KnowledgeRow[]
  } catch {
    return [] // semantic search is an upgrade, never a dependency
  }
}

export async function getExpertKnowledge(
  supabase: SupabaseClient,
  ageBand: string | null,
  userMessage: string,
  limit = 6
): Promise<string> {
  // Hybrid, the same shape getFamilyMemory has used all along: meaning leads,
  // keywords fill in. Semantic hits go first because they are the ones the
  // keyword map could never have found, and the keyword pass still contributes
  // the crisis rule and the exact topic matches that a vector can blur.
  const [semantic, allRows] = await Promise.all([
    searchKnowledge(supabase, userMessage, ageBand, limit),
    supabase
      .from('expert_knowledge')
      .select('source_name, finding, topics, age_bands')
      .eq('active', true),
  ])

  const data = allRows.data

  if (semantic.length > 0) {
    const seen = new Set(semantic.map(s => s.finding))
    const keyword = data ? scoreByKeyword(data as KnowledgeRow[], ageBand, userMessage, limit) : []
    const merged = [...semantic, ...keyword.filter(k => !seen.has(k.finding))].slice(0, limit)
    return renderKnowledge(merged)
  }

  if (!data || data.length === 0) return ''
  return renderKnowledge(scoreByKeyword(data as KnowledgeRow[], ageBand, userMessage, limit))
}

/**
 * The keyword pass, unchanged in behaviour and now reusable.
 *
 * Cheap relevance: age band match plus topic keyword overlap with the message.
 * Crisis guidance always qualifies so signposting never misses.
 *
 * It stays even now that meaning search exists, for two reasons. It is the only
 * path when EMBEDDING_API_KEY is absent or a row has not been embedded yet, and
 * it catches the exact things a vector blurs: the crisis bump, and a literal
 * topic match a similarity score would rank merely close.
 */
function scoreByKeyword(
  rows: KnowledgeRow[],
  ageBand: string | null,
  userMessage: string,
  limit: number,
): KnowledgeRow[] {
  const msg = userMessage.toLowerCase()
  const scored = rows.map(k => {
    let score = 0
    if (!ageBand || k.age_bands.length === 0 || k.age_bands.includes(ageBand)) score += 1
    else score -= 2
    for (const t of k.topics) {
      if (t === 'crisis') score += 1
      if (msg.includes(t.replace('_', ' ')) || msg.includes(t.replace('_', ''))) score += 2
    }
    for (const word of Object.keys(WORD_TO_TOPIC)) {
      if (msg.includes(word)) {
        const topic = WORD_TO_TOPIC[word] ?? word
        if (k.topics.includes(topic)) score += 2
      }
    }
    return { k, score }
  })

  const ranked = scored.sort((a, b) => b.score - a.score)
  let top = ranked.slice(0, limit).filter(s => s.score > 0)

  // The floor.
  //
  // Every finding scoring zero used to mean an EMPTY STRING, silently, and an
  // answer built on no research at all looked identical to one built on six.
  // The keyword match is literal, so "she has been really down since she got
  // Snapchat" matched nothing at all before the map above grew, and a full
  // library still handed DiGi nothing.
  //
  // So when nothing scores, fall back to whatever is age appropriate rather
  // than to silence. A general finding for the right age is a far better floor
  // than none, and it means the claim that DiGi answers from research is true
  // of every answer rather than most of them.
  if (top.length === 0) {
    top = ranked
      .filter(s => !ageBand || s.k.age_bands.length === 0 || s.k.age_bands.includes(ageBand))
      .slice(0, 2)
  }
  return top.map(s => s.k)
}

function renderKnowledge(rows: KnowledgeRow[]): string {
  if (rows.length === 0) return ''
  return '\n\nEXPERT KNOWLEDGE BASE (cite the source by name when you use one of these):\n' +
    rows.map(k => `- ${k.source_name}: ${k.finding}`).join('\n')
}

export type MemoryRow = { kind: string; content: string; created_at: string }

// A memory's weight by kind: a concern or a win about the family carries more
// than a passing observation, so it stays in view longer.
const MEMORY_KIND_WEIGHT: Record<string, number> = {
  concern: 3, win: 3, preference: 2, context: 2, observation: 1.5,
}

// Pure so it can be tested and reasoned about. A memory rises on three signals
// blended together: it matches the words of what the parent just asked, it is
// a weightier kind, and it is recent. The point is to surface the memory that
// matters for THIS question, not just the newest rows. `now` is passed in so
// the ranking is deterministic in tests.
export function rankMemories(
  rows: MemoryRow[],
  message: string,
  now: number,
  limit = 12,
): MemoryRow[] {
  const words = new Set(
    message.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 3)
  )
  const scored = rows.map((m, i) => {
    let score = MEMORY_KIND_WEIGHT[m.kind] ?? 1
    const ageDays = (now - new Date(m.created_at).getTime()) / 86_400_000
    score += Math.max(0, 3 - ageDays / 20) // about 3 today, fading to 0 by 60 days
    const content = m.content.toLowerCase()
    let overlap = 0
    for (const w of words) if (content.includes(w)) overlap++
    score += overlap * 2.5
    return { m, score, i }
  })
  // Sort by score, breaking ties by original order (newest first from the query).
  return scored
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, limit)
    .map(s => s.m)
}

export async function getFamilyMemory(
  supabase: SupabaseClient,
  userId: string,
  message = '',
  limit = 12
): Promise<string> {
  // Hybrid retrieval. When embeddings are configured, the question is embedded
  // and the memories nearest in MEANING come back through match_digi_memory
  // (locked to this user inside the function). Those candidates then still go
  // through rankMemories, so kind weight, recency and word overlap all keep
  // their say. Any failure, or no key, falls straight back to the recent
  // window plus keyword ranking that has worked all along.
  const { embedText } = await import('@/lib/digi/embeddings')

  const [recentResult, queryEmbedding] = await Promise.all([
    supabase
      .from('digi_memory')
      .select('kind, content, created_at')
      .eq('user_id', userId)
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(60),
    message.trim() ? embedText(message, 'query') : Promise.resolve(null),
  ])

  const recent = (recentResult.data ?? []) as MemoryRow[]

  let candidates: MemoryRow[] = recent
  if (queryEmbedding) {
    try {
      const { data: semantic } = await supabase.rpc('match_digi_memory', {
        query_embedding: queryEmbedding,
        match_count: 20,
      })
      if (semantic && semantic.length > 0) {
        // Merge by content so a memory found both ways appears once. Semantic
        // hits lead, the recent window fills in what meaning search missed
        // (brand new rows may not be embedded yet).
        const seen = new Set<string>()
        candidates = []
        for (const m of [...(semantic as MemoryRow[]), ...recent]) {
          if (seen.has(m.content)) continue
          seen.add(m.content)
          candidates.push({ kind: m.kind, content: m.content, created_at: m.created_at })
        }
      }
    } catch { /* semantic search is an upgrade, never a dependency */ }
  }

  if (candidates.length === 0) return ''

  const ranked = rankMemories(candidates, message, Date.now(), limit)
  return '\n\nWHAT YOU REMEMBER ABOUT THIS FAMILY (the most relevant to what they just asked, from previous conversations and check ins, use naturally, never recite as a list):\n' +
    ranked.map(m => `- [${m.kind}] ${m.content}`).join('\n')
}

// What has already worked for this family: the concerns they have turned
// around. DiGi sees open concerns and scripts tried elsewhere, but never the
// wins, so it cannot build on them. Surfacing the real turnarounds lets DiGi
// remind a parent they have done hard things before and lean on what worked,
// which is the difference between advice and a coach who knows your track
// record. Encouragement only, never pressure.
export async function getWhatWorked(
  supabase: SupabaseClient,
  userId: string,
  limit = 8
): Promise<string> {
  const { data } = await supabase
    .from('concerns')
    .select('label, status, last_flagged_at')
    .eq('user_id', userId)
    .in('status', ['resolved', 'improving'])
    .order('last_flagged_at', { ascending: false })
    .limit(limit)

  if (!data || data.length === 0) return ''

  return '\n\nWHAT HAS ALREADY WORKED FOR THIS FAMILY (real wins they have earned, lean on these to build momentum and remind them they can do this, never as pressure or a to do list):\n' +
    data.map(c => `- ${c.label}: ${c.status === 'resolved' ? 'sorted' : 'getting better'}`).join('\n')
}

// Where this family stands on the road to 16, from the same per stage blend the
// passport and the road read, so DiGi's chat, the passport and the pathway all
// speak from one truth. DiGi gets the stage, how full the current stamp is, what
// still fills it, and the single most useful next step, so it can always point
// forward to one concrete thing rather than leaving a parent unsure. The daily
// habit is reported but never offered as "the next step", because it can only
// move over weeks, not in today's session.
export async function getPathwayPosition(
  supabase: SupabaseClient,
  userId: string,
  stage: { id: number; name: string; ages: string; stageId: StageId },
  streakWeeks: number,
): Promise<string> {
  let p
  try {
    p = await getStageProgress(supabase, userId, stage.stageId, streakWeeks)
  } catch {
    return '' // pathway position is an anchor, never a hard dependency of the reply
  }

  const lessonsDetail = p.lessonsTotal > 0 ? `${p.lessonsDone} of ${p.lessonsTotal} done` : `${p.lessonsPct}%`
  const actionable = [
    { label: 'the stage lessons', pct: p.lessonsPct, href: `/dashboard/lessons?stage=${stage.id}`, detail: lessonsDetail },
    { label: 'the word for word scripts', pct: p.scriptsPct, href: '/dashboard/scripts', detail: `${p.scriptsPct}%` },
    { label: 'the device setup', pct: p.devicesPct, href: '/dashboard/devices', detail: `${p.devicesPct}%` },
  ].filter(t => t.pct < 100).sort((a, b) => a.pct - b.pct)
  const next = actionable[0]

  const nextLine = p.contentComplete
    ? 'The lessons and scripts that fill this stamp are all done. If they have not seen it celebrated yet, point them warmly at the passport to see the stamp, and gently open the next stage.'
    : next
      ? `The single best next step to fill the ${stage.name} stamp right now is ${next.label} (${next.detail}). When they ask what to do next, or the conversation allows, name this one step and link it exactly as [${next.label}](${next.href}).`
      : 'The stamp is close. Point them at the passport to see the one task left.'

  return `\n\nWHERE THIS FAMILY IS ON THE ROAD TO 16 (their anchor: always know it, and point forward to the ONE next concrete step so they are never left unsure what to do):
- Stage ${stage.id} of 5, ${stage.name} (${stage.ages}). The ${stage.name} stamp is ${p.overallPct}% filled.
- What fills this stamp: lessons ${lessonsDetail}, scripts ${p.scriptsPct}%, devices ${p.devicesPct}%, daily habit ${streakWeeks} of 4 weeks.
- ${nextLine}
Keep it to one calibrated next step, never a to do list, never pressure, never guilt.`
}

export interface ProactiveTrigger {
  kind: 'watch_for' | 'tip' | 'parent_care' | 'celebration'
  reason: string
}

// The verbatim reason that marks a prompt as a share nudge: DiGi inviting the
// parent to open Lessons and send a printable or lesson so the child earns
// stars. The route matches on this to deep link the prompt straight there.
export const SHARE_NUDGE_REASON = 'Routine cadence: nudge to share a printable or lesson so the child earns stars.'

// The verbatim reason for the young age phone flag: the balance report saw
// phone and social time this week for a child at an age where the guide keeps
// it near zero. The same signal the family wall and the passport now raise, so
// DiGi raises it in conversation too. The route matches on this to deep link
// straight to the balance page and to steer a warm, type not total framing.
export const PHONE_FLAG_REASON = 'The balance report saw phone and social time this week at an age where the guide is to keep it near zero. It is the type of screen, not the total, and it is worth a calm word.'

// Rules over real family data. Deliberately simple and inspectable: each
// returns the reason a prompt should exist, generation happens elsewhere.
export function findTriggers(
  checks: { week_start: string; mood_score: number | null; sleep_score: number | null; concern_level: string }[],
  streakWeeks: number,
  lastPromptAt: string | null,
  opts?: {
    phoneFlag?: boolean
    /**
     * Whether this call may add the routine cadence triggers, the daily life
     * tip and the parent care nudge. They are about the FAMILY, so when the
     * prompts route scans each child in turn, only the first scan carries
     * them. Without this flag a three child family got three copies of the
     * same tip, which reads as a broken app rather than a helpful one.
     * Defaults on, so every existing caller behaves exactly as before.
     */
    includeRoutine?: boolean
  }
): ProactiveTrigger[] {
  const triggers: ProactiveTrigger[] = []

  // The young age phone flag leads, because a child on the phone at an age we
  // keep near zero is the one balance signal worth raising ahead of the routine
  // cadence. Same signal as the family wall and the passport.
  if (opts?.phoneFlag) {
    triggers.push({ kind: 'watch_for', reason: PHONE_FLAG_REASON })
  }

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
  // half of the child's environment. On alternate days the tip becomes a
  // gentle nudge to share a printable or lesson so the child earns stars,
  // which keeps the star loop alive without ever being a chore.
  const stale = !lastPromptAt || (Date.now() - new Date(lastPromptAt).getTime()) > 3 * 24 * 60 * 60 * 1000
  if (stale && (opts?.includeRoutine ?? true)) {
    const shareTurn = Math.floor(Date.now() / 86_400_000) % 2 === 0
    triggers.push(shareTurn
      ? { kind: 'tip', reason: SHARE_NUDGE_REASON }
      : { kind: 'tip', reason: 'Routine cadence: no proactive prompt in the last three days.' })
    triggers.push({ kind: 'parent_care', reason: 'Routine cadence: parent wellbeing check due.' })
  }

  return triggers.slice(0, 2)
}
