'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { childColour, childInitial } from '@/lib/children/colour'

// The child switcher: a round avatar per child, name underneath, shown only when a
// family has more than one. Each pill carries ?child=<id> so the server page
// re renders everything for that child and the choice survives refresh and
// sharing. The primary child keeps the clean URL.
//
// Fluidity: the server drives the real selection, but that only lands once the
// heavy page has re rendered, so on its own the pill lagged the tap. We move
// the highlight optimistically the instant a pill is pressed, prefetch the
// destination, and hand back to the server's choice the moment it arrives.

export interface SwitcherChild {
  id: string
  name: string | null
  is_primary?: boolean | null
  /** Drives the pill's colour. See STAGE_PILL below. */
  age_band?: string | null
  /**
   * Today's whole path is walked for this child. A green tick on the plate.
   * It used to mean the check in alone, until Justin's rule of 11 September
   * 2026: one tick keeps the streak, the pathway earns the celebration, and
   * the tick beside a name is part of the celebration.
   */
  done?: boolean
}

export default function ChildSwitcher({
  kids,
  selectedId,
  basePath,
}: {
  kids: SwitcherChild[]
  selectedId: string | null
  basePath: string
}) {
  const [pending, setPending] = useState<string | null>(null)
  // Once the server re renders with the new child, hand the highlight back.
  useEffect(() => { setPending(null) }, [selectedId])
  const activeId = pending ?? selectedId

  if (kids.length < 2) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 4px', marginBottom: '16px' }} aria-label="Choose which child">
      {kids.map(kid => {
        const active = kid.id === activeId
        const isDefault = kid.is_primary ?? false
        // basePath may already carry a query, which the passport page uses to
        // keep the chosen tab when the child changes. Without this the pill
        // built /dashboard/passport?tab=shop?child=<id>, a second question
        // mark, and the child was silently ignored.
        const sep = basePath.includes('?') ? '&' : '?'
        const href = isDefault ? basePath : `${basePath}${sep}child=${kid.id}`
        const label = kid.name && kid.name !== 'Your child' ? kid.name : 'Your child'
        const c = childColour(kid.age_band)
        const initial = childInitial(kid.name)
        return (
          <Link
            key={kid.id}
            href={href}
            // No full prefetch. These pills sit on every dashboard page and
            // link to the SAME page for the other child, so a full prefetch
            // rendered every page for every child on every visit. On the
            // script page that render wrote an opened row for the other child
            // (Justin, 5 September 2026: Todd's road ticked a script only
            // Jonny had read). The default prefetches the loading state only.
            onClick={() => setPending(kid.id)}
            aria-current={active ? 'page' : undefined}
            aria-label={kid.done ? `${label}, today's path done` : undefined}
            className="child-switch-pill"
            style={{
              // ── AVATAR OVER NAME (24 September 2026) ─────────────────────
              //
              // Justin: "improve the names of child at top to look more happy
              // news icon, more professional, stylish look."
              //
              // The 11 September pills were a colour slab with a letter in it,
              // and a row of two slabs reads as two buttons shouting. The
              // Mobbin sweep settles what calm looks like here: Greenlight's
              // parent app draws each child as a ROUND AVATAR with the name
              // underneath, and the chosen one is marked by a ring and a short
              // bar rather than by a change of fill. That is what we do, in
              // our own finish: each child keeps their own stage colour on the
              // plate everywhere (lib/children/colour, the colour that sticks),
              // with the ink edge and chunky lift the Happy News icons carry.
              //
              // Chosen: the plate is raised on the deep lift and ringed in ink
              // with a gap of page between, the name goes to full ink at 900,
              // and a short ink bar sits under it. Not chosen: the plate sits
              // pressed into the page and the name is muted. Four signals, so
              // colour is never the only one.
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              minWidth: 64,
              maxWidth: '100%',
              padding: '4px 8px 2px',
              textDecoration: 'none',
              borderRadius: 16,
            }}
          >
            <span
              aria-hidden
              style={{
                position: 'relative',
                flexShrink: 0, width: 48, height: 48, borderRadius: '50%',
                background: c.bold,
                border: 'var(--edge)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: '1.25rem', letterSpacing: '-0.02em', color: c.text,
                // The ring: a band of page colour, then an ink line, so the
                // chosen plate reads as selected on any stage colour.
                boxShadow: active
                  ? '0 0 0 3px var(--app-bg), 0 0 0 5px var(--ink), 0 3px 0 5px var(--ink)'
                  : '0 2px 0 var(--ink)',
                transform: active ? 'translateY(-2px)' : 'none',
                transition: 'box-shadow 0.16s ease, transform 0.16s ease',
              }}
            >
              {initial}
              {/* ── THE TICK ──────────────────────────────────────────────
                  Justin, 2 September 2026: "a green tick go by their name at
                  top indicating done." Since 11 September it means the whole
                  path, not the check in: lib/checkin/done-today.
                  On the plate rather than beside the name, so the name stays
                  the name. Ink ringed like everything else here, so it reads
                  on every stage colour. */}
              {kid.done && (
                <span
                  aria-hidden
                  style={{
                    position: 'absolute', right: -6, bottom: -6, width: 20, height: 20, borderRadius: '50%',
                    background: 'var(--retro-green)', border: 'var(--edge)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 12.5 10 17.5 19 7.5" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              )}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: active ? 900 : 700,
                fontSize: 'var(--text-sm)',
                lineHeight: 1.15,
                color: active ? 'var(--ink)' : 'var(--ink-muted)',
                textAlign: 'center',
                overflowWrap: 'anywhere',
                maxWidth: '100%',
              }}
            >
              {label}
            </span>
            {/* The bar under the chosen name. Always drawn, transparent when
                not chosen, so the row keeps its height as a parent taps
                between children. */}
            <span
              aria-hidden
              style={{
                width: 22, height: 4, borderRadius: 4,
                background: active ? 'var(--ink)' : 'transparent',
                transition: 'background 0.16s ease',
              }}
            />
          </Link>
        )
      })}
    </div>
  )
}
