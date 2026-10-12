import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import { navAccess } from '@/lib/licence'

// EVERY PRINTABLE PRINTS ITS COLOUR (12 October 2026).
//
// The print kit is designed in colour: the friend's tint as the header band
// and the sticker fill, the code chip, the passport panels. All of it is CSS
// background, and Chrome prints with "Background graphics" off unless the
// page asks otherwise, so a teacher pressing print got the friend's art on a
// white band with a coloured border round nothing. Justin's call: print the
// colour by default. The tints are pale, so the ink is light, and a school
// printing black and white still can: the print dialog's colour setting wins.
//
// Set here, once, for every route under /print. The property is inherited,
// and `display: contents` keeps the wrapper out of the layout, so no sheet
// moves by a pixel.
export default async function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav {...await navAccess()} />
      <div className="gc-print-colour" style={{ display: 'contents', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>{children}</div>
      <SiteFooter />
    </>
  )
}
