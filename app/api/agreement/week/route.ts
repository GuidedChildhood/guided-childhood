import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// The end of week agreement check. The parent gives the week a verdict
// and the reward flows through the same star system as everything else:
// kept it lands three stars, mostly lands two, a tough week lands
// nothing but a fresh start. One verdict per week per child.

const VERDICT_STARS: Record<string, number> = { kept: 3, mostly: 2, tough: 0 }

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { verdict } = await request.json().catch(() => ({}))
  if (!(verdict in VERDICT_STARS)) {
    return NextResponse.json({ error: 'verdict required' }, { status: 400 })
  }

  const { data: child } = await supabase
    .from('children')
    .select('id, name')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .maybeSingle()
  if (!child) return NextResponse.json({ error: 'No child on the account yet' }, { status: 400 })

  // One verdict a week: look for an agreement check tick in the last six days.
  const sixDaysAgo = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10)
  const { data: existingQuest } = await supabase
    .from('family_quests')
    .select('id')
    .eq('user_id', user.id)
    .eq('child_id', child.id)
    .eq('title', 'Kept our family agreement')
    .maybeSingle()
  if (existingQuest) {
    const { data: recentTick } = await supabase
      .from('quest_ticks')
      .select('id')
      .eq('quest_id', existingQuest.id)
      .gte('tick_date', sixDaysAgo)
      .limit(1)
      .maybeSingle()
    if (recentTick) return NextResponse.json({ ok: true, already: true })
  }

  const stars = VERDICT_STARS[verdict]
  if (stars === 0) {
    return NextResponse.json({ ok: true, stars: 0 })
  }

  // The reward rides the quest rails: a recurring weekly quest row,
  // ticked by the parent, landing approved so the stars count now.
  let questId = existingQuest?.id
  if (!questId) {
    const { data: quest, error } = await supabase
      .from('family_quests')
      .insert({
        user_id: user.id,
        child_id: child.id,
        title: 'Kept our family agreement',
        emoji: '🤝',
        stars: 3,
        schedule: 'weekend',
      })
      .select('id')
      .single()
    if (error || !quest) return NextResponse.json({ error: 'could not save' }, { status: 500 })
    questId = quest.id
  }

  // Mostly kept pays two of the three: the tick is stored against the
  // quest, the difference is explained on the response.
  const { error: tickError } = await supabase.from('quest_ticks').insert({
    quest_id: questId,
    user_id: user.id,
    child_id: child.id,
    tick_date: new Date().toISOString().slice(0, 10),
    status: 'approved',
    ticked_by: 'parent',
    approved_at: new Date().toISOString(),
  })
  if (tickError && !tickError.message.includes('duplicate')) {
    return NextResponse.json({ error: tickError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, stars, childName: child.name })
}
