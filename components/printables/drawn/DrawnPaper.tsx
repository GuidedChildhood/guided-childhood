'use client'

import SheetScale from '@/components/printables/SheetScale'
import { DrawnSheet, type DrawnSpec } from './index'
import { PAPER_W, PAPER_H } from './HappyPaper'

// A drawn sheet fitted to whatever is looking at it.
//
// The paper is a fixed 794 by 1077 pixels (A4 at 285mm, see HappyPaper), and
// SheetScale measures the space it has been given and scales the whole sheet
// to fit, reserving exactly the scaled height. So the same component is the
// grid tile on a phone, the preview on the sheet screen, and the print, and
// what a child taps is pixel for pixel what lands on the paper. On paper the
// scale comes off and the sheet prints at true size.

export default function DrawnPaper({ spec }: { spec: DrawnSpec }) {
  return (
    <SheetScale sheetWidth={PAPER_W} sheetHeight={PAPER_H}>
      <DrawnSheet spec={spec} />
    </SheetScale>
  )
}
