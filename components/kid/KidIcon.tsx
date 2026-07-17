// Simple, friendly, consistent icons for the child app, so the tiles and the
// star card read as one hand drawn set instead of a mix of phone emoji. All one
// 24 grid, rounded joins, filled shapes in the colour the parent passes, so
// they sit warm on our butter tints. A touch chunky and playful, for a young
// child, in our ink and butter, never a copy of another app's icon set.

export type KidIconName =
  | 'jobs' | 'time' | 'newjob' | 'deal'
  | 'star' | 'flame' | 'lessons' | 'printables'

export default function KidIcon({
  name, size = 26, color = 'currentColor',
}: {
  name: KidIconName
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
    // A star, filled and rounded, the whole reward loop in one mark.
    case 'star':
      return (
        <svg {...common} fill={color} stroke="none">
          <path d="M12 3.2l2.35 4.76 5.25.76-3.8 3.7.9 5.23L12 15.94l-4.7 2.47.9-5.23-3.8-3.7 5.25-.76z" />
        </svg>
      )
    // A cosy flame for the streak.
    case 'flame':
      return (
        <svg {...common} fill={color} stroke="none">
          <path d="M12.5 2.4c.3 2.5 1.9 3.6 3 5 .9 1.1 1.5 2.4 1.5 3.9a5 5 0 0 1-10 0c0-1.2.4-2.2 1.1-3.1.2 1 .9 1.6 1.8 1.8-.7-2.6.6-4.4 2.6-5.6-.4 1.1-.3 2 .3 2.8.5-1.7.1-3.2-1.3-4.8z" />
          <path d="M12 20.2a2.6 2.6 0 0 1-2.6-2.6c0-1.2.9-2 1.4-2.7.3.6.7.9 1.2 1.1-.2-1 .4-1.8 1.3-2.4-.1.7 0 1.2.4 1.7.6-.4 1.5.3 1.5 1.6A2.6 2.6 0 0 1 12 20.2z" fill="#fff" stroke="none" opacity="0.85" />
        </svg>
      )
    // A clipboard with a tick: my jobs.
    case 'jobs':
      return (
        <svg {...common}>
          <rect x="4.5" y="4.8" width="15" height="15.2" rx="3.4" fill={color} stroke="none" />
          <rect x="8.4" y="3" width="7.2" height="3.6" rx="1.8" fill={color} stroke="#fff" strokeWidth="1.4" />
          <path d="M8.4 13l2.4 2.4 4.8-4.8" stroke="#fff" strokeWidth="2.2" />
        </svg>
      )
    // A play mark in a soft square: use my time.
    case 'time':
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill={color} stroke="none" />
          <path d="M10 8.6v6.8l5.4-3.4z" fill="#fff" stroke="none" />
        </svg>
      )
    // A big plus with a sparkle: ask for a new job.
    case 'newjob':
      return (
        <svg {...common}>
          <circle cx="11" cy="13" r="8.4" fill={color} stroke="none" />
          <path d="M11 9v8M7 13h8" stroke="#fff" strokeWidth="2.4" />
          <path d="M19 3.4l.7 1.7 1.7.7-1.7.7-.7 1.7-.7-1.7-1.7-.7 1.7-.7z" fill={color} stroke="none" />
        </svg>
      )
    // A little scroll with a seal: our family deal.
    case 'deal':
      return (
        <svg {...common}>
          <rect x="4.6" y="3.6" width="11.8" height="16.8" rx="3" fill={color} stroke="none" />
          <path d="M7.6 8h5.8M7.6 11h5.8M7.6 14h3.4" stroke="#fff" strokeWidth="1.8" />
          <circle cx="16.4" cy="16.2" r="4.2" fill={color} stroke="#fff" strokeWidth="1.4" />
          <path d="M16.4 14.4l.5 1.05 1.15.15-.85.8.22 1.15-1.02-.57-1.02.57.22-1.15-.85-.8 1.15-.15z" fill="#fff" stroke="none" />
        </svg>
      )
    // A lightbulb: lessons.
    case 'lessons':
      return (
        <svg {...common}>
          <path d="M12 3.2a6 6 0 0 1 3.7 10.7c-.7.6-1.1 1.2-1.2 2H9.5c-.1-.8-.5-1.4-1.2-2A6 6 0 0 1 12 3.2z" fill={color} stroke="none" />
          <path d="M9.6 18.4h4.8M10.2 20.6h3.6" stroke={color} strokeWidth="2" />
        </svg>
      )
    // A printer: printables.
    case 'printables':
      return (
        <svg {...common}>
          <path d="M7 4.6h10v4H7z" fill={color} stroke="none" />
          <rect x="3.6" y="8.4" width="16.8" height="8.2" rx="2.6" fill={color} stroke="none" />
          <rect x="7" y="13.4" width="10" height="6" rx="1.6" fill="#fff" stroke="none" />
          <path d="M9 15.4h6M9 17.2h4" stroke={color} strokeWidth="1.5" />
          <circle cx="17" cy="11.2" r="1" fill="#fff" stroke="none" />
        </svg>
      )
  }
}
