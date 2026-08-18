import { Suspense } from 'react'
import ChildRail from '@/components/children/ChildRail'

// Layout fixture for the child switcher rail that now lives in the dashboard
// layout. Real component, invented children, so the pills can be checked at 390
// and 1280 without a login and without a second child on the live account.
//
// The rail only draws itself on a per child route, so this page passes through
// the real component with a pathname it accepts. Add ?kids=3 for a third child,
// which is the case that wraps on a narrow phone.
//
// 404s in production via middleware, like every other ref- page.

const KIDS = [
  { id: 'a', name: 'Teo', is_primary: true },
  { id: 'b', name: 'Alma', is_primary: false },
  { id: 'c', name: 'Olga', is_primary: false },
]

export default async function RefChildRail({
  searchParams,
}: { searchParams: Promise<{ kids?: string; child?: string }> }) {
  const { kids } = await searchParams
  const count = Math.min(3, Math.max(2, Number(kids) || 2))

  return (
    <main style={{ background: 'var(--app-bg)', minHeight: '100vh' }}>
      <Suspense fallback={null}>
        <ChildRail kids={KIDS.slice(0, count)} forceShow />
      </Suspense>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 40px' }}>
        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: '20px' }}>
          <p className="eyebrow" style={{ marginBottom: 6 }}>The page below the rail</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', letterSpacing: '-.03em', lineHeight: 1.1, margin: '0 0 8px' }}>
            Whose day is this
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            Tap a name above. On a real page every reading recomputes for that
            child, and the choice now follows the parent from page to page
            instead of resetting on the next tap.
          </p>
        </div>
      </div>
    </main>
  )
}
