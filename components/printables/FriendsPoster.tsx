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
// ── REBUILT FOR THE CHILD HOLDING IT (Justin, 11 August 2026) ────────────────
//
// "This printable is not good enough, needs to be bigger, and images of exact
// Planet Friends bigger, and this is for under 10s I would say."
//
// He is right on all three, and the three are the same fault. The sheet was
// laid out as an adult document: three columns, 30mm pictures, and four lines
// of type under each one, two of which said the same thing in different words
// ("22 MORE FULL DAYS" over "Costs 22 full days"). On A4 that is a character
// the size of a matchbox, which is not something a seven year old cuts out and
// puts on a wall, and it is not something they can colour in either.
//
// So the picture is now the sheet and the words get what is left:
//
//   three columns → two, which is the single biggest win. 90mm of width per
//                   Friend instead of 56mm, on the same paper.
//   fixed 30mm    → the art FLEX FILLS its card, so it takes every millimetre
//   picture         the type does not need. It lands near 44mm, better than
//                   double the printed area, and it stays right if the copy
//                   ever grows a line.
//   four lines    → two. A name, and one thing to know. The duplicate cost
//                   line is gone rather than shrunk.
//   ledger words  → child words. "Costs 22 full days" is an invoice. A locked
//                   Friend now says how many days are left and, underneath,
//                   what to do in the meantime, which is colour them in.
//
// The sixth cell of the grid carries the instructions and the day count, which
// used to be a footer. Five Friends in a two column grid leave a hole, and a
// hole is where the how to belongs, so the sheet gains a whole row of picture
// height by not having a footer at all.

const INK = '#1A1A2E'
const SOFT = '#52526A'
const GOLD = '#C99A28'
const BUTTER = '#FDF6E3'

export type FriendsPosterProps = {
  childName: string | null
  /** Completed full days. The one currency Friends are bought with. */
  fullDays: number
}

