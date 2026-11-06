import DeckViewer from '@/app/(dashboard)/dashboard/scripts/[id]/deck/DeckViewer'

// Fixture reference page for the script deck, the card by card way through a
// script ("Try as deck" on any script page): the REAL DeckViewer with made up
// props, no database, so it can be filmed and screenshotted. The words are
// script 9671's with the two content fixes already in (the study's ages, and
// "let's"). Not linked from anywhere, and the middleware 404s it in production.

export const dynamic = 'force-dynamic'

const SCRIPT = {
  sort_order: 9671,
  stage_id: 'builder',
  category: 'screen-time',
  title: 'The stopping point agreed in a calm moment',
  situation: 'Every screen ends in a fight, and the fight is always at the ending. You give a two minute warning and it makes no difference, or it makes it worse.',
  say_this: "(Not at the screen. At the weekend, or on the walk home.) The hard bit is always the stopping, so let's decide the stopping before we start. When you put it on after school, what ends it? The end of the episode, the kitchen timer, or tea on the table? You pick, and then that is the deal and I will not add a warning.",
  not_this: 'Two minutes! One minute! Right, that is it, off, now. Or: fine, one more, but that is the last one.',
  why_it_works: 'The one close study of how screen time ends in families (28 families with children aged 1 to 5, and 380 endings) found two things. Endings set by the technology itself, the episode finishing or the timer going, went better than a parent interrupting. And children who had been warned were more upset, not less, which the researchers think is partly because parents warn when they already expect trouble. Advance notice alone did not help in a separate behaviour study either.\n\nWhat did help was the ending being routine rather than a surprise, and the child knowing it before the screen went on. The NHS sleep guidance for school age children says the same about bedtime: a short fixed sequence and the same cue every time. So the conversation happens in a calm moment, away from the screen, and the child chooses the ending. Then the ending is the deal, not your mood, and you have nothing to negotiate at half past four.\n\nThe RCPCH tells families to agree their screen plan in exactly this way, as a family, when nobody is mid episode.',
  tonight: 'Tonight, name the ending for tomorrow together: episode, timer or tea. Write it on the fridge in their words. Tomorrow, when it ends, say only "That was the deal. Well done." Nothing else.',
}

// Script 9651, word for word from migration 261 (checked against the live
// table on 6 November 2026), for the DiGi short on game money. Opened with
// /ref-script-deck?script=9651.
const SCRIPT_9651 = {
  sort_order: 9651,
  stage_id: 'builder',
  category: 'gaming',
  title: 'The first gift card, before the first spend',
  situation: "They have started asking for Robux, V Bucks or a skin, or you have a feeling the asking is about to start. No money has gone anywhere yet. This is the good moment, and it does not come again.",
  say_this: "Here is how game money works in our house. Once a month you get one card, this much, and it is yours to spend however you like in the game. When it is gone, it is gone until next month, and I will never top it up in between, so think about what you really want. Show me what you buy, not because I am checking, because I want to see it.",
  not_this: "You are not wasting my money on fake stuff in a game. Ask me again and the game goes.",
  why_it_works: "The money arrives before the phone. In the UK, 97 percent of 8 to 17 year olds play games online and 53 percent of them spend real money inside those games, and among children who spent last month a third say they often regret it. Under 14s mostly pay with a gift card, which makes the card the best lever a parent has ever been handed: a fixed amount, agreed in advance, that runs out.\n\nThe games will not help you. A study of the 100 highest grossing iPhone games found that not one of those selling loot boxes asked for a parent's consent before letting a child buy, despite the industry's own rule saying they should. Fortnite's maker paid $245 million for a button layout that charged children with one accidental tap. So treat the rules as absent and build your own, and build them before the first spend, while it is a plan rather than an argument.\n\nThe card does three things a lecture cannot. It makes the money real, because it is a thing in their hand with a number on it. It teaches running out, which is the whole of budgeting. And it takes you out of the role of the person who says no every time, which is the role that makes children hide the next purchase.",
  tonight: "Tonight, turn off one tap purchase on every device they use and put a password on the store that they do not know. Then decide the monthly amount together and say when the first card is coming.",
}

const SCRIPTS: Record<string, typeof SCRIPT> = { '9671': SCRIPT, '9651': SCRIPT_9651 }

export default async function RefScriptDeck({
  searchParams,
}: { searchParams: Promise<{ script?: string }> }) {
  const { script } = await searchParams
  const chosen = SCRIPTS[script ?? ''] ?? SCRIPT
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <DeckViewer script={chosen} initialCompleted={false} categorySlug={chosen.category} />
    </div>
  )
}
