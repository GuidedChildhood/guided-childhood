import QRCode from 'qrcode'
import { BRAND_DOMAIN } from '@gc/shared/brand'
import { shortHomeCode } from '@gc/shared/home-code-link'

// THE QR ON THE PARENT NOTE.
//
// The home code has always worked and has never had a front door: a parent
// had to already have the app, find the card at the foot of the lessons
// page, and type four characters off a sheet in a book bag. Every code that
// goes home unredeemed is a family who met us and never arrived.
//
// Rendered SERVER SIDE as an SVG string, at build or revalidation, so the
// print sheet ships no client JavaScript and a QR can never be a spinner on
// a page a teacher is trying to photocopy. Print pages here revalidate
// hourly, so this runs roughly once per module per hour.
//
// Black on white with a wide margin, whatever the friend's colour is. A
// coloured QR looks better and scans worse, and this one gets photocopied
// in black and white on a school machine before anybody points a phone at
// it.

/** The URL a parent's phone opens. Short enough to also print as text. */
export const homeCodeUrl = (homeCode: string) =>
  `https://${BRAND_DOMAIN}/home-code/${shortHomeCode(homeCode)}`

/** The same URL without the scheme, for printing beside the QR. */
export const homeCodeLabel = (homeCode: string) =>
  `${BRAND_DOMAIN}/home-code/${shortHomeCode(homeCode)}`

/**
 * An SVG QR for a home code, or null if it cannot be made. Null rather than
 * a throw: the parent note still carries the code as text, so a failed QR
 * costs a convenience and never a print run.
 */
export async function homeCodeQr(homeCode: string, sizePx = 120): Promise<string | null> {
  try {
    const svg = await QRCode.toString(homeCodeUrl(homeCode), {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 1,
      color: { dark: '#000000', light: '#FFFFFF' },
    })
    // The library sizes its SVG in modules with shape-rendering crispEdges.
    // Give it a real width and height so print CSS has something to lay out.
    return svg.replace('<svg ', `<svg width="${sizePx}" height="${sizePx}" `)
  } catch {
    return null
  }
}
