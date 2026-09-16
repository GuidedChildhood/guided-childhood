// THE JOB TITLE GETS ITS OWN LINE.
//
// Justin photographed the board on 16 September 2026: "Tidy text up here."
// "Phone charged outside the bedroom" was printed through "Family ❤️ Remind
// Remove", and the cause was structural rather than cosmetic. The emoji, the
// title, the worth and the two actions were all children of ONE flex row, with
// only the title carrying flex: 1. On a 390px phone that leaves the title about
// a hundred pixels, so it wrapped to five lines while the short items sat
// vertically centred across the middle of them.
//
// Nothing about that is visible in a diff. It looks like a perfectly ordinary
// row of elements, and it reads fine on a desktop, and it reads fine with a
// short title. It only breaks on a real phone with a real job on it, which is
// why it survived until a founder took a photograph.
//
// So this guard holds the shape rather than the styling: the title is a block
// of its own, after the meta row has closed, with nothing beside it to compete
// for the width. Anyone who puts it back on a shared line fails here.
//
// Node builtins only: the concern-guards job runs no npm ci.

import { readFileSync } from 'node:fs'

const ROW = 'components/quests/JobBoardRow.tsx'
const PAGE = 'app/(dashboard)/dashboard/quests/manage/ManageJobs.tsx'

const fail = []
const read = p => {
  try { return readFileSync(p, 'utf8') } catch { fail.push(`${p} is missing`); return '' }
}
// Comments carry the words that explain the rule, so a guard reading the raw
// file can pass on a sentence in a comment rather than on the code. Strip them.
const strip = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

const rowRaw = read(ROW)
const row = strip(rowRaw)
const page = strip(read(PAGE))

// 1. THE TITLE IS ITS OWN BLOCK, AFTER THE META ROW CLOSES.
//
// Checked positionally, not by class name: the <p> carrying the title must be
// preceded by a closing </div>, which is the meta row ending. If someone moves
// it back up inside that row, the </div> stops being the thing before it.
if (row) {
  const m = row.match(/([\s\S]*?)<p style=\{JOB_TITLE\}>/)
  if (!m) {
    fail.push(`${ROW}: no <p style={JOB_TITLE}> title element. The title must be its own block.`)
  } else {
    const before = m[1].trimEnd()
    if (!before.endsWith('</div>')) {
      fail.push(`${ROW}: the title is not preceded by a closing </div>, so it is nested inside another row and sharing its width. That is the bug Justin photographed. Close the meta row first.`)
    }
  }

  // 2. NOTHING IN THE ROW COMPETES FOR WIDTH.
  //
  // flex: 1 on the title was the whole fault: it says "take what is left",
  // and what was left was a hundred pixels.
  if (/flex:\s*1/.test(row)) {
    fail.push(`${ROW}: flex: 1 is back. A job title that takes "what is left" of a shared line is exactly how the words came to print through each other. Give it its own line instead.`)
  }

  // 3. A LONG WORD BREAKS ONLY WHEN IT MUST.
  //
  // Justin has caught a word chopped mid word once already, on the child's
  // quest idea card ("footbal l"). break-all does that to ordinary words.
  if (!/overflowWrap:\s*'anywhere'/.test(row)) {
    fail.push(`${ROW}: the title has lost overflowWrap: 'anywhere'. Without it a long unbroken job title pushes the card wider than the phone.`)
  }
  if (/wordBreak:\s*'break-all'/.test(row)) {
    fail.push(`${ROW}: wordBreak: 'break-all' chops ordinary words at the margin, which is how "football" became "footbal l". Use overflowWrap: 'anywhere'.`)
  }

  // 4. GREEN STAYS RESERVED.
  //
  // The pastel cycle is decoration. Green is not: it is what tells a parent at
  // a glance which jobs pay nothing. Put green in the cycle and a starred job
  // starts wearing the family job's colour.
  const tints = row.match(/const ROW_TINTS = \[([^\]]*)\]/)
  if (!tints) {
    fail.push(`${ROW}: ROW_TINTS is gone. The rotating pastel is what stops eight jobs reading as eight copies of one card.`)
  } else if (/green/.test(tints[1])) {
    fail.push(`${ROW}: green is in ROW_TINTS. It is reserved for a family job, which is the one colour on this card that carries a meaning. Use FAMILY_TINT and keep the cycle to the rest.`)
  }

  // 5. THE HAPPY NEWS FINISH, WHICH IS WHAT JUSTIN ASKED FOR.
  if (!/boxShadow:\s*'var\(--lift\)'/.test(row) || !/border:\s*'var\(--edge\)'/.test(row)) {
    fail.push(`${ROW}: the row has lost the ink edge or the hard lift. The pastel alone is a washed out block; the edge and the 0 4px 0 shadow are what make it read as a card.`)
  }
}

// 6. THE PAGE USES THE COMPONENT.
//
// The row lives in its own file so app/ref-job-board can mount the real thing.
// Re-inlining the markup on the page would leave the fixture proving the
// layout of code nobody runs.
if (page && !/from '@\/components\/quests\/JobBoardRow'/.test(page)) {
  fail.push(`${PAGE}: the board no longer imports JobBoardRow. If the row markup moves back onto the page, the fixture at /ref-job-board stops testing what a parent actually sees.`)
}

if (fail.length) {
  console.error('check-job-row: the board row lost its shape\n')
  for (const f of fail) console.error('  ' + f + '\n')
  process.exit(1)
}
console.log('check-job-row: the job title has its own line, green stays reserved, and the page mounts the real row.')
