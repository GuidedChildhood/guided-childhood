// The flagship lesson preview: Is That Real? (misinformation and
// deepfakes), the parent sofa rendering of the schools KS3 module. This
// is the proof piece for the lessons engine; Monday's build moves the
// content into the database with a proper slides schema. Copy rules:
// warm, plain, Justin's voice, no dashes anywhere.

export type LessonSlide =
  | { type: 'title'; eyebrow: string; heading: string; body: string }
  | { type: 'gate'; heading: string; body: string; checks: string[] }
  | { type: 'teach'; eyebrow: string; heading: string; body: string; example?: string }
  | { type: 'together'; heading: string; body: string; steps: string[] }
  | { type: 'check'; question: string; options: { label: string; correct: boolean; response: string }[] }
  | { type: 'close'; heading: string; body: string; takeaway: string }

export type Lesson = {
  slug: string
  title: string
  ages: string
  minutes: number
  slides: LessonSlide[]
}

export const FLAGSHIP_LESSON: Lesson = {
  slug: 'is-that-real',
  title: 'Is That Real?',
  ages: 'Ages 11 to 15, brilliant with younger kids watching too',
  minutes: 15,
  slides: [
    {
      type: 'title',
      eyebrow: 'A lesson to do together',
      heading: 'Is That Real?',
      body: 'Fifteen minutes on the sofa. By the end, your child will spot fake images and made up stories better than most adults, and you will both have a shared language for it.',
    },
    {
      type: 'gate',
      heading: 'Before you start',
      body: 'Two quick things make this lesson land properly.',
      checks: [
        'This version is pitched for ages 11 to 15. Younger siblings are welcome to watch.',
        'You lead, the screen supports. Read each card out loud or let your child read it, then talk before tapping on.',
      ],
    },
    {
      type: 'teach',
      eyebrow: 'The big idea',
      heading: 'Anyone can make anything look real now',
      body: 'A photo used to be proof. Not any more. Free tools can create a picture of anything: a celebrity saying something they never said, a disaster that never happened, a person who does not exist.',
      example: 'In 2024, a fake image of an explosion near a famous building moved the American stock market for ten minutes before anyone checked.',
    },
    {
      type: 'teach',
      eyebrow: 'Why it works on us',
      heading: 'Fakes are built to make you feel, not think',
      body: 'A fake spreads because it makes people angry, scared or amazed in the first second. The feeling comes before the checking. That is not a weakness in your child, it is how every human brain works.',
      example: 'Ask each other: what was the last thing online that made you instantly angry or amazed? Did either of you check it?',
    },
    {
      type: 'teach',
      eyebrow: 'The detective moves',
      heading: 'Three questions beat most fakes',
      body: 'Who posted this and why might they want me to believe it? Is anyone else reporting it, anyone I already trust? What happens if I wait ten minutes before sharing? Slow is the superpower. Fakes need speed.',
    },
    {
      type: 'teach',
      eyebrow: 'Deepfakes',
      heading: 'When it is a video of a real person',
      body: 'Deepfakes put real faces on fake words. Look at the edges: hands, teeth, ears and backgrounds still go strange. But the honest truth is that the tech improves every month, so the detective questions matter more than spotting glitches.',
      example: 'The rule that lasts: the more a video wants you to feel something strongly, the more it deserves the three questions.',
    },
    {
      type: 'together',
      heading: 'Play: fool your family',
      body: 'The fastest way to spot manipulation is to try making it.',
      steps: [
        'Each of you invents one fake headline that would fool this family, about something you all care about.',
        'Read them out. Talk about WHY each one would work: what feeling does it poke?',
        'Agree the family rule: feel first, check before sharing, no shame in asking "is this real?" out loud.',
      ],
    },
    {
      type: 'check',
      question: 'Your child sees a shocking video of a footballer they love saying something awful. What is the strongest first move?',
      options: [
        { label: 'Share it to ask friends if it is real', correct: false, response: 'Sharing spreads it even when you are asking. The fake wins the moment it moves.' },
        { label: 'Wait, then ask who posted it and check a trusted source', correct: true, response: 'Exactly. Slow is the superpower. Ten minutes kills most fakes.' },
        { label: 'Decide videos cannot be trusted at all', correct: false, response: 'Total distrust is its own trap. The goal is calibrated checking, not giving up on truth.' },
      ],
    },
    {
      type: 'close',
      heading: 'What you both built today',
      body: 'A shared language: feel first, check before sharing, slow is the superpower. Use those phrases this week when anything dramatic appears on a screen in your house.',
      takeaway: 'This is lesson one of the literacy pathway. Next in this series: how the feed decides what you see.',
    },
  ],
}
