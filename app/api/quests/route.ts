import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { createClient } from '@/lib/supabase/server'

// The parent's quest manager API. GET returns everything the manager and
// the board need in one call: children, their quests, today's ticks, the
// pending approval queue, weekly stars and the goal. POST creates or
// updates a quest, DELETE deactivates. The kid link is created lazily the
// first time a child's quests are managed, so sharing is always possible.

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)

  const [childrenRes, questsRes, ticksRes, goalsRes, linksRes] = await Promise.all([
    supabase.from('children').select('id, name, age_band').eq('parent_id', user.id).order('created_at'),
    supabase.from('family_quests').select('*').eq('user_id', user.id).eq('active', true).order('created_at'),
    supabase.from('quest_ticks').select('*').eq('user_id', user.id).gte('tick_date', weekAgo),
    supabase.from('star_goals').select('*').eq('user_id', user.id),
    supabase.from('kid_links').select('child_id, token').eq('user_id', user.id),
  ])

  return NextResponse.json({
    children: childrenRes.data ?? [],
    quests: questsRes.data ?? [],
    ticks: ticksRes.data ?? [],
    goals: goalsRes.data ?? [],
    links: linksRes.data ?? [],
  })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()

  // Create the kid link for a child on demand
  if (body.action === 'link' && body.child_id) {
    const { data: existing } = await supabase
      .from('kid_links').select('token').eq('child_id', body.child_id).maybeSingle()
    if (existing) return NextResponse.json({ token: existing.token })
    const token = randomBytes(9).toString('hex')
    const { error } = await supabase.from('kid_links').insert({
      user_id: user.id, child_id: body.child_id, token,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ token })
  }

  // Set or update the star goal for a child
  if (body.action === 'goal' && body.child_id && body.title) {
    const row = {
      user_id: user.id, child_id: body.child_id,
      title: String(body.title).slice(0, 120),
      stars_needed: Math.min(500, Math.max(1, Number(body.stars_needed) || 20)),
      achieved_at: null,
    }
    const { data: existing } = await supabase
      .from('star_goals').select('id').eq('child_id', body.child_id).maybeSingle()
    const { error } = existing
      ? await supabase.from('star_goals').update(row).eq('id', existing.id)
      : await supabase.from('star_goals').insert(row)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // Create a quest
  const { title, emoji, stars, schedule, child_id } = body
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'title required' }, { status: 400 })
  }
  const { data, error } = await supabase.from('family_quests').insert({
    user_id: user.id,
    child_id: child_id ?? null,
    title: title.slice(0, 120),
    emoji: (emoji ?? '⭐').slice(0, 8),
    stars: Math.min(10, Math.max(1, Number(stars) || 1)),
    schedule: ['daily', 'weekdays', 'weekend', 'once'].includes(schedule) ? schedule : 'daily',
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ quest: data })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { quest_id } = await req.json()
  if (!quest_id) return NextResponse.json({ error: 'quest_id required' }, { status: 400 })
  const { error } = await supabase
    .from('family_quests').update({ active: false }).eq('id', quest_id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
