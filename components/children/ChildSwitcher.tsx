'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { childColour } from '@/lib/children/colour'

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
            {/* The unchosen pills keep a dot of their stage colour, so a parent
                can still tell at a glance which name is which before tapping.
                Without it only the active child would be identifiable. */}
            {!active && (
              <span
                aria-hidden
                style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: c.bold, flexShrink: 0,
                  boxShadow: 'inset 0 0 0 1px rgba(26,26,46,0.12)',
                }}
              />
            )}
            {label}
          </Link>
        )
      })}
    </div>
  )
}
