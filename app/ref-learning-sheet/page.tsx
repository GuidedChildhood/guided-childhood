import LearningSheet from '@/components/learning/LearningSheet'

// Fixture reference page for the learning sheet: the REAL component with made
// up objectives and no database, so the sheet can be looked at on a phone and a
// desktop without a login. Not linked from anywhere.
//
// The objectives here are the genuine Year 4 autumn ones, so the fixture also
// shows the real line lengths rather than convenient short ones.

export const dynamic = 'force-dynamic'

const OBJECTIVES = [
  { id: '00000000-0000-0000-0000-000000000001', strand: 'Number and place value', objective: 'count in multiples of 6, 7, 9, 25 and 1000' },
  { id: '00000000-0000-0000-0000-000000000002', strand: 'Number and place value', objective: 'find 1000 more or less than a given number' },
  { id: '00000000-0000-0000-0000-000000000003', strand: 'Number and place value', objective: 'count backwards through zero to include negative numbers' },
  { id: '00000000-0000-0000-0000-000000000004', strand: 'Number and place value', objective: 'recognise the place value of each digit in a four-digit number (thousands, hundreds, tens, and ones)' },
  { id: '00000000-0000-0000-0000-000000000005', strand: 'Number and place value', objective: 'round any number to the nearest 10, 100 or 1000' },
  { id: '00000000-0000-0000-0000-000000000006', strand: 'Number and place value', objective: 'read Roman numerals to 100 (I to C) and know that over time, the numeral system changed to include the concept of zero and place value' },
  { id: '00000000-0000-0000-0000-000000000007', strand: 'Addition and subtraction', objective: 'add and subtract numbers with up to 4 digits using the formal written methods of columnar addition and subtraction where appropriate' },
]

export default function RefLearningSheet() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 60px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(26px, 7vw, 32px)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 18px' }}>
        Where they are at school
      </h1>
      <LearningSheet
        childId="00000000-0000-0000-0000-0000000000ff"
        childName="Teo"
        yearGroup={4}
        subject="maths"
        term="autumn"
        label="Year 4, Autumn term"
        objectives={OBJECTIVES}
      />
    </div>
  )
}
