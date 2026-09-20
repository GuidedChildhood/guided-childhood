'use client'

import { HAPPY, CRAYON } from '../happy-news'

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
  // ── THE JOBS A FAMILY ACTUALLY PUTS ON THE BOARD (16 September 2026) ────
  // Justin, holding two pages of The Happy Newspaper beside the jobs board:
  // "colours are right but the icons could be more happy news style like
  // attached."
  // The board was drawing the raw phone emoji, which is another company's
  // artwork sitting inside our circle plate, in another company's style,
  // rendering differently on every device a family owns. These are the
  // thirty odd jobs that are really on boards today, read out of the live
  // quests table rather than guessed, so the set covers what exists rather
  // than what a template file imagines.
  | 'teeth' | 'laundry' | 'shoes' | 'clothes' | 'dishes' | 'plug' | 'phone'
  | 'plate' | 'teddy' | 'sun' | 'pan' | 'bowl' | 'star' | 'tree' | 'bed'
  | 'ball' | 'paint' | 'car' | 'bin' | 'tv' | 'paw' | 'music' | 'shower' | 'bike'
  // ── THE LESSON OBJECTS (20 September 2026) ─────────────────────────────
  // Justin: "can we use happy news icons on lessons, since we have icons".
  // The schools Hub drew fourteen emoji on its tiles, another company's
  // artwork in another company's style; these are the objects a lesson and
  // its documents are actually about, in the same hand as the rest.
  | 'lock' | 'magnifier' | 'shield' | 'compass' | 'letters' | 'access'


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
      // A school rucksack, packed the night before.
      //
      // Redrawn 16 September 2026. The old one was a rounded body with a
      // half hoop handle over it and a small square latch on the front, which
      // is a padlock, or at best a handbag. "School bag packed" is one of the
      // most common jobs on a real board, so the picture has to be the thing a
      // child actually slings on: two shoulder straps, a flap over the top and
      // a pocket on the front.
      return (
        <svg {...s}>
          <path d="M14 26q0-12 18-12t18 12v24a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z" fill={CRAYON.sky} />
          <path d="M14 30q18-7 36 0" strokeWidth="3" />
          <path d="M24 16q-2-8 8-8t8 8" strokeWidth="3" fill="none" />
          <rect x="23" y="38" width="18" height="14" rx="4" fill={CRAYON.butter} />
          <path d="M23 44h18" strokeWidth="2.5" />
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

    // ── THE JOB ICONS ────────────────────────────────────────────────────
    // Same hand as everything above: the 64 grid, a 3px ink line that leads,
    // a crayon fill behind it and a bit of story rather than a symbol. Drawn
    // wobbly on purpose. A perfectly straight edge is the tell that a machine
    // made it, and the reference Justin held up has not got one on the page.

    case 'teeth':
      // Just the tooth, big, with the squeak of clean beside it.
      //
      // It carried a toothbrush across the corner first. At the 27px the plate
      // actually renders, the brush was four pixels of handle and read as a
      // pin stuck in it. A drawing you have to enlarge to understand is not an
      // icon, so the brush went and the tooth grew.
      return (
        <svg {...s}>
          <path d="M14 20q9-9 18-1 9-8 18 1 3 11-3 21-3 7-5 17-3 5-6 0l-4-15-4 15q-3 5-6 0-2-10-5-17-6-10-3-21z" fill="#fff" />
          <path d="M22 26q4 4 8 1" strokeWidth="2.5" stroke={CRAYON.teal} />
          <path d="M50 12l5-5M54 20h7M48 6l1 -5" strokeWidth="3" stroke={CRAYON.butter} />
        </svg>
      )
    case 'laundry':
      // A basket with the washing actually going in, not folded beside it.
      return (
        <svg {...s}>
          <path d="M12 30q20-4 40 0l-4 24q-16 3-32 0z" fill={CRAYON.teal} />
          <path d="M20 34v18M32 33v20M44 34v18" strokeWidth="2.5" />
          <path d="M14 38q18-3 36 0" strokeWidth="2.5" />
          <path d="M24 26q2-10 10-10t8 8" strokeWidth="3" fill={CRAYON.pink} />
          <path d="M30 8q5-4 10 0 4 4 0 8" fill={CRAYON.pink} strokeWidth="2.5" />
        </svg>
      )
    case 'shoes':
      // One trainer, put away rather than in the middle of the hall.
      return (
        <svg {...s}>
          <path d="M10 46q0-10 4-16l8 4 6-4 4 5q8 3 20 5 6 1 6 6v4q0 3-4 3H14q-4 0-4-3z" fill={CRAYON.coral} />
          <path d="M14 30l6 4M22 26l5 4M30 24l4 5" strokeWidth="2.5" />
          <path d="M12 48h44" strokeWidth="3" />
          <path d="M40 40q6 1 10 3" strokeWidth="2" stroke="#fff" />
        </svg>
      )
    case 'clothes':
      // A shirt on a hanger: dressed and ready.
      return (
        <svg {...s}>
          <path d="M22 20l10-5 10 5 12 7-6 9-6-3v23q-10 3-20 0V33l-6 3-6-9z" fill={CRAYON.butter} />
          <path d="M26 18q6 7 12 0" strokeWidth="3" />
          <path d="M26 44q6 2 12 0" strokeWidth="2.5" stroke={CRAYON.coral} />
        </svg>
      )
    case 'dishes':
      // A stack of clean plates, with the bubbles rising off them.
      //
      // The first attempt drew a plate half sunk in a bowl of water, which at
      // plate size was a blue shape with a circle on it and read as nothing at
      // all. A stack says washed up in one glance and survives being small,
      // which is the only test that counts here.
      return (
        <svg {...s}>
          <ellipse cx="28" cy="44" rx="21" ry="7" fill={CRAYON.sky} />
          <ellipse cx="28" cy="34" rx="18" ry="6" fill="#fff" />
          <ellipse cx="28" cy="25" rx="14" ry="5" fill={CRAYON.teal} />
          <path d="M7 44v4q0 5 21 5t21-5v-4" strokeWidth="3" />
          <circle cx="50" cy="14" r="5.5" fill="#fff" strokeWidth="2.5" />
          <circle cx="58" cy="24" r="3.4" fill="#fff" strokeWidth="2.5" />
          <circle cx="43" cy="6" r="2.8" fill="#fff" strokeWidth="2.5" />
        </svg>
      )
    case 'plug':
      // A plug with its two pins up and the cable curling away: on charge,
      // downstairs, where it belongs.
      //
      // It had a lightning mark across the body first, which at small size
      // came out as a letter z and made the whole thing look like a sleeping
      // phone. The pins and the cable are enough; nothing needs to explain
      // that a plug carries electricity.
      return (
        <svg {...s}>
          <path d="M20 24h24v12a12 12 0 0 1-24 0z" fill={CRAYON.butter} />
          <path d="M27 24V10M37 24V10" strokeWidth="4" />
          <path d="M32 48v4q0 6 8 6h6" strokeWidth="3.5" fill="none" />
          <circle cx="50" cy="58" r="4" fill={CRAYON.pink} strokeWidth="2.5" />
        </svg>
      )
    case 'phone':
      // A phone, face up and quiet.
      return (
        <svg {...s}>
          <rect x="18" y="8" width="28" height="48" rx="7" fill={CRAYON.pink} />
          <rect x="23" y="16" width="18" height="28" rx="3" fill="#fff" />
          <path d="M28 12h8" strokeWidth="2.5" />
          <circle cx="32" cy="50" r="2.6" fill={INK} stroke="none" />
          <path d="M28 26q4-3 8 0" strokeWidth="2.5" stroke={CRAYON.teal} />
        </svg>
      )
    case 'plate':
      // A plate with the knife and fork laid either side.
      return (
        <svg {...s}>
          <circle cx="32" cy="34" r="17" fill="#fff" />
          <circle cx="32" cy="34" r="9" strokeWidth="2.5" stroke={CRAYON.coral} />
          <path d="M8 16v16a4 4 0 0 0 8 0V16M12 16v34" strokeWidth="3" />
          <path d="M54 16q4 4 2 12l-2 2v20" strokeWidth="3" fill={CRAYON.butter} />
        </svg>
      )
    case 'teddy':
      // The teddy that goes back in the box at the end of the day.
      return (
        <svg {...s}>
          <circle cx="16" cy="16" r="7" fill={CRAYON.coral} />
          <circle cx="48" cy="16" r="7" fill={CRAYON.coral} />
          <circle cx="32" cy="26" r="15" fill={CRAYON.butter} />
          <path d="M20 42q12 8 24 0v8q0 6-6 6H26q-6 0-6-6z" fill={CRAYON.butter} />
          <circle cx="27" cy="24" r="1.8" fill={INK} stroke="none" />
          <circle cx="37" cy="24" r="1.8" fill={INK} stroke="none" />
          <path d="M28 31q4 3 8 0" strokeWidth="2.5" />
        </svg>
      )
    case 'sun':
      // A whole morning outside, with the rays drawn by hand.
      return (
        <svg {...s}>
          <circle cx="32" cy="32" r="13" fill={CRAYON.butter} />
          <path d="M32 6v8M32 50v8M6 32h8M50 32h8M14 14l6 6M44 44l6 6M50 14l-6 6M20 44l-6 6" strokeWidth="3.5" />
          <path d="M27 30q3-2 5 0M32 30q3-2 5 0" strokeWidth="2" />
          <path d="M27 36q5 4 10 0" strokeWidth="2.5" />
        </svg>
      )
    case 'pan':
      // A pan on the go, helping with dinner.
      return (
        <svg {...s}>
          <path d="M8 30h36v10q0 10-10 10H18q-10 0-10-10z" fill={CRAYON.sky} />
          <path d="M44 34h12q4 0 4-4t-4-4h-6" strokeWidth="3.5" />
          <path d="M6 30h40" strokeWidth="3.5" />
          <path d="M18 22q2-6 0-10M28 22q2-6 0-10M38 22q2-6 0-10" strokeWidth="2.5" stroke={CRAYON.pink} />
        </svg>
      )
    case 'bowl':
      // Breakfast eaten and cleared, spoon still in it.
      return (
        <svg {...s}>
          <path d="M8 32h48v6q0 14-14 14H22q-14 0-14-14z" fill={CRAYON.teal} />
          <path d="M6 32h52" strokeWidth="3.5" />
          <path d="M44 30l8-18" strokeWidth="3" />
          <ellipse cx="52" cy="10" rx="5" ry="7" fill={CRAYON.butter} strokeWidth="2.5" />
          <circle cx="22" cy="40" r="3" fill="#fff" strokeWidth="2" />
          <circle cx="33" cy="43" r="3" fill="#fff" strokeWidth="2" />
        </svg>
      )
    case 'star':
      // The plain star, for a job that is simply worth something.
      return (
        <svg {...s}>
          <path d="M32 6l7.5 15.4 16.5 2.4-12 11.6 2.9 16.6L32 44.2 17.1 52l2.9-16.6-12-11.6 16.5-2.4z" fill={CRAYON.butter} />
          <path d="M26 26l4 4" strokeWidth="2.5" stroke="#fff" />
        </svg>
      )
    case 'tree':
      // An hour outside, under something bigger than a screen.
      return (
        <svg {...s}>
          <path d="M32 6q12 4 14 14 8 4 6 13t-12 9H24q-10 0-12-9t6-13Q20 10 32 6z" fill={CRAYON.green} />
          <path d="M32 42v14" strokeWidth="3.5" />
          <path d="M20 58q12 4 24 0" strokeWidth="3" />
          <path d="M32 48l-7-5M32 52l7-5" strokeWidth="2.5" />
        </svg>
      )
    case 'bed':
      // The room tidy and the bed made, before the day is done.
      return (
        <svg {...s}>
          <path d="M8 34h48v14H8z" fill={CRAYON.pink} />
          <path d="M8 48v8M56 48v8" strokeWidth="3.5" />
          <path d="M8 34V20" strokeWidth="3.5" />
          <rect x="13" y="24" width="16" height="10" rx="4" fill="#fff" />
          <path d="M8 41h48" strokeWidth="2.5" stroke="#fff" />
        </svg>
      )
    case 'ball':
      // A proper kickabout.
      return (
        <svg {...s}>
          <circle cx="32" cy="32" r="21" fill="#fff" />
          <path d="M32 18l8 6-3 10H27l-3-10z" fill={CRAYON.sky} />
          <path d="M32 11v7M14 26l10 4M50 26l-10 4M21 49l6-8M43 49l-6-8" strokeWidth="2.5" />
        </svg>
      )
    case 'paint':
      // Making something real, with actual paint on it.
      return (
        <svg {...s}>
          <path d="M32 8q22 0 22 16 0 8-9 8h-5q-5 0-5 5 0 3 2 5t-5 6Q12 48 12 30 12 8 32 8z" fill={CRAYON.butter} />
          <circle cx="22" cy="21" r="3.6" fill={CRAYON.pink} strokeWidth="2" />
          <circle cx="33" cy="17" r="3.6" fill={CRAYON.teal} strokeWidth="2" />
          <circle cx="43" cy="21" r="3.6" fill={CRAYON.coral} strokeWidth="2" />
          <circle cx="20" cy="33" r="3.6" fill={CRAYON.sky} strokeWidth="2" />
        </svg>
      )
    case 'car':
      // Washing the car, a Saturday job worth real stars.
      return (
        <svg {...s}>
          <path d="M8 40q0-8 4-9l6-10q2-4 7-4h18q5 0 7 4l6 10q4 1 4 9v6H8z" fill={CRAYON.sky} />
          <path d="M18 31h28l-4-8q-1-2-4-2H26q-3 0-4 2z" fill="#fff" />
          <circle cx="19" cy="47" r="6" fill="#fff" />
          <circle cx="45" cy="47" r="6" fill="#fff" />
          <circle cx="53" cy="13" r="4" fill={CRAYON.teal} strokeWidth="2.5" />
        </svg>
      )
    case 'bin':
      // Bins out without being asked.
      return (
        <svg {...s}>
          <path d="M14 20h36l-4 34q0 4-4 4H22q-4 0-4-4z" fill={CRAYON.green} />
          <path d="M10 20h44" strokeWidth="3.5" />
          <path d="M26 14h12" strokeWidth="3.5" />
          <path d="M26 30v18M38 30v18" strokeWidth="2.5" />
        </svg>
      )
    case 'tv':
      // Finished screen time and handed it back.
      return (
        <svg {...s}>
          <rect x="8" y="16" width="48" height="32" rx="6" fill={CRAYON.coral} />
          <rect x="14" y="22" width="36" height="20" rx="3" fill="#fff" />
          <path d="M20 56l8-8M44 56l-8-8" strokeWidth="3.5" />
          <path d="M22 32q5-4 10 0" strokeWidth="2.5" stroke={CRAYON.teal} />
        </svg>
      )
    case 'paw':
      // Feed or walk the pet.
      return (
        <svg {...s}>
          <ellipse cx="32" cy="42" rx="14" ry="12" fill={CRAYON.butter} />
          <ellipse cx="15" cy="27" rx="6" ry="7.5" fill={CRAYON.butter} />
          <ellipse cx="26" cy="18" rx="6" ry="7.5" fill={CRAYON.butter} />
          <ellipse cx="38" cy="18" rx="6" ry="7.5" fill={CRAYON.butter} />
          <ellipse cx="49" cy="27" rx="6" ry="7.5" fill={CRAYON.butter} />
        </svg>
      )
    case 'music':
      // Ten minutes of practice.
      return (
        <svg {...s}>
          <path d="M26 46V14l24-6v32" strokeWidth="3.5" fill="none" />
          <ellipse cx="18" cy="47" rx="9" ry="7" fill={CRAYON.pink} />
          <ellipse cx="42" cy="41" rx="9" ry="7" fill={CRAYON.pink} />
          <path d="M26 22l24-6" strokeWidth="3" />
        </svg>
      )
    case 'shower':
      // In and out of the shower without being asked twice.
      return (
        <svg {...s}>
          <path d="M32 10v12" strokeWidth="3.5" />
          <path d="M14 26q6-12 18-12t18 12z" fill={CRAYON.sky} />
          <path d="M12 26h40" strokeWidth="3.5" />
          <path d="M20 34v6M30 36v8M40 34v6M25 44v6M36 46v6" strokeWidth="3" stroke={CRAYON.teal} />
        </svg>
      )
    case 'bike':
      // Bike, scoot or run about.
      return (
        <svg {...s}>
          <circle cx="15" cy="42" r="11" fill="#fff" />
          <circle cx="49" cy="42" r="11" fill="#fff" />
          <path d="M15 42l11-18h12l11 18" strokeWidth="3.5" fill="none" />
          <path d="M26 24h14" strokeWidth="3" stroke={CRAYON.pink} />
          <path d="M26 24l-4 18h20" strokeWidth="3" fill="none" />
          <path d="M38 20v-6h6" strokeWidth="3" />
        </svg>
      )
    case 'lock':
      // A padlock, shut: data protection, and what stays private.
      return (
        <svg {...s}>
          <rect x="15" y="27" width="34" height="28" rx="7" fill={CRAYON.butter} />
          <path d="M22 27v-7a10 10 0 0 1 20 0v7" />
          <circle cx="32" cy="39" r="3.5" fill={INK} />
          <path d="M32 42v6" strokeWidth="3.5" />
        </svg>
      )
    case 'magnifier':
      // A magnifying glass: checking a thing before trusting it.
      return (
        <svg {...s}>
          <circle cx="26" cy="26" r="15" fill={CRAYON.sky} />
          <path d="M18 22a9 9 0 0 1 6-6" stroke="#fff" strokeWidth="3" />
          <path d="M37 37l16 16" strokeWidth="6" />
        </svg>
      )
    case 'shield':
      // A shield with a tick: safeguarding, the grown up whose job it is.
      return (
        <svg {...s}>
          <path d="M32 7l21 7v16c0 13-8 22-21 27C19 52 11 43 11 30V14z" fill={CRAYON.green} />
          <path d="M22 32l7 7 13-14" strokeWidth="4" />
        </svg>
      )
    case 'compass':
      // A compass: the induction, which way to start.
      return (
        <svg {...s}>
          <circle cx="32" cy="32" r="23" fill={CRAYON.butter} />
          <path d="M32 12v4M32 48v4M12 32h4M48 32h4" />
          <path d="M41 23l-6 14-9 4 6-14z" fill={CRAYON.coral} />
          <circle cx="32" cy="32" r="2.5" fill={INK} />
        </svg>
      )
    case 'letters':
      // Three letter tiles: the vocabulary wall.
      return (
        <svg {...s}>
          <rect x="6" y="24" width="19" height="21" rx="4" fill={CRAYON.sky} />
          <rect x="23" y="16" width="19" height="21" rx="4" fill={CRAYON.butter} />
          <rect x="40" y="26" width="19" height="21" rx="4" fill={CRAYON.coral} />
          <path d="M11 40l4.5-11 4.5 11M13 36h5" strokeWidth="2.5" />
          <path d="M28 21v11M28 32a4 4 0 1 0 0-8" strokeWidth="2.5" />
          <path d="M53 33a4 4 0 1 0 0 8" strokeWidth="2.5" />
        </svg>
      )
    case 'access':
      // The symbol of access, drawn: every learner reaches the lesson.
      return (
        <svg {...s}>
          <circle cx="29" cy="11" r="4.5" fill={CRAYON.butter} />
          <path d="M29 18v14h13l6 13" strokeWidth="3.5" />
          <path d="M29 25h10" strokeWidth="3.5" />
          <path d="M22 28a13 13 0 1 0 17 17" strokeWidth="3.5" />
        </svg>
      )
  }
}

