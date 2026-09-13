import type { Metadata, Viewport } from 'next'
import { MODULE_COUNT } from '@gc/shared/schools-curriculum'
import { Nunito, IBM_Plex_Mono } from 'next/font/google'
// Shared tokens first (the same file the parents app imports), then the
// thin schools sheet on top. One brand, two apps.
import '@gc/shared/tokens.css'
import './schools.css'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-nunito',
  display: 'swap',
})
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://schools.guidedchildhood.com'),
  title: {
    default: 'Digital Literacy Curriculum, Reception to Year 13 | Guided Childhood Schools',
    template: '%s | Guided Childhood Schools',
  },
  description:
    `A complete digital literacy scheme of work for UK schools, Reception to Year 13, built on the Education for a Connected World framework and the 2025 RSHE guidance. ${MODULE_COUNT} modules, zero prep, one licence for the whole school.`,
  // Launched 14 August 2026 on schools.guidedchildhood.com: indexable. The
  // open surface is home, pricing, the curriculum map, the RSHE mapping
  // matrix and the philosophy page (the open map decision, 30 August 2026,
  // extended 31 August), all pages we want indexed; everything else
  // redirects to /unlock, which sets noindex on itself, so crawlers never
  // reach the gated content. app/sitemap.ts lists the same open set.
  robots: { index: true, follow: true },
  // The site's face in a forwarded link and on a phone's home screen. The
  // share image is a static render (public/og.png), the icon an SVG star on
  // butter (app/icon.svg) with a PNG for iOS (app/apple-icon.png).
  openGraph: {
    type: 'website',
    siteName: 'Guided Childhood Schools',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Guided Childhood Schools: the digital literacy curriculum, Reception to Year 13' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
}

export const viewport: Viewport = {
  themeColor: '#F9F8F6',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
