import FixtureViews from './FixtureViews'

// Fixture reference page for the ask flow: ?view=child (default) stacks the
// child banner states and the open picker, ?view=parent shows the ask box
// with the redesigned locked banner, ?view=share the named QR share. Real
// components, made up props, no database. Not linked from anywhere.

export const dynamic = 'force-dynamic'

export default async function RefAskFirst({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams
  return <FixtureViews view={view ?? 'child'} />
}
