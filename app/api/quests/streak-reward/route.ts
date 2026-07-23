import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'
import { STAR_MINUTES } from '@/lib/quests/templates'

// The parent marks a completed jobs streak with a reward. Device time grants a
// small star bonus so it becomes real minutes in the child's bank; a printable
// or a lesson is chosen here and sent from its own page, so this records the
// choice and tells the child something is coming. Either way the streak leaves
// the reward queue and the child hears the good news on their own app.

const KINDS = new Set(['printable', 'device_time', 'lesson', 'tutor', 'other'])

export async function POST(req: NextRequest) {
  const { streak_id, kind, stars, note } = await req.json().catch(() => ({}))
  if (!streak_id || typeof streak_id !== 'string' || !KINDS.has(kind)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data: streak } = await supabase
    .from('job_streaks')
    .select('id, child_id, length, reward_sent_at')
    .eq('id', streak_id).eq('user_id', user.id).maybeSingle()
  if (!streak) return NextResponse.json({ error: 'unknown streak' }, { status: 404 })
  if (streak.reward_sent_at) return NextResponse.json({ ok: true, already: true })

  const trimmedNote = typeof note === 'string' ? note.trim().slice(0, 200) : ''
  const admin = createAdminClient()

  if (kind === 'device_time') {
    // A gift of device time is a small star bonus, capped by the ledger rule.
    const grant = Math.min(20, Math.max(1, Math.round(Number(stars) || 3)))
    const { error } = await supabase.from('star_bonuses').insert({
      user_id: user.id, child_id: streak.child_id, stars: grant,
      note: trimmedNote || 'Five day jobs streak reward',
    })
    if (error && !/relation|does not exist|schema|constraint/i.test(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    try {
      await pushToChild(
        admin, user.id, streak.child_id,
        'A streak reward from your grown up 🌟',
        `${grant} bonus star${grant === 1 ? '' : 's'} for keeping your jobs streak, that is ${grant * STAR_MINUTES} minutes of device time. Superstar!`,
      )
    } catch { /* push is best effort */ }
  } else {
    try {
      await pushToChild(
        admin, user.id, streak.child_id,
        'A streak reward is on its way 🎁',
        'Your grown up is sending you something for keeping your jobs streak. Nice work!',
      )
    } catch { /* push is best effort */ }
  }

  const now = new Date().toISOString()
  await supabase.from('job_streaks').update({
    reward_kind: kind,
    reward_note: trimmedNote || null,
    reward_sent_at: now,
    parent_seen_at: now,
  }).eq('id', streak_id).eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
