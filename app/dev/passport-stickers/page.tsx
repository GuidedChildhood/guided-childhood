import PassportOrderCard from '@/components/passport/PassportOrderCard'
import { StageEarnCard, StageDoneCard } from '@/components/passport/StageStickerCards'
import StickerPrintSheet from '@/components/passport/StickerPrintSheet'
import { stickerFor } from '@/lib/pathway/stage-stickers'
import { pageCount } from '@/lib/pathway/page-count'
import RecordBook from '@/components/passport/RecordBook'
import type { RecordStage } from '@/lib/pathway/record-book-server'

// Layout harness for the passport stickers (17 November 2026). No auth, no
// data: Teo with Foundation stamped and Builder under way, so the order card,
// the earn card, the stage done card and the A4 sheet can be measured at 320,
// 390 and 1280 and printed without a family behind them.
// ?view=print shows the A4 sheet alone, leading with Pebble.
export default async function Page({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams
  if (view === 'print') return <StickerPrintSheet kid="Teo" stamped={[1]} focus={1} />
  if (view === 'record') {
    const L = (t: string, done: boolean, on: string | null = null) => ({ key: t, kind: 'lesson' as const, title: t, done, doneOn: on })
    const T = (t: string, done: boolean) => ({ key: t, kind: 'talk' as const, title: t, done, doneOn: done ? '2026-10-02T10:00:00Z' : null })
    const C = (done: boolean) => ({ key: 'check', kind: 'check' as const, title: 'The big check', done, doneOn: null })
    const stages: RecordStage[] = [
      { n: 1, stamped: true, rows: [L('Screens and kindness', true, '2026-09-12T10:00:00Z'), L('The screen never says stop', true, '2026-09-19T10:00:00Z'), L('Paws off, ask first', true, '2026-09-26T10:00:00Z'), T('When the tablet has to go off', true), C(true)] },
      { n: 2, stamped: false, rows: [L('Screen routines', true, '2026-10-20T10:00:00Z'), L('Gaming, time and spend', true, '2026-10-27T10:00:00Z'), L('How algorithms work', false), L('Privacy and reputation', false), L('Kind and safe online', false), L('When a machine talks like a friend', false), T('The bedroom rule', true), T('Earned time, not given time', false), C(false)] },
      { n: 3, stamped: false, rows: [L('Mood and screens', false), L('Spotting fakes', false), T('Your first group chat', false), C(false)] },
      { n: 4, stamped: false, rows: [L('Manipulation and persuasion', false), C(false)] },
      { n: 5, stamped: false, rows: [L('AI and your data', false), C(false)] },
    ]
    return <RecordBook kid="Teo" stages={stages} currentStage={2} qrSvg={null} />
  }
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
