import PathwayComplete from '@/components/pathway/PathwayComplete'

// Dev fixture for the end of the road.
//
// This one genuinely cannot be seen any other way. No family has five stamps
// yet, and the earliest that can happen is years out, so without a harness the
// completion card would ship having never been looked at by anybody. That is
// the exact situation the dev fixtures exist for.
//
// The confetti only fires on a browser that has not seen it. To watch it again:
// localStorage.removeItem('gc.pathway.complete.seen') and reload.

export default function PathwayCompleteFixture() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <PathwayComplete childName="Teo" />
        {/* Again with no name, the state for a family who never set one. */}
        <div style={{ marginTop: 28 }}>
          <PathwayComplete childName={null} />
        </div>
      </div>
    </div>
  )
}
