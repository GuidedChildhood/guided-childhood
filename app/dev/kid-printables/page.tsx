'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import KidPrintables from '@/components/kid/KidPrintables'
import KidPrintPage from '@/components/kid/KidPrintPage'
import BucketBuilder from '@/app/(dashboard)/dashboard/printables/builder/BucketBuilder'
import HappyNews, { type HappyNewsItem } from '@/components/celebrate/HappyNews'
import { printablesForStage, getPrintable } from '@/lib/printables/registry'
import { resolveTheme } from '@/lib/kid/theme'

// Dev only fixture: the child's printables, every state, without a kid link
// or a service key, so Playwright can screenshot and tap the lot.
//
//   /dev/kid-printables                 the tab (stage 2, Bloop's age)
//   /dev/kid-printables?stage=4         the tab at Jonny's age
//   /dev/kid-printables?locked=1        the free tier: padlock stickers
//   /dev/kid-printables?open=<key>      the tab with one sheet open
//   /dev/kid-printables?view=bucket     the bucket list builder, child variant
//   /dev/kid-printables?view=print      the print page, bucket list, no dialog
//   /dev/kid-printables?view=sheet      the print page, a sheet, no dialog
//
// The query is read after mount so the first client paint matches the
// server's. Never reachable in production.

export default function KidPrintablesFixture() {
  if (process.env.NODE_ENV === 'production') notFound()
  const [q, setQ] = useState<URLSearchParams | null>(null)
  const [news, setNews] = useState<HappyNewsItem | null>(null)
  const [log, setLog] = useState<string[]>([])
  useEffect(() => { setQ(new URLSearchParams(window.location.search)) }, [])
  if (!q) return null

  const view = q.get('view') ?? 'tab'
  const stage = Number(q.get('stage') ?? 2)
  const locked = q.get('locked') === '1'
  const theme = resolveTheme(null)
  const token = 'fixture'

  if (view === 'bucket') {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--cream)', fontFamily: 'var(--font-body)' }}>
        <BucketBuilder variant="kid" kidToken={token} defaultChildName="Alfie" backHref="/dev/kid-printables" backLabel="Printables" />
      </div>
    )
  }
  if (view === 'print') {
    return (
      <KidPrintPage
        token={token}
        job={{ kind: 'bucket', title: 'My Bucket List', childName: 'Alfie', picked: [
          { emoji: '🚲', text: 'Family bike ride' }, { emoji: '🪁', text: 'Fly a kite' }, { emoji: '🍪', text: 'Bake together' },
          { emoji: '📚', text: 'Read a whole book' }, { emoji: '⭐', text: 'Sleep in the garden' },
        ] }}
      />
    )
  }
  if (view === 'sheet') {
    const p = getPrintable(q.get('key') ?? 'kindness-bucket-list')
    if (!p) return <p style={{ padding: 20 }}>No such sheet.</p>
    return (
      <KidPrintPage
        token={token}
        job={{ kind: 'sheet', key: p.key, sheet: { url: p.sheetUrl, title: p.title, extraUrls: p.extraSheetUrls, heading: p.sheetHeading, writeIn: p.writeIn } }}
      />
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg, padding: '18px 16px 60px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <KidPrintables
          token={token}
          childName="Alfie"
          printables={printablesForStage(stage)}
          asks={[{ id: 'a1', title: 'Please can I do the My Reading Bucket List printable', emoji: '📚', status: 'added' }]}
          submitAsk={(title, emoji) => setLog(l => [...l, `${emoji} ${title}`])}
          printablesUnlocked={!locked}
          sheetsDone={Number(q.get('done') ?? 0)}
          sheetStars={Number(q.get('done') ?? 0) * 5}
          onHappyNews={setNews}
          initialStatuses={{ 'nature-scavenger-hunt': 'confirmed', 'rainy-day-bucket-list': 'pending' }}
          fetchStatuses={false}
          openKey={q.get('open')}
        />
        {log.length > 0 && <pre data-log style={{ color: '#fff', fontSize: 12, whiteSpace: 'pre-wrap' }}>{log.join('\n')}</pre>}
      </div>
      {news && <HappyNews item={news} onClose={() => setNews(null)} />}
    </div>
  )
}
