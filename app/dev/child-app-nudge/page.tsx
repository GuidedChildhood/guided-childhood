import ChildAppNudge from '@/components/home/ChildAppNudge'

// Layout harness for the Home set up nudge. No auth, no data: just the card at
// a real phone width so the swipe rail and the folded line can be checked.
export default function Page() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '24px 0' }}>
      <ChildAppNudge childName="Teo" childId={null} />
    </main>
  )
}
