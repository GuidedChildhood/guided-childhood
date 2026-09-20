// THE NATIONAL CURRICULUM FOR COMPUTING, AND WHAT THIS SCHEME TEACHES OF IT.
//
// The programme of study for computing in England (Department for
// Education, published 2013, statutory from September 2014 and still the
// programme of study in force). The text below is the subject content as
// Justin supplied it on 20 September 2026, verbatim, in the document's own
// order, hyphens and bracketed examples included, because editing a
// quotation to satisfy a house style breaks the audit trail. The document
// says schools are not required by law to teach the example content in
// square brackets.
//
// WHAT THIS FILE IS FOR. Guided Childhood Schools is a digital literacy and
// online safety scheme. It is not a computing scheme, and the map says so
// on every row that belongs to programming, networks, data, hardware or
// creative projects. What it does teach, it teaches substantively, and every
// TAUGHT or IN PROGRESS row is held to phrases that must appear in the named
// module's slides: scripts/check-computing-coverage.mjs checks the module
// files it has, and prints the SQL that checks production, and the phrases
// were all found on production the evening this file was written.
//
// Four answers, one of which is no:
//   FULL         a named module teaches it, held to the phrases
//   PARTIAL      part of it is taught and the missing clause is named
//   YOUR_SCHEME  it belongs to the school's computing scheme; where one of
//                our lessons touches it, the note says so and claims no more

export type ComputingKeyStage = 'KS1' | 'KS2' | 'KS3' | 'KS4'
export type ComputingVerdict = 'FULL' | 'PARTIAL' | 'YOUR_SCHEME'

export type ComputingProbe = {
  /** A phrase that must appear, case insensitively, in every listed module's slides. */
  phrase: string
  modules: string[]
}

export type ComputingStatement = {
  id: string
  keyStage: ComputingKeyStage
  /** The statement, verbatim from the programme of study. */
  text: string
  verdict: ComputingVerdict
  /** The modules that teach it. Empty for YOUR_SCHEME. */
  modules: string[]
  /** What is missing (PARTIAL) or where a lesson touches it (YOUR_SCHEME). */
  note?: string
  probes: ComputingProbe[]
}

export const COMPUTING_POS_SOURCE = {
  title: 'National curriculum in England: computing programmes of study',
  publisher: 'Department for Education',
  published: '2013, statutory from September 2014',
  supplied: 'text supplied by Justin Phillips, 20 September 2026',
  reviewed: '20 September 2026',
  purpose: 'A high-quality computing education equips pupils to use computational thinking and creativity to understand and change the world. Computing has deep links with mathematics, science and design and technology, and provides insights into both natural and artificial systems. The core of computing is computer science, in which pupils are taught the principles of information and computation, how digital systems work and how to put this knowledge to use through programming. Building on this knowledge and understanding, pupils are equipped to use information technology to create programs, systems and a range of content. Computing also ensures that pupils become digitally literate – able to use, and express themselves and develop their ideas through, information and communication technology – at a level suitable for the future workplace and as active participants in a digital world.',
  aims: [
    'can understand and apply the fundamental principles and concepts of computer science, including abstraction, logic, algorithms and data representation',
    'can analyse problems in computational terms, and have repeated practical experience of writing computer programs in order to solve such problems',
    'can evaluate and apply information technology, including new or unfamiliar technologies, analytically to solve problems',
    'are responsible, competent, confident and creative users of information and communication technology',
  ],
  ks4Preamble: 'All pupils must have the opportunity to study aspects of information technology and computer science at sufficient depth to allow them to progress to higher levels of study or to a professional career.',
} as const

const YOURS = (id: string, keyStage: ComputingKeyStage, text: string, note?: string): ComputingStatement =>
  ({ id, keyStage, text, verdict: 'YOUR_SCHEME', modules: [], note, probes: [] })

