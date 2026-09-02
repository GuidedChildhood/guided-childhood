'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import type { KidTheme } from '@/lib/kid/theme'
import type { ClientEvent, GardenView } from '@/lib/planter/view'
import {
  GROWTH, TIERS, TICK_CAP_SECONDS, AMBIENT_AFTER_SECONDS,
  applyEvent, drainPerMinute, minutesLeft, moodOf, reconcile, restOverlay,
  type Garden, type Mood, type Plant,
} from '@/lib/planter/logic'
import { LINES } from '@/lib/planter/registry'
import { playFx, startTune } from '@/lib/planter/sounds'
import { soundEnabled, setSoundEnabled } from '@/lib/sound/kidSounds'
import KidBackLink from '@/components/kid/KidBackLink'
import Greenhouse, { type DropZone, type Sky } from './Greenhouse'
import PlantFigure from './PlantFigure'

// Planter Friends, the toy, on the child link.
//
// Design: plans/planter-friends-architecture.md. This is the root node: it
// holds the garden the server last decided, counts down from the server's
// numbers, reports what the child did, and wears one overlay at a time (the
// nursery, the ambient wait, the sunlight frame, the night). Every overlay
// carries the one door, Ask my grown up. Nothing here ever buzzes the child,
// mints a star or calls a model.
//
// The fixture mode runs the same pure rules locally so /dev/planter can be
// driven by Playwright with no database.

type Overlay = 'none' | 'nursery' | 'ambient' | 'sunlight' | 'night'

function nowServer(offset: number): string {
  return new Date(Date.now() + offset).toISOString()
}

/** The garden as it is right now on the child's screen: due rests closed, energy interpolated between ticks. */
function liveGarden(garden: Garden, nowIso: string): Garden {
  const g = reconcile(garden, nowIso, null)
  const cfg = TIERS[g.tier]
  const secs = Math.max(0, Math.min(TICK_CAP_SECONDS, (new Date(nowIso).getTime() - new Date(g.energyTickedAt).getTime()) / 1000))
  return {
    ...g,
    plants: g.plants.map(p => (p.cooldown ? p : { ...p, energy: Math.max(0, p.energy - (secs / 60) * drainPerMinute(cfg, p.shade)) })),
  }
}

