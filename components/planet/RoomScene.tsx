'use client'

import { useRef, useState } from 'react'
import type { Device, DeviceKey, Friend, FriendKey, Mood, Movable, Outfit, RoomKey, RoomPlaced, ThingKey, World, Self } from '@/lib/planet/logic'
import { PART_ZONE, ROOM_SPOTS, batteryNow, charging, deviceOf, isDeviceKey, isGrownUp, isPartKey, isThingKey, roomZoneOf } from '@/lib/planet/logic'
import { friendArt } from '@/lib/planet/registry'
import FriendFigure from './FriendFigure'
import SelfFigure from './SelfFigure'
import { ROOM_TITLES } from '@/lib/planet/world'
import PartArt from './PartArt'
import { Furniture, OUTFIT_ICON, PhoneArt, ThingArt } from './ThingArt'
import { SCENE_H, SCENE_W, sceneFromClient } from './scene'
import type { Carry, Sky } from './HomePlanet'

// A room of the Den (slice 3a), drawn from data in the same 390 by 560 frame
// as the planet, so the two swap in the same stage. The wall, the window, the
// furniture that stays, the spots a thing can go, the Friends who are in
// this room, and the doors. Everything that looks liftable lifts. The scene
// knows where things are and what they landed on; what that MEANS is the
// root's business, so this file has callbacks and no rules.

const INK = '#1A1A2E'
export const FLOOR_Y = 440
const STAND_Y = 480

const WALLS: Record<RoomKey, { wall: string; floor: string; skirting: string }> = {
  kitchen: { wall: '#FFF1D6', floor: '#EAD9BF', skirting: '#F7E4C4' },
  living: { wall: '#E3EEF7', floor: '#D9C7B0', skirting: '#CFE0EE' },
  bedroom: { wall: '#EDE3F5', floor: '#D7CDE8', skirting: '#DCCBEB' },
  // Moonbase School: a dome with portholes; the Playground planet: open sky and orange ground (slice 3b).
  classroom: { wall: '#DCE9F5', floor: '#CFD8E3', skirting: '#C4D6E8' },
  playground: { wall: '#BFE0F7', floor: '#F2B36B', skirting: '#E59C4E' },
  // The far away planets (slice 3c). Outdoors the wall is the sky and the floor is the ground.
  launchpad: { wall: '#26305F', floor: '#B9C4D6', skirting: '#9AA6B8' },
  forest: { wall: '#BFE6F5', floor: '#6FAE5E', skirting: '#4F8F44' },
  dome: { wall: '#26305F', floor: '#3A4780', skirting: '#2B3568' },
  cafe: { wall: '#FDEBD3', floor: '#B8763F', skirting: '#D9A066' },
  studio: { wall: '#2B3568', floor: '#4C4C6E', skirting: '#3A3A5A' },
  igloos: { wall: '#DDEFF9', floor: '#FFFFFF', skirting: '#CFE8F5' },
  springs: { wall: '#F3B48E', floor: '#4A3A32', skirting: '#3A2A1E' },
  colours: { wall: '#E8F1FF', floor: '#B9E3A0', skirting: '#8FD1B4' },
}
const SKY_COLOUR: Record<Sky, string> = { day: '#B9DDF5', evening: '#F3B48E', night: '#141A3C' }

/** Where each room spot is drawn. Floor and table spots hold a thing by its feet, wall spots by its centre. */
export const ROOM_SPOT_POS: Record<string, { x: number; y: number }> = {
  k_t1: { x: 252, y: 356 }, k_t2: { x: 312, y: 356 }, k_f1: { x: 120, y: 528 }, k_f2: { x: 300, y: 532 }, k_w1: { x: 190, y: 112 },
  l_t1: { x: 322, y: 405 }, l_f1: { x: 110, y: 530 }, l_f2: { x: 330, y: 534 }, l_w1: { x: 215, y: 110 },
  b_t1: { x: 110, y: 250 }, b_f1: { x: 230, y: 530 }, b_f2: { x: 330, y: 534 }, b_w1: { x: 110, y: 130 }, b_w2: { x: 245, y: 190 },
  c_t1: { x: 110, y: 382 }, c_t2: { x: 250, y: 382 }, c_f1: { x: 120, y: 530 }, c_f2: { x: 330, y: 534 }, c_w1: { x: 330, y: 120 },
  p_t1: { x: 330, y: 416 }, p_f1: { x: 90, y: 530 }, p_f2: { x: 230, y: 534 }, p_f3: { x: 340, y: 530 }, p_w1: { x: 300, y: 110 },
  s_f1: { x: 200, y: 530 }, s_f2: { x: 300, y: 532 }, s_w1: { x: 200, y: 110 },
  w_f1: { x: 70, y: 532 }, w_f2: { x: 350, y: 540 }, w_w1: { x: 300, y: 120 },
  o_f1: { x: 200, y: 530 }, o_f2: { x: 330, y: 534 }, o_w1: { x: 330, y: 130 },
  f_t1: { x: 110, y: 396 }, f_t2: { x: 220, y: 396 }, f_f1: { x: 270, y: 536 }, f_w1: { x: 250, y: 110 },
  n_t1: { x: 250, y: 400 }, n_f1: { x: 150, y: 532 }, n_w1: { x: 340, y: 120 },
  i_f1: { x: 160, y: 540 }, i_f2: { x: 250, y: 545 }, i_w1: { x: 300, y: 110 },
  v_f1: { x: 60, y: 535 }, v_f2: { x: 345, y: 540 }, v_w1: { x: 300, y: 110 },
  r_f1: { x: 200, y: 540 }, r_f2: { x: 300, y: 548 }, r_w1: { x: 60, y: 200 },
}
const SWING = { x: 96, hit: { x: 40, y: 300, w: 112, h: 140 } }
const SLIDE = { x: 226, hit: { x: 168, y: 330, w: 130, h: 110 } }
const SANDPIT = { x: 150, y: 520, hit: { x: 84, y: 494, w: 132, h: 44 } }
const PARK_BENCH = { x: 330, hit: { x: 296, y: 396, w: 68, h: 46 } }
const SHELF = { x: 285, y: 150, hit: { x: 215, y: 110, w: 140, h: 70 } }
const FRIDGE = { x: 91, hit: { x: 50, y: 240, w: 84, h: 200 } }
const FRIDGE_INSIDE = [{ x: 91, y: 296 }, { x: 91, y: 336 }, { x: 91, y: 376 }, { x: 91, y: 416 }]
const TOYBOX = { x: 91, y: 522, hit: { x: 50, y: 470, w: 84, h: 60 } }
const TOYBOX_INSIDE = [{ x: 62, y: 514 }, { x: 93, y: 508 }, { x: 124, y: 514 }]
const WARDROBE = { x: 340, hit: { x: 296, y: 200, w: 88, h: 240 } }
const WARDROBE_INSIDE = [{ x: 324, y: 262 }, { x: 356, y: 262 }, { x: 324, y: 302 }, { x: 356, y: 302 }]
const BEDS = [{ x: 111, hit: { x: 52, y: 310, w: 118, h: 130 } }, { x: 235, hit: { x: 176, y: 310, w: 118, h: 130 } }]
const SOFA = { x: 130, hit: { x: 56, y: 366, w: 148, h: 76 } }
const DOOR_LEFT = { x: 22, hit: { x: -10, y: 300, w: 58, h: 210 } }
// The far away planets (slice 3c): the pieces a Friend can be dropped on.
const GANTRY = { x: 150, hit: { x: 100, y: 300, w: 100, h: 140 } }
const ROVER = { x: 330, hit: { x: 272, y: 360, w: 116, h: 80 } }
const ROPE = { x: 150, hit: { x: 120, y: 300, w: 60, h: 140 } }
const POND = { x: 250, y: 520, hit: { x: 184, y: 494, w: 132, h: 48 } }
const DECKCHAIRS = [{ x: 120, hit: { x: 86, y: 380, w: 70, h: 60 } }, { x: 210, hit: { x: 176, y: 380, w: 70, h: 60 } }]
const CAFE_TABLES = [{ x: 110, hit: { x: 76, y: 380, w: 70, h: 64 } }, { x: 220, hit: { x: 186, y: 380, w: 70, h: 64 } }]
const CUSHIONS = { x: 150, y: 526, hit: { x: 110, y: 486, w: 80, h: 44 } }
const STUDIO_DESK = { x: 250, hit: { x: 200, y: 370, w: 100, h: 74 } }
const IGLOOS = [{ x: 100, hit: { x: 48, y: 380, w: 104, h: 64 } }, { x: 340, hit: { x: 288, y: 380, w: 104, h: 64 } }]
const ICE_SLIDE = { x: 220, hit: { x: 162, y: 330, w: 130, h: 110 } }
const POOLS = [{ x: 120, y: 500, hit: { x: 62, y: 480, w: 116, h: 40 } }, { x: 270, y: 500, hit: { x: 212, y: 480, w: 116, h: 40 } }]
const STONES = { x: 195, y: 545, hit: { x: 110, y: 530, w: 170, h: 30 } }
const RAINBOW_SLIDE = { x: 110, hit: { x: 52, y: 330, w: 130, h: 110 } }
const CLOUD_BED = { x: 260, hit: { x: 208, y: 390, w: 110, h: 50 } }
const DOOR_RIGHT = { x: 368, hit: { x: 332, y: 300, w: 68, h: 210 } }

