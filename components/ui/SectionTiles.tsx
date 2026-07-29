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
  /** Overrides the icon colour worked out from accent. Rarely needed. */
  iconColor?: string
}

// The icon colour, worked out from the tile's accent.
//
// Justin held us up against FamilyWall and he is right. Their grid puts the
// COLOUR IN THE ICON, an amber list, a purple calendar, blue cutlery, a pink
// camera, all on plain tiles. Ours did the reverse: a pastel tile carrying a
// monochrome ink glyph on a white plate, because this component hard coded
// color: var(--ink) on the plate and KidIcon draws in currentColor. Every icon
// on the site was therefore the same grey, whatever tile it sat on.
//
// The accent itself cannot be the icon colour: those are pastels chosen to sit
// as a 2px edge, and at 23px on white they read as smudges. So each pastel maps
// to the saturated sibling we already use elsewhere, mostly the tab bar
// palette, which keeps the whole product in one set of colours rather than
// inventing a second.
//
// Anything already saturated passes straight through, so a caller that hands us
// a real colour keeps it.
const ICON_INK: Record<string, string> = {
  'var(--terracotta)': 'var(--terracotta-dark)',
  'var(--terracotta-lt)': 'var(--terracotta-dark)',
  '#A9C8E4': '#2E6F8E',   // blue tint    to the Scripts blue
  '#9CC3B4': '#2F8F6B',   // sage, green  to the DiGi green
  '#D6BE8A': '#B8860B',   // amber        to the Home gold
  '#E8CE7A': '#B8860B',   // gold
  '#F0B9AE': '#C0603A',   // coral        to the Quests terracotta
  '#C4B5E8': '#7A5CC0',   // lavender     to the Nova purple
  'var(--border)': 'var(--ink-soft)',
  'var(--ink-muted)': 'var(--ink-soft)',
}

function iconColorFor(accent: string, override?: string): string {
  if (override) return override
  return ICON_INK[accent] ?? accent
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
      // Stretch makes cards fill THEIR row; 1fr auto rows makes every row the
      // same height as each other, which is the half that was missing. Without
      // it a grid of eight tiles came out at three different heights.
      alignItems: 'stretch',
      gridAutoRows: '1fr',
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
            textDecoration: 'none',
            // White card on the cream page, with the colour carried by the icon
            // rather than the fill. Justin's call after holding us against
            // FamilyWall: "white tabs on grey and the actual images coloured".
            // A wall of pastel blocks makes six places read as one soft mass;
            // a white card with one saturated mark reads as six distinct doors,
            // and it matches what our own Explore grid was already doing.
            background: '#fff',
            border: '1.5px solid var(--border)',
            borderRadius: 18,
            boxShadow: '0 3px 0 rgba(26,26,46,0.05)',
            padding: '15px 16px 16px',
            // Every tile the same height, whatever its copy does. Grid stretches
            // a ROW to its tallest card, but rows are sized independently, so a
            // two line label on row one and a one line label on row three gave
            // tiles of visibly different heights down the page. Justin asked for
            // identical size, and identical means down the whole grid, not just
            // across a pair.
            height: '100%',
            display: 'flex', flexDirection: 'column',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
            {/* The pastel moved here off the tile. It is the plate behind the
                icon now, which is where every app that does this well puts it. */}
            <span aria-hidden style={{
              width: 46, height: 46, borderRadius: 13, background: t.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: 22, lineHeight: 1,
              // KidIcon draws in currentColor, so setting it here colours the
              // whole icon set without touching a single call site.
              color: iconColorFor(t.accent, t.iconColor),
            }}>
              {t.icon}
            </span>
            {/* The number that makes a tile worth pressing today, when there is
                one. A tile that can say 3 waiting should say it here rather
                than make a parent open it to find out. */}
            {t.badge && (
              <span style={{
                flexShrink: 0, background: t.bg, border: `1.5px solid ${t.accent}`,
                borderRadius: 100, padding: '3px 10px',
                fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                color: 'var(--ink)', whiteSpace: 'nowrap',
                // And if a badge is still too long for its tile, it clips
                // rather than dragging the layout with it.
                minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {t.badge}
              </span>
            )}
          </span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18.5, color: 'var(--ink)', lineHeight: 1.15 }}>
            {t.label}
          </span>
          <span style={{ display: 'block', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 3, flex: 1 }}>
            {t.sub}
          </span>
        </Link>
      ))}
    </div>
  )
}
