import Link from 'next/link'
import { MODULE_COUNT } from '@gc/shared/schools-curriculum'

// THE STRIP A PILOT SCHOOL SEES ON ITS TWO LESSONS (14 September 2026).
//
// Rendered only when the access cookie is a pilot code and the module is one
// of the two the pilot opens. It names what this is and points at the prices
// once, quietly, in place of the taster bar a stranger sees. A licensed
// school never sees it: nothing on a paid page should advertise the thing
// already bought.

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--stage-1-text)',
}

export default function PilotStrip({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{
      background: 'var(--tint-amber)', borderRadius: '14px',
      padding: compact ? '10px 16px' : '14px 18px', marginBottom: compact ? '18px' : 0,
      display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-3)',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
    }}>
      <span style={eyebrow}>Your pilot lesson</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--stage-1-text)', lineHeight: 1.5 }}>
        One of the two your pilot opens. The full scheme is {MODULE_COUNT} modules on one code:{' '}
        <Link href="/pricing" style={{ color: 'var(--stage-1-text)', fontWeight: 800 }}>see the prices</Link>.
      </span>
    </div>
  )
}
