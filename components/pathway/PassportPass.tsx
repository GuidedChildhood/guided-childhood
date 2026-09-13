'use client'

import Link from 'next/link'
import type { Stamp } from './PassportStamps'
import { passParts, passLine } from '@/lib/pathway/passport-pass'

// A PASS ON THIS PAGE, printed on every page of the book.
//
// Justin, 13 September 2026: each page must say "how to achieve a pass", for a
// family joining at any age. The rule is lib/pathway/stamped.ts, the words are
// lib/pathway/passport-pass.ts, and this draws them: one sentence, then the
// three parts as rows with a count, a bar and a link each.
//
// Mobbin (pulled first): Goodreads prints one plain sentence above the bar
// ("Collect this achievement when you finish any 3 books"), stoic puts the
// requirement and the count on the same row ("reach 10 days streak, 6/10"),
// Duolingo's quest card is three rows with a bar each. This is those three in
// our own ink.
//
// Read only safe: the child's copy of the book draws the same rows as spans.
// Lessons, scripts and the check are the child's own work, never an adult's
// note about them, so the counts are theirs to see; the links are the parent's.

export default function PassportPass({
  stamp,
  ink,
  tint,
  bold,
  readOnly = false,
  childParam = null,
  childName = null,
  catchupLine = null,
}: {
  stamp: Stamp
  ink: string
  tint: string
  bold: string
  readOnly?: boolean
  childParam?: string | null
  childName?: string | null
  catchupLine?: string | null
}) {
  const parts = passParts(stamp, { childParam })
  const line = passLine(stamp, parts, { childName, catchupLine })
  const ahead = stamp.status === 'upcoming'
  const doneCount = parts.filter(p => p.done).length
  return (
    <div className="gc-pp-in" style={{ position: 'relative', zIndex: 3, margin: '0 0 12px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: ink, opacity: 0.7,
        }}>
          {stamp.status === 'earned' ? 'This page passed' : 'A pass on this page'}
        </span>
        {!ahead && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: ink, whiteSpace: 'nowrap' }}>
            {doneCount} of 3
          </span>
        )}
      </div>
      <p style={{ margin: '0 0 8px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.45 }}>
        {line}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {parts.map(p => {
          const inner = (
            <>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span aria-hidden style={{
                  flexShrink: 0, width: 18, height: 18, borderRadius: '50%', boxSizing: 'border-box',
                  background: p.done ? ink : '#fff', border: `2px solid ${ink}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: ahead ? 0.5 : 1,
                }}>
                  {p.done && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
                  )}
                </span>
                <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.2, opacity: ahead ? 0.6 : 1 }}>
                  {p.label}
                </span>
                <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: ink, whiteSpace: 'nowrap', opacity: ahead ? 0.6 : 1 }}>
                  {ahead ? 'Later' : p.count}{!readOnly && !ahead && !p.done ? ' ›' : ''}
                </span>
              </span>
              {!ahead && (
                <span aria-hidden style={{ display: 'block', height: 4, borderRadius: 'var(--radius-pill)', background: tint, border: `1px solid ${ink}`, overflow: 'hidden', marginTop: 5, marginLeft: 26 }}>
                  <span className="gc-pp-bar" data-pct={p.pct} style={{ display: 'block', height: '100%', width: `${p.pct}%`, minWidth: p.pct > 0 ? 6 : 0, background: ink, borderRadius: 'var(--radius-pill)' }} />
                </span>
              )}
            </>
          )
          const box = {
            display: 'block', textDecoration: 'none', background: '#fff', border: `1.5px solid ${p.done ? ink : bold}`,
            borderRadius: 'var(--radius-tile)', padding: '7px 9px 8px', minWidth: 0,
          } as const
          const label = `${p.label}: ${ahead ? 'later' : p.count}`
          return readOnly || ahead || p.done ? (
            <span key={p.key} role="group" aria-label={label} style={box}>{inner}</span>
          ) : (
            <Link key={p.key} href={p.href} aria-label={`${label}, open`} style={box}>{inner}</Link>
          )
        })}
      </div>
    </div>
  )
}
