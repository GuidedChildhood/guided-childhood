import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from 'pdf-lib'
import { createClient } from '@/lib/supabase/server'
import { getPrintable } from '@/lib/printables/registry'
import { BRAND_NAME, BRAND_PATHWAY, BRAND_CATCHPHRASE, BRAND_DOMAIN, LOGO_BARS } from '@/lib/brand'

// A real PDF download: the sheet artwork embedded on branded A4 pages,
// fetched server side (the CDN is reachable from here) and streamed as
// an attachment. One route serves every printable in the registry, and
// multi page printables (like the cut and paste crafts) simply list
// their extra pages in the registry.

export const maxDuration = 60

const A4 = { width: 595.28, height: 841.89 }

const INK = rgb(0.10, 0.10, 0.18)
const INK_SOFT = rgb(0.42, 0.42, 0.55)
const GOLD = rgb(0.93, 0.765, 0.373) // #EDC35F
const GOLD_DARK = rgb(0.788, 0.604, 0.157) // #C99A28

// The brand is stamped as real vectors and text on every page of every
// download: the logo exactly as the app header draws it, the name, the
// pathway line up top, and the catchphrase along the foot. Pixel
// identical everywhere, and it can never be misspelled by generated
// lettering.
function stampBrand(page: PDFPage, font: PDFFont) {
  const S = 15 // logo square size
  const nameSize = 11
  const nameWidth = font.widthOfTextAtSize(BRAND_NAME, nameSize)
  const blockWidth = S + 6 + nameWidth
  const x0 = (A4.width - blockWidth) / 2
  const logoTop = A4.height - 13

  // Gold rounded square, drawn with the y axis pointing down from logoTop.
  page.drawSvgPath(
    'M 4.5 0 H 10.5 Q 15 0 15 4.5 V 10.5 Q 15 15 10.5 15 H 4.5 Q 0 15 0 10.5 V 4.5 Q 0 0 4.5 0 Z',
    { x: x0, y: logoTop, color: GOLD },
  )
  // Four rising white bars, same proportions as the app header.
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

  page.drawText(BRAND_NAME, {
    x: x0 + S + 6, y: logoTop - S + 3.5, size: nameSize, font, color: INK,
  })

  const pathway = BRAND_PATHWAY.split('').join(' ')
  const pathwaySize = 6
  const pathwayWidth = font.widthOfTextAtSize(pathway, pathwaySize)
  page.drawText(pathway, {
    x: (A4.width - pathwayWidth) / 2, y: A4.height - 38, size: pathwaySize, font, color: GOLD_DARK,
  })

  const phraseSize = 7
  const phraseWidth = font.widthOfTextAtSize(BRAND_CATCHPHRASE, phraseSize)
  page.drawText(BRAND_CATCHPHRASE, {
    x: (A4.width - phraseWidth) / 2, y: 22, size: phraseSize, font, color: INK_SOFT,
  })
  const domainSize = 7
  const domainWidth = font.widthOfTextAtSize(BRAND_DOMAIN, domainSize)
  page.drawText(BRAND_DOMAIN, {
    x: (A4.width - domainWidth) / 2, y: 11, size: domainSize, font, color: GOLD_DARK,
  })
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ key: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { key } = await ctx.params
  const printable = getPrintable(key)
  if (!printable) return NextResponse.json({ error: 'unknown printable' }, { status: 404 })

  // English by default; es serves the translated artwork when it exists.
  const lang = req.nextUrl.searchParams.get('lang') === 'es' && printable.sheetUrlEs ? 'es' : 'en'
  const artworkUrls = lang === 'es'
    ? [printable.sheetUrlEs as string, ...(printable.extraSheetUrlsEs ?? [])]
    : [printable.sheetUrl, ...(printable.extraSheetUrls ?? [])]

  try {
    const pdf = await PDFDocument.create()
    pdf.setTitle(printable.title)
    pdf.setAuthor(BRAND_NAME)
    const font = await pdf.embedFont(StandardFonts.HelveticaBold)

    for (const artworkUrl of artworkUrls) {
      const imageRes = await fetch(artworkUrl)
      if (!imageRes.ok) throw new Error(`artwork fetch ${imageRes.status}`)
      const image = await pdf.embedPng(await imageRes.arrayBuffer())
      const page = pdf.addPage([A4.width, A4.height])
      stampBrand(page, font)

      // Fit the artwork between the brand bands, centred.
      const top = 46
      const bottom = 34
      const margin = 14
      const scale = Math.min((A4.width - margin * 2) / image.width, (A4.height - top - bottom) / image.height)
      const w = image.width * scale
      const h = image.height * scale
      page.drawImage(image, { x: (A4.width - w) / 2, y: bottom + (A4.height - top - bottom - h) / 2, width: w, height: h })
    }

    const bytes = await pdf.save()
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${printable.key}${lang === 'es' ? '-es' : ''}-guided-childhood.pdf"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'pdf failed' }, { status: 502 })
  }
}
