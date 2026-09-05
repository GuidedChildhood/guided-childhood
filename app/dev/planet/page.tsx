import PlanetFriends from '@/components/planet/PlanetFriends'
import { resolveTheme } from '@/lib/kid/theme'
import { applyEvent, addMinutes, dockAllDevices, isMovable, isOutfit, isPartKey, isRoomKey, isWhere, newHome, type CodeMode, type DeviceKey, type FriendKey, type Tier, type Where } from '@/lib/planet/logic'
import { MISSION_DEFS } from '@/lib/planet/missions'

// The pretend code on the pretend card, one per shape, so the pad can be driven.
export const FIXTURE_CODES: Record<CodeMode, string[]> = { pictures: ['star', 'moon', 'rocket'], letters: ['m', 'o', 'o', 'n'] }
import type { HomeView } from '@/lib/planet/view'

// Dev fixture for Planet Friends: the home planet with a pretend save and no
// database, so every slot can be dragged and every overlay reached by
// Playwright. The same pure rules run locally in fixture mode.
//
//   ?tier=1|2|3        one Friend, two, or three (default 1)
//   ?age=3..16         the child's age, which decides who is still a baby (default 4)
//   ?energy=0..100     starting starlight for every Friend (default 100)
//   ?stage=0..5        how far the planet has grown (default 1)
//   ?phase=day|winddown|bedtime
//   ?rest=nap          every Friend already in the pod
//   ?grew=1            a while you were away card waiting
//   ?parts=rocket,tent  parts in the box, on top of the starters
//   ?placed=rocket@g1,moon@sky1  parts already on the planet
//   ?wearing=pebble:helmet  who wears what (the outfit is given if missing)
//   ?doing=spider_legs  missions already under way, the first on the board
//   ?landed=plant_seed a mission just approved, the reveal waiting
//   ?card=pictures|letters  the Comet card printed, in that shape (the code is FIXTURE_CODES)
//   ?room=kitchen|living|bedroom  open the Den in that room (slice 3a)
//   ?in=pebble:kitchen,bloop:bedroom  which room each Friend is in
//   ?held=pebble:apple  what a Friend holds (a thing, or its own phone as phone_pebble)
//   ?things=apple@k_t1,teddy@b_f1  things already on room spots
//   ?battery=pebble:20  a phone's battery; ?charging=pebble puts it on the shelf mid charge
//   ?accent=coral      the child's theme
// Never reachable in production (the dev layout gates on VERCEL_ENV).

export const dynamic = 'force-dynamic'