export type RoomFurniture = 'fridge' | 'toybox' | 'wardrobe' | 'cooker' | 'picture' | 'music_box' | 'window' | 'lamp' | 'shelf' | 'mobile' | 'bookshelf' | 'board' | 'digi' | 'globe' | 'books' | 'tree' | 'sign' | 'launchpad'
  | 'fuel_pump' | 'tools' | 'burrow' | 'telescope' | 'star_map' | 'counter' | 'menu' | 'feed_wall' | 'dome_tool' | 'ring_light' | 'snowman' | 'warm_hut' | 'volcano' | 'lava_rock' | 'steam' | 'paint_pots' | 'sun_shower'
export type FriendTarget = 'door_left' | 'door_right' | 'bed' | 'sofa' | 'swing' | 'slide' | 'sandpit' | 'bench'
  | 'gantry' | 'rover' | 'rope' | 'pond' | 'deckchair' | 'cafe_table' | 'cushions' | 'studio_desk' | 'igloo' | 'iceslide' | 'pool' | 'stones' | 'rainbowslide' | 'cloudbed'
type Rect = { x: number; y: number; w: number; h: number }
/** Where a dropped Friend lands in each room, tested in order. The doors are tested first, before these. */
const FRIEND_DROPS: Partial<Record<RoomKey, { target: FriendTarget; hit: Rect }[]>> = {
  bedroom: BEDS.map(b => ({ target: 'bed' as const, hit: b.hit })),
  living: [{ target: 'sofa', hit: SOFA.hit }],
  playground: [{ target: 'swing', hit: SWING.hit }, { target: 'slide', hit: SLIDE.hit }, { target: 'sandpit', hit: SANDPIT.hit }, { target: 'bench', hit: PARK_BENCH.hit }],
  launchpad: [{ target: 'gantry', hit: GANTRY.hit }, { target: 'rover', hit: ROVER.hit }],
  forest: [{ target: 'rope', hit: ROPE.hit }, { target: 'pond', hit: POND.hit }],
  dome: DECKCHAIRS.map(d => ({ target: 'deckchair' as const, hit: d.hit })),
  cafe: [...CAFE_TABLES.map(t => ({ target: 'cafe_table' as const, hit: t.hit })), { target: 'cushions', hit: CUSHIONS.hit }],
  studio: [{ target: 'studio_desk', hit: STUDIO_DESK.hit }],
  igloos: [...IGLOOS.map(g => ({ target: 'igloo' as const, hit: g.hit })), { target: 'iceslide', hit: ICE_SLIDE.hit }],
  springs: [...POOLS.map(w => ({ target: 'pool' as const, hit: w.hit })), { target: 'stones', hit: STONES.hit }],
  colours: [{ target: 'rainbowslide', hit: RAINBOW_SLIDE.hit }, { target: 'cloudbed', hit: CLOUD_BED.hit }],
}
/** Where a Friend stands, sits or swings on the piece it was dropped on, and the one animation it plays there. */
const POSES: Record<string, (i: number) => { x: number; y: number; scale: number; anim?: string }> = {
  sofa: () => ({ x: SOFA.x, y: FLOOR_Y - 12, scale: 0.8 }),
  swing: () => ({ x: SWING.x, y: FLOOR_Y - 36, scale: 0.8, anim: 'pl-swing' }),
  slide: () => ({ x: SLIDE.x - 20, y: FLOOR_Y - 70, scale: 0.8, anim: 'pl-slide' }),
  sandpit: () => ({ x: SANDPIT.x, y: SANDPIT.y - 2, scale: 0.7, anim: 'pl-dig' }),
  bench: () => ({ x: PARK_BENCH.x, y: FLOOR_Y - 20, scale: 0.8 }),
  gantry: () => ({ x: GANTRY.x + 28, y: FLOOR_Y - 12, scale: 0.72, anim: 'pl-launch' }),
  rover: () => ({ x: ROVER.x, y: FLOOR_Y - 34, scale: 0.66, anim: 'pl-wiggle' }),
  rope: () => ({ x: ROPE.x, y: FLOOR_Y - 40, scale: 0.78, anim: 'pl-swing' }),
  pond: () => ({ x: POND.x, y: POND.y - 4, scale: 0.68, anim: 'pl-bounce' }),
  deckchair: i => ({ x: DECKCHAIRS[i % 2].x + 6, y: FLOOR_Y - 16, scale: 0.74 }),
  cafe_table: i => ({ x: CAFE_TABLES[i % 2].x, y: FLOOR_Y - 6, scale: 0.78 }),
  cushions: () => ({ x: CUSHIONS.x, y: CUSHIONS.y - 6, scale: 0.72 }),
  studio_desk: () => ({ x: STUDIO_DESK.x, y: FLOOR_Y - 6, scale: 0.78 }),
  igloo: i => ({ x: IGLOOS[i % 2].x, y: FLOOR_Y - 2, scale: 0.62 }),
  iceslide: () => ({ x: ICE_SLIDE.x - 20, y: FLOOR_Y - 70, scale: 0.8, anim: 'pl-slide' }),
  pool: i => ({ x: POOLS[i % 2].x, y: POOLS[i % 2].y + 2, scale: 0.66 }),
  stones: () => ({ x: STONES.x, y: STONES.y - 4, scale: 0.62, anim: 'pl-bounce' }),
  rainbowslide: () => ({ x: RAINBOW_SLIDE.x - 20, y: FLOOR_Y - 70, scale: 0.8, anim: 'pl-slide' }),
  cloudbed: () => ({ x: CLOUD_BED.x, y: FLOOR_Y - 32, scale: 0.74, anim: 'pl-breathe' }),
}
export type ThingTarget = { kind: 'friend'; friend: FriendKey } | { kind: 'spot'; spot: string } | { kind: 'shelf' } | { kind: 'home' }
type Drag = { kind: 'friend' | 'thing' | 'outfit'; id: string; x: number; y: number; startX: number; startY: number; moved: boolean }

