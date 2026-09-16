// The crayon colours on their own, with no React in the file, so a server
// component (the parent home) can borrow a fill without pulling in the
// example context that lives in HappyPaper.tsx.

/** Crayon colours: the house butter, sky, coral and green, lightened the way
 *  a wax crayon lands on paper, so the ink lines still lead. */
export const CRAYON = {
  butter: '#F4D072',
  sky: '#8EC3F0',
  coral: '#F2957A',
  green: '#93CFA8',
  paper: '#FEF7E0',
  /* ── THE TWO THAT WERE MISSING (16 September 2026) ───────────────────────
     Justin, with two pages of The Happy Newspaper held up beside our board:
     "colours are right but the icons could be more happy news style like
     attached."

     Emily Coxhead's palette leans on a hot pink and a turquoise that we did
     not own. Four fills cannot carry thirty job icons: a board of chores in
     butter, sky, coral and green starts repeating by the sixth row, and a
     repeating colour reads as a category the family has to work out rather
     than as the cheerful scatter the reference actually has.

     Mixed to the same lightness as the four above so the whole set still
     looks like one box of crayons, and still pale enough that the ink line
     leads, which is the rule the rest of this file exists to keep.

     They live here rather than in shared/tokens.css on purpose. Every
     consumer of a crayon fill is a React SVG, and this file already learned
     that a colour stated twice is a colour that drifts (see the butter note
     in shared/tokens.css). One home, one value. */
  pink: '#F2A0C4',
  teal: '#7FCFC6',
} as const
