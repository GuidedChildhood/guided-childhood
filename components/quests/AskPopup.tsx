'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { deviceEmoji, deviceLabel, minutesToStars } from '@/lib/quests/device-time'
import { chunky } from '@/components/scripts/card-system'

// A child's ask, popped up wherever the parent is in the app.
//
// Justin, 2 September 2026, with the child's balance card: "pops up on
// parent app so they can agree it, deducts from star account." Until now
// an ask reached a parent as a web push, or as a row that appeared on a
// polled card on three pages. A parent already inside the app on any other
// page, or one who had said no to notifications, could sit there for half
// a minute or never know. This is the pop up: the same feed the cards read,
// asked every twenty seconds while the app is on screen, and the moment a
// child's ask is waiting a sheet rises from the bottom with who, how long,
// on what, what it costs and what they have. Yes takes the stars (the
// request route charges the bank on the yes since today); Not now declines
// warmly. Later puts it down for this ask only, so it never nags.
//
// Not on the timer page, which carries the full ask box already.

type Kid = {
  id: string
  name: string
  balance: number
  starMinutes?: number
  session: { id: string } | null
  request: { id: string; device: string; minutes: number; deviceName?: string | null } | null
  /** Planet Friends: the child asked to wake the Friends early, or says a mission is done. */
  planet?: { id: string; minutesLeft: number; createdAt: string; kind?: 'wake' | 'mission'; title?: string | null } | null
}

const DISMISSED_KEY = 'gc-ask-popup-dismissed'

function readDismissed(): Set<string> {
  try { return new Set(JSON.parse(sessionStorage.getItem(DISMISSED_KEY) ?? '[]') as string[]) } catch { return new Set() }
}
function writeDismissed(ids: Set<string>) {
  try { sessionStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids])) } catch { /* private mode */ }
}

