'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import HandoverPrompt, { type HandoverChild } from '@/components/home/HandoverPrompt'
import { MAX_HANDOVER_ASKS } from '@/lib/handover'
import { pickWelcomeCards, type WelcomeCard } from '@/lib/home/welcome-cards'
import type { SetupFlags } from '@/lib/setup/steps'

// The welcome when the app opens. Duolingo does this right: welcome back, one
// beat, gone. So this is one card, one tap, and never a word about how long
// anything is going to take.
//
// The rotation lives across opens rather than inside one view. Each open
// introduces a different thing the platform does, so a parent meets the whole
// product across a fortnight of quick hellos without ever being given a tour.
// Anything they have not set up leads, so the card is a useful next thing.
// And every card says what we do with what they tell it, because that is the
// part parents actually want to know.
//
// Where it hands over. The card used to point at the page the service lives on,
// which made the hello a menu: read a paragraph about Family Quests, land on
// the Quests page, still on your own. It goes to DiGi now, carrying that card's
// question already asked, so a greeting day is hello, one conversation, Home.
// Later goes straight to Home as it always did, and the four quiet days have no
// hello at all, so they keep no detour either. DiGi's header already carries the
// way back to today's pathway, which is the Home half of that sequence, so there
// is no second control here telling a parent how to leave.

// The hello is not every open. Justin's call after seeing it land, and he is
// right: a card every single time you open the app stops being a welcome and
// becomes a toll gate. So it appears on Mondays, Wednesdays and Saturdays only.
// Monday sets the week up, Wednesday catches it mid week, Saturday is when a
// family actually has time. Four days a week it says nothing at all.
const GREET_DAYS = [1, 3, 6]

// One app open is exactly a session: a fresh launch or a new tab greets them
// again, moving around inside the app does not.
//
// The flag stores the DAY it was set, not a bare '1'. It used to store '1' with
// no date, and sessionStorage survives reloads and is restored on browser
// session restore, so a parent who keeps the app in one pinned tab was greeted
// once and then never again: Monday's flag was still set on Wednesday. That on
// its own reproduces "I never see a welcome" for anyone who does not close
// their tab, which on a phone is almost everyone.
const OPEN_KEY = 'gc_mission_welcome_open'

// The greeting day is read in London, like every other date on this page
// (page.tsx uses an explicit Europe/London timeZone). This one used the
// browser's own clock, so a device set to another zone greeted on the wrong
// days, and near midnight a UK parent could miss theirs entirely.
const UK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
function londonToday(): { day: number; stamp: string } {
  try {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
    })
    const parts = fmt.formatToParts(new Date())
    const get = (t: string) => parts.find(p => p.type === t)?.value ?? ''
    const day = UK_DAYS.indexOf(get('weekday').slice(0, 3))
    const stamp = `${get('year')}-${get('month')}-${get('day')}`
    if (day >= 0 && stamp.length === 10) return { day, stamp }
  } catch { /* fall through to the device clock */ }
  const d = new Date()
  return { day: d.getDay(), stamp: d.toISOString().slice(0, 10) }
}
// Which cards they have met, oldest first, so the rotation carries across
// logins. Trimmed so it can never grow without end.
const SEEN_KEY = 'gc_welcome_seen'
const SEEN_MAX = 40
// How many times this browser has opened the app. The handover ask waits for
// the second, because the first open already carries the welcome and the
// onboarding, and two overlays on day one is a wall.
const OPENS_KEY = 'gc_app_opens'
// How many times this browser has shown the handover ask. The real cap lives
// on the profile, but a browser side count means the ask is still bounded on a
// deploy where the columns are not there yet, or if the write ever fails.
const HANDOVER_ASKS_KEY = 'gc_handover_asks'

function readSeen(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(x => typeof x === 'string') : []
  } catch { return [] }
}

// What was decided for this page load, so a remount shows the same hello again
// rather than nothing, and a dismissed one stays dismissed.
let openDecision: { cards: WelcomeCard[] | null; handover: boolean; dismissed: boolean } | null = null

