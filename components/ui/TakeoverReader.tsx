'use client'

import Link from 'next/link'

// The Good Inside move, as one shared shell: on a phone the reader FILLS the
// screen, one thing at a time, big text, a single way back at the top. On
// desktop it renders as nothing at all and the page keeps its own layout.
//
// Justin, 1 September 2026: "when moments, scripts, digi, lessons are
// clicked on it fills the iPhone or mobile screen so they can read all info
// just like scripts or moments from Good Inside." Moments (MomentCard) and
// lessons (SlidePlayer) already take the screen; this shell brings the
// script reader level, and anything else that wants the same treatment
// wraps itself in it.
//
// CSS decides mobile versus desktop rather than JavaScript, so the server
// render and the first client paint always agree and nothing flashes.
// Anything inside carrying the class gc-takeover-hide disappears on mobile,
// which is how a page's own back row steps aside for the sheet's bar.

type Props = {
  backHref: string
  eyebrow: string
  children: React.ReactNode
}

export default function TakeoverReader({ backHref, eyebrow, children }: Props) {
  return (
    <div className="gc-takeover">
      <style>{`
        .gc-takeover-bar { display: none; }
        @media (max-width: 640px) {
          .gc-takeover {
            position: fixed; inset: 0; z-index: 120;
            background: var(--cream);
            overflow-y: auto; -webkit-overflow-scrolling: touch;
            animation: gc-takeover-in 0.28s ease-out;
            padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
          }
          .gc-takeover-bar {
            display: flex; align-items: center; gap: 10px;
            position: sticky; top: 0; z-index: 5;
            background: var(--cream);
            padding: calc(env(safe-area-inset-top, 0px) + 10px) 16px 10px;
            border-bottom: 2px solid var(--ink);
          }
          .gc-takeover-hide { display: none !important; }
        }
        @keyframes gc-takeover-in {
          from { transform: translateY(18px); opacity: 0.6; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gc-takeover { animation: none; }
        }
      `}</style>
      <div className="gc-takeover-bar">
        <Link
          href={backHref}
          aria-label="Back"
          style={{
            flexShrink: 0, width: 36, height: 36, borderRadius: '50%',
            background: '#fff', border: '2px solid var(--ink)', boxShadow: '0 3px 0 var(--ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            textDecoration: 'none', color: 'var(--ink)',
            fontSize: 'var(--text-lg)', fontWeight: 800, lineHeight: 1,
          }}
        >
          ‹
        </Link>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {eyebrow}
        </span>
      </div>
      {children}
    </div>
  )
}
