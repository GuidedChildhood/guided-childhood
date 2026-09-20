'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { readYourSchool, leadLine, YOUR_SCHOOL_EVENT, type YourSchool } from '@gc/shared/schools-your-school'

// THE NAME, READ OFF THIS SCREEN.
//
// The lesson pages and the print pack are server components: they cannot
// see the browser, and they should not, because nothing about a school's
// staff should reach the server. So each of them renders one of these small
// client islands where the name belongs, and the island reads the browser.
// Before the store is read (and on the server) it renders nothing, so a page
// with no name typed looks exactly as it did before this existed.

export function useYourSchool(): YourSchool | null {
  const [v, setV] = useState<YourSchool | null>(null)
  useEffect(() => {
    const read = () => setV(readYourSchool())
    read()
    window.addEventListener(YOUR_SCHOOL_EVENT, read)
    window.addEventListener('storage', read)
    return () => {
      window.removeEventListener(YOUR_SCHOOL_EVENT, read)
      window.removeEventListener('storage', read)
    }
  }, [])
  return v
}

/**
 * One sentence for the prep page and the run sheet: who the lead is on this
 * screen, or, when nothing is typed, where to type it. The second case is a
 * link and not silence, because a flagged lesson is exactly the moment a
 * teacher discovers the box exists.
 */
export function LeadLine({ style }: { style?: React.CSSProperties }) {
  const v = useYourSchool()
  return (
    <span style={style}>
      {v ? (
        <>In this school that is <strong>{leadLine(v)}</strong>.</>
      ) : (
        <>Type your safeguarding lead&rsquo;s name once on <Link href="/hub#your-school" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>the Hub</Link> and it appears here and on the slide that asks for it.</>
      )}
    </span>
  )
}

/**
 * The printed teacher sheet: the name only, no link, because paper has no
 * link to follow and a blank is the honest state of a sheet printed from a
 * screen that has not been told.
 */
export function LeadOnPaper({ style }: { style?: React.CSSProperties }) {
  const v = useYourSchool()
  if (!v) return null
  return <p style={style}>Your safeguarding lead, as typed on the screen this was printed from: <strong>{leadLine(v)}</strong>.</p>
}
