import DigiWordCard from '@/components/home/DigiWordCard'
import WordCard from '@/app/(dashboard)/dashboard/word/WordCard'

// Dev fixture: the DiGi's word alert as it sits on Home, then the insight in
// full as the word page shows it, with sample content so the layout can be
// checked at 390 and 1440 without a signed in parent. Posts will 401 here,
// which is fine, the fixture is for eyes and thumbs.

export const dynamic = 'force-dynamic'

const WORD = {
  id: 'fixture-word-1',
  child_id: 'fixture-child',
  title: 'Alma asked for the phone at bedtime four nights running, and the science says that is the moment that matters most',
  body: `Every one of those four asks landed after 8pm, and three of them turned into the tone you rated a 2 at the check in. That is not defiance, it is a tired 11 year old with a device that is designed to be the last thing she looks at. Amy Orben's work finds the sleep cost of screens in bed is one of the few effects that shows up reliably at this age, while the total minutes across the day barely move the needle.

So the lever is not less screen time. It is where the phone sleeps. Once it charges outside her room the ask has nothing to attach to, and the bedtime tone tends to go with it within a week or two.

**Do this next.** Set the bedtime window on the timer tonight and say the one flat sentence once: the phone sleeps in the kitchen, same as ours.`,
  href: '/dashboard/quests/timer',
  cta: 'Set the bedtime window',
  source: 'Amy Orben',
  status: 'pending',
  reaction: null,
  created_at: new Date().toISOString(),
}

export default function DigiWordFixture() {
  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '24px 20px 60px', background: 'var(--cream)' }}>
      <p className="eyebrow" style={{ marginBottom: 10 }}>On Home</p>
      <DigiWordCard initial={{ id: WORD.id, title: WORD.title, created_at: WORD.created_at }} />
      <p className="eyebrow" style={{ margin: '28px 0 10px' }}>On the word page</p>
      <WordCard word={WORD} childName="Alma" latest />
    </div>
  )
}
