import Link from 'next/link'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'
import { eyebrow } from '@/components/ui'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import { navAccess } from '@/lib/licence'

// THE 404, WHICH NINETEEN PLACES ALREADY POINTED AT.
//
// There are nineteen notFound() calls in this app: a lesson that is not in the
// scheme, a stage that does not exist, a quiz with no questions yet, a class
// link whose id is not a uuid. Every one of them was landing a teacher on the
// Next.js default page, black on white, in a typeface we do not use, saying
// "404 This page could not be found."
//
// A teacher who has just clicked a link a colleague sent them, in front of a
// class, reads that as the product being broken. It is usually a mistyped
// module name or a lesson outside their licence, and both of those have an
// answer we can give.
//
// So: name the likely cause, offer the two doors back, and do not apologise.
export default async function NotFound() {
  return (
    <>
    <SiteNav {...await navAccess()} />
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>
        <div style={{ ...eyebrow, marginBottom: 'var(--space-2)' }}>That page is not here</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-3)' }}>
          We could not find that one.
        </h1>
        <p style={{ ...PAGE.lead, color: 'var(--ink-soft)', margin: '0 0 var(--space-5)' }}>
          Usually this is a lesson name typed slightly differently, or a link to
          something outside the part of the scheme your school has opened. The
          curriculum page lists every module by year group, and the print room
          has every sheet.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link className="btn btn-gold" href="/curriculum">See every module</Link>
          <Link className="btn btn-outline" href="/print">The print room</Link>
        </div>
      </div>
    </main>
    <SiteFooter />
    </>
  )
}
