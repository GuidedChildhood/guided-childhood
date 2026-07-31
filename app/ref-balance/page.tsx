import BalanceReport from '@/components/balance/BalanceReport'
import { buildParentReport } from '@/lib/balance/parent-report'

// Layout fixture for the balance report on the stats page. Real component,
// real builder, invented minutes, so the spacing and hierarchy can be checked
// at 390 without a database. Add ?days=2 to see a week that is two days old,
// which is the case the per day figures used to get wrong. 404s in production
// via middleware, like every other ref-* page.

export default async function RefBalance({
  searchParams,
}: { searchParams: Promise<{ days?: string }> }) {
  const { days } = await searchParams
  const daysSoFar = Math.min(7, Math.max(1, Number(days) || 5))

  const report = buildParentReport({
    childName: 'Teo',
    ageBand: '9-11',
    deviceMinutes: [
      { device: 'iPad', minutes: 45 },
      { device: 'TV', minutes: 30 },
    ],
    offscreen: { activities: 92, stars: 163, minutes: 1365 },
    daysSoFar,
  })

  return (
    <main style={{ background: 'var(--butter)', minHeight: '100vh', padding: '20px 16px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <BalanceReport report={report} />
      </div>
    </main>
  )
}
