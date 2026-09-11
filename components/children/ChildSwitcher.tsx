'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { childColour, childInitial } from '@/lib/children/colour'

// The child switcher: butter pill tabs, one per child, shown only when a
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
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }} aria-label="Choose which child">
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
              display: 'inline-flex',
              position: 'relative',
              alignItems: 'center',
              // ── THE HAPPY NEWS FINISH (11 September 2026) ─────────────
              //
              // Justin: "lets apply a better nicer more modern design UX for
              // the name tags buttons shown here, i want them to look super
              // happy news style."
              //
              // The pills were right in structure and thin in finish: 24px
              // disc, 3px shadow, a hairline underline doing the work of
              // saying which is chosen. The house finish everywhere else on
              // this product is a proper plate, a chunky ink shadow and a
              // real difference in height between chosen and not.
              //
              // So the chosen pill is RAISED and the others sit pressed down
              // into the page, which is the signal a physical tab gives and
              // the one that survives a dim screen, sunlight, and anybody
              // who cannot separate two pastels. The underline is gone
              // because the lift says it better, and colour still is not the
              // only signal: the weight, the height and the ink ring on the
              // plate all say it too.
              padding: '8px 18px 8px 8px',
              borderRadius: '100px',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              fontWeight: active ? 900 : 800,
              fontSize: 'var(--text-md)',
              lineHeight: 1,
              gap: '10px',
              color: active ? c.text : 'var(--ink)',
              background: active ? c.bold : '#fff',
              border: '2px solid var(--ink)',
              // Raised when chosen, pressed when not. The translate keeps the
              // row's height steady while the shadow changes, so nothing
              // jumps as a parent taps between children.
              boxShadow: active ? '0 5px 0 var(--ink)' : '0 2px 0 var(--ink)',
              transform: active ? 'none' : 'translateY(3px)',
              transition: 'box-shadow 0.16s ease, transform 0.16s ease, background 0.16s ease',
            }}
          >
            {/* ── THE PLATE ────────────────────────────────────────────────
                From the Mobbin sweep Justin asked for: Greenlight's parent app
                puts a round AVATAR above each name, and the reason it works is
                that a face is recognised before a word is read. An initial in
                the child's own colour gets most of that without asking a
                parent to upload photographs before the app is useful.
                It is a proper happy news circle plate now: 30px, its own ink
                ring, white ground when the pill is filled so the initial
                reads as a badge on a badge rather than a hole in the colour. */}
            <span
              aria-hidden
              style={{
                position: 'relative',
                flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
                background: active ? '#fff' : c.bold,
                border: '2px solid var(--ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: '0.85rem', color: active ? c.text : 'var(--ink)',
              }}
            >
              {initial}
              {/* ── THE TICK ──────────────────────────────────────────────
                  Justin, 2 September 2026: "a green tick go by their name at
                  top indicating done." Since 11 September it means the whole
                  path, not the check in: lib/checkin/done-today.
                  On the plate rather than beside the name, so the name stays
                  the name. Ink ringed like everything else here, so it reads
                  on every stage colour and on the white plate alike. */}
              {kid.done && (
                <span
                  aria-hidden
                  style={{
                    position: 'absolute', right: -7, bottom: -7, width: 18, height: 18, borderRadius: '50%',
                    background: 'var(--retro-green)', border: '2px solid var(--ink)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 12.5 10 17.5 19 7.5" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              )}
            </span>
            {label}
          </Link>
        )
      })}
    </div>
  )
}
