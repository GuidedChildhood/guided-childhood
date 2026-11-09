// How close is this study to the thing Guided Childhood is actually about?
//
// The gates in discover.mjs are binary and they let noise through. The first
// full 24 stream run on 9 November kept 13 studies, of which about four were
// genuinely ours and nine were health services papers that happened to contain
// the words "digital" and "children": neonatal malaria management, olfaction
// enhanced sensory literacies, a healthy checkout policy experiment.
//
// Chasing those with more exclusion terms is a losing game, because the next
// run finds a different nine. So this file ranks instead of classifying. The
// brief takes the top of the ranking, which means a noisy record costs a line
// in the register rather than a place in Justin's morning three.
//
// The weights are not tuned on anything. They are a statement of what we
// think matters, and they should be argued with rather than trusted.

const CORE = [
  // The exposures we exist to talk about, weighted by how central they are.
  [/\bsocial media\b/i, 5],
  [/\bscreen time\b/i, 5],
  [/\bsmartphone|mobile phone\b/i, 4],
  [/\bcyberbully|online harassment\b/i, 4],
  [/\bAI companion|chatbot|conversational agent|character\.ai|large language model\b/i, 4],
  [/\balgorithm|recommender|\bfeed\b|for you page\b/i, 4],
  [/\bage assurance|age verification|age estimation\b/i, 4],
  [/\bparental control|parental monitoring|family rules\b/i, 4],
  [/\bgaming|video game|loot box\b/i, 3],
  [/\btiktok|instagram|snapchat|youtube|roblox|discord\b/i, 3],
  [/\bsexting|grooming|image-based abuse\b/i, 3],
  [/\bbody image|social comparison\b/i, 3],
  [/\bself-?harm|suicid/i, 3],
  [/\bphone ban|device ban|phone-free\b/i, 3],
  [/\bdigital literacy|media literacy\b/i, 3],
  [/\bsleep\b/i, 2],
  [/\bonline safety\b/i, 2],
  [/\bproblematic (internet|smartphone|social media) use\b/i, 2],
  // Added 9 November after the first full run scored "Decoding Digital Risk:
  // Comparing Parent and Teen Reports of Teens' Online Activities" at zero.
  // The gap between what a parent believes and what the child is doing is the
  // premise of the whole product, so it cannot sit in PERIPHERAL.
  [/\bonline activit|digital risk|online risk\b/i, 4],
  [/\bparent(s|al)? and (teen|child|adolescen)|discrepanc|parent-child agreement|concordance\b/i, 4],
  [/\bfirst (phone|device|smartphone)|device ownership\b/i, 3],
]

const METHOD = [
  // Design quality, because a finding we can stand behind is worth more than
  // a finding that merely sounds exciting.
  [/\brandomis(ed|ation)|randomiz(ed|ation)|\bRCT\b/i, 4],
  [/\bmeta-?analy/i, 4],
  [/\bsystematic review|umbrella review\b/i, 3],
  [/\blongitudinal|cohort|prospective|within-person\b/i, 3],
  [/\bpreregist|pre-?regist|specification curve\b/i, 3],
  [/\bnationally representative\b/i, 2],
  [/\bno association|null (result|finding)/i, 2],
  [/\bparent(al)? report|self-?report|device log|passive sensing\b/i, 2],
]

const PENALTY = [
  // Contexts where "digital" and "children" co-occur for reasons that have
  // nothing to do with a child using a device at home or at school.
  [/\bprimary care|clinician|physician|nurse|hospital|patient|referral|triage\b/i, -4],
  [/\bmalaria|neonatal|sepsis|immunis|immuniz|nutrition|stunting|breastfeed/i, -5],
  [/\brobot|wearable sensor|motor activity|prosthe/i, -4],
  [/\bpolitical participation|democracy|electoral|protest|movement/i, -5],
  [/\bcheckout policy|food marketing|dietary|supermarket/i, -4],
  [/\bolfact|sensory literac|museum|olfaction/i, -4],
  [/\bteacher training|lesson plan software|canva|learning management/i, -3],
  [/\bveterinar|dental|dermatolog|ophthalm/i, -4],
]

const UK = [
  [/\bUnited Kingdom|\bUK\b|Britain|British|England|Scotland|Wales|Northern Ireland/i, 3],
  [/\bOfcom|\bDfE\b|Department for Education|Online Safety Act/i, 3],
  [/\bEurope|European\b/i, 1],
]

// A paper genuinely about children almost always says so in its title. The
// first live rerun on 9 November scored "Religious Communities and Social Media
// in North Macedonia" as CORE, because it is about social media and mentions
// youth somewhere in the abstract. It is not about children using anything.
//
// So the child signal has to be in the TITLE for a record to reach CORE. This
// is a centrality test rather than another keyword: an abstract mention means
// children came up, a title mention means children are the subject.
const CHILD_IN_TITLE = /\b(child|children|childhood|adolescen\w*|teen\w*|youth|pupil\w*|infant\w*|toddler\w*|preschool\w*|school-?age\w*|young people|minors?|boys?|girls?|KS[1-4]|key stage)\b/i

function hits(text, table) {
  let total = 0
  const matched = []
  for (const [re, w] of table) {
    if (re.test(text)) { total += w; matched.push(`${w > 0 ? '+' : ''}${w} ${re.source.slice(0, 34)}`) }
  }
  return { total, matched }
}

/**
 * Returns { score, band, parts } where band is one of
 *   CORE        plainly our subject, worth Justin's attention
 *   ADJACENT    related, worth banking
 *   PERIPHERAL  kept in the register for the record, not for the brief
 * Nothing is thrown away by scoring: a PERIPHERAL record stays in the
 * register, because next month it may be the contradictory study we need.
 */
export function score(rec) {
  const text = `${rec.title || ''} ${rec.abstract || ''}`
  const core = hits(text, CORE)
  const method = hits(text, METHOD)
  const pen = hits(text, PENALTY)
  const uk = hits(text, UK)

  let s = core.total + method.total + pen.total + uk.total

  // A preprint is real evidence but it has not been through review, so it
  // carries a little less weight at the point of ranking. The dossier records
  // the status plainly either way.
  if (rec.isPreprint) s -= 2
  // Official regulator and government material is a primary source for policy
  // status, which is a thing the brief has to get right.
  if (rec.isOfficial) s += 3

  const childIsTheSubject = CHILD_IN_TITLE.test(rec.title || '')
  let band = core.total === 0 ? 'PERIPHERAL' : s >= 9 ? 'CORE' : s >= 4 ? 'ADJACENT' : 'PERIPHERAL'
  // No children in the title, no CORE, however high the score.
  if (band === 'CORE' && !childIsTheSubject) band = 'ADJACENT'
  return { score: s, band, childIsTheSubject,
    parts: { core: core.matched, method: method.matched, penalty: pen.matched, uk: uk.matched } }
}
