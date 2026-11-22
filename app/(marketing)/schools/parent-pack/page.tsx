import type { Metadata } from 'next'
import Link from 'next/link'
import QRCode from 'qrcode'
import type { CSSProperties } from 'react'

import CopyText from '@/components/schools/CopyText'
import PlainHeader from '@/components/marketing/PlainHeader'
import { appBySlug } from '@/lib/app-safety/apps'
import { HUB_PATH, appPath } from '@/lib/app-safety/content'
import { blurb, candidateCode, cleanSchoolName, packLink, startLink, trackedPath, PACK_PATH, type PackSchool } from '@/lib/school/parent-pack'
import { createAdminClient } from '@/lib/supabase/admin'
import { pageMetadata } from '@/lib/seo/meta'

// THE SCHOOL PARENT PACK (Phase 3 of plans/2026-11-19-seo-and-app-safety-pages-plan.md).
// The logic is lib/school/parent-pack.ts. Shape from Mobbin (22 November 2026):
// a plain white QR card with the short link written under it and one copy
// button (SchoolAI, Sweatpals, WeTransfer).
//
// Read per request, because ?school= decides the name, the QR code and every
// link. A school's own pack is out of the search index: there could be a
// thousand of them and they are for that school's families, not for search.

type Props = { searchParams: Promise<{ pack?: string | string[]; school?: string | string[] }> }

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = await searchParams
  const school = one(q.pack) ?? one(q.school)
  return pageMetadata({
    title: 'The parent pack for schools: free guides to share with families',
    description: 'A short piece for your school newsletter, a QR code and links to free guides on the apps children ask for, with your school\'s own tracked link.',
    path: PACK_PATH,
    noindex: Boolean(school),
  })
}

async function resolveSchool(raw: string | undefined): Promise<PackSchool> {
  const code = candidateCode(raw)
  if (!raw || !code) return { kind: 'none' }
  try {
    const { data } = await createAdminClient()
      .from('school_links').select('code, school_name').eq('code', code).eq('active', true).maybeSingle()
    if (data) return { kind: 'linked', code: data.code, name: data.school_name }
  } catch { /* no database here: fall back to the name the school typed */ }
  const name = cleanSchoolName(raw)
  return name ? { kind: 'named', slug: code, name } : { kind: 'none' }
}

const WRAP: CSSProperties = { maxWidth: '760px', margin: '0 auto', padding: '32px 16px 88px' }
const H2: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em', color: 'var(--ink)', margin: '48px 0 12px' }
const P: CSSProperties = { fontSize: 'var(--text-md)', lineHeight: 1.7, color: 'var(--ink-soft)', margin: '0 0 14px', maxWidth: '64ch' }
const SMALL: CSSProperties = { fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.6 }
const CARD: CSSProperties = { background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 'clamp(20px, 4vw, 28px)' }
const LINK: CSSProperties = { color: 'var(--ink)', textDecorationColor: 'var(--terracotta-dark)', textUnderlineOffset: '3px' }

// The apps parents ask schools about most often in the guide's own order.
const FEATURED = ['roblox', 'youtube', 'tiktok', 'whatsapp', 'snapchat', 'minecraft']

