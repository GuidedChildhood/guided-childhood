'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import type { KidTheme } from '@/lib/kid/theme'
import type { ClientEvent, HomeView } from '@/lib/planet/view'
import {
  GROWTH, TIERS, TICK_CAP_SECONDS, AMBIENT_AFTER_SECONDS,
  applyEvent, drainPerMinute, isGrownUp, minutesLeft, moodOf, reconcile, restOverlay,
  type Home, type FriendKey, type Mood,
} from '@/lib/planet/logic'
import { LINES, friendArt } from '@/lib/planet/registry'
import { playFx, startTune } from '@/lib/planet/sounds'
import { soundEnabled, setSoundEnabled } from '@/lib/sound/kidSounds'
import KidBackLink from '@/components/kid/KidBackLink'
import HomePlanet, { type DropZone, type Sky } from './HomePlanet'
import FriendFigure from './FriendFigure'

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

function fixtureApply(v: HomeView, ev: ClientEvent): HomeView {
  const nowIso = new Date().toISOString()
  let home = reconcile(v.home, nowIso, null)
  let ask = v.ask
  if (ev.kind === 'ask_wake') {
    const left = Math.max(0, ...home.friends.filter(f => f.cooldown).map(f => minutesLeft(f.cooldown!, nowIso)))
    ask = { id: 'fixture', kind: 'wake', status: 'pending', createdAt: nowIso, answeredAt: null, minutesLeft: left }
  } else if (ev.kind === 'ask_seen') {
    ask = null
  } else {
    home = applyEvent(home, ev, nowIso)
  }
  return { ...v, home, ask, serverNow: nowIso }
}

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function PlanetFriends({ token, initial, theme, childName, fixture = false }: {
  token: string | null
  initial: HomeView
  theme: KidTheme
  childName: string
  fixture?: boolean
}) {
  const [view, setView] = useState<HomeView>(initial)
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

  const send = useCallback(async (ev: ClientEvent) => {
    if (fixture || !token) { setView(v => fixtureApply(v, ev)); return }
    try {
      const r = await fetch('/api/kid/planet/event', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...ev }),
      })
      if (r.ok) setView(await r.json())
    } catch { /* the next poll tries again */ }
  }, [fixture, token])

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

  // The grown up's answer to the wake ask: say it once, then clear it.
  useEffect(() => {
    const ask = view.ask
    if (!ask || ask.status === 'pending' || askSeenRef.current === ask.id) return
    askSeenRef.current = ask.id
    say(ask.status === 'approved' ? LINES.yes : LINES.notNow)
    if (ask.status === 'approved') playFx('chime')
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
        .pl-breathe { animation: pl-breathe 3.2s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100% }
        .pl-wiggle { animation: pl-wiggle 0.7s ease-in-out; transform-box: fill-box; transform-origin: 50% 100% }
        .pl-sparkle { animation: pl-sparkle 1.2s ease-out }
        .pl-dust { animation: pl-dust 0.6s linear infinite }
        .pl-puff { animation: pl-puff 0.6s ease-out forwards; transform-box: fill-box; transform-origin: center }
        .pl-star { animation: pl-star 6s ease-in-out infinite }
        .pl-float { animation: pl-float 5s ease-in-out infinite; transform-box: fill-box; transform-origin: center }
        @media (prefers-reduced-motion: reduce) { .pl-breathe, .pl-wiggle, .pl-sparkle, .pl-dust, .pl-puff, .pl-star, .pl-float { animation: none } }
      `}</style>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '10px 12px calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
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
          />

          {grewTotal > 0 && !grewShown && overlay === 'none' && (
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
              {overlayButtons(view.ask?.status === 'pending' ? null : LINES.askDoor, askWake,
                view.ask?.status === 'pending' ? <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, opacity: 0.9 }}>{LINES.asked}</p> : null)}
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
              {overlayButtons(view.ask?.status === 'pending' ? null : LINES.askDoor, askWake,
                view.ask?.status === 'pending' ? <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800 }}>{LINES.asked}</p> : null)}
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

        {overlay === 'none' && live.tier >= 2 && awake.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
            <button onClick={everyoneToBed} style={chunky('white')}>🌙 {LINES.everyoneToBed}</button>
          </div>
        )}

        <p style={{ textAlign: 'center', margin: '14px 0 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkMuted }}>
          {childName}&apos;s planet
        </p>
      </div>
    </div>
  )
}
