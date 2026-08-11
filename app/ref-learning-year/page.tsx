import LearningYear from '@/app/(dashboard)/dashboard/learning/LearningYear'
import { groupObjectives, yearBlurb, type YearView } from '@/lib/learning/year-view'
import { SCHOOL_EVENTS } from '@/lib/learning/calendar'

// Fixture reference page: the REAL "what they are learning" screen with a small
// slice of the real statutory rows, so every state can be looked at without a
// database and without waiting for the calendar to agree.
//
// Not linked from anywhere, same as the other ref pages.
//
//   ?view=term        Year 4 mid term, the ordinary case
//   ?view=nodob       no birthday, which is the most common real state
//   ?view=secondary   Year 6 heading to Year 7, transition live
//   ?view=early       below Year 1, where no objectives exist
//
// The objectives below are copied verbatim from curriculum_objectives, short
// ones and one of the long semicolon lists, so the layout is exercised by the
// shape the Department actually writes in rather than by tidy fixtures.

export const dynamic = 'force-dynamic'

const ROWS = [
  { id: 'r1', subject: 'reading', strand: 'Reading word reading', sort_order: 10, verbatim: true,
    objective: 'read further exception words, noting the unusual correspondences between spelling and sound, and where these occur in the word' },
  { id: 'r2', subject: 'reading', strand: 'Reading comprehension', sort_order: 40, verbatim: true,
    objective: "understand what they read, in books they can read independently, by: checking that the text makes sense to them, discussing their understanding, and explaining the meaning of words in context; asking questions to improve their understanding of a text; drawing inferences such as inferring characters' feelings, thoughts and motives from their actions, and justifying inferences with evidence; predicting what might happen from details stated and implied; identifying main ideas drawn from more than 1 paragraph and summarising these; identifying how language, structure, and presentation contribute to meaning" },
  { id: 'r3', subject: 'reading', strand: 'Reading comprehension', sort_order: 50, verbatim: true,
    objective: 'retrieve and record information from non-fiction' },
  { id: 'e1', subject: 'english', strand: 'Writing vocabulary grammar and punctuation', sort_order: 270, verbatim: true,
    objective: 'indicate grammatical and other features by: using commas after fronted adverbials; indicating possession by using the possessive apostrophe with plural nouns; using and punctuating direct speech' },
  { id: 'e2', subject: 'english', strand: 'Writing transcription (spelling)', sort_order: 140, verbatim: true,
    objective: 'spell further homophones' },
  { id: 'e3', subject: 'english', strand: 'Spoken language', sort_order: 10, verbatim: true,
    objective: 'listen and respond appropriately to adults and their peers' },
  { id: 'm1', subject: 'maths', strand: 'Multiplication and division', sort_order: 5, verbatim: true,
    objective: 'recall multiplication and division facts for multiplication tables up to 12 × 12' },
  { id: 'm2', subject: 'maths', strand: 'Measurement', sort_order: 10, verbatim: true,
    objective: 'convert between different units of measure [for example, kilometre to metre; hour to minute]' },
  { id: 'm3', subject: 'maths', strand: 'Measurement', sort_order: 20, verbatim: true,
    objective: 'measure and calculate the perimeter of a rectilinear figure (including squares) in centimetres and metres' },
]

const tablesCheck = SCHOOL_EVENTS.find(e => e.key === 'tables_check')!
const secondaryApp = SCHOOL_EVENTS.find(e => e.key === 'secondary_application')!

function base(name: string): YearView {
  return {
    childId: 'fixture', childName: name,
    yearGroup: null, target: null, label: null, subjects: [],
    event: null, eventWhen: null, transition: null, blocked: null,
  }
}

export default async function RefLearningYear({ searchParams }: { searchParams: Promise<{ view?: string; tab?: string }> }) {
  const { view, tab } = await searchParams

  let v: YearView
  if (view === 'nodob') {
    v = { ...base('Ada'), blocked: 'no_birthday' }
  } else if (view === 'early') {
    v = { ...base('Bea'), yearGroup: 0, blocked: 'too_young' }
  } else if (view === 'secondary') {
    v = {
      ...base('Hugo'), yearGroup: 6, blocked: null,
      target: { yearGroup: 6, term: 'summer', lookingBack: false },
      label: 'Year 6, Summer term',
      subjects: groupObjectives(ROWS),
      event: { event: secondaryApp, on: new Date(Date.UTC(2026, 9, 31)), daysAway: 40, phase: 'ahead' },
      eventWhen: '31 October',
      transition: {
        phase: 'imminent', yearGroup: 6,
        headline: 'Secondary starts in a few weeks',
        line: 'This is the summer the phone question usually lands. Getting the deal agreed before term starts is worth more than any setting.',
      },
    }
  } else {
    v = {
      ...base('Gus'), yearGroup: 4, blocked: null,
      target: { yearGroup: 4, term: 'summer', lookingBack: false },
      label: 'Year 4, Summer term',
      subjects: groupObjectives(ROWS),
      event: { event: tablesCheck, on: new Date(Date.UTC(2026, 5, 8)), daysAway: 17, phase: 'ahead' },
      eventWhen: 'in about 2 weeks',
    }
  }

  // THE SUMMARY, which this fixture has never rendered.
  //
  // LearningYear takes an optional briefs prop and the fixture has never passed
  // one, so "This week at school", the card a parent actually arrives for, has
  // been invisible here since it shipped. That mattered on 11 August 2026, when
  // the page gained tabs underneath the summary: a fixture with no summary
  // cannot show whether the summary stayed above them.
  //
  // Blocked views deliberately get nothing, matching the page, which never
  // shows a week to a family whose year group we cannot work out.
  const brief = v.blocked === null ? {
    yearGroup: v.yearGroup ?? 4,
    term: 'summer' as const,
    preview: false,
    weekOfTerm: 3,
    subjectLabel: 'Maths',
    strand: 'Multiplication and division',
    lead: 'recall multiplication and division facts for multiplication tables up to 12 × 12',
    parts: [],
    second: { subjectLabel: 'English', strand: 'Writing transcription (spelling)', lead: 'spell further homophones' },
    questTitle: 'Practise times tables',
  } : null

  return <LearningYear views={[v]} blurbs={[yearBlurb(v)]} briefs={[brief]} initialTab={tab ?? null} />
}
