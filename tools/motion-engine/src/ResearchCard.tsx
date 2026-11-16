import React, { useEffect, useRef } from 'react'
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { C, FONT, LOGO_BARS, MIN_TEXT_PX, SAFE } from './theme'
import { loadBrandFonts } from './fonts'
import type { StorySpec } from './spec'

loadBrandFonts()

// The motion language, in one place.
//
// One easing for everything: a long, soft deceleration with no overshoot, so
// nothing bounces. Text only ever moves on Y by a few pixels and fades; it is
// never scaled, rotated or blurred, so every glyph stays a sharp vector. Once
// an element lands its transform is removed entirely, so a resting word sits
// on whole pixels and cannot shimmer. Every word on the card has landed by
// frame 150 (5 seconds). After that the only thing that moves is the light.
const EASE = Easing.bezier(0.22, 1, 0.36, 1)
const RISE = 24 // pixels
const DUR = 26 // frames

export const BEATS = {
  eyebrow: 6,
  headline: 12,
  figure: 48,
  rule: 62,
  finding: 62,
  context: 88,
  divider: 108,
  source: 116,
  limitation: 128,
  object: 40,
  allLanded: 128 + DUR, // 154, just over 5 seconds
} as const

function rise(frame: number, start: number): React.CSSProperties {
  const t = interpolate(frame, [start, start + DUR], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE })
  if (t >= 1) return { opacity: 1 }
  const y = Math.round(RISE * (1 - t) * 100) / 100
  return { opacity: t, transform: `translate3d(0, ${y}px, 0)` }
}

function headlineSize(text: string) {
  const n = text.length
  if (n <= 42) return 84
  if (n <= 62) return 76
  if (n <= 84) return 68
  return 62
}

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 44, height: 44, background: C.gold, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3.4, height: 21 }}>
          {LOGO_BARS.map((h, i) => (
            <div key={i} style={{ width: 4.2, height: (h / 14) * 21, background: '#fff', borderRadius: 2 }} />
          ))}
        </div>
      </div>
      <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 30, color: C.ink, letterSpacing: '-0.02em' }}>Guided Childhood</div>
    </div>
  )
}

// The paper. A fixed noise tile, identical on every frame, so it can never
// flicker or crawl. Multiplied in at a few percent: felt, not seen.
function Paper() {
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.06 }}>
      <filter id="gc-paper" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.28  0 0 0 0.9 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#gc-paper)" />
    </svg>
  )
}

function NotForPublication() {
  const tiles = Array.from({ length: 7 })
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {tiles.map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', left: -200, top: 40 + i * 210, width: 1500, transform: 'rotate(-18deg)', textAlign: 'center',
              fontFamily: FONT.mono, fontWeight: 600, fontSize: 40, letterSpacing: '0.3em', color: 'rgba(170, 30, 30, 0.10)', whiteSpace: 'nowrap',
            }}
          >
            NOT FOR PUBLICATION  NOT FOR PUBLICATION
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 56, background: '#A8231E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 28, letterSpacing: '0.24em', color: '#fff' }}>NOT FOR PUBLICATION · TEST RENDER</div>
      </div>
    </>
  )
}

