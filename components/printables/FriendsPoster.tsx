import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'
import { FRIEND_STREAKS } from '@/lib/pathway/streak-unlock'

// THE PLANET FRIENDS POSTER.
//
// Justin, 8 August 2026: "let's give away of printing a poster sticker sheet
// from achieving these."
//
// A Planet Friend arrives about five times in a childhood and, until now, lived
// entirely inside a phone. A thing that rare should end up on a wall. This is
// the sheet that gets it there: the ones a child has actually brought home in
// full colour, the ones still to come in line art with the exact price on them,
// and their own name across the top.
//
// TWO THINGS IN ONE SHEET, and that is deliberate rather than a compromise.
// Earned Friends print in colour to be cut out and stuck up, and the locked
// ones print as the colouring art we already draw for every character, so a
// child can colour Bloop in while they are working towards Bloop. The reward
// and the target on one page, which is the whole shape of the ladder.
//
// NOTHING IS INVENTED HERE. The costs come from FRIEND_STREAKS, the same array
// the app and the sticker book read, so a poster on a fridge cannot disagree
// with the screen. That mattered today: a child was shown four Friends they had
// not earned, and a printed sheet saying the same thing is a wrong number you
// cannot take back.
//
// The print rules below are the ones the curriculum sheet paid for in blood:
// millimetres not pixels, height not min-height, box-sizing on the children,
// and cancel the app's body zoom or 297mm arrives at the printer as 317.8mm.

const INK = '#1A1A2E'
const SOFT = '#52526A'
const GOLD = '#C99A28'

export type FriendsPosterProps = {
  childName: string | null
  /** Completed full days. The one currency Friends are bought with. */
  fullDays: number
}

