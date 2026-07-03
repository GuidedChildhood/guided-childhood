'use client'

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn btn-gold no-print"
      style={{ padding: '12px 28px', fontSize: '14px' }}
    >
      Print
    </button>
  )
}
