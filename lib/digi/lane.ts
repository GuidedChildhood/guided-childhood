import { digiModelsFor } from '@/lib/config/digi'
import { firstText } from '@/lib/digi/text'
import Anthropic from '@anthropic-ai/sdk'

// Which shape this message needs.
//
// Justin: "I want to be able to use Claude though but with the guardrails so it
// can answer anything. Does it currently do that? Like the Good Inside version."
//
// It already could. There is no topic gate anywhere in DiGi, so a parent can ask
// it about a recipe or a work email and Claude answers. What made it feel narrow
// was the SHAPE: the static prompt forces every single reply into the coaching
// format (reassurance, bold lead ins, one thing to try in the next 24 hours) and
// ends every one of them with a reflective question designed to learn about the
// family. Ask for help drafting a letter to the head teacher and you get the
// letter followed by "Quick one for tonight..." which is the moment a parent
// stops believing they can ask it anything.
//
// So the fix is not a different model or a looser prompt. It is knowing which of
// three lanes a message is in and varying only the shape:
//
//   parenting  the thing this product is for. Full coaching shape, research,
//              the reflective question. Unchanged.
//   family     around the child but not about screens: a letter to school, a
//              packed lunch, a sibling row, the parent's own hard week. Same
//              warmth and the same memory, no forced 24 hour close, and the
//              reflective question only when it would actually teach us
//              something.
//   general    anything else. Answer it properly, as the sharpest person they
//              know would, with no coaching wrapper at all.
//
// The RAILS do not vary by lane. Crisis routing, never diagnose, never allow or
// deny, data minimisation, no invented sources, no dashes: those live in the
// static prompt and apply to all three. That is the whole point. Widening what
// DiGi will talk about must never widen what it is allowed to say.

export type Lane = 'parenting' | 'family' | 'general'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
  timeout: 8_000,
  maxRetries: 0,
})

// The free pass. Most messages here are plainly about a child and a screen, and
// paying for a classification call on every one of them would add latency to the
// common case to serve the rare one.
const PARENTING_SIGNALS = [
  // who
  'child', 'children', 'kid', 'kids', 'son', 'daughter', 'teen', 'teenager',
  'toddler', 'year old', 'yr old', 'sibling', 'brother', 'sister', 'boy', 'girl',
  // the screen
  'screen', 'phone', 'mobile', 'tablet', 'ipad', 'laptop', 'device', 'console',
  'tiktok', 'instagram', 'snapchat', 'snap', 'youtube', 'whatsapp', 'discord',
  'reddit', 'roblox', 'minecraft', 'fortnite', 'xbox', 'playstation', 'nintendo',
  'switch', 'gaming', 'game', 'app', 'online', 'internet', 'wifi', 'social media',
  'algorithm', 'feed', 'group chat', 'youtuber', 'streamer',
  // the day
  'bedtime', 'sleep', 'homework', 'school', 'teacher', 'classroom', 'playground',
  'chore', 'pocket money', 'screen time', 'routine', 'morning',
  // the feelings and the worries
  'anxious', 'anxiety', 'worried', 'mood', 'meltdown', 'tantrum', 'lonely',
  'bullied', 'bullying', 'confidence', 'friends', 'friendship', 'withdrawn',
  'boundary', 'boundaries', 'discipline', 'consequence', 'grounded',
  // the product
  'digi', 'pathway', 'passport', 'stage', 'lesson', 'script', 'star', 'quest',
]

// A short reply with no nouns in it is almost always a follow up: "and if she
// says no?", "what about the tablet", "ok". Sending those to a classifier that
// cannot see the conversation gets them wrongly filed as general, which would
// yank the shape mid conversation. Continuity wins.
const FOLLOW_UP_OPENERS = [
  'and ', 'but ', 'so ', 'what if', 'what about', 'ok', 'okay', 'yes', 'no ',
  'why', 'how about', 'then ', 'also', 'thanks', 'thank you', 'she ', 'he ',
  'they ', 'we ', 'it ', 'that ', 'this ',
]

