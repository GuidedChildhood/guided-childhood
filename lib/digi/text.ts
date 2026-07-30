// The first TEXT block of a model response, wherever it sits. Models with
// reasoning can lead with a thinking block, so content[0] must never be
// assumed to be the text: that assumption is what made every eval case
// grade as "no json" the day the model started thinking first.
export function firstText(msg: { content: Array<{ type: string }> } | null | undefined): string {
  const block = msg?.content?.find(b => b.type === 'text') as { type: string; text?: string } | undefined
  return stripDashes(block?.text ?? '')
}

/**
 * Take the dashes out of anything the model wrote.
 *
 * The system prompt already says "No dashes anywhere", twice, and the model
 * still lands one now and then. A parent reading "the fight is not really about
 * the show — it is about the transition" is reading the single clearest tell
 * that a machine wrote it, in the product whose whole promise is that it sounds
 * like Justin. An instruction cannot guarantee this and a replace can, so the
 * rule is enforced on the way out rather than merely requested on the way in.
 *
 * Only the em and en dash are touched. Hyphens are left exactly as they are:
 * they hold together slugs, script links and markdown, and rewriting those
 * would break real URLs to fix a typographic habit.
 */
export function stripDashes(text: string): string {
  return text
    // Ranges read as words: "ages 4–16" becomes "ages 4 to 16".
    .replace(/(\d)\s*[—–]\s*(\d)/g, '$1 to $2')
    // The parenthetical dash, spaced or not, becomes the comma it stands in for.
    .replace(/\s*[—–]\s*/g, ', ')
    // A comma the replacement created immediately before punctuation reads
    // wrong, so fold it back.
    .replace(/,\s*([,.;:!?])/g, '$1')
}

/**
 * The same rule, for text arriving a few characters at a time.
 *
 * The parent facing reply is streamed, so it never passes through firstText and
 * would otherwise keep every dash the model wrote. Sanitising each chunk alone
 * does not work either: "the show ", "— it" arrive separately, and neither
 * piece contains a dash with the spaces around it that give it meaning.
 *
 * So a trailing run of spaces or dashes is held back and carried into the next
 * chunk, which is the smallest amount of lookahead that makes the replacement
 * correct. The delay is one token and invisible to a reader.
 */
export function makeDashStripper() {
  let pending = ''
  return {
    push(chunk: string): string {
      const text = pending + chunk
      const trailing = /[\s—–]+$/.exec(text)
      const head = trailing ? text.slice(0, trailing.index) : text
      pending = trailing ? trailing[0] : ''
      return stripDashes(head)
    },
    // Whatever is still held back when the model stops talking.
    flush(): string {
      const out = stripDashes(pending)
      pending = ''
      return out
    },
  }
}
