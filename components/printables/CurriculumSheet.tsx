import type { CSSProperties } from 'react'
import { BRAND_NAME } from '@gc/shared/brand'

// THE TOOLKIT SHEET. A printable for children who have outgrown colouring in.
//
// Justin, 6 August 2026: "We need to make printables higher quality ... can we
// get the best educational fun printable and more mature for older children,
// maybe we can replicate these into child printable", pointing at a KS2 maths
// toolkit and a professionally made emotional support pack.
//
// THE GAP, COUNTED RATHER THAN GUESSED
//
// Twenty six printables in the registry, and this is where they land:
//
//   Stage 1  ages 4 to 7     20 sheets
//   Stage 2  ages 8 to 10    19
//   Stage 3  ages 11 to 13   15
//   Stage 4  ages 13 to 15    8
//   Stage 5  age 16 plus      4
//
// A five year old has twenty. A sixteen year old has four, and most of what
// they can reach is a bucket list or a colouring page. Every one of them is
// generated artwork, which is right for a seven year old at the kitchen table
// and is exactly the thing an eleven year old will not be seen with.
//
// WHY THIS IS DRAWN AND NOT GENERATED
//
// Every other printable is a PNG made once and embedded in a PDF. That suits
// line art and suits nothing else: type inside an image cannot be corrected,
// cannot be translated, cannot reflow, and goes soft the moment a printer
// scales it. A toolkit sheet is almost entirely type and rules, so it is drawn
// in CSS and printed by the browser. It comes out sharp at any size, it can be
// fixed by editing a file rather than re rolling a model, and it costs nothing
// to make one for every year group.
//
// WHY THE CONTENT IS REAL
//
// It is built from `curriculum_objectives`, which already holds 448 National
// Curriculum objectives for Years 1 to 6 in maths, English and reading, broken
// down by strand and term, and which already drives the parent's "where they
// are at school" sheet. So this is not a worksheet we invented: it is the same
// spine a KS2 toolkit is built on, and we own it.
//
// What this deliberately does NOT do is generate practice questions. We can
// print the objective a school is actually teaching this term and give a child
// room to work, and that is honest. Generating twenty sums from the text of an
// objective would be a machine guessing at a syllabus, unchecked, on a page a
// parent would reasonably assume had been taught by someone.
//
// WHAT THE REFERENCES TAUGHT IT
//
// From the "That's Okay" pack Justin sent: one idea per page, a repeating
// structure a child learns after the first sheet, and type big enough to read
// across a table. From the KS2 toolkit shape: a strand named at the top, work
// space that is genuinely usable rather than decorative, and a self check the
// child fills in themselves.
//
// The self check is the part that matters here and it follows the rule
// LearningSheet already set: no score, no mark, no percentage. Three boxes,
// and the warm one is "I found this tricky", because a judged child stops
// telling you what they found hard and the telling is the whole mechanism.

export type CurriculumTask = {
  id: string
  strand: string
  objective: string
}

export type CurriculumSheetProps = {
  childName: string
  yearGroup: number
  subject: string
  term: string
  strand: string
  tasks: CurriculumTask[]
  /** What the finished sheet is worth when a grown up ticks it off. */
  stars?: number
}

const INK = '#1A1A2E'
const INK_SOFT = '#52526A'
const INK_MUTED = '#8888A0'
const RULE = '#D9D4C7'
const GOLD = '#EDC35F'

