'use client'

import Link from 'next/link'
import FoldSection from '@/components/dashboard/FoldSection'
import ShareQrButton from '@/components/quests/ShareQrButton'
import { linkHealthLine, type LinkHealth } from '@/lib/kid/link-health'

// The child's app has gone off the child's phone, and nothing said so.
//
// Justin, 11 August 2026: "I've lost the app on my child's phone, deleted, and
// this may happen to users, so if we are able to see the app gone we can flag a
// quick share this code to put it back on the child's device."
//
// The child's side is a web page saved to a home screen, which is why it needs
// no install, no login and no app store. The cost is that it can be swiped away
// like any other icon, by a child tidying their screen, a phone being reset, or
// a new handset at Christmas, and nothing tells anybody. The parent side keeps
// looking healthy while the jobs, the earned minutes and the printables quietly
// stop.
//
// Folded to one line, because Justin's other ask in the same message was that
// Home stops being a stack of full cards: "one line explaining what it is and
// the ability to expand or reduce so it is not messy." The line carries the
// answer, the fix is one tap inside.
//
// It is an alert rather than a quiet fold. This is a family whose child side
// has stopped working, which is most of what they are paying for.

export default function ChildAppGone({
  health, childName, childId, days,
}: {
  health: LinkHealth
  childName?: string | null
  childId?: string | null
  days: number | null
}) {
  const line = linkHealthLine(health, childName, days)
  // Nothing to say unless it is genuinely gone, and nothing to offer without a
  // child to send it to. See link-health.ts for why the threshold is a month.
  if (!line || !childId) return null
  const who = childName && childName !== 'Your child' ? childName : 'your child'

  return (
    <div style={{ marginBottom: 12 }}>
      <FoldSection label={line.title} value="Send it again" alert count={1}>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
          {line.body}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {/* The code itself, which is what Justin asked for: the fastest way
              back is the child scanning it off the parent's screen, with both
              phones in the same room, which is where they usually are. */}
          <ShareQrButton childId={childId} childName={childName} label="Show the code" />
          <Link
            href="/dashboard/quests/manage#hand-it-over"
            style={{
              display: 'inline-flex', alignItems: 'center', textDecoration: 'none',
              background: '#fff', color: 'var(--ink)', border: '1.5px solid var(--border)',
              borderRadius: 12, padding: '11px 15px',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
            }}
          >
            Send {who} the link
          </Link>
        </div>
        {/* Nothing is lost, and saying so matters. A parent who thinks a month
            of stars has gone will not bother putting it back. */}
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '12px 0 0' }}>
          Their stars, their jobs and their streak are all still here. The page picks up exactly where it was.
        </p>
      </FoldSection>
    </div>
  )
}
