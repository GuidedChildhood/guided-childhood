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
            prefetch
            onClick={() => setPending(kid.id)}
            aria-current={active ? 'page' : undefined}
            className="child-switch-pill"
            style={{
              display: 'inline-flex',
              position: 'relative',
              alignItems: 'center',
              padding: '9px 18px',
              borderRadius: '100px',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              // 900 when it is the one you are on, so the chosen child reads as
              // chosen even to somebody who cannot separate the two colours.
              // Colour is never the only signal here.
              fontWeight: active ? 900 : 800,
              fontSize: 'var(--text-md)',
              lineHeight: 1,
              gap: '8px',
              color: active ? c.text : 'var(--ink)',
              background: active ? c.bold : '#fff',
              border: active ? `1.5px solid ${c.bold}` : '1.5px solid var(--border)',
              boxShadow: active ? '0 3px 0 rgba(26,26,46,0.14)' : '0 3px 0 rgba(26,26,46,0.06)',
            }}
          >
            {/* ── AN INITIAL, NOT A DOT (19 August 2026) ──────────────────
                From the Mobbin sweep Justin asked for. Greenlight's parent app
                puts a round AVATAR above each name, and the reason it works is
                that a face is recognised before a word is read: a parent spots
                Olga rather than reading "Olga". A coloured dot carried the
                stage but said nothing about WHO.
                An initial in the stage colour gets most of that benefit with
                none of the cost of asking a parent to upload photographs of
                their children before the app is useful. */}
            <span
              aria-hidden
              style={{
                flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
                background: active ? 'rgba(255,255,255,0.55)' : c.bold,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: '0.8rem', color: active ? c.text : 'var(--ink)',
                boxShadow: active ? 'none' : 'inset 0 0 0 1px rgba(26,26,46,0.10)',
              }}
            >
              {initial}
            </span>
            {label}
            {/* ── AND A SECOND SIGNAL, NOT ONLY COLOUR ────────────────────
                Greenlight underlines the selected face. Worth copying exactly:
                the stage colours are pastels, and on a dim screen, in sunlight,
                or to anybody who cannot separate two of them, a colour swap on
                its own is not a statement. The underline is, and it costs two
                pixels. Weight already carries some of this; this finishes it. */}
            {active && (
              <span
                aria-hidden
                style={{
                  position: 'absolute', left: 18, right: 18, bottom: 5, height: 2.5,
                  borderRadius: 2, background: c.text, opacity: 0.55,
                }}
              />
            )}
          </Link>
        )
      })}
    </div>
  )
}
