// The notifications hub feed: everything that has popped up for a parent,
// gathered from across the app into one list they reach from the bell. The
// things a child is waiting on lead (a tick to approve, an idea pitched),
// then DiGi stepping in, then school and the rest. One shape, newest and
// most urgent first, each with the one tap that acts on it.

type NotifClient = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

export type Notification = {
  id: string
  kind: 'approve' | 'ask' | 'digi' | 'school' | 'device'
  icon: string
  title: string
  body: string
  href: string
  at: string
  urgent: boolean
}

export type NotificationFeed = {
  items: Notification[]
  count: number
  urgentCount: number
}

export async function getNotifications(supabase: NotifClient, userId: string): Promise<NotificationFeed> {
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
  const [childrenRes, questsRes, ticksRes, asksRes, schoolRes, digiRes, sessionsRes] = await Promise.all([
    supabase.from('children').select('id, name').eq('parent_id', userId),
    supabase.from('family_quests').select('id, title, emoji').eq('user_id', userId),
    supabase.from('quest_ticks').select('id, quest_id, child_id, tick_date').eq('user_id', userId).eq('status', 'pending').gte('tick_date', weekAgo),
    supabase.from('quest_requests').select('id, child_id, title, emoji, created_at, status').eq('user_id', userId).eq('status', 'pending'),
    supabase.from('school_actions').select('id, title, due_date, created_at').eq('user_id', userId).eq('status', 'open'),
    supabase.from('digi_prompts').select('id, kind, title, body, created_at').eq('user_id', userId).eq('status', 'pending'),
    supabase.from('device_sessions').select('id, child_id, device, ends_at').eq('user_id', userId).eq('status', 'active').gt('ends_at', new Date().toISOString()),
  ])

  const childName = new Map((childrenRes.data ?? []).map(c => [c.id as string, c.name as string]))
  const quest = new Map((questsRes.data ?? []).map(q => [q.id as string, q as { title: string; emoji: string }]))
  const nameOf = (id: string | null) => (id && childName.get(id)) || 'Your child'

  const items: Notification[] = []

  // A child ticked a quest and is waiting on the stars: the most urgent, a
  // child is stood there.
  for (const t of ticksRes.data ?? []) {
    const q = quest.get(t.quest_id as string)
    items.push({
      id: `tick-${t.id}`, kind: 'approve', icon: '✅', urgent: true,
      title: `${nameOf(t.child_id as string)} finished a quest`,
      body: q ? `${q.emoji} ${q.title} · tap to land the stars` : 'Tap to approve the stars',
      href: '/dashboard/quests', at: String(t.tick_date),
    })
  }

  // A child pitched their own quest or asked for a printable.
  for (const a of asksRes.data ?? []) {
    const isPrint = String(a.title).startsWith('Print the ')
    items.push({
      id: `ask-${a.id}`, kind: 'ask', icon: isPrint ? '🖨️' : '💡', urgent: false,
      title: `${nameOf(a.child_id as string)} asked for something`,
      body: `${a.emoji ?? '⭐'} ${a.title}`,
      href: '/dashboard/quests', at: String(a.created_at),
    })
  }

  // DiGi stepping in: the proactive prompt from the family's own data.
  for (const d of digiRes.data ?? []) {
    items.push({
      id: `digi-${d.id}`, kind: 'digi', icon: '◎', urgent: false,
      title: d.title as string,
      body: d.body as string,
      href: `/dashboard/digi?q=${encodeURIComponent(`You flagged: ${d.title}. Can we talk it through?`)}`,
      at: String(d.created_at),
    })
  }

  // Something from school still open.
  for (const s of schoolRes.data ?? []) {
    const due = s.due_date ? ` · due ${String(s.due_date)}` : ''
    items.push({
      id: `school-${s.id}`, kind: 'school', icon: '🏫', urgent: false,
      title: s.title as string,
      body: `From school${due}`,
      href: '/dashboard#school-actions', at: String(s.created_at ?? s.due_date ?? ''),
    })
  }

  // A live device time session, so a parent glancing at the bell sees it.
  for (const se of sessionsRes.data ?? []) {
    items.push({
      id: `device-${se.id}`, kind: 'device', icon: '⏱️', urgent: false,
      title: `${nameOf(se.child_id as string)} is on their screen time`,
      body: 'A device timer is running now',
      href: '/dashboard/quests', at: new Date().toISOString(),
    })
  }

  // Urgent first, then newest.
  items.sort((a, b) => (Number(b.urgent) - Number(a.urgent)) || b.at.localeCompare(a.at))

  return { items, count: items.length, urgentCount: items.filter(i => i.urgent).length }
}
