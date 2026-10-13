'use client'

import { useState } from 'react'
import KidFriendsParade from '@/components/kid/KidFriendsParade'

// Layout fixture for the Planet Friends' moonwalk parade, which otherwise only
// plays behind a kid token the moment a child's five a day lands. Built on the
// real component and the real characters, so a redrawn Friend shows up here.
//
// 404s in production via middleware, like every other ref-* page.

export default function RefFriendsParadePage() {
  const [open, setOpen] = useState(true)
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '28px 18px' }}>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '14px 20px', borderRadius: 'var(--radius-btn)', border: 'var(--edge)', background: '#EDC35F',
          boxShadow: '0 5px 0 #B98E2A', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', cursor: 'pointer',
        }}
      >
        Play the parade again
      </button>
      {open && <KidFriendsParade childName="Teo" onClose={() => setOpen(false)} />}
    </main>
  )
}
