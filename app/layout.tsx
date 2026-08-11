import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
// Shared tokens first, then this app's own styles on top. The schools app
// imports the same tokens file, which is what keeps the two products one
// brand (split step 3, plans/split-plan.md).
import '@gc/shared/tokens.css'
import './globals.css'
import { SITE_URL } from '@/lib/config/site'
import PwaRegister from '@/components/PwaRegister'
import UpdateBanner from '@/components/UpdateBanner'

// Fonts loaded through Next's font pipeline, not a CSS @import. The old import
// was render blocking and flashed a generic system font before Nunito arrived,
// which is what made the type read cheap for a beat on first paint. Self hosted
// and preloaded, the brand font is there from the first frame.
//
// VENDORED IN THE REPO, not fetched from Google at build time. 11 August 2026:
// two production deploys in a row died in 21 seconds with module-not-found on
// nunito_*.module.css, which is what next/font/google looks like when the
// build machine cannot reach Google Fonts for a moment. A brand whose whole
// pitch includes ban resilience should not have a build that falls over when
// one third party has a bad minute. The woff2 files live in app/fonts (six
// files, about 140KB, OFL licensed, latin subset from the fontsource
// packages): Nunito as a VARIABLE font, one file per style covering every
// weight the old list named and the ones between, and IBM Plex Mono as the
// four static weights it actually ships. Same CSS variables, same swap, so
// nothing downstream moves.
const nunito = localFont({
  src: [
    { path: './fonts/nunito-latin-wght-normal.woff2', weight: '200 1000', style: 'normal' },
    { path: './fonts/nunito-latin-wght-italic.woff2', weight: '200 1000', style: 'italic' },
  ],
  variable: '--font-nunito',
  display: 'swap',
})
const plexMono = localFont({
  src: [
    { path: './fonts/ibm-plex-mono-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/ibm-plex-mono-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/ibm-plex-mono-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './fonts/ibm-plex-mono-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
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
    // Built from app/ref-og-card rather than drawn by hand or generated, so
    // the wordmark is really Nunito and the butter is really the token. A
    // relative path works because metadataBase is set above; without it Next
    // would resolve this against localhost and every share would be blank.
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Guided Childhood, digital parenting for ages 4 to 16' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guided Childhood, Digital Parenting for UK Families',
    description: 'The stage by stage guide to raising children with screens. Ages 4 to 16. Built on the research.',
    // summary_large_image was already set with nothing behind it, which is
    // what made every share a blank grey rectangle.
    images: ['/og.png'],
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
