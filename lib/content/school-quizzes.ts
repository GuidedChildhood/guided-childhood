// School age quizzes for the child's path, hidden behind a character. Each
// bank matches what the child's age group is actually learning in the
// national curriculum, so a pass feels like school going well, not app
// trivia: KS1 number bonds and counting patterns, the KS2 times tables the
// Year 4 check expects, KS3 fractions decimals percentages and simple
// algebra, GCSE foundation percentages ratio and equations. Five quick
// choices, pass at four of five, and the day picks which quiz rotates in.

export type QuizQuestion = { q: string; options: string[]; answer: number }
export type SchoolQuiz = { key: string; title: string; yearNote: string; questions: QuizQuestion[] }

const BANKS: Record<string, SchoolQuiz[]> = {
  '4-7': [
    {
      key: 'ks1-bonds', title: 'Number bonds', yearNote: 'Key Stage 1 maths',
      questions: [
        { q: 'What makes 10 with 3?', options: ['6', '7', '8'], answer: 1 },
        { q: 'What makes 10 with 6?', options: ['4', '5', '3'], answer: 0 },
        { q: '5 + 5 = ?', options: ['10', '11', '9'], answer: 0 },
        { q: 'What makes 20 with 12?', options: ['6', '8', '9'], answer: 1 },
        { q: '2 + 8 = ?', options: ['9', '11', '10'], answer: 2 },
      ],
    },
    {
      key: 'ks1-counting', title: 'Counting patterns', yearNote: 'Key Stage 1 maths',
      questions: [
        { q: 'Counting in 2s: 2, 4, 6, then?', options: ['7', '8', '9'], answer: 1 },
        { q: 'Counting in 5s: 5, 10, 15, then?', options: ['20', '25', '16'], answer: 0 },
        { q: 'Counting in 10s: 30, 40, then?', options: ['45', '50', '60'], answer: 1 },
        { q: 'Double 4 is?', options: ['6', '8', '10'], answer: 1 },
        { q: 'Half of 10 is?', options: ['5', '4', '6'], answer: 0 },
      ],
    },
  ],
  '8-10': [
    {
      key: 'ks2-tables', title: 'Times tables', yearNote: 'The Year 4 tables check',
      questions: [
        { q: '7 × 8 = ?', options: ['54', '56', '64'], answer: 1 },
        { q: '6 × 9 = ?', options: ['54', '56', '63'], answer: 0 },
        { q: '12 × 12 = ?', options: ['124', '132', '144'], answer: 2 },
        { q: '8 × 4 = ?', options: ['32', '36', '28'], answer: 0 },
        { q: '9 × 9 = ?', options: ['72', '81', '99'], answer: 1 },
      ],
    },
    {
      key: 'ks2-number', title: 'Number workout', yearNote: 'Key Stage 2 maths',
      questions: [
        { q: '45 + 38 = ?', options: ['73', '83', '85'], answer: 1 },
        { q: '72 − 27 = ?', options: ['45', '55', '44'], answer: 0 },
        { q: 'Which equals one half?', options: ['2/4', '1/3', '3/5'], answer: 0 },
        { q: 'One quarter of 20 is?', options: ['4', '5', '6'], answer: 1 },
        { q: 'A square has sides of 6cm. Its perimeter is?', options: ['12cm', '24cm', '36cm'], answer: 1 },
      ],
    },
  ],
  '11-13': [
    {
      key: 'ks3-fdp', title: 'Fractions, decimals, percentages', yearNote: 'Key Stage 3 maths',
      questions: [
        { q: '0.5 as a percentage is?', options: ['5%', '50%', '0.5%'], answer: 1 },
        { q: '3/4 as a percentage is?', options: ['34%', '70%', '75%'], answer: 2 },
        { q: '10% of 250 is?', options: ['25', '2.5', '50'], answer: 0 },
        { q: '0.2 as a fraction is?', options: ['1/2', '1/5', '2/5'], answer: 1 },
        { q: '25% of 80 is?', options: ['15', '20', '25'], answer: 1 },
      ],
    },
    {
      key: 'ks3-algebra', title: 'Negatives and algebra', yearNote: 'Key Stage 3 maths',
      questions: [
        { q: '−3 + 7 = ?', options: ['4', '−4', '10'], answer: 0 },
        { q: '2 − 8 = ?', options: ['6', '−6', '−10'], answer: 1 },
        { q: '3x + 2x = ?', options: ['5x', '6x', '5x²'], answer: 0 },
        { q: 'Angles in a triangle add up to?', options: ['90°', '180°', '360°'], answer: 1 },
        { q: 'If x = 4, what is 3x − 2?', options: ['10', '12', '14'], answer: 0 },
      ],
    },
  ],
  '13-15': [
    {
      key: 'gcse-percent', title: 'Percentages and ratio', yearNote: 'GCSE foundation maths',
      questions: [
        { q: '15% of 60 is?', options: ['6', '9', '12'], answer: 1 },
        { q: 'Share 20 in the ratio 2:3. The smaller share is?', options: ['8', '10', '12'], answer: 0 },
        { q: '20% off £45 leaves?', options: ['£36', '£40', '£35'], answer: 0 },
        { q: 'Increase 50 by 10%:', options: ['55', '60', '51'], answer: 0 },
        { q: '£8 split in the ratio 1:3. The bigger share is?', options: ['£2', '£4', '£6'], answer: 2 },
      ],
    },
    {
      key: 'gcse-equations', title: 'Equations and area', yearNote: 'GCSE foundation maths',
      questions: [
        { q: 'Solve 2x + 3 = 11', options: ['x = 4', 'x = 5', 'x = 7'], answer: 0 },
        { q: 'A triangle has base 8 and height 5. Its area is?', options: ['40', '20', '13'], answer: 1 },
        { q: 'Solve x/2 = 9', options: ['x = 4.5', 'x = 18', 'x = 11'], answer: 1 },
        { q: 'Expand 3(x + 2)', options: ['3x + 2', '3x + 6', 'x + 6'], answer: 1 },
        { q: 'The mean of 4, 6 and 11 is?', options: ['6', '7', '8'], answer: 2 },
      ],
    },
  ],
  '16+': [
    {
      key: 'life-money', title: 'Real world numbers', yearNote: 'Everyday maths',
      questions: [
        { q: '3 for 2 on £4 items. Three items cost?', options: ['£8', '£12', '£10'], answer: 0 },
        { q: '25% of 80 is?', options: ['15', '20', '25'], answer: 1 },
        { q: 'A £600 phone on 12 payments of £59. Extra paid over the year?', options: ['£88', '£108', '£128'], answer: 1 },
        { q: '£9.50 an hour for 6 hours is?', options: ['£57', '£54', '£60'], answer: 0 },
        { q: '30% off £70 leaves?', options: ['£40', '£49', '£52'], answer: 1 },
      ],
    },
  ],
}

// The day picks the quiz, so the character has something fresh behind them
// without any storage.
export function quizForBand(ageBand: string | null, dayIndex: number): SchoolQuiz {
  const bank = BANKS[ageBand ?? '8-10'] ?? BANKS['8-10']
  return bank[dayIndex % bank.length]
}

export function quizByKey(key: string): SchoolQuiz | null {
  for (const bank of Object.values(BANKS)) {
    const hit = bank.find(q => q.key === key)
    if (hit) return hit
  }
  return null
}
