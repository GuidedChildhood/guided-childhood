import Link from 'next/link'
import ShareQrButton from '@/components/quests/ShareQrButton'

// The half set up family. A parent can run the whole parent side and never
// realise the child has a side of their own, which is where most of the value
// actually is: the jobs are ticked there, the device time is earned there, the
// printables are asked for there.
//
// So while the child has never opened their app, Home says what they are
// missing and exactly where to go. It is not a toast and not a modal. It sits
// in the feed until it is true, then it is gone for good, because a setup step
// you can dismiss is a setup step you forget.
//
// Shown when there is no link at all AND when a link exists that has never been
// opened. A code sent and never scanned leaves the family in exactly the same
// place as one never sent.

export default function ChildAppNudge({ childName, childId }: { childName?: string | null; childId?: string | null }) {
  const name = childName && childName !== 'Your child' ? childName : null

  const point = (title: string, body: string) => (
    <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
      <span aria-hidden style={{
        flexShrink: 0, width: 7, height: 7, borderRadius: '50%',
        background: 'var(--terracotta-dark)', marginTop: 8,
      }} />
      <span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--ink)' }}>{title}</span>
        <span style={{ display: 'block', fontSize: 16.5, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 1 }}>{body}</span>
      </span>
    </li>
  )

  return (
    <div style={{ padding: '0 20px', maxWidth: 720, margin: '0 auto 16px' }}>
      <div style={{
        background: '#fff', border: '1.5px solid var(--terracotta)',
        borderRadius: 20, padding: '20px 20px 22px',
        boxShadow: '0 4px 22px rgba(26,26,46,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span aria-hidden style={{
            flexShrink: 0, width: 48, height: 48, borderRadius: 14, background: 'var(--terracotta-lt)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          }}>📲</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
              One thing left to set up
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 21, color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
              {name ? `${name} has a side of this too` : 'Your child has a side of this too'}
            </div>
          </div>
        </div>

        <p style={{ fontSize: 17.5, color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 14px', fontWeight: 600 }}>
          Press the button and the code appears. Point their phone or tablet at it and their app opens. Nothing to install, nothing to sign up for.
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 6px' }}>
          {point(
            'They earn their screen time',
            'Real world jobs, done away from a screen and ticked off in their app, are what buy device time. That is the whole balance, and it needs their side to work.',
          )}
          {point(
            'You see the balance as it happens',
            `Time on, time off screen, and whether it is sitting at a healthy level for ${name ? `${name}'s` : 'their'} age.`,
          )}
          {point(
            'Printables for the younger ones',
            'Too young to tick jobs on a phone. They ask for a sheet, you say yes, and they colour it at the table. It still counts.',
          )}
        </ul>

        {/* The code comes up here. A button that says share the QR code and
            then drops a parent on a page where they have to find it again is a
            button that lies, and it lost people at the one step the whole child
            side depends on. The link to Quests stays underneath for a parent
            who wants the rest of it. */}
        {childId ? (
          <ShareQrButton childId={childId} childName={childName} style={{ marginTop: 8 }} />
        ) : (
          <Link href="/dashboard/quests?tab=share" style={{
            display: 'inline-flex', alignItems: 'center', marginTop: 8,
            background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
            borderRadius: 16, padding: '14px 24px',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18,
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}>
            Share the QR code
          </Link>
        )}
        <p style={{ fontSize: 15, color: 'var(--ink-muted)', margin: '12px 0 0', lineHeight: 1.5 }}>
          <Link href="/dashboard/quests?tab=share" style={{ color: 'var(--ink-muted)' }}>
            The jobs, the code and the printables all live in Quests
          </Link>
        </p>
      </div>
    </div>
  )
}
