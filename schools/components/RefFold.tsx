import type { ReactNode } from 'react'
import OpenFoldsOnPrint from './OpenFoldsOnPrint'
import OpenFoldOnHash from './OpenFoldOnHash'

// REFERENCE PAGES, FOLDED (the schools UX pass, batch 5, 23 November 2026).
//
// The staff briefings, the safeguarding crosswalk, the parent pack, the
// philosophy and the run sheet were each 18 to 28 phone screens of reference
// text with no summary first. They now open on a summary card and a row of
// jump chips, and every section sits closed behind one line that says what
// is inside. Nothing was cut: the full text is still in the page, so a search
// with the browser finds it, and printing opens every fold so paper still
// carries everything.

/** One closed section. `hint` is the one line that says what is inside. */
export function RefFold({ id, title, hint, tone, children }: {
  id?: string; title: ReactNode; hint?: ReactNode; tone?: 'care'; children: ReactNode
}) {
  return (
    <details className={tone === 'care' ? 'gc-ref gc-ref-care' : 'gc-ref'} id={id}>
      <summary>
        <span className="gc-ref-title">{title}</span>
        {hint && <span className="gc-ref-hint">{hint}</span>}
      </summary>
      <div className="gc-ref-body">{children}</div>
    </details>
  )
}

/** The row of chips under the summary: one tap to the section you came for. */
export function JumpChips({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="gc-ref-jump no-print">
      {items.map(i => <a key={i.href} href={i.href}>{i.label}</a>)}
    </nav>
  )
}

/** A small heading inside the folds, grouping them (a key stage, a phase). */
export function RefGroup({ id, children }: { id?: string; children: ReactNode }) {
  return <h2 id={id} className="gc-ref-group">{children}</h2>
}

/** Put once on each folded page: the styles, and the print opener. */
export function RefPageKit() {
  return (
    <>
      <OpenFoldsOnPrint selector="details.gc-ref" />
      <OpenFoldOnHash />
      <style>{`
        .gc-ref { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-tile); margin-bottom: var(--space-2); }
        .gc-ref-care { border-left: 4px solid var(--coral); }
        .gc-ref > summary { list-style: none; cursor: pointer; display: flex; flex-direction: column; gap: var(--space-1); padding: var(--space-3) var(--space-6) var(--space-3) var(--space-4); min-height: 44px; position: relative; }
        .gc-ref > summary::-webkit-details-marker { display: none; }
        .gc-ref > summary::after { content: '+'; position: absolute; right: var(--space-4); top: 50%; transform: translateY(-50%); font-family: var(--font-display); font-weight: 900; font-size: var(--text-xl); color: var(--ink); }
        .gc-ref[open] > summary::after { content: '\\2212'; }
        .gc-ref > summary:focus-visible, .gc-ref-jump a:focus-visible { outline: 3px solid var(--ink); outline-offset: 3px; }
        .gc-ref-title { font-family: var(--font-display); font-weight: 800; font-size: var(--text-md); color: var(--ink); line-height: 1.35; }
        .gc-ref-hint { font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink-muted); line-height: 1.5; }
        .gc-ref-body { padding: 0 var(--space-4) var(--space-3); }
        .gc-ref-body > :last-child { margin-bottom: 0; }
        .gc-ref-group { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-muted); margin: var(--space-5) 0 var(--space-2); scroll-margin-top: var(--space-4); }
        .gc-ref-jump { display: flex; flex-wrap: wrap; gap: var(--space-2); margin: 0 0 var(--space-4); }
        .gc-ref-jump a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 var(--space-3); border: 1.5px solid var(--ink); border-radius: 999px; font-family: var(--font-body); font-weight: 700; font-size: var(--text-sm); color: var(--ink); text-decoration: none; background: var(--white); }
        .gc-ref-jump a:hover { background: var(--butter-lt); }
        details.gc-ref[id] { scroll-margin-top: var(--space-4); }
        @media print {
          .gc-ref { border: none; border-left: none; margin-bottom: var(--space-3); }
          .gc-ref > summary { padding: 0; min-height: 0; }
          .gc-ref > summary::after { content: ''; }
          .gc-ref-body { padding: var(--space-1) 0 0; }
        }
      `}</style>
    </>
  )
}
