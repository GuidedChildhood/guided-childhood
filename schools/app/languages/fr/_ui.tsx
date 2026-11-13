import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import HouseInShort from '@/components/InShort'
import Reveal from '@/components/Reveal'
import { eyebrow, panel } from '@/components/ui'
import { byLevel, extrasUrl, LEVEL_LABEL, mediaUrl, type SheetFile } from '@/lib/languages/french'

// The French pages' few shared pieces, in the house dialect (components/ui.ts).
// The section colour for languages is terracotta, so the area reads as a
// different subject from the digital scheme's green without leaving the
// palette.

export const langEyebrow: CSSProperties = { ...eyebrow, color: 'var(--terracotta-dark)' }

export const body: CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65,
}

export const small: CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.55,
}

export const card: CSSProperties = { ...panel, background: 'var(--white)' }

// On a wide screen the whole trail. On a phone a trail wraps onto two lines
// and starts the second with an orphan arrow, so it becomes the one thing a
// thumb wants there: a back link to the parent.
export function Crumbs({ trail }: { trail: { href?: string; label: string }[] }) {
  const parent = [...trail].reverse().find(t => t.href)
  return (
    <nav aria-label="Breadcrumb" className="gc-fr-crumbs" style={{ ...eyebrow, marginBottom: 'var(--space-4)' }}>
      <span className="gc-fr-crumbs-full" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        {trail.map((t, i) => (
          <span key={i} style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
            {i > 0 && <span aria-hidden>›</span>}
            {t.href ? <Link href={t.href} style={{ color: 'var(--ink-muted)', textDecoration: 'none' }}>{t.label}</Link> : <span style={{ color: 'var(--ink)' }}>{t.label}</span>}
          </span>
        ))}
      </span>
      {parent?.href && (
        <Link className="gc-fr-crumbs-back" href={parent.href} style={{ color: 'var(--ink-muted)', textDecoration: 'none', minHeight: 44, alignItems: 'center' }}>
          ‹ {parent.label}
        </Link>
      )}
      <style>{`.gc-fr-crumbs-back { display: none } @media (max-width: 640px) { .gc-fr-crumbs-full { display: none !important } .gc-fr-crumbs-back { display: inline-flex } .gc-fr-crumbs { margin-bottom: var(--space-2) !important } }`}</style>
    </nav>
  )
}

// A section rises in as it arrives (the house Reveal: opacity and transform
// only, nothing above the fold is ever hidden, reduced motion shows it all).
export function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Reveal as="section" style={card}>
      <h2 style={{ ...langEyebrow, margin: '0 0 var(--space-3)' }}>{label}</h2>
      {children}
    </Reveal>
  )
}

