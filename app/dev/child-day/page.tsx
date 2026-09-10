import ChildDayStrip from '@/components/daily/ChildDayStrip'
import type { TodayState } from '@/lib/kid/today-state'

// The child's day on the parent's Home, in the three states a parent meets it.
//
// The real strip needs a family, a linked child and a day part done, which is
// why a row like this can ship reading beautifully in one state and wrong in
// the other two. Here they are side by side, on a phone width.

export const dynamic = 'force-static'

const BASE: TodayState = {
  day: '2026-09-10',
  steps: ['jobs', 'lesson', 'reading', 'move', 'ask'],
  done: [],
  left: 5,
  complete: false,
  stickerToday: false,
  stickersEver: 0,
  leftLabels: [],
}

const STATES: { label: string; note: string; state: TodayState }[] = [
  {
    label: 'Not opened yet',
    note: 'Morning, or a child who has not picked their phone up. Plain white and plainly said, so it is information rather than a telling off.',
    state: { ...BASE, steps: [], left: 0 },
  },
  {
    label: 'Going',
    note: 'The ordinary state of a day at four o clock. Butter, never amber, and it names what is left so a parent can act on it.',
    state: {
      ...BASE,
      done: ['jobs', 'lesson', 'reading'],
      left: 2,
      leftLabels: ['Time outside', 'Ask a grown up something'],
      stickersEver: 6,
    },
  },
  {
    label: 'Done, sticker earned',
    note: 'The slot the parent has been watching all day, filled.',
    state: {
      ...BASE,
      done: ['jobs', 'lesson', 'reading', 'move', 'ask'],
      left: 0,
      complete: true,
      stickerToday: true,
      stickersEver: 7,
    },
  },
]

export default function DevChildDay() {
  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '24px 16px 60px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 18px',
        }}>
          Reference · their day on your Home
        </p>
        {STATES.map(s => (
          <section key={s.label} style={{ marginBottom: 26 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 4px' }}>
              {s.label}
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', margin: '0 0 10px', lineHeight: 1.5 }}>
              {s.note}
            </p>
            <ChildDayStrip state={s.state} childName="Nia" onApp />
          </section>
        ))}
      </div>
    </main>
  )
}
