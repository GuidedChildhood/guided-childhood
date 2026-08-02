import { NextRequest, NextResponse } from 'next/server'
import { sendPush } from '@/lib/push/send'

// The HTTP door onto sendPush, for anything genuinely outside this deployment.
//
// Everything inside it calls lib/push/send directly now. This route used to
// hold the whole implementation, and thirty other files reached it by fetching
// their own deployment over the public internet, which cost two outages: the
// per deployment host Vercel Cron invokes sits behind Deployment Protection and
// answered 401, and the calling routes replied 200 with the failure tucked
// inside their bodies. See the note at the top of lib/push/send.ts.

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, body, url, userId, audience, slot, urgent } = await req.json()
  const result = await sendPush({ title, body, url, userId, audience, slot, urgent })

  // The shape callers already expect, plus the two numbers that were missing.
  // `stale` is kept as an alias of `pruned` so anything still reading the old
  // key keeps working.
  return NextResponse.json({ ...result, stale: result.pruned })
}
