import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { codeFromTitle, normaliseLinkCode, isChannel, LINK_CHANNELS } from '@/lib/video/link'

// Add a source link, or switch one off (migrations 372 and 379). Founder only,
// same rule as the page that calls it, so a new film, LinkedIn post, group
// seed or Facebook post gets its link without anybody writing to the database
// by hand.
//
// Since 379 a link has a channel, and may be given an exact code: the Sunday
// batch names a Facebook post's code fb-<mmdd>-<slug> and prints it in the
// caption, so the page must be able to make that exact code rather than one
// guessed from the title.

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
    return NextResponse.json({ error: 'Give the link a name you will recognise.' }, { status: 400 })
  }
  const channel = body.channel === undefined ? 'film' : body.channel
  if (!isChannel(channel) || !LINK_CHANNELS.includes(channel)) {
    return NextResponse.json({ error: 'Pick where the link will be posted.' }, { status: 400 })
  }
  // A film row leaves the channel to its default, so this still saves on a
  // database that has not had 379 yet.
  const row = (code: string): { code: string; title: string; channel?: string } => (channel === 'film' ? { code, title } : { code, title, channel })
  const admin = createAdminClient()

  // An exact code, as the Sunday batch prints it. Taken or not, never renamed:
  // the caption already says this code.
  const exact = typeof body.code === 'string' && body.code.trim() ? normaliseLinkCode(body.code) : null
  if (typeof body.code === 'string' && body.code.trim() && !exact) {
    return NextResponse.json({ error: 'A code is small letters, numbers and single hyphens, 3 to 40 long.' }, { status: 400 })
  }
  if (exact) {
    const { error } = await admin.from('video_links').insert(row(exact))
    if (!error) return NextResponse.json({ ok: true, code: exact })
    if (error.code === '23505') return NextResponse.json({ error: 'That code is already on this page.' }, { status: 409 })
    return NextResponse.json({ error: 'Could not save that link just now.' }, { status: 500 })
  }

  const base = codeFromTitle(title)
  if (!base) return NextResponse.json({ error: 'That name needs at least a few letters in it.' }, { status: 400 })

  // The same film posted twice (TikTok and Reels, say) gets two links, so the
  // second becomes name-2 rather than sharing the first one's numbers.
  for (let n = 1; n <= 20; n++) {
    const code = n === 1 ? base : normaliseLinkCode(`${base.slice(0, 37)}-${n}`)
    if (!code) break
    const { error } = await admin.from('video_links').insert(row(code))
    if (!error) return NextResponse.json({ ok: true, code })
    if (error.code !== '23505') return NextResponse.json({ error: 'Could not save that link just now.' }, { status: 500 })
  }
  return NextResponse.json({ error: 'Too many links with that name already.' }, { status: 409 })
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