const mono: CSSProperties = {
  fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  fontWeight: 700,
}

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function CurriculumSheet({
  childName, yearGroup, subject, term, strand, tasks, stars = 5,
}: CurriculumSheetProps) {
  return (
    <div className="cs-sheet">
      <style>{`
        /* A4 portrait, and the sheet is the page. Everything is in millimetres
           because this object's real dimensions are millimetres: designing a
           printable in pixels and hoping is how the fridge sheet ended up
           spilling onto a second page. */
        @page { size: A4 portrait; margin: 0; }

        .cs-sheet {
          width: 210mm;
          /* height, not min-height. min-height is a floor and lets the sheet
             grow past the paper, which is exactly what it did: 515mm on one
             side. A fixed height plus flexing tasks makes the page a budget the
             content is fitted into rather than a suggestion it can ignore. */
          height: 297mm;
          padding: 14mm 15mm 12mm;
          margin: 0 auto;
          background: #fff;
          color: ${INK};
          font-family: var(--font-body, Nunito, system-ui, sans-serif);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        /* Border box for everything INSIDE the sheet too, not just the sheet.
           With it only on the outer element, a task's min-height of 32mm meant
           32mm of content PLUS its padding and border, so five tasks quietly
           claimed 202mm where 160mm was budgeted and the page ran 20mm long
           no matter how many tasks were on it. Every measurement on this sheet
           is a real millimetre on real paper, and content-box makes that a lie. */
        .cs-sheet *, .cs-sheet *::before, .cs-sheet *::after { box-sizing: border-box; }

        /* On screen it sits on the cream page like a sheet of paper on a desk.
           In print it IS the paper, so the lift comes off. */
        @media screen {
          .cs-sheet {
            box-shadow: 0 10px 40px -12px rgba(26,26,46,0.28);
            border-radius: 3px;
            margin-bottom: 28px;
          }
        }

        /* A4 is 210mm wide and a phone is not, so on a narrow screen the sheet
           has to be shrunk to fit or it pushes the whole page sideways. zoom
           rather than transform, because zoom changes the layout box and
           transform does not: scaled with a transform the sheet would LOOK
           right and still reserve 210mm of width, which is horizontal scroll on
           the body and the one thing the design rules forbid.
           Print is untouched, which is the point: this is a preview of a piece
           of paper, and only the preview needs to fit the phone. */
        @media screen and (max-width: 860px) { .cs-sheet { zoom: 0.82 } }
        @media screen and (max-width: 700px) { .cs-sheet { zoom: 0.66 } }
        @media screen and (max-width: 560px) { .cs-sheet { zoom: 0.50 } }
        @media screen and (max-width: 430px) { .cs-sheet { zoom: 0.42 } }
        @media print {
          .cs-sheet { box-shadow: none; border-radius: 0; margin: 0; }

          /* One sheet, one side of paper. min-height alone does not guarantee
             it: anything wrapping the sheet contributes its own padding, and a
             single stray millimetre pushes a 297mm block onto a second page,
             which prints the footer of every sheet on a sheet of its own.
             Breaking after each one pins it, and the last is exempt so a
             single sheet does not eject a blank page behind it. */
          .cs-sheet { break-after: page; page-break-after: always; }
          .cs-sheet:last-of-type { break-after: auto; page-break-after: auto; }

          /* The sheet owns the paper. Whatever it is rendered inside, a
             reference page or the library, contributes no margin in print. */
          html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }

          /* CANCEL THE APP ZOOM.
             globals.css sets body { zoom: 1.07 }, a deliberate uniform lift so
             the whole app reads a little larger without touching pixel sizes in
             hundreds of components. It is right on a screen and wrong on paper:
             it silently multiplied this sheet by 1.07, so a box measuring
             exactly 297mm in CSS arrived at the printer as 317.8mm and spilled
             about twenty millimetres onto a second side. Nothing in the layout
             was wrong, which is why it survived being measured twice.
             A millimetre in this file has to be a millimetre on the paper, so
             the zoom comes off for print. Scoped by living in the sheet's own
             style block, which only exists on a page that renders one. */
          body { zoom: 1 !important; }
          /* Browsers drop background colours when printing unless told not to,
             which would send the gold rules and the strand chip to the printer
             as blank white. On a sheet whose whole purpose is to be printed,
             that is the difference between a design and a page of text. */
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .cs-noprint { display: none !important; }
        }

        /* A task must never be split across a page break. Half a question at
           the foot of one side and its working space on the other is worse
           than a shorter sheet. */
        .cs-task { break-inside: avoid; page-break-inside: avoid; }
      `}</style>

      {/* THE HEAD. Who it is for and what it covers, in one band, so a sheet
          found loose on a table three weeks later still explains itself. */}
      <header style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: '8mm', borderBottom: `2.5px solid ${GOLD}`, paddingBottom: '4mm',
      }}>
        <div>
          <span style={{ ...mono, fontSize: '7.5pt', color: INK_MUTED, display: 'block' }}>
            {subject === 'maths' ? 'Maths toolkit' : `${titleCase(subject)} toolkit`}
            {'  ·  '}Year {yearGroup}{'  ·  '}{titleCase(term)} term
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 900,
            fontSize: '24pt', lineHeight: 1.05, letterSpacing: '-0.02em',
            margin: '2mm 0 0', color: INK,
          }}>
            {strand}
          </h1>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span style={{ ...mono, fontSize: '7pt', color: INK_MUTED, display: 'block' }}>Name</span>
          <span style={{
            display: 'block', minWidth: '46mm', borderBottom: `1.5px solid ${RULE}`,
            paddingBottom: '1.5mm', marginTop: '2mm',
            fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 800, fontSize: '13pt',
          }}>
            {childName}
          </span>
        </div>
      </header>

      {/* THE INSTRUCTION. One sentence, and it sets the contract: this is not a
          test, and saying it was hard is the useful thing to do. */}
      <p style={{
        fontSize: '10.5pt', lineHeight: 1.5, color: INK_SOFT, fontWeight: 600,
        margin: '4mm 0 5mm', maxWidth: '150mm',
      }}>
        Work through as many as you like. Show your working in the space, then
        tick how it went before you move on. Nobody is marking this. The tricky
        ones are the ones worth going over together.
      </p>

      {/* THE TASKS. Numbered, the objective in the child's own curriculum words,
          the self check beside it, then real space to work in.

          The tasks FLEX to fill the page. Fixed heights were the first attempt
          and they were wrong twice over: six tasks with a 26mm box measured
          515mm against a 297mm side, and a three task sheet still spilled at
          317mm. Sizing them to share whatever is left means the sheet can
          neither overflow nor sit half empty, whether it carries three tasks or
          six, which is the same lesson the fridge printable taught this morning:
          measure the page, do not guess at it. */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4mm', minHeight: 0 }}>
        {tasks.map((t, i) => (
          <section key={t.id} className="cs-task" style={{
            // A floor, not a size. It stops a sheet with two tasks drawing two
            // enormous boxes, and it is low enough that five still fit inside
            // the space main is given.
            flex: 1, minHeight: '26mm',
            display: 'flex', flexDirection: 'column',
            border: `1.5px solid ${RULE}`, borderRadius: '3mm', padding: '3.5mm 4mm 3.5mm',
          }}>
            <div style={{ display: 'flex', gap: '3.5mm', alignItems: 'flex-start' }}>
              <span aria-hidden style={{
                flexShrink: 0, width: '7mm', height: '7mm', borderRadius: '50%',
                background: GOLD, color: INK,
                fontFamily: 'var(--font-display, Nunito, sans-serif)', fontWeight: 900, fontSize: '11pt',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {i + 1}
              </span>
              <p style={{
                flex: 1, margin: 0, fontSize: '11pt', lineHeight: 1.35, fontWeight: 700, color: INK,
              }}>
                {titleCase(t.objective)}
              </p>

              {/* THE SELF CHECK, here rather than in a table at the foot.

                  It began as one, and the table measured 94mm on its own, a
                  third of the page spent on six rows of tick boxes whose only
                  content was the numbers 1 to 6 repeated from the tasks above.
                  Beside the task it costs nothing, and it is better: a child
                  marks how it went the moment they finish that one, rather than
                  cross referencing numbers at the bottom once they have already
                  stopped thinking about it.

                  No score, no mark, no percentage, which is the rule
                  LearningSheet already set. The tricky box is the warm one on
                  purpose: it has to read as the helpful thing to tick, not as an
                  admission, because a judged child stops telling you what they
                  found hard and the telling is the entire mechanism. */}
              <span style={{ display: 'flex', gap: '2mm', flexShrink: 0, paddingTop: '0.5mm' }}>
                {(['Got it', 'Nearly', 'Tricky'] as const).map((label, col) => (
                  <span key={label} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1mm',
                  }}>
                    <span aria-hidden style={{
                      width: '5mm', height: '5mm', borderRadius: '1mm',
                      border: `1.5px solid ${col === 2 ? GOLD : RULE}`,
                      background: col === 2 ? '#FFF8E6' : '#fff',
                    }} />
                    <span style={{ fontSize: '6pt', color: INK_MUTED, fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {label}
                    </span>
                  </span>
                ))}
              </span>
            </div>

            {/* Squared working space, not ruled lines. Maths is done in columns
                and diagrams, and a lined box quietly tells a child to write a
                sentence. 5mm squares, which is what a school exercise book
                uses, drawn as a gradient so it costs no markup and stays crisp
                at any print scale. */}
            <div style={{
              flex: 1, marginTop: '2.5mm', borderRadius: '2mm',
              border: `1px solid ${RULE}`,
              backgroundColor: '#FCFBF7',
              backgroundImage:
                `linear-gradient(to right, ${RULE}55 1px, transparent 1px),` +
                `linear-gradient(to bottom, ${RULE}55 1px, transparent 1px)`,
              backgroundSize: '5mm 5mm',
            }} />
          </section>
        ))}
      </main>

      {/* THE FOOT. What it is worth and what to do with it, because a printable
          that never comes back earns nothing and teaches nobody anything. */}
      <footer style={{
        marginTop: '4mm', paddingTop: '3mm', borderTop: `1px solid ${RULE}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6mm',
      }}>
        <span style={{ fontSize: '9pt', color: INK_SOFT, fontWeight: 600, lineHeight: 1.4 }}>
          Show it to your grown up when it is done. It is worth {stars} stars.
        </span>
        <span style={{ ...mono, fontSize: '7pt', color: INK_MUTED, flexShrink: 0 }}>
          {BRAND_NAME}
        </span>
      </footer>
    </div>
  )
}
