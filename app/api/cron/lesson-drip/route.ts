import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'

// The fortnightly lesson drip. The whole Rosenshine library is a lot to meet
// at once, so it reaches each child one lesson at a time. Their own app
// already surfaces the next unpassed stage lesson as the Today "Learn"
// headline; this cron makes sure the grown up hears about it too, every two
// weeks, so the learning is a shared thing and not a surprise. One warm,
// benefit led push per linked child, in DiGi's voice, naming this fortnight's
// lesson. Passing it ticks the parent's progress report through the lesson
// player, so the parent watches the curriculum fill in as the child goes.
//
// Only families with a kid link and a parent push channel hear anything, and
// a child who has already passed everything for their stage is skipped. Runs
// on the 1st and 15th, gated on CRON_SECRET like the other crons.

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const CATEGORY_EMOJI: Record<string, string> = {
  safety: '🛡️', screen_habits: '📱', wellbeing: '💛',
  online_risks: '🔍', ai_safety: '🤖', ai_literacy: '🤖',
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  const admin = createAdminClient()
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin

  // Every child with their own link. The drip is only for children whose
  // grown up has handed them the app, so the lesson genuinely lands on a
  // screen they use.
  const { data: links } = await admin
    .from('kid_links')
    .select('user_id, child_id')
    .limit(2000)

  // The library and passes, read once and grouped in memory, so a big run is
  // a handful of queries rather than one per child. Fails soft to no drip on
  // any read error, never a thrown cron.
  const { data: lessonRows, error: lessonsErr } = await admin
    .from('lessons')
    .select('id, stage_id, category, title, sort_order')
    .eq('audience', 'parent').neq('status', 'stub')
    .order('sort_order', { ascending: true })
  if (lessonsErr) return NextResponse.json({ ok: true, sent: 0 })

  const byStage = new Map<string, { id: string; category: string; title: string }[]>()
  for (const l of lessonRows ?? []) {
    const slug = String(l.stage_id)
    const arr = byStage.get(slug) ?? []
    arr.push({ id: l.id as string, category: String(l.category), title: String(l.title) })
    byStage.set(slug, arr)
  }

  let sent = 0
  for (const link of links ?? []) {
    const userId = link.user_id as string
    const childId = link.child_id as string
    try {
      // A parent push channel is the whole point here; without one there is
      // nothing to send and the child's own Today headline already carries it.
      const { data: subs } = await admin
        .from('push_subscriptions').select('endpoint').eq('user_id', userId).is('child_id', null).limit(1)
      if (!subs?.length) continue

      const { data: child } = await admin
        .from('children').select('name, age_band').eq('id', childId).maybeSingle()
      if (!child) continue
      const stageSlug = getStageFromAgeBand((child.age_band as AgeBand | null) ?? '8-10').name.toLowerCase()
      const stageLessons = byStage.get(stageSlug) ?? []
      if (stageLessons.length === 0) continue

      const { data: passRows } = await admin
        .from('lesson_completions')
        .select('lesson_id, passed')
        .eq('user_id', userId).eq('lesson_source', 'lesson')
      const passedIds = new Set(
        (passRows ?? []).filter(c => c.passed !== false).map(c => c.lesson_id as string),
      )
      const next = stageLessons.find(l => !passedIds.has(l.id))
      if (!next) continue // everything for their stage is already passed

      const name = child.name && child.name !== 'Your child' ? child.name : 'your child'
      const emoji = CATEGORY_EMOJI[next.category] ?? '📘'
      const title = `This fortnight's lesson for ${name} ${emoji}`
      const body = `DiGi here. ${next.title} is ready on ${name}'s app now. It takes a few minutes, and when they pass it the tick lands on your progress report. One lesson at a time, the whole way up.`

      await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
        body: JSON.stringify({ userId, title, body, url: '/dashboard/lessons' }),
      })
      sent += 1
    } catch { /* best effort per family */ }
  }

  return NextResponse.json({ ok: true, sent })
}
