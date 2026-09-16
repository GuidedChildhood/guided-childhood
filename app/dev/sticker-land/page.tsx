'use client'

import { useEffect, useState } from 'react'
import KidStickerLand from '@/components/kid/KidStickerLand'
import { STICKERS, stickerArt } from '@/lib/stickers/catalog'
import type { KidSticker } from '@/components/kid/KidStickers'

// Dev fixture: a sticker lands in the passport (14 September 2026).
//
//   /dev/sticker-land              First Lesson lands, Pebble holding it
//   /dev/sticker-land?key=jobs-1   any catalogue key
//   /dev/sticker-land?two=1        two in a row: Fresh Air then First Sheet
//   /dev/sticker-land?buddy=bloop  a different Friend holds it
//
// The seen post goes to the real route with a fixture token and 400s, which
// is fine: shown is spent on a real device, and here nothing is spent.

function toKid(key: string): KidSticker | null {
  const s = STICKERS.find(x => x.key === key)
  if (!s) return null
  return { key: s.key, name: s.name, emoji: s.emoji, art: stickerArt(s), colour: s.colour, earned: true, rule: s.rule, earn: s.earn, have: 1, need: 1 }
}

export default function StickerLandFixture() {
  const [list, setList] = useState<KidSticker[] | null>(null)
  const [buddy, setBuddy] = useState<string | null>(null)
  const [closed, setClosed] = useState<string | null>(null)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    setBuddy(q.get('buddy'))
    const keys = q.get('two') === '1' ? ['outside-1', 'sheets-1'] : [q.get('key') ?? 'lessons-1']
    setList(keys.map(toKid).filter((x): x is KidSticker => !!x))
  }, [])
  return (
    <main style={{ minHeight: '100dvh', background: 'var(--app-bg)', padding: '28px 20px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0 }}>
        Reference · a sticker lands
      </p>
      {closed && <p data-closed style={{ marginTop: 12, fontFamily: 'var(--font-display)', fontWeight: 800 }}>Closed: {closed}</p>}
      {list && list.length > 0 && !closed && (
        <KidStickerLand
          token="0123456789abcdef01"
          stickers={list}
          buddy={buddy}
          onClose={() => setClosed('later')}
          onOpenBook={() => setClosed('open the passport')}
        />
      )}
    </main>
  )
}
