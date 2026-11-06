import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MagnetGate from '@/components/marketing/MagnetGate'

// THE GUIDED TIMES, the free taster (6 November 2026).
//
// Justin: the paid newspaper also goes on the Instagram carousel, free for an
// email, as a taster rather than the whole issue. Four pages of Issue 1, the
// Christmas edition, shown here ungated like the Planet Post, so a parent sees
// exactly what they get; the PDF asks for the email. The full issue sells on
// Etsy, and like every freebie this page ends at the stage check.
// Built by content/printables/guided-times/build.mjs; plan in
// plans/2026-11-05-paid-happy-news-newspaper-plan.md.

export const metadata = {
  title: 'The Guided Times: a free Christmas newspaper taster for kids · Guided Childhood',
  description: 'Four free pages of The Guided Times, a newspaper for kids aged 6 to 11 about setting up a new tablet, console or phone together this Christmas. A new screen ID card, puzzles and the Christmas morning plan.',
  openGraph: { images: ['/printables/free/guided-times-1-taster-p1.png'] },
}

const WRAP: CSSProperties = { maxWidth: '860px', margin: '0 auto', padding: '44px 18px 80px' }
const EYEBROW: CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', margin: '0 0 10px' }
const H1: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 3rem)', letterSpacing: '-0.03em', lineHeight: 1.06, margin: '0 0 14px', color: 'var(--ink)' }
const P: CSSProperties = { fontSize: 'var(--text-md)', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 12px' }

const PAGES = [
  { n: 1, h: 'The front page', b: 'Something new under the tree? The Planet Friends on setting up a new screen together.' },
  { n: 2, h: 'My new screen’s ID card', b: 'Its name, where it sleeps, its bedtime, the first three apps and the family’s protected times, filled in together.' },
  { n: 3, h: 'Orbit’s Christmas puzzles', b: 'Real or pretend messages, a word search, a code to crack and a maze, with the answers upside down.' },
  { n: 4, h: 'The Christmas morning plan', b: 'Six things to do together before a new tablet, console or phone is switched on.' },
]

export default function GuidedTimesTaster() {
  return (
    <main style={WRAP}>
      <p style={EYEBROW}>Free taster · The Guided Times, Issue 1</p>
      <h1 style={H1}>A newspaper for kids getting a new screen this Christmas</h1>
      <p style={P}>
        Four free pages for ages 6 to 11. Your child fills in their new screen&apos;s ID card, does Orbit&apos;s puzzles, and you agree the Christmas morning plan together before anything is switched on.
      </p>
      <p style={{ margin: '0 0 8px' }}>
        <a href="#get-it" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)' }}>Send it to me</a>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 22, margin: '26px 0 34px' }}>
        {PAGES.map((pg, i) => (
          <figure key={pg.n} style={{ margin: 0 }}>
            <div style={{
              background: 'var(--white)', border: 'var(--edge)', borderRadius: 14, boxShadow: '0 5px 0 var(--ink)',
              padding: 8, transform: `rotate(${[-1, 0.8, -0.6, 1][i]}deg)`,
            }}>
              <Image
                src={`/printables/free/guided-times-1-taster-p${pg.n}.png`}
                alt={`The Guided Times taster, page ${pg.n}: ${pg.h}`}
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

      <div id="get-it">
        <MagnetGate
          slug="guided-times-taster"
          heading="Get the four pages free"
          sub="A4 and US Letter, ready to print. We email it to you too."
        />
      </div>

      <p style={{ ...P, marginTop: 22, textAlign: 'center' }}>
        The full twelve page issue, with the big question, the app desk, the homework helper and a page turning version for any screen, is The Guided Times in our Etsy shop, GuidedChildhood.
      </p>

      <div style={{
        marginTop: 18, background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--lift)', padding: '22px 22px', textAlign: 'center',
      }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 6px' }}>
          What stage is your child?
        </p>
        <p style={{ ...P, margin: '0 auto 16px', maxWidth: 460 }}>
          The three kinds of time on the ID card are how Guided Childhood runs for real families. Three questions, no sign up.
        </p>
        <Link href="/starter-pack?src=guided-times-taster" className="btn btn-gold" style={{ padding: '13px 26px', fontSize: 'var(--text-md)' }}>
          Find your child&apos;s stage
        </Link>
      </div>
    </main>
  )
}
