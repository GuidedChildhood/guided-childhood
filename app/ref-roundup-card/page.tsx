import WeeklyReviewCard from '@/components/digi/WeeklyReviewCard'

// Layout fixture for the round up nudge at the top of Home. The card fetches
// /api/digi/weekly-review itself, so the checking harness stubs that route.
// 404s in production via middleware, like every other ref-* page.

export default function RefRoundupCard() {
  return (
    <main style={{ background: 'var(--butter)', minHeight: '100vh', padding: '20px 16px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <WeeklyReviewCard />
      </div>
    </main>
  )
}