export const ResearchCard: React.FC<{ spec: StorySpec }> = ({ spec }) => {
  const frame = useCurrentFrame()
  const { durationInFrames, width, height } = useVideoConfig()
  const column = useRef<HTMLDivElement>(null)

  // Overflow is a failed render, never a clipped line. Checked on every frame
  // a human would see in the finished state.
  useEffect(() => {
    const el = column.current
    if (!el || frame < BEATS.allLanded || el.clientHeight === 0) return
    if (el.scrollHeight > el.clientHeight + 1) {
      throw new Error(`The words do not fit the card: the column needs ${el.scrollHeight}px and has ${el.clientHeight}px. Shorten the copy.`)
    }
  }, [frame])

  const light = interpolate(frame, [0, durationInFrames], [28, 38])
  const plateScale = interpolate(frame, [0, durationInFrames], [1, 1.045])
  const objectDrift = interpolate(frame, [0, durationInFrames], [0, -10])
  const ruleT = interpolate(frame, [BEATS.rule, BEATS.rule + 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE })
  const dividerT = interpolate(frame, [BEATS.divider, BEATS.divider + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE })
  const hSize = headlineSize(spec.headline)
  const top = SAFE.top + (spec.notForPublication ? 40 : 0)
  const contentW = width - SAFE.x * 2
  const hasObject = Boolean(spec.objectImage)

  return (
    <AbsoluteFill style={{ background: C.ivory, fontFamily: FONT.display, color: C.ink, WebkitFontSmoothing: 'antialiased' }}>
      {spec.backgroundVideo ? (
        <AbsoluteFill style={{ transform: `scale(${plateScale})` }}>
          <OffthreadVideo src={staticFile(spec.backgroundVideo)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </AbsoluteFill>
      ) : null}
      {/* The ivory wash keeps type contrast whatever the plate does. */}
      <AbsoluteFill style={{ background: spec.backgroundVideo ? 'rgba(246, 241, 231, 0.86)' : 'transparent' }} />
      <AbsoluteFill style={{ background: `radial-gradient(120% 90% at ${light}% 18%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%), radial-gradient(140% 120% at 50% 50%, rgba(0,0,0,0) 55%, ${C.ivoryDeep} 100%)` }} />
      <Paper />

      {hasObject ? (
        <Img
          src={staticFile(spec.objectImage as string)}
          style={{
            position: 'absolute', right: SAFE.x - 20, top: top + 360, width: 400, height: 400, objectFit: 'contain',
            opacity: interpolate(frame, [BEATS.object, BEATS.object + 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE }),
            transform: `translate3d(0, ${objectDrift}px, 0)`,
            filter: 'drop-shadow(0 30px 40px rgba(26, 26, 46, 0.16))',
          }}
        />
      ) : null}

      <div
        ref={column}
        style={{ position: 'absolute', left: SAFE.x, top, width: contentW, height: height - top - (SAFE.bottom + 96), display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <div style={{ ...rise(frame, BEATS.eyebrow), fontFamily: FONT.mono, fontWeight: 600, fontSize: MIN_TEXT_PX, letterSpacing: '0.18em', color: C.goldInk }}>
          {spec.eyebrow}
        </div>

        <div style={{ ...rise(frame, BEATS.headline), marginTop: 26, fontWeight: 850, fontSize: hSize, lineHeight: 1.06, letterSpacing: '-0.025em', textWrap: 'balance' }}>
          {spec.headline}
        </div>

        <div style={{ marginTop: 56, width: hasObject ? contentW - 380 : contentW }}>
          {spec.finding.figure ? (
            <div style={{ ...rise(frame, BEATS.figure), position: 'relative', display: 'inline-block' }}>
              <div style={{ fontWeight: 900, fontSize: 176, lineHeight: 1, letterSpacing: '-0.045em', fontVariantNumeric: 'tabular-nums lining-nums' }}>{spec.finding.figure}</div>
              <div style={{ height: 10, marginTop: 14, background: C.gold, borderRadius: 5, transformOrigin: 'left center', transform: ruleT >= 1 ? 'none' : `scaleX(${ruleT})` }} />
            </div>
          ) : null}
          <div style={{ ...rise(frame, BEATS.finding), marginTop: spec.finding.figure ? 30 : 0, fontWeight: 750, fontSize: 42, lineHeight: 1.18, letterSpacing: '-0.01em', textWrap: 'pretty' }}>
            {spec.finding.text}
          </div>
        </div>

        <div style={{ ...rise(frame, BEATS.context), marginTop: 28, fontWeight: 600, fontSize: 32, lineHeight: 1.3, color: C.inkSoft, textWrap: 'pretty', width: hasObject ? contentW - 380 : contentW }}>
          {spec.context}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ height: 2, background: C.hairline, transformOrigin: 'left center', transform: dividerT >= 1 ? 'none' : `scaleX(${dividerT})`, marginBottom: 26 }} />
        <div style={{ ...rise(frame, BEATS.source), fontFamily: FONT.mono, fontWeight: 500, fontSize: MIN_TEXT_PX, letterSpacing: '0.04em', color: C.ink, lineHeight: 1.3 }}>
          {spec.source}
        </div>
        <div style={{ ...rise(frame, BEATS.limitation), marginTop: 14, fontWeight: 600, fontSize: 30, lineHeight: 1.3, color: C.inkSoft }}>
          {spec.limitation}
        </div>
      </div>

      <div style={{ position: 'absolute', left: SAFE.x, right: SAFE.x, bottom: SAFE.bottom, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo />
        <div style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: MIN_TEXT_PX, letterSpacing: '0.06em', color: C.inkSoft }}>
          {spec.gdcPostNumber ? `GDC ${spec.gdcPostNumber}` : 'guidedchildhood.com'}
        </div>
      </div>

      {spec.notForPublication ? <NotForPublication /> : null}
    </AbsoluteFill>
  )
}