function fixtureApply(v: GardenView, ev: ClientEvent): GardenView {
  const nowIso = new Date().toISOString()
  let garden = reconcile(v.garden, nowIso, null)
  let ask = v.ask
  if (ev.kind === 'ask_wake') {
    const left = Math.max(0, ...garden.plants.filter(p => p.cooldown).map(p => minutesLeft(p.cooldown!, nowIso)))
    ask = { id: 'fixture', kind: 'wake', status: 'pending', createdAt: nowIso, answeredAt: null, minutesLeft: left }
  } else if (ev.kind === 'ask_seen') {
    ask = null
  } else {
    garden = applyEvent(garden, ev, nowIso)
  }
  return { ...v, garden, ask, serverNow: nowIso }
}

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function PlanterGarden({ token, initial, theme, childName, gardener, fixture = false }: {
  token: string | null
  initial: GardenView
  theme: KidTheme
  childName: string
  gardener: { name: string; img: string }
  fixture?: boolean
}) {
  const [view, setView] = useState<GardenView>(initial)
  // The first render uses the server's clock on both sides, so the sun sits
  // in the same place on the server and on the phone and hydration never
  // disagrees. The real clock takes over a second after mount.
  const [nowMs, setNowMs] = useState(() => new Date(initial.serverNow).getTime())
  const [offset, setOffset] = useState(0)
  const [line, setLine] = useState<string>(LINES.welcome)
  const [muted, setMuted] = useState(false)
  const [wiggleId, setWiggleId] = useState<string | null>(null)
  const [sparkleId, setSparkleId] = useState<string | null>(null)
  const [dugPatch, setDugPatch] = useState<number | null>(null)
  const [sunlight, setSunlight] = useState<{ plantId: string; stage: 'prompt' | 'waiting'; sparks: number } | null>(null)
  const [grewShown, setGrewShown] = useState(false)
  const [nightAsked, setNightAsked] = useState(false)
  const [busy, setBusy] = useState(false)
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
  const live = useMemo(() => liveGarden(view.garden, nowIso), [view.garden, nowIso])
  const cfg = TIERS[live.tier]
  const moods = useMemo(() => Object.fromEntries(live.plants.map(p => [p.id, moodOf(p)])) as Record<string, Mood>, [live])

  const windowOpen = Boolean(view.bedtime.windowUntil && new Date(view.bedtime.windowUntil).getTime() > nowMs + offset)
  const bedtimeLocked = view.bedtime.phase === 'bedtime' && !windowOpen
  const rest = restOverlay(live)
  const overlay: Overlay = bedtimeLocked ? 'night' : sunlight ? 'sunlight' : rest ?? 'none'
  overlayRef.current = overlay
  const sky: Sky = bedtimeLocked ? 'night' : view.bedtime.phase === 'winddown' ? 'evening' : 'day'
  const awake = live.plants.filter(p => !p.cooldown)
  const sunEnergy = awake.length ? awake.reduce((s, p) => s + p.energy, 0) / (awake.length * 100) : 0
  const grewTotal = live.plants.reduce((s, p) => s + p.grewWhileAway, 0)

  const say = useCallback((text: string) => setLine(text), [])

  const refresh = useCallback(async () => {
    if (fixture || !token) {
      setView(v => ({ ...v, garden: reconcile(v.garden, new Date().toISOString(), null), serverNow: new Date().toISOString() }))
      return
    }
    try {
      const r = await fetch(`/api/kid/planter/state?token=${token}`, { cache: 'no-store' })
      if (r.ok) setView(await r.json())
    } catch { /* the next poll tries again */ }
  }, [fixture, token])

  const send = useCallback(async (ev: ClientEvent) => {
    if (fixture || !token) { setView(v => fixtureApply(v, ev)); return }
    try {
      const r = await fetch('/api/kid/planter/event', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...ev }),
      })
      if (r.ok) setView(await r.json())
    } catch { /* the next poll tries again */ }
  }, [fixture, token])

  // Only real play drains: one tick a minute while the greenhouse is open and
  // on screen. Hidden or resting, nothing is sent and nothing drains.
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible' && overlayRef.current === 'none') void send({ kind: 'tick' })
    }, 60000)
    return () => clearInterval(id)
  }, [send])

  // While something rests or an ask is out, ask the server every twenty
  // seconds, the same cadence the parent's pop up uses. And on every return
  // to the tab, because the plants may have woken while it was away.
  const askOut = view.ask?.status === 'pending' || view.screenAsk?.status === 'pending'
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
  const restingCount = live.plants.filter(p => p.cooldown).length
  const prevRestingRef = useRef(restingCount)
  useEffect(() => {
    if (prevRestingRef.current > restingCount) void refresh()
    prevRestingRef.current = restingCount
  }, [restingCount, refresh])

  // A drained plant that nobody has touched for twenty seconds rests by
  // itself (design 3.1). Once per plant per drain.
  useEffect(() => {
    for (const p of live.plants) {
      if (p.cooldown) { ambientSentRef.current.delete(p.id); continue }
      if (p.energy <= 0 && Date.now() - lastInteractRef.current > AMBIENT_AFTER_SECONDS * 1000 && !ambientSentRef.current.has(p.id)) {
        ambientSentRef.current.add(p.id)
        say(LINES.ambient)
        void send({ kind: 'ambient_start', plantId: p.id })
      }
    }
  }, [nowMs, live, send, say])

  // The wind down says its one line, once.
  useEffect(() => {
    if (view.bedtime.phase === 'winddown' && !windDownSaidRef.current) { windDownSaidRef.current = true; say(LINES.windDown) }
  }, [view.bedtime.phase, say])

  // The music box plays through a rest and stops the moment it ends.
  useEffect(() => {
    if (overlay !== 'nursery' && overlay !== 'ambient') return
    if (muted) return
    const stop = startTune(live.tier === 1 ? 'twinkle' : 'slow')
    return stop
  }, [overlay, muted, live.tier])

  // The grown up's answer to the wake ask: say it once, then clear it.
  useEffect(() => {
    const ask = view.ask
    if (!ask || ask.status === 'pending' || askSeenRef.current === ask.id) return
    askSeenRef.current = ask.id
    say(ask.status === 'approved' ? LINES.yes : LINES.notNow)
    if (ask.status === 'approved') playFx('chime')
    void send({ kind: 'ask_seen' })
  }, [view.ask, say, send])

  // The sunlight frame closes itself when the sunshine has been caught.
  useEffect(() => {
    if (!sunlight || sunlight.stage !== 'waiting') return
    const p = live.plants.find(x => x.id === sunlight.plantId)
    if (p && !p.cooldown) { setSunlight(null); say(LINES.sunlightDone); playFx('chime') }
  }, [live, sunlight, say])

  // While you were away: the card pops once, and the child's tap clears it.
  useEffect(() => {
    if (grewTotal > 0 && !grewShown && grewRef.current && !reduceMotion()) {
      gsap.fromTo(grewRef.current, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' })
    }
  }, [grewTotal, grewShown])
  useEffect(() => { if (grewTotal === 0) setGrewShown(false) }, [grewTotal])

  // The greenhouse breathes in when it wakes.
  const prevOverlayRef = useRef<Overlay>(overlay)
  useEffect(() => {
    if (prevOverlayRef.current !== 'none' && overlay === 'none' && stageRef.current && !reduceMotion()) {
      gsap.fromTo(stageRef.current, { scale: 0.97 }, { scale: 1, duration: 0.45, ease: 'power2.out' })
    }
    prevOverlayRef.current = overlay
  }, [overlay])

  function interact() { lastInteractRef.current = Date.now() }

  function flash(setter: (v: string | null) => void, id: string, ms: number) {
    setter(id)
    setTimeout(() => setter(null), ms)
  }

  const onDropPlant = (plantId: string, zone: DropZone | null) => {
    interact()
    if (zone === 'bed') { playFx('yawn'); say(LINES.napStart); void send({ kind: 'nap_start', plantId }) }
    else if (zone === 'window') { playFx('tap'); setSunlight({ plantId, stage: 'prompt', sparks: 0 }) }
    else playFx('pat')
  }
  const onTickle = (plantId: string) => { interact(); playFx('giggle'); say(LINES.tickled); flash(setWiggleId, plantId, 700) }
  const onWater = (plantId: string) => { interact(); playFx('pour'); say(LINES.watered); flash(setSparkleId, plantId, 1200) }
  const onDig = (patch: number) => { interact(); playFx('pat'); say(LINES.dug); setDugPatch(patch); setTimeout(() => setDugPatch(null), 600) }
  const onShade = (plantId: string, on: boolean) => { interact(); playFx('tap'); say(on ? LINES.shadeOn : LINES.shadeOff); void send({ kind: 'shade', plantId, on }) }

  async function everyoneToBed() {
    interact()
    playFx('yawn')
    say(LINES.napStart)
    for (const p of live.plants) if (!p.cooldown) await send({ kind: 'nap_start', plantId: p.id })
  }

  async function catchSunshine() {
    if (!sunlight) return
    interact()
    playFx('sparkle')
    say(LINES.sunlightWaiting)
    setSunlight({ ...sunlight, stage: 'waiting' })
    await send({ kind: 'sunlight_start', plantId: sunlight.plantId })
  }

  async function askWake() {
    interact()
    playFx('tap')
    say(LINES.asked)
    await send({ kind: 'ask_wake' })
  }

  // The night door IS the device time ask: minutes on this screen inside
  // bedtime already go to the parent as an ask, and their yes opens the
  // greenhouse for those minutes. Whole stars at the child's own rate.
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

  const restingPlants = live.plants.filter(p => p.cooldown)
  const restLeft = restingPlants.length ? Math.max(...restingPlants.map(p => minutesLeft(p.cooldown!, nowIso))) : 0
  const restFraction = restingPlants.length
    ? Math.max(...restingPlants.map(p => {
        const c = p.cooldown!
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

  const sunlightPlant = sunlight ? live.plants.find(p => p.id === sunlight.plantId) ?? null : null

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg, color: theme.ink, fontFamily: 'var(--font-body)' }}>
      <style>{`
        @keyframes pf-breathe { 0%, 100% { transform: scale(1) } 50% { transform: scale(1.03) } }
        @keyframes pf-wiggle { 0%, 100% { transform: rotate(0) } 25% { transform: rotate(-6deg) } 75% { transform: rotate(6deg) } }
        @keyframes pf-sparkle { 0% { opacity: 0; transform: translateY(6px) } 30% { opacity: 1 } 100% { opacity: 0; transform: translateY(-14px) } }
        @keyframes pf-drops { 0% { transform: translateY(0); opacity: 1 } 100% { transform: translateY(40px); opacity: 0 } }
        @keyframes pf-puff { 0% { transform: scale(0.4); opacity: 0.7 } 100% { transform: scale(2); opacity: 0 } }
        @keyframes pf-sun { 0%, 100% { transform: rotate(0) } 50% { transform: rotate(6deg) } }
        @keyframes pf-float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        @keyframes pf-ripple { 0% { transform: scale(0.6); opacity: 0.6 } 100% { transform: scale(2.2); opacity: 0 } }
        .pf-breathe { animation: pf-breathe 3.2s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100% }
        .pf-wiggle { animation: pf-wiggle 0.7s ease-in-out; transform-box: fill-box; transform-origin: 50% 100% }
        .pf-sparkle { animation: pf-sparkle 1.2s ease-out }
        .pf-drops { animation: pf-drops 0.6s linear infinite }
        .pf-puff { animation: pf-puff 0.6s ease-out forwards; transform-box: fill-box; transform-origin: center }
        .pf-sun { animation: pf-sun 6s ease-in-out infinite }
        .pf-float { animation: pf-float 5s ease-in-out infinite }
        .pf-ripple { animation: pf-ripple 0.9s ease-out forwards }
        @media (prefers-reduced-motion: reduce) { .pf-breathe, .pf-wiggle, .pf-sparkle, .pf-drops, .pf-puff, .pf-sun, .pf-float, .pf-ripple { animation: none } }
      `}</style>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '10px 12px calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '6px 4px 10px' }}>
          {token ? <KidBackLink href={`/k/${token}`} color={theme.ink} /> : <span />}
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', letterSpacing: '-0.01em' }}>My garden 🌱</span>
          <button onClick={toggleMute} aria-label={muted ? 'Sound on' : 'Sound off'} style={{ width: 42, height: 42, borderRadius: '50%', background: '#fff', border: '2px solid var(--ink)', boxShadow: '0 3px 0 var(--ink)', cursor: 'pointer', fontSize: 18 }}>
            {muted ? '🔇' : '🔊'}
          </button>
        </header>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: theme.panel, border: `1px solid ${theme.panelBorder}`, borderRadius: 18, padding: '8px 12px', marginBottom: 10 }}>
          <img src={gardener.img} alt={gardener.name} width={36} height={36} style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} />
          <p aria-live="polite" style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', lineHeight: 1.3, color: theme.ink }}>{line}</p>
        </div>

        <div ref={stageRef} style={{ position: 'relative', borderRadius: 24, border: '2.5px solid var(--ink)', boxShadow: '0 6px 0 var(--ink)', overflow: 'hidden', background: '#fff' }}>
          <Greenhouse
            plants={live.plants}
            moods={moods}
            tier={live.tier}
            sky={sky}
            sunEnergy={sunEnergy}
            pyjamas={bedtimeLocked}
            wiggleId={wiggleId}
            sparkleId={sparkleId}
            dugPatch={dugPatch}
            onDropPlant={onDropPlant}
            onTickle={onTickle}
            onWater={onWater}
            onDig={onDig}
            onShade={onShade}
            onInteract={interact}
          />

          {grewTotal > 0 && !grewShown && overlay === 'none' && (
            <div ref={grewRef} style={{ position: 'absolute', left: 14, right: 14, bottom: 14, zIndex: 4, background: '#fff', border: '2px solid var(--ink)', borderRadius: 18, boxShadow: '0 5px 0 var(--ink)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }} aria-hidden>🌿</span>
              <p style={{ margin: 0, flex: 1, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', lineHeight: 1.2, color: 'var(--ink)' }}>
                {grewTotal >= GROWTH.night ? LINES.grewNight : LINES.grewAway}
              </p>
              <button onClick={() => { setGrewShown(true); playFx('chime'); void send({ kind: 'seen' }) }} style={{ ...chunky('accent'), padding: '10px 14px' }}>Yay!</button>
            </div>
          )}

          {overlay === 'nursery' && (
            <div style={{ ...overlayBase, background: 'linear-gradient(180deg, #1C2340 0%, #0F1327 100%)', color: '#F7F7F5' }} onPointerDown={() => playFx('shh')}>
              <svg viewBox="0 0 120 120" width={110} height={110} aria-hidden>
                <circle cx={60} cy={60} r={44} fill="#2B3568" />
                <clipPath id="pf-moonfill"><rect x={16} y={104 - 88 * restFraction} width={88} height={88 * restFraction} /></clipPath>
                <circle cx={60} cy={60} r={44} fill="#FFF3C4" clipPath="url(#pf-moonfill)" />
                <circle cx={60} cy={60} r={44} fill="none" stroke="#FFF3C4" strokeWidth={3} />
              </svg>
              <svg viewBox="0 0 240 110" width={220} height={100} aria-hidden>
                {restingPlants.slice(0, 3).map((p, i) => (
                  <g key={p.id} transform={`translate(${60 + i * 60} 100) scale(0.5)`}>
                    <g className="pf-breathe"><PlantFigure plant={p} mood="asleep" blanket /></g>
                  </g>
                ))}
              </svg>
              <p style={overlayLine}>{LINES.nursery}</p>
              {words && restLeft > 0 && <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', opacity: 0.8 }}>{restLeft} minute{restLeft === 1 ? '' : 's'}</p>}
              {overlayButtons(view.ask?.status === 'pending' ? null : LINES.askDoor, askWake,
                view.ask?.status === 'pending' ? <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, opacity: 0.9 }}>{LINES.asked}</p> : null)}
            </div>
          )}

          {overlay === 'ambient' && (
            <div style={{ ...overlayBase, background: 'linear-gradient(180deg, #FBF3DF 0%, #F1DDB7 100%)', color: 'var(--ink)' }}>
              <svg viewBox="0 0 120 120" width={120} height={120} aria-hidden>
                <circle cx={60} cy={60} r={50} fill="#fff" stroke="#1A1A2E" strokeWidth={3} />
                {Array.from({ length: 12 }).map((_, i) => (
                  <circle key={i} cx={60 + Math.sin((i / 12) * Math.PI * 2) * 40} cy={60 - Math.cos((i / 12) * Math.PI * 2) * 40} r={2} fill="#1A1A2E" />
                ))}
                <line x1={60} y1={60} x2={60 + Math.sin(restFraction * Math.PI * 2) * 34} y2={60 - Math.cos(restFraction * Math.PI * 2) * 34} stroke="#1A1A2E" strokeWidth={4} strokeLinecap="round" />
                <circle cx={60} cy={60} r={4} fill="#F4C542" stroke="#1A1A2E" strokeWidth={2} />
              </svg>
              <svg viewBox="0 0 240 110" width={220} height={100} aria-hidden>
                {restingPlants.slice(0, 3).map((p, i) => (
                  <g key={p.id} transform={`translate(${60 + i * 60} 100) scale(0.5)`}>
                    <g className="pf-breathe"><PlantFigure plant={p} mood={moods[p.id]} clock={p.cooldown?.reason === 'ambient'} /></g>
                  </g>
                ))}
              </svg>
              <p style={overlayLine}>{LINES.ambient}</p>
              {words && restLeft > 0 && <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', opacity: 0.8 }}>{restLeft} minute{restLeft === 1 ? '' : 's'}</p>}
              {overlayButtons(view.ask?.status === 'pending' ? null : LINES.askDoor, askWake,
                view.ask?.status === 'pending' ? <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800 }}>{LINES.asked}</p> : null)}
            </div>
          )}

          {overlay === 'sunlight' && sunlight && sunlightPlant && (
            <div style={{ ...overlayBase, background: 'linear-gradient(180deg, #FFF9E6 0%, #FFE5A8 100%)', color: 'var(--ink)', justifyContent: 'space-between' }}
              onPointerDown={() => { if (sunlight.stage === 'waiting') { playFx('sparkle'); setSunlight({ ...sunlight, sparks: sunlight.sparks + 1 }) } }}>
              <svg viewBox="0 0 300 260" width="100%" style={{ maxWidth: 320 }} aria-hidden>
                {sunlight.stage === 'waiting' && (
                  <g>
                    <circle cx={150} cy={200 - 150 * restFraction} r={46} fill="#F4C542" />
                    {Array.from({ length: Math.min(12, sunlight.sparks) }).map((_, i) => (
                      <circle key={i} cx={40 + ((i * 53) % 220)} cy={30 + ((i * 37) % 120)} r={4} fill="#F4C542" className="pf-sparkle" />
                    ))}
                  </g>
                )}
                <g transform="translate(150 250) scale(1.25)">
                  <PlantFigure plant={sunlightPlant} mood={sunlight.stage === 'waiting' ? 'sunbathing' : moods[sunlightPlant.id]} />
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
                  <button onClick={() => setSunlight(null)} style={chunky('white')}>{LINES.backToGarden}</button>
                )}
              </div>
            </div>
          )}

          {overlay === 'night' && (
            <div style={{ ...overlayBase, background: 'linear-gradient(180deg, #14183A 0%, #080A1C 100%)', color: '#F7F7F5' }}>
              <div style={{ position: 'absolute', left: 18, bottom: 18, width: 70, height: 70, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,214,120,0.55) 0%, rgba(255,214,120,0) 70%)' }} aria-hidden />
              <img src="/digi-squad/DiGi-star.svg" alt="" width={30} height={30} className="pf-float" style={{ position: 'absolute', top: 18, right: 22, width: 30, height: 30, opacity: 0.9 }} />
              <svg viewBox="0 0 240 120" width={220} height={110} aria-hidden>
                {live.plants.slice(0, 3).map((p, i) => (
                  <g key={p.id} transform={`translate(${60 + i * 60} 110) scale(0.55)`}>
                    <g className="pf-breathe"><PlantFigure plant={p} mood="asleep" pyjamas blanket /></g>
                  </g>
                ))}
              </svg>
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

        {overlay === 'none' && live.tier >= 2 && awake.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
            <button onClick={everyoneToBed} style={chunky('white')}>🌙 {LINES.everyoneToBed}</button>
          </div>
        )}

        <p style={{ textAlign: 'center', margin: '14px 0 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkMuted }}>
          {childName}&apos;s greenhouse
        </p>
      </div>
    </div>
  )
}
