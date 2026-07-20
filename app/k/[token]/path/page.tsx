import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { readinessForAgeBand } from '@/lib/content/readiness'
import { freeLessonIds } from '@/lib/content/lesson-access'
import { hasFullAccess } from '@/lib/access'
import { getStarBanks } from '@/lib/quests/bank'
import { getMinutesUsedToday } from '@/lib/quests/usage'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'
import { gamesForStage } from '@/lib/quest-games/registry'
import { quizForBand } from '@/lib/content/school-quizzes'
import KidPath, { type PathLesson, type PathGame, type PathJob } from '@/components/kid/KidPath'

// My path: the child's own Duolingo style trail for their stage, opened from
// the My road tile. Token scoped like every kid surface; the reads mirror the
// kid lessons page so the path and the list can never disagree on what is
// passed, and everything new fails soft.

export const dynamic = 'force-dynamic'

const CATEGORY_EMOJI: Record<string, string> = {
  safety: '🛡️', screen_habits: '📱', wellbeing: '💛',
  online_risks: '🔍', ai_safety: '🤖', ai_literacy: '🤖',
}

export default async function KidPathPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) notFound()

  const { data: child } = await supabase
    .from('children')
    .select('name, age_band, daily_limit_minutes')
    .eq('id', link.child_id)
    .maybeSingle()
  const ageBand = (child?.age_band as AgeBand | null) ?? '8-10'
  const stage = getStageFromAgeBand(ageBand)
  const readiness = readinessForAgeBand(ageBand)

  const today = new Date().toISOString().slice(0, 10)
  const [lessonsRes, completionsRes, parentProfileRes, ticksRes, banks, usedTodayMap, questsRes] = await Promise.all([
    supabase.from('lessons')
      .select('id, stage_id, category, title, sort_order')
      .eq('audience', 'parent').neq('status', 'stub')
      .order('sort_order', { ascending: true }),
    supabase.from('lesson_completions')
      .select('lesson_id, passed, score')
      .eq('user_id', link.user_id).eq('lesson_source', 'lesson'),
    supabase.from('profiles')
      .select('subscription_status, trial_ends_at, email')
      .eq('id', link.user_id).maybeSingle(),
    supabase.from('quest_ticks')
      .select('quest_id, child_id, status')
      .eq('user_id', link.user_id).eq('tick_date', today).neq('status', 'rejected').limit(50),
    getStarBanks(supabase, link.user_id, [link.child_id]),
    getMinutesUsedToday(supabase, link.user_id, [link.child_id]),
    supabase.from('family_quests')
      .select('id, title, emoji, stars, schedule, child_id')
      .eq('user_id', link.user_id).eq('active', true)
      .order('created_at', { ascending: true }),
  ])

  const allLessons = lessonsRes.data ?? []
  const stageLessons = allLessons.filter(l => l.stage_id === stage.name.toLowerCase())
  const byLesson = new Map((completionsRes.error ? [] : completionsRes.data ?? []).map(c => [c.lesson_id, c]))
  const paid = hasFullAccess(
    parentProfileRes.data as { subscription_status?: string | null; trial_ends_at?: string | null } | null,
    (parentProfileRes.data as { email?: string | null } | null)?.email,
  )
  const freeIds = freeLessonIds(allLessons.map(l => ({ id: l.id, stage_id: l.stage_id, sort_order: l.sort_order })))

  const lessons: PathLesson[] = stageLessons.map(l => {
    const c = byLesson.get(l.id)
    const done = Boolean(c && c.passed !== false)
    return {
      id: l.id, title: l.title,
      emoji: CATEGORY_EMOJI[l.category] ?? '📘',
      done, score: done ? (c?.score as number | null) ?? null : null,
      locked: !paid && !freeIds.has(l.id) && !c,
    }
  })

  const games: PathGame[] = gamesForStage(stage.id).slice(0, 3).map(g => ({
    key: g.key, title: g.title, emoji: g.emoji,
  }))

  // Today's jobs as steps on the trail: the quests the parent set that are
  // due today, with the tick state right on the stone. Same due rules the
  // quest board uses, kept simple: daily always, weekdays and weekend by the
  // day, once quests until their tick is approved.
  const dow = new Date().getUTCDay()
  const isWeekend = dow === 0 || dow === 6
  const todayTicks = (ticksRes.data ?? []).filter(t => t.child_id === link.child_id || t.child_id === null) as { child_id: string | null; status: string; quest_id?: string }[]
  const jobsToday = todayTicks.length
  const tickState = new Map<string, string>()
  for (const t of (ticksRes.data ?? []) as { quest_id?: string; child_id: string | null; status: string }[]) {
    if (t.quest_id && (t.child_id === link.child_id || t.child_id === null)) tickState.set(t.quest_id, t.status)
  }
  const jobs: PathJob[] = (questsRes.data ?? [])
    .filter(q => q.child_id === null || q.child_id === link.child_id)
    .filter(q =>
      q.schedule === 'daily' || q.schedule === 'once'
      || (q.schedule === 'weekdays' && !isWeekend)
      || (q.schedule === 'weekend' && isWeekend))
    .slice(0, 8)
    .map(q => {
      const st = tickState.get(q.id)
      return {
        id: q.id, title: q.title, emoji: q.emoji, stars: Number(q.stars) || 1,
        state: (st === 'approved' ? 'done' : st === 'pending' ? 'waiting' : 'todo') as PathJob['state'],
      }
    })

  // Today's chest and quiz state from the ledger itself; both fail soft to
  // unclaimed (with the not ready flag) before migration 086.
  let chestClaimed = false
  let quizClaimed = false
  let needsMigration = false
  {
    const { data, error } = await supabase
      .from('star_bonuses')
      .select('note')
      .eq('user_id', link.user_id).eq('child_id', link.child_id)
      .or('note.ilike.Path chest%,note.ilike.Path quiz%')
      .gte('created_at', `${today}T00:00:00Z`)
      .limit(10)
    if (error) needsMigration = true
    else {
      chestClaimed = (data ?? []).some(r => String(r.note).startsWith('Path chest'))
      quizClaimed = (data ?? []).some(r => String(r.note).startsWith('Path quiz'))
    }
  }

  const bank = banks[0]
  const parentLimit = (child as { daily_limit_minutes?: number | null } | null)?.daily_limit_minutes
  const guideMinutes = parentLimit != null && parentLimit > 0 ? parentLimit : recommendedDailyMinutes(ageBand)

  return (
    <KidPath
      token={token}
      childName={child?.name ?? 'Superstar'}
      stageId={stage.id}
      stageName={stage.name}
      ages={stage.ages.replace('Ages ', '').toLowerCase()}
      stamp={readiness.stamp}
      jobs={jobs}
      lessons={lessons}
      games={games}
      quiz={quizForBand(ageBand, Math.floor(Date.now() / 86400000))}
      dayIndex={Math.floor(Date.now() / 86400000)}
      chestClaimed={chestClaimed}
      quizClaimed={quizClaimed}
      usedTodayMinutes={usedTodayMap.get(link.child_id) ?? 0}
      guideMinutes={guideMinutes}
      balanceStars={bank?.balance ?? 0}
      needsMigration={needsMigration}
    />
  )
}