export default function MissionWelcome({
  firstName,
  flags,
  phoneAge = false,
  handoverChild = null,
}: {
  firstName?: string
  flags?: Partial<SetupFlags>
  phoneAge?: boolean
  // Set only when this family is still to answer the handover ask. The server
  // has already checked the age band, that no link exists, that they have not
  // chosen paper and that we have not asked too many times.
  handoverChild?: HandoverChild | null
}) {
  // Hidden until the client has checked whether this open has been greeted, so
  // a parent already moving around never sees it flash back in.
  const [cards, setCards] = useState<WelcomeCard[] | null>(null)
  const [step, setStep] = useState(0)
  const [handover, setHandover] = useState(false)

  useEffect(() => {
    // The decision for this page session is made once and remembered here,
    // outside React. Without this the component is one remount away from
    // silently greeting nobody: the first pass writes the "already greeted"
    // key, and a second pass, from StrictMode in development, from Fast
    // Refresh, or from a client navigation back to Home, reads the key it just
    // wrote, bails, and leaves a blank screen. Caught by looking at it rather
    // than by the build, which is the only way this class of bug ever surfaces.
    if (openDecision) {
      if (openDecision.dismissed) return
      if (openDecision.handover) setHandover(true)
      else setCards(openDecision.cards)
      return
    }

    // Quiet days end it here, before the open is even counted, so a Tuesday
    // never eats the card that Wednesday was going to show.
    const today = londonToday()
    if (!GREET_DAYS.includes(today.day)) {
      openDecision = { cards: null, handover: false, dismissed: true }
      return
    }

    let greeted = false
    try { greeted = sessionStorage.getItem(OPEN_KEY) === today.stamp } catch { /* private mode, greet them */ }
    if (greeted) { openDecision = { cards: null, handover: false, dismissed: true }; return }
    try { sessionStorage.setItem(OPEN_KEY, today.stamp) } catch { /* private mode, greeted every Home view */ }

    let opens = 1
    try {
      opens = Number(localStorage.getItem(OPENS_KEY) ?? 0) + 1
      localStorage.setItem(OPENS_KEY, String(opens))
    } catch { /* private mode, every open is the first, so the ask waits */ }

    // One overlay per open, never two. The handover takes the slot when it is
    // its turn, and the service card takes it every other time.
    let asked = 0
    try { asked = Number(localStorage.getItem(HANDOVER_ASKS_KEY) ?? 0) } catch { /* counted server side only */ }
    // After three opens, not two. The first few visits are already carrying the
    // welcome and the onboarding, and the ask lands far better once the parent
    // has actually seen what the child's side is for.
    if (handoverChild && opens > 3 && asked < MAX_HANDOVER_ASKS) {
      try { localStorage.setItem(HANDOVER_ASKS_KEY, String(asked + 1)) } catch { /* server side cap still holds */ }
      openDecision = { cards: null, handover: true, dismissed: false }
      setHandover(true)
      return
    }

    const seen = readSeen()
    const pick = pickWelcomeCards(flags ?? {}, seen, phoneAge, 1)
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, ...pick.map(c => c.key)].slice(-SEEN_MAX)))
    } catch { /* private mode, the rotation resets each time, still fine */ }
    openDecision = { cards: pick, handover: false, dismissed: false }
    setCards(pick)
  }, [flags, phoneAge, handoverChild])

  const name = firstName && firstName.trim() ? firstName.trim() : null

  if (handover && handoverChild) {
    return (
      <HandoverPrompt
        child={handoverChild}
        onDone={choice => {
          setHandover(false)
          // Closed without deciding: count the ask, so a parent who never
          // answers is left alone after a few and falls back to the quiet
          // prompt already sitting on the Quests page.
          if (choice === 'later') {
            void fetch('/api/handover', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'asked' }),
            })
          }
        }}
      />
    )
  }

  // Already greeted this open: Home is theirs now.
  if (!cards || cards.length === 0) return null
  const card = cards[step]
  const isLast = step === cards.length - 1

  const close = () => {
    if (openDecision) openDecision.dismissed = true
    setCards(null)
  }

  return (
    <div
      role="dialog"
      aria-label="Welcome back"
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        // Opaque and edge to edge. A blurred app behind it reads as an
        // interruption to something they were already doing, when in fact this
        // is the front door. Full screen makes it the room, not a popup.
        background: 'var(--cream)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, overflowY: 'auto', animation: 'gc-welcome-in 0.3s ease',
      }}
    >
      <style>{`
        @keyframes gc-welcome-in { from { opacity: 0 } to { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) { [data-gc-welcome] { animation: none !important } }
      `}</style>
      <div
        data-gc-welcome
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 440, margin: 'auto',
          background: '#fff', border: '1.5px solid var(--border)',
          borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 10px 30px -14px rgba(26,26,46,0.28)',
        }}
      >
        {/* The hello. Short, warm, and no idea how long today is going to be. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '16px 18px 14px', background: 'var(--terracotta-lt)' }}>
          <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DigiCharacter size={26} mood="wave" />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
              {name ? `Welcome back, ${name}` : 'Welcome back'}
            </div>
            <div style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 2 }}>
              While we get today ready, here is one thing we do
            </div>
          </div>
        </div>

        {/* The one service. Different every open, so a fortnight of hellos
            covers the whole product without a tour. */}
        <div style={{ padding: '18px 18px 4px' }}>
          <div style={{ fontSize: 30, lineHeight: 1, marginBottom: 10 }}>{card.emoji}</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(21px, 6vw, 24px)', color: 'var(--ink)',
            lineHeight: 1.2, letterSpacing: '-0.015em', margin: '0 0 8px',
          }}>
            {card.title}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 500, color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            {card.line}
          </p>
        </div>

        {/* What we do with what you tell it. Every card carries one, because
            the honest answer is the feature. */}
        <div style={{ margin: '14px 18px 0', background: 'var(--tint-sage)', borderRadius: 14, padding: '11px 13px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>
            What we do with it
          </div>
          <p style={{ fontSize: 15.5, color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
            {card.trust}
          </p>
        </div>

        {/* The question, shown before it is asked. A button that only said Ask
            DiGi would be a mystery box, and a parent who cannot see what is
            about to be sent on their behalf has every right not to press it. */}
        <div style={{ padding: '16px 18px 0' }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17,
            color: 'var(--ink)', lineHeight: 1.35, margin: 0,
          }}>
            &ldquo;{card.ask}&rdquo;
          </p>
        </div>

        {/* One tap in, one tap past, and the way past is never hidden. */}
        <div style={{ display: 'flex', gap: 8, padding: '12px 18px 18px' }}>
          <Link
            href={`/dashboard/digi?q=${encodeURIComponent(card.ask)}`}
            onClick={close}
            style={{
              flex: 1, textAlign: 'center', padding: '13px 10px', textDecoration: 'none',
              background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 16,
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17,
              boxShadow: '0 4px 0 var(--terracotta-dark)',
            }}
          >
            Ask DiGi this
          </Link>
          {/* Next while there is more to see, the way out on the last one.
              Following the question closes the whole hello rather than parking
              them mid sequence, because they have gone to have the conversation
              and coming back to a leftover overlay would be nonsense. */}
          <button
            onClick={() => (isLast ? close() : setStep(step + 1))}
            style={{
              flex: '0 0 auto', padding: '13px 18px', cursor: 'pointer',
              background: '#fff', color: 'var(--ink)',
              border: '1.5px solid var(--border)',
              borderRadius: 16, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17,
            }}
          >
            {isLast ? 'Later' : 'Next'}
          </button>
        </div>

        {/* Where they are in the three. Quiet, and only when there is more than
            one, so a single card never wears a progress bar for no reason. */}
        {cards.length > 1 && (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', padding: '0 18px 18px' }}>
            {cards.map((c, i) => (
              <span key={c.key} aria-hidden style={{
                width: i === step ? 20 : 7, height: 7, borderRadius: 4,
                background: i === step ? 'var(--terracotta)' : 'var(--border)',
                transition: 'width 0.2s ease',
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
