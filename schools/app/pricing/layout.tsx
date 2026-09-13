import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      {children}
      <SiteFooter />
    </>
  )
}
