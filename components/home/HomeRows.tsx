'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NOTIFS_CHANGED_EVENT } from '@/components/dashboard/NotificationsBell'

// Everything that is not today's loop, folded to big friendly rows: Family
// quests (with the live approve count riding as a badge), the road to 16 (with
// the stamp position), and Ask DiGi. Sundays add the week round up row. Big
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
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0,
        }}>{emoji}</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', lineHeight: 1.2 }}>{title}</span>
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink-muted)', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta}</span>
        </span>
        {badge && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, flexShrink: 0,
            background: urgent ? '#E5484D' : 'var(--tint-blue)', color: urgent ? '#fff' : 'var(--ink)',
            borderRadius: '100px', padding: '5px 11px',
          }}>{badge}</span>
        )}
        <span aria-hidden style={{ color: 'var(--ink-muted)', fontWeight: 800, flexShrink: 0 }}>›</span>
      </div>
    </Link>
  )
}

export default function HomeRows({ stageName, stageNum, handoverChildName, isSunday, criticalWindow = false, initialToApprove }: {
  stageName: string
  stageNum: number
  handoverChildName?: string | null
  isSunday: boolean
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

      {/* The handover moment: an eight year old can run their own side.
          Shown only while no kid link exists, then it steps back for good. */}
      {handoverChildName && (
        <Link href="/dashboard/quests?tab=share" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
            borderRadius: '14px', padding: '11px 14px', marginTop: '-4px',
          }}>
            <span aria-hidden style={{ fontSize: '20px', flexShrink: 0 }}>📲</span>
            <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.45 }}>
              {handoverChildName} can tick their own jobs now. Share the QR code to hand them their side.
            </span>
            <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--terracotta-dark)', whiteSpace: 'nowrap' }}>
              Share →
            </span>
          </div>
        </Link>
      )}

      <SlimRow
        href="/dashboard/pathway"
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

      {/* Sunday only: the week round up appears as one extra row, nothing
          else on this screen changes day to day. */}
      {isSunday && (
        <SlimRow
          href="/dashboard/week"
          emoji="🗞️"
          title="Your week, rounded up"
          meta="The balance, the wins, and one thing to try next"
        />
      )}
    </div>
  )
}
