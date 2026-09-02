'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import KidPassport from '@/components/kid/KidPassport'
import KidWinPop, { type Win } from '@/components/kid/KidWinPop'
import type { KidSticker } from '@/components/kid/KidStickers'
import { STICKERS, sortedSticker, stickerArt } from '@/lib/stickers/catalog'

// Dev only fixture: the child's passport with every page, and the sorted win.
//
//   /dev/kid-passport            the passport takeover, a few weeks in
//   /dev/kid-passport?cheer=1    the once only sticker pop for the new stamp
//   /dev/kid-passport?win=1      the full screen win: a worry sorted, the
//                                Friend holding the stamp, Show me the stamp
//
// Built from the REAL catalog plus two of a family's worries, so the pages,
// earn lines and units are exactly what a child sees. Never reachable in
// production.

const STREAKS = 11
const CREDITS = 6
const SHEETS = 2
const LESSONS = 3

function have(rule: KidSticker['rule']): number {
  switch (rule.kind) {
    case 'friend': return STREAKS
    case 'streak': return STREAKS
    case 'credits': return CREDITS
    case 'sheets': return SHEETS
    case 'stamp': return rule.n === 1 ? LESSONS : 0
    case 'lessons': return LESSONS
    case 'sorted': return 0
  }
}
function need(rule: KidSticker['rule']): number {
  if (rule.kind === 'friend') return rule.streaks
  if (rule.kind === 'stamp') return rule.n === 1 ? 12 : 10
  return rule.n
}

const BASE: KidSticker[] = STICKERS.map(s => ({
  key: s.key, name: s.name, emoji: s.emoji, art: stickerArt(s),
  colour: s.colour, rule: s.rule, earn: s.earn,
  have: Math.min(have(s.rule), need(s.rule)),
  need: need(s.rule),
  earned: s.rule.kind === 'stamp' ? false : have(s.rule) >= need(s.rule),
}))

const WORRIES = [
  { id: 'car', label: 'Phones in the car', stars: 5, sorted: true },
  { id: 'bed', label: 'Screens at bedtime', stars: 3, sorted: false },
  { id: 'off', label: 'Will not put it down', stars: 2, sorted: false },
]

const FIXTURE: KidSticker[] = [
  ...BASE,
  ...WORRIES.map(w => {
    const s = sortedSticker(w)
    return { key: s.key, name: s.name, emoji: s.emoji, art: null, colour: s.colour, rule: s.rule, earn: s.earn, have: w.stars, need: 5, earned: w.sorted }
  }),
]

const SORTED_WIN: Win = {
  kind: 'sorted', key: 'car', value: 5,
  label: 'Phones in the car: sorted',
  detail: 'Your grown up gave it five stars. That was you. It is stamped in your passport.',
  character: 'bloop', earnedOn: '2026-09-02',
}

export default function KidPassportFixture() {
  if (process.env.NODE_ENV === 'production') notFound()
  const [q, setQ] = useState<URLSearchParams | null>(null)
  const [open, setOpen] = useState(true)
  const [win, setWin] = useState(false)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    setQ(p)
    setWin(p.get('win') === '1')
  }, [])
  if (!q) return null
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--kid-bg)', fontFamily: 'var(--font-body)' }}>
      {win && (
        <KidWinPop token="0123456789abcdef01" wins={[SORTED_WIN]} onDone={() => setWin(false)} onOpenBook={() => { setWin(false); setOpen(true) }} />
      )}
      {open && !win && (
        <KidPassport
          onClose={() => setOpen(false)}
          token="0123456789abcdef01"
          childName="Alfie"
          stickers={FIXTURE}
          celebrateStickers={q.get('cheer') === '1' ? ['sorted-car'] : []}
          passportCode="GC-1JZX-KKXD"
          stageId={1}
        />
      )}
      {!open && !win && <button onClick={() => setOpen(true)} style={{ margin: 20 }}>Open passport</button>}
    </div>
  )
}
