'use client'

import KidScreenChrome from '@/components/kid/KidScreenChrome'

// Layout fixture for the tab bar on a child screen that is NOT the home screen.
//
// The real screens that take this wrapper (balance, homework, jobs and the
// rest) all read the database on the server, and the sandbox has no Supabase
// service key, so none of them will render here. What needs checking is not
// their data anyway: it is the chrome. Does the bar sit on the floor, is it
// clear of the last control on a long page, is body unzoomed so the bar has no
// zoomed ancestor to drift against on an iPhone, and does it stay off paper.
//
// A part done day is passed in, so the Today entry renders the way it does on
// the five screens where it replaced the KidTodayReturn pill.
//
// So this renders the REAL KidScreenChrome around a page tall enough to scroll,
// ending in a button at the very bottom, which is the thing a fixed bar covers
// when the padding is wrong. 404s in production via middleware, like every
// other ref-* page.

export const dynamic = 'force-dynamic'

const TOKEN = '000000000000000000'

export default function RefKidChrome() {
  return (
    <KidScreenChrome token={TOKEN} current="quests" today={{ left: 3, total: 4, complete: false, opened: true }}>
      <div style={{
        minHeight: '100dvh', background: 'var(--cream)',
        padding: '22px 16px calc(96px + env(safe-area-inset-bottom, 0px))',
        fontFamily: 'var(--font-body)',
      }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, margin: '0 0 16px' }}>
          Chrome fixture
        </h1>
        {Array.from({ length: 24 }, (_, i) => (
          <p key={i} style={{ margin: '0 0 18px', fontSize: 'var(--text-base)' }}>
            A line of the page, so there is something to scroll past. Row {i + 1}.
          </p>
        ))}
        {/* The last control on the page. If the bottom padding does not clear
            the bar, this is what ends up underneath it and cannot be tapped. */}
        <button type="button" data-last-control style={{
          padding: '15px 20px', width: '100%', cursor: 'pointer',
          borderRadius: 'var(--radius-btn)', border: 'var(--edge)',
          background: 'var(--terracotta)', color: 'var(--ink)',
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'var(--text-md)', boxShadow: 'var(--lift-deep)',
        }}>
          The last thing on the page
        </button>
      </div>
    </KidScreenChrome>
  )
}