/** A word list: French in bold, English beside it. */
export function Words({ rows }: { rows: [string, string][] }) {
  return (
    <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-2)', margin: 0 }}>
      {rows.map(([fr, en]) => (
        <div key={fr} style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: 'var(--space-2) var(--space-3)' }}>
          <dt lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{fr}</dt>
          <dd style={{ ...small, margin: 0 }}>{en}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Printable sheets, the class, adapted and inclusion versions side by side. */
export function Sheets({ slug, files }: { slug: string; files: SheetFile[] }) {
  if (files.length === 0) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {byLevel(files).map(([lv, fs]) => (
        <div key={lv}>
          <div style={{ ...eyebrow, marginBottom: 'var(--space-2)' }}>{LEVEL_LABEL[lv]}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {fs.map(f => (
              <li key={f.f}>
                <a href={mediaUrl(slug, f.f, 'sheet')} target="_blank" rel="noopener" style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minHeight: 44,
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--ink)', textDecoration: 'none',
                }}>
                  <span aria-hidden style={{ color: 'var(--terracotta-dark)' }}>⎙</span>
                  <span style={{ borderBottom: '1px solid var(--border)' }}>{f.t}</span>
                </a>
                {f.ans && (
                  <a href={mediaUrl(slug, f.ans, 'sheet')} target="_blank" rel="noopener" aria-label={`Answers for ${f.t}`} style={{
                    display: 'inline-flex', alignItems: 'center', minHeight: 44, marginLeft: 'var(--space-5)',
                    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)',
                  }}>
                    Answers
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

/** Sheets from the scheme's shared extras folder: mats, display cards, posters. */
export function ExtraSheets({ files }: { files: SheetFile[] }) {
  if (files.length === 0) return null
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      {files.map(f => (
        <li key={f.f}>
          <a href={extrasUrl(f.f)} target="_blank" rel="noopener" style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minHeight: 44,
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--ink)', textDecoration: 'none',
          }}>
            <span aria-hidden style={{ color: 'var(--terracotta-dark)' }}>⎙</span>
            <span style={{ borderBottom: '1px solid var(--border)' }}>{f.t}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/** The short version of a long page, first (components/InShort), in the French colour. */
export function InShort({ points }: { points: ReactNode[] }) {
  return <HouseInShort points={points} accent="var(--terracotta)" ink="var(--terracotta-dark)" />
}

/** A grid of short cards: a heading and a sentence or two. The handbook is mostly these. */
export function Cards({ rows }: { rows: [string, string][] | null | undefined }) {
  if (!rows || rows.length === 0) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
      {rows.map(([t, d]) => (
        <div key={t} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: 'var(--space-3)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.3, margin: '0 0 var(--space-1)' }}>{t}</h3>
          <p style={{ ...small, margin: 0 }}>{d}</p>
        </div>
      ))}
    </div>
  )
}

/** A progression as a row of steps with an arrow between them. */
export function Flow({ steps }: { steps: string[] }) {
  if (steps.length === 0) return null
  return (
    <ol style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)', listStyle: 'none', padding: 0, margin: 0 }}>
      {steps.map((s, i) => (
        <li key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {i > 0 && <span aria-hidden style={{ color: 'var(--terracotta-dark)', fontWeight: 800 }}>→</span>}
          <span style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: 'var(--space-1) var(--space-3)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.45 }}>{s}</span>
        </li>
      ))}
    </ol>
  )
}

/** The one thing to take away from a section, set apart. */
export function Callout({ children }: { children: ReactNode }) {
  return (
    <p style={{ ...body, margin: 0, color: 'var(--ink)', background: 'var(--butter-lt)', borderLeft: '4px solid var(--terracotta)', borderRadius: 'var(--radius-tile)', padding: 'var(--space-3) var(--space-4)' }}>{children}</p>
  )
}

/** A handbook section: a heading and what is under it. */
export function Part({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-label={title} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', scrollMarginTop: 'var(--space-7)' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.2, margin: 'var(--space-3) 0 0' }}>{title}</h2>
      {children}
    </section>
  )
}

// A section that stays shut until it is wanted. The unit page leads with its
// lessons; everything a teacher looks up rather than uses (the sound, the
// statements, the unit's sheets) folds away behind its own line, so the page
// is as long as the job in hand. A native <details>: it opens with a key and
// with no script, and it prints open.
export function Fold({ label, hint, children, open }: { label: string; hint?: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="gc-fr-fold" open={open}>
      <summary>
        <span style={{ flex: '1 1 auto', minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{label}</span>
          {hint && <span style={{ ...small, display: 'block' }}>{hint}</span>}
        </span>
        <span aria-hidden className="gc-fr-fold-chev">›</span>
      </summary>
      <div className="gc-fr-fold-body">{children}</div>
    </details>
  )
}

/** The one stylesheet for a group of folds. Render it once beside them. */
export function FoldStyles() {
  return (
    <style>{`
      .gc-fr-folds { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-card); overflow: hidden; box-shadow: 0 1px 2px rgba(23,60,70,0.04), 0 12px 32px -18px rgba(23,60,70,0.28); }
      .gc-fr-fold + .gc-fr-fold { border-top: 1px solid var(--border); }
      .gc-fr-fold > summary { display: flex; align-items: center; gap: var(--space-3); min-height: 60px; padding: var(--space-2) var(--space-4); cursor: pointer; list-style: none; transition: background-color .15s ease; }
      .gc-fr-fold > summary::-webkit-details-marker { display: none; }
      .gc-fr-fold > summary:hover, .gc-fr-fold[open] > summary { background: var(--warm); }
      .gc-fr-fold > summary:focus-visible { outline: none; box-shadow: inset 0 0 0 3px var(--terracotta); }
      .gc-fr-fold-chev { flex: none; font-family: var(--font-display); font-weight: 800; font-size: var(--text-xl); line-height: 1; color: var(--ink-light); transition: transform .22s cubic-bezier(0.22,1,0.36,1), color .15s ease; }
      .gc-fr-fold[open] > summary .gc-fr-fold-chev { transform: rotate(90deg); color: var(--terracotta-dark); }
      .gc-fr-fold-body { padding: var(--space-4); animation: gc-fr-fold-open .28s cubic-bezier(0.22,1,0.36,1); }
      @keyframes gc-fr-fold-open { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
      @media (max-width: 560px) { .gc-fr-fold > summary { padding: var(--space-2) var(--space-3); } .gc-fr-fold-body { padding: var(--space-3); } }
      @media (prefers-reduced-motion: reduce) { .gc-fr-fold-body { animation: none; } .gc-fr-fold-chev, .gc-fr-fold > summary { transition: none; } }
      @media print { .gc-fr-fold > .gc-fr-fold-body { display: block !important; } }
    `}</style>
  )
}

/** The play button on a lesson row, and the row's hover. Render once per page that lists lessons. */
export function LessonRowStyles() {
  return (
    <style>{`
      .gc-fr-list { list-style: none; margin: 0; padding: 0; background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-card); overflow: hidden; box-shadow: 0 1px 2px rgba(23,60,70,0.04), 0 12px 32px -18px rgba(23,60,70,0.28); }
      .gc-fr-list > li:first-child { border-top: 0 !important; }
      .gc-fr-row { transition: background-color .15s ease; }
      @media (max-width: 560px) { .gc-fr-list > li { padding: 0 var(--space-3) !important; } }
      .gc-fr-row:hover { background: var(--warm); }
      .gc-fr-play {
        flex: none; display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px;
        border-radius: 50%; background: var(--terracotta); color: var(--ink); text-decoration: none;
        font-size: var(--text-sm); padding-left: var(--space-1); box-shadow: 0 3px 0 var(--terracotta-dark);
        transition: transform .15s ease;
      }
      .gc-fr-play:hover { transform: translateY(-1px); }
      .gc-fr-play:active { transform: translateY(2px); box-shadow: 0 1px 0 var(--terracotta-dark); }
      .gc-fr-play:focus-visible { outline: 3px solid var(--ink); outline-offset: 2px; }
      @media (prefers-reduced-motion: reduce) { .gc-fr-row, .gc-fr-play { transition: none; } .gc-fr-play:hover { transform: none; } }
    `}</style>
  )
}

/** One lesson in a list: its number or star, its title, and a play button if it has slides. */
export function LessonRow({ unitKey, n, mark, title, detail, hasSlides }: {
  unitKey: string; n: number; mark: string; title: string; detail: string; hasSlides: boolean
}) {
  return (
    <li className="gc-fr-row" style={{ borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '0 var(--space-4)' }}>
      <Link href={`/languages/fr/${unitKey}/${n}`} style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minHeight: 60, padding: 'var(--space-2) 0', textDecoration: 'none', color: 'var(--ink)' }}>
        <span aria-hidden style={{
          width: 32, height: 32, flexShrink: 0, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--butter-lt)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)',
        }}>{mark}</span>
        <span style={{ flex: '1 1 auto', minWidth: 0 }}>
          <span lang="fr" style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)' }}>{title}</span>
          <span style={{ ...small, display: 'block' }}>{detail}</span>
        </span>
      </Link>
      {hasSlides ? (
        <Link href={`/languages/fr/${unitKey}/${n}/teach`} className="gc-fr-play" aria-label={`Teach ${title} on the board`}>
          <span aria-hidden>▶</span>
        </Link>
      ) : (
        <span style={{ ...eyebrow, color: 'var(--ink-light)', whiteSpace: 'nowrap' }}>Plan</span>
      )}
    </li>
  )
}
