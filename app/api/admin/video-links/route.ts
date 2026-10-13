import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { codeFromTitle, normaliseLinkCode } from '@/lib/video/link'

// Add a film link, or switch one off (migration 372). Founder only, same rule
// as the page that calls it, so a new film gets its link without anybody
// writing to the database by hand.

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

async function founder() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user && (user.email ?? '').toLowerCase() === FOUNDER_EMAIL ? user : null
}

export async function POST(req: NextRequest) {
  if (!(await founder())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const title = typeof body.title === 'string' ? body.title.trim().replace(/\s+/g, ' ') : ''
  if (title.length < 2 || title.length > 120) {
    return NextResponse.json({ error: 'Give the film a name you will recognise.' }, { status: 400 })
  }
  const base = codeFromTitle(title)
  if (!base) return NextResponse.json({ error: 'That name needs at least a few letters in it.' }, { status: 400 })

  // The same film posted twice (TikTok and Reels, say) gets two links, so the
  // second becomes name-2 rather than sharing the first one's numbers.
  const admin = createAdminClient()
  for (let n = 1; n <= 20; n++) {
    const code = n === 1 ? base : normaliseLinkCode(`${base.slice(0, 37)}-${n}`)
    if (!code) break
    const { error } = await admin.from('video_links').insert({ code, title })
    if (!error) return NextResponse.json({ ok: true, code })
    if (error.code !== '23505') return NextResponse.json({ error: 'Could not save that film just now.' }, { status: 500 })
  }
  return NextResponse.json({ error: 'Too many films with that name already.' }, { status: 409 })
}

export async function PATCH(req: NextRequest) {
  if (!(await founder())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const code = normaliseLinkCode(body.code)
  if (!code || typeof body.active !== 'boolean') return NextResponse.json({ error: 'bad request' }, { status: 400 })
  const { error } = await createAdminClient().from('video_links').update({ active: body.active }).eq('code', code)
  if (error) return NextResponse.json({ error: 'Could not change that link just now.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
