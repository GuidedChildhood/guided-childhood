import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { sendPush } from '@/lib/push/send'

// The fortnightly reading drip: the PARENT's library, one read at a time.
//
// Until 9 October 2026 this push said a library lesson was "ready on Teo's
// app now" and that passing it would tick the progress report. Neither has
// been true since 29 September: the child learns the school modules in their
// own app, the passport counts those, and the child app's last door into the
// parent library (a Learn tile nothing rendered) is gone. So the words stay
// and the label changes: this is the grown up's own reading, said as that,
// and never "your child's next lesson", which is the week card's job and
// arrives with its own push. Plan v10, item 1.3.
//
// Only families with a kid link and a parent push channel hear anything, and
// a parent who has read everything for the stage is skipped. One push per
// parent per read, so two linked children at one stage do not send the same
// read twice. Runs on the 1st and 15th, gated on CRON_SECRET like the other
// crons.

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const CATEGORY_EMOJI: Record<string, string> = {
  safety: '🛡️', screen_habits: '📱', wellbeing: '💛',
  online_risks: '🔍', ai_safety: '🤖', ai_literacy: '🤖',
}

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  const admin = createAdminClient()

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
    .order('id', { ascending: true })
  if (lessonsErr) return NextResponse.json({ ok: true, sent: 0 })

  const byStage = new Map<string, { id: string; category: string; title: string }[]>()
  for (const l of lessonRows ?? []) {
    const slug = String(l.stage_id)
    const arr = byStage.get(slug) ?? []
    arr.push({ id: l.id as string, category: String(l.category), title: String(l.title) })
    byStage.set(slug, arr)
  }

  let sent = 0
  const told = new Set<string>()
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
      if (!next) continue // everything for their stage is already read
      if (told.has(`${userId}:${next.id}`)) continue
      told.add(`${userId}:${next.id}`)

      const name = child.name && child.name !== 'Your child' ? child.name : 'your child'
      const emoji = CATEGORY_EMOJI[next.category] ?? '📘'
      const title = `Your read this fortnight ${emoji}`
      const body = `DiGi here. ${next.title} is in your lessons. A few minutes, written for you rather than ${name}, so you know the ground before it comes up at home.`

      await sendPush({ userId, title, body, url: '/dashboard/lessons' })
      sent += 1
    } catch { /* best effort per family */ }
  }

  return NextResponse.json({ ok: true, sent })
}

export const GET = withHeartbeat('/api/cron/lesson-drip', handler)
