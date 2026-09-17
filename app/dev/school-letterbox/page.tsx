import SchoolLetterbox from '@/components/school/SchoolLetterbox'

// Dev fixture for the letterbox setup, so every state can be looked at on a
// phone and a laptop without a real school email and a real forwarding rule.
//
// The component fetches its own connection from /api/school/connect, which is
// the right shape for the product and an awkward one for a fixture. So this
// page renders it bare and the states are driven from outside by intercepting
// that route in the browser check (e2e and the Playwright pass), rather than by
// giving the component a prop it would only ever use here. A prop that exists
// for the fixture is a prop that can drift from the real path, and this screen
// is one a parent sees exactly once, which is precisely when it has to be right.
//
// Unauthenticated, the API answers 401 and this shows the offer state, which is
// the screen a parent actually meets first.

export default function SchoolLetterboxFixture() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <SchoolLetterbox />
      </div>
    </div>
  )
}
