'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { KID_DEVICES, TIMER_RULE, deviceEmoji, deviceLabel, type ActiveSession, type TrustLevel } from '@/lib/quests/device-time'
import { STAR_MINUTES } from '@/lib/quests/templates'
import Celebration from '@/components/ui/Celebration'

// The child's own device time timer. They have earned stars; here they turn
// some into minutes on an agreed device, on their own screen. The countdown
// runs from a fixed end time (so it survives a refresh and the parent sees
// the same number), and when it reaches zero the alarm sounds and it stops.
// Stopping early hands the unused minutes back to the bank.

function fmt(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

// When the screen time is done, the answer is never a dead end: a warm row of
// good things to do instead, each one tap. Jobs scroll to the to do list on
// this same screen; printables and games hop to their tabs through callbacks
// the kid screen passes in, so this card never needs to know about tabs.
function OfflineIdeas({ onPrintables, onGames }: { onPrintables?: () => void; onGames?: () => void }) {
  const goJobs = () => {
    try { document.getElementById('my-todo')?.scrollIntoView({ behavior: 'smooth' }) } catch { /* no target */ }
  }
  const idea: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    flex: '1 1 auto', padding: '11px 12px', borderRadius: '14px', border: 'none',
    background: '#fff', cursor: 'pointer', boxShadow: '0 3px 0 rgba(0,0,0,0.14)',
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)',
    lineHeight: 1.2, whiteSpace: 'nowrap',
  }
  return (
    <div style={{ textAlign: 'left' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12.5px', color: 'var(--ink)', margin: '0 0 8px' }}>
        Good things to do instead
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <button onClick={goJobs} style={idea}>⭐ Do a job</button>
        {onPrintables && <button onClick={onPrintables} style={idea}>🖍️ Printables</button>}
        {onGames && <button onClick={onGames} style={idea}>🎮 Play a learning game</button>}
      </div>
    </div>
  )
}

export default function DeviceTimeCard({
  token, balanceStars, initialSession, usedTodayMinutes = 0, recommendedMinutes = 0,
  deviceTrust = 'ask', onAsked, startPicking = false,
  onPrintables, onGames,
}: {
  token: string
  balanceStars: number
  initialSession: ActiveSession | null
  usedTodayMinutes?: number
  recommendedMinutes?: number
  // How much this child does alone: ask (the default, the tap sends an ask
  // and the grown up's yes starts the deal), watch or trusted (the tap
  // starts the timer straight away).
  deviceTrust?: TrustLevel
  // The ask went off: the kid screen's status banner takes over the waiting
  // story, so this card can fold back to idle.
  onAsked?: (ask: { id?: string; device: string; minutes: number }) => void
  // Fixture only: open on the picker so the ref page can screenshot it.
  startPicking?: boolean
  // Optional doorways for the offline ideas row: the kid screen passes these to
  // hop to its Printables tab and its Games sub tab. Left out, those buttons
  // simply do not show.
  onPrintables?: () => void
  onGames?: () => void
}) {
  const router = useRouter()
  const [session, setSession] = useState<ActiveSession | null>(initialSession)
  const [phase, setPhase] = useState<'idle' | 'picking' | 'up'>(startPicking && !initialSession ? 'picking' : 'idle')
  const [device, setDevice] = useState<string>('tv')
  const [minutes, setMinutes] = useState<number>(Math.min(30, balanceStars * STAR_MINUTES))
  const [remaining, setRemaining] = useState<number>(0)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  // True when the block ended because it crossed the day's healthy amount,
  // not because its own minutes ran out, so the finish can say so warmly.
  const [endedByGuide, setEndedByGuide] = useState(false)
  const audioRef = useRef<AudioContext | null>(null)

  // Minutes already used today before the current block started. The server's
  // usedTodayMinutes counts a running block at its full planned length, so when
  // the page loads mid session that block is subtracted back out; a block
  // started from this screen is not in the server number yet, so nothing is.
  const usedBeforeRef = useRef<number>(
    initialSession
      ? Math.max(0, Math.round(usedTodayMinutes) - initialSession.minutes)
      : Math.max(0, Math.round(usedTodayMinutes))
  )

  // The most the child can pick now. Watch and trusted starts are hard capped
  // at what is left of the day's limit, so a self started screen never runs
  // beyond the agreed cap. An ask is different: the grown up decides, so the
  // stars are the only ceiling and an ask past the guide is simply named as
  // going past the healthy amount, both here and on the parent's yes.
  const asksFirst = deviceTrust === 'ask'
  const dailyLimit = Math.round(recommendedMinutes)
  const remainingToday = dailyLimit > 0 && !asksFirst ? Math.max(0, dailyLimit - Math.round(usedTodayMinutes)) : Number.POSITIVE_INFINITY
  const maxMinutes = Math.max(0, Math.min(balanceStars * STAR_MINUTES, remainingToday))
  // Keep the chosen minutes inside the cap, so the picker never shows more than
  // is allowed today.
  useEffect(() => { setMinutes(m => Math.min(m, maxMinutes)) }, [maxMinutes])
  const costStars = Math.ceil(minutes / STAR_MINUTES)

  // A fun, unmistakable Duolingo style jingle: a bright bouncing arpeggio that
  // runs up and lands on a cheeky little "ta da", with a happy buzz on phones.
  // Warm triangle tones so it lifts rather than jars, the way a good app rewards
  // you rather than tells you off.
  const soundAlarm = useCallback(() => {
    try {
      const ctx = audioRef.current
      if (ctx) {
        const now = ctx.currentTime
        const beep = (freq: number, at: number, dur: number, peak = 0.26) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          const t0 = now + at
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(freq, t0)
          gain.gain.setValueAtTime(0.0001, t0)
          gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.02)
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
          osc.connect(gain).connect(ctx.destination)
          osc.start(t0)
          osc.stop(t0 + dur + 0.03)
        }
        // Bright ascending run: C5 E5 G5 C6, then a little bounce back up to
        // C6 for the "ta da". The whole phrase plays, so it is clearly the end.
        const melody: [number, number, number, number?][] = [
          [523, 0.00, 0.16],   // C5
          [659, 0.14, 0.16],   // E5
          [784, 0.28, 0.16],   // G5
          [1047, 0.44, 0.24],  // C6
          [784, 0.72, 0.14, 0.20],  // G5, quick dip
          [1047, 0.86, 0.42, 0.30], // C6, the landing
        ]
        melody.forEach(([f, at, dur, peak]) => beep(f, at, dur, peak))
      }
    } catch { /* audio best effort */ }
    // A cheerful little rhythm on phones, not one long angry buzz.
    try { navigator.vibrate?.([90, 70, 90, 70, 90, 90, 260]) } catch { /* no haptics */ }
  }, [])

  // A soft, warm spoken line, gentle rate so it never barks. Best effort: silent
  // if the browser has no voice or sound is muted. The audio gesture on start
  // already unlocked speech, so this is allowed to play later.
  const say = useCallback((text: string) => {
    try {
      const synth = window.speechSynthesis
      if (!synth) return
      const u = new SpeechSynthesisUtterance(text)
      // Bright and warm, a shade slower than normal so it lands as a friendly
      // send off, never a bark. We reach for a softer, higher voice when the
      // browser offers one (Samantha, Google UK female and the like), so it
      // feels like a kind grown up counting down with them.
      const voices = synth.getVoices?.() ?? []
      const warm = voices.find(v => /samantha|google uk english female|karen|serena|female/i.test(v.name))
      if (warm) u.voice = warm
      u.rate = 0.92
      u.pitch = 1.18
      u.volume = 0.9
      synth.speak(u)
    } catch { /* speech optional */ }
  }, [])

  // The last ten seconds are a happy countdown to offline fun, not an alarm
  // creeping up. A soft rising blip each second, a warm voice at ten to set up
  // the handover, then a gentle spoken three, two, one so the child lands the
  // finish themselves. Guarded so each second fires once.
  const spokeTenRef = useRef(false)
  const lastBlipRef = useRef(0)
  const countdownFx = useCallback((left: number) => {
    if (left > 10 || left < 1) return
    const ctx = audioRef.current
    if (ctx && lastBlipRef.current !== left) {
      lastBlipRef.current = left
      try {
        const t0 = ctx.currentTime
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        // Rising as it nears zero, so the pitch itself feels like a countdown.
        osc.type = 'sine'
        osc.frequency.setValueAtTime(560 + (10 - left) * 34, t0)
        gain.gain.setValueAtTime(0.0001, t0)
        gain.gain.exponentialRampToValueAtTime(0.12, t0 + 0.015)
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14)
        osc.connect(gain).connect(ctx.destination)
        osc.start(t0)
        osc.stop(t0 + 0.17)
      } catch { /* audio best effort */ }
    }
    if (left === 10 && !spokeTenRef.current) {
      spokeTenRef.current = true
      say('Ten more seconds, then it is time for some offline fun.')
    } else if (left === 3) {
      say('Three')
    } else if (left === 2) {
      say('Two')
    } else if (left === 1) {
      say('One')
    }
  }, [say])

  // Tick every second off the fixed end time. When it hits zero, sound the
  // alarm once and close the session on the server.
  //
  // The healthy amount is part of the same countdown: when this block is not a
  // treat and would run past the day's guide for their age, the countdown ends
  // at the crossing instead. The child sees one honest timer that lands on the
  // healthy amount, gets the same warm ten second send off, and the early stop
  // hands the unused minutes straight back to their star bank. A treat block
  // the grown up granted runs its full length untouched. Calibrated, never a
  // telling off.
  useEffect(() => {
    if (!session) return
    const plannedEnd = new Date(session.endsAt).getTime()
    const recToday = Math.max(0, Math.round(recommendedMinutes))
    // The moment this block crosses today's guide: what is left of the guide
    // when the block starts, run from the block's start. At least a minute, so
    // a block that somehow starts at the line still ends kindly, not instantly.
    const guideLeftMin = Math.max(1, recToday - usedBeforeRef.current)
    const crossAt = new Date(session.startedAt).getTime() + guideLeftMin * 60000
    const capsAtGuide = !session.treat && recToday > 0 && crossAt < plannedEnd
    const end = capsAtGuide ? crossAt : plannedEnd
    let fired = false
    // A fresh countdown for each session, so the ten second voice and blips fire
    // again next time, not only the first.
    spokeTenRef.current = false
    lastBlipRef.current = 0
    const tick = () => {
      const left = Math.round((end - Date.now()) / 1000)
      setRemaining(left)
      countdownFx(left)
      if (left <= 0 && !fired) {
        fired = true
        soundAlarm()
        say(capsAtGuide
          ? 'That is the healthy amount for today. Time for offline fun!'
          : 'Time for offline fun!')
        setEndedByGuide(capsAtGuide)
        setPhase('up')
        // Record the stop. A full block used all its minutes so nothing
        // refunds; a block ended at the guide trims back to the minutes
        // actually used, exactly like stopping early, so the rest of the
        // stars go safely back to the bank.
        fetch('/api/quests/time/stop', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, session_id: session.id }),
        }).catch(() => {})
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [session, token, recommendedMinutes, soundAlarm, countdownFx, say])

  async function start() {
    if (busy || minutes < STAR_MINUTES || minutes > maxMinutes) return
    setBusy(true)
    // Create the audio context on this tap (a user gesture) so the alarm is
    // allowed to sound later when the time is up.
    try {
      type WithWebkit = typeof window & { webkitAudioContext?: typeof AudioContext }
      const Ctx = window.AudioContext || (window as WithWebkit).webkitAudioContext
      if (Ctx && !audioRef.current) audioRef.current = new Ctx()
      await audioRef.current?.resume()
    } catch { /* audio optional */ }
    try {
      const res = await fetch('/api/quests/time/start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, device, minutes }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.pending) {
        // Ask first: the ask is away and the status banner at the top of the
        // child's screen carries the waiting story from here, so the card
        // folds back and there is never two places telling it.
        setNote(null)
        setPhase('idle')
        onAsked?.({ id: data.request?.id, device, minutes })
      } else if (res.ok && data.session) {
        setNote(null)
        setEndedByGuide(false)
        // This block is not on the server's today number yet, so what the page
        // loaded with is exactly the minutes used before it.
        usedBeforeRef.current = Math.max(0, Math.round(usedTodayMinutes))
        setSession({
          id: data.session.id, device: data.session.device, minutes: data.session.minutes,
          stars: data.session.stars, endsAt: data.session.ends_at, startedAt: data.session.started_at,
          // A child started block is never a treat: treats are only ever a
          // grown up knowingly granting time beyond the day's guide.
          treat: false,
        })
        setPhase('idle')
        router.refresh()
      } else if (data.error === 'chores first') {
        setNote(`Finish first: ${(data.blocking ?? []).join(', ')}. Then your time can start.`)
      } else if (data.error === 'not enough stars') {
        setNote('Not quite enough stars yet. Earn a few more first.')
      } else {
        setNote('That did not start. Try again in a moment.')
      }
    } catch { setNote('That did not start. Try again in a moment.') }
    setBusy(false)
  }

  async function stop() {
    if (!session || busy) return
    setBusy(true)
    try {
      await fetch('/api/quests/time/stop', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, session_id: session.id }),
      })
    } catch { /* best effort */ }
    setSession(null)
    setPhase('idle')
    setBusy(false)
    router.refresh()
  }

  // ── Running: the live countdown ──
  if (session && phase !== 'up') {
    // The bar runs against the same end the countdown does: the block's own
    // minutes, or the guide crossing when this block would run past today's
    // healthy amount and is not a treat.
    const recNow = Math.max(0, Math.round(recommendedMinutes))
    const guideLeftMin = Math.max(1, recNow - usedBeforeRef.current)
    const cappedMin = !session.treat && recNow > 0 ? Math.min(session.minutes, guideLeftMin) : session.minutes
    const total = cappedMin * 60
    const pct = Math.max(0, Math.min(100, (remaining / total) * 100))
    const low = remaining <= 60
    // The last ten seconds are the happy countdown to offline fun, so the number
    // gets a warm terracotta and a friendly line comes up, never a red warning.
    const countingDown = remaining <= 10 && remaining > 0
    return (
      <div style={{ background: '#fff', borderRadius: '20px', padding: '18px 20px', marginBottom: '16px', boxShadow: '0 5px 0 rgba(0,0,0,0.14)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '1.6rem', display: 'inline-block', animation: countingDown ? 'gcAlarmBounce 0.7s ease-in-out infinite' : 'none' }}>{countingDown ? '🎉' : deviceEmoji(session.device)}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              {deviceLabel(session.device)} time
            </div>
            <div
              key={countingDown ? remaining : 'run'}
              style={{
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: countingDown ? '3rem' : '2.4rem', lineHeight: 1,
                color: countingDown ? 'var(--terracotta-dark)' : low ? '#C0533E' : 'var(--ink)', fontVariantNumeric: 'tabular-nums',
                transformOrigin: 'left center', display: 'inline-block',
                animation: countingDown ? 'gcCountPop 0.5s ease-out' : 'none',
                transition: 'font-size 0.2s ease',
              }}
            >
              {countingDown ? remaining : fmt(remaining)}
            </div>
          </div>
        </div>
        <div style={{ height: '10px', borderRadius: '10px', background: 'var(--cream)', overflow: 'hidden', marginBottom: countingDown ? '10px' : '12px' }}>
          <div style={{ height: '100%', borderRadius: '10px', width: `${pct}%`, background: countingDown ? 'var(--terracotta)' : low ? '#C0533E' : 'var(--terracotta)', transition: 'width 1s linear' }} />
        </div>
        {countingDown && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--terracotta-lt)', borderRadius: '12px', padding: '9px 12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '1.1rem' }}>🌟</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.35 }}>
              Nearly there. Time to find some offline fun.
            </span>
          </div>
        )}
        <button
          onClick={stop}
          disabled={busy}
          style={{ width: '100%', padding: '13px', borderRadius: '14px', border: '1.5px solid var(--border)', background: 'var(--cream)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800, color: 'var(--ink)' }}
        >
          I&apos;m done, hand it back
        </button>
      </div>
    )
  }

  // ── Time's up ──
  if (phase === 'up') {
    return (
      <div style={{ position: 'relative', background: 'var(--terracotta)', borderRadius: '20px', padding: '20px', marginBottom: '16px', boxShadow: '0 5px 0 var(--terracotta-dark)', textAlign: 'center', overflow: 'hidden' }}>
        <Celebration fire />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '2.4rem', lineHeight: 1, marginBottom: '6px', display: 'inline-block', animation: 'gcAlarmBounce 0.7s ease-in-out 3' }}>{endedByGuide ? '🌱' : '🎉'}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.3rem', color: 'var(--ink)', marginBottom: '4px' }}>Time for offline fun!</div>
          <p style={{ fontSize: '14.5px', color: 'var(--ink)', opacity: 0.8, margin: '0 0 14px', lineHeight: 1.5 }}>
            {endedByGuide
              ? 'That is the healthy amount for today. Your stars are safe for tomorrow, and there is plenty of good stuff to do right now.'
              : `Great play! Your ${deviceLabel(session?.device ?? 'phone')} time is done for now. Go find something fun away from the screen, and earn more stars to unlock more.`}
          </p>
          {/* Not just "go away from the screen": here is what to do, one tap. */}
          <div style={{ background: 'rgba(255,255,255,0.45)', borderRadius: '14px', padding: '12px 13px', marginBottom: '14px' }}>
            <OfflineIdeas onPrintables={onPrintables} onGames={onGames} />
          </div>
          <button
            onClick={() => { setSession(null); setPhase('idle'); setEndedByGuide(false); router.refresh() }}
            style={{ padding: '11px 22px', borderRadius: '14px', border: 'none', background: 'var(--ink)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800 }}
          >
            OK
          </button>
        </div>
      </div>
    )
  }

  // ── Picking a device and minutes ──
  if (phase === 'picking') {
    const guideToday = Math.max(0, Math.round(recommendedMinutes))
    const exceedsGuide = guideToday > 0 && Math.round(usedTodayMinutes) + minutes > guideToday
    return (
      <div style={{ background: '#fff', borderRadius: '20px', padding: '18px 20px', marginBottom: '16px', boxShadow: '0 5px 0 rgba(0,0,0,0.14)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--ink)', marginBottom: asksFirst ? '4px' : '12px' }}>
          What will you use?
        </div>
        {/* The deal, said plainly before anything is picked: an ask is an
            ask, and the yes is what starts the timer. */}
        {asksFirst && (
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
            This asks your grown up. They get a ping, and when they say yes your timer starts.
          </p>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '9px', marginBottom: '16px' }}>
          {KID_DEVICES.map(d => {
            const on = device === d.key
            return (
              <button
                key={d.key}
                onClick={() => setDevice(d.key)}
                aria-pressed={on}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  minHeight: 86, padding: '12px 6px', borderRadius: '16px', cursor: 'pointer',
                  border: `2px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                  background: on ? 'var(--terracotta-lt)' : 'var(--cream)',
                  fontFamily: 'var(--font-display)', fontSize: '12.5px', fontWeight: 800, color: 'var(--ink)',
                  lineHeight: 1.2, textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '1.9rem', lineHeight: 1 }}>{d.emoji}</span>
                {d.label}
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)' }}>How long?</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ink-muted)' }}>{costStars} of your {balanceStars} stars</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button
            onClick={() => setMinutes(m => Math.max(STAR_MINUTES, m - STAR_MINUTES))}
            style={{ width: 44, height: 44, borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--cream)', cursor: 'pointer', fontSize: '20px', fontWeight: 800, color: 'var(--ink)', flexShrink: 0 }}
          >−</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.9rem', lineHeight: 1, color: 'var(--ink)' }}>{minutes}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>minutes</div>
          </div>
          <button
            onClick={() => setMinutes(m => Math.min(maxMinutes, m + STAR_MINUTES))}
            disabled={minutes + STAR_MINUTES > maxMinutes}
            style={{ width: 44, height: 44, borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--cream)', cursor: minutes + STAR_MINUTES > maxMinutes ? 'default' : 'pointer', fontSize: '20px', fontWeight: 800, color: 'var(--ink)', opacity: minutes + STAR_MINUTES > maxMinutes ? 0.4 : 1, flexShrink: 0 }}
          >+</button>
        </div>
        {/* An ask past today's healthy amount is allowed, just named: the
            grown up decides, and the good offline stuff sits right there. */}
        {asksFirst && exceedsGuide && (
          <div style={{ background: 'var(--terracotta-lt)', borderRadius: '12px', padding: '11px 13px', marginBottom: '12px' }}>
            <p style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.45, margin: '0 0 10px' }}>
              🌱 This goes past the healthy amount for today, your grown up decides.
            </p>
            <OfflineIdeas onPrintables={onPrintables} onGames={onGames} />
          </div>
        )}
        {note && (
          <div style={{ background: '#FDECEC', border: '1.5px solid #E5484D', borderRadius: '12px', padding: '10px 13px', marginBottom: '12px', fontSize: '13px', fontWeight: 700, color: '#B93B3F', lineHeight: 1.4 }}>
            {note}
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setPhase('idle')}
            style={{ padding: '13px 18px', borderRadius: '14px', border: '1.5px solid var(--border)', background: '#fff', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800, color: 'var(--ink-soft)' }}
          >Back</button>
          <button
            onClick={start}
            disabled={busy || minutes < STAR_MINUTES}
            style={{ flex: 1, padding: '13px', borderRadius: '14px', border: 'none', background: 'var(--terracotta)', color: 'var(--ink)', cursor: busy ? 'default' : 'pointer', fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800, boxShadow: '0 4px 0 var(--terracotta-dark)', opacity: busy ? 0.6 : 1 }}
          >
            {busy
              ? (asksFirst ? 'Asking...' : 'Starting...')
              : asksFirst ? `Ask for ${minutes} min 🙋` : `Start ${minutes} min ⏱️`}
          </button>
        </div>
      </div>
    )
  }

  // ── Idle: the invite to spend, with today's healthy amount in view ──
  const canSpend = balanceStars > 0
  const recToday = Math.max(0, Math.round(recommendedMinutes))
  const usedToday = Math.max(0, Math.round(usedTodayMinutes))
  const guidePct = recToday > 0 ? Math.min(100, Math.round((usedToday / recToday) * 100)) : 0
  const reachedGuide = recToday > 0 && usedToday >= recToday

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Today's healthy amount: a small, calm bar of how much screen time has
          been had today against the guide for this age. Never a lock, just a
          gentle heads up so a child can see their own balance. */}
      {recToday > 0 && (
        <div style={{
          background: reachedGuide ? 'var(--tint-sage)' : '#fff',
          borderRadius: '14px', padding: '11px 15px', marginBottom: '10px',
          boxShadow: '0 3px 0 rgba(0,0,0,0.10)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: '6px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)' }}>
              {reachedGuide ? 'You have had your screen time today 🌱' : "Today's screen time"}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)' }}>
              {usedToday}/{recToday} min
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 100, background: 'rgba(26,26,46,0.10)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${guidePct}%`, borderRadius: 100, background: reachedGuide ? 'var(--retro-green)' : 'var(--terracotta)', transition: 'width 0.5s ease' }} />
          </div>
          {reachedGuide && (
            <>
              <p style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '7px 0 0' }}>
                That is the healthy amount for your age. Want more? Ask your grown up for a treat.
              </p>
              <div style={{ marginTop: '10px' }}>
                <OfflineIdeas onPrintables={onPrintables} onGames={onGames} />
              </div>
            </>
          )}
        </div>
      )}

      {/* With stars in the bank, the invite to spend. With none, never a dead
          end: a warm doorway to earning, so the answer to no time is always do
          a job, never a minus number or a locked screen. */}
      <button
        onClick={() => {
          // Only open the picker when there is time left today inside the limit.
          // At the cap, point back to jobs so the next screen time is earned.
          if (canSpend && maxMinutes >= STAR_MINUTES) { setPhase('picking'); return }
          try { document.getElementById('my-todo')?.scrollIntoView({ behavior: 'smooth' }) } catch { /* no target */ }
        }}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
          background: '#fff', border: 'none',
          borderRadius: '18px', padding: '15px 18px', cursor: 'pointer',
          boxShadow: '0 5px 0 rgba(0,0,0,0.14)',
        }}
      >
        <span style={{ fontSize: '1.7rem', flexShrink: 0 }}>{canSpend ? '⏱️' : '⭐'}</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.2 }}>
            {canSpend
              ? (reachedGuide && !asksFirst ? 'That is your screen time for today 🌱' : 'Use device time now')
              : 'Earn your screen time'}
          </span>
          <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink-muted)', marginTop: '2px' }}>
            {canSpend
              ? (reachedGuide && !asksFirst
                ? 'Your stars are safe for tomorrow. Do a job to earn more'
                : asksFirst
                ? `Pick your screen and ask your grown up. You have ${maxMinutes} minutes of stars`
                : `You have ${maxMinutes} minutes to use now`)
              : 'Do a job to earn stars, then swap them for time. Tap to see your jobs'}
          </span>
        </span>
        <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{canSpend ? '▶' : '→'}</span>
      </button>

      {/* The device rule, said the same way here as everywhere else, so the
          timer card itself always carries what using any screen means. */}
      <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.03em', color: 'var(--ink-muted)', lineHeight: 1.6, margin: '10px 6px 0' }}>
        {TIMER_RULE}
      </p>
    </div>
  )
}
