import FamilyDealSheet from '@/components/deal/FamilyDealSheet'
import { promisesFrom, agreementTypeLabel } from '@/lib/content/agreement-promises'
import { scienceForType } from '@/lib/content/agreement-clauses'
import { buddyFor } from '@/lib/kid/buddy'

// Dev fixture: the fridge sheet, with the promises on it (14 September 2026).
//
//   /dev/deal-sheet                    a Tablet and gaming deal, signed by both
//   /dev/deal-sheet?type=first-phone   a First phone deal
//   /dev/deal-sheet?legacy=1           a row saved before the structured clauses
//   /dev/deal-sheet?unsigned=1         nobody has signed yet
//
// Print it (Cmd P) to see the A4 cut.

export const dynamic = 'force-dynamic'

const ROWS: Record<string, Record<string, string>> = {
  'tablet-games': {
    'screens-off': '7pm on school nights, later at weekends',
    'device-sleep': 'Every device charges in the kitchen overnight',
    'ask-first': 'We look at a new game or app together before it is downloaded',
    'money': 'One gift card a month, agreed together, and never topped up',
    'earn-time': 'Jobs earn stars, stars buy screen time',
    'when-wrong': 'Telling us is always safe. Nobody loses their device for telling',
  },
  'first-phone': {
    'screens-off': '8pm on school nights, later at weekends',
    'device-sleep': 'Devices sleep in the parents room',
    'answer-call': 'If we call or text, answer as soon as you can',
    'kindness': 'We are kind online the way we are kind in the playground',
    'when-wrong': 'Telling us is always safe. Nobody loses their device for telling',
  },
}

export default async function DealSheetFixture({ searchParams }: { searchParams: Promise<{ type?: string; legacy?: string; unsigned?: string }> }) {
  const sp = await searchParams
  const typeKey = sp.type && ROWS[sp.type] ? sp.type : 'tablet-games'
  const row = sp.legacy === '1'
    ? { agreement_type: null, clauses: null, bedroom_rule_time: '7pm on school nights', bedroom_rule_location: 'Kitchen overnight', extra_agreements: 'How screen time is earned: Stars from quests buy screen minutes\nScreens at the table: No screens at meals' }
    : { agreement_type: typeKey, clauses: ROWS[typeKey] }
  const buddy = buddyFor('bloop')
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 48px', background: '#fff', minHeight: '100dvh' }}>
      <FamilyDealSheet
        childName="Andy"
        starMinutes={5}
        recommendedMinutes={75}
        timerRule="Andy asks first, then starts the timer. When it rings, the screen goes off."
        agreedDate="1 September 2026"
        quests={[{ title: 'Tidy my room', emoji: '🧺', stars: 2 }, { title: 'One hour of outside play', emoji: '🌳', stars: 4 }, { title: 'Read for ten minutes', emoji: '📖', stars: 2 }]}
        goal={{ title: 'A new football', starsNeeded: 30 }}
        promises={promisesFrom(row)}
        typeLabel={agreementTypeLabel(row.agreement_type)}
        reviewDate="1 October 2026"
        signedByParent={sp.unsigned !== '1'}
        signedByChild={sp.unsigned !== '1'}
        friend={{ name: buddy.name, img: buddy.img }}
        science={scienceForType(row.agreement_type)}
      />
    </div>
  )
}
