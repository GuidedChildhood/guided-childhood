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
    // select * so the optional phone column (migration 030) is included
    // when present and its absence never breaks the whole board
    supabase.from('children').select('*').eq('parent_id', user.id).order('created_at'),
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

  // Add a child directly from the quest manager: no trip back through
  // onboarding, and the door to multi child families.
  if (body.action === 'child' && body.name && body.age_band) {
    const AGE_TO_STAGE: Record<string, string> = {
      '4-7': 'foundation', '8-10': 'builder', '11-13': 'explorer', '13-15': 'shaper', '16+': 'independent',
    }
    const stageId = AGE_TO_STAGE[body.age_band]
    if (!stageId) return NextResponse.json({ error: 'bad age band' }, { status: 400 })
    const { count } = await supabase
      .from('children').select('id', { count: 'exact', head: true }).eq('parent_id', user.id)
    const { data, error } = await supabase.from('children').insert({
      parent_id: user.id,
      name: String(body.name).slice(0, 60),
      age_band: body.age_band,
      stage_id: stageId,
      is_primary: (count ?? 0) === 0,
    }).select('id, name, age_band').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ child: data })
  }

  // Save the child's phone number (optional, drives send to phone)
  if (body.action === 'phone' && body.child_id) {
    const phone = String(body.phone ?? '').replace(/[^0-9+ ]/g, '').slice(0, 20)
    const { error } = await supabase
      .from('children').update({ phone: phone || null }).eq('id', body.child_id).eq('parent_id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

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

// Edit a quest in place: title, stars, schedule.
export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { quest_id, title, stars, schedule } = await req.json()
  if (!quest_id) return NextResponse.json({ error: 'quest_id required' }, { status: 400 })

  const patch: Record<string, unknown> = {}
  if (typeof title === 'string' && title.trim()) patch.title = title.trim().slice(0, 120)
  if (stars !== undefined) patch.stars = Math.min(10, Math.max(1, Number(stars) || 1))
  if (['daily', 'weekdays', 'weekend', 'once'].includes(schedule)) patch.schedule = schedule
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'nothing to update' }, { status: 400 })

  const { error } = await supabase
    .from('family_quests').update(patch).eq('id', quest_id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
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
