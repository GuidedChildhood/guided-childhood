import { NextResponse } from 'next/server'
import { withHeartbeat } from '@/lib/ops/heartbeat'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'
import { digestEmail, digestOf, type ChangeRow } from '@/lib/school/lesson-changes'

// THE MONDAY LESSON CHANGES DIGEST (22 November 2026).
//
// Every "What would you change about this lesson?" line a teacher wrote in the
// last seven days, with the revisit counts per lesson, to Justin. The rules are
// in lib/school/lesson-changes.ts. A week with no line and no revisit sends
// nothing: unlike the safety MOT, an empty week here is not news, and the
// heartbeat already says if the job itself stopped. Modelled on the French
// scheme, whose author improves each lesson after she runs it
// (plans/2026-11-22-lesson-shape-vs-french-scheme.md).

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com'

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }
  // Both parent projects register this cron; only the app project has the key.
  if (!((process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY) && process.env.NEXT_PUBLIC_SUPABASE_URL)) {
    return NextResponse.json({ ok: true, skipped: 'no service key on this project' })
  }

  const supabase = createAdminClient()
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
  const { data, error } = await supabase.schema('schools').from('lesson_records')
    .select('lesson_key, school_ref, assessment, objective_marks, would_change')
    .eq('subject', 'digital').eq('status', 'delivered').gte('updated_at', weekAgo)
    .limit(5000)
    .overrideTypes<ChangeRow[], { merge: false }>()
  // Before migration 403 there is no column to read, and so nothing to send.
  if (error?.code === '42703') return NextResponse.json({ ok: true, skipped: 'migration 403 not applied' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const keys = [...new Set((data ?? []).map(r => r.lesson_key))]
  const { data: lessons } = keys.length
    ? await supabase.schema('schools').from('school_lessons').select('module_id, title').in('module_id', keys)
    : { data: [] as { module_id: string; title: string }[] }
  const titles = Object.fromEntries(((lessons ?? []) as { module_id: string; title: string }[]).map(l => [l.module_id, l.title]))

  const digest = digestOf(data ?? [], titles)
  if (digest.length === 0) return NextResponse.json({ ok: true, sent: 0 })

  const { subject, html } = digestEmail(digest)
  await sendEmail({ to: FOUNDER_EMAIL, subject, html, kind: 'operational', key: 'lesson-changes' })
  return NextResponse.json({ ok: true, sent: 1, lessons: digest.length })
}

export const GET = withHeartbeat('/api/cron/lesson-changes', handler)
