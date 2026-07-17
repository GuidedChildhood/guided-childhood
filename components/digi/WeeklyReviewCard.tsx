'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import WriteIn from '@/components/ui/WriteIn'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { weekBalance, expertWeekTip } from '@/lib/quests/screen-balance'
import { readinessForAgeBand } from '@/lib/content/readiness'
import type { AgeBand } from '@/lib/content/stages'

// The Friday round up, the first thing a parent sees on Home. A clear, premium
// read of the family's own week: the balance score front and centre (their
// screen time against the evidence based healthy guide), the week's wins gathered
// in one glance, one line of guidance from the experts we stand on, and a short
// worth a glance list where every item links to the thing it is about. Nothing
// compared to anyone else, never a report card on the child. If none has been
// built yet the card offers a preview so a parent never waits for the week to turn.

type Stats = {
  children?: string[]
  ageBands?: (string | null)[]
  questsApproved?: number
  starsEarned?: number
  starsSpent?: number
  deviceMinutes?: number
  activeDays?: number
  topQuest?: string | null
  schoolOpen?: number
  momentsDone?: number
}

type Review = {
  id: string
  week_start: string
  stats: Stats
  summary: string
  watch_for: string | null
  suggestion: string | null
  suggestion_routine: string | null
}

// While DiGi reads the week (it takes a moment, it is really reading the
// family's own chats and quests), a warm little narrative of what it is doing,
// so the wait feels like DiGi working, not a stuck button.
const READING_STEPS = [
  'Just reading all our chats from this week...',
  'Got them. Pulling out what actually mattered...',
  'Here you go, shaping the plan for next week...',
]

