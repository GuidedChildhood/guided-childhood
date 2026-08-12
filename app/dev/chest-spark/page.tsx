import SchoolChest from '@/components/pathway/SchoolChest'

// Dev fixture for the shooting star on the school chest.
//
// Justin: "I want it sparking next to the pathway, like a shooting star."
//
// Animation is the one thing you cannot verify by reading the code, and this is
// the only way to watch it without a real family's pathway in front of you.
//
// The chest remembers being opened in localStorage and the spark only runs while
// it is closed, which is the whole design. To watch it again:
//   localStorage.removeItem('gc.schoolchest.opened')
// then reload.

export default function ChestSparkFixture() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <SchoolChest childName="Teo" yearLabel="Year 4, Autumn term" />
      </div>
    </div>
  )
}
