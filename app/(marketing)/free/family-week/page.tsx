import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MagnetGate from '@/components/marketing/MagnetGate'

// THE FAMILY WEEK PACK, free for an email (17 November 2026).
//
// Justin, from his own house: the TV asked for first thing, the room, hair and
// leaving on time, the front seat, homework, the reading record, and the school
// emails and ClassDojo posts that get missed. Every one of those is on these
// two sheets. The pages are shown ungated, as on /free/planet-post; the
// download asks for the email (MagnetGate, slug family-week), and the page
// hands on to the stage check, where every freebie ends.
//
// The honest line between free and paid: paper does all of this with a pen.
// The app fills it in for you (your own jobs, real Planet Friend progress,
// dates from forwarded school emails) and runs the stars and the timer.

export const metadata = {
  title: 'Free family week pack: a fridge star chart and school week planner · Guided Childhood',
  description: 'Two free fridge sheets for the morning and school week: a star chart with the jobs every house argues about, and Our school week with reading, homework, the front seat rota and a Sunday check.',
  openGraph: { images: ['/printables/free/family-week-p1.png'] },
}

const WRAP: CSSProperties = { maxWidth: '860px', margin: '0 auto', padding: '44px 18px 80px' }
const EYEBROW: CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 10px' }
const H1: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 3rem)', letterSpacing: '-0.03em', lineHeight: 1.06, margin: '0 0 14px', color: 'var(--ink)' }
const P: CSSProperties = { fontSize: 'var(--text-md)', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 12px' }

const FIGHTS = [
  { h: 'The TV, first thing', b: 'Dressed, breakfast, teeth, hair and shoes, then the TV if there is time. It is on the fridge, so it is not argued.' },
  { h: 'Out of the door on time', b: 'A leaving time in big numbers, and a star for being at the door with hair done and shoes on.' },
  { h: 'The front seat', b: 'A name for every day, written on Sunday. Taking turns, decided before anyone gets to the car.' },
  { h: 'Homework and the reading record', b: 'A tick a night for each child, and what is due written in the right day.' },
  { h: 'The bedroom floor', b: 'Room reset before tea, one star, every day. Small enough to actually happen.' },
  { h: 'The school emails we miss', b: 'Ten minutes on Sunday: ClassDojo, the school app, the emails, the bags. Nothing found on Friday.' },
]

const PAGES = [
  { n: 1, h: 'The star chart', b: 'Five morning and school jobs printed in, room for your own, and the Planet Friends to collect.' },
  { n: 2, h: 'Our school week', b: 'A column per child for reading and homework, the front seat rota, the morning order and the Sunday check.' },
]

export default function FamilyWeekPage() {
  return (
    <div style={WRAP}>
      <p style={EYEBROW}>Free printable · Family week pack</p>
      <h1 style={H1}>Six things every house argues about, settled on the fridge</h1>
      <p style={P}>
        The TV before school, the front seat, the reading record, the email from school nobody read. Two sheets, filled in together on Sunday, so the week is decided before it starts. For ages 4 to 12.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 22, margin: '30px 0 30px' }}>
        {PAGES.map((pg, i) => (
          <figure key={pg.n} style={{ margin: 0 }}>
            <div style={{ background: 'var(--white)', border: 'var(--edge)', borderRadius: 14, boxShadow: '0 5px 0 var(--ink)', padding: 8, transform: `rotate(${[-0.8, 0.8][i]}deg)` }}>
              <Image
                src={`/printables/free/family-week-p${pg.n}.png`}
                alt={`The family week pack, page ${pg.n}: ${pg.h}`}
                width={1074} height={1554}
                sizes="(max-width: 760px) 100vw, 420px"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
                priority={pg.n === 1}
              />
            </div>
            <figcaption style={{ marginTop: 14 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>{pg.n}. {pg.h}</span>
              <span style={{ display: 'block', fontSize: 'var(--text-base)', lineHeight: 1.55, color: 'var(--ink-soft)', marginTop: 3 }}>{pg.b}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 12, margin: '0 0 30px' }}>
        {FIGHTS.map(f => (
          <div key={f.h} style={{ background: 'var(--cream)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', padding: '14px 16px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: 4 }}>{f.h}</div>
            <div style={{ fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--ink-soft)' }}>{f.b}</div>
          </div>
        ))}
      </div>

      <MagnetGate
        slug="family-week"
        heading="Get the family week pack free"
        sub="Three A4 pages: the star chart, Our school week and gold stars to cut out. We email it to you too."
      />

      <div style={{ marginTop: 26, background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--lift)', padding: '22px 22px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 6px' }}>
          Want it filled in for you?
        </p>
        <p style={{ ...P, margin: '0 auto 16px', maxWidth: 480 }}>
          In the app the chart prints with your own jobs and your child&apos;s real Planet Friends, and the school dates you forward by email print straight onto the school week. Start with your child&apos;s stage: three questions, no sign up.
        </p>
        <Link href="/starter-pack?src=family-week" className="btn btn-gold" style={{ padding: '13px 26px', fontSize: 'var(--text-md)' }}>
          Find your child&apos;s stage
        </Link>
      </div>
    </div>
  )
}
