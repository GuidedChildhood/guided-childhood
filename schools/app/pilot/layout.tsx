import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import { hasLicence } from '@/lib/licence'

export default async function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav licensed={await hasLicence()} />
      {children}
      <SiteFooter />
    </>
  )
}
