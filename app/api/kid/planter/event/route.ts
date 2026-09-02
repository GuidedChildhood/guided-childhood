import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { applyGardenEvent, type ClientEvent } from '@/lib/planter/server'

// One event from the child's greenhouse. The client reports what the child
// did (a drag to the bed, a tap at the window, a minute of play); the server
// decides what it is worth and when it ends, on its own clock, and answers
// with the whole garden. Token scoped, no account, no model.

export const dynamic = 'force-dynamic'

const KINDS = new Set(['tick', 'nap_start', 'sunlight_start', 'ambient_start', 'shade', 'seen', 'ask_wake', 'ask_seen'])

function parseEvent(body: Record<string, unknown>): ClientEvent | null {
  const kind = String(body.kind ?? '')
  if (!KINDS.has(kind)) return null
  if (kind === 'nap_start' || kind === 'sunlight_start' || kind === 'ambient_start') {
    const plantId = typeof body.plantId === 'string' ? body.plantId : ''
    if (!/^p\d{1,2}$/.test(plantId)) return null
    return { kind, plantId }
  }
  if (kind === 'shade') {
    const plantId = typeof body.plantId === 'string' ? body.plantId : ''
    if (!/^p\d{1,2}$/.test(plantId)) return null
    return { kind, plantId, on: Boolean(body.on) }
  }
  return { kind } as ClientEvent
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }
  const token = typeof body.token === 'string' ? body.token : ''
  if (!/^[0-9a-f]{18}$/.test(token)) return NextResponse.json({ error: 'unknown link' }, { status: 404 })
  const ev = parseEvent(body)
  if (!ev) return NextResponse.json({ error: 'bad event' }, { status: 400 })

  const admin = createAdminClient()
  const { data: link } = await admin
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })
  const { data: child } = await admin
    .from('children').select('name, age_band, date_of_birth').eq('id', link.child_id).maybeSingle()
  const view = await applyGardenEvent(admin, link.user_id as string, link.child_id as string, child ?? {}, ev)
  return NextResponse.json(view)
}
