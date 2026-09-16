// THE ONE SHEET ZINE: eight panels, one A4, one slit, no staples.
//
// The fold a primary school uses for a home made booklet, and the reason the
// passport can be free. A parent with any printer and a pair of scissors ends
// up with a booklet the size of a real passport, and nothing about it depends
// on duplex printing, on a stapler reaching a spine, or on us having stock.
//
// THE IMPOSITION. Landscape, two rows of four. The top row prints upside
// down, so that when the sheet is folded the long way the panels come out in
// reading order. Panel 1 is the cover and sits bottom right, which is where a
// right handed fold puts it on the outside.
//
//   top    (rotated 180deg):  5  4  3  2
//   bottom (as printed):      6  7  8  1
//
// THE SLIT is along the middle horizontal crease and crosses ONLY the two
// middle panels. Cutting the whole way is the one mistake that ruins the
// sheet, which is why the print pages label it "cut here only".
//
// IT LIVES IN SHARED because both apps fold the same passport: the schools
// app prints the class edition of one page, the parents app prints the
// child's own book of five. Two copies of an imposition is two things that
// can drift, and a drifted imposition is thirty ruined sheets in a classroom.
//
// Deliberately no imports: the guards load this under plain node.

export const ZINE_TOP: number[] = [5, 4, 3, 2]
export const ZINE_BOTTOM: number[] = [6, 7, 8, 1]

/** Every panel in printing order, so a renderer can iterate once. */
export const ZINE_PANELS: { n: number; upside: boolean }[] = [
  ...ZINE_TOP.map(n => ({ n, upside: true })),
  ...ZINE_BOTTOM.map(n => ({ n, upside: false })),
]

export const FOLD_STEPS = [
  'Fold the sheet in half the long way, so the top row meets the bottom row, and open it again.',
  'Fold it in half the short way, then fold each end back to the middle. You now have eight rectangles.',
  'Fold it in half the short way again. Cut along the middle crease from the folded edge as far as the first crease, and no further.',
  'Open it out, fold it the long way again, and push the two ends towards each other. The middle opens up. Fold it closed with the cover on the outside.',
]
