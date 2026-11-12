import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MagnetGate from '@/components/marketing/MagnetGate'
import { TASTERS, getTaster, tasterMagnetSlug, tasterPreview, etsyUrl, fullPackLine } from '@/lib/magnets/tasters'

// A FREE TASTER, one page per printable pack (11 November 2026).
//
// Justin, 9 November: "Tasters free, full on Etsy." The Saturday post sends a
// follower here for two or three pages of a pack. The pages are shown ungated,
// as on /free/planet-post, so a parent (and Google) sees exactly what they
// get; the download is what asks for the email (MagnetGate, slug
// taster-<slug>), and the page then hands on to the stage check, where every
// freebie ends, and to the full pack on Etsy where there is one.
//
// One template, thirty one tasters, all read from
// content/printables/free-tasters.json. The two newspapers that already had
// pages (/free/planet-post, /free/guided-times) keep their own routes, which
// Next serves ahead of this one.

export const dynamicParams = false

export function generateStaticParams() {
  return TASTERS.map(t => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const t = getTaster(slug)
  if (!t) return {}
  return {
    title: `${t.title}: a free printable taster`,
    description: `${t.blurb} Free to print, ages ${t.ages}.`,
    alternates: { canonical: `/free/${t.slug}` },
    openGraph: { images: [tasterPreview(t.slug, 1)] },
    // A hold works by direct link but is not promoted, so search does not list it.
    ...(t.status === 'hold' ? { robots: { index: false, follow: true } } : {}),
  }
}

const WRAP: CSSProperties = { maxWidth: '860px', margin: '0 auto', padding: '44px 18px 80px' }
const EYEBROW: CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 10px' }
const H1: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 3rem)', letterSpacing: '-0.03em', lineHeight: 1.06, margin: '0 0 14px', color: 'var(--ink)' }
const P: CSSProperties = { fontSize: 'var(--text-md)', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 12px' }
const CARD: CSSProperties = { marginTop: 26, background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--lift)', padding: '22px 22px', textAlign: 'center' }
const CARD_H: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 6px' }

const TILT = [-1, 0.8, -0.6]

export default async function TasterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = getTaster(slug)
  if (!t) notFound()

  const etsy = etsyUrl(t)
  const n = t.pages.length
  const src = tasterMagnetSlug(t.slug)

  return (
    <div style={WRAP}>
      <p style={EYEBROW}>Free taster · ages {t.ages}</p>
      <h1 style={H1}>{t.title}</h1>
      <p style={P}>{t.blurb}</p>
      <p style={{ ...P, fontSize: 'var(--text-base)' }}>
        Here are {n} of the {t.pageCount} pages, free to print tonight. {fullPackLine(t)}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 22, margin: '30px 0 34px' }}>
        {t.pageNotes.map((pg, i) => (
          <figure key={pg.h} style={{ margin: 0 }}>
            <div style={{
              background: 'var(--white)', border: 'var(--edge)', borderRadius: 14, boxShadow: '0 5px 0 var(--ink)',
              padding: 8, transform: `rotate(${TILT[i % TILT.length]}deg)`,
            }}>
              <Image
                src={tasterPreview(t.slug, i + 1)}
                alt={`${t.title}, taster page ${i + 1}: ${pg.h}`}
                width={740} height={1047}
                sizes="(max-width: 760px) 100vw, 280px"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
                priority={i === 0}
              />
            </div>
            <figcaption style={{ marginTop: 14 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>
                {i + 1}. {pg.h}
              </span>
              <span style={{ display: 'block', fontSize: 'var(--text-base)', lineHeight: 1.55, color: 'var(--ink-soft)', marginTop: 3 }}>{pg.b}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <MagnetGate
        slug={src}
        heading="Get the free taster"
        sub={`${n} pages, A4, ready to print. We email it to you too.`}
      />

      {(etsy || t.inApp) && (
        <div style={CARD}>
          <p style={CARD_H}>Want the whole pack?</p>
          <p style={{ ...P, margin: '0 auto 16px', maxWidth: 480 }}>
            {etsy
              ? <>All {t.pageCount} pages are on Etsy, ready to print at home.{t.inApp ? ' Members print every pack free inside the app.' : ''}</>
              : <>All {t.pageCount} pages are free to print inside the Guided Childhood app, during the four free days and for members.</>}
          </p>
          {etsy && (
            <a href={etsy} target="_blank" rel="noopener noreferrer" className="btn" style={{ padding: '13px 26px', fontSize: 'var(--text-md)', border: '1.5px solid var(--border)' }}>
              See the full pack on Etsy
            </a>
          )}
        </div>
      )}

      <div style={CARD}>
        <p style={CARD_H}>Want the plan behind the paper?</p>
        <p style={{ ...P, margin: '0 auto 16px', maxWidth: 460 }}>
          Every printable is one piece of how Guided Childhood runs for real families. What stage is your child? Three questions, no sign up.
        </p>
        <Link href={`/starter-pack?src=${src}`} className="btn btn-gold" style={{ padding: '13px 26px', fontSize: 'var(--text-md)' }}>
          Find your child&apos;s stage
        </Link>
      </div>

      <p style={{ ...P, textAlign: 'center', marginTop: 26, fontSize: 'var(--text-base)' }}>
        <Link href="/free" style={{ color: 'var(--ink)', fontWeight: 700 }}>See every free printable</Link>
      </p>
    </div>
  )
}