export default function WeeklyReviewCard() {
  const [review, setReview] = useState<Review | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [busy, setBusy] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!busy) { setStep(0); return }
    const t = setInterval(() => setStep(s => Math.min(s + 1, READING_STEPS.length - 1)), 1600)
    return () => clearInterval(t)
  }, [busy])

  useEffect(() => {
    fetch('/api/digi/weekly-review')
      .then(r => r.json())
      .then(d => { setReview(d.review ?? null); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  // Mark read once the parent has seen it, so it does not keep nagging.
  useEffect(() => {
    if (review && review.id) {
      fetch('/api/digi/weekly-review', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: review.id, status: 'read' }),
      }).catch(() => {})
    }
  }, [review])

  const dismiss = async () => {
    if (!review) return
    const id = review.id
    setReview(null)
    await fetch('/api/digi/weekly-review', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'dismissed' }),
    }).catch(() => {})
  }

  const preview = async () => {
    setBusy(true)
    try {
      const r = await fetch('/api/digi/weekly-review', { method: 'POST' })
      const d = await r.json()
      if (d.review) setReview({ id: d.review.id ?? 'preview', ...d.review })
    } catch { /* non blocking */ } finally { setBusy(false) }
  }

  if (!loaded) return null

  // No review yet: a slim offer to preview the week, but only from Thursday on,
  // when the week just gone actually has a shape. The rest of the week Home stays
  // clear of it, so it is not one more card every day.
  if (!review) {
    const day = new Date().getDay() // 0 Sun .. 6 Sat
    const endOfWeek = day === 0 || day >= 4
    if (!endOfWeek) return null
    return (
      <div style={{ background: '#fff', border: '1.5px dashed var(--border)', borderRadius: '18px', padding: '16px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '13px' }}>
        <span style={{ flexShrink: 0, width: 42, height: 42, borderRadius: '12px', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DigiCharacter mood={busy ? 'thinking' : 'idle'} size={28} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>Your week with DiGi</div>
          <div style={{ fontSize: '12.5px', color: busy ? 'var(--terracotta-dark)' : 'var(--ink-soft)', lineHeight: 1.4, fontWeight: busy ? 700 : 400, transition: 'color 0.3s' }}>
            {busy ? READING_STEPS[step] : 'A clear read of your family’s week, the balance, the wins, and one thing to try next.'}
          </div>
        </div>
        <button onClick={preview} disabled={busy} style={{ flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '12px', padding: '9px 14px', cursor: busy ? 'default' : 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12.5px', boxShadow: '0 3px 0 var(--terracotta-dark)', opacity: busy ? 0.85 : 1 }}>
          {busy ? 'Reading…' : 'See it'}
        </button>
      </div>
    )
  }

  const s = review.stats ?? {}
  const firstName = s.children?.[0] && s.children[0] !== 'Your child' ? s.children[0] : 'your child'
  const starsEarned = s.starsEarned ?? 0
  const activeDays = s.activeDays ?? 0
  const momentsDone = s.momentsDone ?? 0

  const bal = weekBalance({
    screenMins: s.deviceMinutes ?? 0,
    earnedMins: starsEarned * STAR_MINUTES,
    ageBands: s.ageBands ?? [],
  })
  const tip = expertWeekTip({ balanceTone: bal.tone, activeDays, questsApproved: s.questsApproved ?? 0, momentsDone })

  const balAccent = bal.tone === 'healthy' ? 'var(--retro-green)' : bal.tone === 'watch' ? 'var(--stage-1-bold)' : 'var(--deep-teal)'
  const balLabel = bal.tone === 'healthy' ? 'Healthy balance' : bal.tone === 'watch' ? 'Worth a glance' : 'A quiet week'
  const guidePct = bal.guideMins > 0 ? Math.min(160, Math.round((bal.screenMins / bal.guideMins) * 100)) : 0

  // The week's wins, gathered from the family's own numbers, best first.
  const wins: { icon: string; text: string }[] = []
  if (starsEarned > 0) wins.push({ icon: '⭐', text: `${starsEarned} stars earned, worth ${starsEarned * STAR_MINUTES} minutes worked for, not just given` })
  if (s.topQuest) wins.push({ icon: '🏆', text: `${firstName} leaned into “${s.topQuest}” the most` })
  if (activeDays >= 3) wins.push({ icon: '📅', text: `Showed up ${activeDays} of 7 days this week` })
  if (momentsDone > 0) wins.push({ icon: '💛', text: `${momentsDone} calm moment${momentsDone === 1 ? '' : 's'} handled well` })
  const topWins = wins.slice(0, 3)

  // Worth a glance, each linking to the thing it is about.
  const glances: { text: string; href: string; cta: string }[] = []
  if (bal.tone === 'watch') glances.push({ text: 'Screen ran ahead of the healthy guide. One offline quest tips it back.', href: '/dashboard/quests', cta: 'Open Quests' })
  if ((s.schoolOpen ?? 0) > 0) glances.push({ text: `${s.schoolOpen} school reminder${s.schoolOpen === 1 ? '' : 's'} still open.`, href: '/dashboard/school', cta: 'See school' })
  if (review.watch_for) glances.push({ text: review.watch_for, href: '/dashboard/checkin', cta: 'Check in' })
  const topGlances = glances.slice(0, 2)

  const routineHref = review.suggestion_routine ? `/dashboard/quests?routine=${review.suggestion_routine}` : '/dashboard/quests'

  // Tie the week back to the whole point: which passport stamp this stage is
  // earning, so a good week reads as a step toward ready at 16, not just stars.
  const readiness = readinessForAgeBand((s.ageBands?.[0] as AgeBand | null) ?? null)

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '24px', padding: '22px 22px 20px', marginBottom: '24px', boxShadow: '0 2px 4px rgba(26,26,46,0.03), 0 14px 36px -12px rgba(26,26,46,0.13)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '13px', marginBottom: '16px' }}>
        <span style={{ flexShrink: 0, width: 50, height: 50, borderRadius: '15px', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DigiCharacter mood="happy" size={34} once />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>Your week with DiGi</span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '20px', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.01em', marginTop: '3px' }}>
            The week just gone
          </span>
        </span>
      </div>

      {/* The balance score, front and centre: their screen time against the
          evidence based healthy guide, as one clear number and a moving level. */}
      <div style={{ background: 'var(--cream)', border: `1.5px solid var(--border)`, borderLeft: `6px solid ${balAccent}`, borderRadius: '18px', padding: '16px 18px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '38px', lineHeight: 1, color: balAccent }}>{bal.balancePct}<span style={{ fontSize: '20px' }}>%</span></span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)' }}>{balLabel}</span>
        </div>
        {/* The level: how the week's screen time sits against the healthy guide.
            Full and green when comfortably inside it, amber and over when not. */}
        <div style={{ height: 14, borderRadius: '100px', background: '#fff', border: '1.5px solid var(--border)', overflow: 'hidden', marginBottom: '8px' }}>
          <span style={{ display: 'block', height: '100%', width: `${Math.min(100, guidePct)}%`, background: balAccent, borderRadius: '100px', transition: 'width 0.6s ease' }} />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: '8px' }}>
          {bal.screenMins} min screen used · healthy guide about {bal.guideMins} min a week
        </div>
        <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>{bal.line}</p>
      </div>

      {/* Glanceable stats */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '15px' }}>
        {[
          ['⭐', `${starsEarned} earned`],
          ['✅', `${s.questsApproved ?? 0} quests`],
          ['📅', `${activeDays}/7 days`],
          ['📱', `${s.deviceMinutes ?? 0} min screen`],
        ].map(([icon, label]) => (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '100px', padding: '6px 13px', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ink-soft)' }}>
            <span>{icon}</span>{label}
          </span>
        ))}
      </div>

      <p style={{ fontSize: '15.5px', color: 'var(--ink)', opacity: 0.86, lineHeight: 1.6, margin: '0 0 16px' }}>
        <WriteIn key={review.summary} text={review.summary} baseDelay={120} stepMs={16} />
      </p>

      {/* This week's wins, gathered in one place */}
      {topWins.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--retro-green-dark, var(--deep-teal))' }}>This week’s wins</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginTop: '8px' }}>
            {topWins.map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--tint-sage)', borderRadius: '12px', padding: '10px 13px' }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{w.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4 }}>{w.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* One line of guidance from the experts we stand on, chosen for this week */}
      <div style={{ display: 'flex', gap: '11px', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '14px', padding: '13px 15px', marginBottom: '15px' }}>
        <span style={{ fontSize: '17px', flexShrink: 0 }}>💡</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '3px' }}>The evidence · {tip.expert}</div>
          <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>{tip.tip}</p>
        </div>
      </div>

      {/* Worth a glance, each linking to the thing it is about */}
      {topGlances.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--deep-teal)' }}>Worth a glance</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginTop: '8px' }}>
            {topGlances.map((g, i) => (
              <Link key={i} href={g.href} style={{ display: 'flex', alignItems: 'center', gap: '11px', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '13px', padding: '11px 14px', textDecoration: 'none' }}>
                <span style={{ flex: 1, fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.45 }}>{g.text}</span>
                <span style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', color: '#fff', background: 'var(--deep-teal)', borderRadius: '10px', padding: '7px 12px', whiteSpace: 'nowrap' }}>{g.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* The week on the pathway: this stamp, one step nearer ready at 16. */}
      <Link href="/dashboard/pathway" style={{ display: 'flex', alignItems: 'center', gap: '11px', background: 'var(--cream)', borderRadius: '13px', padding: '11px 14px', marginBottom: '16px', textDecoration: 'none' }}>
        <span style={{ fontSize: '18px', flexShrink: 0 }}>🪪</span>
        <span style={{ flex: 1, minWidth: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
          On the pathway this is <strong style={{ color: 'var(--ink)' }}>Stage {readiness.id}, {readiness.stamp}</strong>. A good week here is one step nearer ready at 16.
        </span>
        <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)' }}>See →</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href={routineHref} onClick={dismiss} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none', borderRadius: '15px', padding: '13px 20px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
          {review.suggestion ? 'Set up next week' : 'Open Quests'}
          <span style={{ fontSize: '16px' }} aria-hidden>→</span>
        </Link>
        {review.suggestion && (
          <span style={{ flex: 1, minWidth: 150, fontSize: '13.5px', color: 'var(--ink-muted)', lineHeight: 1.5 }}>{review.suggestion}</span>
        )}
        <button onClick={dismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, color: 'var(--ink-muted)' }}>Dismiss</button>
      </div>
    </div>
  )
}
