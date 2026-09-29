// Nothing a family prints leaves the house unbranded.
//
// Justin, 29 September 2026: "check all options to print are perfect
// professional print outs, all branded and perfect for cards on the fridge."
// The audit that day found the Right now script card printing the phone sheet
// itself with no logo, the star chart and the kid app's photo sheets with no
// logo, and the public scripts page with a footer but no header and doubled
// quote marks. This holds every print surface to a brand mark and to colours
// that print without a parent ticking background graphics.
//
// Node builtins only: runs in the concern-guards job with no npm ci.

import { readFileSync } from 'node:fs'

const BRAND = /PrintBrandHeader|PrintBrandFooter|PrintBrandMark|BRAND_NAME|LOGO_BARS|>guidedchildhood\.com<|Guided Childhood ·/
const COLOUR = /print-color-adjust|printColorAdjust|PASSPORT_PRINT_RESET/

// Every surface a Print button produces, and the file that draws the paper.
const SURFACES = [
  ['the script fridge card', 'components/rightnow/ScriptFridgeCard.tsx'],
  ['the public scripts page', 'app/(marketing)/scripts/page.tsx'],
  ['the family deal', 'app/(dashboard)/dashboard/agreement/print/page.tsx'],
  ['the passport pages', 'app/(dashboard)/dashboard/keepsakes/passport-print/page.tsx'],
  ['the passport zine', 'components/pathway/PassportZineSheet.tsx'],
  ['the craft pack', 'app/(dashboard)/dashboard/quests/crafts/CraftPack.tsx'],
  ['the quest sheets', 'app/(dashboard)/dashboard/quests/print/page.tsx'],
  ['the star chart', 'components/printables/StarChartSheet.tsx'],
  ['the bucket list', 'components/printables/BucketSheet.tsx'],
  ['the friends poster', 'components/printables/FriendsPoster.tsx'],
  ['the curriculum sheet', 'components/printables/CurriculumSheet.tsx'],
  ['the drawn sheets', 'components/printables/drawn/HappyPaper.tsx'],
  ['the kid app photo sheets', 'components/kid/KidSheetPaper.tsx'],
]

const fail = []
for (const [name, file] of SURFACES) {
  let src = ''
  try { src = readFileSync(file, 'utf8') } catch { fail.push(`${name}: ${file} is missing`); continue }
  if (!BRAND.test(src)) fail.push(`${name} (${file}) prints with no brand mark`)
}

// Colours forced on the surfaces whose look is mostly background colour.
for (const [name, file] of SURFACES.filter(([n]) => ['the script fridge card', 'the public scripts page', 'the star chart', 'the quest sheets', 'the kid app photo sheets'].includes(n))) {
  const src = readFileSync(file, 'utf8')
  if (!COLOUR.test(src)) fail.push(`${name} (${file}) does not force its colours to print, so the tinted boxes come out white`)
}

// The Right now sheet prints the card, not itself.
const rn = readFileSync('components/rightnow/RightNowButton.tsx', 'utf8')
if (!/<ScriptFridgeCard\b/.test(rn)) fail.push('RightNowButton no longer renders the fridge card, so Print the card prints the phone sheet')
if (/\.rightnow-sheet, \.rightnow-sheet \* \{ visibility: visible/.test(rn)) fail.push('RightNowButton prints the phone sheet by visibility again')
const card = readFileSync('components/rightnow/ScriptFridgeCard.tsx', 'utf8')
if (!/body > \*:not\(\.script-fridge-print\) \{ display: none !important; \}/.test(card)) fail.push('the fridge card no longer hides the app in print, so it can run to extra pages')

// The public scripts page: the words carry their own quotes.
const pub = readFileSync('app/(marketing)/scripts/page.tsx', 'utf8')
if (/"\{stage\.script\.notThis\}"/.test(pub)) fail.push('the public scripts page wraps Not this in a second pair of quote marks again')

if (fail.length) {
  console.error('check-print-brand FAILED\n' + fail.map(f => '  ' + f).join('\n'))
  process.exit(1)
}
console.log(`check-print-brand: ok (${SURFACES.length} print surfaces branded, colours forced, the fridge card is what prints)`)
