import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sessionUser } from '@/lib/supabase/session'
import HeadsUpNote from '@/components/lessons/HeadsUpNote'
import { getStarLesson } from '@/lib/quests/star-lesson-catalogue'
import { headsUpCopy, isHeavyModule, opensOnDay, stillWaiting } from '@/lib/lessons/heavy'

// THE NOTE BEFORE A HEAVY LESSON (sync plan C, 13 October 2026).
//
// Where the push and the email land when a child starts one of the six
// heaviest lessons alone (lib/lessons/heavy). The lesson's own parent text,
// what it covers and the one sentence worth saying, then Ready, which opens
// it on the child's app now. Doing nothing is fine too: it opens by itself
// after 48 hours, and the page says which day. Reading it after the lesson
// opened, or after the child passed, still shows the note, because the say
// this line is worth having either side of the lesson.

export const metadata = { title: 'Before the lesson · Guided Childhood' }

export default async function HeadsUpPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string; lesson?: string; ready?: string }>
}) {
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')
  const { child: childId = '', lesson: lessonId = '', ready } = await searchParams
  if (!/^[0-9a-f-]{36}$/.test(childId) || !/^[0-9a-f-]{36}$/.test(lessonId)) redirect('/dashboard/lessons/path')

  const [{ data: child }, lesson, { data: mission }] = await Promise.all([
    supabase.from('children').select('id, name').eq('id', childId).eq('parent_id', user.id).maybeSingle(),
    getStarLesson(createAdminClient(), lessonId, 'id, module_id, title, parent_note'),
    supabase.from('kid_lesson_missions').select('status, sent_at')
      .eq('user_id', user.id).eq('child_id', childId).eq('lesson_id', lessonId).maybeSingle(),
  ])
  if (!child || !lesson) redirect('/dashboard/lessons/path')

  const kidName = child.name && child.name !== 'Your child' ? child.name : 'your child'
  const Kid = kidName === 'your child' ? 'Your child' : kidName
  const row = lesson as { module_id?: string | null; title?: string | null; parent_note?: unknown }
  const copy = headsUpCopy(row.parent_note, kidName)
  const m = mission as { status?: string; sent_at?: string | null } | null
  const waiting = m?.status === 'sent' && stillWaiting(m.sent_at)
  const backHref = `/dashboard/lessons/path?child=${childId}&lesson=${lessonId}#lesson-${lessonId}`

  // What the Ready tap did, said once at the top.
  const readyLine = !ready ? null
    : ready === 'already' ? 'It was already open.'
    : ready === 'sent' ? `Open. ${Kid} has a note on their phone.`
    : ready === 'quiet_hours' ? `Open. ${Kid}'s phone is in quiet hours, so they will see it in their lessons in the morning.`
    : `Open. It is in ${kidName}'s lessons now.`

  const status = waiting
    ? `${Kid} started this one. It is on a hard subject, so it waits for you first. It opens on ${opensOnDay(m!.sent_at as string)} by itself, or now when you tap Ready.`
    : m?.status === 'done' ? `${Kid} has done this one. The line below is still worth saying.`
    : m?.status === 'sent' ? `It is open in ${kidName}'s lessons now.`
    : isHeavyModule(row.module_id) ? `When ${kidName} starts this one on their own, it waits two days for you first, and you get this note.`
    : null

  return (
    <HeadsUpNote
      title={row.title ?? 'This lesson'}
      backHref={backHref}
      readyLine={readyLine}
      ready={ready ?? null}
      status={status}
      state={waiting ? 'waiting' : m?.status ?? 'none'}
      copy={copy}
      kid={Kid}
      waiting={waiting}
      childId={childId}
      lessonId={lessonId}
    />
  )
}
