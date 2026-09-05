'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import Celebration from '@/components/ui/Celebration'

// The first welcome: a celebration, then the day, one card at a time.
//
// Justin, 2 September 2026: "When first signing up and adding a child it then
// goes to celebration and walk through. Can we make this super simple,
// explaining step by step what happens each day, with the best UX, Apple
// level, simple to the user, and animation sliding up of each part of the
// platform, how it helps solve their problem. Do complete, get rid of what is
// there. We need to cover everything we do, why, and how DiGi works."
//
// WHAT IT REPLACES. The wizard used to end on a DiGi speech bubble written by
// a model call (one screen, a "Sounds good" button), a "first task" screen
// built from the same call, and the notifications ask. Nothing in it said
// what the product does each day. A parent arrived on the dashboard having
// been welcomed and told nothing.
//
// THE SHAPE. Finch's onboarding (one card leads, the rest wait), Duolingo's
// (a progress bar, one idea per screen, one button), Klima's and Lloyds'
// feature tours (illustration above, text below, one button), from the
// Mobbin sweep on 2 September, translated into butter, ink and Nunito. Every
// card is the same anatomy so the eye learns it once: a drawn scene from OUR
// screens, an eyebrow saying when it happens, one headline, two lines, and
// the why in a green strip. The seven cards are the seven parts of a day and
// a week: home, the check in, moments, scripts, DiGi, the child's app, the
// payoff. The eighth is the reminder ask, kept from the old flow because
// Duolingo is right that a parent who has just seen the plan says yes to a
// nudge protecting it.
//
// THE MOTION. GSAP, the house rule. Each card slides up from below on Next:
// the scene first, then the eyebrow, headline, body and why in a stagger,
// so the screen assembles rather than appears. Reduced motion gets the
// content with no travel.
//
// THE COPY. The child's real name on every card, they and their for the
// pronoun (the account holds no pronoun and a wrong guess is worse than a
// neutral one). No dashes. Nothing here is generated.
//
// Design canvas: First Welcome Walkthrough, 2 September 2026.

export type WalkthroughDestination = 'checkin' | 'dashboard'

type Props = {
  childName: string
  /** Where to go when the walkthrough ends, and how it ended. */
  onFinish: (dest: WalkthroughDestination) => void
  /**
   * Ask the phone for push permission and subscribe. Resolves true when the
   * nudge is set. Omit it (the How it works page) and the reminder card is
   * left out entirely.
   */
  onEnableNotifications?: () => Promise<boolean>
  /** Off for the revisit from Settings, where nothing new has happened. */
  celebrate?: boolean
}

