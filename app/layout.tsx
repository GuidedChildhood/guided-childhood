import type { Metadata, Viewport } from 'next'
import { Nunito, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import PwaRegister from '@/components/PwaRegister'
import UpdateBanner from '@/components/UpdateBanner'

// Fonts loaded through Next's font pipeline, not a CSS @import. The old import
// was render blocking and flashed a generic system font before Nunito arrived,
// which is what made the type read cheap for a beat on first paint. Self hosted
// and preloaded, the brand font is there from the first frame.
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
  title: {
    default: 'Guided Childhood, Screen Time and Digital Parenting Guide for UK Families',
    template: '%s | Guided Childhood',
  },
  description: 'Stop guessing what to say. Guided Childhood gives UK parents the exact scripts for screen time fights, gaming meltdowns, social media access, and bedtime battles. Stage by stage from age 4 to 16.',
  keywords: ['digital parenting', 'screen time children UK', 'online safety kids', 'parenting advice screens', 'children social media age', 'phone rules children', 'digital wellbeing family', 'screen time guide UK parents'],
  authors: [{ name: 'Justin Phillips' }],
  creator: 'Guided Childhood',
  publisher: 'Guided Childhood',
  openGraph: {
    title: 'Guided Childhood, The Stage-by-Stage Digital Parenting Guide',
    description: 'From first screen at age 4 to full independence at 16. Exact scripts for every hard moment. DiGi your evidence led guide. For UK families.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'Guided Childhood',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guided Childhood, Digital Parenting for UK Families',
    description: 'The stage-by-stage guide to raising children with screens. Ages 4 to 16. Built on the research.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Guided Childhood',
  },
}

export const viewport: Viewport = {
  themeColor: '#F7F3EE',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${plexMono.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <PwaRegister />
        <UpdateBanner />
        {children}
      </body>
    </html>
  )
}