export default async function ParentPack({ searchParams }: Props) {
  const q = await searchParams
  const school = await resolveSchool(one(q.pack) ?? one(q.school))
  const start = startLink(school)
  const text = blurb(school)
  const qrSvg = await QRCode.toString(start, {
    type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1A1A2E', light: '#FFFFFF' }, // hex-ok: QR code SVG string, a custom property cannot reach inside it
  })
  const qrDownload = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrSvg)}`
  const shortStart = start.replace(/^https:\/\/(www\.)?/, '')
  const apps = FEATURED.map(appBySlug).filter(a => a !== null)

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <PlainHeader section={{ href: HUB_PATH, label: 'App guide' }} track="parent-pack-header" />
      {school.kind !== 'none' && (
        <div style={{ background: 'var(--terracotta-lt)', borderBottom: '1px solid var(--border)' }}>
          <p style={{ maxWidth: '760px', margin: '0 auto', padding: '12px 16px', fontWeight: 700, color: 'var(--ink)', fontSize: 'var(--text-md)' }}>
            Shared with families at {school.name}
          </p>
        </div>
      )}
      <main style={WRAP}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 3rem)', letterSpacing: '-0.035em', lineHeight: 1.08, color: 'var(--ink)', margin: '0 0 16px', maxWidth: '20ch' }}>
          {school.kind === 'none' ? 'The parent pack for schools' : `Free guides for ${school.name} families`}
        </h1>
        <p style={{ ...P, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>
          {school.kind === 'none'
            ? 'Parents ask schools about phones, games and apps all the time. This page gives you something to send them: a short piece for the newsletter, a QR code for a poster or a slide, and free guides that need no sign up.'
            : 'Everything below is free and needs no sign up: a guide to each app children ask for, and a three question check to find where your child is.'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '28px', alignItems: 'start' }}>
          <section aria-labelledby="blurb" style={CARD}>
            <h2 id="blurb" style={{ ...H2, fontSize: 'var(--text-lg)', margin: '0 0 10px' }}>For the newsletter</h2>
            <p style={{ ...P, color: 'var(--ink)', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px 16px', userSelect: 'all', overflowWrap: 'anywhere' }}>{text}</p>
            <CopyText text={text} label="Copy the text" track="parent-pack-copy" />
          </section>

          <section aria-labelledby="qr" style={{ ...CARD, textAlign: 'center' }}>
            <h2 id="qr" style={{ ...H2, fontSize: 'var(--text-lg)', margin: '0 0 14px' }}>For a poster or a slide</h2>
            <div role="img" aria-label={`QR code for ${shortStart}`} style={{ width: '200px', maxWidth: '100%', margin: '0 auto 12px', lineHeight: 0 }} dangerouslySetInnerHTML={{ __html: qrSvg }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--ink)', wordBreak: 'break-all', margin: '0 0 14px' }}>{shortStart}</p>
            <a href={qrDownload} download={`guided-childhood-qr${school.kind === 'linked' ? `-${school.code}` : school.kind === 'named' ? `-${school.slug}` : ''}.svg`} data-track="parent-pack-qr" style={{ ...LINK, display: 'inline-flex', alignItems: 'center', minHeight: '44px', fontWeight: 700 }}>
              Download the QR code
            </a>
          </section>
        </div>

        <section aria-labelledby="tools">
          <h2 id="tools" style={H2}>The free tools</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ padding: '14px 0', borderTop: '1px solid var(--border)' }}>
              <Link href={start.replace(/^https:\/\/www\.guidedchildhood\.com/, '')} style={{ ...LINK, fontWeight: 800, fontSize: 'var(--text-lg)' }}>What stage is your child?</Link>
              <p style={{ ...SMALL, margin: '2px 0 0' }}>Three questions, no sign up, and a plan for their exact age.</p>
            </li>
            <li style={{ padding: '14px 0', borderTop: '1px solid var(--border)' }}>
              <Link href={trackedPath(HUB_PATH, school)} style={{ ...LINK, fontWeight: 800, fontSize: 'var(--text-lg)' }}>Is it safe for my child? The app guide</Link>
              <p style={{ ...SMALL, margin: '2px 0 4px' }}>Each app&apos;s own minimum age and ratings with sources, the settings to switch on first, and advice for ages 6 to 15.</p>
              <p style={{ ...SMALL, margin: 0 }}>
                {apps.map((a, i) => (
                  <span key={a.slug}><Link href={trackedPath(appPath(a.slug), school)} style={{ ...LINK, display: 'inline-block', padding: '8px 0' }}>{a.name}</Link>{i < apps.length - 1 ? ', ' : ''}</span>
                ))}
              </p>
            </li>
            <li style={{ padding: '14px 0', borderTop: '1px solid var(--border)' }}>
              <Link href={trackedPath('/guides', school)} style={{ ...LINK, fontWeight: 800, fontSize: 'var(--text-lg)' }}>Guides for the arguments at home</Link>
              <p style={{ ...SMALL, margin: '2px 0 0' }}>The nightly screen time row, the first phone, spending in games.</p>
            </li>
            <li style={{ padding: '14px 0', borderTop: '1px solid var(--border)' }}>
              <Link href={trackedPath('/free', school)} style={{ ...LINK, fontWeight: 800, fontSize: 'var(--text-lg)' }}>Free printables</Link>
              <p style={{ ...SMALL, margin: '2px 0 0' }}>Print at home sheets for children and grown ups to use together.</p>
            </li>
          </ul>
        </section>

        <section aria-labelledby="your-link" style={{ ...CARD, marginTop: '48px' }}>
          <h2 id="your-link" style={{ ...H2, fontSize: 'var(--text-xl)', margin: '0 0 8px' }}>{school.kind === 'none' ? 'Make your school\'s own page' : 'This page for your school'}</h2>
          {school.kind === 'none' ? (
            <>
              <p style={P}>Type your school&apos;s name and this page, the text and the QR code are made for you, with a link we can count for your school. If you have a Guided Childhood school code, type that instead.</p>
              <form method="get" action={PACK_PATH} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <label htmlFor="school" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>School name or code</label>
                <input id="school" name="school" required minLength={2} maxLength={60} placeholder="Your school's name" autoComplete="organization"
                  style={{ flex: '1 1 240px', minHeight: '48px', padding: '0 14px', border: '1.5px solid var(--border)', borderRadius: '14px', fontSize: 'var(--text-md)', fontFamily: 'inherit', color: 'var(--ink)', background: 'var(--white)' }} />
                <button type="submit" className="btn btn-gold" style={{ minHeight: '48px' }}>Make our page</button>
              </form>
            </>
          ) : (
            <>
              <p style={P}>Share this page with colleagues, or bookmark it. {school.kind === 'linked' ? 'Families who start from your link are remembered as coming from your school.' : 'Visits from your link are counted for your school.'}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ink)', wordBreak: 'break-all', margin: '0 0 12px' }}>{packLink(school)}</p>
              <CopyText text={packLink(school)} label="Copy this page's link" track="parent-pack-copy-page" />
            </>
          )}
          <p style={{ ...SMALL, marginTop: '16px' }}>Guided Childhood also runs a digital literacy scheme for schools. <a href={process.env.SCHOOLS_SITE_URL || 'https://schools.guidedchildhood.com'} style={LINK}>See it here</a>.</p>
        </section>
      </main>
    </div>
  )
}
