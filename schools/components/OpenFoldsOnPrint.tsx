'use client'

import { useEffect } from 'react'

// Opens every closed fold on the page when it is printed, and closes the ones
// it opened afterwards, so a printed page carries everything while the screen
// stays short (the schools UX pass, 23 November 2026). Renders nothing.
export default function OpenFoldsOnPrint({ selector = 'details.gc-fold' }: { selector?: string }) {
  useEffect(() => {
    let opened: HTMLDetailsElement[] = []
    const before = () => {
      opened = [...document.querySelectorAll<HTMLDetailsElement>(selector)].filter(d => !d.open)
      opened.forEach(d => { d.open = true })
    }
    const after = () => { opened.forEach(d => { d.open = false }); opened = [] }
    window.addEventListener('beforeprint', before)
    window.addEventListener('afterprint', after)
    return () => { window.removeEventListener('beforeprint', before); window.removeEventListener('afterprint', after) }
  }, [selector])
  return null
}
