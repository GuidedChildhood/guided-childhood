'use client'

import { useEffect } from 'react'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'
import { eyebrow } from '@/components/ui'

// THE ERROR BOUNDARY.
//
// Two rules, and the second is the one that is easy to get wrong.
//
// ONE: no technical detail on screen. A stack trace, a Postgres code or a
// digest string tells a teacher nothing and tells them the product is amateur.
// The digest is logged to the console for whoever is debugging, and the page
// says what happened in words.
//
// TWO: do not promise that their work is safe, promise the true thing. Most
// error pages say "your work has been saved". This app has no pupil data, no
// teacher accounts and no session beyond the access cookie, which is the
// promise the DPA is written on. So the honest reassurance is not that we kept
// their work, it is that there was never anything of theirs here to lose. That
// is a better sentence anyway, and unlike the usual one it is true.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>
        {/* No SiteNav here on purpose: it is a server component that reads the
            school's licence state, and a client error boundary cannot await
            that. A nav that guessed would be a nav that lies, on the one page
            where trust is already thin. One plain way home instead. */}
        <a href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', textDecoration: 'none', display: 'inline-block', marginBottom: 'var(--space-5)' }}>
          Guided Childhood <span style={{ color: 'var(--terracotta-dark)' }}>Schools</span>
        </a>
        <div style={{ ...eyebrow, marginBottom: 'var(--space-2)' }}>Something went wrong at our end</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-3)' }}>
          That page did not load.
        </h1>
        <p style={{ ...PAGE.lead, color: 'var(--ink-soft)', margin: '0 0 var(--space-3)' }}>
          Nothing of yours was lost, because this site never holds anything of
          yours: no pupil names, no accounts, no saved work. Trying again is
          safe and usually enough.
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-muted)', margin: '0 0 var(--space-5)', lineHeight: 1.6 }}>
          If it keeps happening, the lesson you were opening can be taught from
          the printed pack in the meantime, and telling us which page it was
          helps us fix it quickly.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <button className="btn btn-gold" onClick={reset}>Try that again</button>
          <a className="btn btn-outline" href="/print">The print room</a>
        </div>
      </div>
    </main>
  )
}