/** Where the Friends in a room stand, centred by how many there are. */
export function roomStandingX(count: number): number[] {
  if (count <= 1) return [195]
  if (count === 2) return [140, 250]
  if (count === 3) return [100, 195, 290]
  return Array.from({ length: count }, (_, i) => Math.round(70 + (250 * i) / (count - 1)))
}

function inRect(p: { x: number; y: number }, r: { x: number; y: number; w: number; h: number }): boolean {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h
}

/** The free spot in this room a thing can go in, nearest to a point, within reach. */
export function nearestFreeRoomSpot(room: RoomKey, thing: Movable, placed: RoomPlaced[], p: { x: number; y: number }, reach = 80): string | null {
  const zone = roomZoneOf(thing)
  if (!zone) return null
  let best: string | null = null
  let bestD = reach
  for (const s of ROOM_SPOTS[room]) {
    if (s.zone !== zone) continue
    if (placed.some(x => x.room === room && x.spot === s.id && x.thing !== thing)) continue
    const pos = ROOM_SPOT_POS[s.id]
    if (!pos) continue
    const d = Math.hypot(p.x - pos.x, p.y - (pos.y - (zone === 'wall' ? 0 : 18)))
    if (d < bestD) { bestD = d; best = s.id }
  }
  return best
}

/** Which door leads where. The kitchen is the front door; the bedroom is the far end. On another planet the left door is the launch pad: the map. */
export const DOORS: Record<RoomKey, { left: 'outdoors' | 'map' | RoomKey; right: RoomKey | null }> = {
  kitchen: { left: 'outdoors', right: 'living' },
  living: { left: 'kitchen', right: 'bedroom' },
  bedroom: { left: 'living', right: null },
  classroom: { left: 'map', right: null },
  playground: { left: 'map', right: null },
  launchpad: { left: 'map', right: null },
  forest: { left: 'map', right: null },
  dome: { left: 'map', right: null },
  cafe: { left: 'map', right: null },
  studio: { left: 'map', right: null },
  igloos: { left: 'map', right: null },
  springs: { left: 'map', right: null },
  colours: { left: 'map', right: null },
}

