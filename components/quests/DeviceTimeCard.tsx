'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { KID_DEVICES, TIMER_RULE, ACTIVITIES, asksActivity, deviceEmoji, deviceLabel, type ActiveSession, type ActivityKey, type TrustLevel } from '@/lib/quests/device-time'
import { deviceIcon, type FamilyDevice } from '@/lib/devices/family'
import { screenTipFor } from '@/lib/content/screen-tips'
import { speakEnglish, warmVoices } from '@/lib/voice/english-voice'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { planTieredSpend } from '@/lib/quests/time-tiers'
import { startErrorMessage, START_RETRY } from '@/lib/quests/start-errors'
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
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)',
    lineHeight: 1.2, whiteSpace: 'nowrap',
  }
  return (
    <div style={{ textAlign: 'left' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 8px' }}>
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
  token, balanceStars, holidayMinutes = 0, holidaySpendable = false,
  coreMinutesLeft = 0, protectedLine = null, starMinutes = STAR_MINUTES,
  usedWeekMinutes = -1,
  initialSession, usedTodayMinutes = 0, recommendedMinutes = 0,
  deviceTrust = 'ask', onAsked, onSessionChange, startPicking = false,
  onPrintables, onGames, ageBand = null, familyDevices = [],
  outstandingJobs = [], outstandingMinutes = 0,
}: {
  token: string
  balanceStars: number
  // The holiday bank: minutes earned in weeks that went past the cap, and
  // whether a school holiday is open so they can be spent. Outside one these
  // change nothing here, which is the whole point of a saving.
  holidayMinutes?: number
  holidaySpendable?: boolean
  // The three tiers (migration 223): today's unconditional free minutes still
  // unspent, and the resting line when this moment is inside a protected
  // window. Zero and null read exactly as the card did before the tiers.
  coreMinutesLeft?: number
  protectedLine?: string | null
  /** Minutes one star buys THIS child (migration 225). The deployment default
      unless the family changed it; every price and stepper here uses it so the
      card and the server always agree. */
  starMinutes?: number
  /** Minutes used since Monday, for the fade's weekly budget strip (stage 3
      and up). Negative means not provided, and the strip stays hidden. */
  usedWeekMinutes?: number
  initialSession: ActiveSession | null
  usedTodayMinutes?: number
  recommendedMinutes?: number
  // The child's age band, for the one small age matched tip that rides the
  // running countdown: good content worth choosing, the brain and sleep why,
  // and what to steer around. Null just hides the tip.
  ageBand?: string | null
  // How much this child does alone: ask (the default, the tap sends an ask
  // and the grown up's yes starts the deal), watch or trusted (the tap
  // starts the timer straight away).
  deviceTrust?: TrustLevel
  // The ask went off: the kid screen's status banner takes over the waiting
  // story, so this card can fold back to idle.
  onAsked?: (ask: { id?: string; device: string; minutes: number }) => void
  // A block started or ended in here. The screen around this card keeps its own
  // idea of whether a timer is running, and it used to find out only on the
  // next poll, so for up to twelve seconds after a child pressed stop the rest
  // of the app still believed the clock was going. This says so at once.
  onSessionChange?: (session: ActiveSession | null) => void
  // Fixture only: open on the picker so the ref page can screenshot it.
  startPicking?: boolean
  // Optional doorways for the offline ideas row: the kid screen passes these to
  // hop to its Printables tab and its Games sub tab. Left out, those buttons
  // simply do not show.
  onPrintables?: () => void
  onGames?: () => void
  // Jobs still to do, and what the lot is worth in minutes. Shown when the
  // timer runs out, never before it.
  //
  // The alternative was refusing screen time while anything is outstanding, and
  // that is the wrong tool. At four in the afternoon every daily job is
  // outstanding, bedtime ones included, so a blanket block would fire almost
  // always and the child would learn the deal is rigged. It also makes the app
  // the one saying no, which is the opposite of what this product is for. The
  // jobs a family genuinely wants gated already have their own switch, per job,
  // set by the parent.
  //
  // So this is the nudge instead, at the strongest moment there is: the fun has
  // just finished, they are being handed back to the room anyway, and the
  // minutes waiting to be earned are a number they can see.
  outstandingJobs?: string[]
  outstandingMinutes?: number
  // The screens this family owns, passed down from the server render since the
  // child app has a token rather than a session and cannot ask for them. With
  // a list the picker offers the actual iPad; without one it offers the four
  // kinds, exactly as it always did.
  familyDevices?: FamilyDevice[]
}) {
  const router = useRouter()
  const [session, setSession] = useState<ActiveSession | null>(initialSession)
  // Held in a ref for the countdown effect, whose dependency list must stay
  // stable: taking the callback directly would tear down and restart the one
  // second interval every time the screen around this card re rendered.
  const onSessionChangeRef = useRef(onSessionChange)
  useEffect(() => { onSessionChangeRef.current = onSessionChange }, [onSessionChange])
  // Chrome fills its voice list a moment after load. Warming it on mount means
  // the ten second line has a British voice ready rather than falling back to
  // the device default on a cold page.
  useEffect(() => { warmVoices() }, [])
  const [phase, setPhase] = useState<'idle' | 'picking' | 'up'>(startPicking && !initialSession ? 'picking' : 'idle')
  const [device, setDevice] = useState<string>('tv')
  // Only ever set for a device that asks. Cleared whenever the device
  // changes, so picking Computer then TV cannot leave a stale answer
  // attached to a device that never asked the question.
  const [activity, setActivity] = useState<ActivityKey | null>(null)
  // Asked, and not yet answered. Gates the start button below.
  const needsActivity = asksActivity(device) && activity === null
  // Which named screen, when there is a list. The kind still rides along,
  // because that is what the session and the ask are keyed on.
  const homeDevices = familyDevices.filter(d => !d.retiredAt)
  const [homeDeviceId, setHomeDeviceId] = useState<string | null>(null)
  const [minutes, setMinutes] = useState<number>(Math.min(30, balanceStars * starMinutes))
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
  // During a school holiday the banked minutes pay too, so they raise what can
  // be picked. Only the star ceiling moves: the day's healthy amount still caps
  // it, because the bank is about the week having had no room, not about a
  // single day having no limit.
  const holidayPot = holidaySpendable ? Math.max(0, Math.round(holidayMinutes)) : 0
  // Today's free baseline pays too (migration 223), ahead of stars, so it
  // raises what can be picked exactly like the holiday pot does.
  const corePot = Math.max(0, Math.round(coreMinutesLeft))
  const maxMinutes = Math.max(0, Math.min(corePot + balanceStars * starMinutes + holidayPot, remainingToday))
  // Keep the chosen minutes inside the cap, so the picker never shows more than
  // is allowed today.
  useEffect(() => { setMinutes(m => Math.min(m, maxMinutes)) }, [maxMinutes])
  const costStars = Math.ceil(minutes / starMinutes)
  // How the picked block would actually be paid for, by the same function the
  // start route uses. Sharing it is the point: the child is never shown a split
  // the server then works out differently.
  const { coreMinutes: coreCost, starCost, holidayMinutes: holidayCost } = planTieredSpend(minutes, corePot, balanceStars, holidayMinutes, holidaySpendable, starMinutes)

  // A browser only lets an AudioContext open on a user gesture, so the blips
  // and the finish jingle both need one before they can make a sound.
  const openAudio = useCallback(async () => {
    try {
      type WithWebkit = typeof window & { webkitAudioContext?: typeof AudioContext }
      const Ctx = window.AudioContext || (window as WithWebkit).webkitAudioContext
      if (Ctx && !audioRef.current) audioRef.current = new Ctx()
      await audioRef.current?.resume()
    } catch { /* audio optional */ }
  }, [])

  // Opening it only on the Start tap covered exactly one child: the one who
  // taps Start and then stays put. Every other way a block reaches this screen
  // arrived with no audio at all, so its countdown and its finish were silent.
  // A reload mid block, a child coming back to the tab, and any block a grown
  // up granted from their own phone all land here through initialSession, and
  // none of them ever ran start().
  //
  // So while a block is live, the first touch anywhere on the page opens the
  // audio instead. That is still a real gesture, which is all the autoplay
  // rules ask for, and a child watching their own timer has always already
  // made one. Once open it stays open, so this listens only until it is.
  useEffect(() => {
    if (!session || audioRef.current) return
    const open = () => { void openAudio() }
    window.addEventListener('pointerdown', open, { once: true, passive: true })
    window.addEventListener('keydown', open, { once: true, passive: true })
    return () => {
      window.removeEventListener('pointerdown', open)
      window.removeEventListener('keydown', open)
    }
  }, [session, openAudio])

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
    // Bright and warm, a shade slower than normal so it lands as a friendly
    // send off, never a bark. The voice itself is chosen by one rule shared
    // with every other spoken line (lib/voice/english-voice): British first,
    // warm British if the device has one. The old picker here named Samantha
    // ahead of everything else and set no language at all, so a child on a US
    // English device was counted down by an American.
    speakEnglish(text, { rate: 0.92, pitch: 1.18, volume: 0.9, warm: true })
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
  // THE TIMER DOES NOT PAUSE WHEN THE CHILD LEAVES THE APP, and it must not.
  //
  // Justin: "I've noticed when you go off the child's app the timer pauses.
  // That's a bug." He is right, and the reason it looked paused is worth
  // writing down, because the countdown was never actually wrong.
  //
  // Every tick reads the wall clock: left = end minus now. It has never
  // decremented a counter, so the number is correct the instant it is
  // recalculated. What stops is the RECALCULATION. Browsers throttle a one
  // second interval in a hidden tab down to about once a minute, and phones
  // suspend it outright when the app goes to the background, so the digits on
  // screen freeze at whatever they last said.
  //
  // That mattered far more than a frozen display. Switching to YouTube is
  // exactly when the minutes are being spent, and if the block ran out while
  // the app was in the background, the branch below never ran: no alarm, no
  // hand it back, no stop recorded. A timer whose entire job is to END was
  // relying on the child watching it in order to finish.
  //
  // So the tick is also fired the moment the app comes back, on both the
  // signals that carry that: visibilitychange for a tab or app switch, and
  // pageshow for a phone restoring the page from its back forward cache, which
  // does not always raise the first. The child returns to the true number, and
  // to the finish if it already happened while they were away.
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
        onSessionChangeRef.current?.(null)
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

    // Catch up the moment the app is looked at again. Guarded on visible so a
    // child leaving does not spend their last seconds of attention on a jump.
    const catchUp = () => { if (document.visibilityState === 'visible') tick() }
    document.addEventListener('visibilitychange', catchUp)
    window.addEventListener('pageshow', catchUp)
    window.addEventListener('focus', catchUp)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', catchUp)
      window.removeEventListener('pageshow', catchUp)
      window.removeEventListener('focus', catchUp)
    }
  }, [session, token, recommendedMinutes, soundAlarm, countdownFx, say])

  async function start() {
    if (busy || minutes < starMinutes || minutes > maxMinutes) return
    setBusy(true)
    // Open the audio on this tap (a user gesture) so the alarm is allowed to
    // sound later when the time is up.
    await openAudio()
    try {
      const res = await fetch('/api/quests/time/start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, device, familyDeviceId: homeDeviceId, minutes, activity }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.pending) {
        // Ask first: the ask is away and the status banner at the top of the
        // child's screen carries the waiting story from here, so the card
        // folds back and there is never two places telling it. Inside a
        // protected window the route sends the resting line, said in the
        // sturdy leadership shape, and that one is worth showing right here:
        // the boundary holds AND the feeling is real, never a silent no.
        setNote(typeof data.protectedLine === 'string' ? data.protectedLine : null)
        setPhase('idle')
        onAsked?.({ id: data.request?.id, device, minutes })
      } else if (res.ok && data.session) {
        setNote(null)
        setEndedByGuide(false)
        // This block is not on the server's today number yet, so what the page
        // loaded with is exactly the minutes used before it.
        usedBeforeRef.current = Math.max(0, Math.round(usedTodayMinutes))
        const started: ActiveSession = {
          id: data.session.id, device: data.session.device, minutes: data.session.minutes,
          stars: data.session.stars, endsAt: data.session.ends_at, startedAt: data.session.started_at,
          // A child started block is never a treat: treats are only ever a
          // grown up knowingly granting time beyond the day's guide.
          treat: false,
        }
        setSession(started)
        onSessionChange?.(started)
        setPhase('idle')
        router.refresh()
      } else if (data.error === 'chores first' && (data.blocking ?? []).length > 0) {
        // The route names the actual jobs, so this stays: it is more use than
        // the shared line precisely because it can list them.
        setNote(`Finish first: ${(data.blocking ?? []).join(', ')}. Then your time can start.`)
      } else {
        // Everything else now says which refusal it was rather than shrugging.
        setNote(startErrorMessage(data.error))
      }
    } catch { setNote(START_RETRY) }
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
    onSessionChange?.(null)
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
          <span style={{ fontSize: 'var(--text-2xl)', display: 'inline-block', animation: countingDown ? 'gcAlarmBounce 0.7s ease-in-out infinite' : 'none' }}>{countingDown ? '🎉' : deviceEmoji(session.device)}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
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
        {/* One age matched tip riding the countdown: good content, the brain
            and sleep why, or what to steer around. Rotates daily, never a
            lecture, and steps aside for the happy final countdown. */}
        {ageBand && !countingDown && (() => {
          const tip = screenTipFor(ageBand, new Date().getDate())
          return (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'var(--cream)', borderRadius: '12px', padding: '9px 12px', marginBottom: '12px' }}>
              <span aria-hidden style={{ fontSize: 'var(--text-md)', flexShrink: 0 }}>{tip.emoji}</span>
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                {tip.text}
              </span>
            </div>
          )
        })()}
        {countingDown && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--terracotta-lt)', borderRadius: '12px', padding: '9px 12px', marginBottom: '12px' }}>
            <span style={{ fontSize: 'var(--text-lg)' }}>🌟</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.35 }}>
              Nearly there. Time to find some offline fun.
            </span>
          </div>
        )}
        <button
          onClick={stop}
          disabled={busy}
          style={{ width: '100%', padding: '13px', borderRadius: '14px', border: '1.5px solid var(--border)', background: 'var(--cream)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--ink)' }}
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
          <div style={{ fontSize: 'var(--text-3xl)', lineHeight: 1, marginBottom: '6px', display: 'inline-block', animation: 'gcAlarmBounce 0.7s ease-in-out 3' }}>{endedByGuide ? '🌱' : '🎉'}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', marginBottom: '4px' }}>Time for offline fun!</div>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink)', opacity: 0.8, margin: '0 0 14px', lineHeight: 1.5 }}>
            {endedByGuide
              ? 'That is the healthy amount for today. Your stars are safe for tomorrow, and there is plenty of good stuff to do right now.'
              : `Great play! Your ${deviceLabel(session?.device ?? 'phone')} time is done for now. Go find something fun away from the screen, and earn more stars to unlock more.`}
          </p>
          {/* The jobs still waiting, named, with what they are worth. Not a
              telling off: the next block of time is sitting right there in
              them, which is a far better reason to go and do one. */}
          {outstandingJobs.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.72)', borderRadius: '14px', padding: '13px 14px', marginBottom: '12px', textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: '7px' }}>
                {outstandingMinutes > 0
                  ? `${outstandingMinutes} more minutes are waiting in your jobs`
                  : 'Still to do today'}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {outstandingJobs.slice(0, 4).map(j => (
                  <li key={j} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
                    <span aria-hidden style={{ flexShrink: 0 }}>⭐</span>{j}
                  </li>
                ))}
                {outstandingJobs.length > 4 && (
                  <li style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)', opacity: 0.7 }}>
                    and {outstandingJobs.length - 4} more
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Not just "go away from the screen": here is what to do, one tap. */}
          <div style={{ background: 'rgba(255,255,255,0.45)', borderRadius: '14px', padding: '12px 13px', marginBottom: '14px' }}>
            <OfflineIdeas onPrintables={onPrintables} onGames={onGames} />
          </div>
          <button
            onClick={() => { setSession(null); setPhase('idle'); setEndedByGuide(false); router.refresh() }}
            style={{ padding: '11px 22px', borderRadius: '14px', border: 'none', background: 'var(--ink)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 800 }}
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
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: asksFirst ? '4px' : '12px' }}>
          What will you use?
        </div>
        {/* The deal, said plainly before anything is picked: an ask is an
            ask, and the yes is what starts the timer. */}
        {asksFirst && (
          <p style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
            This asks your grown up. They get a ping, and when they say yes your timer starts.
          </p>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '9px', marginBottom: '16px' }}>
          {(homeDevices.length > 0
            ? homeDevices.map(d => ({ key: d.id, label: d.label, emoji: deviceIcon(d), kind: d.kind, homeId: d.id }))
            : KID_DEVICES.map(d => ({ key: d.key, label: d.label, emoji: d.emoji, kind: d.key, homeId: null }))
          ).map(d => {
            const on = d.homeId ? homeDeviceId === d.homeId : device === d.key
            return (
              <button
                key={d.key}
                onClick={() => { setDevice(d.kind); setHomeDeviceId(d.homeId); setActivity(null) }}
                aria-pressed={on}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  minHeight: 86, padding: '12px 6px', borderRadius: '16px', cursor: 'pointer',
                  border: `2px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                  background: on ? 'var(--terracotta-lt)' : 'var(--cream)',
                  fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--ink)',
                  lineHeight: 1.2, textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 'var(--text-3xl)', lineHeight: 1 }}>{d.emoji}</span>
                {d.label}
              </button>
            )
          })}
        </div>
        {/* What are you doing on it.
            Only for the computer, because it is the only device that cannot
            answer for itself. A console is gaming and a TV is watching, and
            asking a child to confirm the obvious four times a day is how a
            question stops being read.

            It matters because the four buckets are treated differently:
            homework counts into learning, the one bucket we want to grow, while
            the other three are kept in check. Before this, a computer fell
            through to watching, so homework was charged to the watching guide
            and the learning bucket stayed empty and kept asking for more.

            No default and no preselection. A guess here is exactly the thing
            that was wrong, and a child who has to tap once is a child telling us
            something true. The timer will not start until they do. */}
        {asksActivity(device) && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: '4px' }}>
              What are you doing on it?
            </div>
            <p style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 10px' }}>
              Homework counts differently to watching, so this is worth a tap.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '9px' }}>
              {ACTIVITIES.map(a => {
                const on = activity === a.key
                return (
                  <button
                    key={a.key}
                    onClick={() => setActivity(a.key)}
                    aria-pressed={on}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      minHeight: 56, padding: '10px 12px', borderRadius: '14px', cursor: 'pointer',
                      border: `2px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                      background: on ? 'var(--terracotta-lt)' : 'var(--cream)',
                      fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--ink)',
                      lineHeight: 1.2, textAlign: 'left',
                    }}
                  >
                    <span aria-hidden style={{ fontSize: 'var(--text-xl)', lineHeight: 1, flexShrink: 0 }}>{a.emoji}</span>
                    {a.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>How long?</span>
          {/* Once a pick goes past this week's stars, saying "14 of your 6
              stars" is nonsense. Naming the holiday minutes instead is also the
              only place a child is told, at the moment of spending, that the
              extra jobs they did weeks ago are what is paying. */}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: holidayCost > 0 || coreCost > 0 ? 'var(--gold-dark)' : 'var(--ink-muted)' }}>
            {coreCost > 0 && starCost === 0 && holidayCost === 0
              ? `${coreCost} free min, no stars`
              : coreCost > 0
              ? `${coreCost} free min + ${starCost} star${starCost === 1 ? '' : 's'}${holidayCost > 0 ? ` + ${holidayCost} holiday min` : ''}`
              : holidayCost > 0
              ? `${starCost} star${starCost === 1 ? '' : 's'} + ${holidayCost} holiday min`
              : `${costStars} of your ${balanceStars} stars`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button
            onClick={() => setMinutes(m => Math.max(starMinutes, m - starMinutes))}
            style={{ width: 44, height: 44, borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--cream)', cursor: 'pointer', fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--ink)', flexShrink: 0 }}
          >−</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-3xl)', lineHeight: 1, color: 'var(--ink)' }}>{minutes}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>minutes</div>
          </div>
          <button
            onClick={() => setMinutes(m => Math.min(maxMinutes, m + starMinutes))}
            disabled={minutes + starMinutes > maxMinutes}
            style={{ width: 44, height: 44, borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--cream)', cursor: minutes + starMinutes > maxMinutes ? 'default' : 'pointer', fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--ink)', opacity: minutes + starMinutes > maxMinutes ? 0.4 : 1, flexShrink: 0 }}
          >+</button>
        </div>
        {/* An ask past today's healthy amount is allowed, just named: the
            grown up decides, and the good offline stuff sits right there. */}
        {asksFirst && exceedsGuide && (
          <div style={{ background: 'var(--terracotta-lt)', borderRadius: '12px', padding: '11px 13px', marginBottom: '12px' }}>
            <p style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.45, margin: '0 0 10px' }}>
              🌱 This goes past the healthy amount for today, your grown up decides.
            </p>
            <OfflineIdeas onPrintables={onPrintables} onGames={onGames} />
          </div>
        )}
        {note && (
          <div style={{ background: '#FDECEC', border: '1.5px solid #E5484D', borderRadius: '12px', padding: '10px 13px', marginBottom: '12px', fontSize: 'var(--text-md)', fontWeight: 700, color: '#B93B3F', lineHeight: 1.4 }}>
            {note}
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setPhase('idle')}
            style={{ padding: '13px 18px', borderRadius: '14px', border: '1.5px solid var(--border)', background: '#fff', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--ink-soft)' }}
          >Back</button>
          {/* Blocked until the question is answered, for the one device that
              asks it. Starting anyway would write a session we then have to
              guess the bucket for, which is the bug this whole change exists to
              remove. The button says what it wants rather than sitting greyed
              out with no reason, because a dead button with no explanation is
              the most frustrating thing a child can meet here. */}
          <button
            onClick={start}
            disabled={busy || minutes < starMinutes || needsActivity}
            style={{ flex: 1, padding: '13px', borderRadius: '14px', border: 'none', background: 'var(--terracotta)', color: 'var(--ink)', cursor: busy || needsActivity ? 'default' : 'pointer', fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 800, boxShadow: '0 4px 0 var(--terracotta-dark)', opacity: busy || needsActivity ? 0.6 : 1 }}
          >
            {busy
              ? (asksFirst ? 'Asking...' : 'Starting...')
              : needsActivity ? 'Pick what you are doing'
              : asksFirst ? `Ask for ${minutes} min 🙋` : `Start ${minutes} min ⏱️`}
          </button>
        </div>
      </div>
    )
  }

  // ── Idle: the invite to spend, with today's healthy amount in view ──
  // Holiday minutes count as something to spend, otherwise a child in August
  // with a full bank and an empty week is shown the "do a job first" door while
  // the card above it says their minutes are ready now.
  const canSpend = balanceStars > 0 || holidayPot > 0 || corePot > 0
  const recToday = Math.max(0, Math.round(recommendedMinutes))
  const usedToday = Math.max(0, Math.round(usedTodayMinutes))
  const guidePct = recToday > 0 ? Math.min(100, Math.round((usedToday / recToday) * 100)) : 0
  const reachedGuide = recToday > 0 && usedToday >= recToday

  // The fade's weekly budget (stage 3 and up): from 11 the child starts
  // managing a week, not obeying a day, so their card shows the week as a
  // budget that is theirs to spread. Younger children keep the daily view
  // alone, because a week is not yet a shape they plan in.
  const showWeekBudget = usedWeekMinutes >= 0 && recToday > 0
    && ['11-13', '13-15', '16+'].includes(ageBand ?? '')
  const weekGuide = recToday * 7
  const usedWeek = Math.max(0, Math.round(usedWeekMinutes))
  const weekPct = weekGuide > 0 ? Math.min(100, Math.round((usedWeek / weekGuide) * 100)) : 0

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Inside a protected window the screen is resting. Said in the sturdy
          leadership shape, the boundary holds AND the feeling is real, and the
          start below still works, it just goes to the grown up as an ask,
          because the pathway is ask, never a flat no. */}
      {protectedLine && (
        <div style={{ background: 'var(--tint-sage)', borderRadius: '14px', padding: '12px 15px', marginBottom: '10px', boxShadow: '0 3px 0 rgba(0,0,0,0.10)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.45, margin: 0 }}>
            🌙 {protectedLine}
          </p>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.4, margin: '5px 0 0' }}>
            If it is important, you can still ask your grown up.
          </p>
        </div>
      )}
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
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
              {reachedGuide ? 'You have had your screen time today 🌱' : "Today's screen time"}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-soft)' }}>
              {usedToday}/{recToday} min
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 100, background: 'rgba(26,26,46,0.10)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${guidePct}%`, borderRadius: 100, background: reachedGuide ? 'var(--retro-green)' : 'var(--terracotta)', transition: 'width 0.5s ease' }} />
          </div>
          {reachedGuide && (
            <>
              <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '7px 0 0' }}>
                That is the healthy amount for your age. Want more? Ask your grown up for a treat.
              </p>
              <div style={{ marginTop: '10px' }}>
                <OfflineIdeas onPrintables={onPrintables} onGames={onGames} />
              </div>
            </>
          )}
          {/* The rule that keeps the deal fair and friendly: checking jobs and
              doing lessons in here is always free, the timer is for the fun
              screens. Said out loud so nobody ever hoards or fears the app. */}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '8px 0 0' }}>
            This app never uses your minutes. Fun screens do.
          </p>

          {/* The fade's weekly budget, stage 3 and up: the week as a number
              that is theirs to spread, practice for managing it themselves.
              A quiet second line under the daily bar, never a second lock. */}
          {showWeekBudget && (
            <div style={{ marginTop: '9px', paddingTop: '9px', borderTop: '1px solid rgba(26,26,46,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: '5px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                  Your week
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-soft)' }}>
                  {usedWeek}/{weekGuide} min
                </span>
              </div>
              <div style={{ height: 5, borderRadius: 100, background: 'rgba(26,26,46,0.08)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${weekPct}%`, borderRadius: 100, background: weekPct >= 100 ? 'var(--retro-green)' : 'var(--gold, #EDC35F)', transition: 'width 0.5s ease' }} />
              </div>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-muted)', lineHeight: 1.4, margin: '5px 0 0' }}>
                Yours to spread across the week. A big Saturday means a lighter Tuesday.
              </p>
            </div>
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
          if (canSpend && maxMinutes >= starMinutes) { setPhase('picking'); return }
          try { document.getElementById('my-todo')?.scrollIntoView({ behavior: 'smooth' }) } catch { /* no target */ }
        }}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
          background: '#fff', border: 'none',
          borderRadius: '18px', padding: '15px 18px', cursor: 'pointer',
          boxShadow: '0 5px 0 rgba(0,0,0,0.14)',
        }}
      >
        <span style={{ fontSize: 'var(--text-2xl)', flexShrink: 0 }}>{canSpend ? '⏱️' : '⭐'}</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.2 }}>
            {canSpend
              ? (reachedGuide && !asksFirst ? 'That is your screen time for today 🌱' : 'Use device time now')
              : 'Earn your screen time'}
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink-muted)', marginTop: '2px' }}>
            {canSpend
              ? (reachedGuide && !asksFirst
                ? 'Your stars are safe for tomorrow. Do a job to earn more'
                : asksFirst
                // "minutes of stars" stops being true the moment the holiday
                // bank is part of the number, so it says where it came from.
                ? `Pick your screen and ask your grown up. You have ${maxMinutes} minutes ${corePot > 0 ? 'ready, your free time included' : holidayPot > 0 ? 'ready, holiday savings included' : 'of stars'}`
                : corePot > 0
                ? `You have ${maxMinutes} minutes to use now, ${corePot} of them free time`
                : `You have ${maxMinutes} minutes to use now`)
              : 'Do a job to earn stars, then swap them for time. Tap to see your jobs'}
          </span>
        </span>
        <span style={{ fontSize: 'var(--text-xl)', flexShrink: 0 }}>{canSpend ? '▶' : '→'}</span>
      </button>

      {/* The device rule, said the same way here as everywhere else, so the
          timer card itself always carries what using any screen means. */}
      <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.03em', color: 'var(--ink-muted)', lineHeight: 1.6, margin: '10px 6px 0' }}>
        {TIMER_RULE}
      </p>
    </div>
  )
}
