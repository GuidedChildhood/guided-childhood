import { AnswerBody } from '@/app/(dashboard)/dashboard/digi/DigiChat'
import DigiCharacter from '@gc/shared/components/DigiCharacter'

// Dev only fixture: the DiGi chat with one real shaped answer already in it,
// so the way an answer lands (numbered points, lists, bold lead ins, the
// streaming asterisk case) can be checked at 390 without a signed in parent.
// The words are the reply Justin got on 6 September 2026 for "Alma becoming
// cheeky", completed past the point where the live one was cut.

export const dynamic = 'force-dynamic'

const ANSWER = [
  'Cheek arriving at 11 to 12 is right on schedule. It is the first clumsy draft of independence: Alma is testing whether she can push against you and still be loved, and the tone lands worse than she intends because she does not yet have the skill to disagree gracefully. It says nothing about her character and nothing about your parenting.',
  '**Respond to the need, not the tone.** Dr Becky Kennedy\'s frame fits here: behaviour is a signal, not a character problem. Underneath most cheek is a bid for more say over her own life. When you answer the bid ("you want more of a say in this, I get it, let\'s talk about it") the attitude often deflates on its own, because it was never really about the eye roll.',
  '**Pick your line and hold it calmly.** Not everything needs a reaction. Sarky humour and a bit of attitude can pass without comment, but disrespect gets one flat, boring sentence: "You can be annoyed with me, you cannot speak to me like that. Try again." Then move on. No lecture, no debate, no matching her energy. The calmer and duller your response, the less fuel the cheek gets.',
  '**Watch when it shows up.** If it clusters after screens, late in the evening or straight after school, that is a tired or overstimulated child rather than a rude one, and the fix is the timing, not the telling off. Three things worth noticing this week:',
  '- Which hour of the day it lands in\n- Whether it follows a screen session\n- Who it is aimed at, you or a sibling',
  'Tonight, try the one flat sentence once and walk away. You are showing her that disagreement is allowed and disrespect simply does not work, which is the whole lesson at this age.',
].join('\n\n')

const CUT = 'In front of friends the audience is the point, so the move is to take the audience away rather than win in front of it.\n\n**Say less, later.** One quiet line now ("we will talk about that later"), then the real conversation once the friends have gone. Calling it out in front of them makes her double down to save face.\n\n**Keep the standard the same.** The rule does not change because people are watching, and she needs to know that.\n\n**Watch when it sh'

function Turn({ question, answer }: { question: string; answer: string }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 22 }}>
        <div style={{ maxWidth: '84%', background: '#DCE7FB', color: '#1B2A4A', borderRadius: 20, padding: '14px 18px', fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', lineHeight: 1.45, fontWeight: 800 }}>
          {question}
        </div>
      </div>
      <div style={{ marginBottom: 26 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
          <div style={{ width: 26, height: 26, flexShrink: 0 }}><DigiCharacter size={26} mood="wave" /></div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>DiGi</span>
        </div>
        <AnswerBody text={answer} />
      </div>
    </>
  )
}

export default function DigiAnswerFixture() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '20px 20px 60px', background: 'var(--white)' }}>
      <Turn question="Alma becoming cheeky" answer={ANSWER} />
      <Turn question="What if she does it in front of her friends?" answer={CUT} />
    </div>
  )
}
