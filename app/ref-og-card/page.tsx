/* eslint-disable @next/next/no-img-element */

// THE SHARE CARD, as a page so it can be rendered and re-rendered.
//
// Justin, 9 August 2026: "build image for me."
//
// This is the picture that appears when somebody pastes a Guided Childhood
// link into WhatsApp, LinkedIn or Facebook. There was none, and twitter.card
// was already set to summary_large_image, so every share rendered a blank grey
// rectangle with words under it. On a launch where the link IS the product,
// that is the most visible flaw there was.
//
// WHY A PAGE AND NOT A GENERATED IMAGE. Two reasons, and both are about the
// text. An image model spells brand names wrong often enough that it cannot be
// trusted with a wordmark, and it cannot use Nunito at all. Rendered here it
// is the real font, the real tokens and the real DiGi star from
// public/digi-squad, so the card cannot drift from the brand. It also means
// regenerating after a copy change is one screenshot, not a new asset hunt.
//
// Exactly 1200 by 630, the size every platform crops from. Screenshot the
// element with the og-card id and write it to public/og.png.
//
// 404s in production via middleware, like every other ref-* page.

export const dynamic = 'force-dynamic'

export default function RefOgCard() {
  return (
    <main style={{ background: '#666', padding: 20, minHeight: '100vh' }}>
      {/* globals.css sets body { zoom: 1.07 }, which is right on a phone and
          wrong here: it multiplied the card to 1285 by 675 on the first
          screenshot. Every platform crops share cards to 1200 by 630, so an
          off size image gets resampled and the type goes soft. Same trap the
          A4 printables hit, same fix. */}
      <style>{'body{zoom:1 !important}'}</style>
      <div
        id="og-card"
        style={{
          width: 1200, height: 630, position: 'relative', overflow: 'hidden',
          background: 'var(--cream)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 80px',
          boxSizing: 'border-box',
        }}
      >
        {/* A butter band down the right, so the card reads as ours at thumbnail
            size before a single word is legible. */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 380,
          background: 'var(--terracotta)',
        }} />
        <img
          src="/digi-squad/DiGi-star.svg"
          alt=""
          style={{ position: 'absolute', right: 60, top: 150, width: 330, height: 330, objectFit: 'contain' }}
        />

        <div style={{ position: 'relative', maxWidth: 700 }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--terracotta-dark)', margin: '0 0 22px',
          }}>
            Guided Childhood
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 74,
            lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--ink)', margin: '0 0 24px',
          }}>
            Digital parenting,<br />ages 4 to 16
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 29, lineHeight: 1.45,
            color: 'var(--ink-soft)', margin: 0, fontWeight: 500,
          }}>
            Screen time they earn. Lessons by age. No social media cliff edge.
          </p>
        </div>

        {/* A thick butter rule along the bottom, the same chunky edge the
            buttons have, so the card has a floor rather than fading out. */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 14, background: 'var(--terracotta-dark)' }} />
      </div>
    </main>
  )
}
