import type { Metadata } from 'next'
import { MODULE_COUNT, CURRICULUM } from '@gc/shared/schools-curriculum'
import Link from 'next/link'
import { currentAccess } from '@/lib/licence'
import { pilotModulesFor } from '@/lib/pilot'
import UnlockForm from './UnlockForm'
import { PAGE } from '@gc/shared/page-scale'

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
  searchParams: Promise<{ next?: string; pilot?: string }>
}) {
  const { next, pilot } = await searchParams
  const destination = safeNext(next)
  const configured = Boolean((process.env.SCHOOLS_ACCESS_CODES || process.env.SCHOOLS_PILOT_CODES) && process.env.SCHOOLS_ACCESS_SECRET)
  // A pilot school tapping a lesson outside its two lands here with ?pilot=1
  // (proxy.ts). Say which two the pilot opens and where the prices are,
  // rather than asking for a code they already typed.
  const access = pilot === '1' ? await currentAccess() : null
  const pilotLessons = access?.tier === 'pilot'
    ? pilotModulesFor(access.phase).map(id => CURRICULUM.find(m => m.moduleId === id)).filter((m): m is NonNullable<typeof m> => Boolean(m))
    : []

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '64px 20px 90px' }}>
      <div style={{ maxWidth: '460px', margin: '0 auto' }}>

        {pilotLessons.length > 0 ? (
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <p style={{ ...eyebrow, marginBottom: '12px' }}>Pilot schools</p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              ...PAGE.page, color: 'var(--ink)', marginBottom: 'var(--space-3)',
            }}>
              That one is in<br />the full scheme.
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '16px' }}>
              Your pilot opens {pilotLessons.length === 2 ? 'two lessons' : `${pilotLessons.length} lessons`} for the term, with every printable, and the Hub. The other {MODULE_COUNT - pilotLessons.length} open with a licence.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {pilotLessons.map(m => (
                <li key={m.moduleId}>
                  <Link href={`/lesson/${m.moduleId}`} style={{ display: 'block', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: '12px 16px', textDecoration: 'none', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)' }}>
                    {m.title} <span style={{ fontWeight: 600, color: 'var(--ink-muted)', fontSize: 'var(--text-sm)' }}>· {m.yearBand}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/pricing" className="btn btn-gold" style={{ fontSize: 'var(--text-md)', padding: '14px 28px' }}>
              See what a licence costs
            </Link>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.6, marginTop: '22px' }}>
              Already have a licence code? Enter it below and the whole scheme opens.
            </p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <p style={{ ...eyebrow, marginBottom: '12px' }}>Licensed schools</p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              ...PAGE.page, color: 'var(--ink)', marginBottom: 'var(--space-3)',
            }}>
              Your school code opens<br />the whole curriculum.
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)',
              color: 'var(--ink-soft)', lineHeight: 1.7,
            }}>
              {MODULE_COUNT}{' '}modules, Reception to Year 13, with every lesson, every printable
              pack and the safeguarding hub. One code for the whole staff room. A pilot code opens two of them, and the Hub.
            </p>
          </div>
        )}

        {configured ? (
          <UnlockForm next={destination} />
        ) : (
          <div style={{
            background: '#fff', border: '2px solid var(--terracotta)', borderRadius: 'var(--radius-card)',
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
              hello@guidedchildhood.com and we will reply within two working days, usually the same day.
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
          . Bands start at £495 a year, invoiced on 30 day terms.
        </p>

      </div>
    </main>
  )
}
