'use client'

import Link from 'next/link'
import DrawnPaper from '@/components/printables/drawn/DrawnPaper'
import type { DrawnSpec } from '@/components/printables/drawn'

// The parent's print page for a drawn sheet: a bar with the way back and one
// Print button, the paper below it, and a print rule that hides everything
// but the paper. Opens in its own tab (PrintableActions opens every sheet
// away from the app), so the dashboard stays exactly where it was.

export default function SheetPrintClient({ spec, title, kids, currentChildId, sheetKey }: {
  spec: DrawnSpec
  title: string
  kids: { id: string; name: string }[]
  currentChildId: string | null
  sheetKey: string
}) {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--app-bg)', fontFamily: 'var(--font-body)' }}>
      <style>{`@media print {
        header, .bottom-tab-bar, .rightnow-desktop, .no-print { display: none !important; }
        body { zoom: 1 !important; background: #fff !important; }
      }`}</style>

      <div className="no-print" style={{
        position: 'sticky', top: 0, zIndex: 2, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        padding: '12px 16px', background: '#fff', borderBottom: '1.5px solid var(--border)',
      }}>
        <Link href="/dashboard/printables" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', textDecoration: 'none' }}>
          ← Printables
        </Link>
        <div style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </div>
        {kids.length > 1 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {kids.map(k => (
              <Link
                key={k.id}
                href={`/dashboard/printables/sheet/${sheetKey}?child=${k.id}`}
                style={{
                  padding: '7px 12px', borderRadius: 100, textDecoration: 'none',
                  border: '1.5px solid var(--border)', background: k.id === currentChildId ? 'var(--butter)' : '#fff',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)',
                }}
              >
                {k.name}
              </Link>
            ))}
          </div>
        )}
        <button
          onClick={() => { try { window.print() } catch { /* nothing to do */ } }}
          style={{
            padding: '12px 20px', borderRadius: 16, border: 'none', cursor: 'pointer',
            background: 'var(--butter)', color: 'var(--ink)', boxShadow: '0 5px 0 var(--butter-dark)',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
          }}
        >
          🖨️ Print it
        </button>
      </div>

      <div style={{ maxWidth: 840, margin: '0 auto', padding: '18px 16px 40px' }}>
        <div className="no-print" style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
          One side of A4, with {spec.childName ? `${spec.childName}'s` : 'your child\'s'} name and your family's own deal already written on it. Print it, put the pens out, and it goes on the fridge.
        </div>
        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 30px rgba(26,26,46,0.10)' }}>
          <DrawnPaper spec={spec} />
        </div>
      </div>
    </div>
  )
}
