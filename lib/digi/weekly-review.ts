import { createAdminClient } from '@/lib/supabase/admin'
import { firstText } from '@/lib/digi/text'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { ROUTINE_PACKS } from '@/lib/quests/routines'
import { STAR_MINUTES } from '@/lib/quests/templates'
import Anthropic from '@anthropic-ai/sdk'

// The Sunday DiGi weekly review. Reads one family's own week off the tables the
// star economy already writes, then hands the parent a short warm note, one
// gentle watch-for, and one concrete thing to set up for next week. The stats
// are the family's own; nothing is shared or compared. The tone stands beside
// the parent and never shames a quiet week.

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
  timeout: 60_000,
  maxRetries: 1,
})

export type WeekStats = {
  children: string[]
  questsApproved: number
  starsEarned: number
  starsSpent: number
  deviceMinutes: number
  activeDays: number
  topQuest: string | null
  schoolOpen: number
}

export type WeeklyReview = {
  week_start: string
  stats: WeekStats
  summary: string
  watch_for: string | null
  suggestion: string | null
  suggestion_routine: string | null
}

// The Monday that starts the week containing `d` (UK weeks start Monday).
function mondayOf(d: Date): string {
  const day = d.getUTCDay() // 0 Sun .. 6 Sat
  const back = (day + 6) % 7 // days since Monday
  const mon = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - back))
  return mon.toISOString().slice(0, 10)
}

async function gatherWeek(userId: string, weekStart: string): Promise<WeekStats> {
  const admin = createAdminClient()
  const start = new Date(`${weekStart}T00:00:00.000Z`)
  const startIso = start.toISOString()
  const endIso = new Date(start.getTime() + 7 * 86_400_000).toISOString()

  const [childRes, ticksRes, questsRes, spendsRes, schoolRes] = await Promise.all([
    admin.from('children').select('name').eq('parent_id', userId),
    admin.from('quest_ticks').select('quest_id, tick_date, status')
      .eq('user_id', userId).eq('status', 'approved')
      .gte('tick_date', weekStart).lt('tick_date', endIso.slice(0, 10)),
    admin.from('family_quests').select('id, title, stars').eq('user_id', userId),
    admin.from('star_spends').select('minutes, stars, created_at')
      .eq('user_id', userId).gte('created_at', startIso).lt('created_at', endIso),
    admin.from('school_actions').select('id').eq('user_id', userId).eq('status', 'open'),
  ])

  const questById = new Map((questsRes.data ?? []).map(q => [q.id, q]))
  const ticks = ticksRes.data ?? []
  const starsEarned = ticks.reduce((s, t) => s + (questById.get(t.quest_id)?.stars ?? 1), 0)
  const activeDays = new Set(ticks.map(t => String(t.tick_date))).size

  // The quest they leaned on most this week.
  const counts = new Map<string, number>()
  for (const t of ticks) {
    const title = questById.get(t.quest_id)?.title
    if (title) counts.set(title, (counts.get(title) ?? 0) + 1)
  }
  let topQuest: string | null = null
  let topN = 0
  for (const [title, n] of counts) if (n > topN) { topN = n; topQuest = title }

  const spends = spendsRes.data ?? []
  return {
    children: (childRes.data ?? []).map(c => c.name),
    questsApproved: ticks.length,
    starsEarned,
    starsSpent: spends.reduce((s, x) => s + (Number(x.stars) || 0), 0),
    deviceMinutes: spends.reduce((s, x) => s + (Number(x.minutes) || 0), 0),
    activeDays,
    topQuest,
    schoolOpen: (schoolRes.data ?? []).length,
  }
}

