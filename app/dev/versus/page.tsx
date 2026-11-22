import KidVersus from '@/components/kid/KidVersus'
import { resolveTheme } from '@/lib/kid/theme'

// Dev harness for Me v my grown up. The real page gathers the child's own
// lesson questions server side; this plays the same screen from a fixture.
// ?few=1 shows the "do a few lessons first" state.
const POOL = [
  { q: 'A message pops up from someone you do not know. What do you do first?', options: ['Reply to be polite', 'Show a grown up', 'Delete the app'], answer: 1, why: 'A grown up can help you decide. You never have to work it out alone.' },
  { q: 'A picture online looks real. Is it always real?', options: ['Yes, photos never lie', 'Not always, it could be made up', 'Only if it has lots of likes'], answer: 1, why: 'Pictures can be changed or made by a computer. Asking is the smart move.' },
  { q: 'Your timer goes off in the middle of a game. The kind move is to', options: ['Ask for ten more minutes', 'Save and stop', 'Hide the tablet'], answer: 1, why: 'Stopping when the timer goes is how the deal keeps working for everyone.' },
  { q: 'Which is private?', options: ['Your favourite colour', 'Your home address', 'Your favourite food'], answer: 1, why: 'Your address is private, like a toothbrush: just for you and your family.' },
  { q: 'Someone is unkind in a group chat. You can', options: ['Join in', 'Tell a grown up and not reply', 'Leave the phone on'], answer: 1, why: 'Not replying and telling someone stops it growing.' },
  { q: 'A game asks you to pay to win. That is', options: ['Fair', 'A trick to get money', 'Always free'], answer: 1, why: 'Some games are built to make you want to spend. Spotting it is a superpower.' },
]
export default async function VersusHarness({ searchParams }: { searchParams: Promise<{ few?: string }> }) {
  const { few } = await searchParams
  return <KidVersus token="000000000000000000" childName="Mia" pool={few ? POOL.slice(0, 2) : POOL} theme={resolveTheme(null)} />
}
