'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Feature discovery. Two jobs in one calm card:
//  1. On the first couple of logins, prime the two things that make the app
//     an app: add to the home screen, and turn on check ins.
//  2. After that, every few logins, surface ONE feature the parent may not
//     have found yet, rotating through the whole platform, so the sections
//     that are no longer tabs still get discovered inside the journey.
// One card at a time, dismissable, never the same tip twice, and it goes
// quiet once a tip is seen or the feature is known done.

type Tip = {
  key: string
  q: string
  body: string
  cta: string
  href: string | null // null = the install tip, which shows instructions inline
}

const TIPS: Tip[] = [
  { key: 'install', q: 'Add this to your home screen', body: 'Then it opens like a real app, full screen and offline. It also lets the check in nudges reach your phone.', cta: 'Show me how', href: null },
  { key: 'notifications', q: 'Turn on check ins', body: 'Three gentle nudges a day at the moments your child faces screens, and the school reminders the night before.', cta: 'Turn them on', href: '/dashboard#turn-on-check-ins' },
  { key: 'lesson', q: 'Send or co-watch a lesson', body: 'Send a real lesson to your child’s phone, or if they have no phone yet, watch it together. The quiz at the end pays them stars.', cta: 'Try a lesson', href: '/dashboard/quests' },
  { key: 'moments', q: 'Try the moment cards', body: 'The exact words for bedtime, the handover, the meltdown. Tap the moment, get the words to say right now.', cta: 'Open moments', href: '/dashboard/moments' },
  { key: 'scripts', q: 'Try the scripts', body: 'Word for word scripts for the hard conversations, from first tablet to first phone, matched to your child’s age.', cta: 'Open scripts', href: '/dashboard/scripts' },
  { key: 'quests', q: 'Set up the star quests', body: 'Everyday jobs earn stars, and stars buy the screen time you agree. They tick, you approve, and the kids love it.', cta: 'Set up quests', href: '/dashboard/quests' },
  { key: 'games', q: 'Try the learning games', body: 'Age matched games your child plays from their own link, that teach as they play.', cta: 'See the games', href: '/dashboard/quests?tab=games' },
]

const STORE = 'gc_feature_tour'
const SESSION_GUARD = 'gc_feature_tour_counted'

export default function FeatureDiscovery({ done = [] }: { done?: string[] }) {
  const [tip, setTip] = useState<Tip | null>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    let state: { seen: Record<string, number>; count: number }
    try { state = JSON.parse(localStorage.getItem(STORE) || '') } catch { state = { seen: {}, count: 0 } }
    if (!state || typeof state.count !== 'number') state = { seen: {}, count: 0 }

    // Count one login per browser session, so opening pages does not inflate it.
    if (!sessionStorage.getItem(SESSION_GUARD)) {
      state.count += 1
      sessionStorage.setItem(SESSION_GUARD, '1')
      localStorage.setItem(STORE, JSON.stringify(state))
    }

    // Skip tips already done: server known (push, quests, lesson), plus the
    // two we can read here, installed and notifications already granted.
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as unknown as { standalone?: boolean }).standalone === true
    const notifGranted = 'Notification' in window && Notification.permission === 'granted'
    const skip = new Set<string>(done)
    if (standalone) skip.add('install')
    if (notifGranted) skip.add('notifications')

    const next = TIPS.find(t => !state.seen[t.key] && !skip.has(t.key))
    // First two logins prime install and notifications, then at most one tip
    // per day, so the whole platform is met inside the first week without a
    // single wall of features. Quiet once a tip has shown today.
    const today = new Date().toDateString()
    const due = state.count <= 2 || (state as { lastTipDay?: string }).lastTipDay !== today
    if (next && due) {
      ;(state as { lastTipDay?: string }).lastTipDay = today
      localStorage.setItem(STORE, JSON.stringify(state))
    }
    if (next && due) {
      setIsIOS(/iphone|ipad|ipod/i.test(window.navigator.userAgent))
      setTip(next)
    }
  }, [done])

  if (!tip) return null

  const dismiss = () => {
    try {
      const state = JSON.parse(localStorage.getItem(STORE) || '{"seen":{},"count":0}')
      state.seen[tip.key] = Date.now()
      localStorage.setItem(STORE, JSON.stringify(state))
    } catch { /* fine */ }
    setTip(null)
  }

  return (
    <div style={{
      background: 'var(--deep-teal)', borderRadius: '18px',
      padding: '18px 20px', marginBottom: '20px', position: 'relative', color: '#fff',
    }}>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '18px', cursor: 'pointer', lineHeight: 1, padding: 4 }}
      >
        ×
      </button>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
        Have you tried
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', lineHeight: 1.2, marginBottom: '6px', paddingRight: '20px' }}>
        {tip.q}
      </div>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.55, margin: '0 0 14px' }}>
        {tip.body}
      </p>

      {tip.href === null && showInstall && (
        <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '13px 15px', marginBottom: '14px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.92)', lineHeight: 1.55, margin: 0 }}>
            {isIOS
              ? 'Tap the Share button at the bottom of Safari (the square with an arrow), scroll down, then tap Add to Home Screen.'
              : 'Open your browser menu (the three dots), then tap Install app or Add to Home screen.'}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {tip.href === null ? (
          <button
            onClick={() => setShowInstall(true)}
            style={{ background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '12px', padding: '11px 18px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', cursor: 'pointer', boxShadow: '0 3px 0 var(--terracotta-dark)' }}
          >
            {tip.cta}
          </button>
        ) : (
          <Link
            href={tip.href}
            onClick={dismiss}
            style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '12px', padding: '11px 18px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', boxShadow: '0 3px 0 var(--terracotta-dark)' }}
          >
            {tip.cta}
          </Link>
        )}
        <button
          onClick={dismiss}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em' }}
        >
          Not now
        </button>
      </div>
    </div>
  )
}
