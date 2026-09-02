'use client'

import { useRouter } from 'next/navigation'
import { CloseCross } from '@/components/kid/HappyNewsBits'

// The way back, instantly, to wherever the child came from.
//
// Justin, from the child app, 2 September 2026: "the navigate button back is
// saying quests but should go back to where they came from and be a better
// closer button all over for back navigation and seems slow so make quicker."
//
// Earlier, on the same button: "back button to quests feels clunky and slow."
//
// WHY IT WAS SLOW. Two of the child's sub pages reached back with a plain
// Link to /k/{token}?tab=print, a server render of the heaviest page in the
// child app, fresh every time. But the child almost always ARRIVED from that
// page, so the browser already holds it: going back through history restores
// it from the router cache in a frame, on the same tab it was on, scrolled
// where it was. So every back on the child app goes through history when
// history is where they came from, and only pushes the fallback when it is
// not.
//
// WHY IT SAID THE WRONG THING. The label was "My quests" whether the child
// had come from the printables tab, the lessons tab or the road. Now it says
// Back, or shows the round cross every takeover on the child app wears, and
// the destination is simply the screen before this one.
//
// The session flag is the safety catch. These subpages can also be opened
// cold from a shared link, where "back" would leave the app entirely, and a
// child must never be thrown out of their own space by the button that says
// Back. The home screen sets the flag when it mounts, so the flag being
// present means home is genuinely behind us in this tab. A same origin
// referrer is the second witness, for a child who landed here from another
// of their own screens without passing home.
export const KID_HOME_SEEN_KEY = 'gc.kid.home.seen'

function cameFromOurs(): boolean {
  try {
    if (sessionStorage.getItem(KID_HOME_SEEN_KEY) === '1') return true
  } catch { /* private mode, fall through */ }
  try {
    return !!document.referrer && new URL(document.referrer).origin === window.location.origin
  } catch {
    return false
  }
}

export default function KidBackLink({
  href,
  color = 'var(--ink-soft)',
  fontSize = 'var(--text-base)',
  label = 'Back',
  variant = 'text',
  onClick,
}: {
  /** Where to go when there is nothing of ours behind us. */
  href: string
  color?: string
  fontSize?: string
  label?: string
  /** 'text' is the arrow and a word; 'close' is the round cross, top right of a takeover. */
  variant?: 'text' | 'close'
  onClick?: () => void
}) {
  const router = useRouter()
  function go(e: React.MouseEvent) {
    e.preventDefault()
    onClick?.()
    if (cameFromOurs() && window.history.length > 1) router.back()
    else router.push(href)
  }

  if (variant === 'close') {
    return (
      <a
        href={href}
        onClick={go}
        aria-label={label}
        style={{
          width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: '#fff', border: '2px solid var(--ink)', boxShadow: '0 3px 0 var(--ink)',
          cursor: 'pointer', textDecoration: 'none',
        }}
      >
        <CloseCross size={42} />
      </a>
    )
  }

  return (
    <a
      href={href}
      onClick={go}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize,
        color, textDecoration: 'none', cursor: 'pointer',
      }}
    >
      <span aria-hidden>←</span>{label}
    </a>
  )
}
