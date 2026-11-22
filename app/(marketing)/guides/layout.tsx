import PlainHeader from '@/components/marketing/PlainHeader'

// The guides share one plain header: the logo home, a way back to the list,
// and the stage check, which is where every guide is trying to take a parent.
// The header itself lives in components/marketing/PlainHeader.tsx, which the
// app safety pages share (22 November 2026).
export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <PlainHeader section={{ href: '/guides', label: 'Guides' }} track="guides-header" />
      {children}
    </div>
  )
}
