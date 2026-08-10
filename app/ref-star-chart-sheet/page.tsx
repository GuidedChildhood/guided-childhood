import StarChartSheet from '@/components/printables/StarChartSheet'
import KidChartToolbar from '@/app/k/[token]/star-chart/KidChartToolbar'
import { KidStarChartHero } from '@/app/k/[token]/KidQuestScreen'
import FridgeChartLog from '@/components/quests/FridgeChartLog'

// Layout fixture for the star chart on both phones: the shared printable
// sheet in its three shapes, the child's toolbar above it, the hero card on
// the child's print tab, and the parent's end of week entry card. All REAL
// components with made up rows; the fake token means the print record POST
// quietly fails, which is fine for a layout check.
//
// 404s in production via middleware, like every other ref-* page.

export const dynamic = 'force-dynamic'

const FIVE_JOBS = [
  { emoji: '🛏️', text: 'Make my bed', stars: 1 },
  { emoji: '🐕', text: 'Feed the dog before school', stars: 2 },
  { emoji: '📚', text: 'Read with a grown up', stars: 3 },
  { emoji: '🍽️', text: 'Lay or clear the table', stars: 2 },
  { emoji: '⚽', text: 'One hour of outside play', stars: 3 },
]

const ELEVEN_JOBS = [
  ...FIVE_JOBS,
  { emoji: '👟', text: 'Shoes and coat away', stars: 1 },
  { emoji: '🪥', text: 'Brush my teeth, no fuss', stars: 1 },
  { emoji: '🧸', text: 'Tidy my toys away', stars: 1 },
  { emoji: '🗑️', text: 'Take the bins out', stars: 2 },
  { emoji: '🌱', text: 'Water the plants or the garden', stars: 3 },
  { emoji: '🍲', text: 'Help cook a whole meal', stars: 3 },
]

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '40px 0 12px' }}>
      {children}
    </p>
  )
}

export default function RefStarChartSheet() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--app-bg)', padding: '20px 16px 80px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', margin: 0 }}>
          ref: star chart on both phones
        </h1>

        <Label>Child print tab hero card (KidQuestScreen print tab)</Label>
        <KidStarChartHero token="000000000000000000" />

        <Label>Child toolbar, with jobs</Label>
        <KidChartToolbar token="000000000000000000" weekStart="2026-08-10" hasJobs />

        <Label>Child toolbar, no jobs yet</Label>
        <KidChartToolbar token="000000000000000000" weekStart="2026-08-10" hasJobs={false} />

        <Label>Parent end of week entry (two children)</Label>
        <FridgeChartLog kids={[{ id: 'a', name: 'Teo' }, { id: 'b', name: 'Alma' }]} />

        <Label>The sheet: five real jobs, named and dated (scrolls sideways on a narrow phone, like the child page)</Label>
        <div style={{ overflowX: 'auto' }}><div style={{ minWidth: 560 }}>
          <StarChartSheet name="Teo" weekLabel="Monday 10 August" jobs={FIVE_JOBS} />
        </div></div>

        <Label>The sheet: no jobs, all pen rows</Label>
        <div style={{ overflowX: 'auto' }}><div style={{ minWidth: 560 }}>
          <StarChartSheet name="" weekLabel={null} jobs={[]} />
        </div></div>

        <Label>The sheet: a full eleven rows, undated</Label>
        <div style={{ overflowX: 'auto' }}><div style={{ minWidth: 560 }}>
          <StarChartSheet name="Alma" weekLabel={null} jobs={ELEVEN_JOBS} />
        </div></div>
      </div>
    </div>
  )
}
