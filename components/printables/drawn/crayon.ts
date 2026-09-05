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
} as const
