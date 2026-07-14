'use client'

import { useState } from 'react'

// The one Lessons hub, expert flow: a segmented control at the top switches
// between doing lessons together (the watch together videos and the
// interactive library) and sending a lesson to the child's device. Both
// views are rendered by the server and simply shown or hidden here, so the
// whole page is one place with no navigation away.

export default function LessonsTabs({
  together,
  send,
  childName,
}: {
  together: React.ReactNode
  send: React.ReactNode
  childName: string
}) {
  const [tab, setTab] = useState<'together' | 'send'>('together')

  const TABS: { key: 'together' | 'send'; label: string }[] = [
    { key: 'together', label: 'Do together' },
    { key: 'send', label: `Send to ${childName}` },
  ]

  return (
    <div>
      <div style={{
        display: 'flex', gap: '4px', background: 'rgba(247,244,238,0.8)',
        border: '1px solid rgba(26,26,46,0.06)', borderRadius: '100px', padding: '4px',
        marginBottom: '22px', width: '100%', maxWidth: '360px',
      }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: '10px 12px', borderRadius: '100px', border: 'none', cursor: 'pointer',
              background: tab === t.key ? 'var(--deep-teal)' : 'transparent',
              color: tab === t.key ? '#fff' : 'var(--ink-soft)',
              fontFamily: 'var(--font-display)', fontSize: '13.5px', fontWeight: 800, letterSpacing: '-0.006em',
              boxShadow: tab === t.key ? '0 2px 8px -1px rgba(23,60,70,0.4)' : 'none',
              transition: 'background 0.2s ease, color 0.2s ease',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: tab === 'together' ? 'block' : 'none' }}>{together}</div>
      <div style={{ display: tab === 'send' ? 'block' : 'none' }}>{send}</div>
    </div>
  )
}