// Whole words only, and this is not fussiness.
//
// A plain substring test sends "what happened at the election" to the parenting
// lane because "happen" contains "app", and "how do I get started" because
// "started" contains "star". Both are exactly the general questions this whole
// change exists to serve, and both would have been silently mis served.
//
// Word ends rather than \b at both sides, so plurals and possessives still
// count: kids, teens, phones, my daughter's.
const PARENTING_RE = new RegExp(
  `\\b(${PARENTING_SIGNALS.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(s|es|'s)?\\b`,
  'i',
)

// The list above is the floor, not the whole list. Migration 150 moved the
// vocabulary into digi_lane_keywords so Justin can add a word from the Insights
// board without a deploy, and seeded it with roughly twice as many words.
//
// This stays as the fallback and is never removed. If the database read fails,
// a parent still gets routed sensibly, because a routing hint must never be the
// reason somebody gets no reply.
function buildRe(words: string[]): RegExp {
  return new RegExp(
    `\\b(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(s|es|'s)?\\b`,
    'i',
  )
}

/**
 * The deterministic half. Returns a lane, or null when it genuinely cannot tell.
 *
 * `extra` is the database list. Passing none is the old behaviour exactly.
 */
export function fastLane(message: string, hasHistory: boolean, extra?: string[]): Lane | null {
  const msg = message.toLowerCase().trim()
  if (!msg) return 'parenting'
  const re = extra?.length ? buildRe([...PARENTING_SIGNALS, ...extra]) : PARENTING_RE
  if (re.test(msg)) return 'parenting'
  // Mid conversation, a short or connective message continues what came before.
  if (hasHistory && (msg.length < 60 || FOLLOW_UP_OPENERS.some(o => msg.startsWith(o)))) {
    return 'parenting'
  }
  return null
}

// Words a miss report should never suggest, because they carry no signal about
// screens or children and would bury the words that do.
const STOPWORDS = new Set([
  'the','a','an','and','or','but','if','then','so','because','as','of','to','in',
  'on','at','for','with','from','by','about','into','over','after','before',
  'is','are','was','were','be','been','being','do','does','did','have','has',
  'had','will','would','can','could','should','shall','may','might','must',
  'i','me','my','we','us','our','you','your','he','him','his','she','her',
  'it','its','they','them','their','this','that','these','those','what','which',
  'who','when','where','why','how','all','any','both','each','more','most',
  'other','some','such','no','not','only','own','same','than','too','very',
  'just','now','get','got','go','goes','going','know','think','want','need',
  'like','say','said','tell','told','ask','asked','help','thing','things','time',
  'day','days','week','one','two','back','down','up','out','off','still','also',
  'really','much','lot','bit','been','him','hes','shes','dont','doesnt','wont',
  'cant','im','ive','id','ill','were','youre','theyre','thats','whats',
])

/**
 * Candidate words from a message the keyword pass could not classify, for the
 * founder misses report.
 *
 * PRIVACY IS THE DESIGN HERE, not a footnote. This returns WORDS, never the
 * message, and it throws away everything that could identify anybody:
 *
 * - anything capitalised mid sentence, which is how names arrive ("Teo")
 * - stopwords and the ordinary verbs of describing a day
 * - anything under three characters or containing a digit
 * - and it caps how many words one message may contribute, so a long message
 *   cannot reconstruct itself in the table
 *
 * The Insights board then refuses to show a word until two or more separate
 * families have used it, so one family's word is never shown to anybody.
 */
