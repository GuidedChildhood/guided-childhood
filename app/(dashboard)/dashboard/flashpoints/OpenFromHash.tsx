'use client'

import { useEffect } from 'react'

// A heads up push opens /dashboard/flashpoints#messy_room. A closed <details>
// does not open itself for its own anchor, so the plan the push promised would
// sit folded. This opens the one the address names, and scrolls it into view.
export default function OpenFromHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ''))
      if (!/^[a-z_]+$/.test(id)) return
      const el = document.getElementById(id)
      if (el instanceof HTMLDetailsElement) {
        el.open = true
        el.scrollIntoView({ block: 'start' })
      }
    }
    open()
    window.addEventListener('hashchange', open)
    return () => window.removeEventListener('hashchange', open)
  }, [])
  return null
}
