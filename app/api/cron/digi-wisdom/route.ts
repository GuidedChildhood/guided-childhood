import { rebuildWisdom } from '@/lib/digi/wisdom'
import { NextResponse } from 'next/server'

// Weekly rebuild of the aggregate wisdom corpus. Vercel Cron hits this and,
// when it is a genuine cron call, distils the latest cross family wins into the
// digi_wisdom table so DiGi's shared track record stays current. Same auth
// pattern as the other crons: Vercel adds Authorization: Bearer <CRON_SECRET>.

export const maxDuration = 180
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  try {
    const result = await rebuildWisdom()
    return NextResponse.json({ ok: true, signals: result.signals, written: result.written })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Wisdom rebuild failed' }, { status: 502 })
  }
}