export default function FriendsPoster({ childName, fullDays }: FriendsPosterProps) {
  const name = childName && childName !== 'Your child' ? childName : null
  const days = Math.max(0, fullDays)
  const earnedCount = FRIEND_STREAKS.filter(n => days >= n).length

  return (
    <div className="fp-sheet">
      <style>{`
        @page { size: A4 portrait; margin: 0; }

        .fp-sheet {
          width: 210mm;
          /* height, not min-height, for the reason written at length on the
             curriculum sheet: a floor lets the page grow past the paper. */
          height: 297mm;
          padding: 15mm 15mm 12mm;
          margin: 0 auto;
          background: #fff;
          color: ${INK};
          font-family: var(--font-body, Nunito, system-ui, sans-serif);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .fp-sheet *, .fp-sheet *::before, .fp-sheet *::after { box-sizing: border-box; }

        @media screen {
          .fp-sheet {
            box-shadow: 0 10px 40px -12px rgba(26,26,46,0.28);
            border-radius: 3px;
            margin-bottom: 28px;
          }
        }

        /* A4 is 210mm and a phone is not. zoom, not transform, because zoom
           changes the layout box: a transform would look right and still
           reserve 210mm, which is sideways scroll on the body. */
        @media screen and (max-width: 860px) { .fp-sheet { zoom: 0.82 } }
        @media screen and (max-width: 700px) { .fp-sheet { zoom: 0.66 } }
        @media screen and (max-width: 560px) { .fp-sheet { zoom: 0.50 } }
        @media screen and (max-width: 430px) { .fp-sheet { zoom: 0.40 } }
        /* A step the curriculum sheet does not have, and measuring found why it
           is needed. A 320px phone lays out at 299 once body zoom 1.07 has
           taken its cut, and a page's own 16px sides leave 267. A 210mm sheet
           is 794px, so it needs 0.33 or less, and at 0.42 it was 374 wide and
           pushed the body sideways. The breakpoint is read against the
           VIEWPORT, which the body zoom does not touch, so the number here is
           deliberately generous. */
        @media screen and (max-width: 380px) { .fp-sheet { zoom: 0.33 } }

        @media print {
          .fp-sheet { box-shadow: none; border-radius: 0; margin: 0; }
          .fp-sheet { break-after: page; page-break-after: always; }
          .fp-sheet:last-of-type { break-after: auto; page-break-after: auto; }
          html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
          /* globals.css sets body { zoom: 1.07 }. Right on a screen, and on
             paper it turns 297mm into 317.8mm and spills onto a second side. */
          body { zoom: 1 !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .fp-noprint { display: none !important; }
        }

        .fp-card { break-inside: avoid; page-break-inside: avoid; }
      `}</style>

      <header style={{ borderBottom: `2mm solid ${GOLD}`, paddingBottom: '5mm', marginBottom: '7mm' }}>
        <p style={{
          fontFamily: 'var(--font-mono, monospace)', fontSize: '3.4mm', fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, margin: '0 0 2mm',
        }}>
          Guided Childhood · The Planet Friends
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 900,
          fontSize: '13mm', lineHeight: 1.05, letterSpacing: '-0.02em', margin: 0, color: INK,
        }}>
          {name ? `${name}'s Planet Friends` : 'My Planet Friends'}
        </h1>
        <p style={{ fontSize: '4.4mm', color: SOFT, lineHeight: 1.45, margin: '3mm 0 0' }}>
          {earnedCount === 0
            ? 'Finish a full day, all five of your five a day, and the first one is on the way.'
            : earnedCount === 5
            ? 'Every single one, home. Nobody else has done this but you.'
            : `${earnedCount} home so far, out of five. A full day is all five of your five a day, ticked off.`}
        </p>
      </header>

      {/* Five cards, three then two, so the sheet stays balanced whichever way
          the ladder has gone. Earned in colour, still to come in line art. */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6mm',
        alignContent: 'start',
      }}>
        {STAGE_CHARACTERS.map((c, i) => {
          const cost = FRIEND_STREAKS[i]
          const earned = days >= cost
          const left = Math.max(0, cost - days)
          return (
            <div
              key={c.key}
              className="fp-card"
              style={{
                border: `0.8mm ${earned ? 'solid' : 'dashed'} ${earned ? c.colour : '#D8D8E2'}`,
                borderRadius: '5mm',
                padding: '5mm 4mm',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center',
                background: earned ? '#FFFDF7' : '#fff',
              }}
            >
              {/* The colour art is the reward and the line art is the target.
                  Both already exist per character, so nothing here is a new
                  asset to keep in step. */}
              {/* A plain img, not next/image, and eager rather than lazy. A
                  lazy image that has not entered the viewport is not in the
                  document when the print dialog snapshots it, so a sheet sent
                  straight to the printer would come out with the lower half of
                  the characters missing. Nothing on a one page printable is
                  worth deferring anyway. */}
              <img
                src={earned ? c.cutout : c.colouring}
                alt={c.name}
                loading="eager"
                decoding="sync"
                style={{ width: '30mm', height: '30mm', objectFit: 'contain', marginBottom: '3mm' }}
              />
              <div style={{
                fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 900,
                fontSize: '6mm', lineHeight: 1.1, color: earned ? INK : SOFT,
              }}>
                {c.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono, monospace)', fontSize: '3.1mm', fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: earned ? '#2F8F6B' : GOLD, marginTop: '2mm',
              }}>
                {earned ? '✓ Home' : `${left} more full ${left === 1 ? 'day' : 'days'}`}
              </div>
              <div style={{ fontSize: '3.6mm', color: SOFT, lineHeight: 1.35, marginTop: '2mm' }}>
                {earned ? c.role : `Costs ${cost} full days`}
              </div>
            </div>
          )
        })}
      </div>

      <footer style={{ borderTop: `0.5mm solid #E6E6EE`, paddingTop: '4mm', marginTop: '6mm' }}>
        <p style={{ fontSize: '3.8mm', color: SOFT, lineHeight: 1.45, margin: 0 }}>
          Cut out the ones who are home and stick them up. Colour in the ones
          still on their way. {name ? `${name} has` : 'You have'} finished{' '}
          <strong style={{ color: INK }}>{days} full {days === 1 ? 'day' : 'days'}</strong> so far.
        </p>
      </footer>
    </div>
  )
}
