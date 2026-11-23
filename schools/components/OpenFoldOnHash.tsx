'use client'

import { useEffect } from 'react'

// A jump chip that lands on a closed fold opens it, so one tap reaches the
// text rather than a closed line (the schools UX pass, batch 5). Renders
// nothing.
export default function OpenFoldOnHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(location.hash.slice(1))
      if (!id) return
      const el = document.getElementById(id)
      if (el instanceof HTMLDetailsElement) el.open = true
    }
    open()
    window.addEventListener('hashchange', open)
    return () => window.removeEventListener('hashchange', open)
  }, [])
  return null
}
