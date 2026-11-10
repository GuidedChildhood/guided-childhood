import Link from 'next/link'

// WHAT THE BOARD WILL SHOW, ON THE LESSON PAGE (10 November 2026).
//
// The lesson page described the lesson in words and showed none of it. The
// lesson itself is right there, so this frames its first slide, live, as the
// page's hero: a teacher sees the actual thing before deciding to teach it,
// and one tap anywhere on it opens it on the board.
//
// It is a picture, not a player. The frame takes no clicks and no keys (the
// link sits over the whole of it), it is hidden from assistive technology
// because the button beside it says the same thing in words, and it carries
// the same sandbox as the teach frame, so a deck never runs as this app. It
// also means the deck is already loaded when the teacher presses teach.

export default function DeckPreview({ src, href, title }: { src: string; href: string; title: string }) {
  return (
    <div className="gc-fr-preview">
      <iframe
        src={src}
        title=""
        aria-hidden
        tabIndex={-1}
        loading="lazy"
        sandbox="allow-scripts"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, pointerEvents: 'none' }}
      />
      <Link href={href} className="gc-fr-preview-go" aria-label={`Teach ${title} on the board`}>
        <span aria-hidden className="gc-fr-preview-play">▶</span>
      </Link>
      <style>{`
        .gc-fr-preview {
          position: relative; aspect-ratio: 16 / 9; width: 100%; overflow: hidden;
          border-radius: var(--radius-card); background: var(--ink);
          border: 1px solid var(--border);
          box-shadow: 0 1px 2px rgba(23,60,70,0.06), 0 24px 48px -24px rgba(23,60,70,0.45);
        }
        .gc-fr-preview-go {
          position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: flex-end;
          padding: var(--space-3); text-decoration: none;
        }
        .gc-fr-preview-play {
          display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px;
          border-radius: 50%; background: var(--terracotta); color: var(--ink); font-size: var(--text-lg);
          box-shadow: 0 5px 0 var(--terracotta-dark); padding-left: var(--space-1);
          transition: transform .18s cubic-bezier(0.22,1,0.36,1);
        }
        .gc-fr-preview-go:hover .gc-fr-preview-play { transform: scale(1.08); }
        .gc-fr-preview-go:active .gc-fr-preview-play { transform: translateY(3px); box-shadow: 0 2px 0 var(--terracotta-dark); }
        .gc-fr-preview-go:focus-visible { outline: 4px solid var(--terracotta); outline-offset: -4px; border-radius: var(--radius-card); }
        @media (prefers-reduced-motion: reduce) { .gc-fr-preview-play { transition: none; } .gc-fr-preview-go:hover .gc-fr-preview-play { transform: none; } }
      `}</style>
    </div>
  )
}
