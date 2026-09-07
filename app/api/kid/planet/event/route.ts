import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { applyHomeEvent, type ClientEvent } from '@/lib/planet/server'
import { FRIEND_KEYS, isDeviceKey, isMovable, isPlanetKey, isRoomKey, isSelf, isWhere, type FriendKey } from '@/lib/planet/logic'

// One event from the child's planet. The client reports what the child did
// (a drag to the pod, a tap at the sun catcher, a minute of play); the server
// decides what it is worth and when it ends, on its own clock, and answers
// with the whole planet. Token scoped, no account, no model.

export const dynamic = 'force-dynamic'

const KINDS = new Set(['tick', 'nap_start', 'sunlight_start', 'ambient_start', 'cloud', 'seen', 'ask_wake', 'ask_seen', 'mission_start', 'mission_claim', 'mission_seen', 'part_place', 'part_move', 'part_remove', 'outfit_set', 'self_set', 'room_move', 'thing_place', 'thing_home', 'thing_give', 'eat', 'snap', 'device_dock', 'planet_move'])

function parseEvent(body: Record<string, unknown>): ClientEvent | null {
  const kind = String(body.kind ?? '')
  if (!KINDS.has(kind)) return null
  const friend = typeof body.friend === 'string' && (FRIEND_KEYS as string[]).includes(body.friend) ? (body.friend as FriendKey) : null
  if (kind === 'nap_start' || kind === 'sunlight_start' || kind === 'ambient_start') {
    if (!friend) return null
    return { kind, friend }
  }
  if (kind === 'cloud') {
    if (!friend) return null
    return { kind, friend, on: Boolean(body.on) }
  }
  // The self (slice 3b): four small indices, checked here and again in the rules.
  if (kind === 'self_set') {
    return isSelf(body.self) ? { kind, self: { skin: body.self.skin, hair: body.self.hair, hairColour: body.self.hairColour, suit: body.self.suit } } : null
  }
  // The Den (slice 3a): the client asks, the rules decide.
  if (kind === 'room_move') {
    if (!friend || !isWhere(body.where)) return null
    return { kind, friend, where: body.where }
  }
  if (kind === 'thing_place') {
    if (!isMovable(body.thing) || !isRoomKey(body.room) || typeof body.spot !== 'string' || !/^[a-z]_[a-z]\d$/.test(body.spot)) return null
    return { kind, thing: body.thing, room: body.room, spot: body.spot }
  }
  if (kind === 'thing_home') {
    if (!isMovable(body.thing)) return null
    return { kind, thing: body.thing }
  }
  if (kind === 'thing_give') {
    if (!friend || !isMovable(body.thing) || (body.thing as string).length > 24) return null
    return { kind, thing: body.thing as never, friend }
  }
  if (kind === 'eat' || kind === 'snap') {
    if (!friend) return null
    return { kind, friend }
  }
  if (kind === 'device_dock') {
    if (!isDeviceKey(body.device)) return null
    return { kind, device: body.device }
  }
  if (kind === 'planet_move') {
    // A planet dragged somewhere in the sky (slice 3c): a key and two numbers, clamped again in the rules.
    const planet = body.planet
    const x = Number(body.x)
    const y = Number(body.y)
    if (!isPlanetKey(planet) || !Number.isFinite(x) || !Number.isFinite(y)) return null
    return { kind, planet, x, y }
  }
  if (kind === 'mission_start' || kind === 'mission_claim' || kind === 'mission_seen') {
    const key = typeof body.key === 'string' && /^[a-z_]{2,32}$/.test(body.key) ? body.key : null
    if (!key) return null
    if (kind === 'mission_claim') {
      const code = Array.isArray(body.code) ? body.code.filter((t): t is string => typeof t === 'string' && t.length <= 8).slice(0, 12) : undefined
      return { kind, key, code }
    }
    return { kind, key }
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
  const view = await applyHomeEvent(admin, link.user_id as string, link.child_id as string, child ?? {}, ev)
  return NextResponse.json(view)
}