// THE SCREEN IS THE SCREEN. The app runs under body { zoom: 1.07 } (the one
// readability dial in shared/tokens.css), and under it 100dvh paints seven
// percent taller than the glass, which put the Next button just below the
// fold on an iPhone. So this takeover turns the dial off on body and back on
// for itself, sized to the real viewport divided by the same dial, and the
// button is pinned to the foot while the middle scrolls on a short phone.
const ZOOM = 1.07
const ZOOM_CSS = `body { zoom: 1; } .gc-welcome { zoom: ${ZOOM}; height: calc(100dvh / ${ZOOM}); }`
const SCREEN: React.CSSProperties = { background: 'var(--cream)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }

const BUTTER = 'var(--terracotta)'
const BUTTER_DARK = 'var(--terracotta-dark)'
const INK = 'var(--ink)'
const GREEN = 'var(--retro-green)'
const GREEN_DARK = 'var(--retro-green-dark)'

const BTN: React.CSSProperties = {
  display: 'block', width: '100%',
  padding: '17px 28px',
  // The child's button (plans/week-of-2026-08-31-parent-happy-news-plan.md):
  // butter, an ink edge, a hard ink ledge, Nunito 900.
  background: BUTTER, color: INK,
  border: `2px solid ${INK}`, borderRadius: 16,
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
  cursor: 'pointer',
  boxShadow: `0 4px 0 ${INK}`,
  transition: 'transform 0.1s, box-shadow 0.1s',
  textAlign: 'center',
}

const QUIET_BTN: React.CSSProperties = {
  display: 'block', width: '100%',
  background: 'none', border: 'none',
  color: 'var(--ink-light)',
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
  cursor: 'pointer', textAlign: 'center',
  padding: '10px 0', letterSpacing: '0.06em',
}

const MONO_LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

// ── The scenes. Each one is our own screen, drawn small: line art and the
// real tokens, never a screenshot, so it prints crisp at any size and can be
// recoloured with the app.

function Star({ size, filled = true, muted = false }: { size: number; filled?: boolean; muted?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#EDC35F' : '#fff'} stroke={muted ? '#AEAEC0' : '#C99A28'} strokeWidth="1.4" strokeLinejoin="round" aria-hidden>
      <path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z" />
    </svg>
  )
}

function Tick({ size = 12, color = '#fff', width = 3 }: { size?: number; color?: string; width?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 13l5 5L20 7" />
    </svg>
  )
}

function SceneHome() {
  return (
    <svg width="100%" viewBox="0 0 330 220" fill="none" style={{ maxWidth: 330, display: 'block' }} aria-hidden>
      <path d="M 40 190 C 90 190, 90 120, 150 120 S 210 60, 290 40" stroke="#EAEAF0" strokeWidth="14" strokeLinecap="round" />
      <path d="M 40 190 C 90 190, 90 120, 150 120" stroke="#EDC35F" strokeWidth="14" strokeLinecap="round" />
      <circle cx="40" cy="190" r="16" fill="#2F8F6B" />
      <path d="M33 190l5 5 9-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <g data-pop style={{ transformOrigin: '150px 120px' }}>
        <circle cx="150" cy="120" r="30" fill="#EDC35F" stroke="#C99A28" strokeWidth="3" />
        <circle cx="150" cy="120" r="40" fill="none" stroke="#EDC35F" strokeWidth="2" opacity="0.5" />
        <path transform="translate(136 106) scale(1.17)" d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z" fill="#fff" stroke="#C99A28" strokeWidth="1.2" strokeLinejoin="round" />
      </g>
      <circle cx="220" cy="90" r="14" fill="#fff" stroke="#EAEAF0" strokeWidth="3" />
      <circle cx="290" cy="40" r="14" fill="#fff" stroke="#EAEAF0" strokeWidth="3" />
      <rect x="96" y="160" width="150" height="40" rx="14" fill="#1A1A2E" />
      <text x="171" y="185" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="800" fontSize="15" fill="#fff">Today: check in</text>
    </svg>
  )
}

function SceneCheckIn() {
  return (
    <div style={{ width: '100%', maxWidth: 330, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: INK }}>Screens at bedtime</div>
        <div style={{ ...MONO_LABEL, letterSpacing: '0.06em' }}>Last time 2</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} data-rise><Star size={44} filled={i < 3} muted={i >= 3} /></div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--tint-sage)', borderRadius: 14, padding: '10px 12px' }}>
        <Tick size={18} color="#2F8F6B" width={2.4} />
        <div style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: GREEN_DARK }}>Better than last time. That counts.</div>
      </div>
    </div>
  )
}

function SceneMoments() {
  const tiles: [string, string, string, boolean][] = [
    ['Bedtime battle', 'var(--stage-2)', 'var(--stage-2-bold)', true],
    ['Tablet at tea', 'var(--stage-3)', 'var(--stage-3-bold)', false],
    ['Meltdown at off', 'var(--stage-1)', 'var(--stage-1-bold)', false],
    ['Went well', 'var(--tint-sage)', '#A7D7C5', false],
  ]
  return (
    <div style={{ width: '100%', maxWidth: 330, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
      {tiles.map(([label, bg, band, chosen]) => (
        <div key={label} data-rise style={{
          background: bg, border: `2px solid ${chosen ? '#1A1A2E' : 'transparent'}`, borderRadius: 18,
          padding: '12px 12px 10px', display: 'flex', flexDirection: 'column', gap: 8,
          boxShadow: chosen ? '0 4px 0 #1A1A2E' : 'none',
        }}>
          <div style={{ width: 30, height: 30, borderRadius: 10, background: band }} />
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: INK }}>{label}</div>
        </div>
      ))}
    </div>
  )
}

