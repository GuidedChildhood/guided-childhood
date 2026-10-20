import PublicScriptView from '@/components/scripts/PublicScriptView'

// The public shared script page (app/say/[id]) with fixed props and no
// database, so the layout can be checked at 390 and 1280 before it ships.
//
// This fixture is why the view was split out of the route at all. The real
// page reads with the service role, which means it cannot render on a machine
// that has no service key, which means the one page in this product that only
// strangers ever see was also the one page nobody could look at on a phone.
//
// ?member=1 renders the member version: no sticky bar, no held back list, and
// the button points into the app. Both states, one route.

export default async function SharedScriptFixture({
  searchParams,
}: {
  searchParams: Promise<{ member?: string }>
}) {
  const { member } = await searchParams

  // Real row 1 from the live table, so the measurements are honest: a title
  // that wraps, a situation of real length, and a say_this long enough to run
  // to three lines on a phone, which is where the layout actually has to work.
  return (
    <PublicScriptView
      title="Meltdown when screen time ends"
      situation="When a child cries, argues, or has a meltdown as the TV or tablet goes off."
      sayThis="I know that feels really hard. Your brain wants to keep going. That is normal. Let us do a quick wind down together and then we will find the next thing."
      notThis="Stop crying or you will lose screen time tomorrow."
      stageId="foundation"
      sortOrder={2}
      member={member === '1'}
    />
  )
}
