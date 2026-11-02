import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { CSSProperties } from 'react'
import { SITE_URL } from '@/lib/config/site'
import { GUIDES, guideBySlug, STAGE_CHECK_HOOK } from '@/lib/content/guides'

// One guide. Everything below the intro comes from the guide's DEVICE_ISSUES
// entry, so a fix to the advice there reaches DiGi, the dashboard and this
// page together. The scripts are named and locked, never shown: they are the
// paid part (plans/2026-11-02-guides-plan.md).

export function generateStaticParams() {
  return GUIDES.map(g => ({ slug: g.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = guideBySlug(slug)
  if (!guide) return {}
  return {
    title: `${guide.question} · Guided Childhood`,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: { title: guide.question, description: guide.description, type: 'article' },
  }
}

const WRAP: CSSProperties = { maxWidth: '760px', margin: '0 auto', padding: '44px 16px 80px' }
const EYEBROW: CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)', margin: '0 0 10px' }
const H2: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xl)', lineHeight: 1.2, color: 'var(--ink)', margin: '34px 0 8px' }
const P: CSSProperties = { fontSize: 'var(--text-base)', lineHeight: 1.7, color: 'var(--ink-soft)', margin: '0 0 12px' }

function LockIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="4" y="11" width="16" height="10" rx="2.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = guideBySlug(slug)
  if (!guide) notFound()
  const { issue } = guide
  const others = GUIDES.filter(g => g.slug !== guide.slug)

  return (
    <main style={WRAP}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: guide.question,
          description: guide.description,
          dateModified: guide.updated,
          mainEntityOfPage: `${SITE_URL}/guides/${guide.slug}`,
          author: { '@type': 'Organization', name: 'Guided Childhood', url: SITE_URL },
          publisher: { '@type': 'Organization', name: 'Guided Childhood', url: SITE_URL },
          citation: issue.source.url,
        }) }}
      />

      <p style={EYEBROW}>{guide.ages}</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 2.7rem)', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 14px', color: 'var(--ink)' }}>
        {guide.question}
      </h1>
      <p style={{ ...P, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>{guide.intro}</p>

      <h2 style={H2}>Why it keeps happening</h2>
      <p style={P}>{issue.mechanism}</p>

      <h2 style={H2}>What works</h2>
      <p style={P}>{issue.response}</p>

      <h2 style={H2}>If your child is younger</h2>
      <p style={P}>{issue.prevent}</p>

      <section aria-labelledby="in-the-app" style={{ marginTop: '36px', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '22px 20px' }}>
        <h2 id="in-the-app" style={{ ...H2, margin: '0 0 6px', fontSize: 'var(--text-lg)' }}>The words to say, inside Guided Childhood</h2>
        <p style={{ ...P, fontSize: 'var(--text-sm)' }}>
          These are word for word scripts in the app for exactly this moment, matched to your child&apos;s stage.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {issue.proof.scripts.map(title => (
            <li key={title} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 14px', color: 'var(--ink)', fontWeight: 700, fontSize: 'var(--text-sm)', lineHeight: 1.4 }}>
              <span style={{ color: 'var(--terracotta)' }}><LockIcon /></span>
              {title}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Find your child's stage" style={{ marginTop: '28px', background: 'var(--ink)', color: 'var(--white)', borderRadius: 'var(--radius-card)', padding: '26px 22px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xl)', lineHeight: 1.25, margin: '0 0 16px' }}>{STAGE_CHECK_HOOK}</p>
        <Link href="/starter-pack" data-track={`guide-${guide.slug}`} className="btn btn-gold" style={{ fontSize: 'var(--text-base)', padding: '14px 28px' }}>
          Start the stage check
        </Link>
      </section>

      <p style={{ ...P, fontSize: 'var(--text-sm)', marginTop: '22px' }}>
        Source: <a href={issue.source.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--terracotta-dark)' }}>{issue.source.name}</a>.
        Checked {new Date(`${guide.updated}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}.
      </p>

      {others.length > 0 && (
        <nav aria-label="More guides" style={{ marginTop: '34px', borderTop: '1px solid var(--border)', paddingTop: '22px' }}>
          <p style={EYEBROW}>More guides</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {others.map(g => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{g.question}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </main>
  )
}
