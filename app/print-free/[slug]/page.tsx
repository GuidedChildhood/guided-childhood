import { notFound } from 'next/navigation'
import QRCode from 'qrcode'
import { PLANET_POST_1 } from '@/lib/printables/free/planet-post'
import PlanetPostSheets from '@/components/printables/news/PlanetPostSheets'

// The print route for the free printables (13 October 2026). It is what
// scripts/render-free-printables.mjs points Chromium at to make the PDFs and
// the preview images that ship in public/printables/free. Never a public page:
// like the dev harnesses it 404s on the live deployment, and the files it
// makes are what parents download.
//
//   ?paper=a4|letter   the sheet the pages are centred on
//   ?ink=1             ink saver: line art only
//   ?layout=booklet    the A5 booklet: one A4 sheet, duplex, flip on the
//                      short edge, fold once
//   ?page=n            one page alone, for the preview images

export const dynamic = 'force-dynamic'

const ISSUES = { 'planet-post-1': PLANET_POST_1 } as const

export default async function PrintFree({ params, searchParams }: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ paper?: string; ink?: string; layout?: string; page?: string }>
}) {
  if (process.env.VERCEL_ENV === 'production') notFound()
  const { slug } = await params
  const issue = ISSUES[slug as keyof typeof ISSUES]
  if (!issue) notFound()
  const q = await searchParams
  const qrSvg = await QRCode.toString(issue.grownUp.url, {
    type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#1A1A2E', light: '#FFFFFF' },
  })
  return (
    <PlanetPostSheets
      issue={issue}
      qrSvg={qrSvg}
      paper={q.paper === 'letter' ? 'letter' : 'a4'}
      ink={q.ink === '1'}
      layout={q.layout === 'booklet' ? 'booklet' : 'pages'}
      only={q.page ? Number(q.page) : null}
    />
  )
}
