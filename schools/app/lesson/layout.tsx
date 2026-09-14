import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import { navAccess } from '@/lib/licence'

// The same header and footer as every other section. This section used to
// carry its own header, or none (the schools review, 13 September 2026).
export default async function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav {...await navAccess()} />
      {children}
      <SiteFooter />
    </>
  )
}
