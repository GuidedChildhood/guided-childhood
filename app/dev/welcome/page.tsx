'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import WelcomeWalkthrough from '@/components/onboarding/WelcomeWalkthrough'

// Dev only fixture: the first welcome, without an account.
//
//   /dev/welcome              the celebration, then the eight cards
//   /dev/welcome?card=3       straight to card 3 (1 to 8), no celebration
//   /dev/welcome?noremind=1   the Settings revisit: seven cards, no reminder ask
//
// Playwright screenshots every card from here. Never reachable in production.

export default function WelcomeFixture() {
  if (process.env.NODE_ENV === 'production') notFound()
  const [q, setQ] = useState<URLSearchParams | null>(null)
  const [log, setLog] = useState<string[]>([])
  useEffect(() => { setQ(new URLSearchParams(window.location.search)) }, [])
  if (!q) return null
  const card = Number(q.get('card') ?? 0)
  const noRemind = q.get('noremind') === '1'
  return (
    <>
      <WelcomeWalkthrough
        key={String(card)}
        childName={q.get('name') ?? 'Alfie'}
        celebrate={card === 0}
        onFinish={dest => setLog(l => [...l, `finish:${dest}`])}
        onEnableNotifications={noRemind ? undefined : async () => { setLog(l => [...l, 'notify']); return true }}
      />
      {card > 0 && <SkipTo card={card} />}
      {log.length > 0 && <pre data-log style={{ position: 'fixed', bottom: 0, left: 0, fontSize: 12, background: '#fff', margin: 0, padding: 4 }}>{log.join('\n')}</pre>}
    </>
  )
}

// Taps Next until the asked for card is showing, the way a parent would.
function SkipTo({ card }: { card: number }) {
  useEffect(() => {
    let n = 1
    const id = setInterval(() => {
      if (n >= card) { clearInterval(id); return }
      const btn = Array.from(document.querySelectorAll('button')).find(b => /^(Next|Nearly there)$/.test(b.textContent?.trim() ?? ''))
      if (btn) { btn.click(); n += 1 }
    }, 350)
    return () => clearInterval(id)
  }, [card])
  return null
}
