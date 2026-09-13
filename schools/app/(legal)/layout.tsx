import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import { hasLicence } from '@/lib/licence'

// The three buying documents (terms, privacy notice, DPA) share the site's
// header and footer, like every other text page, and they are open to the
// world (lib/access.ts OPEN_PATHS): a school reads them before it buys.
export default async function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav licensed={await hasLicence()} />
      {children}
      <SiteFooter />
    </>
  )
}
