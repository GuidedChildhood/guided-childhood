import Link from 'next/link'

// Real product, not promises: the 2026 conversion rule is that actual
// screenshots are the primary trust signal. Every image here is a real
// capture of the shipped product (the passport flip book, the bucket
// list builder's print sheet) or the real artwork families download
// (the printable previews on the CDN the app itself serves).

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'

const TILES = [
  {
    src: '/marketing/passport-mobile-stage.png',
    alt: 'The digital passport in the app: the Builder stage page with its progress circle filling',
    title: 'The passport they earn',
    sub: 'One page per stage, the circle fills as they learn, a stamp when the stage is done. The whole journey to 16 in a little book they want to finish.',
    tall: true,
  },
  {
    src: '/marketing/bucket-print-a4.png',
    alt: 'A bucket list the family built in the app, printed onto a drawn bucket to colour in',
    title: 'Bucket lists they build',
    sub: 'Pick the ideas together, print the bucket, colour it in. The finished page is worth stars toward their screen time.',
    tall: false,
  },
  {
    src: CDN + 'hf_20260713_125326_94438fa2-9760-4981-b058-205ea2623e2f.png',
    alt: 'The Kindness Bucket List printable, a hand drawn colouring sheet',
    title: 'The offline pathway',
    sub: 'A library of beautiful printables, in English and Spanish, every finished sheet handed back for stars.',
    tall: false,
  },
  {
    src: '/marketing/passport-mobile-earned.png',
    alt: 'An earned passport page: the Foundation stage stamped complete',
    title: 'Stamped, not nagged',
    sub: 'Progress a child can hold: lessons done, quests ticked, pages stamped. Screens earned, never fought over.',
    tall: true,
  },
]

export default function SeeInside() {
  return (
    <section aria-label="See inside the platform" style={{ padding: 'clamp(72px, 9vw, 112px) 32px', background: '#fff', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>See inside</p>
          <h2 className="fu" style={{ marginBottom: '14px' }}>
            This is the real thing,{' '}
            <span style={{ color: 'var(--terracotta)' }}>not a mockup</span>
          </h2>
          <p className="fu" style={{ fontSize: '1.02rem', color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '560px', margin: '0 auto' }}>
            Every picture below is the product as families use it today: the passport your child fills up, the bucket lists you print, the sheets that earn stars.
          </p>
        </div>

        <div className="see-inside-grid fu" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', alignItems: 'start' }}>
          {TILES.map(tile => (
            <figure key={tile.title} style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                borderRadius: '22px', overflow: 'hidden',
                border: '1.5px solid var(--border)',
                boxShadow: '0 18px 50px rgba(26,26,46,0.12)',
                background: '#fff',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tile.src}
                  alt={tile.alt}
                  loading="lazy"
                  style={{ width: '100%', display: 'block', aspectRatio: tile.tall ? '390 / 620' : '1 / 1', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
              <figcaption>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                  {tile.title}
                </div>
                <p style={{ fontSize: '.86rem', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '4px 0 0' }}>
                  {tile.sub}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="fu" style={{ textAlign: 'center', marginTop: '38px' }}>
          <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '15px', padding: '15px 32px' }}>
            Step inside, it is free
          </Link>
        </div>
      </div>
    </section>
  )
}
