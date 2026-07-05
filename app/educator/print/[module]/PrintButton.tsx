'use client'

export default function PrintButton() {
  return (
    <>
      <button
        onClick={() => window.print()}
        style={{
          padding: '10px 18px', borderRadius: '16px', background: 'var(--gold)',
          color: 'var(--ink)', border: 'none', boxShadow: '0 5px 0 var(--gold-hover)',
          cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px',
        }}
      >
        Print the pack
      </button>
      <style>{`@media print { .no-print { display: none !important; } }`}</style>
    </>
  )
}
