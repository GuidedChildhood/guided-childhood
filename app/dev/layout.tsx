import { notFound } from 'next/navigation'

// The dev harnesses are for us, not for the public.
//
// There are seventeen of them now, one per fiddly component, and every one was
// a real route on the live site: guidedchildhood.co.uk/dev/your-screens would
// have served a page. Nothing there leaks data, they all render fake props, but
// they are half finished looking pages under our own domain with our own
// branding, and robots.txt never disallowed /dev either, so they were
// crawlable. A parent or a school finding one does not think "test harness",
// they think the product is broken.
//
// Gated on VERCEL_ENV rather than NODE_ENV on purpose. NODE_ENV is production
// on preview deployments too, so testing against it would have shut the
// harnesses off exactly where they are most useful, which is the preview
// attached to a pull request. VERCEL_ENV is 'production' only on the live
// deployment, 'preview' on PR builds, and undefined locally.
export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL_ENV === 'production') notFound()
  return <>{children}</>
}
