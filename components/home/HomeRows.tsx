'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NOTIFS_CHANGED_EVENT } from '@/components/dashboard/NotificationsBell'
import HappyIcon, { type HappyIconName } from '@/components/kid/HappyIcon'
import { CRAYON } from '@/components/printables/drawn/HappyPaper'

// Everything that is not today's loop, folded to big friendly rows: Family
// quests (with the live approve count riding as a badge), the road to 16 (with
// the stamp position), Ask DiGi, and the week round up. Big
// icon tiles, chunky borders, one tap each: the folded half of the simplified
// Home the sample page agreed.

// The happy news finish (plans/week-of-2026-08-31-parent-happy-news-plan.md):
// ink edge, hard ledge, a drawn icon in a crayon well instead of an emoji.
function SlimRow({ href, icon, tint, title, meta, badge, urgent }: {
  href: string; icon: HappyIconName; tint: string; title: string; meta: string; badge?: string | null; urgent?: boolean
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block', minWidth: 0 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '13px', minWidth: 0, overflow: 'hidden',
        background: '#fff', border: `2px solid ${urgent ? '#E5484D' : 'var(--ink)'}`,
        borderRadius: '18px', padding: '12px 15px 12px 12px',
        boxShadow: `0 4px 0 ${urgent ? '#B93B3F' : 'var(--ink)'}`,
      }}>
        <span aria-hidden style={{
          width: 52, height: 52, borderRadius: '50%', background: tint, border: '2px solid var(--ink)', boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}><HappyIcon name={icon} size={34} /></span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2 }}>{title}</span>
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-muted)', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta}</span>
        </span>
        {badge && (
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 900, flexShrink: 0,
            background: urgent ? '#E5484D' : 'var(--terracotta)', color: urgent ? '#fff' : 'var(--ink)',
            border: '2px solid var(--ink)', borderRadius: '100px', padding: '4px 10px',
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
        icon="jobs" tint={CRAYON.butter}
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
        href="/dashboard/pathway"
        icon="passport" tint={CRAYON.sky}
        title="The road to 16"
        meta={`${stageName} stage · stamp ${stageNum} of 5 on the way${criticalWindow ? ' · critical window' : ''}`}
      />

      <SlimRow
        href="/dashboard/digi"
        icon="tell" tint={CRAYON.paper}
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
        icon="calendar" tint={CRAYON.green}
        title="Your week, rounded up"
        meta="The balance, the wins, and one thing to try next"
      />
    </div>
  )
}
