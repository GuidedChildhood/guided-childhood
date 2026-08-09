import type { Metadata, Viewport } from 'next'
import { Nunito, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { SITE_URL } from '@/lib/config/site'
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
  // The domain every relative URL in this block resolves against. Without it
  // Next resolves Open Graph and Twitter image paths against localhost during
  // the build and warns, and a share card pointing at localhost shows nothing
  // at all on WhatsApp, LinkedIn or Facebook.
  //
  // Read from lib/config/site rather than written here, with robots.ts and
  // sitemap.ts reading the same constant. All three used to hardcode it
  // separately and all three were wrong together: see that file for why the
  // domain is .com and why the app goes to app. and not www.
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Digital Literacy for Children Age 4 to 16, Research Based Pathway | Guided Childhood',
    template: '%s | Guided Childhood',
  },
  description: 'A research based digital literacy pathway for children from age 4 to 16. Safety settings for every device, AI and internet lessons by age, screen time they earn, and no social media cliff edge. For UK families.',
  keywords: ['digital literacy children', 'digital literacy age 4 to 16', 'online safety kids', 'AI lessons for children', 'screen time children UK', 'children social media age', 'parental controls by age', 'digital parenting', 'internet safety education kids', 'screen time guide UK parents'],
  authors: [{ name: 'Justin Phillips' }],
  creator: 'Guided Childhood',
  publisher: 'Guided Childhood',
  openGraph: {
    title: 'Guided Childhood, The Stage by Stage Digital Parenting Guide',
    description: 'From first screen at age 4 to full independence at 16. Exact scripts for every hard moment. DiGi your evidence led guide. For UK families.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'Guided Childhood',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guided Childhood, Digital Parenting for UK Families',
    description: 'The stage by stage guide to raising children with screens. Ages 4 to 16. Built on the research.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  manifest: '/manifest.json',
  // Was a hardcoded <link> in the head, which meant it also applied to the
  // child's own pages and beat their DiGi star icon. Here it is inherited
  // metadata, so a nested segment can replace it.
  icons: { apple: '/icons/icon-192.png' },
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
      {/* No hardcoded manifest or icon links here.
          Every one of these was already emitted by the metadata export above,
          so they were duplicates, and being hardcoded into the root head meant
          they appeared on EVERY route and could not be overridden by a nested
          one. That quietly broke the child app: /k/[token] served the parent
          manifest, whose start_url is /dashboard, so a child adding their jobs
          to their Home Screen got an icon that opened the parent dashboard and
          bounced them to a login screen. The DiGi star icon in
          app/k/[token]/apple-icon.tsx lost to the hardcoded apple-touch-icon
          the same way, despite its own comment saying Add to Home Screen would
          pick it up automatically.
          Metadata only from here, so a segment can say something different. */}
      <head />
      <body>
        <PwaRegister />
        <UpdateBanner />
        {children}
      </body>
    </html>
  )
}
