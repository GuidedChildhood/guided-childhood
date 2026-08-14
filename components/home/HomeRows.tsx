'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NOTIFS_CHANGED_EVENT } from '@/components/dashboard/NotificationsBell'

// Everything that is not today's loop, folded to big friendly rows: Family
// quests (with the live approve count riding as a badge), the road to 16 (with
// the stamp position), Ask DiGi, and the week round up. Big
// icon tiles, chunky borders, one tap each: the folded half of the simplified
// Home the sample page agreed.

function SlimRow({ href, emoji, title, meta, badge, urgent }: {
  href: string; emoji: string; title: string; meta: string; badge?: string | null; urgent?: boolean
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '13px',
        background: '#fff', border: `1.5px solid ${urgent ? '#E5484D' : 'var(--border)'}`,
        borderRadius: '16px', padding: '14px 15px',
        boxShadow: '0 3px 0 rgba(26,26,46,0.05)',
      }}>
        <span style={{
          width: 50, height: 50, borderRadius: '14px', background: 'var(--terracotta-lt)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)', flexShrink: 0,
        }}>{emoji}</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2 }}>{title}</span>
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-muted)', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta}</span>
        </span>
        {badge && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, flexShrink: 0,
            background: urgent ? '#E5484D' : 'var(--tint-blue)', color: urgent ? '#fff' : 'var(--ink)',
            borderRadius: '100px', padding: '5px 11px',
          }}>{badge}</span>
        )}
        <span aria-hidden style={{ color: 'var(--ink-muted)', fontWeight: 800, flexShrink: 0 }}>›</span>
      </div>
    </Link>
  )
}

export default function HomeRows({ stageName, stageNum, criticalWindow = false, initialToApprove }: {
  stageName: string
  stageNum: number
  criticalWindow?: boolean
  // Fixture only, for the reference pages: skips the live fetch.
  initialToApprove?: number
}) {
  // The live approve count on the quests row, from the same notifications
  // source the bell reads, refreshed when anything changes.
  const [toApprove, setToApprove] = useState(initialToApprove ?? 0)

  useEffect(() => {
    if (initialToApprove !== undefined) return
    let live = true
    const refresh = () => {
      fetch('/api/notifications')
        .then(r => r.json())
        .then(d => {
          if (!live) return
          const items: { kind: string; urgent: boolean }[] = d.items ?? []
          setToApprove(items.filter(i => i.urgent || i.kind === 'ask').length)
        })
        .catch(() => {})
    }
    refresh()
    const id = setInterval(refresh, 30000)
    window.addEventListener(NOTIFS_CHANGED_EVENT, refresh)
    return () => {
      live = false
      clearInterval(id)
      window.removeEventListener(NOTIFS_CHANGED_EVENT, refresh)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
      <SlimRow
        href="/dashboard/quests"
        emoji="🧹"
        title="Family quests"
        meta={toApprove > 0 ? 'A tick is waiting for you' : 'Jobs earn stars, stars buy screen time'}
        badge={toApprove > 0 ? `${toApprove} to approve` : null}
        urgent={toApprove > 0}
      />

      {/* The child app handover used to have a row here. It has gone, because
          it could never be anything but a second copy: it showed while no kid
          link existed, and ChildAppNudge higher up the same page shows while
          the child has not OPENED their app, which no-link always satisfies. So
          the two were never alternatives, they were the same message twice on
          one screen, plus a third time in DiGi's one next thing. ChildAppNudge
          owns it, which is what page.tsx already said it did. */}

      <SlimRow
        href="/dashboard/road"
        emoji="🛣️"
        title="The road to 16"
        meta={`${stageName} stage · stamp ${stageNum} of 5 on the way${criticalWindow ? ' · critical window' : ''}`}
      />

      <SlimRow
        href="/dashboard/digi"
        emoji="💬"
        title="Ask DiGi anything"
        meta="He knows your setup, your timer and your week"
      />

      {/* The permanent door to the round up. This was Sunday only, which meant
          a parent who dismissed the card, or simply looked on a Tuesday, had
          no way back to a round up that had already been written for them.
          The card at the top of Home is the nudge and it comes and goes; this
          row is the door and it stays. */}
      <SlimRow
        href="/dashboard/week"
        emoji="🗞️"
        title="Your week, rounded up"
        meta="The balance, the wins, and one thing to try next"
      />
    </div>
  )
}