// A warm, honest fallback so the review always says something, even with no
// model key. Plain, no dashes, JP's voice.
function templateReview(stats: WeekStats): Omit<WeeklyReview, 'week_start' | 'stats'> {
  const kid = stats.children[0] ?? 'your child'
  if (stats.questsApproved === 0) {
    return {
      summary: `A quiet week on quests, and that is completely fine. Some weeks are just full. When you have a spare minute, one or two quests set for ${kid} is enough to get the stars flowing again.`,
      watch_for: null,
      suggestion: 'Add a small routine to make next week feel automatic.',
      suggestion_routine: 'after-school',
    }
  }
  const mins = stats.starsEarned * STAR_MINUTES
  const parts: string[] = []
  parts.push(`Good week. ${stats.questsApproved} quest${stats.questsApproved === 1 ? '' : 's'} done across ${stats.activeDays} day${stats.activeDays === 1 ? '' : 's'}, and ${stats.starsEarned} stars earned, that is ${mins} minutes of screen time worked for rather than just given.`)
  if (stats.topQuest) parts.push(`${kid} leaned into "${stats.topQuest}" the most.`)
  const watch = stats.deviceMinutes > mins + 60
    ? 'A little more screen time went out than was earned this week. No alarm, just worth a glance so the deal stays real.'
    : null
  return {
    summary: parts.join(' '),
    watch_for: watch,
    suggestion: 'Lock in the habit with a ready made routine for next week.',
    suggestion_routine: 'bedtime',
  }
}

async function generateReview(stats: WeekStats): Promise<Omit<WeeklyReview, 'week_start' | 'stats'>> {
  if (!process.env.ANTHROPIC_API_KEY) return templateReview(stats)

  const routineList = ROUTINE_PACKS.map(p => `${p.key} (${p.name})`).join(', ')
  const prompt = `You are DiGi, the calm, warm guide inside Guided Childhood, writing a family's private Sunday weekly review for the parent. Voice: warm, plain, direct, British, encouraging, never preachy, no AI-isms. Hard rule: never use a dash of any kind in the text, not even a hyphen between words. Never shame a quiet week. This stands beside the parent, it is not a report card on the child.

This family's week (their own numbers, nothing compared to anyone else):
- Children: ${stats.children.join(', ') || 'one child'}
- Quests approved: ${stats.questsApproved}
- Active days: ${stats.activeDays} of 7
- Stars earned: ${stats.starsEarned} (worth ${stats.starsEarned * STAR_MINUTES} minutes)
- Screen minutes spent: ${stats.deviceMinutes}
- Most done quest: ${stats.topQuest ?? 'none yet'}
- Open school reminders: ${stats.schoolOpen}

Available routines to suggest for next week (use the key): ${routineList}

Return ONLY compact JSON, no prose around it:
{"summary":"2 to 3 warm sentences on how the week went, specific to these numbers","watch_for":"one gentle, optional thing worth a glance, or null if nothing","suggestion":"one short concrete thing to set up for next week","suggestion_routine":"one routine key from the list that best fits, or null"}`

  const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  for (const model of models) {
    try {
      const msg = await anthropic.messages.create({ model, max_tokens: 700, messages: [{ role: 'user', content: prompt }] })
      const raw = firstText(msg)
      const json = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)
      const parsed = JSON.parse(json) as Partial<Omit<WeeklyReview, 'week_start' | 'stats'>>
      const validRoutine = ROUTINE_PACKS.some(p => p.key === parsed.suggestion_routine)
      return {
        summary: (parsed.summary ?? '').trim() || templateReview(stats).summary,
        watch_for: parsed.watch_for?.trim() || null,
        suggestion: parsed.suggestion?.trim() || null,
        suggestion_routine: validRoutine ? parsed.suggestion_routine! : null,
      }
    } catch (err) {
      const modelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!modelError) break
    }
  }
  return templateReview(stats)
}

// Build (or rebuild) this week's review for one family and store it. Idempotent
// on (user_id, week_start): a re-run refreshes the same row rather than adding.
export async function buildWeeklyReview(userId: string, now = new Date()): Promise<WeeklyReview> {
  const weekStart = mondayOf(now)
  const stats = await gatherWeek(userId, weekStart)
  const body = await generateReview(stats)
  const review: WeeklyReview = { week_start: weekStart, stats, ...body }

  const admin = createAdminClient()
  await admin.from('digi_weekly_reviews').upsert({
    user_id: userId,
    week_start: weekStart,
    stats: review.stats,
    summary: review.summary,
    watch_for: review.watch_for,
    suggestion: review.suggestion,
    suggestion_routine: review.suggestion_routine,
    status: 'unread',
  }, { onConflict: 'user_id,week_start' })

  return review
}
