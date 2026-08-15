import type { Metadata } from 'next'
import Link from 'next/link'
import UnlockForm from './UnlockForm'

// The door. Everything except this page, the home page and pricing sits
// behind it (lib/access.ts holds the list and the reasoning).

export const metadata: Metadata = {
  title: 'School code',
  description: 'Enter your school code to open the curriculum, the lessons and the printable packs.',
  robots: { index: false, follow: false },
}

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
}

/** Only ever send a teacher back to a path on this site. A `next` value that
 *  starts with a scheme, or with a second slash, is somebody trying to use
 *  our login form as a springboard to their own page. */
function safeNext(raw: string | undefined): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/curriculum'
  return raw
}

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const destination = safeNext(next)
  const configured = Boolean(process.env.SCHOOLS_ACCESS_CODES && process.env.SCHOOLS_ACCESS_SECRET)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '64px 20px 90px' }}>
      <div style={{ maxWidth: '460px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <p style={{ ...eyebrow, marginBottom: '12px' }}>Licensed schools</p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(1.7rem, 4.5vw, 2.3rem)', letterSpacing: '-0.03em',
            lineHeight: 1.15, color: 'var(--ink)', marginBottom: '14px',
          }}>
            Your school code opens<br />the whole curriculum.
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)',
            color: 'var(--ink-soft)', lineHeight: 1.7,
          }}>
            Twenty one modules, Reception to Year 13, with every lesson, every printable
            pack and the safeguarding hub. One code for the whole staff room.
          </p>
        </div>

        {configured ? (
          <UnlockForm next={destination} />
        ) : (
          <div style={{
            background: '#fff', border: '2px solid var(--terracotta)', borderRadius: '20px',
            padding: '28px', textAlign: 'center',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: '8px',
            }}>
              Codes are not switched on yet
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)',
              color: 'var(--ink-soft)', lineHeight: 1.65,
            }}>
              This deployment has no codes configured, so nothing will open. Email
              hello@guidedchildhood.com and we will sort it the same day.
            </p>
          </div>
        )}

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          color: 'var(--ink-muted)', lineHeight: 1.6, textAlign: 'center',
          marginTop: '22px',
        }}>
          No code yet?{' '}
          <Link href="/pricing" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>
            See what a licence costs
          </Link>
          . Bands start at £1.50 per pupil per year, invoiced on 30 day terms.
        </p>

      </div>
    </main>
  )
}
