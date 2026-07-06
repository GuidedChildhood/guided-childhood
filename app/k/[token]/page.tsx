import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { questDueToday } from '@/lib/quests/due'
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

  return (
    <KidQuestScreen
      token={token}
      childName={childRes.data?.name ?? 'Superstar'}
      quests={quests}
      todayTicks={todayTicksRes.data ?? []}
      weekStars={weekStars}
      goal={goalRes.data ?? null}
      streakDays={streakDays}
      laterQuests={laterQuests}
    />
  )
}