export const COMPUTING_POS: ComputingStatement[] = [
  // ── Key stage 1 ──────────────────────────────────────────────────────────
  YOURS('CPOS-KS1-1', 'KS1', 'understand what algorithms are, how they are implemented as programs on digital devices, and that programs execute by following precise and unambiguous instructions',
    'Lesson ks2-06 teaches what an algorithm is and that a computer follows its steps exactly, at KS2, as the way into how a feed chooses. It does not teach programs on devices.'),
  YOURS('CPOS-KS1-2', 'KS1', 'create and debug simple programs'),
  YOURS('CPOS-KS1-3', 'KS1', 'use logical reasoning to predict the behaviour of simple programs'),
  YOURS('CPOS-KS1-4', 'KS1', 'use technology purposefully to create, organise, store, manipulate and retrieve digital content'),
  YOURS('CPOS-KS1-5', 'KS1', 'recognise common uses of information technology beyond school'),
  {
    id: 'CPOS-KS1-6', keyStage: 'KS1', verdict: 'PARTIAL',
    text: 'use technology safely and respectfully, keeping personal information private; identify where to go for help and support when they have concerns about content or contact on the internet or other online technologies',
    modules: ['eyfs-01-screens-kindness', 'ks1-02-kind-screens-calm-bodies', 'ks1-03-real-pretend-computer'],
    note: 'Safe and respectful use, and where to go for help, are taught from Reception: is this real, tell a grown up, and never in trouble for telling. Keeping personal information private is taught at KS2 (ks2-07) and not yet at KS1. That is the missing clause.',
    probes: [
      { phrase: 'is this real', modules: ['eyfs-01-screens-kindness'] },
      { phrase: 'tell a grown up', modules: ['ks1-02-kind-screens-calm-bodies', 'ks1-03-real-pretend-computer'] },
      { phrase: 'never in trouble for telling', modules: ['ks1-02-kind-screens-calm-bodies'] },
    ],
  },

  // ── Key stage 2 ──────────────────────────────────────────────────────────
  YOURS('CPOS-KS2-1', 'KS2', 'design, write and debug programs that accomplish specific goals, including controlling or simulating physical systems; solve problems by decomposing them into smaller parts'),
  YOURS('CPOS-KS2-2', 'KS2', 'use sequence, selection, and repetition in programs; work with variables and various forms of input and output'),
  YOURS('CPOS-KS2-3', 'KS2', 'use logical reasoning to explain how some simple algorithms work and to detect and correct errors in algorithms and programs',
    'Lesson ks2-06 explains one algorithm in words, the feed loop, and stops there. Errors in programs are the computing scheme’s.'),
  YOURS('CPOS-KS2-4', 'KS2', 'understand computer networks, including the internet; how they can provide multiple services, such as the World Wide Web, and the opportunities they offer for communication and collaboration'),
  {
    id: 'CPOS-KS2-5', keyStage: 'KS2', verdict: 'PARTIAL',
    text: 'use search technologies effectively, appreciate how results are selected and ranked, and be discerning in evaluating digital content',
    modules: ['ks2-06-how-algorithms-work', 'ks1-03-real-pretend-computer'],
    note: 'How results are selected and ranked is taught in ks2-06 (search boxes follow a recipe; first does not mean truest), and being discerning runs from ks1-03 to ks3-12. Using search technologies effectively, the searching skill itself, is not taught. That is the missing clause.',
    probes: [
      { phrase: 'search boxes follow a recipe', modules: ['ks2-06-how-algorithms-work'] },
      { phrase: 'first does not mean truest', modules: ['ks2-06-how-algorithms-work'] },
      { phrase: 'detective', modules: ['ks1-03-real-pretend-computer', 'ks2-06-how-algorithms-work'] },
    ],
  },
  YOURS('CPOS-KS2-6', 'KS2', 'select, use and combine a variety of software (including internet services) on a range of digital devices to design and create a range of programs, systems and content that accomplish given goals, including collecting, analysing, evaluating and presenting data and information'),
  {
    id: 'CPOS-KS2-7', keyStage: 'KS2', verdict: 'FULL',
    text: 'use technology safely, respectfully and responsibly; recognise acceptable/unacceptable behaviour; identify a range of ways to report concerns about content and contact',
    modules: ['ks2-04-screen-routines', 'ks2-07-privacy-reputation', 'ks2-08-kind-safe-online'],
    note: 'Safe use in ks2-04, privacy and the stranger rule in ks2-07, kindness, bullying and the two routes to report (the button in the app and the grown up) in ks2-08.',
    probes: [
      { phrase: 'report button and a block button', modules: ['ks2-08-kind-safe-online'] },
      { phrase: 'bullying', modules: ['ks2-08-kind-safe-online'] },
      { phrase: 'anybody can say they are anybody', modules: ['ks2-07-privacy-reputation'] },
      { phrase: 'privacy switch and a location switch', modules: ['ks2-07-privacy-reputation'] },
      { phrase: 'the internet remembers', modules: ['ks2-07-privacy-reputation'] },
      { phrase: 'tell a grown up', modules: ['ks2-07-privacy-reputation'] },
    ],
  },

  // ── Key stage 3 ──────────────────────────────────────────────────────────
  YOURS('CPOS-KS3-1', 'KS3', 'design, use and evaluate computational abstractions that model the state and behaviour of real-world problems and physical systems'),
  YOURS('CPOS-KS3-2', 'KS3', 'understand several key algorithms that reflect computational thinking [for example, ones for sorting and searching]; use logical reasoning to compare the utility of alternative algorithms for the same problem'),
  YOURS('CPOS-KS3-3', 'KS3', 'use 2 or more programming languages, at least one of which is textual, to solve a variety of computational problems; make appropriate use of data structures [for example, lists, tables or arrays]; design and develop modular programs that use procedures or functions'),
  YOURS('CPOS-KS3-4', 'KS3', 'understand simple Boolean logic [for example, AND, OR and NOT] and some of its uses in circuits and programming; understand how numbers can be represented in binary, and be able to carry out simple operations on binary numbers [for example, binary addition, and conversion between binary and decimal]'),
  YOURS('CPOS-KS3-5', 'KS3', 'understand the hardware and software components that make up computer systems, and how they communicate with one another and with other systems'),
  YOURS('CPOS-KS3-6', 'KS3', 'understand how instructions are stored and executed within a computer system; understand how data of various types (including text, sounds and pictures) can be represented and manipulated digitally, in the form of binary digits'),
  YOURS('CPOS-KS3-7', 'KS3', 'undertake creative projects that involve selecting, using, and combining multiple applications, preferably across a range of devices, to achieve challenging goals, including collecting and analysing data and meeting the needs of known users'),
  {
    id: 'CPOS-KS3-8', keyStage: 'KS3', verdict: 'PARTIAL',
    text: 'create, reuse, revise and repurpose digital artefacts for a given audience, with attention to trustworthiness, design and usability',
    modules: ['ks3-12-misinfo-deepfakes'],
    note: 'Trustworthiness is taught in ks3-12: the three questions to ask of any piece of content, and what a manufactured one looks like. Creating, reusing, revising and repurposing artefacts, and design and usability, are the computing scheme’s. That is the missing clause.',
    probes: [
      { phrase: 'misinformation', modules: ['ks3-12-misinfo-deepfakes'] },
      { phrase: 'three questions', modules: ['ks3-12-misinfo-deepfakes'] },
    ],
  },
  {
    id: 'CPOS-KS3-9', keyStage: 'KS3', verdict: 'FULL',
    text: 'understand a range of ways to use technology safely, respectfully, responsibly and securely, including protecting their online identity and privacy; recognise inappropriate content, contact and conduct, and know how to report concerns',
    modules: ['ks3-11-social-workarounds', 'ks3-12-misinfo-deepfakes', 'ks3-13-scams-fraud-money', 'ks3-27-when-it-turns-on-you'],
    note: 'Identity and privacy settings and passwords in ks3-11 and ks3-13, manufactured content in ks3-12, fraud in ks3-13, and harassment, report and block, and name it, save it, say it in ks3-27.',
    probes: [
      { phrase: 'privacy setting', modules: ['ks3-11-social-workarounds'] },
      { phrase: 'password', modules: ['ks3-11-social-workarounds', 'ks3-13-scams-fraud-money'] },
      { phrase: 'deepfake', modules: ['ks3-12-misinfo-deepfakes'] },
      { phrase: 'fraud is a criminal offence', modules: ['ks3-13-scams-fraud-money'] },
      { phrase: 'report and block', modules: ['ks3-27-when-it-turns-on-you'] },
      { phrase: 'name it, save it, say it', modules: ['ks3-27-when-it-turns-on-you'] },
      { phrase: 'harassment', modules: ['ks3-27-when-it-turns-on-you'] },
    ],
  },

  // ── Key stage 4 ──────────────────────────────────────────────────────────
  YOURS('CPOS-KS4-1', 'KS4', 'develop their capability, creativity and knowledge in computer science, digital media and information technology'),
  YOURS('CPOS-KS4-2', 'KS4', 'develop and apply their analytic, problem-solving, design, and computational thinking skills'),
  {
    id: 'CPOS-KS4-3', keyStage: 'KS4', verdict: 'FULL',
    text: 'understand how changes in technology affect safety, including new ways to protect their online privacy and identity, and how to report a range of concerns',
    modules: ['ks4-16-consent-images-law', 'ks4-17-sextortion', 'ks4-19-readiness-at-16', 'ks4-29-did-not-go-looking'],
    note: 'Report Remove and the Internet Watch Foundation in ks4-16, sextortion as organised crime and how to report it in ks4-17, a private account and the settings a sixteen year old owns in ks4-19, and reporting harmful content in ks4-29.',
    probes: [
      { phrase: 'Report Remove', modules: ['ks4-16-consent-images-law'] },
      { phrase: 'Internet Watch Foundation', modules: ['ks4-16-consent-images-law'] },
      { phrase: 'sextortion', modules: ['ks4-17-sextortion'] },
      { phrase: 'organised crime', modules: ['ks4-17-sextortion'] },
      { phrase: 'private account', modules: ['ks4-19-readiness-at-16'] },
      { phrase: 'report harmful content', modules: ['ks4-29-did-not-go-looking'] },
    ],
  },
]

export const COMPUTING_POS_COUNTS = {
  total: COMPUTING_POS.length,
  full: COMPUTING_POS.filter(s => s.verdict === 'FULL').length,
  partial: COMPUTING_POS.filter(s => s.verdict === 'PARTIAL').length,
  yourScheme: COMPUTING_POS.filter(s => s.verdict === 'YOUR_SCHEME').length,
}

export const COMPUTING_KEY_STAGES: ComputingKeyStage[] = ['KS1', 'KS2', 'KS3', 'KS4']
