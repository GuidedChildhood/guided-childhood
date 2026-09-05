'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import type { KidTheme } from '@/lib/kid/theme'
import type { ClientEvent, HomeView } from '@/lib/planet/view'
import {
  GROWTH, TIERS, TICK_CAP_SECONDS, AMBIENT_AFTER_SECONDS,
  applyEvent, drainPerMinute, isGrownUp, minutesLeft, moodOf, reconcile, restOverlay,
  type Home, type FriendKey, type Mood, withChildAnswers, type MissionDef, boxParts, boxOutfits, plotsFor, PART_ZONE, type Outfit, type PartKey } from '@/lib/planet/logic'
import { LINES, friendArt } from '@/lib/planet/registry'
import { playFx, startTune } from '@/lib/planet/sounds'
import { soundEnabled, setSoundEnabled } from '@/lib/sound/kidSounds'
import KidBackLink from '@/components/kid/KidBackLink'
import HomePlanet, { nearestFreeSlot, standingX, type Carry, type DropZone, type Sky } from './HomePlanet'
import PartArt from './PartArt'
import { SCENE_H, SCENE_W, sceneFromClient, surfaceY } from './scene'
import FriendFigure from './FriendFigure'
import MissionBoard, { type ClaimResult } from './MissionBoard'
import { MISSION_DEFS, MISSION_LINES, missionByKey, OUTFIT_LABELS, PART_LABELS, PART_LINES } from '@/lib/planet/missions'
import { boardFor } from '@/lib/planet/logic'

// Planet Friends: Growing Up Digital, the toy, on the child link.
//
// Design: plans/planet-friends-architecture.md. This is the root node: it
// holds the planet the server last decided, counts down from the server's
// numbers, reports what the child did, and wears one overlay at a time (the
// pods, the slow orbit, the sunshine frame, the night). Every overlay
// carries the one door, Ask my grown up. Nothing here ever buzzes the child,
// mints a star or calls a model.
//
// The fixture mode runs the same pure rules locally so /dev/planet can be
// driven by Playwright with no database.

type Overlay = 'none' | 'pods' | 'orbit' | 'sunlight' | 'night'

/** The planet as it is right now on the child's screen: due rests closed, starlight interpolated between ticks. */
function liveHome(home: Home, nowIso: string): Home {
  const h = reconcile(home, nowIso, null)
  const cfg = TIERS[h.tier]
  const secs = Math.max(0, Math.min(TICK_CAP_SECONDS, (new Date(nowIso).getTime() - new Date(h.energyTickedAt).getTime()) / 1000))
  return {
    ...h,
    friends: h.friends.map(f => (f.cooldown ? f : { ...f, energy: Math.max(0, f.energy - (secs / 60) * drainPerMinute(cfg, f.cloud)) })),
  }
}

function fixtureApply(v: HomeView, ev: ClientEvent, defs: Record<string, MissionDef> = MISSION_DEFS): HomeView {
  const nowIso = new Date().toISOString()
  let home = reconcile(v.home, nowIso, null)
  let ask = v.ask
  if (ev.kind === 'ask_wake') {
    const left = Math.max(0, ...home.friends.filter(f => f.cooldown).map(f => minutesLeft(f.cooldown!, nowIso)))
    ask = { id: 'fixture', kind: 'wake', status: 'pending', createdAt: nowIso, answeredAt: null, minutesLeft: left }
  } else if (ev.kind === 'ask_seen') {
    ask = null
  } else {
    home = applyEvent(home, ev, nowIso, defs)
    // The two proofs the server decides: in the fixture a grown up's tap
    // becomes a pending ask, and a lesson counts as passed.
    if (ev.kind === 'mission_claim') {
      const def = MISSION_DEFS[ev.key]
      const st = home.missions.find(m => m.key === ev.key)
      if (def?.proof === 'grownup_tap' && st?.status === 'claimed') {
        ask = { id: `fixture_${ev.key}`, kind: 'mission', status: 'pending', createdAt: nowIso, answeredAt: null, minutesLeft: 0, missionKey: ev.key, title: missionByKey(ev.key)?.askLine }
      }
      if (def?.proof === 'lesson' && st?.status === 'claimed') home = applyEvent(home, { kind: 'mission_approve', key: ev.key }, nowIso, MISSION_DEFS)
    }
  }
  return { ...v, home, ask, serverNow: nowIso }
}

