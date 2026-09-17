import SchoolPromoCard from '@/components/school/SchoolPromoCard'

// Dev fixture for the school offer card, in the state it takes the top of Home.
//
// It is a small card and the reason it has a fixture is the copy, not the
// layout: it now leads with the photo rather than with forwarding, and it sits
// somewhere people will actually read it, so the wording is the thing worth
// looking at on a phone rather than reasoning about in a diff.

export default function SchoolPromoFixture() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <SchoolPromoCard />
      </div>
    </div>
  )
}
