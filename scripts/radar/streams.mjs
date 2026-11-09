// The 24 specialist search streams, exactly as the protocol names them.
//
// A stream is a query definition, not an agent. The protocol is explicit about
// that and so is this file: "one scheduled research workflow using 24
// specialist search streams, NOT 24 independently running autonomous agents".
// They run concurrently, which is a worker pool, not autonomy.
//
// Each stream carries:
//   id       the protocol's own number, so a finding traces back to the doc
//   name     the protocol's own wording
//   q        a query for the literature sources, in Europe PMC syntax, which
//            PubMed and Crossref also accept in the reduced form we build
//   gov      an optional plainer query for GOV.UK, which has no field syntax
//   exposure what this stream is actually measuring, used by the dossier to
//            refuse to let "screen time" stand as one undifferentiated thing

const CHILD = '(child* OR adolescen* OR teen* OR youth OR pupil* OR "young people")'

// Each stream also carries `must`: a regex the title or abstract has to match
// before the record counts. The source query alone is not enough, and the first
// live run on 9 November proved it. Stream 11 came back with artificial
// intelligence for paediatric fracture detection and for sperm retrieval,
// because those papers are about children and about AI and about nothing we
// care about. Stream 04 came back with polygenic risk scores and youth
// political participation, because the Crossref query had been flattened into
// a bag of words.
//
// So `must` is the topic gate, and EXCLUDE below is the clinical gate. Both are
// deliberately readable: when a run surfaces junk, the fix belongs here where
// it can be seen, not buried in the runner.

// Clinical and laboratory uses of technology ON children, as opposed to
// children's own use OF technology. The whole radar is about the second.
export const EXCLUDE = new RegExp([
  'fracture', 'radiograph', 'radiolog', 'tomograph', 'ultrasound', 'histopath',
  'appendicitis', 'sperm', 'testicular', 'uroflowmetr', 'oncolog', 'chemotherap',
  'tumour', 'tumor', 'carcinom', 'with cancer', 'cancer patient', 'palliativ', 'healthcare system', 'health professional', 'leukaemi', 'leukemi', 'surgical', 'surgery',
  'anaesthe', 'anesthe', 'sepsis', 'vaccin', 'genotyp', 'polygenic', 'genome',
  'biomarker', 'dentist', 'orthodont', 'prosthes', 'echocardiog', 'electrocardiog',
  'diagnostic accuracy', 'diagnostic performance', 'triage',
].join('|'), 'i')

