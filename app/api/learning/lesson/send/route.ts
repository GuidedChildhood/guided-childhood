import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'

// Send a generated tutor lesson to the child, or bin it.
//
// The gap between generating and sending is the whole safety model. A deck
// exists the moment DiGi writes it, and it is invisible to the child until a
// parent has read it and pressed send. Nothing about this route is clever: it
// is the consent step, and it earns its file by being the only way sent_at is
// ever written.
//
// A parent binning one costs us a few thousand tokens. A lesson a parent would
// not have chosen landing on their child's phone costs a great deal more, and
// it is not the sort of thing you get to take back.

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { lessonId, action } = await request.json().catch(() => ({})) as { lessonId?: string; action?: string }
  if (!lessonId || !/^[0-9a-f-]{36}$/i.test(lessonId)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  // This family's row and only this family's, read back rather than trusted.
  const { data: lesson } = await supabase
    .from('tutor_lessons')
    .select('id, child_id, title, emoji, stars, sent_at')
    .eq('id', lessonId)
    .eq('user_id', user.id)
    .maybeSingle()
  if (!lesson) return NextResponse.json({ error: 'not found' }, { status: 404 })

  if (action === 'bin') {
    await supabase.from('tutor_lessons')
      .update({ cleared_at: new Date().toISOString() })
      .eq('id', lesson.id).eq('user_id', user.id)
    return NextResponse.json({ ok: true, binned: true })
  }

  // Sending twice is a parent tapping twice, not a second lesson. The child
  // already has it, so this is a no op rather than a fresh buzz on their phone.
  if (lesson.sent_at) return NextResponse.json({ ok: true, already: true })

  const { error } = await supabase.from('tutor_lessons')
    .update({ sent_at: new Date().toISOString() })
    .eq('id', lesson.id).eq('user_id', user.id).is('sent_at', null)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // On their phone, not only on the parent's screen, or the lesson waits until
  // the child happens to open the app. Best effort: the card is on their home
  // page either way, so a failed push loses the nudge and not the lesson.
  try {
    await pushToChild(
      createAdminClient(), user.id, lesson.child_id as string,
      'A lesson just for you 📘',
      `${lesson.emoji ?? '📘'} ${lesson.title}. Finish it to earn ${lesson.stars} star${lesson.stars === 1 ? '' : 's'}.`,
    )
  } catch { /* the lesson is sent either way */ }

  return NextResponse.json({ ok: true })
}