/** The outfits in the box, as a glyph a child can spot. */
const OUTFIT_ICON: Record<Outfit, string> = { party_hat: '🎉', glasses: '🕶️', helmet: '🪖', cape: '🦸', crown: '👑' }

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function PlanetFriends({ token, initial, theme, childName, fixture = false, fixtureAnswers }: {
  token: string | null
  initial: HomeView
  theme: KidTheme
  childName: string
  fixture?: boolean
  /** Fixture only: the pretend codes on pretend cards, so the pad can be driven with no database. */
  fixtureAnswers?: Record<string, string[]>
}) {
  const [view, setView] = useState<HomeView>(initial)
  // The fixture applies the rules in the browser and needs the latest view
  // at once, not after React's next render, so it keeps a mirror.
  const viewRef = useRef<HomeView>(initial)
  useEffect(() => { viewRef.current = view }, [view])
  const fixtureDefs = useMemo(() => (fixtureAnswers ? withChildAnswers(MISSION_DEFS, fixtureAnswers) : MISSION_DEFS), [fixtureAnswers])
  // The first render uses the server's clock on both sides, so the star sits
  // in the same place on the server and on the phone and hydration never
  // disagrees. The real clock takes over a second after mount.
  const [nowMs, setNowMs] = useState(() => new Date(initial.serverNow).getTime())
  const [offset, setOffset] = useState(0)
  const [line, setLine] = useState<string>(LINES.welcome)
  const [muted, setMuted] = useState(false)
  const [wiggle, setWiggle] = useState<FriendKey | null>(null)
  const [sparkle, setSparkle] = useState<FriendKey | null>(null)
  const [boopCrater, setBoopCrater] = useState<number | null>(null)
  const [sunlight, setSunlight] = useState<{ friend: FriendKey; stage: 'prompt' | 'waiting'; sparks: number } | null>(null)
  const [grewShown, setGrewShown] = useState(false)
  const [nightAsked, setNightAsked] = useState(false)
  const [busy, setBusy] = useState(false)
  const [boardOpen, setBoardOpen] = useState(false)
  // The build (slice 3): the parts box, a part or outfit being carried
  // from it, and a part a Friend is playing on.
  const [boxOpen, setBoxOpen] = useState(false)
  const [carry, setCarry] = useState<(Carry & { x: number; y: number }) | null>(null)
  const [using, setUsing] = useState<PartKey | null>(null)
  const sceneRef = useRef<SVGSVGElement | null>(null)
  // One ask column, two kinds. The pods and the orbit only care about a wake
  // ask; a mission ask belongs to the board. A save from before the kinds
  // existed reads as a wake ask.
  const wakeAsk = view.ask && view.ask.kind !== 'mission' ? view.ask : null
  const lastInteractRef = useRef(Date.now())
  const ambientSentRef = useRef<Set<string>>(new Set())
  const overlayRef = useRef<Overlay>('none')
  const windDownSaidRef = useRef(false)
  const grewRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const askSeenRef = useRef<string | null>(null)

  useEffect(() => { setMuted(!soundEnabled()) }, [])
  useEffect(() => { setOffset(new Date(view.serverNow).getTime() - Date.now()) }, [view.serverNow])
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const nowIso = useMemo(() => new Date(nowMs + offset).toISOString(), [nowMs, offset])
  const live = useMemo(() => liveHome(view.home, nowIso), [view.home, nowIso])
  const cfg = TIERS[live.tier]
  const moods = useMemo(() => Object.fromEntries(live.friends.map(f => [f.key, moodOf(f)])) as Record<string, Mood>, [live])
  const lead = live.friends[0]?.key ?? 'pebble'
  const leadName = friendArt(lead).name

  const windowOpen = Boolean(view.bedtime.windowUntil && new Date(view.bedtime.windowUntil).getTime() > nowMs + offset)
  const bedtimeLocked = view.bedtime.phase === 'bedtime' && !windowOpen
  const rest = restOverlay(live)
  const overlay: Overlay = bedtimeLocked ? 'night' : sunlight ? 'sunlight' : rest ?? 'none'
  overlayRef.current = overlay
  const sky: Sky = bedtimeLocked ? 'night' : view.bedtime.phase === 'winddown' ? 'evening' : 'day'
  const awake = live.friends.filter(f => !f.cooldown)
  const box = boxParts(live)
  const boxWear = boxOutfits(live)
  const plots = plotsFor(live.growthStage)
  const spacesLeft = Math.max(0, plots - live.build.placed.length)
  const starEnergy = awake.length ? awake.reduce((s, f) => s + f.energy, 0) / (awake.length * 100) : 0
  const grewTotal = live.grewWhileAway

  const say = useCallback((text: string) => setLine(text), [])

  const refresh = useCallback(async () => {
    if (fixture || !token) {
      setView(v => ({ ...v, home: reconcile(v.home, new Date().toISOString(), null), serverNow: new Date().toISOString() }))
      return
    }
    try {
      const r = await fetch(`/api/kid/planet/state?token=${token}`, { cache: 'no-store' })
      if (r.ok) setView(await r.json())
    } catch { /* the next poll tries again */ }
  }, [fixture, token])

  const send = useCallback(async (ev: ClientEvent): Promise<HomeView | null> => {
    if (fixture || !token) {
      const next = fixtureApply(viewRef.current, ev, fixtureDefs)
      viewRef.current = next
      setView(next)
      return next
    }
    try {
      const r = await fetch('/api/kid/planet/event', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...ev }),
      })
      if (r.ok) { const next = await r.json() as HomeView; setView(next); return next }
    } catch { /* the next poll tries again */ }
    return null
  }, [fixture, token, fixtureDefs])

  // Only real play drains: one tick a minute while the planet is open and on
  // screen. Hidden or resting, nothing is sent and nothing drains.
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible' && overlayRef.current === 'none') void send({ kind: 'tick' })
    }, 60000)
    return () => clearInterval(id)
  }, [send])

  // While something rests or an ask is out, ask the server every twenty
  // seconds, the same cadence the parent's pop up uses. And on every return
  // to the tab, because the Friends may have woken while it was away.
  const missionWaiting = live.missions.some(m => m.status === 'claimed')
  const askOut = view.ask?.status === 'pending' || view.screenAsk?.status === 'pending' || missionWaiting
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      if (overlayRef.current !== 'none' || askOut) void refresh()
    }, 20000)
    const onVis = () => { if (document.visibilityState === 'visible') void refresh() }
    document.addEventListener('visibilitychange', onVis)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis) }
  }, [refresh, askOut])

  // A rest that ends on the child's screen is confirmed with the server at
  // once, so the growth it paid is the server's number, not the mirror's.
  const restingCount = live.friends.filter(f => f.cooldown).length
  const prevRestingRef = useRef(restingCount)
  useEffect(() => {
    if (prevRestingRef.current > restingCount) void refresh()
    prevRestingRef.current = restingCount
  }, [restingCount, refresh])

  // A drained Friend that nobody has touched for twenty seconds rests by
  // itself (design 3.1). Once per Friend per drain.
  useEffect(() => {
    for (const f of live.friends) {
      if (f.cooldown) { ambientSentRef.current.delete(f.key); continue }
      if (f.energy <= 0 && Date.now() - lastInteractRef.current > AMBIENT_AFTER_SECONDS * 1000 && !ambientSentRef.current.has(f.key)) {
        ambientSentRef.current.add(f.key)
        say(LINES.orbit)
        void send({ kind: 'ambient_start', friend: f.key })
      }
    }
  }, [nowMs, live, send, say])

  // The wind down says its one line, once.
  useEffect(() => {
    if (view.bedtime.phase === 'winddown' && !windDownSaidRef.current) { windDownSaidRef.current = true; say(LINES.windDown) }
  }, [view.bedtime.phase, say])

  // The music box plays through a rest and stops the moment it ends.
  useEffect(() => {
    if (overlay !== 'pods' && overlay !== 'orbit') return
    if (muted) return
    const stop = startTune(live.tier === 1 ? 'twinkle' : 'slow')
    return stop
  }, [overlay, muted, live.tier])

  // The grown up's answer: say it once, then clear it. A wake ask speaks the
  // wake lines. A mission ask that landed shows its reveal card instead, and
  // one that was not now says so once, with the mission back on the board.
  useEffect(() => {
    const ask = view.ask
    if (!ask || ask.status === 'pending' || askSeenRef.current === ask.id) return
    askSeenRef.current = ask.id
    if (ask.kind === 'mission') {
      if (ask.status === 'approved') playFx('chime')
      else say(MISSION_LINES.notNow)
    } else {
      say(ask.status === 'approved' ? LINES.yes : LINES.notNow)
      if (ask.status === 'approved') playFx('chime')
    }
    void send({ kind: 'ask_seen' })
  }, [view.ask, say, send])

  // The sunshine frame closes itself when the sunshine has been caught.
  useEffect(() => {
    if (!sunlight || sunlight.stage !== 'waiting') return
    const f = live.friends.find(x => x.key === sunlight.friend)
    if (f && !f.cooldown) { setSunlight(null); say(LINES.sunlightDone); playFx('chime') }
  }, [live, sunlight, say])

  // While you were away: the card pops once, and the child's tap clears it.
  useEffect(() => {
    if (grewTotal > 0 && !grewShown && grewRef.current && !reduceMotion()) {
      gsap.fromTo(grewRef.current, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' })
    }
  }, [grewTotal, grewShown])
  useEffect(() => { if (grewTotal === 0) setGrewShown(false) }, [grewTotal])

  // The planet breathes in when it wakes.
  const prevOverlayRef = useRef<Overlay>(overlay)
  useEffect(() => {
    if (prevOverlayRef.current !== 'none' && overlay === 'none' && stageRef.current && !reduceMotion()) {
      gsap.fromTo(stageRef.current, { scale: 0.97 }, { scale: 1, duration: 0.45, ease: 'power2.out' })
    }
    prevOverlayRef.current = overlay
  }, [overlay])

  function interact() { lastInteractRef.current = Date.now() }

  function flash<T>(setter: (v: T | null) => void, id: T, ms: number) {
    setter(id)
    setTimeout(() => setter(null), ms)
  }

  const onDropFriend = (friend: FriendKey, zone: DropZone | null) => {
    interact()
    if (zone && typeof zone === 'object') {
      // A Friend on a part the child built with: one line, one wiggle, back to standing.
      playFx('giggle'); say(PART_LINES[zone.part]); flash(setWiggle, friend, 700); flash(setUsing, zone.part, 1400)
      return
    }
    if (zone === 'pod') { playFx('yawn'); say(LINES.napStart); void send({ kind: 'nap_start', friend }) }
    else if (zone === 'catcher') { playFx('tap'); setSunlight({ friend, stage: 'prompt', sparks: 0 }) }
    else playFx('boop')
  }
  const onTickle = (friend: FriendKey) => {
    interact(); playFx('giggle')
    say(isGrownUp(friend, view.childAge) ? LINES.tickled : LINES.baby)
    flash(setWiggle, friend, 700)
  }
  const onSprinkle = (friend: FriendKey) => { interact(); playFx('sprinkle'); say(LINES.sprinkled); flash(setSparkle, friend, 1200) }
  const onBoop = (crater: number) => { interact(); playFx('boop'); say(LINES.boop); flash(setBoopCrater, crater, 600) }
  const onCloud = (friend: FriendKey, on: boolean) => { interact(); playFx('tap'); say(on ? LINES.cloudOn : LINES.cloudOff); void send({ kind: 'cloud', friend, on }) }
  const onNursery = () => { interact(); playFx('giggle'); say(LINES.babies) }

  // ── The build ────────────────────────────────────────────────────────
  const placeHint = (part: PartKey) => {
    const z = PART_ZONE[part]
    return z === 'sky' ? 'That one goes up in the sky.' : z === 'horizon' ? 'That one stands on the horizon, behind the Friends.' : z === 'ring' ? 'The ring goes around the middle.' : 'That one goes on the ground.'
  }
  const onMovePart = (part: PartKey, slot: string | null) => {
    interact(); playFx('tap')
    if (slot === null) { say(`${PART_LABELS[part]} is back in your box.`); void send({ kind: 'part_remove', part }); return }
    void send({ kind: 'part_move', part, slot })
  }
  const onPartTap = (part: PartKey) => { interact(); playFx('boop'); say(PART_LINES[part]); flash(setUsing, part, 1400) }
  function startCarry(e: React.PointerEvent, item: Carry) {
    interact(); playFx('tap')
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId) } catch { /* not all browsers */ }
    setCarry({ ...item, x: e.clientX, y: e.clientY })
  }
  function moveCarry(e: React.PointerEvent) { if (carry) setCarry({ ...carry, x: e.clientX, y: e.clientY }) }
  function endCarry(e: React.PointerEvent) {
    const item = carry
    setCarry(null)
    const svg = sceneRef.current
    if (!item || !svg) return
    const p = sceneFromClient(svg, e.clientX, e.clientY)
    if (p.x < 0 || p.x > SCENE_W || p.y < 0 || p.y > SCENE_H) return
    if (item.kind === 'part') {
      if (live.build.placed.length >= plots) { playFx('boop'); say(MISSION_LINES.noRoom); return }
      const slot = nearestFreeSlot(item.part, live.build.placed, p, 110)
      if (!slot) { say(placeHint(item.part)); return }
      playFx('chime'); say(`${PART_LABELS[item.part]}. Nice spot.`)
      void send({ kind: 'part_place', part: item.part, slot })
    } else {
      const xs = standingX(live.friends.length)
      let best: FriendKey | null = null
      let bestD = 95
      live.friends.forEach((f, i) => {
        if (f.cooldown) return
        const d = Math.hypot(p.x - xs[i], p.y - (surfaceY(xs[i]) - 60))
        if (d < bestD) { bestD = d; best = f.key }
      })
      if (!best) { say(MISSION_LINES.wear); return }
      playFx('giggle'); say(`${friendArt(best).name} loves it.`)
      void send({ kind: 'outfit_set', friend: best, outfit: item.outfit })
    }
  }
  const takeOff = (friend: FriendKey) => { interact(); playFx('tap'); void send({ kind: 'outfit_set', friend, outfit: null }) }
  /** The box is a sheet along the bottom of the screen; opening it brings the planet up above it. */
  function openBox(open: boolean) {
    setBoxOpen(open)
    if (open) requestAnimationFrame(() => { try { sceneRef.current?.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : 'smooth' }) } catch { /* fine */ } })
  }

  async function everyoneToBed() {
    interact()
    playFx('yawn')
    say(LINES.napStart)
    for (const f of live.friends) if (!f.cooldown) await send({ kind: 'nap_start', friend: f.key })
  }

  async function catchSunshine() {
    if (!sunlight) return
    interact()
    playFx('sparkle')
    say(LINES.sunlightWaiting)
    setSunlight({ ...sunlight, stage: 'waiting' })
    await send({ kind: 'sunlight_start', friend: sunlight.friend })
  }

  async function askWake() {
    interact()
    playFx('tap')
    say(LINES.asked)
    await send({ kind: 'ask_wake' })
  }

  // The night door IS the device time ask: minutes on this screen inside
  // bedtime already go to the parent as an ask, and their yes opens the
  // planet for those minutes. Whole stars at the child's own rate.
  async function askNight() {
    interact()
    playFx('tap')
    if (fixture || !token) { setNightAsked(true); say(LINES.asked); return }
    setBusy(true)
    try {
      const rate = Math.max(1, view.starMinutes)
      const minutes = Math.max(rate, Math.ceil(10 / rate) * rate)
      const device = window.innerWidth >= 700 ? 'tablet' : 'phone'
      const r = await fetch('/api/quests/time/start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, device, minutes }),
      })
      if (r.ok) { setNightAsked(true); say(LINES.asked) }
      await refresh()
    } catch { /* the door stays */ }
    finally { setBusy(false) }
  }

  async function startWindow() {
    if (!view.screenAsk || fixture || !token) return
    setBusy(true)
    try {
      await fetch('/api/quests/time/start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, requestId: view.screenAsk.id }),
      })
      await refresh()
      playFx('chime')
    } catch { /* try again on the next tap */ }
    finally { setBusy(false) }
  }

  const board = boardFor(live, Object.values(MISSION_DEFS))
  const landed = live.missions.find(m => m.status === 'approved')
  const landedCard = landed ? missionByKey(landed.key) : null
  const inProgress = live.missions.filter(m => m.status === 'doing' || m.status === 'claimed').length

  async function startMission(key: string) {
    interact(); playFx('tap')
    setBusy(true)
    try { await send({ kind: 'mission_start', key }) } finally { setBusy(false) }
  }

  async function claimMission(key: string, code?: string[]): Promise<ClaimResult> {
    interact()
    setBusy(true)
    try {
      const next = await send({ kind: 'mission_claim', key, code })
      const st = next?.home.missions.find(m => m.key === key)
      const def = MISSION_DEFS[key]
      if (!st || !def) return null
      if (st.status === 'approved') { playFx('chime'); return 'landed' }
      if (st.status === 'claimed') { playFx('tap'); return 'asked' }
      if (def.proof === 'timer') return 'not_yet'
      if (def.proof === 'code') return 'not_quite'
      if (def.proof === 'lesson') return 'lesson_first'
      return null
    } finally { setBusy(false) }
  }

  async function seenMission(key: string) {
    playFx('chime')
    await send({ kind: 'mission_seen', key })
  }

  function toggleMute() {
    const next = !muted
    setMuted(next)
    setSoundEnabled(!next)
    if (!next) playFx('tap')
  }

  const chunky = (fill: 'accent' | 'white'): React.CSSProperties => ({
    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', lineHeight: 1.15,
    padding: '14px 20px', borderRadius: 16, cursor: 'pointer', textDecoration: 'none',
    background: fill === 'accent' ? theme.hex : '#fff', color: fill === 'accent' ? theme.onAccent : 'var(--ink)',
    border: '2px solid var(--ink)', boxShadow: '0 5px 0 var(--ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  })

  const resting = live.friends.filter(f => f.cooldown)
  const restLeft = resting.length ? Math.max(...resting.map(f => minutesLeft(f.cooldown!, nowIso))) : 0
  const restFraction = resting.length
    ? Math.max(...resting.map(f => {
        const c = f.cooldown!
        const total = c.lengthMinutes * 60000
        return Math.max(0, Math.min(1, (nowMs + offset - new Date(c.startedAt).getTime()) / total))
      }))
    : 0
  const words = cfg.words

  const overlayBase: React.CSSProperties = {
    position: 'absolute', inset: 0, borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 14, padding: '22px 18px', textAlign: 'center', zIndex: 5,
  }
  const overlayLine: React.CSSProperties = {
    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', lineHeight: 1.2, letterSpacing: '-0.01em', margin: 0, maxWidth: 300,
  }
  const overlayButtons = (askLabel: string | null, onAsk: (() => void) | null, extra?: React.ReactNode) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 'min(100%, 280px)', marginTop: 6 }}>
      {extra}
      {askLabel && onAsk && (
        <button onClick={onAsk} disabled={busy} style={{ ...chunky('accent'), opacity: busy ? 0.6 : 1 }}>{askLabel}</button>
      )}
      {token && (
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          <KidBackLink href={`/k/${token}`} label={LINES.backToQuests} color="#fff" />
        </span>
      )}
    </div>
  )
  const smallRow = (mood: Mood, opts: { blanket?: boolean; pyjamas?: boolean; clockFor?: boolean }, list = resting) => (
    <svg viewBox="0 0 240 120" width={220} height={110} aria-hidden>
      {list.slice(0, 3).map((f, i) => (
        <g key={f.key} transform={`translate(${60 + i * 60} 110) scale(0.62)`}>
          <g className="pl-breathe">
            <FriendFigure friend={f.key} mood={mood} baby={!isGrownUp(f.key, view.childAge)} blanket={opts.blanket} pyjamas={opts.pyjamas} clock={opts.clockFor && f.cooldown?.reason === 'ambient'} />
          </g>
        </g>
      ))}
    </svg>
  )

  const sunlightFriend = sunlight ? live.friends.find(f => f.key === sunlight.friend) ?? null : null

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg, color: theme.ink, fontFamily: 'var(--font-body)' }}>
      <style>{`
        @keyframes pl-breathe { 0%, 100% { transform: scale(1) } 50% { transform: scale(1.03) } }
        @keyframes pl-wiggle { 0%, 100% { transform: rotate(0) } 25% { transform: rotate(-6deg) } 75% { transform: rotate(6deg) } }
        @keyframes pl-sparkle { 0% { opacity: 0; transform: translateY(6px) } 30% { opacity: 1 } 100% { opacity: 0; transform: translateY(-14px) } }
        @keyframes pl-dust { 0% { transform: translateY(0); opacity: 1 } 100% { transform: translateY(40px); opacity: 0 } }
        @keyframes pl-puff { 0% { transform: scale(0.4); opacity: 0.7 } 100% { transform: scale(2); opacity: 0 } }
        @keyframes pl-star { 0%, 100% { transform: rotate(0) } 50% { transform: rotate(6deg) } }
        @keyframes pl-float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        @keyframes pl-target { 0%, 100% { opacity: 0.7 } 50% { opacity: 1 } }
        @keyframes pl-bounce { 0%, 100% { transform: scaleY(1) } 50% { transform: scaleY(0.6) } }
        @keyframes pl-swing { 0%, 100% { transform: rotate(0) } 25% { transform: rotate(18deg) } 75% { transform: rotate(-18deg) } }
        @keyframes pl-launch { 0% { transform: translateY(0) } 60% { transform: translateY(-40px) } 100% { transform: translateY(0) } }
        @keyframes pl-flicker { 0%, 100% { transform: scale(1) } 50% { transform: scale(1.08, 0.94) } }
        .pl-breathe { animation: pl-breathe 3.2s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100% }
        .pl-wiggle { animation: pl-wiggle 0.7s ease-in-out; transform-box: fill-box; transform-origin: 50% 100% }
        .pl-sparkle { animation: pl-sparkle 1.2s ease-out }
        .pl-dust { animation: pl-dust 0.6s linear infinite }
        .pl-puff { animation: pl-puff 0.6s ease-out forwards; transform-box: fill-box; transform-origin: center }
        .pl-star { animation: pl-star 6s ease-in-out infinite }
        .pl-float { animation: pl-float 5s ease-in-out infinite; transform-box: fill-box; transform-origin: center }
        .pl-target { animation: pl-target 1s ease-in-out infinite }
        .pl-bounce { animation: pl-bounce 0.5s ease-in-out 2; transform-box: fill-box; transform-origin: 50% 100% }
        .pl-swing { animation: pl-swing 1.2s ease-in-out; transform-box: fill-box; transform-origin: 50% 0% }
        .pl-launch { animation: pl-launch 1.2s ease-in-out; transform-box: fill-box; transform-origin: 50% 100% }
        .pl-flicker { animation: pl-flicker 0.5s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100% }
        @media (prefers-reduced-motion: reduce) { .pl-breathe, .pl-wiggle, .pl-sparkle, .pl-dust, .pl-puff, .pl-star, .pl-float, .pl-target, .pl-bounce, .pl-swing, .pl-launch, .pl-flicker { animation: none } }
      `}</style>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: `10px 12px calc(env(safe-area-inset-bottom, 0px) + ${boxOpen ? 300 : 24}px)` }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '6px 4px 10px' }}>
          {token ? <KidBackLink href={`/k/${token}`} color={theme.ink} /> : <span />}
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', letterSpacing: '-0.01em' }}>My planet 🪐</span>
          <button onClick={toggleMute} aria-label={muted ? 'Sound on' : 'Sound off'} style={{ width: 42, height: 42, borderRadius: '50%', background: '#fff', border: '2px solid var(--ink)', boxShadow: '0 3px 0 var(--ink)', cursor: 'pointer', fontSize: 18 }}>
            {muted ? '🔇' : '🔊'}
          </button>
        </header>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: theme.panel, border: `1px solid ${theme.panelBorder}`, borderRadius: 18, padding: '8px 12px', marginBottom: 10 }}>
          <img src={friendArt(lead).img} alt={leadName} width={40} height={40} style={{ width: 40, height: 40, objectFit: 'contain', flexShrink: 0 }} />
          <p aria-live="polite" style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', lineHeight: 1.3, color: theme.ink }}>{line}</p>
        </div>

        <div ref={stageRef} style={{ position: 'relative', borderRadius: 24, border: '2.5px solid var(--ink)', boxShadow: '0 6px 0 var(--ink)', overflow: 'hidden', background: '#fff' }}>
          <HomePlanet
            friends={live.friends}
            moods={moods}
            tier={live.tier}
            childAge={view.childAge}
            sky={sky}
            starEnergy={starEnergy}
            growthStage={live.growthStage}
            placed={live.build.placed}
            plots={plots}
            wearing={live.build.wearing}
            carrying={carry ? (carry.kind === 'part' ? { kind: 'part', part: carry.part } : { kind: 'outfit', outfit: carry.outfit }) : null}
            using={using}
            accent={theme.hex}
            pyjamas={bedtimeLocked}
            wiggle={wiggle}
            sparkle={sparkle}
            boopCrater={boopCrater}
            onDropFriend={onDropFriend}
            onTickle={onTickle}
            onSprinkle={onSprinkle}
            onBoop={onBoop}
            onCloud={onCloud}
            onNursery={onNursery}
            onInteract={interact}
            onMovePart={onMovePart}
            onPartTap={onPartTap}
            onSvg={el => { sceneRef.current = el }}
          />

          {landed && landedCard && !boardOpen && overlay !== 'night' && (
            <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14, zIndex: 4, background: '#fff', border: '2px solid var(--ink)', borderRadius: 18, boxShadow: '0 5px 0 var(--ink)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }} aria-hidden>{landedCard.emoji}</span>
              <p style={{ margin: 0, flex: 1, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', lineHeight: 1.2, color: 'var(--ink)' }}>
                {landedCard.rewardLabel}. {MISSION_LINES.landed}
              </p>
              <button onClick={() => { void seenMission(landed.key); openBox(true) }} style={{ ...chunky('accent'), padding: '10px 14px' }}>Yay!</button>
            </div>
          )}

          {boardOpen && overlay !== 'night' && (
            <MissionBoard
              home={live}
              board={board}
              tier={live.tier}
              ask={view.ask}
              nowMs={nowMs + offset}
              token={token}
              theme={theme}
              leadName={leadName}
              busy={busy}
              childAge={view.childAge}
              cards={view.cards ?? []}
              onStart={startMission}
              onClaim={claimMission}
              onSeen={seenMission}
              onClose={() => setBoardOpen(false)}
            />
          )}

          {grewTotal > 0 && !grewShown && overlay === 'none' && !landed && (
            <div ref={grewRef} style={{ position: 'absolute', left: 14, right: 14, bottom: 14, zIndex: 4, background: '#fff', border: '2px solid var(--ink)', borderRadius: 18, boxShadow: '0 5px 0 var(--ink)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }} aria-hidden>🪐</span>
                <p style={{ margin: 0, flex: 1, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', lineHeight: 1.2, color: 'var(--ink)' }}>
                  {grewTotal >= GROWTH.night ? LINES.grewNight : LINES.grewAway}
                </p>
                <button onClick={() => { setGrewShown(true); playFx('chime'); void send({ kind: 'seen' }) }} style={{ ...chunky('accent'), padding: '10px 14px' }}>Yay!</button>
              </div>
              {/* The planet grows while the child is away, and the same thing is
                  true of the child: the online education lives on the Learn
                  tab, one door away. Slice 2 turns this into missions. */}
              {token && (
                <a href={`/k/${token}/lessons`} style={{ ...chunky('white'), padding: '10px 14px', fontSize: 'var(--text-base)' }}>📚 Learn with {leadName}</a>
              )}
            </div>
          )}

          {overlay === 'pods' && (
            <div style={{ ...overlayBase, background: 'linear-gradient(180deg, #1C2340 0%, #0F1327 100%)', color: '#F7F7F5' }} onPointerDown={() => playFx('shh')}>
              <svg viewBox="0 0 120 120" width={110} height={110} aria-hidden>
                <circle cx={60} cy={60} r={44} fill="#2B3568" />
                <clipPath id="pl-moonfill"><rect x={16} y={104 - 88 * restFraction} width={88} height={88 * restFraction} /></clipPath>
                <circle cx={60} cy={60} r={44} fill="#FFF3C4" clipPath="url(#pl-moonfill)" />
                <circle cx={60} cy={60} r={44} fill="none" stroke="#FFF3C4" strokeWidth={3} />
              </svg>
              {smallRow('asleep', { blanket: true })}
              <p style={overlayLine}>{LINES.pods}</p>
              {words && restLeft > 0 && <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', opacity: 0.8 }}>{restLeft} minute{restLeft === 1 ? '' : 's'}</p>}
              {overlayButtons(wakeAsk?.status === 'pending' ? null : LINES.askDoor, askWake,
                wakeAsk?.status === 'pending' ? <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, opacity: 0.9 }}>{LINES.asked}</p> : null)}
            </div>
          )}

          {overlay === 'orbit' && (
            <div style={{ ...overlayBase, background: 'linear-gradient(180deg, #FBF3DF 0%, #F1DDB7 100%)', color: 'var(--ink)' }}>
              <svg viewBox="0 0 140 140" width={130} height={130} aria-hidden>
                <circle cx={70} cy={70} r={56} fill="none" stroke="#1A1A2E" strokeWidth={1.5} strokeDasharray="4 5" opacity={0.6} />
                <circle cx={70} cy={70} r={18} fill="#F4C542" stroke="#1A1A2E" strokeWidth={2} />
                <circle cx={70 + Math.sin(restFraction * Math.PI * 2) * 56} cy={70 - Math.cos(restFraction * Math.PI * 2) * 56} r={9} fill={theme.hex} stroke="#1A1A2E" strokeWidth={2} />
              </svg>
              {smallRow('resting', { clockFor: true })}
              <p style={overlayLine}>{LINES.orbit}</p>
              {words && restLeft > 0 && <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', opacity: 0.8 }}>{restLeft} minute{restLeft === 1 ? '' : 's'}</p>}
              {overlayButtons(wakeAsk?.status === 'pending' ? null : LINES.askDoor, askWake,
                wakeAsk?.status === 'pending' ? <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800 }}>{LINES.asked}</p> : null)}
            </div>
          )}

          {overlay === 'sunlight' && sunlight && sunlightFriend && (
            <div style={{ ...overlayBase, background: 'linear-gradient(180deg, #FFF9E6 0%, #FFE5A8 100%)', color: 'var(--ink)', justifyContent: 'space-between' }}
              onPointerDown={() => { if (sunlight.stage === 'waiting') { playFx('sparkle'); setSunlight({ ...sunlight, sparks: sunlight.sparks + 1 }) } }}>
              <svg viewBox="0 0 300 260" width="100%" style={{ maxWidth: 320 }} aria-hidden>
                {sunlight.stage === 'waiting' && (
                  <g>
                    <circle cx={150} cy={200 - 150 * restFraction} r={46} fill="#F4C542" />
                    {Array.from({ length: Math.min(12, sunlight.sparks) }).map((_, i) => (
                      <circle key={i} cx={40 + ((i * 53) % 220)} cy={30 + ((i * 37) % 120)} r={4} fill="#F4C542" className="pl-sparkle" />
                    ))}
                  </g>
                )}
                <g transform="translate(150 250) scale(1.3)">
                  <FriendFigure friend={sunlightFriend.key} mood={sunlight.stage === 'waiting' ? 'sunbathing' : moods[sunlightFriend.key]} baby={!isGrownUp(sunlightFriend.key, view.childAge)} />
                </g>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <p style={overlayLine}>{sunlight.stage === 'prompt' ? LINES.sunlightPrompt : LINES.sunlightWaiting}</p>
                {sunlight.stage === 'prompt' && live.tier === 1 && <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink-soft)' }}>{LINES.sunlightGrownup}</p>}
                {sunlight.stage === 'prompt' ? (
                  <button onClick={catchSunshine} style={{ ...chunky('accent'), width: 150, height: 150, borderRadius: '50%', background: '#F4C542', color: 'var(--ink)', fontSize: 'var(--text-md)', boxShadow: '0 6px 0 var(--ink)' }}>
                    ☀️ {LINES.sunlightButton}
                  </button>
                ) : (
                  <button onClick={() => setSunlight(null)} style={chunky('white')}>{LINES.backToPlanet}</button>
                )}
              </div>
            </div>
          )}

          {overlay === 'night' && (
            <div style={{ ...overlayBase, background: 'linear-gradient(180deg, #14183A 0%, #080A1C 100%)', color: '#F7F7F5' }}>
              <div style={{ position: 'absolute', left: 18, bottom: 18, width: 70, height: 70, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,214,120,0.55) 0%, rgba(255,214,120,0) 70%)' }} aria-hidden />
              <img src="/digi-squad/DiGi-star.svg" alt="" width={30} height={30} className="pl-float" style={{ position: 'absolute', top: 18, right: 22, width: 30, height: 30, opacity: 0.9 }} />
              {smallRow('asleep', { blanket: true, pyjamas: true }, live.friends)}
              <p style={overlayLine}>{live.tier === 1 ? LINES.nightTier1 : LINES.nightTier2}</p>
              {(() => {
                const ask = view.screenAsk
                if (fixture && nightAsked) return overlayButtons(null, null, <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, opacity: 0.9 }}>{LINES.asked}</p>)
                if (ask?.status === 'approved') return overlayButtons(null, null,
                  <button onClick={startWindow} disabled={busy} style={{ ...chunky('accent'), opacity: busy ? 0.6 : 1 }}>{LINES.startWindow} ⭐</button>)
                if (ask?.status === 'pending' || nightAsked) return overlayButtons(null, null, <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, opacity: 0.9 }}>{LINES.asked}</p>)
                if (ask?.status === 'declined') return overlayButtons(null, null, <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, opacity: 0.9 }}>{LINES.nightNotNow}</p>)
                return overlayButtons(LINES.askDoor, askNight)
              })()}
            </div>
          )}
        </div>

        {overlay !== 'night' && overlay !== 'sunlight' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <button onClick={() => { interact(); playFx('tap'); setBoardOpen(o => !o) }} style={chunky(boardOpen ? 'white' : 'accent')}>
              🎯 {live.tier === 1 ? MISSION_LINES.boardTier1 : MISSION_LINES.board}{inProgress > 0 ? ` (${inProgress})` : ''}
            </button>
            {overlay === 'none' && (
              <button onClick={() => { interact(); playFx('tap'); openBox(!boxOpen) }} style={chunky(boxOpen ? 'white' : 'accent')} aria-expanded={boxOpen}>
                🧰 {MISSION_LINES.box}{box.length + boxWear.length > 0 ? ` (${box.length + boxWear.length})` : ''}
              </button>
            )}
            {overlay === 'none' && live.tier >= 2 && awake.length > 1 && (
              <button onClick={everyoneToBed} style={chunky('white')}>🌙 {LINES.everyoneToBed}</button>
            )}
          </div>
        )}

        {/* The parts box (slice 3): what the missions and the growth brought,
            waiting to be put somewhere. Drag a part onto the planet, an outfit
            onto a Friend. Drag a placed part off the bottom to put it back. */}
        {boxOpen && overlay === 'none' && (
          <div role="region" aria-label={MISSION_LINES.box} style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 30, background: '#fff', color: 'var(--ink)', borderTop: '2px solid var(--ink)', boxShadow: '0 -4px 0 rgba(26,26,46,0.12)', padding: '10px 12px calc(env(safe-area-inset-bottom, 0px) + 10px)', maxHeight: '42vh', overflowY: 'auto' }}>
           <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)' }}>🧰 {MISSION_LINES.box}</p>
              <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{MISSION_LINES.spaces(spacesLeft)}</p>
              <button onClick={() => { playFx('tap'); setBoxOpen(false) }} aria-label={MISSION_LINES.close} style={{ width: 34, height: 34, borderRadius: '50%', background: '#fff', border: '2px solid var(--ink)', boxShadow: '0 2px 0 var(--ink)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900 }}>✕</button>
            </div>
            <p style={{ margin: '2px 0 8px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.3 }}>
              {box.length + boxWear.length === 0 ? MISSION_LINES.boxEmpty : MISSION_LINES.boxHint}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {box.map(part => (
                <div key={part} role="button" tabIndex={0} aria-label={`Carry ${PART_LABELS[part]}`} data-box-part={part}
                  onPointerDown={e => startCarry(e, { kind: 'part', part })} onPointerMove={moveCarry} onPointerUp={endCarry} onPointerCancel={() => setCarry(null)}
                  style={{ width: 66, touchAction: 'none', cursor: 'grab', userSelect: 'none', background: 'var(--butter-lt)', border: '2px solid var(--ink)', borderRadius: 14, boxShadow: '0 3px 0 var(--ink)', padding: '4px 2px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, opacity: carry?.kind === 'part' && carry.part === part ? 0.4 : 1 }}>
                  <svg viewBox={PART_ZONE[part] === 'sky' ? '-40 -40 80 80' : '-40 -70 80 80'} width={46} height={46} aria-hidden style={{ pointerEvents: 'none' }}>
                    <PartArt part={part} accent={theme.hex} night={false} />
                  </svg>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xs)', textAlign: 'center', lineHeight: 1.15 }}>{PART_LABELS[part]}</span>
                </div>
              ))}
              {boxWear.map(outfit => (
                <div key={outfit} role="button" tabIndex={0} aria-label={`Carry ${OUTFIT_LABELS[outfit]}`} data-box-outfit={outfit}
                  onPointerDown={e => startCarry(e, { kind: 'outfit', outfit })} onPointerMove={moveCarry} onPointerUp={endCarry} onPointerCancel={() => setCarry(null)}
                  style={{ width: 66, touchAction: 'none', cursor: 'grab', userSelect: 'none', background: '#fff', border: '2px solid var(--ink)', borderRadius: 14, boxShadow: '0 3px 0 var(--ink)', padding: '4px 2px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, opacity: carry?.kind === 'outfit' && carry.outfit === outfit ? 0.4 : 1 }}>
                  <span aria-hidden style={{ fontSize: 32, lineHeight: '46px' }}>{OUTFIT_ICON[outfit]}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xs)', textAlign: 'center', lineHeight: 1.15 }}>{OUTFIT_LABELS[outfit]}</span>
                </div>
              ))}
            </div>
            {Object.keys(live.build.wearing).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {(Object.entries(live.build.wearing) as [FriendKey, Outfit][]).map(([friend, outfit]) => (
                  <button key={friend} onClick={() => takeOff(friend)} aria-label={`Take the ${OUTFIT_LABELS[outfit].replace(/^(A|An) /, '').toLowerCase()} off ${friendArt(friend).name}`}
                    style={{ border: '1.5px solid var(--ink)', borderRadius: 999, background: '#fff', padding: '4px 10px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xs)', cursor: 'pointer', color: 'var(--ink)' }}>
                    {OUTFIT_ICON[outfit]} {friendArt(friend).name} ✕
                  </button>
                ))}
              </div>
            )}
           </div>
          </div>
        )}
        {carry && (
          <div aria-hidden style={{ position: 'fixed', left: carry.x, top: carry.y, transform: 'translate(-50%, -60%)', pointerEvents: 'none', zIndex: 50 }}>
            {carry.kind === 'part' ? (
              <svg viewBox={PART_ZONE[carry.part] === 'sky' ? '-40 -40 80 80' : '-40 -70 80 80'} width={90} height={90} style={{ filter: 'drop-shadow(0 8px 0 rgba(26,26,46,0.25))' }}>
                <PartArt part={carry.part} accent={theme.hex} night={false} />
              </svg>
            ) : <span style={{ fontSize: 54 }}>{OUTFIT_ICON[carry.outfit]}</span>}
          </div>
        )}

        <p style={{ textAlign: 'center', margin: '14px 0 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkMuted }}>
          {childName}&apos;s planet
        </p>
      </div>
    </div>
  )
}
