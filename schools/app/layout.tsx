import type { Metadata, Viewport } from 'next'
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
    'A complete digital literacy scheme of work for UK schools, Reception to Year 13, built on the Education for a Connected World framework and the 2025 RSHE guidance. Open catalogue, zero prep lessons, no login.',
  robots: { index: true, follow: true },
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
