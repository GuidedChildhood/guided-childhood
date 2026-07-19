import type { createClient } from '@/lib/supabase/server'
import { literacyAreaFor } from '@/lib/content/literacy'
import { STAR_MINUTES } from '@/lib/quests/templates'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

// One live reading per literacy strand, computed once and shown everywhere,
// the home strip, the pathway page and the progress tab, so the passport and
// every tracker always agree. Green is on track, red is worth a look, and the
// note carries the real numbers so the status is proof, not decoration.
export type AreaStatus = { tone: 'green' | 'red'; label: string; note?: string }

export async function getLiteracyStatuses(supabase: SupabaseClient, userId: string): Promise<Record<string, AreaStatus>> {
  const now = new Date()
  const day = (now.getUTCDay() + 6) % 7
  const monday = new Date(now); monday.setUTCDate(now.getUTCDate() - day)
  const weekStart = monday.toISOString().slice(0, 10)

  const [ticksRes, questsRes, spendsRes, concernsRes, lessonsRes, doneRes] = await Promise.all([
    supabase.from('quest_ticks').select('quest_id').eq('user_id', userId).eq('status', 'approved').gte('tick_date', weekStart),
    supabase.from('family_quests').select('id, stars').eq('user_id', userId),
    supabase.from('star_spends').select('minutes').eq('user_id', userId).gte('created_at', `${weekStart}T00:00:00Z`),
    supabase.from('concerns').select('id').eq('user_id', userId).in('status', ['open', 'improving']),
    supabase.from('lessons').select('id, category'),
    supabase.from('lesson_completions').select('lesson_id').eq('user_id', userId),
  ])

  const starsOf = new Map((questsRes.data ?? []).map(q => [q.id, q.stars ?? 1]))
  const earnedMins = (ticksRes.data ?? []).reduce((s, t) => s + (starsOf.get(t.quest_id) ?? 1), 0) * STAR_MINUTES
  const usedMins = (spendsRes.data ?? []).reduce((s, x) => s + (Number(x.minutes) || 0), 0)
  const healthy = usedMins === 0 || usedMins <= earnedMins
  const worries = (concernsRes.data ?? []).length
  const doneIds = new Set((doneRes.data ?? []).map(d => d.lesson_id))
  const doneByArea = new Map<string, number>()
  for (const l of lessonsRes.data ?? []) {
    if (!doneIds.has(l.id)) continue
    const a = literacyAreaFor(l.category)
    if (a) doneByArea.set(a.key, (doneByArea.get(a.key) ?? 0) + 1)
  }
  const lessonNote = (k: string, fallback: string) => {
    const n = doneByArea.get(k) ?? 0
    return n > 0 ? `${n} lesson${n === 1 ? '' : 's'} done. ${fallback}` : fallback
  }

  const statuses: Record<string, AreaStatus> = {
    balance: healthy
      ? { tone: 'green', label: 'In balance', note: lessonNote('balance', `Jobs earned ${earnedMins} min this week, ${usedMins} min used. A healthy balance.`) }
      : { tone: 'red', label: 'Screen ahead', note: lessonNote('balance', `${usedMins} min used against ${earnedMins} min earned this week. A few jobs brings it back.`) },
    safe: worries === 0
      ? { tone: 'green', label: 'Steady', note: lessonNote('safe', 'No open worries. DiGi keeps asking gently along the way.') }
      : { tone: 'red', label: `${worries} to watch`, note: lessonNote('safe', `Working through ${worries} open worr${worries === 1 ? 'y' : 'ies'} together. That is the system doing its job.`) },
  }
  for (const k of ['ai', 'social'] as const) {
    const n = doneByArea.get(k) ?? 0
    if (n > 0) statuses[k] = { tone: 'green', label: 'Building now', note: `${n} lesson${n === 1 ? '' : 's'} done and counting.` }
  }
  return statuses
}
