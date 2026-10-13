import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MagnetGate from '@/components/marketing/MagnetGate'

// THE PLANET POST, the free download page (13 October 2026).
//
// The first of the five free Happy News printables Justin approved
// (plans/2026-10-13-free-printables-lead-magnets-plan.md). Every page shows
// here ungated, so a parent (and Google) sees exactly what they get; the PDF
// is what asks for the email, the way the registry intends. The download
// then hands on to the stage check, which is where every freebie ends.

export const metadata = {
  title: 'The Planet Post: a free screen time newspaper for kids · Guided Childhood',
  description: 'A free four page newspaper for kids aged 6 to 11 that explains how screen time works in your house, before the argument starts. Print it, colour it, sign the screen promise together.',
  openGraph: { images: ['/printables/free/planet-post-1-p1.png'] },
}

const WRAP: CSSProperties = { maxWidth: '860px', margin: '0 auto', padding: '44px 18px 80px' }
const EYEBROW: CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 10px' }
const H1: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 3rem)', letterSpacing: '-0.03em', lineHeight: 1.06, margin: '0 0 14px', color: 'var(--ink)' }
const P: CSSProperties = { fontSize: 'var(--text-md)', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 12px' }

const PAGES = [
  { n: 1, h: 'The front page', b: 'Why a good day is a rainbow, and a day wheel to colour in. DiGi is the editor.' },
  { n: 2, h: 'Three jars of screen time', b: 'Mine every day, earned with stars, and nobody’s. Plus Bloop on why phones go to bed too.' },
  { n: 3, h: 'Real or pretend?', b: 'Orbit’s detective corner on messages, a screen free word search, and tomorrow’s happy headline.' },
  { n: 4, h: 'The back page', b: 'Jobs that earn stars, family jobs just for helping, and a screen promise to sign together.' },
]

export default function PlanetPostPage() {
  return (
    <div style={WRAP}>
      <p style={EYEBROW}>Free printable · Issue 1</p>
      <h1 style={H1}>A newspaper for kids that explains how screen time works in your house</h1>
      <p style={P}>
        Before the argument starts. The Planet Post is four pages your child reads, colours in and fills in, for ages 6 to 11 (younger ones with you beside them). It ends with a screen promise you both sign.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 22, margin: '30px 0 34px' }}>
        {PAGES.map((pg, i) => (
          <figure key={pg.n} style={{ margin: 0 }}>
            <div style={{
              background: '#fff', border: 'var(--edge)', borderRadius: 14, boxShadow: '0 5px 0 var(--ink)',
              padding: 8, transform: `rotate(${[-1, 0.8, -0.6, 1][i]}deg)`,
            }}>
              <Image
                src={`/printables/free/planet-post-1-p${pg.n}.png`}
                alt={`The Planet Post, page ${pg.n}: ${pg.h}`}
                width={740} height={1000}
                sizes="(max-width: 760px) 100vw, 420px"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
                priority={pg.n === 1}
              />
            </div>
            <figcaption style={{ marginTop: 14 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>
                {pg.n}. {pg.h}
              </span>
              <span style={{ display: 'block', fontSize: 'var(--text-base)', lineHeight: 1.55, color: 'var(--ink-soft)', marginTop: 3 }}>{pg.b}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <MagnetGate
        slug="planet-post-1"
        heading="Get The Planet Post free"
        sub="A4 and US Letter, an ink saver version, and a fold up booklet. We email it to you too."
      />

      <div style={{
        marginTop: 26, background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--lift)', padding: '22px 22px', textAlign: 'center',
      }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 6px' }}>
          Want the plan behind the paper?
        </p>
        <p style={{ ...P, margin: '0 auto 16px', maxWidth: 460 }}>
          The three jars and the jobs are how Guided Childhood runs for real families. What stage is your child? Three questions, no sign up.
        </p>
        <Link href="/starter-pack?src=planet-post-1" className="btn btn-gold" style={{ padding: '13px 26px', fontSize: 'var(--text-md)' }}>
          Find your child&apos;s stage
        </Link>
      </div>
    </div>
  )
}
