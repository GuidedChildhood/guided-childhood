import Link from 'next/link'

// Harness for the device guide button pair. No auth.
// The real one is on /dashboard/devices behind a login.
export default function Page() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: 20 }}>
      <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18, padding: 16, maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-gold" style={{ flex: 1, minWidth: '140px', justifyContent: 'center', fontSize: '15px' }}>
            Mark as set up
          </button>
          <Link href="#" className="btn btn-outline" style={{ flex: 1, minWidth: '140px', justifyContent: 'center', fontSize: '15px' }}>
            Ask DiGi to help
          </Link>
        </div>
      </div>
    </main>
  )
}
