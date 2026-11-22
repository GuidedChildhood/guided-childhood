import PlainHeader from '@/components/marketing/PlainHeader'
import { HUB_PATH } from '@/lib/app-safety/content'

// The app safety pages wear the guides' plain header, pointing back at the hub.
export default function AppSafetyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <PlainHeader section={{ href: HUB_PATH, label: 'App guide' }} track="app-guide-header" />
      {children}
    </div>
  )
}
