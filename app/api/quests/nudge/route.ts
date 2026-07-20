import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'

// The Remind button on a blocking job: one tap sends the child a warm nudge.
// The push is best effort (their phone may not be set up), but the in app
// nudge ALWAYS lands, so the child sees it on their own dashboard next open:
// "Your grown up asked: tidy your bedroom, then your timer can start". Scoped
// to the parent's own child and quest by session and RLS.

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { childId, questId } = await req.json().catch(() => ({}))
  if (!childId || typeof childId !== 'string' || !questId || typeof questId !== 'string') {
    return NextResponse.json({ error: 'childId and questId required' }, { status: 400 })
  }

  const [{ data: child }, { data: quest }] = await Promise.all([
    supabase.from('children').select('id, name').eq('id', childId).eq('parent_id', user.id).maybeSingle(),
    supabase.from('family_quests').select('id, title').eq('id', questId).eq('user_id', user.id).maybeSingle(),
  ])
  if (!child || !quest) return NextResponse.json({ error: 'unknown child or quest' }, { status: 404 })

  const message = `Your grown up asked: ${quest.title}, then your timer can start 🌱`

  // The nudge row always lands, once: an unread nudge for the same job is
  // not stacked again, so tapping Remind twice never piles up the child's
  // screen. Fails soft before migration 081, when only the push can carry it.
  let stored = false
  try {
    const { data: existing, error: readErr } = await supabase
      .from('kid_nudges').select('id')
      .eq('child_id', childId).eq('quest_id', questId).eq('seen', false)
      .limit(1).maybeSingle()
    if (!readErr && existing?.id) {
      stored = true
    } else if (!readErr) {
      const { error: insErr } = await supabase.from('kid_nudges').insert({
        user_id: user.id, child_id: childId, quest_id: questId, message,
      })
      stored = !insErr
    }
  } catch { /* pre migration database, push only this time */ }

  // The push, if their device is set up for reminders.
  try {
    await pushToChild(createAdminClient(), user.id, childId, 'A job to do 🌱', message)
  } catch { /* best effort */ }

  return NextResponse.json({ ok: true, stored })
}
