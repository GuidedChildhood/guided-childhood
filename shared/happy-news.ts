// THE HAPPY NEWS PALETTE, ONE HOME.
//
// The ink and the four cheerful accents the child app scatters, and the
// crayon fills a wax crayon leaves on paper, pale enough that the ink line
// still leads. They used to live in the parents app (components/kid/
// HappyNewsBits.tsx and components/printables/drawn/crayon.ts) and the
// drawn icon set could only be used there. Justin, 20 September 2026: "can
// we use happy news icons on lessons, since we have icons". So the palette
// and the icons live here, where both apps can draw them, and the two
// parents app files re-export from this one so a colour is still stated
// once. A colour stated twice is a colour that drifts.

export const HAPPY = {
  butter: '#EDC35F',
  butterDark: '#C99A28',
  butterLt: '#FEF7E0',
  coral: '#E5734B',
  green: '#2E7D5A',
  sky: '#4B9CE5',
  ink: '#1A1A2E',
  cream: '#F9F8F6',
  // The soft pink disc The Happy Newspaper sits its post box on. Justin,
  // 14 September 2026, with that page: the calendar is white ground and big
  // colour discs, not a dotted sky. Today's disc is this pink.
  pink: '#F9CFD9',
} as const

/** Crayon colours: the house butter, sky, coral and green, lightened the way
 *  a wax crayon lands on paper, so the ink lines still lead. Pink and teal
 *  joined on 16 September 2026 when four fills could not carry thirty job
 *  icons without a colour reading as a category. */
export const CRAYON = {
  butter: '#F4D072',
  sky: '#8EC3F0',
  coral: '#F2957A',
  green: '#93CFA8',
  paper: '#FEF7E0',
  pink: '#F2A0C4',
  teal: '#7FCFC6',
} as const

export type CrayonName = keyof typeof CRAYON
