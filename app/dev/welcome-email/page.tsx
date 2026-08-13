import { welcomeEmail } from '@/lib/email/templates'

// Harness for the welcome email, which is the first thing a new parent reads
// and the one piece of the product nobody on the team ever sees. It goes out
// thirty seconds after signup to an address that is, by definition, not ours,
// and every account we have has already had it, so the only way to look at it
// has been to make a fresh account and check an inbox.
//
// It renders the REAL template through an iframe at the width a phone gives
// it, so what is checked is what lands.
//
// 404s in production via the dev layout.

export const dynamic = 'force-dynamic'

export default function DevWelcomeEmail() {
  const content = welcomeEmail({
    parentName: 'Justin',
    childName: 'Teo',
    unsubscribe: 'https://www.guidedchildhood.com/dashboard/email-check',
  })

  return (
    <main style={{ background: 'var(--app-bg)', minHeight: '100dvh', padding: '20px' }}>
      <p className="eyebrow" style={{ color: 'var(--ink-muted)', margin: '0 0 6px' }}>
        Dev · the welcome email
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 14px' }}>
        Subject: {content.subject}
      </p>
      <iframe
        title="Welcome email"
        srcDoc={content.html}
        style={{ width: '100%', maxWidth: 620, height: '150vh', border: '1.5px solid var(--border)', borderRadius: 16, background: '#fff' }}
      />
    </main>
  )
}
