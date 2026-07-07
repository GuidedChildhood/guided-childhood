import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { questDueToday } from '@/lib/quests/due'
import { KID_LESSONS, kidLessonBaseTitle } from '@/lib/quests/kid-lessons'
import KidQuestScreen from './KidQuestScreen'

// The kid's own screen. Opened from the private link their parent sends,
// no account, no login, nothing to install. Today's quests, big ticks,
// their star count and what they are saving for. The token scopes
// everything; no parent data is reachable from here.

export const dynamic = 'force-dynamic'

export default async function KidPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) notFound()

  const today = new Date().toISOString().slice(0, 10)
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)

  const [childRes, questsRes, todayTicksRes, weekTicksRes, goalRes, streakTicksRes] = await Promise.all([
    supabase.from('children').select('name').eq('id', link.child_id).maybeSingle(),
    supabase.from('family_quests')
      .select('id, title, emoji, stars, schedule')
      .eq('user_id', link.user_id)
      .eq('active', true)
      .or(`child_id.eq.${link.child_id},child_id.is.null`)
      .order('created_at'),
    supabase.from('quest_ticks')
      .select('quest_id, status')
      .eq('child_id', link.child_id)
      .eq('tick_date', today),
    supabase.from('quest_ticks')
      .select('quest_id, status')
      .eq('child_id', link.child_id)
      .eq('status', 'approved')
      .gte('tick_date', weekAgo),
    supabase.from('star_goals')
      .select('*')
      .eq('child_id', link.child_id)
      .maybeSingle(),
    supabase.from('quest_ticks')
      .select('tick_date')
      .eq('child_id', link.child_id)
      .in('status', ['approved', 'pending'])
      .gte('tick_date', new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10))
      .limit(400),
  ])

  // Star lessons sent to this child: pending ones to play, and stars from
  // lessons completed this week join the star bank alongside quest stars.
  const { data: missionRows } = await supabase
    .from('kid_lesson_missions')
    .select('id, stars, status, completed_at, school_lessons(title)')
    .eq('child_id', link.child_id)
    .order('sent_at', { ascending: false })
  const missions = (missionRows ?? []).map(m => ({
    id: m.id,
    title: (m.school_lessons as unknown as { title: string })?.title ?? 'A lesson from DiGi',
    stars: m.stars,
    status: m.status,
  }))
  const lessonWeekStars = (missionRows ?? [])
    .filter(m => m.status === 'done' && m.completed_at && m.completed_at >= new Date(Date.now() - 7 * 86400000).toISOString())
    .reduce((sum, m) => sum + m.stars, 0)

  // The child's own streak: consecutive days with at least one quest
  // ticked, ending today or yesterday. Pending counts, because the tick
  // is the child's act; approval is the parent's.
  const tickDays = new Set((streakTicksRes.data ?? []).map(t => String(t.tick_date)))
  const dayStr = (o: number) => new Date(Date.now() - o * 86400000).toISOString().slice(0, 10)
  let streakDays = 0
  if (tickDays.has(dayStr(0)) || tickDays.has(dayStr(1))) {
    let offset = tickDays.has(dayStr(0)) ? 0 : 1
    while (tickDays.has(dayStr(offset))) { streakDays++; offset++ }
  }

  const quests = (questsRes.data ?? []).filter(q => questDueToday(q.schedule))
  const laterQuests = (questsRes.data ?? [])
    .filter(q => !questDueToday(q.schedule))
    .map(q => ({ title: q.title, emoji: q.emoji, schedule: q.schedule }))
  const starsByQuest = new Map((questsRes.data ?? []).map(q => [q.id, q.stars]))
  const weekStars = (weekTicksRes.data ?? []).reduce((sum, t) => sum + (starsByQuest.get(t.quest_id) ?? 1), 0)
    + lessonWeekStars

  // Once quests stay due until ticked, then leave the list on later days
  // (today's tick still shows today, as waiting or done). Finished kid
  // lessons are recognised by their quest title.
  const onceIds = (questsRes.data ?? []).filter(q => q.schedule === 'once').map(q => q.id)
  const { data: onceTicks } = onceIds.length
    ? await supabase.from('quest_ticks')
        .select('quest_id, tick_date')
        .in('quest_id', onceIds)
        .neq('status', 'rejected')
    : { data: [] as { quest_id: string; tick_date: string }[] }
  const tickedOnceBeforeToday = new Set(
    (onceTicks ?? []).filter(t => String(t.tick_date) < today).map(t => t.quest_id)
  )
  const tickedOnceEver = new Set((onceTicks ?? []).map(t => t.quest_id))
  const dueQuests = quests.filter(q => !(q.schedule === 'once' && tickedOnceBeforeToday.has(q.id)))

  const doneLessonKeys = KID_LESSONS
    .filter(l => {
      const base = kidLessonBaseTitle(l)
      return (questsRes.data ?? []).some(q => String(q.title).startsWith(base) && tickedOnceEver.has(q.id))
    })
    .map(l => l.key)

  return (
    <KidQuestScreen
      token={token}
      childName={childRes.data?.name ?? 'Superstar'}
      quests={dueQuests}
      todayTicks={todayTicksRes.data ?? []}
      weekStars={weekStars}
      goal={goalRes.data ?? null}
      streakDays={streakDays}
      missions={missions}
      laterQuests={laterQuests}
      doneLessonKeys={doneLessonKeys}
    />
  )
}
