'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// The way back from a welcome card.
//
// The hello sends a parent off to do a thing: add the PE kit, set up the jobs,
// turn on the check ins. Before this, that was a one way trip. They landed on
// Settings or Quests, finished, and were left on a page with no relationship to
// the day, having been pulled out of the one two minute habit the whole product
// runs on. Justin: once done, "take them back to home to start daily pathway if
// not done".
//
// So every welcome action carries ?from=welcome and this reads it, in the
// dashboard layout, once, for every destination. One place rather than a return
// link bolted onto seven pages, which is seven chances for one of them to be
// forgotten and strand somebody.
//
// It says "when you are done" rather than assuming they are. The bar cannot
// know whether the job is finished, and a bar that says "Done!" at a parent who
// has not started is the app talking over them.
export default function BackToToday() {
  const params = useSearchParams()
  if (params.get('from') !== 'welcome') return null

  // The spacing lives here, not in the layout, so a page without the param
  // pays nothing at all rather than carrying an empty padded wrapper.
  return (
    <div style={{ padding: '16px 20px 0', maxWidth: 720, margin: '0 auto' }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
      borderRadius: 16, padding: '11px 14px', margin: '0 0 16px',
    }}>
      <span aria-hidden style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>🧭</span>
      <span style={{ flex: 1, minWidth: 0, fontSize: 15.5, color: 'var(--ink)', lineHeight: 1.45 }}>
        When you are done here, today is waiting.
      </span>
      <Link
        href="/dashboard"
        style={{
          flexShrink: 0, textDecoration: 'none', padding: '8px 13px',
          background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 12,
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
          boxShadow: '0 3px 0 var(--terracotta-dark)', whiteSpace: 'nowrap',
        }}
      >
        Back to today
      </Link>
    </div>
    </div>
  )
}
