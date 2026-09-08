// The worries a parent picks at setup, drawn rather than listed.
//
// Same hand as the child app's KidIcon: one 24 grid, rounded joins, stroke in
// currentColor so a tile can tint the whole thing by setting colour on the
// plate. The rule from the Happy Newspaper teardown holds here too: the icon
// shows the SITUATION, not the object. Bedtime screens is a moon over a lit
// screen, not a phone. Mood after screens is a face, not a graph. A parent
// scanning ten tiles on a phone recognises their own evening faster from a
// scene than from a noun.
//
// Kept out of KidIcon because these are the parent's words about a hard
// evening, and that set is a child's reward loop. Two audiences, two sets.

export type WorryIconName =
  | 'wont_put_down' | 'bedtime_screens' | 'mood_after_screens'
  | 'controller_fights' | 'morning_tv' | 'asking_for_phone'
  | 'social_media' | 'ai_chatbots' | 'seen_something' | 'something_else'

export default function WorryIcon({
  name, size = 26, color = 'currentColor',
}: {
  name: WorryIconName
  size?: number
  color?: string
}) {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, strokeWidth: 2,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (name) {
    // A hand holding on to a slab. The grip is the worry, not the tablet.
    case 'wont_put_down':
      return (
        <svg {...common}>
          <rect x="7" y="2.5" width="10" height="14" rx="2" />
          <path d="M4.5 14.5v3.2c0 2.1 1.7 3.8 3.8 3.8h5.4" />
          <path d="M4.5 16.5h2.6" />
        </svg>
      )
    // A moon, and a screen still glowing under it.
    case 'bedtime_screens':
      return (
        <svg {...common}>
          <path d="M19.5 12.6A6.4 6.4 0 0 1 11.4 4.5a6.9 6.9 0 1 0 8.1 8.1z" />
          <rect x="4" y="16.5" width="9" height="5.5" rx="1.6" />
          <path d="M6.5 19h4" />
        </svg>
      )
    // A face that has had enough, and the little cloud over it.
    case 'mood_after_screens':
      return (
        <svg {...common}>
          <circle cx="12" cy="13.5" r="7.5" />
          <path d="M9.5 12.2h.01M14.5 12.2h.01" />
          <path d="M9.4 17.2c1.5-1.3 3.7-1.3 5.2 0" />
          <path d="M6.6 4.4c1.4-1 3.2-.6 4 .7" />
        </svg>
      )
    // A controller with the spark of the row it caused.
    case 'controller_fights':
      return (
        <svg {...common}>
          <path d="M7.5 9h9a4.5 4.5 0 0 1 4.5 4.5v.6a3.4 3.4 0 0 1-6.2 1.9l-.5-.8h-4.6l-.5.8A3.4 3.4 0 0 1 3 14.1v-.6A4.5 4.5 0 0 1 7.5 9z" />
          <path d="M7 12.4v1.7M6.1 13.2h1.8" />
          <circle cx="16.2" cy="12.6" r=".9" fill={color} stroke="none" />
          <path d="M12.8 2.5l-1.7 3h2.4l-1.7 3" />
        </svg>
      )
    // A screen, and the sun only just up behind it.
    case 'morning_tv':
      return (
        <svg {...common}>
          <rect x="3" y="8" width="18" height="11" rx="2.2" />
          <path d="M8.5 22h7" />
          <path d="M8.6 8V6.2M15.4 8V6.2" />
          <path d="M9 14.5a3 3 0 0 1 6 0" />
        </svg>
      )
    // A phone held up, and the question that comes with it.
    case 'asking_for_phone':
      return (
        <svg {...common}>
          <rect x="6" y="6.5" width="9" height="15.5" rx="2.2" />
          <path d="M9.6 19h1.8" />
          <path d="M17.4 3.2a1.9 1.9 0 0 1 1.7 2.9c-.5.8-1.4 1-1.4 2" />
          <path d="M17.7 11.1h.01" />
        </svg>
      )
    // A feed card with a heart on it. The counting is the worry.
    case 'social_media':
      return (
        <svg {...common}>
          <rect x="3.2" y="4.5" width="17.6" height="15" rx="2.6" />
          <path d="M3.2 9h17.6" />
          <path d="M12 17.2s-3.2-2-3.2-4.3a1.85 1.85 0 0 1 3.2-1.2 1.85 1.85 0 0 1 3.2 1.2c0 2.3-3.2 4.3-3.2 4.3z" />
          <path d="M6 6.7h.01M8.4 6.7h.01" />
        </svg>
      )
    // A friendly machine, talking back.
    case 'ai_chatbots':
      return (
        <svg {...common}>
          <rect x="3.5" y="7.5" width="17" height="11.5" rx="3" />
          <path d="M9 12.6h.01M15 12.6h.01" />
          <path d="M9.8 16h4.4" />
          <path d="M12 4v3.5" />
          <circle cx="12" cy="3" r="1.3" />
          <path d="M3.5 12.5H2M22 12.5h-1.5" />
        </svg>
      )
    // An eye, wide open, with an alarm beside it. Deliberately NOT the eye
    // with a line through it: that is the universal mark for hidden, and
    // the worry here is the opposite, that they saw it.
    case 'seen_something':
      return (
        <svg {...common}>
          <path d="M2.2 13.4s3.4-5.6 8.8-5.6 8.8 5.6 8.8 5.6-3.4 5.6-8.8 5.6-8.8-5.6-8.8-5.6z" />
          <circle cx="11" cy="13.4" r="2.5" />
          <path d="M19.6 3v4.2" />
          <path d="M19.6 9.6h.01" />
        </svg>
      )
    // Something else: the parent's own words, waiting to be said.
    case 'something_else':
    default:
      return (
        <svg {...common}>
          <path d="M20.5 14.6a2.4 2.4 0 0 1-2.4 2.4H8.3L4 20.6V6a2.4 2.4 0 0 1 2.4-2.4h11.7A2.4 2.4 0 0 1 20.5 6z" />
          <path d="M8.7 10.3h.01M12.1 10.3h.01M15.5 10.3h.01" />
        </svg>
      )
  }
}
