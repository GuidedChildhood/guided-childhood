// The passport stage quiz. The last green before a stage is stamped is a short
// check on what the stage actually taught the family, drawn from the scripts,
// the device rules and the literacy strands for that age. It is not a test to
// pass or fail a child, it is DiGi confirming the grown up holds the few things
// this stage was built to leave them with, so the stamp means something.
//
// Built the same honest way as the school quizzes: every run SAMPLES five from
// a bigger pool so a replay differs, the client SHUFFLES answer positions so
// there is never a pattern to game, and every question carries a why line so a
// wrong answer teaches rather than just scores. Parent facing throughout, warm
// and plain, never clinical, and never a single dash in the copy.

export type StageQuizQuestion = { q: string; options: string[]; answer: number; why: string }
export type StageQuiz = { stageId: number; title: string; pool: StageQuizQuestion[] }

// Every run is this long, sampled from the pool, and this is the pass mark.
export const STAGE_QUIZ_LENGTH = 5
export const STAGE_QUIZ_PASS = 4

const BANKS: Record<number, StageQuiz> = {
  1: {
    stageId: 1, title: 'Foundation check',
    pool: [
      { q: 'Where do devices sleep in a Foundation home?', options: ['In the child’s bedroom', 'Anywhere charged', 'On a charging station out of bedrooms'], answer: 2, why: 'Devices charge in the kitchen or hallway, never the bedroom. The rule starts on day one and holds all the way up.' },
      { q: 'The timer goes off and there is a tantrum. The Foundation move is to', options: ['Give five more minutes to settle it', 'Hold the rule and move to something together', 'Take the device away for a week'], answer: 1, why: 'Once you move the line it moves every time. The timer is the rule, not you, and you follow it with a next thing together.' },
      { q: 'At ages 4 to 7, safe online mostly means', options: ['Good parental controls', 'Same room, same screen', 'A locked down tablet'], answer: 1, why: 'At this age online safety is one thing above all: same room, same screen. No unsupervised time yet.' },
      { q: 'A child this age can regulate their own screen time', options: ['Yes, with practice', 'No, the structure has to come from you', 'Only on school days'], answer: 1, why: 'Children this young cannot self regulate devices. The boundary is not a punishment, it is the structure that keeps screens safe.' },
      { q: 'Your child keeps choosing screens over play they used to love. This is', options: ['Just a phase to ignore', 'A sign worth noticing', 'A reason to remove all screens'], answer: 1, why: 'Losing interest in things they loved before devices is one of the early signs worth a gentle look, not an alarm.' },
      { q: 'The healthiest way to understand a game your child loves is to', options: ['Read reviews of it', 'Play it with them for ten minutes', 'Set a time limit first'], answer: 1, why: 'Play it with them before you judge it. You understand the game, and they feel you are on their side.' },
      { q: 'Best first question to open a conversation about a show they like', options: ['Why do you watch so much of it', 'What do you like best about it', 'How long were you on that'], answer: 1, why: 'Open and warm beats loaded. Ask what they like, then listen for two full minutes before you say anything.' },
      { q: 'When they ask for their own phone at this age, the honest answer is', options: ['A firm no', 'Not yet, and here is what we build first', 'When you are ten'], answer: 1, why: 'Not a flat no and not a date. Talk about what a device earns and what you build first, so it never lands as an arbitrary cliff.' },
    ],
  },
  2: {
    stageId: 2, title: 'Builder check',
    pool: [
      { q: 'The Builder years are about', options: ['Handing over full control', 'Building the habits and judgement before the pressure', 'Waiting for secondary school'], answer: 1, why: 'Ages 8 to 10 are the building years: the routines, the balance and the first judgement, laid down before the real pressure of 11 plus.' },
      { q: 'Screen time in a healthy balance is best thought of as', options: ['A fixed daily cap', 'Time earned against real world jobs and play', 'A reward for good behaviour'], answer: 1, why: 'The balance is screen time set against real world jobs and getting outside, an average to aim at across the week, not a hard cap.' },
      { q: 'A day well over the screen guide means', options: ['The week is ruined', 'It is fine if the week balances out', 'Screens off tomorrow'], answer: 1, why: 'The guide is an average, not a limit. One day over is fine when the rest of the week brings it back.' },
      { q: 'The best time to build the skills for social media is', options: ['The week they get an account', 'Well before any account exists', 'When they turn 13'], answer: 1, why: 'The judgement is built in good time, before any account exists, so the skills are already there when the platforms arrive.' },
      { q: 'Your child does a job and earns stars. Those stars are for', options: ['Pocket money', 'Turning into screen time through the timer', 'A weekly treat'], answer: 1, why: 'Stars from real world jobs turn into screen time through the timer, so the screen is earned and the balance keeps itself.' },
      { q: 'A good screen rule at this age is still', options: ['A phone in the bedroom is fine now', 'Screens stay out of bedrooms overnight', 'They set their own limits'], answer: 1, why: 'The bedroom rule from Foundation still holds. Overnight charging stays out of bedrooms right through the Builder years.' },
      { q: 'The point of doing lessons together at this stage is', options: ['To test the child', 'To build shared language before they need it', 'To fill screen time'], answer: 1, why: 'Lessons done together build the shared language and judgement, so when something hard comes up the words are already there.' },
    ],
  },
  3: {
    stageId: 3, title: 'Explorer check',
    pool: [
      { q: 'The Explorer stage is when the app starts on', options: ['Full social media accounts', 'AI, chatbots and telling what is real', 'Unsupervised gaming'], answer: 1, why: 'From around 11, abstract thinking can finally hold the algorithm and AI conversation, so that is when those strands begin.' },
      { q: 'Why does AI literacy start now and not at 7', options: ['The apps require it', 'Abstract thinking can hold it around 11 to 13', 'Schools ask for it'], answer: 1, why: 'The research, Orben and Odgers, places the algorithm conversation in the 11 to 13 window, when a child can think abstractly enough to hold it.' },
      { q: 'A chatbot sounds completely sure of an answer. Your child should', options: ['Trust it, it sounds confident', 'Check it, confident does not mean correct', 'Ask it again'], answer: 1, why: 'AI literacy is learning that a confident answer is not a correct one. Checking against something real is the skill this stage builds.' },
      { q: 'Building social media readiness before an account exists means', options: ['Setting up profiles early', 'Growing the judgement first, then the account later', 'Following their friends'], answer: 1, why: 'The skills come first and the account later. The readiness is built before 16 so nothing is being learned live under pressure.' },
      { q: 'The healthy balance still matters at this stage because', options: ['It stops all screen use', 'What screens crowd out, sleep, movement and play, matters most', 'It saves money'], answer: 1, why: 'Right through, what screens crowd out matters more than the clock: sleep, movement and real play come first.' },
      { q: 'Your 11 year old asks a hard question about something they saw online', options: ['Shut the conversation down', 'Stay open so the telling channel stays open', 'Ban the app it came from'], answer: 1, why: 'Staying open, even when it is hard, is what keeps them telling you things. A shut door now is a closed channel later.' },
      { q: 'DiGi never gives a child a straight allow or deny because', options: ['It is not sure', 'A calibrated pathway builds judgement, a yes or no does not', 'The law says so'], answer: 1, why: 'DiGi always returns a calibrated next step, never a flat allow or deny, because judgement is built by working through, not by being told.' },
    ],
  },
  4: {
    stageId: 4, title: 'Shaper check',
    pool: [
      { q: 'The Shaper stage, from around 13, is where', options: ['You step back completely', 'DiGi starts asking what they are actually seeing', 'All limits are lifted'], answer: 1, why: 'From 13, DiGi asks the child what they are actually meeting online, because what they are seeing beats any lesson watched.' },
      { q: 'Your teenager gets a first account. The groundwork that matters is', options: ['The judgement built in the years before', 'The privacy settings alone', 'How many friends they add'], answer: 0, why: 'The account arrives onto years of built judgement. The settings help, but the thinking is what carries them.' },
      { q: 'What a teen is actually seeing online beats a lesson watched because', options: ['Lessons are boring', 'Real experience is where the judgement gets used', 'Lessons are optional'], answer: 1, why: 'A red flag in what they are meeting matters more than any completed lesson, so DiGi weighs the real week over the watched one.' },
      { q: 'The balance report warms to amber when', options: ['Any screen is used', 'Screen runs well over the healthy guide for the age', 'A lesson is missed'], answer: 1, why: 'The report reads under and on track as green, and only warms when screen runs over the age guide, never as an alarm.' },
      { q: 'A teenager pushing back on a limit is best met with', options: ['A harder limit', 'A conversation that keeps the channel open', 'Removing the device'], answer: 1, why: 'At this stage the relationship is the tool. Keeping the conversation open does more than any tightened rule.' },
      { q: 'The point of the whole pathway by the Shaper stage is', options: ['To control them longer', 'To turn 16 from a cliff edge into a gentle ramp', 'To delay phones'], answer: 1, why: 'Everything is built so 16 arrives as a gentle ramp into independence, not a cliff edge they meet with no practice.' },
    ],
  },
  5: {
    stageId: 5, title: 'Independent check',
    pool: [
      { q: 'The Independent stage is about', options: ['Watching them more closely', 'Handing over judgement they have actually built', 'Removing DiGi'], answer: 1, why: 'By 16 the work is handing over judgement that is genuinely theirs, built stage by stage, not control that suddenly drops away.' },
      { q: 'A young person ready for independence online has', options: ['The most locked down phone', 'The judgement to handle what they meet', 'The strictest parents'], answer: 1, why: 'Readiness is judgement, not restriction. The pathway builds the thinking so the freedom is safe when it comes.' },
      { q: 'The relationship you kept open through the teens now means', options: ['Nothing, they are independent', 'They still come to you with the hard things', 'Less to do'], answer: 1, why: 'The open channel you protected is the thing that lasts: an independent 16 year old who still tells you the hard stuff.' },
      { q: 'The healthy balance at 16 plus is', options: ['A number you enforce', 'A habit they carry themselves', 'No longer relevant'], answer: 1, why: 'By now the balance is theirs to keep. The years of it being modelled become a habit they hold on their own.' },
      { q: 'The whole point of the passport, finished, is', options: ['A record of screen time', 'A young adult ready for the online world, not shielded from it', 'A certificate'], answer: 1, why: 'The passport was never about shielding. It is a young adult who can handle the online world because they were walked into it, not dropped.' },
    ],
  },
}

export function stageQuizFor(stageId: number): StageQuiz | null {
  return BANKS[stageId] ?? null
}

// A stable sample of STAGE_QUIZ_LENGTH from the pool. Deterministic on a seed so
// a server and client agree on the same run, and a fresh open gives a fresh set.
export function sampleStageQuiz(stageId: number, seed: number): StageQuizQuestion[] {
  const quiz = BANKS[stageId]
  if (!quiz) return []
  const pool = [...quiz.pool]
  // A small seeded shuffle, Fisher Yates with a linear congruential step, so no
  // Math.random is needed and the same seed reproduces the same five.
  let s = (seed % 2147483647) || 1
  const rnd = () => (s = (s * 48271) % 2147483647) / 2147483647
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, Math.min(STAGE_QUIZ_LENGTH, pool.length))
}
