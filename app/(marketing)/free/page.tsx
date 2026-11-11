import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { listedTasters, tasterPreview } from '@/lib/magnets/tasters'

// The free printables, in one place (13 October 2026; every taster added 11
// November 2026). The two free newspapers lead, whole things to print and do.
// Under them, a free taster of every printable pack: two or three pages for an
// email, the full pack on Etsy and in the app (Justin, 9 November: "Tasters
// free, full on Etsy"). The tasters come from content/printables/free-tasters.json,
// so a new pack joins this page by joining that file.

export const metadata = {
  title: 'Free printables for kids and screens',
  description: 'Free, print at home activities that help kids and grown ups get screen time right together, and a free taster of every printable pack.',
}

const NEWSPAPERS = [
  {
    href: '/free/guided-times', img: '/printables/free/guided-times-1-taster-p1.png',
    title: 'The Guided Times, the free taster', sub: 'Four pages of our Christmas newspaper for kids: a new screen ID card, puzzles and the Christmas morning plan. Ages 6 to 11.',
  },
  {
    href: '/free/planet-post', img: '/printables/free/planet-post-1-p1.png',
    title: 'The Planet Post, Issue 1', sub: 'A four page newspaper for kids about how screens work in your house. Ages 6 to 11.',
  },
]

const H1: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 2.8rem)', letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 0 12px', color: 'var(--ink)' }
const H2: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em', lineHeight: 1.15, margin: '44px 0 8px', color: 'var(--ink)' }
const EYEBROW: CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 10px' }
const LEAD: CSSProperties = { fontSize: 'var(--text-md)', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 26px' }
const TILE: CSSProperties = { textDecoration: 'none', color: 'var(--ink)', background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--lift)', padding: 12, display: 'block' }
const IMG: CSSProperties = { width: '100%', height: 'auto', display: 'block', borderRadius: 8, border: '1.5px solid var(--border)' }
const TILE_TITLE: CSSProperties = { display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', marginTop: 12 }
const TILE_SUB: CSSProperties = { display: 'block', fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--ink-soft)', marginTop: 4 }

export default function FreePrintables() {
  const tasters = listedTasters()
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '44px 18px 80px' }}>
      <p style={EYEBROW}>Free printables</p>
      <h1 style={H1}>Print it, do it together</h1>
      <p style={LEAD}>
        Free things for kids to read, colour and fill in, each one a small step to getting screens right in your house.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 20 }}>
        {NEWSPAPERS.map(f => (
          <Link key={f.href} href={f.href} style={TILE}>
            <Image src={f.img} alt="" width={740} height={1000} sizes="(max-width: 760px) 100vw, 300px" style={IMG} />
            <span style={TILE_TITLE}>{f.title}</span>
            <span style={TILE_SUB}>{f.sub}</span>
          </Link>
        ))}
      </div>

      <h2 style={H2}>A free taster of every pack</h2>
      <p style={LEAD}>
        Two or three pages of each printable pack, free to print tonight. If it earns its place on the fridge, the full pack is on Etsy, and free inside the app for members.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))', gap: 14 }}>
        {tasters.map(t => (
          <Link key={t.slug} href={`/free/${t.slug}`} style={TILE}>
            <Image src={tasterPreview(t.slug, 1)} alt="" width={740} height={1047} sizes="(max-width: 760px) 50vw, 220px" style={IMG} />
            <span style={{ ...TILE_TITLE, fontSize: 'var(--text-md)' }}>{t.title}</span>
            <span style={TILE_SUB}>Ages {t.ages} · {t.pages.length} free pages</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
