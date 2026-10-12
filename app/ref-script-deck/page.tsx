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

export default function RefScriptDeck() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <DeckViewer script={SCRIPT} initialCompleted={false} categorySlug={SCRIPT.category} />
    </div>
  )
}
