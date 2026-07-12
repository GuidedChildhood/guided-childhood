// The first TEXT block of a model response, wherever it sits. Models with
// reasoning can lead with a thinking block, so content[0] must never be
// assumed to be the text: that assumption is what made every eval case
// grade as "no json" the day the model started thinking first.
export function firstText(msg: { content: Array<{ type: string }> } | null | undefined): string {
  const block = msg?.content?.find(b => b.type === 'text') as { type: string; text?: string } | undefined
  return block?.text ?? ''
}
