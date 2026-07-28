import HomeMain from '@/components/home/HomeMain'

// Layout harness for Home's five tiles and the Everything else door. No auth.
export default function Page() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: 20, maxWidth: 760, margin: '0 auto' }}>
      <HomeMain />
    </main>
  )
}
