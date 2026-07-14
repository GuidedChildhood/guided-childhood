import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { pushToChild } from '@/lib/quests/kid-push'

// Send a watch together lesson to a child's own device. The parent presses
// "Send to <child>" on the front page, and this hands the child a tap to
// open link straight to that adventure, plus a best effort nudge to their
// device if their reminders are on.
//
// Auth is the parent session, and the child must be theirs. We never
// fabricate a kid link token here: if the child has no link yet, we say so
// and point the parent back to the dashboard to open it once. That keeps
// token creation in the one place that already owns it.

export async function POST(req: NextRequest) {
  let body: { lesson_code?: string; child_id?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const lessonCode = body.lesson_code
  if (!lessonCode || typeof lessonCode !== 'string' || !/^\d{1,2}\.\d{1,2}$/.test(lessonCode)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  if (!body.child_id || typeof body.child_id !== 'string') {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  // ── Who is asking, and is this their child? ──
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const admin = createAdminClient()
  const { data: child } = await admin
    .from('children')
    .select('id, parent_id, name')
    .eq('id', body.child_id)
    .maybeSingle()
  if (!child || child.parent_id !== user.id) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  // ── The lesson must exist and be live ──
  const { data: lesson } = await admin
    .from('parent_lessons')
    .select('lesson_code, title')
    .eq('lesson_code', lessonCode)
    .eq('active', true)
    .maybeSingle()
  if (!lesson) return NextResponse.json({ error: 'unknown lesson' }, { status: 404 })

  // ── The child's own link. No link, no send: send them to the dashboard
  // to open it once, then it works from here on. We never mint a token in
  // this route; the quests link action is the single place that does. ──
  const { data: link } = await admin
    .from('kid_links')
    .select('token')
    .eq('child_id', child.id)
    .eq('user_id', user.id)
    .maybeSingle()
  if (!link?.token) {
    return NextResponse.json({
      ok: true,
      kid_url: null,
      needs_link: true,
      message: 'Open your child link from the dashboard first, then send.',
    })
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
  const kidUrl = `${origin}/k/${link.token}/adventures/${lessonCode}`

  // ── The nudge to their device, best effort. Never throws, and silence is
  // fine: the link still works, and the child's page shows it on next open. ──
  let pushed = false
  try {
    await pushToChild(
      admin,
      user.id,
      child.id,
      'A lesson from your grown up 🎬',
      lesson.title,
    )
    pushed = true
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, kid_url: kidUrl, pushed })
}
