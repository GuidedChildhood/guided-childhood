import SiteNav from '@/components/SiteNav'
import { navAccess } from '@/lib/licence'

export default async function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav {...await navAccess()} />
      {children}
    </>
  )
}
