import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { codeFromTyped } from '@/lib/school/link'
import { passIsLive } from '@/lib/school-pass'

// THE SCHOOL CODE BOX (Justin, 27 November 2026): "this change is only for
// families that sign up via school ... must not affect normal families
// signing up without code."
//
// Most school families arrive through the school's link (/s/<code>), which
// records the school on their account at sign up (/api/trial/start). This is
// for the rest: a parent who heard about it at the school gate and came in
// through the front door, or signed up on a different phone. They type the
// code from the school's letter on Settings or the upgrade page.
//
// A family with no code is exactly as before: nothing here runs unless a
// parent types a code, and the sign up form is unchanged. The school is
// written once, onto an empty column, the same rule as the link: a second
// school's code never rewrites the first, so a school's count stays true.

type Mine = { linked: string | null; pass: boolean }

async function statusFor(userId: string): Promise<Mine> {
  const admin = createAdminClient()
  const { data: prof } = await admin.from('profiles').select('school_link').eq('id', userId).maybeSingle()
  const code = (prof as { school_link?: string | null } | null)?.school_link
  if (!code) return { linked: null, pass: false }
  const { data: link } = await admin.from('school_links').select('*').eq('code', code).maybeSingle()
  const l = link as { school_name?: string; active?: boolean; licensed_until?: string | null } | null
  return { linked: l?.school_name ?? null, pass: Boolean(l?.active) && passIsLive(l?.licensed_until ?? null, new Date().toISOString()) }
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  try {
    return NextResponse.json(await statusFor(user.id))
  } catch {
    return NextResponse.json({ linked: null, pass: false })
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const code = codeFromTyped(typeof body.code === 'string' ? body.code : null)
  if (!code) return NextResponse.json({ error: 'Type the code from your school’s letter.' }, { status: 400 })

  const admin = createAdminClient()
  const { data: link } = await admin.from('school_links').select('code, school_name').eq('code', code).eq('active', true).maybeSingle()
  if (!link) return NextResponse.json({ error: 'That code did not match a school. Check the letter, or ask the school office.' }, { status: 404 })

  const before = await statusFor(user.id)
  if (before.linked) {
    return NextResponse.json({ error: `Your account is already with ${before.linked}.`, ...before }, { status: 409 })
  }
  const { error } = await admin.from('profiles').update({ school_link: code }).eq('id', user.id).is('school_link', null)
  if (error) return NextResponse.json({ error: 'That did not save. Try again in a moment.' }, { status: 500 })
  return NextResponse.json({ ok: true, ...(await statusFor(user.id)) })
}
