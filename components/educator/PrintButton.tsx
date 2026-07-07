'use client'

// One chunky print button for every hub and pack document.
export default function PrintButton({ label = 'Print this document' }: { label?: string }) {
  return (
    <>
      <style>{`@media print { .gc-print-btn { display: none !important; } }`}</style>
      <button
        className="gc-print-btn"
        onClick={() => window.print()}
        style={{
          padding: '11px 20px', borderRadius: '16px', background: 'var(--gold)',
          color: 'var(--ink)', border: 'none', boxShadow: '0 4px 0 var(--gold-hover)',
          cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px',
        }}
      >
        {label}
      </button>
    </>
  )
}
