'use client'

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      style={{
        background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 'var(--radius-btn)',
        padding: '13px 22px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900,
        fontSize: 'var(--text-md)', boxShadow: '0 5px 0 var(--terracotta-dark)',
      }}
    >
      🖨️ Print or save as PDF
    </button>
  )
}
