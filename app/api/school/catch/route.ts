import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractSchoolItems, isAcceptedImageType, type AcceptedImageType } from '@/lib/school/extract'

// SNAP IT OR PASTE IT: the way in that needs no forwarding at all.
//
// Justin, 17 September 2026: "Is there a way without having to set up forward?"
//
// Forwarding, even forwarding one email, asks a parent to leave this app, find
// the message and send it somewhere. A photo asks them to point their phone at
// whatever is in front of them. It needs no rule, no address, no permission and
// no email provider, and it reaches the half of school communication that has
// never been an email at all: the letter in the book bag, the note in the
// reading record, the poster by the gate, the sheet handed out at pickup.
//
// THIS ROUTE DOES NOT SAVE ANYTHING. It reads and returns what it found. The
// parent is standing there holding the letter, which is exactly the moment to
// show them "here is what I read, add these?" rather than to write four
// reminders behind their back and hope the dates were right. Saving goes
// through the existing POST /api/school/actions, one call per confirmed item,
// which already does the validation, the case insensitive same day dedupe and
// the per child ownership check. Two ways to write a school action would have
// been the drift this codebase keeps warning about.
//
// THE IMAGE IS NEVER STORED. It is read once, in memory, and the reply carries
// the items rather than the picture. Same promise as the email path: we keep
// what you have to do, not the thing that told us.

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Roughly 5 MB of base64, which is about a 3.7 MB image. The browser downscales
// to 1600px and re-encodes as JPEG before sending, so a real photo arrives far
// under this; the cap is here for anything that skips that path.
const MAX_BASE64_CHARS = 5_000_000
const MAX_TEXT_CHARS = 20_000

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'invalid json' }, { status: 400 })

  const text = typeof body.text === 'string' ? body.text.trim().slice(0, MAX_TEXT_CHARS) : ''
  const rawImage = body.image as { media_type?: unknown; base64?: unknown } | undefined

  let image: { mediaType: AcceptedImageType; base64: string } | undefined
  if (rawImage && typeof rawImage.base64 === 'string') {
    if (!isAcceptedImageType(rawImage.media_type)) {
      return NextResponse.json({
        ok: false,
        message: 'That picture is in a format we cannot read. Try taking it again with the camera.',
      }, { status: 400 })
    }
    if (rawImage.base64.length > MAX_BASE64_CHARS) {
      return NextResponse.json({
        ok: false,
        message: 'That picture is too big. Try again and it will be shrunk automatically.',
      }, { status: 413 })
    }
    image = { mediaType: rawImage.media_type, base64: rawImage.base64 }
  }

  if (!text && !image) {
    return NextResponse.json({ error: 'nothing to read' }, { status: 400 })
  }

  // The school's name if we know it, so the extractor reads the message in the
  // right context. Nothing here requires a connection to exist: the whole point
  // of this route is that it works for a parent who has never set one up.
  const { data: conn } = await supabase
    .from('school_connections')
    .select('school_name')
    .eq('user_id', user.id)
    .maybeSingle()

  const items = (await extractSchoolItems({
    schoolName: conn?.school_name?.trim() || 'your school',
    body: text,
    image,
  })).slice(0, 8)

  return NextResponse.json({ ok: true, items })
}
