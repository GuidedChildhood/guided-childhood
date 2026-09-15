'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { HAPPY, Plate, Ribbon, StarShape } from '@/components/kid/HappyNewsBits'
import HappyIcon from '@/components/kid/HappyIcon'
import { playKidSound } from '@/lib/sound/kidSounds'
import { ACTIVITIES, asksActivity, deviceLabel, type ActivityKey } from '@/lib/quests/device-time'
// Type only, so it is erased and never crosses the client boundary.
import type { AskDevice } from '@/lib/devices/ask-devices'
export type { AskDevice }

// Ask for screen time, on one clear page.
//
// Justin, 14 September 2026, with the balance card open on Jonny's phone:
// "when we ask for screen time on the child's app it needs to be a much
// clearer, simpler designed page: very simple to select device and time, then
// make sure it pops up and pushes on the parent's app, then come back and you
// can start on the child's app, doing checks on outstanding etc. This device
// time must be super fun, a mix between Kenji and Happy News styling, all
// wired in to record work, make sure it has the right amount, and the earn
// part: to earn more time do jobs, outside, etc."
//
// The flow was already wired (the ask route pushes the grown up, the yes box
// pops on their Home, the approved ask starts from the child's banner, every
// block is recorded and the guide caps it). What it lacked was a page: it
// lived as a dense card folded inside the balance panel, under a bar chart
// and three paragraphs. This is three taps on the dotted sky: what screen,
// how long, ask. Then the wait is not dead: the Friend says it has gone, the
// page polls for the yes and turns into the Start button, and while they wait
// the jobs still to do and time outside are right there to earn more.
//
// Everything that decides is still on the server: cost, the healthy amount,
// protected windows, the jobs gate. This page only asks.



export type AskSeed = {
  token: string
  childName: string
  friend: { name: string; img: string }
  devices: AskDevice[]
  /** Stars in the bank and what one buys, so the page can say what is ready. */
  balanceStars: number
  starMinutes: number
  coreMinutesLeft: number
  holidayMinutes: number
  /** The healthy amount for today and what has been used of it. */
  recommendedMinutes: number
  usedTodayMinutes: number
  /** Ask first (the grown up decides) or trusted to start. */
  asksFirst: boolean
  /** Jobs still to do today, by name and minutes they would earn. */
  jobsLeft: { title: string; emoji: string | null; minutes: number }[]
  /** Before screens jobs still to do: named, never a wall. */
  blockingJobs: string[]
  /** Today's five a day, what is left of it: outside counts. */
  fiveLeft: string[]
  dealLines: string[]
  /** A live ask, if the child left mid wait and came back. */
  initialAsk: { id: string; device: string; minutes: number; status: string } | null
}

type Step = 'device' | 'minutes' | 'sent'

const PRESETS = [15, 30, 45, 60]

