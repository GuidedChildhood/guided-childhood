import { notFound } from 'next/navigation'
import StarChartSheet from '@/components/printables/StarChartSheet'
import SchoolWeekSheet from '@/components/printables/SchoolWeekSheet'

// The free family week pack, as it prints (17 November 2026). The star chart
// and Our school week, both blank for a pen, then the gold stars to cut out.
// Never a public page: like the other print-free routes it 404s on the live
// deployment. Chromium prints this to public/printables/free/family-week-a4.pdf
// and the preview images the /free/family-week page shows.

export const metadata = { title: 'The family week pack' }

export default function PrintFamilyWeek() {
  if (process.env.VERCEL_ENV === 'production') notFound()
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: 16, background: 'var(--white)' }}>
      <StarChartSheet name="" weekLabel={null} jobs={[
        { emoji: '📺', text: 'TV waits till I am dressed and fed', stars: 2 },
        { emoji: '👟', text: 'Hair done, shoes on, at the door on time', stars: 2 },
        { emoji: '📖', text: 'Reading done and record signed', stars: 2 },
        { emoji: '✏️', text: 'Homework done and shown to a grown up', stars: 2 },
        { emoji: '🛏️', text: 'Room reset: floor clear before tea', stars: 2 },
      ]} extraPage={<SchoolWeekSheet kids={[]} weekLabel={null} />} />
    </div>
  )
}
