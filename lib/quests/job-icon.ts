import type { HappyIconName } from '@/components/kid/HappyIcon'

// WHICH DRAWN ICON A JOB WEARS.
//
// Justin, 16 September 2026, with two pages of The Happy Newspaper held up
// beside the jobs board: "colours are right but the icons could be more happy
// news style like attached."
//
// Until now every job on every screen drew the raw phone emoji stored on the
// row. That is another company's artwork inside our circle plate, in another
// company's style, and it renders differently on every device a family owns:
// Apple's plug is grey and photographic, Google's is flat and blue, and the
// parent's board and the child's board could show two different pictures of
// the same job depending on whose phone each was holding.
//
// So the emoji stops being the picture and becomes the KEY. The stored value
// never changes, which matters: it is what a family typed, it is in the
// database, and it still shows in anything we have not drawn yet.
//
// The map is built from the live quests table rather than from the template
// file, because families type their own jobs and the two sets are not the
// same. Anything unmapped falls through to the title, and anything the title
// cannot place falls through to a star, which is honest: a job is worth
// something, and that is the one thing we always know about it.

const BY_EMOJI: Record<string, HappyIconName> = {
  // Getting out of the house
  '🎒': 'bag', '👟': 'shoes', '👕': 'clothes', '🦷': 'teeth', '🚿': 'shower',
  // Homework and practice
  '✏️': 'homework', '📝': 'homework', '✖️': 'maths', '📚': 'read', '📖': 'read',
  '📘': 'read', '🎵': 'music', '🕵️': 'read',
  // Around the house
  '🧺': 'laundry', '🫧': 'dishes', '🧽': 'dishes', '🍽️': 'plate', '🍱': 'plate',
  '🍳': 'pan', '🥣': 'bowl', '🧃': 'bowl', '🧹': 'tidy', '🧸': 'teddy',
  '🗑️': 'bin', '🪴': 'sprout', '🌿': 'sprout', '🚗': 'car', '🛒': 'bag',
  // Screens, which is the whole point of the product
  '🔌': 'plug', '📵': 'phone', '📱': 'phone', '📲': 'phone', '💻': 'phone',
  '📺': 'tv', '🎮': 'games', '🎲': 'games',
  // Out there, which pays the most
  '🌳': 'tree', '☀️': 'sun', '⚽': 'ball', '🚲': 'bike', '🎨': 'paint',
  // Bed, kindness and the rest
  '🛏️': 'bed', '🌙': 'bed', '💛': 'kind', '🤝': 'kind', '🐾': 'paw',
  '⭐': 'star', '🖨️': 'print', '📅': 'calendar',
  // No entry for the pin. A pin says nothing about the job it is pinned to,
  // so "Pack lunch" is better served by reading its own words below.
}

// The fallback, read off the words. A family that typed their own job usually
// said what it was, and "walk the dog" deserves the dog rather than a star.
// Ordered most specific first: "dishwasher" must beat "wash".
const BY_WORD: [RegExp, HappyIconName][] = [
  [/dishwash|wash(ing)? up|dishes/i, 'dishes'],
  [/teeth|tooth|brush/i, 'teeth'],
  [/shower|bath/i, 'shower'],
  [/washing|laundry|clothes in the basket/i, 'laundry'],
  [/dress|uniform|shirt/i, 'clothes'],
  [/shoe|trainer|boot/i, 'shoes'],
  [/bag|rucksack|satchel/i, 'bag'],
  [/homework|spelling|reading record/i, 'homework'],
  [/times table|maths|number/i, 'maths'],
  [/read|book|story/i, 'read'],
  [/piano|guitar|violin|practice|instrument/i, 'music'],
  [/dog|cat|pet|rabbit|hamster|feed/i, 'paw'],
  [/bin|rubbish|recycl/i, 'bin'],
  [/plant|water the|garden/i, 'sprout'],
  [/car\b/i, 'car'],
  [/lunch|snack/i, 'bowl'],
  [/dinner|cook|meal|breakfast/i, 'pan'],
  [/table|lay the|cutlery/i, 'plate'],
  [/tidy|clean|hoover|vacuum/i, 'tidy'],
  [/toy|lego|teddy/i, 'teddy'],
  [/bed|room|sleep/i, 'bed'],
  [/charge|plug|downstairs/i, 'plug'],
  [/phone|tablet|ipad|device/i, 'phone'],
  [/tv|telly|screen time/i, 'tv'],
  [/game|console|switch|xbox|playstation/i, 'games'],
  [/football|kickabout|ball/i, 'ball'],
  [/bike|scoot|cycle/i, 'bike'],
  [/outside|park|walk|fresh air/i, 'tree'],
  [/draw|paint|make|build|craft/i, 'paint'],
  [/kind|help|share|brother|sister/i, 'kind'],
  [/print|sheet/i, 'print'],
]

/**
 * The drawn icon for a job. The emoji is the key, the title is the fallback,
 * and a star is the floor. Never returns null, because a job with no picture
 * is a hole in a row that is otherwise all pictures.
 */
export function jobIconFor(emoji: string | null | undefined, title?: string | null): HappyIconName {
  // Skin tones and the variation selector ride along on some stored values, so
  // a raw lookup misses jobs that are otherwise an exact match.
  const key = (emoji ?? '').trim()
  const direct = BY_EMOJI[key] ?? BY_EMOJI[key.replace(/[︀-️\u{1F3FB}-\u{1F3FF}]/gu, '')]
  if (direct) return direct

  const words = title ?? ''
  for (const [re, name] of BY_WORD) if (re.test(words)) return name
  return 'star'
}
