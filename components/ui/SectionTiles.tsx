'use client'

import Link from 'next/link'

// The pastel section tile, in one place, used by the Quests shortcuts and the
// passport page so the two read as the same product.
//
// Mobbin first, per CLAUDE.md. The references pulled were Vocabulary's Practice
// grid, Ahead's journey tiles and Tiimo's explore cards, all iOS. Every one of
// them does the same thing our tiles were not doing: the pastel fill carries a
// REAL border in a darker shade of itself, plus a hard offset shadow. That is
// the whole difference between a tile that reads as a crisp physical button and
// one that reads as a washed out block of colour, which is what ours were: flat
// fill, no edge, nothing to catch the eye.
//
// The border and shadow use the tile's own accent rather than grey, so six
// tiles side by side still read as six different places rather than six copies
// of one component. It is the same border plus 0 5px 0 language as our buttons,
// so nothing new is introduced to the design system, it is just applied here.
//
// A tile pointing at an anchor on the same page scrolls there itself rather
// than leaving it to the browser. A plain #hash link only moves the page when
// the hash CHANGES, so the second tap on Manage jobs, once the URL already
// said #my-todo, did nothing at all: a parent scrolled down, scrolled back up
// to the tiles, tapped, and the page sat exactly where it was.

export type SectionTile = {
  href: string
  label: string
  sub: string
  /** Rendered inside the white icon plate. An icon component or an emoji. */
  icon: React.ReactNode
  /** The pastel fill. */
  bg: string
  /** The edge and the shadow. A darker relative of bg, never grey. */
  accent: string
  /** Live state, when the tile has something worth saying up front. */
  badge?: string | null
}

export default function SectionTiles({
  tiles, columns = 2,
}: {
  tiles: SectionTile[]
  columns?: 1 | 2
}) {
  return (
    <div style={{
      display: 'grid',
      // minmax(0, 1fr) rather than 1fr: a grid column's default min width is
      // auto, so a badge that will not wrap makes the column wider than its
      // share and pushes the whole row off the right of a phone screen.
      gridTemplateColumns: columns === 2 ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)',
      gap: 12, marginBottom: 18,
    }}>
      {tiles.map(t => (
        <Link
          key={t.href + t.label}
          href={t.href}
          onClick={t.href.startsWith('#') ? e => {
            e.preventDefault()
            try {
              const el = document.getElementById(t.href.slice(1))
              if (!el) return
              const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
              el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
              // Keep the address bar honest without asking it to do the moving.
              history.replaceState(null, '', t.href)
            } catch { /* no target, leave the page alone */ }
          } : undefined}
          style={{
            display: 'block', textDecoration: 'none',
            background: t.bg,
            border: `2px solid ${t.accent}`,
            borderRadius: 18,
            boxShadow: `0 4px 0 ${t.accent}`,
            padding: '15px 16px 16px',
          }}
        >
          {/* Wraps. Two of these tiles sit side by side on a phone, so after
              the card padding and the 42px icon plate there is under 90px left
              on the row, and most badges are wider than that. Held on one line
              they either shoved the row off the screen (when they refused to
              shrink) or collapsed to "4 wai..." and "Not m..." (when they did).
              Neither is a badge. Given permission to wrap, a badge that does
              not fit beside the icon drops under it and reads in full. */}
          <span style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <span aria-hidden style={{
              width: 42, height: 42, borderRadius: 13, background: '#fff',
              border: `1.5px solid ${t.accent}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, color: 'var(--ink)', fontSize: 21, lineHeight: 1,
            }}>
              {t.icon}
            </span>
            {/* The number that makes a tile worth pressing today, when there is
                one. A tile that can say 3 waiting should say it here rather
                than make a parent open it to find out. */}
            {t.badge && (
              <span style={{
                background: '#fff', border: `1.5px solid ${t.accent}`,
                borderRadius: 100, padding: '3px 10px',
                fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                color: 'var(--ink)', whiteSpace: 'nowrap',
                // Never shrink, and never clip. The row wraps instead, so a
                // badge always reads in full at whatever width it needs.
                //
                // Both other ways round were tried and both were wrong. Pinned
                // at flexShrink 0 with no wrap, a long badge pushed the row off
                // a 390 screen. Allowed to shrink, every badge collapsed to
                // four characters and an ellipsis, which is worse: a badge that
                // says "Not m..." has lost the only thing it was for.
                flexShrink: 0,
              }}>
                {t.badge}
              </span>
            )}
          </span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18.5, color: 'var(--ink)', lineHeight: 1.15 }}>
            {t.label}
          </span>
          <span style={{ display: 'block', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 3 }}>
            {t.sub}
          </span>
        </Link>
      ))}
    </div>
  )
}