function SceneScripts() {
  return (
    <div style={{ width: '100%', maxWidth: 330, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div data-rise style={{ background: 'var(--tint-sage)', borderRadius: '18px 18px 18px 4px', padding: '12px 14px', alignSelf: 'flex-start', maxWidth: 290 }}>
        <div style={{ ...MONO_LABEL, color: GREEN, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>Say this</div>
        <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', lineHeight: 1.35, color: INK }}>"Five more minutes, then it is my turn to hold it. I will come and get you."</div>
      </div>
      <div data-rise style={{ background: 'var(--danger-bg)', borderRadius: '18px 18px 4px 18px', padding: '12px 14px', alignSelf: 'flex-end', maxWidth: 250 }}>
        <div style={{ ...MONO_LABEL, color: 'var(--danger)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>Not this</div>
        <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', lineHeight: 1.35, color: INK, textDecoration: 'line-through', textDecorationColor: 'var(--danger)' }}>"Right, that is it, give it here."</div>
      </div>
      <div data-rise style={{ ...MONO_LABEL, letterSpacing: '0.06em', textTransform: 'none', paddingLeft: 4 }}>Script 4 of 60 · Ages 8 to 10</div>
    </div>
  )
}

function SceneDigi() {
  const steps = ['Where you are: a save point fight', 'Next step: the two minute warning', 'The words: tap for the script']
  return (
    <div style={{ width: '100%', maxWidth: 330, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <img data-pop src="/digi-squad/DiGi-star.svg" alt="DiGi" width={58} height={62} style={{ flexShrink: 0, display: 'block' }} />
        <div data-rise style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: '18px 18px 18px 4px', padding: '12px 14px', boxShadow: '0 3px 0 var(--ink)' }}>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', lineHeight: 1.4, color: INK }}>That is not defiance, that is mid game. Here is the pathway for tonight:</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 68 }}>
        {steps.map((s, i) => (
          <div key={s} data-rise style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: BUTTER, color: INK, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: INK }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SceneChild({ name }: { name: string }) {
  const done = (label: string) => (
    <div data-rise style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.7 }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--tint-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Tick color="#2F8F6B" width={3.5} /></div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', textDecoration: 'line-through' }}>{label}</div>
    </div>
  )
  return (
    <div style={{ width: '100%', maxWidth: 330, background: 'var(--kid-bg)', borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)' }}>{name}&rsquo;s five for today</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', opacity: 0.8 }}>2 of 5</div>
      </div>
      <div style={{ height: 8, borderRadius: 100, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}><div style={{ width: '40%', height: '100%', background: BUTTER, borderRadius: 100 }} /></div>
      {done('Tidy my room')}
      {done('A lesson')}
      <div data-rise style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.1)', border: `2px solid #EDC35F`, borderRadius: 14, padding: '10px 12px', boxShadow: '0 4px 0 #C99A28' }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Star size={18} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)' }}>Check my balance</div>
          <div style={{ fontSize: 'var(--text-sm)', opacity: 0.8 }}>12 stars = 60 minutes this week</div>
        </div>
        <div style={{ fontWeight: 900, opacity: 0.6 }}>›</div>
      </div>
    </div>
  )
}

function ScenePayoff() {
  return (
    <div style={{ width: '100%', maxWidth: 330, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: INK }}>Screens at bedtime</div>
        <div style={{ ...MONO_LABEL, color: GREEN, fontWeight: 700, letterSpacing: '0.06em' }}>Resting</div>
      </div>
      <svg width="100%" viewBox="0 0 330 120" fill="none" style={{ display: 'block' }} aria-hidden>
        <line x1="10" y1="100" x2="320" y2="100" stroke="#EAEAF0" strokeWidth="2" />
        <polyline data-line points="20,88 70,80 120,84 170,60 220,48 270,30 310,22" stroke="#2F8F6B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="88" r="7" fill="#fff" stroke="#AEAEC0" strokeWidth="3" />
        <circle cx="310" cy="22" r="9" fill="#2F8F6B" />
        <path d="M305 22l3.5 3.5 6.5-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="14" y="116" fontFamily="var(--font-mono)" fontSize="11" fill="#8888A0">WEEK 1</text>
        <text x="278" y="116" fontFamily="var(--font-mono)" fontSize="11" fill="#8888A0">WEEK 6</text>
      </svg>
      <div style={{ display: 'flex', gap: 8 }}>
        <div data-rise style={{ flex: 1, background: 'var(--terracotta-lt)', borderRadius: 14, padding: '10px 12px' }}>
          <div style={{ ...MONO_LABEL, color: BUTTER_DARK, fontWeight: 700, letterSpacing: '0.1em' }}>Weekly email</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: INK, marginTop: 2 }}>What worked</div>
        </div>
        <div data-rise style={{ flex: 1, background: 'var(--stage-2)', borderRadius: 14, padding: '10px 12px' }}>
          <div style={{ ...MONO_LABEL, color: 'var(--stage-2-text)', fontWeight: 700, letterSpacing: '0.1em' }}>Passport</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: INK, marginTop: 2 }}>Filled in together</div>
        </div>
      </div>
    </div>
  )
}

function SceneRemind({ name }: { name: string }) {
  return (
    <div style={{ width: '100%', maxWidth: 330, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div data-rise style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#fff', border: '2px solid var(--ink)', borderRadius: 18, padding: '12px 14px', boxShadow: '0 3px 0 var(--ink)' }}>
        <img src="/digi-squad/DiGi-star.svg" alt="" width={36} height={39} style={{ flexShrink: 0, display: 'block' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: INK }}>DiGi</div>
            <div style={{ ...MONO_LABEL, letterSpacing: '0.06em', textTransform: 'none' }}>7:40pm</div>
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.35 }}>Bedtime in twenty minutes. The words for tonight are ready.</div>
        </div>
      </div>
      <div data-rise style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#fff', border: '2px solid var(--ink)', borderRadius: 18, padding: '12px 14px', boxShadow: '0 3px 0 var(--ink)' }}>
        <img src="/digi-squad/DiGi-star.svg" alt="" width={36} height={39} style={{ flexShrink: 0, display: 'block' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: INK }}>DiGi</div>
            <div style={{ ...MONO_LABEL, letterSpacing: '0.06em', textTransform: 'none' }}>Sunday</div>
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.35 }}>{name}&rsquo;s week: bedtime went from 2 to 4 stars. Here is what did it.</div>
        </div>
      </div>
    </div>
  )
}

// ── The cards, in the order a day happens.

type Card = {
  key: string
  eyebrow: string
  headline: string
  body: string
  why: string
  scene: ReactNode
  sceneBg?: string
}

function cardsFor(name: string): Card[] {
  return [
    {
      key: 'home', eyebrow: 'Every day · Ten minutes',
      headline: 'Open the app. Do one thing.',
      body: 'Home picks today’s one clear thing for you: a check in, a moment, the words for tonight. Never a list, never a lecture.',
      why: 'A plan you can keep beats a plan you admire.',
      scene: <SceneHome />,
    },
    {
      key: 'checkin', eyebrow: 'Every day · Two minutes',
      headline: 'Rate how the worries went.',
      body: 'Two worries to start, five stars each. Your first check in is the baseline. From then on you watch the number move.',
      why: 'Nobody can tell what is working until someone counts.',
      scene: <SceneCheckIn />,
    },
    {
      key: 'moments', eyebrow: 'When something happens',
      headline: 'Tap the moment that went wrong.',
      body: 'The bedtime battle, the tablet at tea, the meltdown when it went off. Tap it and it becomes a worry the app tracks with you.',
      why: 'The argument you had today is the one worth solving.',
      scene: <SceneMoments />,
    },
    {
      key: 'scripts', eyebrow: 'Before the hard conversation',
      headline: 'The actual words for tonight.',
      body: 'Every hard conversation has a script: what to say, what not to say, and what to do when it goes sideways. Sixty of them, by age.',
      why: 'Knowing what to say is the difference between a fight and a chat.',
      scene: <SceneScripts />,
    },
    {
      key: 'digi', eyebrow: 'Any time · How DiGi works',
      headline: 'DiGi never says yes or no.',
      body: 'Tell DiGi what happened. It knows your family, your worries and the research, and answers with where you are, the next step and the words. Never a ban, never a free pass.',
      why: 'A rule teaches nothing. A pathway does.',
      scene: <SceneDigi />,
    },
    {
      key: 'child', eyebrow: `${name}’s side · No login`,
      headline: `${name} earns their own screen time.`,
      body: 'Jobs earn stars, stars become minutes at your rate. Five things a day, a lesson, a printable, a buddy who cheers. You share one link, no account needed.',
      why: 'A child who is part of the plan stops fighting the plan.',
      scene: <SceneChild name={name} />, sceneBg: 'var(--cream)',
    },
    {
      key: 'payoff', eyebrow: 'Every week',
      headline: 'Watch it work.',
      body: 'One email a week with what worked, the passport filling up together, and a number that moves. When a worry lands on five stars, it rests.',
      why: 'You start with a baseline today. Six weeks from now you can see it.',
      scene: <ScenePayoff />,
    },
  ]
}

const REMIND_CARD = (name: string): Card => ({
  key: 'remind', eyebrow: 'One nudge a day',
  headline: 'Want a nudge before bedtime?',
  body: `One reminder before the moment that usually goes wrong, and ${name}’s week on a Sunday. No spam. It stops the second it stops helping.`,
  why: 'The plan you just saw happens tonight, not next week.',
  scene: <SceneRemind name={name} />, sceneBg: 'var(--cream)',
})

export default function WelcomeWalkthrough({ childName, onFinish, onEnableNotifications, celebrate = true }: Props) {
  const name = childName.trim() && childName.trim() !== 'Your child' ? childName.trim() : 'Your child'
  const cards = cardsFor(name)
  const withRemind = !!onEnableNotifications
  const total = cards.length
  // -1 is the celebration; 0..total-1 the cards; total the reminder ask.
  const [i, setI] = useState(celebrate ? -1 : 0)
  const [notif, setNotif] = useState<'idle' | 'asking' | 'done'>('idle')
  const stageRef = useRef<HTMLDivElement>(null)
  const reduced = useRef(false)

  useEffect(() => {
    try { reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { /* no dial */ }
  }, [])

  // The slide up. Runs on every card change: the scene rises first, then
  // each line of text under it, then the button, a beat apart.
  useLayoutEffect(() => {
    const root = stageRef.current
    if (!root) return
    const parts = Array.from(root.querySelectorAll<HTMLElement>('[data-part]'))
    const risers = Array.from(root.querySelectorAll<HTMLElement>('[data-rise]'))
    const pops = Array.from(root.querySelectorAll<HTMLElement>('[data-pop]'))
    const line = root.querySelector<SVGPolylineElement>('[data-line]')
    if (reduced.current) {
      gsap.set([...parts, ...risers, ...pops], { clearProps: 'all' })
      return
    }
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(parts, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.09 }, 0)
    if (risers.length) tl.fromTo(risers, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.08 }, 0.25)
    if (pops.length) tl.fromTo(pops, { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'back.out(1.6)' }, 0.2)
    if (line) {
      const len = line.getTotalLength()
      tl.fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' }, 0.4)
    }
    return () => { tl.kill() }
  }, [i])

  function go(next: number) {
    const root = stageRef.current
    if (!root || reduced.current) { setI(next); return }
    const parts = Array.from(root.querySelectorAll<HTMLElement>('[data-part]'))
    gsap.to(parts, { y: -14, autoAlpha: 0, duration: 0.18, ease: 'power2.in', stagger: 0.02, onComplete: () => setI(next) })
  }

  function finish(dest: WalkthroughDestination) { onFinish(dest) }

  async function remind() {
    if (!onEnableNotifications || notif !== 'idle') return
    setNotif('asking')
    let ok = false
    try { ok = await onEnableNotifications() } catch { ok = false }
    if (ok) {
      setNotif('done')
      setTimeout(() => finish('checkin'), 900)
    } else {
      finish('checkin')
    }
  }

  // ── The celebration.
  if (i === -1) {
    return (
      <div className="gc-welcome" style={{ ...SCREEN, position: 'relative' }}>
        <style>{ZOOM_CSS}</style>
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}><Celebration /></div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 32%, var(--terracotta-lt) 0%, rgba(254,247,224,0) 60%)', pointerEvents: 'none' }} />
        <div ref={stageRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '40px 28px 0', position: 'relative', maxWidth: 480, width: '100%', margin: '0 auto' }}>
          <div data-part style={{ position: 'relative' }}>
            <div style={{ width: 168, height: 168, borderRadius: '50%', background: '#FEF7E0', border: '2px solid var(--ink)', boxShadow: '0 4px 0 var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img data-pop src="/digi-squad/DiGi-star.svg" alt="DiGi" width={140} height={150} style={{ display: 'block' }} />
            </div>
            <div data-rise style={{ position: 'absolute', right: -14, bottom: 6, background: GREEN, color: '#fff', borderRadius: 100, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6, boxShadow: `0 4px 0 ${GREEN_DARK}` }}>
              <Tick size={16} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)' }}>{name}</span>
            </div>
          </div>
          <div data-part style={{ ...MONO_LABEL, color: BUTTER_DARK }}>You are in</div>
          <h1 data-part style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-3xl)', lineHeight: 1.08, letterSpacing: '-0.01em', color: INK, textAlign: 'center', marginTop: -10, textWrap: 'balance' }}>
            {name} is on the team.
          </h1>
          <p data-part style={{ fontSize: 'var(--text-md)', lineHeight: 1.5, color: 'var(--ink-soft)', textAlign: 'center', maxWidth: 320, marginTop: -6, textWrap: 'pretty' }}>
            Ten minutes a day, the two of you, and a phone that arrives when they are ready for it. Here is how a day works.
          </p>
        </div>
        <div style={{ padding: '12px 20px 28px', position: 'relative', maxWidth: 480, width: '100%', margin: '0 auto' }}>
          <button data-part style={BTN} onClick={() => go(0)}>Show me a day</button>
          <div style={{ ...QUIET_BTN, cursor: 'default' }}>{withRemind ? 'Eight' : 'Seven'} cards. One minute. Skip any time.</div>
        </div>
      </div>
    )
  }

  const isRemind = i >= total
  const card = isRemind ? REMIND_CARD(name) : cards[i]
  const stepCount = withRemind ? total + 1 : total
  const step = i + 1
  const last = isRemind || (!withRemind && i === total - 1)

  return (
    <div className="gc-welcome" style={SCREEN}>
      <style>{ZOOM_CSS}</style>
      {/* Progress and the way out, the same on every card. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px 0', maxWidth: 480, width: '100%', margin: '0 auto' }}>
        <div style={{ flex: 1, height: 8, borderRadius: 100, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.round((step / stepCount) * 100)}%`, background: BUTTER, borderRadius: 100, transition: 'width 0.45s ease-out' }} />
        </div>
        <div style={{ ...MONO_LABEL, letterSpacing: '0.06em', textTransform: 'none', whiteSpace: 'nowrap' }}>{step} of {stepCount}</div>
        <button type="button" onClick={() => finish('dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0 6px 6px', ...MONO_LABEL, letterSpacing: '0.06em', textTransform: 'none', color: 'var(--ink-light)' }}>
          Skip
        </button>
      </div>

      <div ref={stageRef} key={card.key} style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18, padding: '22px 20px 12px', maxWidth: 480, width: '100%', margin: '0 auto' }}>
        <div data-part style={{
          background: card.sceneBg ?? '#fff', border: '2px solid var(--ink)', borderRadius: 24,
          boxShadow: '0 4px 0 var(--ink)', padding: '18px 16px', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200,
        }}>
          {card.scene}
        </div>
        <div data-part style={MONO_LABEL}>{card.eyebrow}</div>
        <h2 data-part style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', lineHeight: 1.12, letterSpacing: '-0.01em', color: INK, marginTop: -8, textWrap: 'pretty' }}>
          {card.headline}
        </h2>
        <p data-part style={{ fontSize: 'var(--text-md)', lineHeight: 1.5, color: 'var(--ink-soft)', marginTop: -6, textWrap: 'pretty' }}>
          {card.body}
        </p>
        <div data-part style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'var(--tint-sage)', borderRadius: 16, padding: '12px 14px', marginTop: -2 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F8F6B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 8v0.5M12 11v5" /></svg>
          <div style={{ fontSize: 'var(--text-base)', lineHeight: 1.4, color: GREEN_DARK, fontWeight: 700 }}>{card.why}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '12px 20px 28px', maxWidth: 480, width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }} aria-hidden>
          {Array.from({ length: stepCount }, (_, k) => (
            <div key={k} style={{ width: k === i ? 22 : 8, height: 8, borderRadius: 100, background: k === i ? BUTTER : 'var(--border)', transition: 'width 0.3s ease' }} />
          ))}
        </div>
        {isRemind ? (
          notif === 'done' ? (
            <div style={{ ...BTN, background: GREEN, color: '#fff' }}>Done. DiGi will be there.</div>
          ) : (
            <>
              <button style={BTN} onClick={remind} disabled={notif === 'asking'}>{notif === 'asking' ? 'One second' : 'Yes, remind me'}</button>
              <button type="button" onClick={() => finish('checkin')} style={{ ...QUIET_BTN, marginTop: -6 }}>Not now, take me in</button>
            </>
          )
        ) : last ? (
          <button style={BTN} onClick={() => finish('checkin')}>Start with today’s check in</button>
        ) : (
          <button style={BTN} onClick={() => go(i + 1)}>{i === total - 1 ? 'Nearly there' : 'Next'}</button>
        )}
      </div>
    </div>
  )
}
