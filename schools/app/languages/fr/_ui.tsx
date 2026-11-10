import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import Reveal from '@/components/Reveal'
import { eyebrow, panel } from '@/components/ui'
import { byLevel, LEVEL_LABEL, mediaUrl, type SheetFile } from '@/lib/languages/french'

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
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
