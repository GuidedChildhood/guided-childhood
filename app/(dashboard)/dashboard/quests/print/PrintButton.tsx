'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
        borderRadius: '14px', padding: '12px 22px', cursor: 'pointer',
        fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800,
        boxShadow: '0 4px 0 var(--terracotta-dark)',
      }}
    >
      Print
    </button>
  )
}
