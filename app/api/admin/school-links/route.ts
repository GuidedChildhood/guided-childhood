import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { codeFromSchoolName, normaliseLinkCode } from '@/lib/school/link'

// Add a school link, or switch one off (migration 353). Founder only, same
// rule as the page that calls it, so Justin can set up a pilot school himself
// without anybody writing to the database by hand.

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

async function founder() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user && (user.email ?? '').toLowerCase() === FOUNDER_EMAIL ? user : null
}

export async function POST(req: NextRequest) {
  if (!(await founder())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const name = typeof body.name === 'string' ? body.name.trim().replace(/\s+/g, ' ') : ''
  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: 'Type the school name as parents know it.' }, { status: 400 })
  }
  const base = codeFromSchoolName(name)
  if (!base) return NextResponse.json({ error: 'That name needs at least a few letters in it.' }, { status: 400 })

  // Two schools can share a name in different towns. The second becomes
  // name-2 rather than taking over the first one's families.
  const admin = createAdminClient()
  for (let n = 1; n <= 20; n++) {
    const code = n === 1 ? base : normaliseLinkCode(`${base.slice(0, 37)}-${n}`)
    if (!code) break
    const { error } = await admin.from('school_links').insert({ code, school_name: name })
    if (!error) return NextResponse.json({ ok: true, code })
    if (error.code !== '23505') return NextResponse.json({ error: 'Could not save that school just now.' }, { status: 500 })
  }
  return NextResponse.json({ error: 'Too many schools with that name already.' }, { status: 409 })
}

export async function PATCH(req: NextRequest) {
  if (!(await founder())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const code = normaliseLinkCode(body.code)
  if (!code || typeof body.active !== 'boolean') return NextResponse.json({ error: 'bad request' }, { status: 400 })
  const { error } = await createAdminClient().from('school_links').update({ active: body.active }).eq('code', code)
  if (error) return NextResponse.json({ error: 'Could not change that link just now.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