export default function KidAskScreenTime(seed: AskSeed) {
  const {
    token, childName, friend, devices, balanceStars, starMinutes, coreMinutesLeft, holidayMinutes,
    recommendedMinutes, usedTodayMinutes, asksFirst, jobsLeft, blockingJobs, fiveLeft, dealLines, initialAsk,
  } = seed
  const [step, setStep] = useState<Step>(initialAsk && initialAsk.status !== 'declined' ? 'sent' : 'device')
  const [device, setDevice] = useState<AskDevice | null>(null)
  const [activity, setActivity] = useState<ActivityKey | null>(null)
  const [minutes, setMinutes] = useState<number>(30)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [ask, setAsk] = useState(initialAsk)
  const [started, setStarted] = useState(false)
  const pollRef = useRef<number | null>(null)

  const readyMinutes = balanceStars * starMinutes + coreMinutesLeft + holidayMinutes
  const guideLeft = Math.max(0, Math.round(recommendedMinutes) - Math.round(usedTodayMinutes))
  const costStars = Math.max(0, Math.ceil(Math.max(0, minutes - coreMinutesLeft - holidayMinutes) / starMinutes))
  const short = costStars > balanceStars
  const pastGuide = recommendedMinutes > 0 && minutes > guideLeft
  const earnMinutes = jobsLeft.reduce((n, j) => n + j.minutes, 0)
  const needsActivity = !!device && asksActivity(device.kind) && !activity

  // The wait is watched. While the ask is pending the page asks the status
  // route every eight seconds, and the moment the grown up says yes the
  // page turns into the Start button, so nobody has to know to go home.
  useEffect(() => {
    if (step !== 'sent' || !ask || ask.status !== 'pending') return
    const check = async () => {
      try {
        const r = await fetch(`/api/quests/time/status?token=${encodeURIComponent(token)}`, { cache: 'no-store' })
        const d = r.ok ? await r.json() : null
        if (d?.ask && d.ask.id === ask.id && d.ask.status !== ask.status) {
          setAsk(d.ask)
          if (d.ask.status === 'approved') { try { playKidSound('star') } catch { /* sound off */ } }
        }
        if (d && !d.ask && d.session) setStarted(true)
      } catch { /* try again next tick */ }
    }
    check()
    pollRef.current = window.setInterval(check, 8000)
    return () => { if (pollRef.current) window.clearInterval(pollRef.current) }
  }, [step, ask, token])

  const send = useCallback(async () => {
    if (!device || busy || needsActivity) return
    setBusy(true)
    setNote(null)
    try {
      const res = await fetch('/api/quests/time/start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, device: device.kind, familyDeviceId: device.id, minutes, activity }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.pending) {
        try { playKidSound('tap') } catch { /* sound off */ }
        setAsk({ id: data.request?.id ?? '', device: device.kind, minutes, status: 'pending' })
        setNote(typeof data.protectedLine === 'string' ? data.protectedLine : null)
        setStep('sent')
      } else if (res.ok && data.session) {
        try { playKidSound('done') } catch { /* sound off */ }
        setStarted(true)
        setStep('sent')
        window.location.assign(`/k/${token}#my-timer`)
      } else {
        setNote(typeof data.error === 'string' ? data.error : 'That did not send. Have another go in a moment.')
      }
    } catch {
      setNote('That did not send. Have another go in a moment.')
    }
    setBusy(false)
  }, [device, busy, needsActivity, token, minutes, activity])

  const startApproved = useCallback(async () => {
    if (!ask || busy) return
    setBusy(true)
    try {
      const res = await fetch('/api/quests/time/start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, requestId: ask.id }),
      })
      const d = await res.json().catch(() => ({}))
      if (res.ok && d.session) {
        try { playKidSound('done') } catch { /* sound off */ }
        setStarted(true)
        window.location.assign(`/k/${token}#my-timer`)
      } else {
        setNote(typeof d.error === 'string' ? d.error : 'That did not start. Have another go in a moment.')
      }
    } catch { setNote('That did not start. Have another go in a moment.') }
    setBusy(false)
  }, [ask, busy, token])

  const ground: React.CSSProperties = {
    minHeight: '100dvh', fontFamily: 'var(--font-body)',
    background: HAPPY.cream,
    padding: 'calc(18px + env(safe-area-inset-top)) 16px calc(96px + env(safe-area-inset-bottom, 0px))',
  }
  const card: React.CSSProperties = {
    background: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 'var(--radius-card)', boxShadow: `0 5px 0 ${HAPPY.ink}`,
    padding: '16px 16px 18px',
  }
  const bigBtn = (on = true): React.CSSProperties => ({
    width: '100%', padding: '16px 20px', borderRadius: 'var(--radius-btn)', border: `2px solid ${HAPPY.ink}`,
    background: on ? HAPPY.butter : '#fff', color: HAPPY.ink, cursor: on ? 'pointer' : 'default',
    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', boxShadow: `0 5px 0 ${HAPPY.ink}`,
    opacity: on ? 1 : 0.55,
  })
  const pill: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800,
    color: HAPPY.ink, textDecoration: 'none', background: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 'var(--radius-pill)',
    padding: '7px 14px 7px 10px', boxShadow: `0 3px 0 ${HAPPY.ink}`, cursor: 'pointer',
  }

  const stepNo = step === 'device' ? 1 : step === 'minutes' ? 2 : 3

  return (
    <div data-ask-page data-step={step} style={ground}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
          {step === 'device' || step === 'sent' ? (
            <a href={`/k/${token}`} style={pill}>‹ Back</a>
          ) : (
            <button type="button" onClick={() => setStep('device')} style={pill}>‹ Back</button>
          )}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            Step {stepNo} of 3
          </span>
        </div>

        {/* THE HEAD: the ribbon and the Friend, and one line that says what is
            ready. Never a chart. */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
          <div style={{ minWidth: 0 }}>
            <Ribbon>{step === 'sent' ? (ask?.status === 'approved' || started ? 'They said yes!' : 'Sent!') : 'Screen time'}</Ribbon>
            <p data-ready-line style={{ margin: '10px 0 0', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: HAPPY.ink, lineHeight: 1.3 }}>
              {readyMinutes > 0
                ? `You have ${readyMinutes} minutes ready${coreMinutesLeft > 0 ? `, ${coreMinutesLeft} of them free` : ''}.`
                : 'No minutes ready yet. You can still ask, your grown up decides.'}
            </p>
            {recommendedMinutes > 0 && (
              <p data-guide style={{ margin: '4px 0 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)' }}>
                {guideLeft > 0 ? `${guideLeft} min of today's healthy amount left` : 'Today\'s healthy amount is used up'}
              </p>
            )}
          </div>
          <Plate size={76} tint={HAPPY.butterLt}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={friend.img} alt={friend.name} width={60} height={60} style={{ width: 60, height: 60, objectFit: 'contain', display: 'block' }} />
          </Plate>
        </div>

        {/* Before screens jobs: said once at the top, never a wall. The ask
            still sends; the grown up sees the same line. */}
        {blockingJobs.length > 0 && step !== 'sent' && (
          <div data-blocking style={{ ...card, background: HAPPY.butterLt, padding: '12px 14px', marginBottom: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
            <HappyIcon name="sprout" size={30} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: HAPPY.ink, lineHeight: 1.3 }}>
              {blockingJobs[0]}{blockingJobs.length > 1 ? ` and ${blockingJobs.length - 1} more` : ''} first. Then screens.
            </span>
          </div>
        )}

        {/* STEP 1: what screen. Big tiles, one tap moves on. */}
        {step === 'device' && (
          <div style={card}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em', margin: '0 0 12px', color: HAPPY.ink }}>What screen?</h1>
            <div data-devices style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {devices.map(d => (
                <button
                  key={d.id ?? d.kind}
                  type="button"
                  onClick={() => { setDevice(d); setActivity(null); try { playKidSound('tap') } catch { /* sound off */ } setStep('minutes') }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                    minHeight: 112, padding: '14px 8px', borderRadius: 16, cursor: 'pointer',
                    border: `2px solid ${HAPPY.ink}`, background: '#fff', boxShadow: `0 4px 0 ${HAPPY.ink}`,
                    fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 900, color: HAPPY.ink, lineHeight: 1.2, textAlign: 'center',
                  }}
                >
                  <span style={{ width: 54, height: 54, borderRadius: '50%', background: HAPPY.butterLt, border: `2px solid ${HAPPY.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, lineHeight: 1 }} aria-hidden>{d.emoji}</span>
                  {d.label}
                </button>
              ))}
            </div>
            {dealLines.length > 0 && (
              <p data-deal style={{ margin: '14px 0 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', lineHeight: 1.5 }}>
                🤝 Our deal: {dealLines.join(' · ')}
              </p>
            )}
          </div>
        )}

        {/* STEP 2: how long. Four chips, the cost said plainly, one button. */}
        {step === 'minutes' && device && (
          <div style={card}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em', margin: '0 0 4px', color: HAPPY.ink }}>How long on the {device.label}?</h1>
            {asksActivity(device.kind) && (
              <div style={{ margin: '10px 0 4px' }}>
                <p style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: HAPPY.ink }}>What are you doing on it?</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {ACTIVITIES.map(a => (
                    <button key={a.key} type="button" onClick={() => setActivity(a.key)} aria-pressed={activity === a.key} style={{
                      display: 'flex', alignItems: 'center', gap: 8, minHeight: 50, padding: '8px 10px', borderRadius: 12, cursor: 'pointer',
                      border: `2px solid ${HAPPY.ink}`, background: activity === a.key ? HAPPY.butter : '#fff', boxShadow: activity === a.key ? `0 3px 0 ${HAPPY.ink}` : 'none',
                      fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 800, color: HAPPY.ink, textAlign: 'left', lineHeight: 1.2,
                    }}>
                      <span aria-hidden>{a.emoji}</span>{a.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div data-minutes style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, margin: '12px 0 12px' }}>
              {PRESETS.map(p => {
                const on = minutes === p
                return (
                  <button key={p} type="button" onClick={() => { setMinutes(p); try { playKidSound('tap') } catch { /* sound off */ } }} aria-pressed={on} style={{
                    padding: '14px 2px', borderRadius: 14, cursor: 'pointer',
                    border: `2px solid ${HAPPY.ink}`, background: on ? HAPPY.butter : '#fff', color: HAPPY.ink,
                    boxShadow: on ? `0 4px 0 ${HAPPY.ink}` : 'none', transform: on ? 'none' : 'translateY(2px)',
                    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', lineHeight: 1, transition: 'transform 0.12s',
                  }}>
                    {p}<span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', marginTop: 4, color: 'var(--ink-muted)' }}>MIN</span>
                  </button>
                )
              })}
            </div>
            <p data-cost style={{ margin: '0 0 12px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: short ? '#B93B3F' : HAPPY.ink, lineHeight: 1.35 }}>
              {short
                ? `That is ${costStars} stars and you have ${balanceStars}. You can still ask, your grown up decides.`
                : costStars === 0
                  ? 'That is free time, no stars needed.'
                  : `That is ${costStars} star${costStars === 1 ? '' : 's'} of your ${balanceStars}.`}
              {pastGuide && ' It goes past today\'s healthy amount, so it is your grown up\'s call.'}
            </p>
            {note && <p style={{ margin: '0 0 12px', fontSize: 'var(--text-base)', fontWeight: 700, color: '#B93B3F' }}>{note}</p>}
            <button type="button" onClick={send} disabled={busy || needsActivity} style={bigBtn(!busy && !needsActivity)}>
              {busy ? 'Sending' : needsActivity ? 'Pick what you are doing' : asksFirst || short || pastGuide ? `Ask my grown up for ${minutes} min 🙋` : `Start ${minutes} min ⏱️`}
            </button>
            {(asksFirst || short || pastGuide) && (
              <p style={{ margin: '10px 0 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', lineHeight: 1.5 }}>
                They get a ping on their phone. When they say yes, this page turns into Start.
              </p>
            )}
          </div>
        )}

        {/* STEP 3: sent, then the yes. The wait is not dead. */}
        {step === 'sent' && (
          <>
            <div style={{ ...card, textAlign: 'center', marginBottom: 12 }}>
              {ask?.status === 'approved' || started ? (
                <>
                  <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em', color: HAPPY.ink }}>Yes from your grown up 🎉</p>
                  <p style={{ margin: '6px 0 14px', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                    {ask?.minutes ?? minutes} minutes on the {deviceLabel(ask?.device ?? device?.kind ?? 'tv')}. Tap start and the timer runs.
                  </p>
                  {note && <p style={{ margin: '0 0 12px', fontSize: 'var(--text-base)', fontWeight: 700, color: '#B93B3F' }}>{note}</p>}
                  <button type="button" data-start onClick={startApproved} disabled={busy || started} style={bigBtn(!busy && !started)}>
                    {started ? 'Starting' : busy ? 'Starting' : `▶ Start my ${ask?.minutes ?? minutes} minutes`}
                  </button>
                </>
              ) : ask?.status === 'declined' ? (
                <>
                  <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: HAPPY.ink }}>Not right now</p>
                  <p style={{ margin: '6px 0 12px', fontSize: 'var(--text-md)', color: 'var(--ink-soft)' }}>Your stars are safe. Try again later, or earn some more first.</p>
                  <button type="button" onClick={() => { setAsk(null); setStep('device') }} style={bigBtn()}>Ask again later</button>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 8 }} aria-hidden>
                    <StarShape size={16} color={HAPPY.butter} /><StarShape size={22} color={HAPPY.coral} /><StarShape size={16} color={HAPPY.butter} />
                  </div>
                  <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em', color: HAPPY.ink }}>Off to your grown up</p>
                  <p style={{ margin: '6px 0 0', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                    {ask?.minutes ?? minutes} minutes on the {deviceLabel(ask?.device ?? device?.kind ?? 'tv')}. They get a ping on their phone. This page turns into Start the moment they say yes.
                  </p>
                  {note && <p style={{ margin: '10px 0 0', fontSize: 'var(--text-base)', fontWeight: 700, color: HAPPY.ink }}>🌙 {note}</p>}
                  <p data-waiting style={{ margin: '12px 0 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Waiting for their yes ⏳</p>
                </>
              )}
            </div>

            {/* EARN MORE WHILE YOU WAIT. Jobs by name with what they pay, and
                the five a day's outside step. The reason the wait is worth
                something. */}
            {(jobsLeft.length > 0 || fiveLeft.length > 0) && !started && (
              <div data-earn style={{ ...card, background: 'var(--tint-green, #E8F4EE)' }}>
                <p style={{ margin: '0 0 8px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                  While you wait, earn more
                </p>
                {jobsLeft.length > 0 && (
                  <a href={`/k/${token}/jobs`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', background: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 14, padding: '10px 12px', marginBottom: 8, boxShadow: `0 3px 0 ${HAPPY.ink}` }}>
                    <HappyIcon name="jobs" size={30} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', color: HAPPY.ink }}>{jobsLeft.length === 1 ? 'One job left' : `${jobsLeft.length} jobs left`}: {earnMinutes} more minutes</span>
                      <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.35 }}>{jobsLeft.slice(0, 3).map(j => `${j.emoji ?? ''} ${j.title}`.trim()).join(', ')}{jobsLeft.length > 3 ? ` and ${jobsLeft.length - 3} more` : ''}</span>
                    </span>
                    <span aria-hidden style={{ fontWeight: 900 }}>›</span>
                  </a>
                )}
                {fiveLeft.length > 0 && (
                  <a href={`/k/${token}#kid-five`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', background: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 14, padding: '10px 12px', boxShadow: `0 3px 0 ${HAPPY.ink}` }}>
                    <HappyIcon name="move" size={30} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', color: HAPPY.ink }}>Your five a day: {fiveLeft.length} left</span>
                      <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.35 }}>{fiveLeft.slice(0, 3).join(', ')}. Outside pays best, and {friend.name} loves it.</span>
                    </span>
                    <span aria-hidden style={{ fontWeight: 900 }}>›</span>
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/** The device list for the page: the family's own screens, or the four kinds. */