export default function RoomScene({
  room, friends, allFriends, moods, childAge, wearing, held, devices, nowIso, sky, accent, placed, fridge, toybox, outfits, open, using, wiggle, lampOn, carrying, self = null,
  onDropFriend, onTapFriend, onThingDrop, onThingTap, onOutfitDrop, onFurnitureTap, onInteract, onSvg,
}: {
  room: RoomKey
  /** The child's own explorer (slice 3b), standing with the Friends wherever the view goes. */
  self?: Self | null
  /** The Friends in this room. */
  friends: Friend[]
  /** Every active Friend, for the phones on the shelf. */
  allFriends: Friend[]
  moods: Record<string, Mood>
  childAge: number
  wearing: Partial<Record<FriendKey, Outfit>>
  held: World['held']
  devices: World['devices']
  nowIso: string
  sky: Sky
  accent: string
  /** Things in this room, by spot. */
  placed: RoomPlaced[]
  /** Food in the fridge and toys in the toy box right now. */
  fridge: ThingKey[]
  toybox: ThingKey[]
  /** Outfits in the box, shown in the wardrobe. */
  outfits: Outfit[]
  open: 'fridge' | 'toybox' | 'wardrobe' | null
  /** A piece being used right now, for its one animation. */
  using: string | null
  wiggle: FriendKey | null
  lampOn: boolean
  /** Something carried from the box: the spots it can go light up. */
  carrying: Carry | null
  onDropFriend: (friend: FriendKey, target: FriendTarget | null) => void
  onTapFriend: (friend: FriendKey) => void
  onThingDrop: (thing: Movable, target: ThingTarget | null) => void
  onThingTap: (thing: Movable) => void
  onOutfitDrop: (outfit: Outfit, friend: FriendKey) => void
  onFurnitureTap: (kind: RoomFurniture) => void
  onInteract: () => void
  onSvg?: (el: SVGSVGElement | null) => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const colours = WALLS[room]
  const skyColour = SKY_COLOUR[sky]
  const night = sky === 'night'
  // The explorer takes the last place in the row, so the Friends keep their own hit testing by index.
  const xs = roomStandingX(friends.length + (self ? 1 : 0))
  const doors = DOORS[room]

  function toSvg(e: React.PointerEvent): { x: number; y: number } {
    const svg = svgRef.current
    return svg ? sceneFromClient(svg, e.clientX, e.clientY) : { x: 0, y: 0 }
  }
  function begin(e: React.PointerEvent, kind: Drag['kind'], id: string) {
    e.stopPropagation()
    onInteract()
    const p = toSvg(e)
    try { svgRef.current?.setPointerCapture(e.pointerId) } catch { /* not all browsers */ }
    setDrag({ kind, id, x: p.x, y: p.y, startX: p.x, startY: p.y, moved: false })
  }
  function move(e: React.PointerEvent) {
    if (!drag) return
    const p = toSvg(e)
    const moved = drag.moved || Math.hypot(p.x - drag.startX, p.y - drag.startY) > 6
    setDrag({ ...drag, x: p.x, y: p.y, moved })
  }
  /** The Friend a point is over, if any: within reach of the body. */
  function friendAt(p: { x: number; y: number }): FriendKey | null {
    let best: FriendKey | null = null
    let bestD = 62
    friends.forEach((f, i) => {
      if (f.cooldown) return
      const d = Math.hypot(p.x - xs[i], p.y - (STAND_Y - 60))
      if (d < bestD) { bestD = d; best = f.key }
    })
    return best
  }
  function end() {
    if (!drag) return
    const p = { x: drag.x, y: drag.y }
    if (drag.kind === 'friend') {
      const key = drag.id as FriendKey
      if (!drag.moved) onTapFriend(key)
      else if (inRect(p, DOOR_LEFT.hit)) onDropFriend(key, 'door_left')
      else if (doors.right && inRect(p, DOOR_RIGHT.hit)) onDropFriend(key, 'door_right')
      else onDropFriend(key, (FRIEND_DROPS[room] ?? []).find(d => inRect(p, d.hit))?.target ?? null)
    } else if (drag.kind === 'thing') {
      const thing = drag.id as Movable
      if (!drag.moved) onThingTap(thing)
      else {
        const over = friendAt(p)
        if (over) onThingDrop(thing, { kind: 'friend', friend: over })
        else if (room === 'kitchen' && inRect(p, SHELF.hit)) onThingDrop(thing, { kind: 'shelf' })
        else if (p.y > SCENE_H + 6 || p.y < -6 || p.x < -6 || p.x > SCENE_W + 6) onThingDrop(thing, { kind: 'home' })
        else {
          const spot = nearestFreeRoomSpot(room, thing, placed, p)
          onThingDrop(thing, spot ? { kind: 'spot', spot } : null)
        }
      }
    } else {
      const over = drag.moved ? friendAt(p) : null
      if (over) onOutfitDrop(drag.id as Outfit, over)
    }
    setDrag(null)
  }

  const draggingFriend = drag?.kind === 'friend'
  const draggingThing = drag?.kind === 'thing' ? (drag.id as Movable) : null
  const inRoom = placed.filter(x => x.room === room && ROOM_SPOT_POS[x.spot])
  const targets = carrying?.kind === 'part' ? ROOM_SPOTS[room].filter(s => s.zone === roomZoneOf(carrying.part) && !inRoom.some(x => x.spot === s.id)) : []
  const pos = (id: string) => ROOM_SPOT_POS[id]
  /** A tap on a fixed piece: it answers with its one animation and its line. */
  const tapPiece = (kind: RoomFurniture) => (e: React.PointerEvent) => { e.stopPropagation(); onInteract(); onFurnitureTap(kind) }

  /** One movable thing, drawn by its kind, feet at the origin (wall things centred). */
  const artOf = (thing: Movable, small = false) => {
    if (isThingKey(thing)) return <ThingArt thing={thing} small={small} />
    if (isDeviceKey(thing)) {
      const d = devices[thing]
      return d ? <PhoneArt colour={friendArt(d.owner).colour} battery={batteryNow(d, nowIso)} charging={charging(d, nowIso)} glow={night && d.at === 'shelf'} /> : null
    }
    return <PartArt part={thing} accent={accent} night={night} />
  }
  /** A thing the child can pick up: at a spot, in the fridge, in the toy box, on the shelf, in a hand. */
  const liftable = (thing: Movable, at: { x: number; y: number }, opts: { small?: boolean; hitY?: number; label?: string; hitR?: number } = {}) => {
    const dragging = draggingThing === thing
    const wall = isPartKey(thing) && PART_ZONE[thing] === 'sky'
    const p = dragging && drag ? { x: drag.x, y: drag.y + (wall ? 0 : 18) } : at
    return (
      <g key={thing} data-thing={thing} transform={`translate(${p.x} ${p.y})${dragging ? ' scale(1.1)' : ''}`}
        onPointerDown={e => begin(e, 'thing', thing)} style={{ cursor: 'grab', filter: dragging ? 'drop-shadow(0 8px 0 rgba(26,26,46,0.25))' : undefined }}
        aria-label={opts.label}>
        <circle cx={0} cy={opts.hitY ?? (wall ? 0 : -16)} r={opts.hitR ?? (opts.small ? 15 : 22)} fill="transparent" />
        {artOf(thing, opts.small)}
      </g>
    )
  }
  const phonesOnShelf = allFriends.map(f => devices[deviceOf(f.key)]).filter((d): d is Device => !!d && d.at === 'shelf')
  const shelfX = (i: number, n: number) => SHELF.x + (i - (n - 1) / 2) * 28

  return (
    <svg
      ref={el => { svgRef.current = el; onSvg?.(el) }}
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      width="100%"
      style={{ display: 'block', touchAction: 'none', userSelect: 'none', borderRadius: 24 }}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      aria-label={ROOM_TITLES[room]}
      role="img"
    >
      <defs>
        <radialGradient id="pl-glow">
          <stop offset="0" stopColor="#FFF3B0" stopOpacity={0.9} />
          <stop offset="1" stopColor="#FFF3B0" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* the wall and the floor */}
      <rect x={0} y={0} width={SCENE_W} height={FLOOR_Y} fill={colours.wall} />
      <rect x={0} y={FLOOR_Y} width={SCENE_W} height={SCENE_H - FLOOR_Y} fill={colours.floor} />
      <rect x={0} y={FLOOR_Y - 10} width={SCENE_W} height={10} fill={colours.skirting} stroke={INK} strokeWidth={1.5} />
      {room === 'kitchen' && [0, 1, 2].map(r => <path key={r} d={`M0 ${FLOOR_Y + 30 + r * 36} H${SCENE_W}`} stroke="#FFFFFF" strokeWidth={1.5} opacity={0.5} />)}
      {room === 'living' && [0, 1, 2, 3].map(r => <path key={r} d={`M0 ${FLOOR_Y + 22 + r * 30} H${SCENE_W}`} stroke="#B8763F" strokeWidth={1.2} opacity={0.35} />)}
      {room === 'living' && <g transform="translate(195 520)"><Furniture kind="rug" accent={accent} /></g>}

      {/* the wall pieces */}
      {room === 'kitchen' && (
        <g>
          <g transform="translate(105 100)" onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('window') }} style={{ cursor: 'pointer' }}><Furniture kind="window" sky={skyColour} /></g>
          <g transform="translate(175 262)"><Furniture kind="jars" /></g>
          <g data-shelf transform={`translate(${SHELF.x} ${SHELF.y})`} onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('shelf') }} style={{ cursor: 'pointer' }}>
            <rect x={-70} y={-40} width={140} height={60} fill="transparent" />
            <Furniture kind="shelf" glow={night} accent={accent} lit={!!draggingThing && isDeviceKey(draggingThing)} />
          </g>
        </g>
      )}
      {room === 'living' && (
        <g>
          <g transform="translate(331 98)" onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('window') }} style={{ cursor: 'pointer' }}><Furniture kind="window" sky={skyColour} /></g>
          <g transform="translate(120 120)" onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('picture') }} style={{ cursor: 'pointer' }}><Furniture kind="picture" using={using === 'picture'} /></g>
        </g>
      )}
      {room === 'bedroom' && (
        <g>
          <g transform="translate(245 96)" onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('window') }} style={{ cursor: 'pointer' }}><Furniture kind="window" sky={skyColour} /></g>
          <g transform="translate(330 110)" onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('mobile') }} style={{ cursor: 'pointer' }}><Furniture kind="mobile" /></g>
          <g transform="translate(172 250)" onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('lamp') }} style={{ cursor: 'pointer' }}><Furniture kind="lamp" on={lampOn || night} /></g>
          <g transform="translate(110 250)"><rect x={-30} y={-3} width={60} height={6} rx={3} fill="#D9A066" stroke={INK} strokeWidth={1.4} /></g>
        </g>
      )}
      {room === 'classroom' && (
        <g>
          <g transform="translate(330 120)" onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('window') }} style={{ cursor: 'pointer' }}><Furniture kind="porthole" sky={night ? '#141A3C' : '#2B3568'} /></g>
          <g transform="translate(150 130)" onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('board') }} style={{ cursor: 'pointer' }}><Furniture kind="board" using={using === 'board'} /></g>
        </g>
      )}
      {room === 'playground' && (
        <g>
          {/* the open sky: the star, a cloud, and the home planet small in the distance */}
          <circle cx={70} cy={70} r={26} fill="#F4C542" opacity={0.9} />
          <path d="M200 80 a14 14 0 0 1 24 -8 a10 10 0 0 1 12 16 h-40 a8 8 0 0 1 4 -8 z" fill="#FFFFFF" opacity={0.9} />
          <g onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('window') }} style={{ cursor: 'pointer' }}>
            <circle cx={330} cy={60} r={18} fill="#8FD1B4" stroke={INK} strokeWidth={1.8} />
            <ellipse cx={330} cy={60} rx={27} ry={7} fill="none" stroke="#F4C542" strokeWidth={2.2} />
          </g>
          <path d={`M0 ${FLOOR_Y - 60} q60 -30 120 -10 t140 -20 t130 10 V${FLOOR_Y} H0 z`} fill="#F7C98A" opacity={0.9} />
        </g>
      )}
      {room === 'launchpad' && (
        <g>
          {[[30, 40], [120, 90], [210, 50], [300, 30], [370, 120], [60, 200], [250, 180], [340, 240], [150, 260]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1.2} fill="#FFFFFF" opacity={0.8} />)}
          <g onPointerDown={tapPiece('window')} style={{ cursor: 'pointer' }}>
            <circle cx={330} cy={70} r={20} fill="#8FD1B4" stroke={INK} strokeWidth={1.8} />
            <ellipse cx={330} cy={70} rx={30} ry={8} fill="none" stroke="#F4C542" strokeWidth={2.2} />
          </g>
          <g data-tools transform="translate(64 290)" onPointerDown={tapPiece('tools')} style={{ cursor: 'pointer' }}><rect x={-40} y={-26} width={80} height={52} fill="transparent" /><Furniture kind="tools" using={using === 'tools'} /></g>
        </g>
      )}
      {room === 'forest' && (
        <g>
          <circle cx={70} cy={70} r={26} fill="#F4C542" opacity={0.9} />
          <path d="M200 80 a14 14 0 0 1 24 -8 a10 10 0 0 1 12 16 h-40 a8 8 0 0 1 4 -8 z" fill="#FFFFFF" opacity={0.9} />
          <path d={`M0 ${FLOOR_Y - 70} q80 -40 160 -20 t150 -30 t80 20 V${FLOOR_Y} H0 z`} fill="#5C9E4E" opacity={0.55} />
        </g>
      )}
      {room === 'dome' && (
        <g>
          <g transform="translate(195 120)" onPointerDown={tapPiece('window')} style={{ cursor: 'pointer' }}><Furniture kind="porthole" sky={night ? '#141A3C' : '#2B3568'} /></g>
          <g data-star-map transform="translate(80 210)" onPointerDown={tapPiece('star_map')} style={{ cursor: 'pointer' }}><rect x={-54} y={-40} width={108} height={80} fill="transparent" /><Furniture kind="star_map" using={using === 'star_map'} /></g>
        </g>
      )}
      {room === 'cafe' && (
        <g>
          <g data-menu transform="translate(330 150)" onPointerDown={tapPiece('menu')} style={{ cursor: 'pointer' }}><rect x={-40} y={-30} width={80} height={60} fill="transparent" /><Furniture kind="menu" using={using === 'menu'} /></g>
          <g transform="translate(90 110)" onPointerDown={tapPiece('window')} style={{ cursor: 'pointer' }}><Furniture kind="window" sky={skyColour} /></g>
          <g data-cafe-books transform="translate(60 300)" onPointerDown={tapPiece('books')} style={{ cursor: 'pointer' }}><rect x={-30} y={-70} width={60} height={72} fill="transparent" /><Furniture kind="books" using={using === 'books'} /></g>
        </g>
      )}
      {room === 'studio' && (
        <g data-feed-wall transform="translate(195 150)" onPointerDown={tapPiece('feed_wall')} style={{ cursor: 'pointer' }}><rect x={-90} y={-60} width={180} height={120} fill="transparent" /><Furniture kind="feed_wall" using={using === 'feed_wall'} /></g>
      )}
      {room === 'igloos' && (
        <g>
          <circle cx={60} cy={70} r={22} fill="#FFF6DD" opacity={0.95} />
          {[[140, 60], [220, 100], [300, 50], [360, 150], [40, 160], [190, 200]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.4} fill="#FFFFFF" />)}
          <path d={`M0 ${FLOOR_Y - 60} q70 -50 140 -10 t130 -30 t120 20 V${FLOOR_Y} H0 z`} fill="#EAF5FB" />
          <g data-warm-hut transform={`translate(70 ${FLOOR_Y - 40}) scale(0.8)`} onPointerDown={tapPiece('warm_hut')} style={{ cursor: 'pointer' }}><rect x={-46} y={-88} width={92} height={90} fill="transparent" /><Furniture kind="warm_hut" using={using === 'warm_hut'} /></g>
        </g>
      )}
      {room === 'springs' && (
        <g>
          <circle cx={320} cy={80} r={24} fill="#F4C542" opacity={0.9} />
          <g data-volcano transform={`translate(110 ${FLOOR_Y - 30})`} onPointerDown={tapPiece('volcano')} style={{ cursor: 'pointer' }}><rect x={-90} y={-130} width={180} height={132} fill="transparent" /><Furniture kind="volcano" using={using === 'volcano'} /></g>
        </g>
      )}
      {room === 'colours' && (
        <g>
          {['#E85D4A', '#F7A23B', '#F4C542', '#3E8F5A', '#4C9FD6', '#9B72CF'].map((c, i) => {
            const r = 230 - i * 13
            return <path key={c} d={`M${195 - r} 300 A${r} ${r} 0 0 1 ${195 + r} 300`} fill="none" stroke={c} strokeWidth={12} opacity={0.85} />
          })}
          <g data-sun-shower transform="translate(330 60)" onPointerDown={tapPiece('sun_shower')} style={{ cursor: 'pointer' }}><rect x={-60} y={-40} width={110} height={76} fill="transparent" /><Furniture kind="sun_shower" using={using === 'sun_shower'} /></g>
        </g>
      )}
      {/* what hangs on the wall spots */}
      {inRoom.filter(x => roomZoneOf(x.thing) === 'wall').map(x => liftable(x.thing, pos(x.spot)))}

      {/* the floor pieces */}
      {room === 'kitchen' && (
        <g>
          <g data-fridge transform={`translate(${FRIDGE.x} ${FLOOR_Y})`} onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('fridge') }} style={{ cursor: 'pointer' }}>
            <Furniture kind="fridge" open={open === 'fridge'} accent={accent} />
          </g>
          <g transform={`translate(175 ${FLOOR_Y})`} onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('cooker') }} style={{ cursor: 'pointer' }}><Furniture kind="cooker" using={using === 'cooker'} /></g>
          <g transform={`translate(282 ${FLOOR_Y})`}><Furniture kind="table" /></g>
        </g>
      )}
      {room === 'living' && (
        <g>
          <g transform={`translate(${SOFA.x} ${FLOOR_Y})`}><Furniture kind="sofa" accent={accent} lit={draggingFriend} /></g>
          <g transform={`translate(250 ${FLOOR_Y})`} onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('bookshelf') }} style={{ cursor: 'pointer' }}><Furniture kind="bookshelf" using={using === 'bookshelf'} /></g>
          <g transform="translate(250 220)" onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('music_box') }} style={{ cursor: 'pointer' }}><Furniture kind="music_box" using={using === 'music_box'} /></g>
          <g transform={`translate(322 ${FLOOR_Y}) scale(0.42)`}><Furniture kind="table" /></g>
        </g>
      )}
      {room === 'bedroom' && (
        <g>
          {BEDS.slice(0, Math.max(2, Math.min(2, friends.length))).map(b => (
            <g key={b.x} transform={`translate(${b.x} ${FLOOR_Y})`}><Furniture kind="bed" accent={accent} lit={draggingFriend} /></g>
          ))}
          <g data-wardrobe transform={`translate(${WARDROBE.x} ${FLOOR_Y})`} onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('wardrobe') }} style={{ cursor: 'pointer' }}>
            <Furniture kind="wardrobe" open={open === 'wardrobe'} />
          </g>
        </g>
      )}

      {room === 'classroom' && (
        <g>
          <g transform={`translate(110 ${FLOOR_Y})`}><Furniture kind="desk" /></g>
          <g transform={`translate(250 ${FLOOR_Y})`}><Furniture kind="desk" /></g>
          <g data-digi transform={`translate(330 ${FLOOR_Y})`} onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('digi') }} style={{ cursor: 'pointer' }}><Furniture kind="digi_desk" accent={accent} using={using === 'digi'} /></g>
          <g transform="translate(40 300)" onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('globe') }} style={{ cursor: 'pointer' }}><Furniture kind="globe" using={using === 'globe'} /></g>
          <g transform="translate(330 300)" onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('books') }} style={{ cursor: 'pointer' }}><Furniture kind="books" using={using === 'books'} /></g>
        </g>
      )}
      {room === 'playground' && (
        <g>
          <g transform={`translate(330 ${FLOOR_Y - 20})`} onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('tree') }} style={{ cursor: 'pointer' }}><Furniture kind="tree" using={using === 'tree'} /></g>
          <g data-swing transform={`translate(${SWING.x} ${FLOOR_Y})`}><Furniture kind="swing" accent={accent} using={using?.startsWith('swing:') ?? false} lit={draggingFriend} /></g>
          <g data-slide transform={`translate(${SLIDE.x} ${FLOOR_Y})`}><Furniture kind="slide" lit={draggingFriend} /></g>
          <g data-bench transform={`translate(${PARK_BENCH.x} ${FLOOR_Y})`}><Furniture kind="bench" lit={draggingFriend} /></g>
          <g transform="translate(40 300)" onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('sign') }} style={{ cursor: 'pointer' }}><Furniture kind="sign" /></g>
        </g>
      )}

      {room === 'launchpad' && (
        <g>
          <g data-gantry transform={`translate(${GANTRY.x} ${FLOOR_Y})`}><Furniture kind="gantry" accent={accent} using={using?.startsWith('gantry:') ?? false} lit={draggingFriend} /></g>
          <g data-fuel-pump transform={`translate(250 ${FLOOR_Y})`} onPointerDown={tapPiece('fuel_pump')} style={{ cursor: 'pointer' }}><rect x={-24} y={-80} width={76} height={82} fill="transparent" /><Furniture kind="fuel_pump" using={using === 'fuel_pump'} /></g>
          <g data-rover transform={`translate(${ROVER.x} ${FLOOR_Y})`}><Furniture kind="rover_garage" accent={accent} using={using?.startsWith('rover:') ?? false} lit={draggingFriend} /></g>
        </g>
      )}
      {room === 'forest' && (
        <g>
          <g data-rope transform={`translate(90 ${FLOOR_Y})`}><Furniture kind="big_tree" using={using?.startsWith('rope:') ?? false} lit={draggingFriend} /></g>
          <g transform={`translate(300 ${FLOOR_Y - 30}) scale(0.8)`} onPointerDown={tapPiece('tree')} style={{ cursor: 'pointer' }}><rect x={-40} y={-140} width={80} height={142} fill="transparent" /><Furniture kind="tree" using={using === 'tree'} /></g>
          <g data-burrow transform={`translate(355 ${FLOOR_Y + 30}) scale(0.8)`} onPointerDown={tapPiece('burrow')} style={{ cursor: 'pointer' }}><rect x={-46} y={-36} width={92} height={40} fill="transparent" /><Furniture kind="burrow" using={using === 'burrow'} /></g>
          <g data-pond transform={`translate(${POND.x} ${POND.y})`}><Furniture kind="pond" using={using?.startsWith('pond:') ?? false} lit={draggingFriend} /></g>
        </g>
      )}
      {room === 'dome' && (
        <g>
          <g data-telescope transform={`translate(318 ${FLOOR_Y})`} onPointerDown={tapPiece('telescope')} style={{ cursor: 'pointer' }}><rect x={-50} y={-122} width={100} height={124} fill="transparent" /><Furniture kind="telescope" using={using === 'telescope'} /></g>
          {DECKCHAIRS.map(d => <g key={d.x} data-deckchair transform={`translate(${d.x} ${FLOOR_Y})`}><Furniture kind="deckchair" accent={accent} lit={draggingFriend} /></g>)}
        </g>
      )}
      {room === 'cafe' && (
        <g>
          <g data-counter transform={`translate(330 ${FLOOR_Y})`} onPointerDown={tapPiece('counter')} style={{ cursor: 'pointer' }}><rect x={-66} y={-100} width={132} height={102} fill="transparent" /><Furniture kind="counter" using={using === 'counter'} /></g>
          {CAFE_TABLES.map(t => <g key={t.x} data-cafe-table transform={`translate(${t.x} ${FLOOR_Y})`}><Furniture kind="cafe_table" lit={draggingFriend} /></g>)}
          <g data-cushions transform={`translate(${CUSHIONS.x} ${CUSHIONS.y})`}><Furniture kind="cushions" accent={accent} lit={draggingFriend} /></g>
        </g>
      )}
      {room === 'studio' && (
        <g>
          <g data-dome-tool transform={`translate(345 ${FLOOR_Y})`} onPointerDown={tapPiece('dome_tool')} style={{ cursor: 'pointer' }}><rect x={-32} y={-52} width={64} height={54} fill="transparent" /><Furniture kind="dome_tool" accent={accent} using={using === 'dome_tool'} /></g>
          <g data-studio-desk transform={`translate(${STUDIO_DESK.x} ${FLOOR_Y})`}><Furniture kind="studio_desk" lit={draggingFriend} /></g>
          <g data-ring-light transform={`translate(30 ${FLOOR_Y})`} onPointerDown={tapPiece('ring_light')} style={{ cursor: 'pointer' }}><rect x={-24} y={-116} width={48} height={118} fill="transparent" /><Furniture kind="ring_light" using={using === 'ring_light'} /></g>
        </g>
      )}
      {room === 'igloos' && (
        <g>
          {IGLOOS.map(g => <g key={g.x} data-igloo transform={`translate(${g.x} ${FLOOR_Y})`}><Furniture kind="igloo" using={using?.startsWith('igloo:') ?? false} lit={draggingFriend} /></g>)}
          <g data-iceslide transform={`translate(${ICE_SLIDE.x} ${FLOOR_Y})`}><Furniture kind="ice_slide" lit={draggingFriend} /></g>
          <g data-snowman transform={`translate(350 ${FLOOR_Y + 90}) scale(0.6)`} onPointerDown={tapPiece('snowman')} style={{ cursor: 'pointer' }}><rect x={-30} y={-130} width={60} height={132} fill="transparent" /><Furniture kind="snowman" accent={accent} using={using === 'snowman'} /></g>
        </g>
      )}
      {room === 'springs' && (
        <g>
          <g data-steam transform="translate(60 430)" onPointerDown={tapPiece('steam')} style={{ cursor: 'pointer' }}><rect x={-20} y={-38} width={40} height={42} fill="transparent" /><Furniture kind="steam_vent" using={using === 'steam'} /></g>
          <g data-lava-rock transform={`translate(340 ${FLOOR_Y})`} onPointerDown={tapPiece('lava_rock')} style={{ cursor: 'pointer' }}><rect x={-36} y={-54} width={72} height={56} fill="transparent" /><Furniture kind="lava_rock" using={using === 'lava_rock'} /></g>
          {POOLS.map(w => <g key={w.x} data-pool transform={`translate(${w.x} ${w.y})`}><Furniture kind="warm_pool" using={using?.startsWith('pool:') ?? false} lit={draggingFriend} /></g>)}
          <g data-stones transform={`translate(${STONES.x} ${STONES.y})`}><Furniture kind="stones" lit={draggingFriend} /></g>
        </g>
      )}
      {room === 'colours' && (
        <g>
          <g data-rainbowslide transform={`translate(${RAINBOW_SLIDE.x} ${FLOOR_Y})`}><Furniture kind="rainbow_slide" lit={draggingFriend} /></g>
          <g data-cloudbed transform={`translate(${CLOUD_BED.x} ${FLOOR_Y - 10})`}><Furniture kind="cloud_bed" using={using?.startsWith('cloudbed:') ?? false} lit={draggingFriend} /></g>
          <g data-paint-pots transform={`translate(345 ${FLOOR_Y + 60}) scale(0.9)`} onPointerDown={tapPiece('paint_pots')} style={{ cursor: 'pointer' }}><rect x={-50} y={-50} width={100} height={52} fill="transparent" /><Furniture kind="paint_pots" using={using === 'paint_pots'} /></g>
        </g>
      )}

      {/* inside the open fridge and wardrobe */}
      {room === 'kitchen' && open === 'fridge' && fridge.slice(0, 4).map((t, i) => liftable(t, FRIDGE_INSIDE[i], { small: true, hitY: -12, label: `Take ${t} out of the fridge` }))}
      {room === 'bedroom' && open === 'wardrobe' && outfits.slice(0, 4).map((o, i) => {
        const dragging = drag?.kind === 'outfit' && drag.id === o
        const p = dragging && drag ? { x: drag.x, y: drag.y } : WARDROBE_INSIDE[i]
        return (
          <g key={o} data-wardrobe-outfit={o} transform={`translate(${p.x} ${p.y})`} onPointerDown={e => begin(e, 'outfit', o)} style={{ cursor: 'grab' }} aria-label={`Take the ${o.replace('_', ' ')} out of the wardrobe`}>
            <circle cx={0} cy={0} r={16} fill="#FFFFFF" stroke={INK} strokeWidth={1.4} />
            <text x={0} y={6} textAnchor="middle" fontSize={17}>{OUTFIT_ICON[o]}</text>
          </g>
        )
      })}

      {/* the phones on the shelf */}
      {room === 'kitchen' && phonesOnShelf.map((d, i) => liftable(deviceOf(d.owner), { x: shelfX(i, phonesOnShelf.length), y: SHELF.y - 4 }, { hitY: -14, label: `${friendArt(d.owner).name}'s MoonPhone on the shelf` }))}

      {/* things on tables */}
      {inRoom.filter(x => roomZoneOf(x.thing) === 'table').map(x => liftable(x.thing, pos(x.spot)))}

      {/* the spots a carried part can go, lit up */}
      {targets.map(t => {
        const p = pos(t.id)
        return <circle key={t.id} data-target={t.id} cx={p.x} cy={p.y - (t.zone === 'wall' ? 0 : 20)} r={26} fill="rgba(255,255,255,0.45)" stroke="#F4C542" strokeWidth={4} strokeDasharray="8 7" className="pl-target" />
      })}

      {/* the Friends in this room, and what they hold */}
      {friends.map((f, i) => {
        const mood = moods[f.key] ?? 'happy'
        const baby = !isGrownUp(f.key, childAge)
        const dragging = drag?.kind === 'friend' && drag.id === f.key
        const holding = held[f.key] ?? null
        const phone = holding && isDeviceKey(holding) ? devices[holding] : null
        if (dragging && drag) {
          return (
            <g key={f.key} transform={`translate(${drag.x} ${drag.y + 30}) scale(1.06)`} style={{ filter: 'drop-shadow(0 8px 0 rgba(26,26,46,0.25))' }}>
              <FriendFigure friend={f.key} mood={mood} baby={baby} outfit={wearing[f.key] ?? null} phone={phone ? 'hand' : 'none'} />
            </g>
          )
        }
        if (f.cooldown?.reason === 'nap' && room === 'bedroom') {
          const bed = BEDS[Math.min(BEDS.length - 1, i)]
          return (
            <g key={f.key} data-in-bed={f.key} transform={`translate(${bed.x} ${FLOOR_Y - 26}) scale(0.62)`}>
              <g className="pl-breathe"><FriendFigure friend={f.key} mood="asleep" baby={baby} blanket /></g>
            </g>
          )
        }
        const x = xs[i]
        // On a piece, for the moment its line lasts: the pose belongs to this room's pieces only.
        const poseKey = using && using.endsWith(`:${f.key}`) ? using.slice(0, -f.key.length - 1) : null
        const pose = poseKey && POSES[poseKey] && (FRIEND_DROPS[room] ?? []).some(d => d.target === poseKey) ? POSES[poseKey](i) : null
        const at = pose ? { x: pose.x, y: pose.y } : { x, y: STAND_Y }
        return (
          <g key={f.key} data-friend={f.key} transform={`translate(${at.x} ${at.y})${pose ? ` scale(${pose.scale})` : ''}`}
            onPointerDown={e => { if (f.cooldown) { onInteract(); return } begin(e, 'friend', f.key) }} style={{ cursor: f.cooldown ? 'default' : 'grab' }}>
            <g className={pose?.anim}>
            {(carrying?.kind === 'outfit' || drag?.kind === 'outfit' || (draggingThing && draggingThing !== holding)) && !f.cooldown && (
              <circle cx={0} cy={-70} r={70} fill="rgba(255,255,255,0.25)" stroke="#F4C542" strokeWidth={4} strokeDasharray="8 7" className="pl-target" data-target={`friend-${f.key}`} />
            )}
            <g className={wiggle === f.key ? 'pl-wiggle' : using === `eat:${f.key}` ? 'pl-bounce' : undefined}>
              <FriendFigure friend={f.key} mood={mood} baby={baby} outfit={wearing[f.key] ?? null} clock={f.cooldown?.reason === 'ambient'} phone="none" />
            </g>
            {phone && (
              <g transform="translate(42 -46)">
                <PhoneArt colour={friendArt(f.key).colour} battery={batteryNow(phone, nowIso)} tilt={-18} />
              </g>
            )}
            {using === `snap:${f.key}` && <circle className="pl-puff" cx={42} cy={-60} r={14} fill="#FFFFFF" opacity={0.9} />}
            </g>
          </g>
        )
      })}
      {/* the child's own explorer (slice 3b), in the row with the Friends. Decoration
          here: it is changed by a tap outdoors, and it never takes a drop */}
      {self && (
        <g data-self transform={`translate(${xs[friends.length]} ${STAND_Y})`} style={{ pointerEvents: 'none' }} aria-label="Me">
          <g className="pl-breathe"><SelfFigure self={self} size={100} /></g>
        </g>
      )}
      {/* what a Friend holds is its own liftable thing, drawn last so it can be grabbed */}
      {friends.map((f, i) => {
        const holding = held[f.key]
        if (!holding || f.cooldown) return null
        const x = xs[i]
        return liftable(holding, { x: x + 42, y: STAND_Y - 36 }, { small: !isDeviceKey(holding), hitY: -14, label: `${friendArt(f.key).name} is holding ${holding.replace('phone_', 'the MoonPhone of ').replace('_', ' ')}` })
      })}

      {room === 'playground' && (
        <g data-sandpit transform={`translate(${SANDPIT.x} ${SANDPIT.y})`}><Furniture kind="sandpit" lit={draggingFriend} using={using?.startsWith('sandpit:') ?? false} /></g>
      )}
      {/* things on the floor and the toy box */}
      {inRoom.filter(x => roomZoneOf(x.thing) === 'floor').map(x => liftable(x.thing, pos(x.spot)))}
      {room === 'bedroom' && (
        <g data-toybox transform={`translate(${TOYBOX.x} ${TOYBOX.y})`} onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('toybox') }} style={{ cursor: 'pointer' }}>
          <Furniture kind="toybox" open={open === 'toybox'} />
        </g>
      )}
      {room === 'bedroom' && open === 'toybox' && toybox.slice(0, 3).map((t, i) => liftable(t, TOYBOX_INSIDE[i], { small: true, hitY: -10, label: `Take ${t} out of the toy box` }))}

      {/* the doors, or the launch pad on another planet */}
      {doors.left === 'map' ? (
        <g data-door="left" data-launchpad transform={`translate(${DOOR_LEFT.x + 26} ${FLOOR_Y + 40})`} style={{ cursor: 'pointer' }} onPointerDown={e => { e.stopPropagation(); onInteract(); onFurnitureTap('launchpad') }}>
          <rect x={-50} y={-70} width={100} height={90} fill="transparent" />
          <Furniture kind="launchpad" lit={draggingFriend} />
        </g>
      ) : (
        <g data-door="left" transform={`translate(${DOOR_LEFT.x} ${FLOOR_Y})`} style={{ cursor: 'pointer' }}>
          <rect x={-28} y={-140} width={58} height={150} fill="transparent" />
          <Furniture kind="door" side="left" lit={draggingFriend} />
        </g>
      )}
      {doors.right && (
        <g data-door="right" transform={`translate(${DOOR_RIGHT.x} ${FLOOR_Y})`} style={{ cursor: 'pointer' }}>
          <rect x={-30} y={-140} width={60} height={150} fill="transparent" />
          <Furniture kind="door" side="right" lit={draggingFriend} />
        </g>
      )}
    </svg>
  )
}
