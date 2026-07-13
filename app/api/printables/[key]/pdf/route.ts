import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { createClient } from '@/lib/supabase/server'
import { getPrintable } from '@/lib/printables/registry'

// A real PDF download: the sheet artwork embedded full bleed on an A4
// page, fetched server side (the CDN is reachable from here) and streamed
// as an attachment. One route serves every printable in the registry.

export const maxDuration = 60

const A4 = { width: 595.28, height: 841.89 }

export async function GET(req: NextRequest, ctx: { params: Promise<{ key: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { key } = await ctx.params
  const printable = getPrintable(key)
  if (!printable) return NextResponse.json({ error: 'unknown printable' }, { status: 404 })

  // English by default; es serves the translated artwork when it exists.
  const lang = req.nextUrl.searchParams.get('lang') === 'es' && printable.sheetUrlEs ? 'es' : 'en'
  const artworkUrl = lang === 'es' ? (printable.sheetUrlEs as string) : printable.sheetUrl

  try {
    const imageRes = await fetch(artworkUrl)
    if (!imageRes.ok) throw new Error(`artwork fetch ${imageRes.status}`)
    const png = await imageRes.arrayBuffer()

    const pdf = await PDFDocument.create()
    pdf.setTitle(printable.title)
    pdf.setAuthor('Guided Childhood')
    const image = await pdf.embedPng(png)
    const page = pdf.addPage([A4.width, A4.height])

    // The brand header is stamped as real text on every download, so the
    // branding is pixel identical on every sheet and can never be
    // misspelled by generated lettering.
    const font = await pdf.embedFont(StandardFonts.HelveticaBold)
    const ink = rgb(0.10, 0.10, 0.18)
    const brand = 'G U I D E D   D I G I T A L   P A T H W A Y'
    const brandSize = 9
    const brandWidth = font.widthOfTextAtSize(brand, brandSize)
    page.drawText(brand, { x: (A4.width - brandWidth) / 2, y: A4.height - 24, size: brandSize, font, color: ink })

    const footer = 'guidedchildhood.com'
    const footerSize = 7.5
    const footerWidth = font.widthOfTextAtSize(footer, footerSize)
    page.drawText(footer, { x: (A4.width - footerWidth) / 2, y: 12, size: footerSize, font, color: rgb(0.53, 0.53, 0.67) })

    // Fit the artwork between the header and footer bands, centred.
    const top = 32
    const bottom = 24
    const margin = 14
    const scale = Math.min((A4.width - margin * 2) / image.width, (A4.height - top - bottom) / image.height)
    const w = image.width * scale
    const h = image.height * scale
    page.drawImage(image, { x: (A4.width - w) / 2, y: bottom + (A4.height - top - bottom - h) / 2, width: w, height: h })

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
