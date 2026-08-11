'use client'

// The one button this page exists for. Justin, 11 August 2026: the poster
// page had no print button at all, so printing meant knowing where the
// browser hides its own menu, which on a phone most people rightly do not.
// Prints in place, no popup, the same promise as the star chart builder.

export default function PrintPosterButton() {
  return (
    <button
      onClick={() => window.print()}
      className="fp-noprint"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: '100%', maxWidth: 420, cursor: 'pointer', padding: '14px',
        marginBottom: 18,
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
        color: 'var(--ink)', background: 'var(--terracotta)',
        border: 'none', borderRadius: 16,
        boxShadow: '0 5px 0 var(--terracotta-dark)',
      }}
    >
      🖨️ Print the poster
    </button>
  )
}