export default function AskPopup({ initial }: {
  /** A fixture render: shown as handed, never polled. */
  initial?: Kid[]
}) {
  const pathname = usePathname()
  const [kids, setKids] = useState<Kid[]>(initial ?? [])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<string | null>(null)

  useEffect(() => { setDismissed(readDismissed()) }, [])

  useEffect(() => {
    if (initial) return
    let live = true
    const load = () => {
      if (document.hidden) return
      fetch('/api/quests/time/active')
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (live && d?.children) setKids(d.children) })
        .catch(() => { /* the next poll tries again */ })
    }
    load()
    const id = setInterval(load, 20000)
    const onVis = () => { if (!document.hidden) load() }
    document.addEventListener('visibilitychange', onVis)
    return () => { live = false; clearInterval(id); document.removeEventListener('visibilitychange', onVis) }
  }, [initial])

  if (pathname?.startsWith('/dashboard/quests/timer')) return null
  // The planet ask rides the same sheet. It is asked first only when no
  // screen time ask is waiting, so a parent is never shown two at once.
  const planetKid = kids.find(k => k.planet && !dismissed.has(k.planet.id))
  const asking = kids.find(k => k.request && !k.session && !dismissed.has(k.request.id)) ?? planetKid
  if (!asking) return null
  if (!asking.request && asking.planet) return <PlanetAsk kid={asking} planet={asking.planet} dismissed={dismissed} setDismissed={setDismissed} setKids={setKids} initial={Boolean(initial)} />
  if (!asking.request) return null
  const req = asking.request
  const rate = asking.starMinutes ?? 5
  const cost = minutesToStars(req.minutes, rate)
  const shortStars = Math.max(0, cost - asking.balance)
  const screen = req.deviceName ?? `the ${deviceLabel(req.device)}`

  async function answer(status: 'approved' | 'declined') {
    if (busy || initial) return
    setBusy(true)
    try {
      const r = await fetch('/api/quests/time/request', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: req.id, status }),
      })
      if (r.ok) {
        const d = await r.json().catch(() => ({})) as { charged?: { stars?: number; shortMinutes?: number } }
        const taken = d.charged?.stars ?? 0
        setDone(status === 'approved'
          ? `Yes sent. ${taken > 0 ? `${taken} star${taken === 1 ? '' : 's'} taken from ${asking!.name}'s bank. ` : ''}They tap Start when they are at ${screen}.`
          : `Told ${asking!.name} not right now. Their stars are safe.`)
        setTimeout(() => {
          setDone(null)
          setKids(ks => ks.map(k => k.id === asking!.id ? { ...k, request: null } : k))
        }, 2200)
      }
    } catch { /* leave it up so they can try again */ }
    finally { setBusy(false) }
  }

  function later() {
    const next = new Set(dismissed); next.add(req.id)
    setDismissed(next); writeDismissed(next)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 190, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(26,26,46,0.35)', padding: '0 12px calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
      <style>{`@keyframes gc-ask-up { from { transform: translateY(24px); opacity: 0 } to { transform: none; opacity: 1 } }`}</style>
      <div role="dialog" aria-live="polite" style={{
        width: 'min(100%, 520px)', background: '#fff', color: 'var(--ink)',
        border: '2.5px solid var(--ink)', borderRadius: 24, boxShadow: '0 6px 0 var(--ink)',
        padding: '18px 18px 16px', animation: 'gc-ask-up 0.28s ease-out', fontFamily: 'var(--font-body)',
      }}>
        {done ? (
          <div style={{ background: 'var(--retro-green)', color: '#fff', border: '2px solid var(--ink)', borderRadius: 16, padding: '14px 16px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', lineHeight: 1.3 }}>
            ✓ {done}
          </div>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 6 }}>
              Screen time ask
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span aria-hidden style={{ flexShrink: 0, width: 54, height: 54, borderRadius: '50%', background: 'var(--terracotta)', border: '2px solid var(--ink)', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                {deviceEmoji(req.device)}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  {asking.name} is asking for {req.minutes} minutes
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.35 }}>
                  On {screen}. That is {cost} star{cost === 1 ? '' : 's'}, they have {asking.balance}.
                  {shortStars > 0 ? ` ${shortStars} short, your yes covers the rest.` : ' Your yes takes the stars now.'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button onClick={() => answer('approved')} disabled={busy} style={{ ...chunky('butter', 'lg'), flex: 1, opacity: busy ? 0.6 : 1 }}>
                Yes ⭐
              </button>
              <button onClick={() => answer('declined')} disabled={busy} style={{ ...chunky('white', 'lg'), flexShrink: 0, opacity: busy ? 0.6 : 1 }}>
                Not now
              </button>
            </div>
            <button onClick={later} style={{ display: 'block', margin: '10px auto 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
              Decide later
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// Planet Friends: "can the Friends wake up early". Yes wakes them now and
// pays the planet's growth for the minutes they did sleep; Not now keeps the nap and
// the child's screen says so kindly. No stars change hands, the toy mints
// none and spends none.
function PlanetAsk({ kid, planet, dismissed, setDismissed, setKids, initial }: {
  kid: Kid
  planet: { id: string; minutesLeft: number; createdAt: string; kind?: 'wake' | 'mission'; title?: string | null }
  dismissed: Set<string>
  setDismissed: (s: Set<string>) => void
  setKids: (f: (ks: Kid[]) => Kid[]) => void
  initial: boolean
}) {
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<string | null>(null)

  async function answer(status: 'approved' | 'declined') {
    if (busy || initial) return
    setBusy(true)
    try {
      const r = await fetch('/api/quests/planet/ask', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId: kid.id, askId: planet.id, status }),
      })
      if (r.ok) {
        setDone(mission
          ? (status === 'approved' ? `Yes sent. The reward is landing on ${kid.name}'s planet.` : `Told ${kid.name} not this time. The mission stays on their board.`)
          : (status === 'approved' ? `The Planet Friends are waking up for ${kid.name}.` : `Told ${kid.name} the Friends are still sleepy. The nap carries on.`))
        setTimeout(() => {
          setDone(null)
          setKids(ks => ks.map(k => k.id === kid.id ? { ...k, planet: null } : k))
        }, 2200)
      }
    } catch { /* leave it up so they can try again */ }
    finally { setBusy(false) }
  }

  function later() {
    const next = new Set(dismissed); next.add(planet.id)
    setDismissed(next); writeDismissed(next)
  }

  const left = planet.minutesLeft
  const mission = planet.kind === 'mission'
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 190, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(26,26,46,0.35)', padding: '0 12px calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
      <style>{`@keyframes gc-ask-up { from { transform: translateY(24px); opacity: 0 } to { transform: none; opacity: 1 } }`}</style>
      <div role="dialog" aria-live="polite" style={{
        width: 'min(100%, 520px)', background: '#fff', color: 'var(--ink)',
        border: '2.5px solid var(--ink)', borderRadius: 24, boxShadow: '0 6px 0 var(--ink)',
        padding: '18px 18px 16px', animation: 'gc-ask-up 0.28s ease-out', fontFamily: 'var(--font-body)',
      }}>
        {done ? (
          <div style={{ background: 'var(--retro-green)', color: '#fff', border: '2px solid var(--ink)', borderRadius: 16, padding: '14px 16px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', lineHeight: 1.3 }}>
            ✓ {done}
          </div>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 6 }}>
              {mission ? 'Mission done' : 'Planet ask'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span aria-hidden style={{ flexShrink: 0, width: 54, height: 54, borderRadius: '50%', background: 'var(--terracotta)', border: '2px solid var(--ink)', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                🪐
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  {mission ? `${kid.name} ${planet.title ?? 'did a mission.'}` : `${kid.name} wants to wake the Planet Friends`}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.35 }}>
                  {mission
                    ? 'Your yes lands the reward on their planet. Not now puts the mission back on their board, kindly. No stars are involved.'
                    : `The Friends have ${left} minute${left === 1 ? '' : 's'} of rest left in their pods. Yes wakes them now. Not now keeps the nap, and no stars are involved.`}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button onClick={() => answer('approved')} disabled={busy} style={{ ...chunky('butter', 'lg'), flex: 1, opacity: busy ? 0.6 : 1 }}>
                Yes 🪐
              </button>
              <button onClick={() => answer('declined')} disabled={busy} style={{ ...chunky('white', 'lg'), flexShrink: 0, opacity: busy ? 0.6 : 1 }}>
                Not now
              </button>
            </div>
            <button onClick={later} style={{ display: 'block', margin: '10px auto 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
              Decide later
            </button>
          </>
        )}
      </div>
    </div>
  )
}
