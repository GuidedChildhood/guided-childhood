import PassportOrderCard from '@/components/passport/PassportOrderCard'
import { StageEarnCard, StageDoneCard } from '@/components/passport/StageStickerCards'
import StickerPrintSheet from '@/components/passport/StickerPrintSheet'
import { stickerFor } from '@/lib/pathway/stage-stickers'
import { pageCount } from '@/lib/pathway/page-count'

// Layout harness for the passport stickers (17 November 2026). No auth, no
// data: Teo with Foundation stamped and Builder under way, so the order card,
// the earn card, the stage done card and the A4 sheet can be measured at 320,
// 390 and 1280 and printed without a family behind them.
// ?view=print shows the A4 sheet alone, leading with Pebble.
export default async function Page({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams
  if (view === 'print') return <StickerPrintSheet kid="Teo" stamped={[1]} focus={1} />
  const count = pageCount({ lessonsDone: 4, lessonsTotal: 9, scriptsDone: 2, scriptsTotal: 3 }, false)
  return (
    <div style={{ padding: '20px', maxWidth: 640, margin: '0 auto' }}>
      <StageDoneCard s={stickerFor(1)!} kid="Teo" printHref="#" />
      <StageEarnCard s={stickerFor(2)!} count={count} kid="Teo" along={[
        { key: 'moments', value: '3', label: 'moments sorted', href: '#' },
        { key: 'stars', value: '14', label: 'stars earned this week', href: '#' },
        { key: 'offscreen', value: '95 min', label: 'off screen this week', href: '#' },
        { key: 'balance', value: '410 of 630', label: 'screen minutes this week, against the healthy amount', href: '#' },
        { key: 'jobs', value: '3', label: 'days of jobs in a row', href: '#' },
      ]} />
      <PassportOrderCard kid="Teo" childId={null} stamped={[1]} />
    </div>
  )
}
