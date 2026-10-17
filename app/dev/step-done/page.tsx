import { Suspense } from 'react'
import BackToToday from '@/components/home/BackToToday'

// Dev only fixture: the Done bar a parent sees on DiGi or the passport job
// when the path sent them there. Open with ?from=today&step=digi or
// ?from=today&step=passport. The tap posts for real, so on a fixture with no
// session it shows the "did not save" line, which is the other state worth
// looking at.
export default function StepDoneFixture() {
  return (
    <main style={{ background: 'var(--app-bg)', minHeight: '100vh', paddingTop: 8 }}>
      <Suspense fallback={null}><BackToToday /></Suspense>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: 20, minHeight: 300 }}>
          <p style={{ margin: 0, color: 'var(--ink-soft)' }}>The page the path sent them to sits here.</p>
        </div>
      </div>
    </main>
  )
}
