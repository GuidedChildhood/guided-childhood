import ScriptsLibrary from '@/components/scripts/ScriptsLibrary'
import { STAGE_META, type ScriptRow, type StageId } from '@/components/scripts/library-meta'
import { CATEGORY_META } from '@/components/scripts/library-meta'
import { momentFor } from '@/lib/scripts/moments'

// Dev harness for the Scripts page shelves. The real page reads the family
// from Supabase; this draws the same view from a fixture: an 8 to 10 year old
// with a gaming worry raised twice, one script that did not land, one used a
// month ago, one read and never tried. ?paid=0 shows the locked state.

const T: [StageId, string, string, string][] = [
  ['builder', 'Screen time is up and the game is not finished', 'The standoff at the end of a session, when stopping feels unfair.', 'gaming'],
  ['builder', 'They want Roblox like everyone at school', 'The ask that arrives with a list of friends who have it.', 'gaming'],
  ['builder', 'Someone they do not know messaged them in a game', 'A stranger in the chat, and whether they will tell you.', 'staying-safe'],
  ['builder', 'Bedtime and the tablet', 'One more video, every night, at the same time.', 'screen-time'],
  ['builder', 'The group chat got unkind', 'A friend left out, or your child the one doing it.', 'social-media'],
  ['builder', 'They say everyone else has a phone', 'The ten year old phone ask, and what a plan looks like.', 'family-rules'],
  ['builder', 'Homework done by AI', 'When the answer came from a chatbot.', 'school-and-ai'],
  ['builder', 'Morning meltdown about clothes', 'Getting out of the door without the fight.', 'everyday-routines'],
  ['builder', 'Lost the match and slammed the controller', 'Big feelings after a game goes wrong.', 'gaming'],
  ['builder', 'A video scared them', 'Something they saw that they cannot unsee.', 'staying-safe'],
  ['builder', 'Siblings fighting over the TV', 'Two children, one screen, ten minutes to dinner.', 'everyday-routines'],
  ['foundation', 'Tablet tantrum at handover', 'The handover that goes wrong every time.', 'screen-time'],
  ['foundation', 'Brushing teeth without a battle', 'Night after night, the same argument.', 'everyday-routines'],
  ['explorer', 'Their first phone', 'The rules you agree before it arrives.', 'family-rules'],
  ['explorer', 'Comparing themselves on social media', 'Not good enough, scrolled into their pocket.', 'mood-confidence'],
]
const scripts: ScriptRow[] = T.map(([stage_id, title, situation, category], i) => ({ id: `s${i}`, stage_id, title, situation, category, is_free: i < 2, sort_order: i + 1 }))

export default async function ScriptsPageHarness({ searchParams }: { searchParams: Promise<{ paid?: string; fresh?: string }> }) {
  const { paid, fresh } = await searchParams
  const isFresh = fresh === '1'
  const byStage = (Object.keys(STAGE_META) as StageId[])
    .map(stageId => ({ stageId, meta: STAGE_META[stageId], items: scripts.filter(s => s.stage_id === stageId) }))
    .filter(g => g.items.length)
  const counts = new Map<string, number>()
  for (const s of scripts) counts.set(s.category, (counts.get(s.category) ?? 0) + 1)
  const chips = Object.keys(CATEGORY_META).filter(k => counts.get(k)).map(k => ({ key: k, label: CATEGORY_META[k].label, n: counts.get(k)! }))
  return (
    <ScriptsLibrary
      momentCards={scripts.filter(s => s.stage_id === 'builder').map(s => ({
        sort_order: s.sort_order, title: s.title, situation: s.situation,
        say: paid === '0' && !s.is_free ? null : 'I can see you want to finish. You get to save it now, and we will play again tomorrow after school.',
        pushBack: paid === '0' && !s.is_free ? null : 'Stay calm and say it once more, the same words. Then put the controller on the shelf together. No new deal tonight.',
        moment: momentFor(s), locked: paid === '0' && !s.is_free,
      }))}
      pinned={isFresh ? [] : [1, 4]}
      askBack={isFresh ? null : { id: 'n1', title: 'Screen time is up and the game is not finished', kind: 'timer_end' }}
      isPaid={paid !== '0'}
      scripts={scripts}
      completed={isFresh ? [] : [4, 6, 8]}
      childName="Teo"
      childQS={null}
      tally={isFresh ? { had: 0, wentWell: 0 } : { had: 3, wentWell: 1 }}
      recommended={{ sort_order: 1, title: scripts[0].title, situation: scripts[0].situation, is_free: true, reason: 'Gaming at the end of the day. You have raised this twice' }}
      morePicks={[
        { sort_order: 3, title: scripts[2].title, situation: scripts[2].situation, is_free: false, reason: 'Because there is an Xbox in the house' },
        { sort_order: 9, title: scripts[8].title, situation: scripts[8].situation, is_free: false, reason: 'Sleep dipped on your last check in' },
      ]}
      revisit={isFresh ? [] : [
        { sort_order: 4, reason: 'did-not-land', line: 'You said it did not land. The push back part is written for this' },
        { sort_order: 6, reason: 'refresh', line: 'You used this a month ago. A quick look keeps the words ready' },
        { sort_order: 7, reason: 'try-it', line: 'You read this one. Has the moment come up yet?' },
      ]}
      topicScripts={[]}
      topicLabel={null}
      topicConfident
      byStage={byStage}
      theirStage="builder"
      chips={chips}
      activeCat={null}
      askedStage={null}
      cameFromPathway={false}
      pathwayHref="/dashboard/pathway"
      initialQuery=""
    />
  )
}
