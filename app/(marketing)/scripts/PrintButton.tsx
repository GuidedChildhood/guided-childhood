'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '.65rem',
        fontWeight: 700,
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        color: 'var(--ink-muted)',
        background: 'none',
        border: '1.5px solid var(--border)',
        borderRadius: '10px',
        padding: '8px 14px',
        cursor: 'pointer',
      }}
    >
      Print
    </button>
  )
}
