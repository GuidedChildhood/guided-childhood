import type { Metadata } from 'next'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import PlainHeader from '@/components/marketing/PlainHeader'
import { SITE_URL } from '@/lib/config/site'
import { APPS } from '@/lib/app-safety/apps'
import { HUB_PATH, agePath, appPath } from '@/lib/app-safety/content'
import { AGES, aAge, type AppCategory } from '@/lib/app-safety/types'
import { JsonLd } from '@/lib/seo/json-ld'
import { pageMetadata } from '@/lib/seo/meta'

// THE HUB: every app in the guide, grouped the way a parent thinks about them,
// each with its own minimum age and a link to every age page. It is also the
// page that hands search engines all 220 addresses in one place.

export const metadata: Metadata = pageMetadata({
  title: 'Is it safe for my child? The UK parent\'s app guide, ages 6 to 15',
  description: 'TikTok, Roblox, YouTube, WhatsApp and more: each app\'s own minimum age and ratings with sources, the settings to switch on first, and advice for your child\'s exact age.',
  path: HUB_PATH,
})

const GROUPS: { category: AppCategory; title: string }[] = [
  { category: 'social', title: 'Social media' },
  { category: 'messaging', title: 'Messaging' },
  { category: 'video', title: 'Video and streaming' },
  { category: 'gaming', title: 'Games' },
  { category: 'ai', title: 'AI chat' },
  { category: 'creative', title: 'Creating and editing' },
  { category: 'music', title: 'Music' },
]

const H2: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '44px 0 10px' }
const SMALL: CSSProperties = { fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.6 }
const LINK: CSSProperties = { color: 'var(--ink)', textDecorationColor: 'var(--terracotta-dark)', textUnderlineOffset: '3px' }

export default function AppSafetyGuide() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <PlainHeader section={{ href: '/guides', label: 'Guides' }} track="app-guide-header" />
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '36px 16px 88px' }}>
        <JsonLd data={{
          '@context': 'https://schema.org', '@type': 'ItemList', name: 'The UK parent\'s app guide',
          itemListElement: APPS.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: `Is ${a.name} safe for children?`, url: `${SITE_URL}${appPath(a.slug)}` })),
        }} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 3rem)', letterSpacing: '-0.035em', lineHeight: 1.08, color: 'var(--ink)', margin: '0 0 16px', maxWidth: '18ch' }}>
          Is it safe for my child?
        </h1>
        <p style={{ fontSize: 'var(--text-lg)', lineHeight: 1.65, color: 'var(--ink)', margin: '0 0 12px', maxWidth: '62ch' }}>
          Most of these apps set their own minimum age, usually 13. That is the company&apos;s rule for an account, not a sign a child is ready. Each page gives the rule and the ratings with their sources, the settings to switch on first, and a free check for your child&apos;s exact age.
        </p>
        <p style={SMALL}>{APPS.length} apps, ages 6 to 15. Checked against each company&apos;s own pages.</p>

        {GROUPS.map(g => {
          const apps = APPS.filter(a => a.category === g.category)
          if (!apps.length) return null
          return (
            <section key={g.category} aria-labelledby={`g-${g.category}`}>
              <h2 id={`g-${g.category}`} style={H2}>{g.title}</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {apps.map(a => (
                  <li key={a.slug} style={{ padding: '16px 0', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <Link href={appPath(a.slug)} style={{ ...LINK, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)' }}>Is {a.name} safe?</Link>
                      <span style={SMALL}>Its own minimum age: {a.minAge.checked ? a.minAge.label : 'see its terms'}</span>
                    </div>
                    <p style={{ ...SMALL, margin: '4px 0 8px' }}>{a.whatItIs}</p>
                    <nav aria-label={`${a.name} by age`} style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ ...SMALL, marginRight: '4px' }}>By age</span>
                      {AGES.map(age => (
                        <Link key={age} href={agePath(a.slug, age)} aria-label={`Is ${a.name} safe for ${aAge(age)}?`}
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '44px', height: '44px', borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--white)', color: 'var(--ink)', fontWeight: 700, fontSize: 'var(--text-sm)', textDecoration: 'none' }}>
                          {age}
                        </Link>
                      ))}
                    </nav>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}

        <section style={{ marginTop: '56px', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 'clamp(22px, 4vw, 32px)' }}>
          <h2 style={{ ...H2, margin: '0 0 10px' }}>The plan behind every app</h2>
          <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.7, color: 'var(--ink-soft)', margin: '0 0 16px', maxWidth: '62ch' }}>
            Guided Childhood gets children to sixteen ready for a phone and social media, ten minutes a day, with you and your child working on it together.
          </p>
          <Link href="/starter-pack" className="btn btn-gold" data-track="app-guide-cta" style={{ minHeight: '48px' }}>Find your child&apos;s stage</Link>
          <p style={{ ...SMALL, margin: '12px 0 0' }}>Three questions, no sign up.</p>
        </section>
      </main>
    </div>
  )
}
