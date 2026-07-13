import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'
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

  try {
    const imageRes = await fetch(printable.sheetUrl)
    if (!imageRes.ok) throw new Error(`artwork fetch ${imageRes.status}`)
    const png = await imageRes.arrayBuffer()

    const pdf = await PDFDocument.create()
    pdf.setTitle(printable.title)
    pdf.setAuthor('Guided Childhood')
    const image = await pdf.embedPng(png)
    const page = pdf.addPage([A4.width, A4.height])
    // Fit the artwork inside A4 with a small even margin, centred.
    const margin = 14
    const scale = Math.min((A4.width - margin * 2) / image.width, (A4.height - margin * 2) / image.height)
    const w = image.width * scale
    const h = image.height * scale
    page.drawImage(image, { x: (A4.width - w) / 2, y: (A4.height - h) / 2, width: w, height: h })

    const bytes = await pdf.save()
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${printable.key}-guided-childhood.pdf"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'pdf failed' }, { status: 502 })
  }
}
