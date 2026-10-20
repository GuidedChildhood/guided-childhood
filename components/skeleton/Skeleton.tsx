// The pieces every route's loading.tsx is built from.
//
// The two loaders that already existed (app/(dashboard)/dashboard/loading.tsx
// and app/k/[token]/loading.tsx) set the rules, and this file only writes them
// down once so seven more routes can follow them:
//
//   A shape, not a spinner. A spinner says wait; a shape says your page is
//   coming and here is where things will be, and the eye has somewhere to rest.
//
//   One quiet tone throughout. Colour in a skeleton reads as content, and
//   content that shows for 200ms and vanishes reads as a glitch (Justin, 12
//   August 2026, on a butter circle that flashed between tabs).
//
//   No words on the glass, one polite "Loading" for a screen reader.
//
//   Still under prefers-reduced-motion: the same reassurance, no movement.
//
// Until now every parent route showed Home's shape and every child route showed
// the child home's column, because a nested route with no loader of its own
// borrows the nearest one up. So the lessons grid loaded as a greeting bubble
// and a tall Today card, then jumped. Each route now draws its own bones, in
// the real proportions of the page underneath, so nothing moves when it lands.
//
// Two tones because there are two grounds. 'parent' is the dashboard's grey
// block on the app background. 'kid' is the child loader's cream card with the
// ink edge, which is what still reads on a cream child screen.

import type { CSSProperties, ReactNode } from 'react'

export type BoneTone = 'parent' | 'kid'

const PULSE: Record<BoneTone, string> = {
  parent: 'gcBone 1.4s ease-in-out infinite',
  kid: 'gcBoneKid 1.4s ease-in-out infinite',
}

function toneStyle(tone: BoneTone): CSSProperties {
  return tone === 'kid'
    ? { background: 'var(--cream)', border: 'var(--edge)', opacity: 0.35, animation: PULSE.kid }
    : { background: 'var(--border)', opacity: 0.55, animation: PULSE.parent }
}

// One block. Width defaults to the full column; radius to a card's.
export function Bone({
  h, w = '100%', r = 'var(--radius-card)', mb = 14, tone = 'parent', style,
}: {
  h: number | string
  w?: number | string
  r?: number | string
  mb?: number
  tone?: BoneTone
  style?: CSSProperties
}) {
  return (
    <div
      aria-hidden
      style={{ height: h, width: w, borderRadius: r, marginBottom: mb, flexShrink: 0, ...toneStyle(tone), ...style }}
    />
  )
}

// A circle: an avatar, a buddy, a day disc.
export function Dot({ size, mb = 0, tone = 'parent' }: { size: number; mb?: number; tone?: BoneTone }) {
  return <Bone h={size} w={size} r="50%" mb={mb} tone={tone} />
}

// Lines of text, the last one short, the way a paragraph actually ends.
export function Lines({
  n, h = 14, gap = 9, last = '62%', mb = 14, tone = 'parent',
}: { n: number; h?: number; gap?: number; last?: string; mb?: number; tone?: BoneTone }) {
  return (
    <div aria-hidden style={{ marginBottom: mb }}>
      {Array.from({ length: n }, (_, i) => (
        <Bone key={i} h={h} w={i === n - 1 && n > 1 ? last : '100%'} r={6} mb={i === n - 1 ? 0 : gap} tone={tone} />
      ))}
    </div>
  )
}

// The page heading every parent route opens with: a mono eyebrow, a big
// heading, and a line or two under it.
export function HeadingBones({ lede = 2, tone = 'parent' }: { lede?: number; tone?: BoneTone }) {
  return (
    <div aria-hidden style={{ marginBottom: 18 }}>
      <Bone h={12} w={128} r={4} mb={10} tone={tone} />
      <Bone h={38} w="68%" r={10} mb={14} tone={tone} />
      <Lines n={lede} h={15} tone={tone} mb={0} />
    </div>
  )
}

// A row of pills: filter chips, stage chips, category chips.
export function ChipBones({ n = 5, h = 34, mb = 16, tone = 'parent' }: { n?: number; h?: number; mb?: number; tone?: BoneTone }) {
  const widths = [72, 96, 84, 108, 76, 90, 70]
  return (
    <div aria-hidden style={{ display: 'flex', gap: 8, overflow: 'hidden', marginBottom: mb }}>
      {Array.from({ length: n }, (_, i) => (
        <Bone key={i} h={h} w={widths[i % widths.length]} r="var(--radius-pill)" mb={0} tone={tone} />
      ))}
    </div>
  )
}

// The page frame: the column the real page uses, the screen reader line, and
// the one keyframes rule. Every loader wraps its bones in this.
export function SkeletonPage({
  children, style, className,
}: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return (
    <div className={className} style={style}>
      <span role="status" aria-live="polite" style={{
        position: 'absolute', width: 1, height: 1, overflow: 'hidden',
        clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap',
      }}>
        Loading
      </span>
      {children}
      <style>{`
        @keyframes gcBone { 0%,100% { opacity: .55 } 50% { opacity: .28 } }
        @keyframes gcBoneKid { 0%,100% { opacity: .35 } 50% { opacity: .18 } }
        @media (prefers-reduced-motion: reduce) {
          [style*="gcBone"] { animation: none !important }
        }
      `}</style>
    </div>
  )
}
