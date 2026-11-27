import Link from 'next/link'
import { checkHref } from '@/lib/app-safety/handoff'
import type { CSSProperties, ReactNode } from 'react'

import ReadinessCheck from '@/components/app-safety/ReadinessCheck'
import MagnetGate from '@/components/marketing/MagnetGate'
import { SITE_URL } from '@/lib/config/site'
import { JsonLd, faqPage } from '@/lib/seo/json-ld'
import { appBySlug } from '@/lib/app-safety/apps'
import { AGE_NOTES } from '@/lib/app-safety/ages'
import { HUB_PATH, agePath, appPath, directAnswer, faqs, gapLabel, leadControl, nearbyAges, shortRating, stageFor } from '@/lib/app-safety/content'
import { AGES, aAge, type Age, type AppEntry, type Sourced } from '@/lib/app-safety/types'

// One app page, with or without an age. Server rendered: everything a search
// engine or an AI tool reads is in the HTML; only the free check runs in the
// browser. Built to the checklist in .claude/skills/uiux-pro-max/design-tells.md:
// one primary action, hierarchy by size, left aligned, one accent, no eyebrow
// over every heading.

const WRAP: CSSProperties = { maxWidth: '760px', margin: '0 auto', padding: '28px 16px 88px' }
const H2: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-2xl)', lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '52px 0 12px' }
const P: CSSProperties = { fontSize: 'var(--text-md)', lineHeight: 1.7, color: 'var(--ink-soft)', margin: '0 0 14px', maxWidth: '64ch' }
const SMALL: CSSProperties = { fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.6 }
const LINK: CSSProperties = { color: 'var(--ink)', textDecorationColor: 'var(--terracotta-dark)', textUnderlineOffset: '3px' }

function Fact({ label, value, url }: { label: string; value: ReactNode; url?: string }) {
  return (
    <div style={{ padding: '14px 0', borderTop: '1px solid var(--border)' }}>
      <dt style={{ ...SMALL, marginBottom: '2px' }}>{label}</dt>
      <dd style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>
        {value}
        {url && <a href={url} rel="noopener" target="_blank" style={{ ...LINK, ...SMALL, fontFamily: 'inherit', fontWeight: 600, marginLeft: '10px' }}>Source</a>}
      </dd>
    </div>
  )
}

function rating(r: Sourced<string>): ReactNode {
  if (!r.checked || !r.value) return <span style={{ ...SMALL, fontWeight: 600 }}>See the listing</span>
  return r.value.toLowerCase() === 'none' ? 'Not rated' : shortRating(r.value)
}

