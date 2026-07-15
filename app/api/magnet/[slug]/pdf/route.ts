import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from 'pdf-lib'
import { getMagnet, type Magnet } from '@/lib/magnets/registry'
import { BRAND_NAME, BRAND_PATHWAY, BRAND_CATCHPHRASE, BRAND_DOMAIN, LOGO_BARS } from '@/lib/brand'

// The lead magnet as a real, self contained PDF. Built entirely from
// vector text and the brand mark, so it needs no artwork and no CDN: it
// renders identically anywhere and can never be misspelled by generated
// lettering. Public by design; the email box on the page is the soft
// gate, not this route.

export const maxDuration = 30

const A4 = { width: 595.28, height: 841.89 }
const MARGIN = 56

const INK = rgb(0.10, 0.10, 0.18)
const INK_SOFT = rgb(0.32, 0.32, 0.42)
const GOLD = rgb(0.93, 0.765, 0.373) // #EDC35F
const GOLD_DARK = rgb(0.788, 0.604, 0.157) // #C99A28

// The brand mark, stamped as real vectors exactly as the app header and
// the printables route draw it: the gold square with four rising bars,
// the pathway line up top, the catchphrase and domain along the foot.
function stampBrand(page: PDFPage, font: PDFFont) {
  const S = 15
  const nameSize = 11
  const nameWidth = font.widthOfTextAtSize(BRAND_NAME, nameSize)
  const blockWidth = S + 6 + nameWidth
  const x0 = (A4.width - blockWidth) / 2
  const logoTop = A4.height - 13

  page.drawSvgPath(
    'M 4.5 0 H 10.5 Q 15 0 15 4.5 V 10.5 Q 15 15 10.5 15 H 4.5 Q 0 15 0 10.5 V 4.5 Q 0 0 4.5 0 Z',
    { x: x0, y: logoTop, color: GOLD },
  )
  const barW = 1.5
  const gap = 1.2
  const stack = 7.5
  const barsWidth = 4 * barW + 3 * gap
  let bx = x0 + (S - barsWidth) / 2
  for (const h of LOGO_BARS) {
    const bh = (h / 14) * stack
    page.drawRectangle({ x: bx, y: logoTop - S + (S - stack) / 2, width: barW, height: bh, color: rgb(1, 1, 1) })
    bx += barW + gap
  }
  page.drawText(BRAND_NAME, { x: x0 + S + 6, y: logoTop - S + 3.5, size: nameSize, font, color: INK })

  const pathway = BRAND_PATHWAY.split('').join(' ')
  const pathwaySize = 6
  const pathwayWidth = font.widthOfTextAtSize(pathway, pathwaySize)
  page.drawText(pathway, { x: (A4.width - pathwayWidth) / 2, y: A4.height - 38, size: pathwaySize, font, color: GOLD_DARK })

  const phraseSize = 7
  const phraseWidth = font.widthOfTextAtSize(BRAND_CATCHPHRASE, phraseSize)
  page.drawText(BRAND_CATCHPHRASE, { x: (A4.width - phraseWidth) / 2, y: 22, size: phraseSize, font, color: INK_SOFT })
  const domainSize = 7
  const domainWidth = font.widthOfTextAtSize(BRAND_DOMAIN, domainSize)
  page.drawText(BRAND_DOMAIN, { x: (A4.width - domainWidth) / 2, y: 11, size: domainSize, font, color: GOLD_DARK })
}

// Greedy word wrap to a pixel width, returning the lines to draw.
function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(next, size) > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function buildPdf(magnet: Magnet): Promise<Uint8Array> {
  return (async () => {
    const pdf = await PDFDocument.create()
    pdf.setTitle(magnet.title)
    pdf.setAuthor(BRAND_NAME)
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
    const body = await pdf.embedFont(StandardFonts.Helvetica)

    let page = pdf.addPage([A4.width, A4.height])
    stampBrand(page, bold)

    const contentWidth = A4.width - MARGIN * 2
    let y = A4.height - 92

    const ensureRoom = (needed: number) => {
      if (y - needed < 52) {
        page = pdf.addPage([A4.width, A4.height])
        stampBrand(page, bold)
        y = A4.height - 92
      }
    }

    // Eyebrow
    page.drawText(magnet.eyebrow.toUpperCase(), { x: MARGIN, y, size: 9, font: bold, color: GOLD_DARK })
    y -= 20

    // Title
    for (const line of wrap(magnet.title, bold, 22, contentWidth)) {
      page.drawText(line, { x: MARGIN, y, size: 22, font: bold, color: INK })
      y -= 27
    }
    y -= 4

    // Intro
    for (const line of wrap(magnet.intro, body, 11.5, contentWidth)) {
      page.drawText(line, { x: MARGIN, y, size: 11.5, font: body, color: INK_SOFT })
      y -= 16
    }
    y -= 14

    // Items
    magnet.items.forEach((item, i) => {
      const headingText = magnet.numbered ? `${i + 1}.  ${item.h}` : item.h
      const headingLines = wrap(headingText, bold, 13, contentWidth)
      const bodyLines = wrap(item.b, body, 11, contentWidth)
      ensureRoom(headingLines.length * 17 + bodyLines.length * 15 + 20)

      for (const line of headingLines) {
        page.drawText(line, { x: MARGIN, y, size: 13, font: bold, color: INK })
        y -= 17
      }
      y -= 2
      for (const line of bodyLines) {
        page.drawText(line, { x: MARGIN, y, size: 11, font: body, color: INK_SOFT })
        y -= 15
      }
      y -= 16
    })

    // Closing line
    ensureRoom(40)
    y -= 6
    for (const line of wrap(magnet.close, bold, 11.5, contentWidth)) {
      page.drawText(line, { x: MARGIN, y, size: 11.5, font: bold, color: GOLD_DARK })
      y -= 16
    }

    return pdf.save()
  })()
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const magnet = getMagnet(slug)
  if (!magnet) return NextResponse.json({ error: 'unknown magnet' }, { status: 404 })

  try {
    const bytes = await buildPdf(magnet)
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${magnet.filename}.pdf"`,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return NextResponse.json({ error: 'could not build pdf' }, { status: 500 })
  }
}
