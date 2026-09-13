import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import { hasLicence } from '@/lib/licence'

// The same header and footer as every other section. This section used to
// carry its own header, or none (the schools review, 13 September 2026).
export default async function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav licensed={await hasLicence()} />
      {children}
      <SiteFooter />
    </>
  )
}
