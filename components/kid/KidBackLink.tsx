'use client'

import { useRouter } from 'next/navigation'

// The way back to My quests, instantly.
//
// Justin, from the child app: "back button to quests feels clunky and slow."
// It was a plain server navigation to the heaviest page in the child app,
// which is rendered fresh on every visit. But the child almost always ARRIVED
// from that page, so the browser already holds it: going back through history
// restores it from the router cache in a frame instead of rebuilding it.
//
// The session flag is the safety catch. These subpages can also be opened
// cold from a shared link, where "back" would leave the app entirely, and a
// child must never be thrown out of their own space by the button that says
// My quests. The home screen sets the flag when it mounts, so the flag being
// present means home is genuinely behind us in this tab.
export const KID_HOME_SEEN_KEY = 'gc.kid.home.seen'

export default function KidBackLink({
  href,
  color,
  fontSize = 'var(--text-sm)',
}: {
  href: string
  color: string
  fontSize?: string
}) {
  const router = useRouter()
  return (
    <a
      href={href}
      onClick={e => {
        e.preventDefault()
        let fromHome = false
        try { fromHome = sessionStorage.getItem(KID_HOME_SEEN_KEY) === '1' } catch { /* private mode, fall through */ }
        if (fromHome && window.history.length > 1) router.back()
        else router.push(href)
      }}
      style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize,
        color, textDecoration: 'none', cursor: 'pointer',
      }}
    >
      ← My quests
    </a>
  )
}
