import SiteNav from '@/components/SiteNav'

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      {children}
    </>
  )
}
