import { HappyPaper, Caption, WriteLine, Sun, Heart, Star, Rainbow, INK, INK_MUTED, RULE, CRAYON, useExample } from './HappyPaper'

// Kindness Postcards, every age (stages 1 to 5).
//
// The School of Kindness postcards made ours: four cards on one sheet to
// colour, cut out and hand to someone today. A real card in a real hand is
// the offline connection the whole product is built on, and it is the one
// thing a message on a screen can never be. The fourth card is a small
// invitation with no screens in it, which is the product's own move.

type Card = { head: string; doodle: React.ReactNode; hint: string; lines: string[]; to: string; from: string; crayon: string }

const CARDS: Card[] = [
  { head: 'Thank you for', doodle: <Sun size={64} />, hint: 'one thing they did', lines: ['helping me with my', 'maths homework even', 'when it was late'], to: 'Nana', from: 'me', crayon: CRAYON.paper },
  { head: 'You made my day when', doodle: <Star size={60} />, hint: 'the moment, in your words', lines: ['you came to my match', 'in the rain and', 'cheered the loudest'], to: 'Dad', from: 'me', crayon: CRAYON.paper },
  { head: 'I noticed you', doodle: <Heart size={60} />, hint: 'something kind they did', lines: ['let the new girl sit', 'with you at lunch', ''], to: 'Priya', from: 'me', crayon: '#fff' },
  { head: 'Let\'s do this, no screens', doodle: <Rainbow width={78} />, hint: 'a plan for the two of you', lines: ['', '', ''], to: '', from: '', crayon: '#fff' },
]

function Postcard({ head, doodle, hint, lines, to, from, crayon }: Card) {
  const ex = useExample()
  return (
    <div style={{ border: `2.5px dashed ${RULE}`, borderRadius: 6, padding: '12px 14px 10px', display: 'flex', flexDirection: 'column', height: 296, boxSizing: 'border-box', position: 'relative', background: ex ? crayon : '#fff' }}>
      <span aria-hidden style={{ position: 'absolute', top: -12, left: -12, fontSize: 18 }}>✂️</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flexShrink: 0 }}>{doodle}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, lineHeight: 1.1, color: INK, letterSpacing: '-0.01em' }}>
          {head}
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: INK_MUTED, marginTop: 6 }}>
        {hint}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
        {lines.map((l, i) => <WriteLine key={i} height={30} sample={l || undefined} />)}
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
        <WriteLine label="To" height={30} size={13} sample={to || undefined} />
        <WriteLine label="From" height={30} size={13} sample={from || undefined} />
      </div>
    </div>
  )
}

export default function KindnessPostcardsSheet({ childName, stars }: { childName: string; stars: number }) {
  return (
    <HappyPaper
      title="Kindness postcards"
      kicker={`${childName ? `From ${childName}` : 'From me'} · colour one, write one, hand it over today`}
      stars={stars}
      deal="Four cards given away? That is four happier people."
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, flexShrink: 0 }}>
        {CARDS.map(c => <Postcard key={c.head} {...c} from={c.from === 'me' ? (childName || 'Alfie') : c.from} />)}
      </div>
      <Caption size={15} top={14}>
        A real card in a real hand beats a message on a screen every single time.
      </Caption>
    </HappyPaper>
  )
}