export default async function PlanetFixture({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  const tier: Tier = sp.tier === '3' ? 3 : sp.tier === '2' ? 2 : 1
  const now = new Date().toISOString()
  let home = newHome(tier, now, null)
  const energy = sp.energy !== undefined ? Math.max(0, Math.min(100, Number(sp.energy))) : 100
  const stage = sp.stage !== undefined ? Math.max(0, Math.min(5, Number(sp.stage))) : 1
  home = { ...home, growthStage: stage, friends: home.friends.map(f => ({ ...f, energy })) }
  if (sp.rest === 'nap') for (const f of home.friends) home = applyEvent(home, { kind: 'nap_start', friend: f.key }, now)
  if (sp.grew === '1') home = { ...home, grewWhileAway: 25 }
  if (sp.parts) home = { ...home, rewards: [...home.rewards, ...sp.parts.split(',').filter(isPartKey).filter(p => !home.rewards.includes(p))] }
  if (sp.placed) for (const pair of sp.placed.split(',')) {
    const [part, slot] = pair.split('@')
    if (!isPartKey(part) || !slot) continue
    if (!home.rewards.includes(part)) home = { ...home, rewards: [...home.rewards, part] }
    home = applyEvent(home, { kind: 'part_place', part, slot }, now)
  }
  if (sp.wearing) for (const pair of sp.wearing.split(',')) {
    const [friend, outfit] = pair.split(':')
    if (!isOutfit(outfit) || !home.friends.some(f => f.key === friend)) continue
    if (!home.build.outfits.includes(outfit)) home = { ...home, build: { ...home.build, outfits: [...home.build.outfits, outfit] } }
    home = applyEvent(home, { kind: 'outfit_set', friend: friend as FriendKey, outfit }, now)
  }
  // The Den (slice 3a).
  if (sp.in) for (const pair of sp.in.split(',')) {
    const [friend, where] = pair.split(':')
    if (isWhere(where) && home.friends.some(f => f.key === friend)) home = applyEvent(home, { kind: 'room_move', friend: friend as FriendKey, where }, now)
  }
  if (sp.things) for (const pair of sp.things.split(',')) {
    const [thing, spot] = pair.split('@')
    const room = spot?.startsWith('k_') ? 'kitchen' : spot?.startsWith('l_') ? 'living' : spot?.startsWith('b_') ? 'bedroom' : null
    if (!isMovable(thing) || !room || !isRoomKey(room)) continue
    if (isPartKey(thing) && !home.rewards.includes(thing)) home = { ...home, rewards: [...home.rewards, thing] }
    home = applyEvent(home, { kind: 'thing_place', thing, room, spot }, now)
  }
  if (sp.battery) for (const pair of sp.battery.split(',')) {
    const [friend, level] = pair.split(':')
    const key = `phone_${friend}` as DeviceKey
    const d = home.world.devices[key]
    if (d) home = { ...home, world: { ...home.world, devices: { ...home.world.devices, [key]: { ...d, battery: Math.max(0, Math.min(100, Number(level) || 0)) } } } }
  }
  if (sp.charging) for (const friend of sp.charging.split(',')) {
    const key = `phone_${friend}` as DeviceKey
    const d = home.world.devices[key]
    if (d) home = { ...home, world: { ...home.world, devices: { ...home.world.devices, [key]: { ...d, at: 'shelf', chargedAt: addMinutes(now, 4) } } } }
  }
  if (sp.held) for (const pair of sp.held.split(',')) {
    const [friend, thing] = pair.split(':')
    if ((isMovable(thing)) && home.friends.some(f => f.key === friend)) home = applyEvent(home, { kind: 'thing_give', thing: thing as never, friend: friend as FriendKey }, now)
  }
  if (sp.doing) for (const key of sp.doing.split(',')) if (MISSION_DEFS[key]) home = applyEvent(home, { kind: 'mission_start', key }, now, MISSION_DEFS)
  if (sp.landed && MISSION_DEFS[sp.landed]) {
    home = applyEvent(home, { kind: 'mission_start', key: sp.landed }, now, MISSION_DEFS)
    home = applyEvent(home, { kind: 'mission_approve', key: sp.landed }, now, MISSION_DEFS)
  }
  const phase = sp.phase === 'winddown' ? 'winddown' : sp.phase === 'bedtime' ? 'bedtime' : 'day'
  if (phase !== 'day') home = dockAllDevices(home, now)
  const initialWhere: Where = isWhere(sp.room) ? sp.room : 'outdoors'
  const view: HomeView = {
    home, serverNow: now, tier,
    childAge: sp.age !== undefined ? Math.max(0, Math.min(16, Number(sp.age))) : 4,
    bedtime: { phase, startMin: 19 * 60, endMin: 7 * 60, minutesNow: phase === 'bedtime' ? 20 * 60 : phase === 'winddown' ? 18 * 60 + 40 : 15 * 60, windowUntil: null },
    ask: null, screenAsk: null, starMinutes: 5,
    cards: sp.card === 'pictures' || sp.card === 'letters' ? [{ key: 'comet_card', mode: sp.card, printed: true }] : [],
  }
  return (
    <PlanetFriends
      token={null}
      fixture
      initial={view}
      theme={resolveTheme(sp.accent ?? null)}
      childName="Teo"
      initialWhere={initialWhere}
      fixtureAnswers={sp.card === 'pictures' || sp.card === 'letters' ? { comet_card: FIXTURE_CODES[sp.card] } : undefined}
    />
  )
}
