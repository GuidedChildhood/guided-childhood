import KidStickers, { type KidSticker } from '@/components/kid/KidStickers'
import { STICKERS, stickerArt } from '@/lib/stickers/catalog'

// Layout fixture for the child's sticker book, which otherwise only renders
// behind a kid token. Built from the REAL catalog rather than a hand written
// list, so the eighteen slots, their earn lines and their page grouping are
// exactly what a child sees, and adding a sticker shows up here for free.
//
// 404s in production via middleware, like every other ref-* page.

export const dynamic = 'force-dynamic'

// A believable few weeks in: eleven completed days, six credits, two sheets,
// no stage stamped yet. That puts Pebble and Bloop home, First Save and First
// Sheet earned, and everything else part way with a live bar, which is the
// state worth looking at.
const STREAKS = 11
const CREDITS = 6
const SHEETS = 2
const STAMPS = 0

function have(rule: KidSticker['rule']): number {
  switch (rule.kind) {
    case 'friend': return STREAKS
    case 'streak': return STREAKS
    case 'credits': return CREDITS
    case 'sheets': return SHEETS
    case 'stamp': return STAMPS
  }
}
function need(rule: KidSticker['rule']): number {
  return rule.kind === 'friend' ? rule.streaks : rule.n
}

const FIXTURE: KidSticker[] = STICKERS.map(s => ({
  key: s.key, name: s.name, emoji: s.emoji, art: stickerArt(s),
  colour: s.colour, rule: s.rule, earn: s.earn,
  have: Math.min(have(s.rule), need(s.rule)),
  need: need(s.rule),
  earned: have(s.rule) >= need(s.rule),
}))

export default function RefStickerBookPage() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '20px 16px' }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <KidStickers token="0123456789abcdef01" stickers={FIXTURE} celebrate={[]} />
      </div>
    </main>
  )
}
