import { PAGE_SHELL } from '@gc/shared/page-scale'

// THE LOADING FALLBACK.
//
// A skeleton, not a spinner. A spinner says "something is happening"; a
// skeleton says "this is the shape of what is about to be here", and on a
// school laptop over a school connection the difference is whether the teacher
// waits or reloads. It also holds the page height, so nothing jumps when the
// real content arrives.
//
// It draws the shape every page in this app actually has, because that is the
// point: an eyebrow, a heading, two lines of standfirst, then cards. Guessing
// a different shape would be worse than a blank screen, since the layout would
// visibly rearrange itself the moment the page loaded.
//
// aria-hidden with a polite live region: a screen reader should hear "loading"
// once, not read out eleven grey rectangles.
const bar = (w: string, h: string) => ({
  width: w, height: h, borderRadius: 'var(--radius-tile)',
  background: 'linear-gradient(90deg, var(--border) 25%, var(--cream) 50%, var(--border) 75%)',
  backgroundSize: '400% 100%', animation: 'gc-shimmer 1.4s ease-in-out infinite',
})

export default function Loading() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <span className="sr-only" role="status" aria-live="polite">Loading</span>
      <div aria-hidden style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={bar('180px', '12px')} />
        <div style={{ ...bar('70%', '38px'), marginBottom: 'var(--space-2)' }} />
        <div style={bar('100%', '14px')} />
        <div style={{ ...bar('86%', '14px'), marginBottom: 'var(--space-5)' }} />
        {[0, 1, 2].map(i => <div key={i} style={{ ...bar('100%', '92px'), borderRadius: 'var(--radius-card)' }} />)}
      </div>
    </main>
  )
}
