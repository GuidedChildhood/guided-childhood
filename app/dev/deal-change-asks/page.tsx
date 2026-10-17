import DealChangeAsks from '@/components/deal/DealChangeAsks'

// Dev fixture: the grown up's card for a child's ask to change the deal
// (migration 381). The card fetches its own asks from /api/deal-change, so the
// states are driven from outside by intercepting that route in the browser
// check, the same pattern as /dev/school-letterbox, rather than by a prop that
// would only ever exist for this page. Unauthenticated, the route answers 401
// and the card stays silent, which is also the right thing to see.

export default function DealChangeAsksFixture() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <DealChangeAsks />
      </div>
    </div>
  )
}