export default function AppSafetyPage({ app, age }: { app: AppEntry; age: Age | null }) {
  const title = age ? `Is ${app.name} safe for ${aAge(age)}?` : `Is ${app.name} safe for children?`
  const answer = directAnswer(app, age)
  const qa = faqs(app, age)
  const note = age ? AGE_NOTES[age] : null
  const stage = age ? stageFor(age) : null
  const under = age !== null && age < app.minAge.gapAge
  const url = `${SITE_URL}${age ? agePath(app.slug, age) : appPath(app.slug)}`
  const similar = app.similar.map(appBySlug).filter((a): a is AppEntry => !!a)

  return (
    <main style={WRAP}>
      <JsonLd data={[
        faqPage(qa),
        {
          '@context': 'https://schema.org', '@type': 'Article', headline: title, description: answer, dateModified: app.checked,
          mainEntityOfPage: url, author: { '@id': `${SITE_URL}/#organization` }, publisher: { '@id': `${SITE_URL}/#organization` },
          about: { '@type': 'SoftwareApplication', name: app.name, author: { '@type': 'Organization', name: app.maker } },
        },
        {
          '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'App safety guide', item: `${SITE_URL}${HUB_PATH}` },
            { '@type': 'ListItem', position: 2, name: app.name, item: `${SITE_URL}${appPath(app.slug)}` },
            ...(age ? [{ '@type': 'ListItem', position: 3, name: `Age ${age}`, item: url }] : []),
          ],
        },
      ]} />

      <nav aria-label="Breadcrumb" style={{ ...SMALL, marginBottom: '22px' }}>
        <Link href={HUB_PATH} style={LINK}>App safety guide</Link>
        <span aria-hidden style={{ margin: '0 8px' }}>/</span>
        {age ? <Link href={appPath(app.slug)} style={LINK}>{app.name}</Link> : <span>{app.name}</span>}
        {age && <><span aria-hidden style={{ margin: '0 8px' }}>/</span><span>Age {age}</span></>}
      </nav>

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 3rem)', letterSpacing: '-0.035em', lineHeight: 1.08, color: 'var(--ink)', margin: '0 0 18px', maxWidth: '20ch' }}>{title}</h1>
      <p style={{ ...P, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>{answer}</p>
      <p style={SMALL}>{app.whatItIs} Checked against {app.maker}&apos;s own pages on {formatDate(app.checked)}.</p>
      {/* THE PLAN, NEAR THE TOP (27 November 2026). The only way into the
          stage check was a button at the very foot of a long page, and from 24
          to 27 November 51 visits to these pages reached it zero times. This
          one sits under the answer and carries the age and the app, so the
          check skips the age and starts on this app's worry. */}
      <p style={{ margin: '14px 0 0' }}>
        <Link href={checkHref(app.slug, age)} className="btn btn-gold" data-track="app-page-top" style={{ minHeight: '48px' }}>
          {age ? `Get the plan for your ${age} year old` : 'Get the plan for your child'}
        </Link>
      </p>

      <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', columnGap: '24px', margin: '26px 0 34px' }}>
        <Fact label="Its own minimum age" value={app.minAge.checked ? app.minAge.label : <span style={{ ...SMALL, fontWeight: 600 }}>See its terms</span>} url={app.minAge.sourceUrl} />
        <Fact label="App Store" value={rating(app.ratings.appStore)} url={app.ratings.appStore.url || undefined} />
        <Fact label="Google Play" value={rating(app.ratings.googlePlay)} url={app.ratings.googlePlay.url || undefined} />
        <Fact label="PEGI" value={rating(app.ratings.pegi)} url={app.ratings.pegi.url || undefined} />
      </dl>

      {note && stage && age && (
        <section aria-labelledby="this-age">
          <h2 id="this-age" style={{ ...H2, marginTop: '8px' }}>What changes at {age}</h2>
          <p style={P}>{note.changes}</p>
          <p style={P}><strong style={{ color: 'var(--ink)' }}>This month:</strong> {note.thisMonth}</p>
          <p style={SMALL}>Most {age} year olds are in {note.years}. In Guided Childhood that is Stage {stage.id}, {stage.name}: {lowerFirst(stage.focus)}.</p>
        </section>
      )}

      {!age && (
        <section aria-labelledby="by-age">
          <h2 id="by-age" style={{ ...H2, marginTop: '8px' }}>{app.name} by age</h2>
          <p style={P}>Pick your child&apos;s age for advice written for that year.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
            {AGES.map(a => (
              <li key={a}>
                <Link href={agePath(app.slug, a)} style={{ display: 'block', minHeight: '64px', padding: '12px 14px', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: '14px', textDecoration: 'none' }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>Age {a}</span>
                  <span style={{ ...SMALL, fontSize: 'var(--text-xs)' }}>{gapLabel(app, a)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div style={{ marginTop: '44px' }}>
        <ReadinessCheck
          slug={app.slug}
          presetAge={age}
          app={{ name: app.name, minAge: app.minAge.gapAge, rule: app.minAge.rule, firstControl: leadControl(app), hasUnderAgeOption: !!app.underAge.text, underAgeText: lowerFirst(app.underAge.text) }}
        />
      </div>

      {under && app.underAge.text && (
        <section aria-labelledby="younger">
          <h2 id="younger" style={H2}>Under {app.minAge.gapAge}: what {app.maker} offers instead</h2>
          <p style={P}>{app.underAge.text}{app.underAge.sourceUrl && <> <a href={app.underAge.sourceUrl} rel="noopener" target="_blank" style={LINK}>Source</a></>}</p>
        </section>
      )}

      <section aria-labelledby="setup">
        <h2 id="setup" style={H2}>{age ? `Setting up ${app.name} for ${aAge(age)}` : `Setting up ${app.name} for your child`}</h2>
        <p style={P}>{under ? `If ${app.name} is part of your child's life before ${app.minAge.gapAge}, set it up together, with these steps done before they use it on their own.` : 'Do these together, side by side, before they use it on their own. Your child seeing what each setting does is half the point.'}</p>
        <ol style={{ margin: '0 0 12px', paddingLeft: '22px', maxWidth: '64ch' }}>
          {app.setupSteps.steps.map((s, i) => (
            <li key={i} style={{ ...P, margin: '0 0 10px', paddingLeft: '4px' }}>{s}</li>
          ))}
        </ol>
        <p style={SMALL}>From <a href={app.setupSteps.sourceUrl} rel="noopener" target="_blank" style={LINK}>{app.maker}&apos;s own help pages</a>. Menus move after updates, so the names may differ slightly.</p>

        {app.controls.length > 0 && (
          <>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '30px 0 8px' }}>The parental controls {app.name} has</h3>
            <dl style={{ margin: 0 }}>
              {app.controls.map(c => (
                <div key={c.name} style={{ padding: '12px 0', borderTop: '1px solid var(--border)' }}>
                  <dt style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 'var(--text-md)' }}>{c.name}</dt>
                  <dd style={{ ...P, margin: '2px 0 0' }}>{c.what} <a href={c.sourceUrl} rel="noopener" target="_blank" style={{ ...LINK, ...SMALL }}>Source</a></dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </section>

      <section aria-labelledby="how-it-works">
        <h2 id="how-it-works" style={H2}>How {app.name} is designed</h2>
        <p style={P}>Most of what parents worry about comes from a few design choices. Knowing them tells you which setting matters.</p>
        <dl style={{ margin: 0 }}>
          {app.risks.map(r => (
            <div key={r.title} style={{ padding: '12px 0', borderTop: '1px solid var(--border)' }}>
              <dt style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 'var(--text-md)' }}>{r.title}</dt>
              <dd style={{ ...P, margin: '2px 0 0' }}>{r.detail}{r.sourceUrl && <> <a href={r.sourceUrl} rel="noopener" target="_blank" style={{ ...LINK, ...SMALL }}>Source</a></>}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="faq">
        <h2 id="faq" style={H2}>Questions parents ask</h2>
        <div>
          {qa.map(f => (
            <details key={f.q} style={{ borderTop: '1px solid var(--border)', padding: '14px 0' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--ink)', minHeight: '28px' }}>{f.q}</summary>
              <p style={{ ...P, margin: '10px 0 0' }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="next" style={{ marginTop: '56px', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 'clamp(22px, 4vw, 32px)' }}>
        <h2 id="next" style={{ ...H2, margin: '0 0 10px' }}>One app is one part of it</h2>
        <p style={P}>Guided Childhood is the plan for all of it, ten minutes a day from 4 to 16: the words for the arguments, a plan for your child&apos;s age, and their own app where jobs earn the screen time you agree.</p>
        <Link href={checkHref(app.slug, age)} className="btn btn-gold" data-track="app-page-cta" style={{ minHeight: '48px' }}>Find your child&apos;s stage</Link>
        <p style={{ ...SMALL, margin: '12px 0 0' }}>Three questions, no sign up.</p>
      </section>

      <div style={{ marginTop: '28px' }}>
        <MagnetGate
          slug="starter-pack"
          heading="Or start on paper: the free Starter Pack"
          sub="The jobs you agree together, a star chart for the fridge and the tokens to cut out. Free to print, sent to your inbox."
        />
      </div>

      <section aria-labelledby="more" style={{ marginTop: '48px' }}>
        <h2 id="more" style={{ ...H2, fontSize: 'var(--text-xl)', margin: '0 0 12px' }}>More on this</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {age && nearbyAges(age).map(a => (
            <li key={a}><Link href={agePath(app.slug, a)} style={LINK}>Is {app.name} safe for {aAge(a)}?</Link></li>
          ))}
          {age && <li><Link href={appPath(app.slug)} style={LINK}>{app.name} at every age</Link></li>}
          {similar.map(s => (
            <li key={s.slug}><Link href={age ? agePath(s.slug, age) : appPath(s.slug)} style={LINK}>Is {s.name} safe{age ? ` for ${aAge(age)}` : ' for children'}?</Link></li>
          ))}
          <li><Link href={HUB_PATH} style={LINK}>Every app in the guide</Link></li>
        </ul>
      </section>

      <section aria-labelledby="sources" style={{ marginTop: '44px' }}>
        <h2 id="sources" style={{ ...H2, fontSize: 'var(--text-lg)', margin: '0 0 8px' }}>Sources</h2>
        <ul style={{ ...SMALL, paddingLeft: '18px', margin: 0 }}>
          {sources(app).map(s => <li key={s.url}><a href={s.url} rel="noopener" target="_blank" style={LINK}>{s.label}</a></li>)}
        </ul>
        <p style={{ ...SMALL, marginTop: '12px' }}>Guided Childhood is independent of {app.maker}. Apps change their settings often; tell us at hello@guidedchildhood.com if something here has moved.</p>
      </section>

    </main>
  )
}

function sources(app: AppEntry): { label: string; url: string }[] {
  const out: { label: string; url: string }[] = []
  const add = (label: string, url: string) => { if (url && !out.some(o => o.url === url)) out.push({ label, url }) }
  add(app.minAge.sourceName, app.minAge.sourceUrl)
  add(`${app.name} on the App Store`, app.ratings.appStore.url)
  add(`${app.name} on Google Play`, app.ratings.googlePlay.url)
  add(`PEGI rating for ${app.name}`, app.ratings.pegi.url)
  add(`${app.maker} help: setting up ${app.name}`, app.setupSteps.sourceUrl)
  for (const c of app.controls) add(`${app.maker}: ${c.name}`, c.sourceUrl)
  for (const r of app.risks) add(`${app.maker}: ${r.title}`, r.sourceUrl)
  add(`${app.maker}: for younger children`, app.underAge.sourceUrl)
  return out
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

function lowerFirst(s: string): string {
  return s ? s[0].toLowerCase() + s.slice(1) : s
}
