import type Anthropic from '@anthropic-ai/sdk'
import type { makeDashStripper } from '@/lib/digi/text'

export interface ToolUse { id: string; name: string; input: unknown }
export interface TurnUsage {
  input: number | null
  cacheRead: number | null
  cacheWrite: number | null
  output: number | null
}
export interface TurnResult {
  /** Dash stripped text, already sent to the client. */
  clean: string
  /** The assistant turn exactly as the model built it, for the next request. */
  blocks: Anthropic.ContentBlockParam[]
  toolUses: ToolUse[]
  stopReason: string | null
  /**
   * What the turn cost, from the message_start and message_delta events. The
   * cache figures are the only evidence there is that the cache_control on the
   * static system prompt is doing anything (migration 295).
   */
  usage: TurnUsage
}

/**
 * Read one model stream: forward the text to the parent as it arrives, and
 * assemble the assistant turn in case a tool was called.
 *
 * Done by hand rather than with the SDK's stream helper because both jobs have
 * to happen in one pass. Waiting for a finalMessage() to learn whether a tool
 * was used would mean holding the whole reply back on every message, which is
 * the streaming experience gone to serve the rare case.
 *
 * Text is accumulated RAW for the assistant turn and dash stripped for the
 * parent. The model's own words go back to the model; the cleaned words go to
 * the person. Sending it the stripped version would quietly rewrite its history.
 */
export async function consumeStream(
  // Either endpoint's events. Fast mode is only reachable through the beta
  // endpoint, whose event union names the same fields this reads.
  stream: AsyncIterable<Anthropic.RawMessageStreamEvent | Anthropic.Beta.BetaRawMessageStreamEvent>,
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
  dashes: ReturnType<typeof makeDashStripper>,
): Promise<TurnResult> {
  let raw = ''
  let clean = ''
  let stopReason: string | null = null
  const usage: TurnUsage = { input: null, cacheRead: null, cacheWrite: null, output: null }
  // Keyed by content block index: a reply can open a text block and a tool_use
  // block, and their deltas arrive interleaved.
  const partials = new Map<number, { id: string; name: string; json: string }>()
  const toolUses: ToolUse[] = []

  for await (const event of stream) {
    if (event.type === 'message_start') {
      const u = event.message.usage
      usage.input = u.input_tokens ?? null
      usage.cacheRead = u.cache_read_input_tokens ?? null
      usage.cacheWrite = u.cache_creation_input_tokens ?? null
    } else if (event.type === 'content_block_start' && event.content_block.type === 'tool_use') {
      partials.set(event.index, { id: event.content_block.id, name: event.content_block.name, json: '' })
    } else if (event.type === 'content_block_delta') {
      if (event.delta.type === 'text_delta') {
        raw += event.delta.text
        const out = dashes.push(event.delta.text)
        if (out) {
          clean += out
          controller.enqueue(encoder.encode(out))
        }
      } else if (event.delta.type === 'input_json_delta') {
        const p = partials.get(event.index)
        if (p) p.json += event.delta.partial_json
      }
    } else if (event.type === 'content_block_stop') {
      const p = partials.get(event.index)
      if (p) {
        let input: unknown = {}
        // An empty string is what an argumentless tool call looks like, and
        // JSON.parse('') throws. Malformed JSON means the call is unusable, so
        // it is dropped rather than passed on as a half object.
        try { input = p.json.trim() ? JSON.parse(p.json) : {} } catch { partials.delete(event.index); continue }
        toolUses.push({ id: p.id, name: p.name, input })
        partials.delete(event.index)
      }
    } else if (event.type === 'message_delta') {
      stopReason = event.delta.stop_reason ?? stopReason
      usage.output = event.usage?.output_tokens ?? usage.output
    }
  }

  const blocks: Anthropic.ContentBlockParam[] = []
  if (raw.trim()) blocks.push({ type: 'text', text: raw })
  for (const t of toolUses) {
    blocks.push({ type: 'tool_use', id: t.id, name: t.name, input: t.input })
  }

  return { clean, blocks, toolUses, stopReason, usage }
}
