import SchoolCatch from '@/components/school/SchoolCatch'

// Dev fixture for snap it or paste it.
//
// The states worth looking at are driven by what /api/school/catch returns, so
// the browser check intercepts that route rather than this page feeding the
// component props it would never get in the product. Unauthenticated, the API
// answers 401 and the card sits in its resting state, which is the screen a
// parent meets first.

export default function SchoolCatchFixture() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <SchoolCatch />
      </div>
    </div>
  )
}
