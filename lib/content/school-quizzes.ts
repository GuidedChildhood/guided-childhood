// School age quizzes for the child's path, hidden behind a character. Each
// bank matches what the child's age group is actually learning in the
// national curriculum: KS1 number bonds, counting patterns and doubles, the
// KS2 times tables and number work the Year 4 check expects, KS3 fractions
// decimals percentages and simple algebra, GCSE foundation percentages ratio
// and equations, practical money maths at 16 plus.
//
// Built the way the best education apps build it (Duolingo, Khan, Bitesize):
// every run SAMPLES five questions from a bigger pool so replays differ, the
// client SHUFFLES answer positions so there is never a positional pattern to
// game, and every question carries a why line so a wrong answer teaches
// rather than just scores.

export type QuizQuestion = { q: string; options: string[]; answer: number; why: string }
export type SchoolQuiz = { key: string; title: string; yearNote: string; pool: QuizQuestion[] }

// Every run is this long, sampled from the pool.
export const QUIZ_LENGTH = 5

const BANKS: Record<string, SchoolQuiz> = {
  '4-7': {
    key: 'ks1-mixed', title: 'Number workout', yearNote: 'Key Stage 1 maths',
    pool: [
      { q: 'What makes 10 with 3?', options: ['6', '7', '8'], answer: 1, why: '3 and 7 are number bond friends. Together they make 10.' },
      { q: 'What makes 10 with 6?', options: ['4', '5', '3'], answer: 0, why: '6 and 4 make 10. Number bonds always find their friend.' },
      { q: '5 + 5 = ?', options: ['10', '11', '9'], answer: 0, why: 'Double 5 is 10, like your two hands of fingers.' },
      { q: 'What makes 20 with 12?', options: ['6', '8', '9'], answer: 1, why: '12 and 8 make 20. Count on from 12 to check.' },
      { q: '2 + 8 = ?', options: ['9', '11', '10'], answer: 2, why: '2 and 8 are another pair that make 10.' },
      { q: 'Counting in 2s: 2, 4, 6, then?', options: ['7', '8', '9'], answer: 1, why: 'Counting in 2s jumps two each time: 6 then 8.' },
      { q: 'Counting in 5s: 5, 10, 15, then?', options: ['20', '25', '16'], answer: 0, why: 'Counting in 5s jumps five each time: 15 then 20.' },
      { q: 'Counting in 10s: 30, 40, then?', options: ['45', '50', '60'], answer: 1, why: 'Ten more than 40 is 50.' },
      { q: 'Double 4 is?', options: ['6', '8', '10'], answer: 1, why: '4 and 4 make 8.' },
      { q: 'Half of 10 is?', options: ['5', '4', '6'], answer: 0, why: 'Half means share into two equal parts: 5 and 5.' },
      { q: 'Double 6 is?', options: ['10', '12', '14'], answer: 1, why: '6 and 6 make 12.' },
      { q: 'Half of 8 is?', options: ['3', '4', '5'], answer: 1, why: '8 shared into two equal parts is 4 and 4.' },
      { q: '10 take away 4 is?', options: ['6', '5', '7'], answer: 0, why: 'If 6 and 4 make 10, then 10 take away 4 leaves 6.' },
      { q: 'How many sides does a triangle have?', options: ['3', '4', '5'], answer: 0, why: 'Tri means three, three sides and three corners.' },
    ],
  },
  '8-10': {
    key: 'ks2-mixed', title: 'Times tables and number', yearNote: 'The Year 4 tables check and Key Stage 2 maths',
    pool: [
      { q: '7 × 8 = ?', options: ['54', '56', '64'], answer: 1, why: '7 × 8 is 56. The famous one: 5, 6, 7, 8 reads 56 = 7 × 8.' },
      { q: '6 × 9 = ?', options: ['54', '56', '63'], answer: 0, why: '6 × 9 is 54, ten sixes are 60 then take one 6 away.' },
      { q: '12 × 12 = ?', options: ['124', '132', '144'], answer: 2, why: '12 × 12 is 144, the biggest fact in the tables check.' },
      { q: '8 × 4 = ?', options: ['32', '36', '28'], answer: 0, why: 'Double 8 is 16, double again is 32.' },
      { q: '9 × 9 = ?', options: ['72', '81', '99'], answer: 1, why: '9 × 9 is 81, ten nines are 90 then take one 9 away.' },
      { q: '7 × 6 = ?', options: ['42', '48', '36'], answer: 0, why: '7 × 6 is 42, six sevens: 35 and one more 7.' },
      { q: '11 × 12 = ?', options: ['121', '132', '112'], answer: 1, why: 'Eleven twelves: ten twelves are 120, one more is 132.' },
      { q: '45 + 38 = ?', options: ['73', '83', '85'], answer: 1, why: '45 + 38: add the tens (70), add the ones (13), makes 83.' },
      { q: '72 − 27 = ?', options: ['45', '55', '44'], answer: 0, why: 'Count up from 27: 3 to 30, 42 to 72, so 45.' },
      { q: 'Which equals one half?', options: ['2/4', '1/3', '3/5'], answer: 0, why: '2 out of 4 is the same share as 1 out of 2.' },
      { q: 'One quarter of 20 is?', options: ['4', '5', '6'], answer: 1, why: 'A quarter means share by 4: 20 ÷ 4 = 5.' },
      { q: 'A square has sides of 6cm. Its perimeter is?', options: ['12cm', '24cm', '36cm'], answer: 1, why: 'Perimeter is all the way round: 6 + 6 + 6 + 6 = 24.' },
      { q: '3/4 of 12 is?', options: ['8', '9', '10'], answer: 1, why: 'A quarter of 12 is 3, so three quarters is 9.' },
      { q: '100 − 64 = ?', options: ['36', '46', '34'], answer: 0, why: '64 and 36 make 100, a pair worth knowing.' },
    ],
  },
  '11-13': {
    key: 'ks3-mixed', title: 'Fractions, decimals, algebra', yearNote: 'Key Stage 3 maths',
    pool: [
      { q: '0.5 as a percentage is?', options: ['5%', '50%', '0.5%'], answer: 1, why: 'Per cent means out of 100, and 0.5 is 50 out of 100.' },
      { q: '3/4 as a percentage is?', options: ['34%', '70%', '75%'], answer: 2, why: 'A quarter is 25%, so three quarters is 75%.' },
      { q: '10% of 250 is?', options: ['25', '2.5', '50'], answer: 0, why: '10% means divide by 10: 250 ÷ 10 = 25.' },
      { q: '0.2 as a fraction is?', options: ['1/2', '1/5', '2/5'], answer: 1, why: '0.2 is 2 tenths, which simplifies to 1/5.' },
      { q: '25% of 80 is?', options: ['15', '20', '25'], answer: 1, why: '25% is a quarter: 80 ÷ 4 = 20.' },
      { q: '−3 + 7 = ?', options: ['4', '−4', '10'], answer: 0, why: 'Start at −3 and climb 7: you land on 4.' },
      { q: '2 − 8 = ?', options: ['6', '−6', '−10'], answer: 1, why: 'Going 8 below 2 lands at −6.' },
      { q: '3x + 2x = ?', options: ['5x', '6x', '5x²'], answer: 0, why: 'Three lots of x plus two lots of x is five lots of x.' },
      { q: 'Angles in a triangle add up to?', options: ['90°', '180°', '360°'], answer: 1, why: 'Every triangle: the three angles always total 180°.' },
      { q: 'If x = 4, what is 3x − 2?', options: ['10', '12', '14'], answer: 0, why: '3 × 4 is 12, minus 2 is 10.' },
      { q: '−4 × 3 = ?', options: ['−12', '12', '−7'], answer: 0, why: 'A negative times a positive stays negative: −12.' },
      { q: '15% of 200 is?', options: ['30', '25', '35'], answer: 0, why: '10% is 20 and 5% is 10, together 30.' },
      { q: 'Simplify 10y − 4y', options: ['6y', '6', '14y'], answer: 0, why: 'Ten lots take away four lots leaves six lots of y.' },
      { q: '0.75 as a fraction is?', options: ['3/4', '7/5', '1/4'], answer: 0, why: '0.75 is 75 hundredths, which is three quarters.' },
    ],
  },
  '13-15': {
    key: 'gcse-mixed', title: 'Percentages, ratio, equations', yearNote: 'GCSE foundation maths',
    pool: [
      { q: '15% of 60 is?', options: ['6', '9', '12'], answer: 1, why: '10% is 6 and 5% is 3, together 9.' },
      { q: 'Share 20 in the ratio 2:3. The smaller share is?', options: ['8', '10', '12'], answer: 0, why: '5 parts in total, each part is 4, so 2 parts is 8.' },
      { q: '20% off £45 leaves?', options: ['£36', '£40', '£35'], answer: 0, why: '20% of 45 is 9, and 45 − 9 = 36.' },
      { q: 'Increase 50 by 10%:', options: ['55', '60', '51'], answer: 0, why: '10% of 50 is 5, so 50 becomes 55.' },
      { q: '£8 split in the ratio 1:3. The bigger share is?', options: ['£2', '£4', '£6'], answer: 2, why: '4 parts of £2 each, the bigger side takes 3 parts: £6.' },
      { q: 'Solve 2x + 3 = 11', options: ['x = 4', 'x = 5', 'x = 7'], answer: 0, why: 'Take 3 from both sides (2x = 8), halve it: x = 4.' },
      { q: 'A triangle has base 8 and height 5. Its area is?', options: ['40', '20', '13'], answer: 1, why: 'Triangle area is half of base times height: half of 40.' },
      { q: 'Solve x/2 = 9', options: ['x = 4.5', 'x = 18', 'x = 11'], answer: 1, why: 'Multiply both sides by 2: x = 18.' },
      { q: 'Expand 3(x + 2)', options: ['3x + 2', '3x + 6', 'x + 6'], answer: 1, why: 'The 3 multiplies both terms inside: 3x and 6.' },
      { q: 'The mean of 4, 6 and 11 is?', options: ['6', '7', '8'], answer: 1, why: 'They total 21, and 21 shared across 3 values is 7.' },
      { q: 'Solve 5x − 4 = 21', options: ['x = 5', 'x = 4', 'x = 6'], answer: 0, why: 'Add 4 to both sides (5x = 25), divide by 5: x = 5.' },
      { q: '35% as a decimal is?', options: ['0.35', '3.5', '0.035'], answer: 0, why: 'Per cent is out of 100: 35 ÷ 100 = 0.35.' },
      { q: 'A £60 jacket rises by 25%. New price?', options: ['£75', '£72', '£85'], answer: 0, why: '25% of 60 is 15, so £60 becomes £75.' },
    ],
  },
  '16+': {
    key: 'life-money', title: 'Real world numbers', yearNote: 'Everyday maths',
    pool: [
      { q: '3 for 2 on £4 items. Three items cost?', options: ['£8', '£12', '£10'], answer: 0, why: 'You pay for two of the three: 2 × £4 = £8.' },
      { q: '25% of 80 is?', options: ['15', '20', '25'], answer: 1, why: '25% is a quarter: 80 ÷ 4 = 20.' },
      { q: 'A £600 phone on 12 payments of £59. Extra paid over the year?', options: ['£88', '£108', '£128'], answer: 1, why: '12 × £59 is £708, which is £108 more than £600.' },
      { q: '£9.50 an hour for 6 hours is?', options: ['£57', '£54', '£60'], answer: 0, why: '9 × 6 is 54 plus 50p × 6 is £3, total £57.' },
      { q: '30% off £70 leaves?', options: ['£40', '£49', '£52'], answer: 1, why: '30% of 70 is 21, and 70 − 21 = 49.' },
      { q: 'Rent £650, income £1,600. Rent as a share of income?', options: ['About 40%', 'About 25%', 'About 55%'], answer: 0, why: '650 out of 1,600 is just over 40 in every 100.' },
      { q: '£2,000 savings at 5% for a year earns?', options: ['£50', '£100', '£200'], answer: 1, why: '5% of 2,000 is 2,000 ÷ 20 = 100.' },
      { q: 'A 20% tip on a £35 meal is?', options: ['£5', '£7', '£9'], answer: 1, why: '10% is £3.50, doubled is £7.' },
    ],
  },
}

export function quizForBand(ageBand: string | null): SchoolQuiz {
  return BANKS[ageBand ?? '8-10'] ?? BANKS['8-10']
}

export function quizByKey(key: string): SchoolQuiz | null {
  return Object.values(BANKS).find(q => q.key === key) ?? null
}
