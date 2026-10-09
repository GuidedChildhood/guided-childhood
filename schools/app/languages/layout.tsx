import type { Metadata } from 'next'

// French and Spanish, hidden until finished (lib/languages-access.ts). No
// site nav on purpose: nothing here links back into the scheme's selling
// pages, and nothing there links here.
export const metadata: Metadata = {
  title: { default: 'Languages', template: '%s · Languages' },
  robots: { index: false, follow: false },
}

export default function LanguagesLayout({ children }: { children: React.ReactNode }) {
  return <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '56px 20px 90px' }}>{children}</main>
}
