'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

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
        const href = isDefault ? basePath : `${basePath}?child=${kid.id}`
        const label = kid.name && kid.name !== 'Your child' ? kid.name : 'Your child'
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
              fontWeight: 800,
              fontSize: '14px',
              lineHeight: 1,
              color: 'var(--ink)',
              background: active ? 'var(--terracotta)' : '#fff',
              border: active ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
              boxShadow: active ? '0 3px 0 var(--terracotta-dark)' : '0 3px 0 rgba(26,26,46,0.06)',
            }}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
