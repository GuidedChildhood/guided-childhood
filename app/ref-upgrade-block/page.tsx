import WhatYouAreBuying from '@/components/upgrade/WhatYouAreBuying'

// Layout fixture for the "what you are really buying" block on /dashboard/upgrade.
//
// It exists because that page cannot be opened by the people who need to read
// its copy. hasFullAccess short circuits to "You already have everything" for
// anyone allowlisted, subscribed or in trial, and the founder address is
// permanently allowlisted, so Justin sees the wrong screen on his own account.
// Copy nobody can look at is copy that ships unread.
//
// This renders the REAL component, not a copy of its markup, at the real
// column width the page uses (maxWidth 640, 20px sides). Three fixtures
// earlier this week passed while drawing less than production, so this one
// imports the shipped thing or it certifies nothing.
//
// 404s in production via middleware, like every other ref-* page.

export const dynamic = 'force-dynamic'

export default function RefUpgradeBlock() {
  return (
    <main style={{ background: 'var(--app-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px' }}>
        <p className="eyebrow" style={{ color: 'var(--ink-muted)', margin: '0 0 14px' }}>
          Reference · the upgrade page block
        </p>
        <WhatYouAreBuying />
      </div>
    </main>
  )
}
