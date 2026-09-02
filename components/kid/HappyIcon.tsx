'use client'

import { HAPPY } from '@/components/kid/HappyNewsBits'
import { CRAYON } from '@/components/printables/drawn/HappyPaper'

// The drawn icon set for the child app: ink lines, the printables' crayon
// fills, and a piece of story in each (a hand up, a heart in two hands, a
// phone tucked in bed) rather than a symbol. From the Happy Newspaper pass,
// design-refs/happy-newspaper-notes.md. Used by the home tiles, the five a
// day rows, the ask banner and the streak bar.

const INK = HAPPY.ink

export type HappyIconName =
  | 'time' | 'wins' | 'passport' | 'lessons' | 'deal' | 'make' | 'ask' | 'print' | 'games' | 'tell' | 'friends'
  | 'jobs' | 'quiz' | 'balance' | 'read' | 'homework' | 'move' | 'maths' | 'tidy' | 'kind' | 'phonebed'
  | 'hand' | 'cheer' | 'heart' | 'sprout' | 'flame' | 'calendar' | 'bag'


export default function HappyIcon({ name, size = 40 }: { name: HappyIconName; size?: number }) {
  const s = { width: size, height: size, viewBox: '0 0 64 64', fill: 'none', stroke: INK, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  switch (name) {
    case 'time':
      // A timer, and the job ticked beside it: time you earned.
      return (
        <svg {...s}>
          <circle cx="26" cy="36" r="20" fill={CRAYON.butter} />
          <path d="M20 12h12M26 12v4" />
          <path d="M26 24v12l8 5" strokeWidth="3.5" />
          <rect x="40" y="30" width="20" height="24" rx="5" fill="#fff" />
          <path d="M44 42l4 4 8-8" stroke={CRAYON.green} strokeWidth="4" />
          <path d="M44 42l4 4 8-8" strokeWidth="2" />
        </svg>
      )
    case 'wins':
      return (
        <svg {...s}>
          <path d="M20 12h24v14a12 12 0 0 1-24 0z" fill={CRAYON.butter} />
          <path d="M20 16h-8v4a8 8 0 0 0 8 8M44 16h8v4a8 8 0 0 1-8 8" />
          <path d="M32 38v8M24 52h16M28 46h8v6h-8z" fill={CRAYON.butter} />
          <path d="M32 18l2 4 4 .5-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.5z" fill="#fff" strokeWidth="2" />
        </svg>
      )
    case 'passport':
      return (
        <svg {...s}>
          <rect x="14" y="8" width="36" height="48" rx="6" fill={CRAYON.sky} />
          <path d="M22 8v48" />
          <circle cx="36" cy="30" r="9" fill="#fff" />
          <path d="M36 24l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill={CRAYON.coral} strokeWidth="2" />
          <path d="M28 46h16" />
        </svg>
      )
    case 'lessons':
      // An open book with a bulb lit over it: learn it, pass it.
      return (
        <svg {...s}>
          <path d="M8 24q12-4 24 2v30q-12-6-24-2z" fill={CRAYON.green} />
          <path d="M56 24q-12-4-24 2v30q12-6 24-2z" fill="#fff" />
          <path d="M38 34h10M38 41h10" strokeWidth="2.5" />
          <path d="M14 36h10M14 43h10" stroke="#fff" strokeWidth="2.5" />
          <path d="M32 4a9 9 0 0 0-5 16v3h10v-3a9 9 0 0 0-5-16z" fill={CRAYON.butter} />
          <path d="M29 26h6" />
          <path d="M14 10l3 3M50 10l-3 3M32 0v2" strokeWidth="2.5" stroke={CRAYON.coral} />
        </svg>
      )
    case 'deal':
      return (
        <svg {...s}>
          <rect x="14" y="8" width="30" height="42" rx="5" fill={CRAYON.paper} />
          <path d="M22 20h14M22 28h14M22 36h8" strokeWidth="2.5" />
          <circle cx="44" cy="44" r="11" fill={CRAYON.coral} />
          <circle cx="40" cy="42" r="1.4" fill={INK} stroke="none" /><circle cx="48" cy="42" r="1.4" fill={INK} stroke="none" />
          <path d="M39 47q5 4 10 0" strokeWidth="2.5" />
        </svg>
      )
    case 'make':
      return (
        <svg {...s}>
          <path d="M32 8c-14 0-24 10-24 22 0 9 6 14 12 14 5 0 6-4 10-4 3 0 5 2 5 5 0 5 4 9 9 6 8-5 12-14 12-21C56 18 46 8 32 8z" fill={CRAYON.paper} />
          <circle cx="20" cy="30" r="4" fill={CRAYON.coral} strokeWidth="2" />
          <circle cx="28" cy="19" r="4" fill={CRAYON.butter} strokeWidth="2" />
          <circle cx="41" cy="19" r="4" fill={CRAYON.green} strokeWidth="2" />
          <circle cx="48" cy="30" r="4" fill={CRAYON.sky} strokeWidth="2" />
        </svg>
      )
    case 'ask':
      // A hand holding up an idea card: the pitch, not the object.
      return (
        <svg {...s}>
          <rect x="22" y="6" width="34" height="26" rx="5" fill={CRAYON.paper} transform="rotate(-6 39 19)" />
          <path d="M31 14l1.5 3.4 3.7.4-2.8 2.5.8 3.6-3.2-1.9-3.2 1.9.8-3.6-2.8-2.5 3.7-.4z" fill={CRAYON.butter} strokeWidth="2" transform="rotate(-6 39 19)" />
          <path d="M40 15h10M40 21h8" strokeWidth="2.5" transform="rotate(-6 39 19)" />
          <path d="M14 58V40c0-6 4-10 10-10h4l6 4h8a4 4 0 0 1 0 8h-8" fill={CRAYON.coral} />
          <path d="M34 42h6a4 4 0 0 1 0 8h-6M34 50h4a4 4 0 0 1 0 8H24" fill={CRAYON.coral} />
          <path d="M14 40l-6 4v14h6" fill={CRAYON.coral} />
        </svg>
      )
    case 'print':
      // A crayon drawing a smiley on the paper: colour and do.
      return (
        <svg {...s}>
          <rect x="6" y="10" width="36" height="46" rx="4" fill="#fff" />
          <circle cx="24" cy="30" r="10" fill={CRAYON.butter} strokeWidth="2.5" />
          <circle cx="20.5" cy="28" r="1.4" fill={INK} stroke="none" /><circle cx="27.5" cy="28" r="1.4" fill={INK} stroke="none" />
          <path d="M20 33q4 3 8 0" strokeWidth="2.2" />
          <path d="M14 48h14" strokeWidth="3" stroke={CRAYON.sky} />
          <path d="M40 60l6-14 9 4-6 14z" fill={CRAYON.coral} />
          <path d="M46 46l9-20 9 4-9 20z" fill={CRAYON.coral} />
          <path d="M55 26l3-6 6 3-2 6" fill={CRAYON.paper} />
        </svg>
      )
    case 'games':
      return (
        <svg {...s}>
          <path d="M18 18h28a12 12 0 0 1 12 10l2 12a7 7 0 0 1-12.5 5L44 40H20l-3.5 5A7 7 0 0 1 4 40l2-12a12 12 0 0 1 12-10z" fill={CRAYON.sky} />
          <path d="M20 26v10M15 31h10" strokeWidth="3.5" />
          <circle cx="42" cy="28" r="3" fill={CRAYON.coral} strokeWidth="2" />
          <circle cx="48" cy="34" r="3" fill={CRAYON.butter} strokeWidth="2" />
        </svg>
      )
    case 'tell':
      return (
        <svg {...s}>
          <path d="M8 14h30a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H22l-9 8v-8H8a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6z" transform="translate(2 0)" fill={CRAYON.paper} />
          <path d="M40 26h12a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6h-2v7l-8-7h-2" fill={CRAYON.sky} />
          <path d="M25 33s-7-4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5-7 9-7 9z" fill={CRAYON.coral} strokeWidth="2" />
        </svg>
      )
    case 'jobs':
      // A clipboard with one job ticked and one to go.
      return (
        <svg {...s}>
          <rect x="12" y="10" width="40" height="48" rx="6" fill={CRAYON.paper} />
          <rect x="24" y="5" width="16" height="10" rx="4" fill={CRAYON.butter} />
          <circle cx="22" cy="28" r="4" fill={CRAYON.green} strokeWidth="2" /><path d="M20 28l1.5 1.5 3-3" strokeWidth="2" />
          <path d="M31 28h14" strokeWidth="2.5" />
          <circle cx="22" cy="42" r="4" fill="#fff" strokeWidth="2" />
          <path d="M31 42h10" strokeWidth="2.5" />
        </svg>
      )
    case 'quiz':
      // A speech bubble with a question mark and a star: today's quiz.
      return (
        <svg {...s}>
          <path d="M10 10h44a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6H28l-12 10V46h-6a6 6 0 0 1-6-6V16a6 6 0 0 1 6-6z" fill={CRAYON.sky} />
          <path d="M26 22a6 6 0 1 1 8 5.6c-1.6.7-2 1.6-2 3.4" strokeWidth="3.5" /><circle cx="32" cy="37" r="2" fill={INK} stroke="none" />
          <path d="M50 4l1.6 3.6 3.6 1.6-3.6 1.6L50 14.4l-1.6-3.6-3.6-1.6 3.6-1.6z" fill={CRAYON.butter} strokeWidth="2" />
        </svg>
      )
    case 'balance':
      // Scales: jobs on one side, screen on the other, level.
      return (
        <svg {...s}>
          <path d="M32 12v44M18 56h28" />
          <path d="M12 20h40" strokeWidth="3.5" />
          <path d="M6 36a8 8 0 0 0 16 0z" fill={CRAYON.butter} /><path d="M14 20l-8 16M14 20l8 16" strokeWidth="2" />
          <path d="M42 36a8 8 0 0 0 16 0z" fill={CRAYON.sky} /><path d="M50 20l-8 16M50 20l8 16" strokeWidth="2" />
          <circle cx="32" cy="12" r="4" fill={CRAYON.coral} strokeWidth="2" />
        </svg>
      )
    case 'read':
      // An open book with a bookmark: ten minutes reading.
      return (
        <svg {...s}>
          <path d="M8 16q12-4 24 2v36q-12-6-24-2z" fill={CRAYON.paper} />
          <path d="M56 16q-12-4-24 2v36q12-6 24-2z" fill="#fff" />
          <path d="M14 26h12M14 33h12M14 40h8M38 26h12M38 33h12M38 40h8" strokeWidth="2.5" />
          <path d="M44 6v18l4-3 4 3V6z" fill={CRAYON.coral} strokeWidth="2" />
        </svg>
      )
    case 'homework':
      // A pencil writing on a sheet: homework.
      return (
        <svg {...s}>
          <rect x="10" y="10" width="36" height="46" rx="5" fill="#fff" />
          <path d="M18 22h20M18 30h20M18 38h12" strokeWidth="2.5" />
          <path d="M34 50l16-30 8 4-16 30z" fill={CRAYON.butter} />
          <path d="M50 20l3-6 8 4-3 6" fill={CRAYON.coral} />
          <path d="M34 50l-2 8 7-4" fill={CRAYON.paper} />
        </svg>
      )
    case 'move':
      // A football mid bounce: get moving.
      return (
        <svg {...s}>
          <circle cx="32" cy="30" r="20" fill="#fff" />
          <path d="M32 18l8 6-3 9h-10l-3-9z" fill={CRAYON.sky} strokeWidth="2.5" />
          <path d="M32 18v-7M40 24l7-3M37 33l5 8M27 33l-5 8M24 24l-7-3" strokeWidth="2.5" />
          <path d="M14 58q18-6 36 0" strokeWidth="3.5" stroke={CRAYON.green} />
        </svg>
      )
    case 'maths':
      // Number blocks stacked: a bit of maths.
      return (
        <svg {...s}>
          <rect x="8" y="34" width="22" height="22" rx="4" fill={CRAYON.butter} />
          <rect x="34" y="34" width="22" height="22" rx="4" fill={CRAYON.sky} />
          <rect x="21" y="10" width="22" height="22" rx="4" fill={CRAYON.coral} />
          <text x="19" y="50" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="900" fontSize="15" fill={INK} stroke="none">1</text>
          <text x="45" y="50" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="900" fontSize="15" fill={INK} stroke="none">2</text>
          <text x="32" y="26" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="900" fontSize="15" fill={INK} stroke="none">3</text>
        </svg>
      )
    case 'tidy':
      // A basket with things going in: tidy up.
      return (
        <svg {...s}>
          <path d="M10 30h44l-4 24H14z" fill={CRAYON.butter} />
          <path d="M14 30a18 12 0 0 1 36 0" fill="none" strokeWidth="3" />
          <path d="M22 38v10M32 38v10M42 38v10" strokeWidth="2.5" />
          <circle cx="24" cy="14" r="6" fill={CRAYON.coral} strokeWidth="2" />
          <rect x="34" y="8" width="12" height="12" rx="3" fill={CRAYON.sky} strokeWidth="2" />
        </svg>
      )
    case 'kind':
      // A heart in two hands: something kind.
      return (
        <svg {...s}>
          <path d="M32 40s-14-9-14-19a8 8 0 0 1 14-5 8 8 0 0 1 14 5c0 10-14 19-14 19z" fill={CRAYON.coral} />
          <path d="M6 44c6-2 10 0 14 4 4 3 8 4 14 4 6-1 12-4 16-8" strokeWidth="3" />
          <path d="M6 44v12M58 44v12" strokeWidth="3" />
        </svg>
      )
    case 'phonebed':
      // A phone tucked in bed: screens off for a bit.
      return (
        <svg {...s}>
          <path d="M8 40h48v12H8z" fill={CRAYON.sky} />
          <path d="M12 40V26a4 4 0 0 1 4-4h8" strokeWidth="3" />
          <rect x="26" y="12" width="20" height="30" rx="5" fill={CRAYON.paper} />
          <path d="M31 22q3-2 6 0M35 22q3-2 6 0" strokeWidth="2" /><path d="M33 30q3 2 6 0" strokeWidth="2" />
          <text x="50" y="14" fontFamily="var(--font-display)" fontWeight="900" fontSize="12" fill={INK} stroke="none">z</text>
        </svg>
      )
    case 'hand':
      // A hand up: asked, waiting.
      return (
        <svg {...s}>
          <path d="M18 58V36c-4-6-8-14-8-18 0-3 4-4 6-1l6 10V12a3.5 3.5 0 0 1 7 0v12l2-16a3.5 3.5 0 0 1 7 1v15l3-12a3.5 3.5 0 0 1 7 1v13l2-6a3.5 3.5 0 0 1 7 1v20c0 10-6 17-14 17z" fill={CRAYON.butter} />
        </svg>
      )
    case 'cheer':
      // A star burst: they said yes.
      return (
        <svg {...s}>
          <path d="M32 6l6 14 15 1-11 10 3 15-13-8-13 8 3-15L11 21l15-1z" fill={CRAYON.butter} />
          <path d="M8 8l4 4M56 8l-4 4M6 40l5-2M58 40l-5-2M20 58l2-5M44 58l-2-5" strokeWidth="3" stroke={CRAYON.coral} />
        </svg>
      )
    case 'heart':
      return (
        <svg {...s}>
          <path d="M32 56S8 40 8 24a12 12 0 0 1 24-4 12 12 0 0 1 24 4c0 16-24 32-24 32z" fill={CRAYON.coral} />
        </svg>
      )
    case 'sprout':
      // A sprout in a pot: the jobs first, then it grows.
      return (
        <svg {...s}>
          <path d="M16 40h32l-4 18H20z" fill={CRAYON.coral} />
          <path d="M32 40V22" strokeWidth="3.5" />
          <path d="M32 26c-10 0-14-6-14-12 8 0 14 4 14 12z" fill={CRAYON.green} />
          <path d="M32 30c10 0 14-6 14-12-8 0-14 4-14 12z" fill={CRAYON.green} />
        </svg>
      )
    case 'flame':
      return (
        <svg {...s}>
          <path d="M34 6c1 8 6 11 9 15 3 4 5 8 5 13a16 16 0 0 1-32 0c0-4 1-7 3-10 1 3 3 5 6 6-2-8 2-14 9-18-1 3-1 6 1 8 2-5 1-10-1-14z" fill={CRAYON.coral} />
          <path d="M32 54a8 8 0 0 1-8-8c0-4 3-6 4-8 1 2 2 3 4 3-1-3 1-6 4-8 0 2 0 4 1 5 2-1 5 1 5 5a8 8 0 0 1-10 11z" fill={CRAYON.butter} strokeWidth="2" />
        </svg>
      )
    case 'calendar':
      // A wall calendar with today ringed: my calendar.
      return (
        <svg {...s}>
          <rect x="8" y="14" width="48" height="42" rx="6" fill="#fff" />
          <path d="M8 26h48" />
          <rect x="8" y="14" width="48" height="12" rx="6" fill={CRAYON.coral} />
          <path d="M20 8v10M44 8v10" strokeWidth="3.5" />
          <circle cx="20" cy="36" r="2.5" fill={INK} stroke="none" /><circle cx="32" cy="36" r="2.5" fill={INK} stroke="none" /><circle cx="44" cy="36" r="2.5" fill={INK} stroke="none" />
          <circle cx="20" cy="47" r="2.5" fill={INK} stroke="none" />
          <circle cx="32" cy="47" r="6" fill={CRAYON.butter} strokeWidth="2.5" />
        </svg>
      )
    case 'bag':
      // A school bag packed the night before.
      return (
        <svg {...s}>
          <path d="M14 24h36v26a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z" fill={CRAYON.sky} />
          <path d="M22 24v-6a10 10 0 0 1 20 0v6" strokeWidth="3.5" />
          <rect x="22" y="36" width="20" height="12" rx="4" fill={CRAYON.butter} />
          <path d="M32 36v12" strokeWidth="2.5" />
        </svg>
      )
    case 'friends':
      return (
        <svg {...s}>
          <circle cx="32" cy="34" r="16" fill={CRAYON.sky} />
          <path d="M8 40c6 8 40 8 48-6M12 30c8-8 34-8 44 0" strokeWidth="3.5" stroke={CRAYON.butter} />
          <path d="M8 40c6 8 40 8 48-6" strokeWidth="1.5" />
          <path d="M50 8l1.6 3.6 3.6 1.6-3.6 1.6L50 18.4l-1.6-3.6-3.6-1.6 3.6-1.6z" fill={CRAYON.butter} strokeWidth="2" />
          <circle cx="27" cy="31" r="1.6" fill={INK} stroke="none" /><circle cx="37" cy="31" r="1.6" fill={INK} stroke="none" />
          <path d="M27 38q5 4 10 0" strokeWidth="2.5" />
        </svg>
      )
  }
}

