import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EmailCheck from '@/components/settings/EmailCheck'

// A page you can simply open.
//
// Working out whether the keepsake notification actually sends took a browser
// console or a Vercel log filter, neither of which is a reasonable thing to
// ask of the person who needs the answer. This is a URL and a button.

export const metadata = { title: 'Email check — Guided Childhood' }

export default async function EmailCheckPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '20px 20px 48px' }}>
      <Link
        href="/dashboard/settings"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 18,
          fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700,
          color: 'var(--ink-muted)', textDecoration: 'none',
        }}
      >
        ‹ Back to settings
      </Link>

      <EmailCheck />

      <p style={{ maxWidth: 640, margin: '18px auto 0', fontSize: 15, color: 'var(--ink-muted)', lineHeight: 1.6 }}>
        This tests the deployment you are on right now. A preview URL and the live site can answer differently, because environment variables in Vercel are set per environment, and that on its own explains most notifications that never arrive.
      </p>
    </div>
  )
}