export const STREAMS = [
  { id: '01', name: 'Longitudinal cohorts and temporal direction',
    q: `${CHILD} AND ("screen time" OR "social media" OR smartphone OR "digital media") AND (longitudinal OR cohort OR "within-person" OR "random intercept" OR prospective)`,
    exposure: 'varies, the point of the stream is the direction of effect over time', must: /longitudinal|cohort|prospective|within-person|over time|follow-?up|wave/i },
  { id: '02', name: 'Systematic reviews, meta-analyses and umbrella reviews',
    q: `${CHILD} AND ("screen time" OR "social media" OR "digital technology") AND ("systematic review" OR "meta-analysis" OR "umbrella review" OR "scoping review")`,
    exposure: 'pooled, so overlapping samples must be checked before any total N is quoted', must: /systematic review|meta-?analy|umbrella review|scoping review|pooled/i },
  { id: '03', name: 'Mental health, anxiety, depression and wellbeing',
    q: `${CHILD} AND ("social media" OR "screen time") AND (depress* OR anxiet* OR wellbeing OR "mental health" OR "psychological distress")`,
    gov: 'children young people mental health digital', exposure: 'usually self reported use against a symptom scale', must: /depress|anxiet|wellbeing|well-being|mental health|distress|internalis|internaliz|self-esteem/i },
  { id: '04', name: 'Sleep, circadian rhythm, bedtime and night-time use',
    q: `${CHILD} AND (sleep OR circadian OR bedtime OR insomnia OR "sleep onset") AND ("screen" OR "smartphone" OR "social media" OR "device use")`,
    exposure: 'time of day matters more than duration here, and it is the one mechanism that is not contested', must: /sleep|circadian|bedtime|insomnia|nap|night-?time|melatonin/i },
  { id: '05', name: 'Attention, executive function and cognitive development',
    q: `${CHILD} AND (attention OR "executive function" OR "working memory" OR "cognitive development" OR ADHD) AND ("screen" OR "media use" OR "digital")`,
    exposure: 'duration and content, rarely separated well', must: /attention|executive function|working memory|cognitive|inhibit|ADHD|impulsiv/i },
  { id: '06', name: 'Early childhood, language and parent-child interaction',
    q: `(infant* OR toddler* OR preschool* OR "early years") AND (language OR vocabulary OR "serve and return" OR "joint attention" OR "parent-child interaction") AND (screen OR television OR tablet OR "media use")`,
    exposure: 'background television and parental device use are distinct exposures from the child own use', must: /language|vocabulary|joint attention|serve and return|parent-?child interaction|babbl|word learning|early years/i },
  { id: '07', name: 'Physical activity, sedentary time and health',
    q: `${CHILD} AND ("physical activity" OR sedentary OR obesity OR "body mass index" OR fitness) AND ("screen time" OR "recreational screen")`,
    exposure: 'displacement, so what the time replaced is the question', must: /physical activity|sedentary|obesity|body mass|adiposit|fitness|steps/i },
  { id: '08', name: 'Educational outcomes, attainment and classroom devices',
    q: `${CHILD} AND (attainment OR achievement OR "academic performance" OR literacy OR numeracy) AND ("mobile phone" OR tablet OR laptop OR "phone ban" OR "classroom technology")`,
    gov: 'mobile phones in schools attainment', exposure: 'policy at school level, rarely individual use', must: /attainment|achievement|academic|literacy|numeracy|exam|grade|test score|classroom|school polic/i },
  { id: '09', name: 'Social media content, algorithms and recommender feeds',
    q: `${CHILD} AND (algorithm* OR recommend* OR "for you" OR feed OR "content moderation") AND ("social media" OR TikTok OR Instagram OR YouTube)`,
    exposure: 'what the system serves, which is the exposure almost no study measures directly', must: /algorithm|recommend|feed|for you|content moderation|exposure to content|personalis|personaliz/i },
  { id: '10', name: 'Gaming, voice chat, online friends and spending',
    q: `${CHILD} AND (gaming OR "video game*" OR "loot box*" OR "in-game purchase" OR "voice chat") AND (wellbeing OR spending OR friendship OR harm OR social)`,
    gov: 'children online gaming loot boxes', exposure: 'who the child plays with, not how long', must: /gaming|video game|loot box|in-?game|voice chat|esports|microtransaction/i },
  { id: '11', name: 'AI companions, chatbots and AI toys',
    q: `${CHILD} AND ("artificial intelligence" OR chatbot OR "conversational agent" OR "AI companion" OR "large language model" OR "smart toy")`,
    gov: 'children artificial intelligence toys chatbots', exposure: 'the newest lane and the thinnest evidence base', must: /chatbot|conversational agent|companion|generative|large language model|LLM|smart toy|AI toy|voice assistant|ChatGPT|character\.ai|AI literacy/i },
  { id: '12', name: 'Cyberbullying, group chats and peer relationships',
    q: `${CHILD} AND (cyberbully* OR "online harassment" OR "peer victimisation" OR "peer victimization" OR "group chat")`,
    exposure: 'victimisation and perpetration are different outcomes and often conflated', must: /bully|harass|victimis|victimiz|peer relation|group chat|exclusion/i },
  { id: '13', name: 'Grooming, contact risk and privacy',
    q: `${CHILD} AND (grooming OR "online solicitation" OR "stranger contact" OR "privacy risk" OR "data protection") AND (online OR digital OR internet)`,
    gov: 'child online safety grooming age assurance', exposure: 'contact risk, where published prevalence figures are weak and often untraceable', must: /groom|solicitation|stranger|privacy|data protection|sextort|contact risk/i },
  { id: '14', name: 'Body image, eating disorders and social comparison',
    q: `${CHILD} AND ("body image" OR "eating disorder" OR "body dissatisfaction" OR "social comparison" OR "appearance ideal") AND ("social media" OR Instagram OR TikTok)`,
    exposure: 'appearance content specifically, not total use', must: /body image|eating disorder|body dissatisf|social comparison|appearance|thin ideal|muscularit/i },
  { id: '15', name: 'Harmful content, self-harm and suicide-related exposure',
    q: `${CHILD} AND ("self-harm" OR "self harm" OR suicid* OR "harmful content") AND (online OR "social media" OR internet)`,
    exposure: 'exposure to content, handled with care and never turned into a prevalence claim', must: /self-?harm|suicid|harmful content|pro-?ana|crisis/i },
  { id: '16', name: 'Pornography, sexual safety and image-based abuse',
    q: `${CHILD} AND (pornograph* OR "sexual content" OR "image-based abuse" OR "sexting" OR "nudify" OR "intimate image")`,
    gov: 'age verification pornography online safety act', exposure: 'exposure and victimisation, legally and ethically sensitive', must: /pornograph|sexual|image-?based abuse|sexting|nudif|intimate image|CSAM/i },
  { id: '17', name: 'Age assurance, platform defaults and parental controls',
    q: `(${CHILD} OR minor*) AND ("age assurance" OR "age verification" OR "age estimation" OR "parental control*" OR "default setting*" OR "teen account")`,
    gov: 'age assurance age verification children platform duties', exposure: 'the intervention, where proposal, rule, rollout and outcome get mixed up', must: /age assurance|age verification|age estimation|parental control|default|teen account|age gate|minimum age/i },
  { id: '18', name: 'Smartphone ownership, first-device age and readiness',
    q: `${CHILD} AND ("smartphone ownership" OR "first phone" OR "age of acquisition" OR "device ownership" OR "phone age")`,
    gov: 'children smartphone ownership age', exposure: 'ownership, not use, and the two are routinely swapped', must: /ownership|first phone|age of acquisition|acquire|readiness|own a (smart)?phone/i },
  { id: '19', name: 'Family relationships, parenting practices and co-use',
    q: `${CHILD} AND (parenting OR "family rules" OR "co-use" OR coviewing OR "mediation strategies" OR "parental monitoring") AND (screen OR digital OR "media use")`,
    exposure: 'what the household does, the lane closest to what we build', must: /parent|family|co-?use|coview|co-?view|mediation|monitoring|household|rules/i },
  { id: '20', name: 'Neurodiversity, disability and vulnerable subgroups',
    q: `${CHILD} AND (autis* OR ADHD OR neurodivers* OR disabilit* OR "special educational needs" OR "looked after") AND (online OR digital OR "social media" OR screen)`,
    exposure: 'subgroup effects, where the population average hides the signal', must: /autis|ADHD|neurodiver|disabilit|special educational needs|looked after|vulnerab/i },
  { id: '21', name: 'Inequalities, geography, sex/gender and socioeconomic differences',
    q: `${CHILD} AND (inequalit* OR deprivation OR "socioeconomic" OR "digital divide" OR "sex differences" OR "gender differences") AND (online OR digital OR screen OR "social media")`,
    exposure: 'who carries the risk, which is the whole hidden thread', must: /inequalit|deprivation|socioeconomic|digital divide|sex difference|gender difference|disparit|poverty|adverse childhood|\bACEs?\b|trauma|care-experienc|looked after/i },
  { id: '22', name: 'Interventions, digital literacy, treatment and prevention',
    q: `${CHILD} AND (intervention OR "randomised controlled trial" OR "randomized controlled trial" OR "digital literacy" OR prevention OR curriculum) AND (online OR "social media" OR "screen time" OR "media literacy")`,
    gov: 'media literacy curriculum online safety education', exposure: 'the thing we sell, so held to a higher bar than anything else', must: /intervention|randomis|randomiz|trial|digital literacy|prevention|curriculum|programme|program evaluation/i },
  { id: '23', name: 'International law, regulator datasets and school policy evaluations',
    q: `(${CHILD} OR minor*) AND (regulation OR legislation OR "online safety act" OR "digital services act" OR ban OR policy) AND (evaluat* OR impact OR compliance)`,
    gov: 'online safety act children regulations social media ban', exposure: 'policy status, where proposal and enacted rule must stay separate', must: /regulat|legislat|online safety act|digital services act|ban|polic|compliance|enforcement|law/i },
  { id: '24', name: 'Methods audit, null results, replication and contrary evidence',
    q: `${CHILD} AND ("screen time" OR "social media") AND ("no association" OR "null result*" OR replication OR "preregistered" OR "specification curve" OR "publication bias" OR "effect size")`,
    exposure: 'the stream that exists to kill our own favourite findings', must: /no association|null|replicat|preregist|pre-?regist|specification curve|publication bias|effect size|small effect|robustness/i },
]

if (STREAMS.length !== 24) throw new Error(`expected 24 streams, found ${STREAMS.length}`)

const ids = STREAMS.map((s) => s.id)
if (new Set(ids).size !== 24) throw new Error('duplicate stream id')
