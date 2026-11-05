import { NextResponse } from 'next/server'
import { museAuthorised, KEY_REFUSED } from '@/lib/muse/connector'

// GET /api/muse/ping: the "Test request path" in Muse's credentials step.
// Muse sends a GET here with the key to check the setup, and wants a 200 for a
// working key and nothing changed. So it checks the key exactly as the real
// routes do, calls no model, reads and writes no table, and is never counted.

export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  if (!museAuthorised(request)) return NextResponse.json(KEY_REFUSED, { status: 401 })
  return NextResponse.json({ ok: true, connector: 'Guided Childhood' })
}
