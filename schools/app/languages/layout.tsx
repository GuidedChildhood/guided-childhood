import type { Metadata } from 'next'
import SiteNav from '@/components/SiteNav'
import { navAccess } from '@/lib/licence'
import { PAGE_SHELL } from '@gc/shared/page-scale'

// French and Spanish, hidden until finished (lib/languages-access.ts).
//
// 9 November 2026: the area now carries the site nav, with its own Languages
// tab, so a teacher holding both codes moves between the digital scheme and
// languages in one tap. The rule underneath is unchanged: nothing outside
// this area links in for a stranger, because the tab only renders for a
// languages code (or once LANGUAGES_LIVE is on).
export const metadata: Metadata = {
  title: { default: 'Languages', template: '%s · Languages' },
  robots: { index: false, follow: false },
}

export default async function LanguagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav {...await navAccess()} />
      <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>{children}</main>
    </>
  )
}
