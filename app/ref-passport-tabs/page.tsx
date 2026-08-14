import PassportTabs, { PASSPORT_TABS, readTab, tabTheme } from '@/components/passport/PassportTabs'
import SectionTiles from '@/components/ui/SectionTiles'

// Fixture reference page: the REAL tab bar and the REAL panel tint, so the
// pastels can be seen and screenshotted at 390 and on a desk without a logged
// in parent and without a passport with anything in it. Not linked from
// anywhere. Same idea as /ref-shop and /ref-passport-book.
//
// ?tab= switches the live bar at the top. The four blocks under it show all
// four states at once, which is the thing a screenshot of one tab cannot show:
// whether four pastels sitting next to each other read as four different
// places or as one soft mass.

export const dynamic = 'force-dynamic'

export default async function RefPassportTabs({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab: raw } = await searchParams
  const active = readTab(raw)
  const theme = tabTheme(active)

  return (
    <div style={{ background: 'var(--app-bg)', minHeight: '100vh', paddingBottom: 40 }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <PassportTabs active={active} />
      </div>
      <div style={{ background: theme.tint, borderTop: `2px solid ${theme.bold}`, paddingTop: 18, paddingBottom: 24 }}>
        <div style={{ padding: '0 20px', maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 12px' }}>
            Panel for {active}
          </p>
          <SectionTiles
            tiles={[
              { href: '#a', label: 'Print the passport', sub: 'Their real one, posted as a booklet', icon: '📮', bg: 'var(--stage-4-bold)', accent: 'var(--pastel-pink-deep)' },
              { href: '#b', label: 'Fill the next page', sub: "The lessons that stamp Ivy's stage", icon: '📖', bg: 'var(--stage-1-bold)', accent: 'var(--terracotta)' },
              { href: '#c', label: 'The road to sixteen', sub: 'All five stages on one road', icon: '🗺️', bg: 'var(--stage-2-bold)', accent: '#A9C8E4' },
              { href: '#d', label: 'Is it working', sub: 'The honest read on where you are', icon: '📈', bg: 'var(--tint-sage)', accent: '#9CC3B4' },
            ]}
          />
        </div>
      </div>

      {/* All four states side by side, which one screenshot of one tab cannot
          show: whether four pastels read as four places or one soft mass. */}
      <div style={{ padding: '26px 20px 0', maxWidth: 720, margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 10px' }}>
          Every tab active in turn
        </p>
        {PASSPORT_TABS.map(t => (
          <div key={t.key} style={{ marginBottom: 6, background: '#fff', borderRadius: 16, border: '1px solid var(--border)' }}>
            <PassportTabs active={t.key} />
          </div>
        ))}
      </div>
    </div>
  )
}