export function missCandidates(message: string, known: Set<string>): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  // Split on the original so capitalisation survives long enough to spot names.
  const tokens = message.split(/[^A-Za-z']+/).filter(Boolean)
  tokens.forEach((token, i) => {
    // A capital that is not the first word of the message is a name far more
    // often than it is a brand, and the cost of dropping a brand is one more
    // week before it shows up. The cost of keeping a name is a child's name in
    // a table. Not a close call.
    if (i > 0 && /^[A-Z]/.test(token)) return
    const word = token.toLowerCase().replace(/'s$/, '')
    if (word.length < 3) return
    if (STOPWORDS.has(word)) return
    if (known.has(word)) return
    if (seen.has(word)) return
    seen.add(word)
    out.push(word)
  })
  return out.slice(0, 6)
}

const CLASSIFY = `Classify one message a parent sent to a digital parenting advisor. Reply with ONE word and nothing else.

parenting  it is about their child and screens, devices, games, social media, online safety, or their child's wellbeing and behaviour
family     it is about family life around the child but not about screens: school admin, a letter or email they need to write, meals, siblings, routines, the parent's own stress or health
general    anything else at all: work, cooking, travel, money, a fact they want, help with something unrelated to their family

Message: `

/**
 * Which shape this message needs. Deterministic first, model only for the
 * genuinely ambiguous remainder, and 'parenting' whenever anything fails.
 *
 * The default matters. A general question wrongly served the coaching shape is
 * mildly odd. A question about a child wrongly served the plain shape loses the
 * research, the reflective question and the memory that makes DiGi worth having,
 * so every failure path lands on parenting.
 */
export async function classifyLane(message: string, hasHistory: boolean, extra?: string[]): Promise<Lane> {
  const fast = fastLane(message, hasHistory, extra)
  if (fast) return fast

  try {
    const models = digiModelsFor('extract')
    const msg = await anthropic.messages.create({
      model: models[0],
      max_tokens: 5,
      messages: [{ role: 'user', content: `${CLASSIFY}${message.slice(0, 400)}` }],
    })
    const word = firstText(msg).trim().toLowerCase()
    if (word.startsWith('general')) return 'general'
    if (word.startsWith('family')) return 'family'
    return 'parenting'
  } catch {
    return 'parenting'
  }
}

// Signposting that has to be there once DiGi answers anything. A parenting
// advisor staying quiet about the limits of its own remit is fine while the
// remit is parenting. The moment it will answer a question about a rash or a
// tenancy or a tax bill, saying who actually deals with that is not a
// disclaimer, it is the honest answer.
const PROFESSIONAL_GUARD = `
- If the question is medical, legal, financial or immigration, give the clear general picture and then name the kind of professional who should see the specifics (GP or NHS 111, a solicitor, a qualified adviser). Never present yourself as one.`

const SHAPES: Record<Lane, string> = {
  // The house shape. Nothing to override.
  parenting: '',

  family: `

THE SHAPE FOR THIS MESSAGE (overrides the MESSAGE FORMAT and REFLECTIVE QUESTION rules above):
This is about their family but not about screens or their child's digital life. Help properly, in full, the way the sharpest friend they know would.
- Answer the actual question first and completely. If they asked for a letter, write the letter. If they asked how to handle something, say how.
- Give it the room it needs. The three to five sentence guide does not apply when they asked for something that is longer than that by nature.
- Do NOT force a thing to try in the next 24 hours onto an answer that does not have one.
- Add the --- and a reflective question ONLY if it would genuinely teach you something about this child or family that helps you later. If it would not, end cleanly with no marker and no question.
- Skip the gentle nudge entirely.
Everything else holds: your voice, no dashes, never diagnose, never a flat allow or deny, never ask for identifying detail, and the crisis rule above beats this and everything else.${PROFESSIONAL_GUARD}`,

  general: `

THE SHAPE FOR THIS MESSAGE (overrides the MESSAGE FORMAT and REFLECTIVE QUESTION rules above):
This one is not about their child at all. They asked you something else and they asked YOU, so answer it properly rather than steering back to parenting.
- Just answer it. Fully, accurately, in as much depth as the question deserves, the way a knowledgeable person answers a friend.
- No coaching shape. No opening reassurance, no bold lead ins unless the content genuinely wants them, no thing to try in the next 24 hours.
- No --- and NO reflective question. End when the answer ends.
- No nudge, no mention of the pathway, no steering back to their child. If they want to talk about their child they will.
- Do not use anything you remember about this family unless it is directly relevant to what they asked. Knowing about them is not a reason to bring them up.
Everything else holds: your voice, plain and warm and direct, British English, no dashes anywhere, never invent a fact or a source, say plainly when you do not know, and the crisis rule above beats this and everything else.${PROFESSIONAL_GUARD}`,
}

export function laneShape(lane: Lane): string {
  return SHAPES[lane]
}
