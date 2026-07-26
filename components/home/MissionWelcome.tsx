'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import HandoverPrompt, { type HandoverChild } from '@/components/home/HandoverPrompt'
import ShareQrButton from '@/components/quests/ShareQrButton'
import { MAX_HANDOVER_ASKS } from '@/lib/handover'
import { pickWelcomeCard, type WelcomeCard } from '@/lib/home/welcome-cards'
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

// One app open is exactly a session: a fresh launch or a new tab greets them
// again, moving around inside the app does not.
const OPEN_KEY = 'gc_mission_welcome_open'
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

export default function MissionWelcome({
  firstName,
  flags,
  phoneAge = false,
  handoverChild = null,
  child = null,
}: {
  firstName?: string
  flags?: Partial<SetupFlags>
  phoneAge?: boolean
  // Set only when this family is still to answer the handover ask. The server
  // has already checked the age band, that no link exists, that they have not
  // chosen paper and that we have not asked too many times.
  handoverChild?: HandoverChild | null
  // The primary child, whatever the handover state, so the phone link card can
  // put the code up rather than point at a page.
  child?: HandoverChild | null
}) {
  // Hidden until the client has checked whether this open has been greeted, so
  // a parent already moving around never sees it flash back in.
  const [card, setCard] = useState<WelcomeCard | null>(null)
  const [handover, setHandover] = useState(false)

  useEffect(() => {
    let greeted = false
    try { greeted = sessionStorage.getItem(OPEN_KEY) === '1' } catch { /* private mode, greet them */ }
    if (greeted) return
    try { sessionStorage.setItem(OPEN_KEY, '1') } catch { /* private mode, greeted every Home view */ }

    let opens = 1
    try {
      opens = Number(localStorage.getItem(OPENS_KEY) ?? 0) + 1
      localStorage.setItem(OPENS_KEY, String(opens))
    } catch { /* private mode, every open is the first, so the ask waits */ }

    // One overlay per open, never two. The handover takes the slot when it is
    // its turn, and the service card takes it every other time.
    let asked = 0
    try { asked = Number(localStorage.getItem(HANDOVER_ASKS_KEY) ?? 0) } catch { /* counted server side only */ }
    if (handoverChild && opens >= 2 && asked < MAX_HANDOVER_ASKS) {
      try { localStorage.setItem(HANDOVER_ASKS_KEY, String(asked + 1)) } catch { /* server side cap still holds */ }
      setHandover(true)
      return
    }

    const seen = readSeen()
    const pick = pickWelcomeCard(flags ?? {}, seen, phoneAge)
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, pick.key].slice(-SEEN_MAX)))
    } catch { /* private mode, the rotation resets each time, still fine */ }
    setCard(pick)
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
  if (!card) return null

  const close = () => setCard(null)

  return (
    <div
      onClick={close}
      role="dialog"
      aria-label="Welcome back"
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(26,26,46,0.45)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, animation: 'gc-welcome-in 0.3s ease',
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
          width: '100%', maxWidth: 440,
          background: '#fff', border: '1.5px solid var(--border)',
          borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 24px 60px -18px rgba(26,26,46,0.5)',
        }}
      >
        {/* The hello. Short, warm, and no idea how long today is going to be. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '16px 18px 14px', background: 'var(--terracotta-lt)' }}>
          <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DigiCharacter size={26} mood="wave" />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
              {name ? `Welcome back, ${name}` : 'Welcome back'}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 2 }}>
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
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 500, color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            {card.line}
          </p>
        </div>

        {/* What we do with what you tell it. Every card carries one, because
            the honest answer is the feature. */}
        <div style={{ margin: '14px 18px 0', background: 'var(--tint-sage)', borderRadius: 14, padding: '11px 13px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>
            What we do with it
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
            {card.trust}
          </p>
        </div>

        {/* One tap out, always. Where the card points somewhere useful they get
            that too, but the way past is never hidden. */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 18px 18px' }}>
          {/* The phone link card puts the code up right here rather than
              pointing at the page it lives on, because send their link is a
              promise and a page is not the thing promised. */}
          {card.key === 'childLink' && child ? (
            <ShareQrButton
              childId={child.id}
              childName={child.name}
              label={card.cta ?? 'Send their link'}
              style={{ flex: 1, padding: '13px 10px', fontSize: 15, boxShadow: '0 4px 0 var(--terracotta-dark)' }}
            />
          ) : card.href && (
            <Link
              href={card.href}
              onClick={close}
              style={{
                flex: 1, textAlign: 'center', padding: '13px 10px', textDecoration: 'none',
                background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 16,
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
                boxShadow: '0 4px 0 var(--terracotta-dark)',
              }}
            >
              {card.cta ?? 'Have a look'}
            </Link>
          )}
          <button
            onClick={close}
            style={{
              flex: card.href ? '0 0 auto' : 1, padding: '13px 18px', cursor: 'pointer',
              background: card.href ? '#fff' : 'var(--terracotta)',
              color: 'var(--ink)',
              border: card.href ? '1.5px solid var(--border)' : 'none',
              borderRadius: 16, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
              boxShadow: card.href ? 'none' : '0 4px 0 var(--terracotta-dark)',
            }}
          >
            {card.href ? 'Later' : 'Start today'}
          </button>
        </div>
      </div>
    </div>
  )
}
