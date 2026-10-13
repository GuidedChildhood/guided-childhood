import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sessionUser } from '@/lib/supabase/session'
import { openHeadsUpNow } from '@/lib/lessons/heads-up-server'

// The Ready button under a heavy lesson's note (lib/lessons/heavy). A plain
// form post, so it works from the email on any phone with no script, and it
// lands back on the note saying what happened.
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null)
  const childId = String(form?.get('child') ?? '')
  const lessonId = String(form?.get('lesson') ?? '')
  const back = new URL('/dashboard/lessons/path', req.url)
  if (!/^[0-9a-f-]{36}$/.test(childId) || !/^[0-9a-f-]{36}$/.test(lessonId)) return NextResponse.redirect(back, 303)

  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) return NextResponse.redirect(new URL('/login', req.url), 303)

  const [{ data: child }, { data: profile }] = await Promise.all([
    supabase.from('children').select('id').eq('id', childId).eq('parent_id', user.id).maybeSingle(),
    supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
  ])
  if (!child) return NextResponse.redirect(back, 303)

  const parentName = String((profile as { full_name?: string | null } | null)?.full_name ?? '').trim().split(/\s+/)[0] || 'Your grown up'
  const { opened, push } = await openHeadsUpNow(supabase, createAdminClient(), { userId: user.id, childId, lessonId, parentName })
  const to = new URL('/dashboard/lessons/heads-up', req.url)
  to.searchParams.set('child', childId)
  to.searchParams.set('lesson', lessonId)
  to.searchParams.set('ready', opened ? (push ?? 'sent') : 'already')
  return NextResponse.redirect(to, 303)
}