export default function FriendsPoster({ childName, fullDays }: FriendsPosterProps) {
  const name = childName && childName !== 'Your child' ? childName : null
  const days = Math.max(0, fullDays)
  const earnedCount = FRIEND_STREAKS.filter(n => days >= n).length

  // THE TITLE IS NEVER ALLOWED A SECOND LINE, and that is a size rule rather
  // than a taste one. The grid takes whatever height the header leaves, so a
  // wrapped title costs every one of the three rows a third of a line. Measured:
  // "Alexandrina's Planet Friends" at 15mm wrapped, and took every Planet Friend
  // from 42.6mm down to 37.5mm. A child with a long name got smaller characters
  // than a child with a short one, which is not a trade anybody would choose.
  //
  // So the title steps down by length and is pinned to one line. The steps are
  // generous against Nunito 900 at these sizes, and nowrap with hidden overflow
  // is the backstop, so an unheard of name clips rather than quietly shrinking
  // the pictures on the sheet.
  const title = name ? `${name}'s Planet Friends` : 'My Planet Friends'
  const titleMm =
    title.length <= 21 ? 15
    : title.length <= 26 ? 12.5
    : title.length <= 32 ? 10.5
    : 9

  return (
    <div className="fp-frame">
      <div className="fp-sheet">
        <style>{`
        @page { size: A4 portrait; margin: 0; }

        .fp-sheet {
          width: 210mm;
          /* height, not min-height, for the reason written at length on the
             curriculum sheet: a floor lets the page grow past the paper. */
          height: 297mm;
          /* 12mm rather than 15mm. Three millimetres a side is six across, and
             on a two column grid that is three more millimetres of Planet
             Friend in every card. A4 home printers are safe to about 8mm. */
          padding: 12mm 12mm 10mm;
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
          /* A safety net rather than the plan. The zoom steps below are still
             sized to fit the sheet inside the phone, so this should never
             actually scroll. It is here so that if a browser rounds the zoom
             the wrong way, the overflow is a few pixels inside this box rather
             than the whole page sliding sideways under the thumb. */
          .fp-frame { overflow-x: auto; }
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
          .fp-frame { overflow: visible !important; }
          html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
          /* globals.css sets body { zoom: 1.07 }. Right on a screen, and on
             paper it turns 297mm into 317.8mm and spills onto a second side. */
          body { zoom: 1 !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .fp-noprint { display: none !important; }
        }

        .fp-card { break-inside: avoid; page-break-inside: avoid; }
      `}</style>

        {/* Short on purpose. Every millimetre this header does not take is a
            millimetre the pictures do, and the explaining has moved into the
            how to tile at the end of the grid where a child will actually
            read it. */}
        <header style={{ borderBottom: `2mm solid ${GOLD}`, paddingBottom: '4mm', marginBottom: '5mm' }}>
          <p style={{
            fontFamily: 'var(--font-mono, monospace)', fontSize: '3.2mm', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, margin: '0 0 1.5mm',
          }}>
            Guided Childhood · The Planet Friends
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 900,
            fontSize: `${titleMm}mm`, letterSpacing: '-0.02em',
            margin: 0, color: INK,
            /* One line, always. See titleMm above for what a second one costs. */
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            /* A line box fixed at the largest step rather than at this name's
               step, so the header is exactly as tall for Alexandrina as it is
               for Teo and every child gets the same size Planet Friends.
               20mm, and the number is measured rather than chosen. Nunito 900
               at the 15mm step paints 71px of ink into what a 17.5mm box gives
               66px of, so the tops of the letters were being cut off by the
               hidden overflow that keeps the title on one line. */
            height: '20mm', lineHeight: '20mm',
          }}>
            {title}
          </h1>
        </header>

        {/* Two columns and three fixed rows. The rows are 1fr rather than auto
            so every card is the same height whatever its words do, and the
            pictures inside them all come out the same size, which is what
            makes a cut out sheet look like a set rather than a jumble. */}
        <div style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '5mm',
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
                  border: `1mm ${earned ? 'solid' : 'dashed'} ${earned ? c.colour : '#D2D2DE'}`,
                  borderRadius: '6mm',
                  /* Tight, because every millimetre of padding is a millimetre
                     off the character five times over. */
                  padding: '3.5mm 3.5mm 4mm',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'flex-end',
                  textAlign: 'center',
                  minHeight: 0,
                  background: earned ? '#FFFDF7' : '#fff',
                }}
              >
                {/* The colour art is the reward and the line art is the target.
                    Both already exist per character, so nothing here is a new
                    asset to keep in step. */}
                {/* The picture takes everything the two lines below do not.
                    flex 1 with minHeight 0, and max height rather than a fixed
                    one, so the art scales to the row instead of the row being
                    built around a guess. On A4 this lands around 44mm against
                    the 30mm it used to be, which is more than double the
                    printed area of the character. */}
                <div style={{
                  flex: 1, minHeight: 0, width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '2mm',
                }}>
                  {/* A plain img, not next/image, and eager rather than lazy. A
                      lazy image that has not entered the viewport is not in the
                      document when the print dialog snapshots it, so a sheet
                      sent straight to the printer would come out with the lower
                      half of the characters missing. Nothing on a one page
                      printable is worth deferring anyway. */}
                  <img
                    src={earned ? c.cutout : c.colouring}
                    alt={c.name}
                    loading="eager"
                    decoding="sync"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div style={{
                  fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 900,
                  fontSize: '9mm', lineHeight: 1.02, letterSpacing: '-0.01em',
                  color: earned ? INK : SOFT,
                }}>
                  {c.name}
                </div>
                {/* ONE line, not three. A child who has earned Pebble wants to
                    know Pebble is theirs and what Pebble is for. A child who
                    has not wants to know how far off it is and what they can
                    do about it today, which is colour it in. */}
                <div style={{
                  fontSize: '4.4mm', fontWeight: 700, lineHeight: 1.2,
                  color: earned ? '#2F8F6B' : GOLD, marginTop: '1.5mm',
                }}>
                  {earned
                    ? 'Home with you'
                    : `${left} more full ${left === 1 ? 'day' : 'days'}`}
                </div>
                <div style={{ fontSize: '3.6mm', color: SOFT, lineHeight: 1.25, marginTop: '1.2mm' }}>
                  {earned ? `Helps with ${c.role}` : 'Colour me in while you wait'}
                </div>
              </div>
            )
          })}

          {/* The sixth cell. Five Friends in two columns leave a hole, so the
              hole does the job the footer used to, and the sheet keeps a whole
              row of picture height it would otherwise have spent on a strip of
              small print along the bottom. */}
          <div
            className="fp-card"
            style={{
              border: `1mm solid ${GOLD}`, borderRadius: '6mm', padding: '5mm 5mm 6mm',
              background: BUTTER, display: 'flex', flexDirection: 'column',
              justifyContent: 'center', textAlign: 'center', minHeight: 0,
            }}
          >
            <div style={{
              fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 900,
              fontSize: '7.5mm', lineHeight: 1.08, color: INK, marginBottom: '3mm',
            }}>
              Cut out. Stick up.
            </div>
            <p style={{ fontSize: '4mm', color: SOFT, lineHeight: 1.35, margin: '0 0 4mm' }}>
              The ones in colour are yours. Cut them out and put them on your wall.
              The outlines are still on their way, so colour them in.
            </p>
            <div style={{
              fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 900,
              fontSize: '9mm', lineHeight: 1, color: GOLD,
            }}>
              {days}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono, monospace)', fontSize: '3.2mm', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: INK, marginTop: '1.5mm',
            }}>
              Full {days === 1 ? 'day' : 'days'} done
            </div>
            <p style={{ fontSize: '3.4mm', color: SOFT, lineHeight: 1.3, margin: '3mm 0 0' }}>
              {earnedCount === 5
                ? 'Every single one, home. Nobody else has done this but you.'
                : 'A full day is all five of your five a day, ticked off.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
