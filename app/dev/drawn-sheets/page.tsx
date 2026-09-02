'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import DrawnPaper from '@/components/printables/drawn/DrawnPaper'
import { DRAWN_KEYS, isDrawnKey, type DrawnSpec } from '@/components/printables/drawn'
import { getPrintable } from '@/lib/printables/registry'

// Dev only fixture: the happy news device balance sheets.
//
//   /dev/drawn-sheets                 all six, scaled to a grid
//   /dev/drawn-sheets?key=helping-hand   one sheet at true size, for the
//                                     print test (one side of A4 from any
//                                     width) and the print media screenshot
//   /dev/drawn-sheets?key=...&blank=1 with no name and no numbers, the way
//                                     it prints for a family the app does
//                                     not know yet
//
// Never reachable in production.

const FACTS = { starMinutes: 5, coreMinutesDaily: 30, bedtime: { start: '20:00', end: '07:00' }, mealtimes: true, schoolHours: true }

export default function DrawnSheetsFixture() {
  if (process.env.NODE_ENV === 'production') notFound()
  const [q, setQ] = useState<URLSearchParams | null>(null)
  useEffect(() => { setQ(new URLSearchParams(window.location.search)) }, [])
  if (!q) return null
  const blank = q.get('blank') === '1'
  const spec = (key: DrawnSpec['key']): DrawnSpec => ({
    key, childName: blank ? '' : 'Alfie', stars: getPrintable(key)?.stars ?? 3, facts: blank ? {} : FACTS,
  })
  const one = q.get('key')
  if (isDrawnKey(one)) {
    return (
      <div style={{ background: '#fff', fontFamily: 'var(--font-body)' }}>
        <div style={{ maxWidth: 794, margin: '0 auto' }}>
          <DrawnPaper spec={spec(one)} />
        </div>
      </div>
    )
  }
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--app-bg)', padding: 20, fontFamily: 'var(--font-body)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
        {DRAWN_KEYS.map(k => (
          <a key={k} href={`/dev/drawn-sheets?key=${k}`} style={{ display: 'block', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 30px rgba(26,26,46,0.10)' }}>
            <DrawnPaper spec={spec(k)} />
          </a>
        ))}
      </div>
    </div>
  )
}
