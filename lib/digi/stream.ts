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
 * Thinking blocks go back too, signature and all, because a thinking model
 * rejects a turn that has had its reasoning removed.
 */
export async function consumeStream(
  // Either endpoint's events. Fast mode is only reachable through the beta
  // endpoint, whose event union names the same fields this reads.
  stream: AsyncIterable<Anthropic.RawMessageStreamEvent | Anthropic.Beta.BetaRawMessageStreamEvent>,
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
  dashes: ReturnType<typeof makeDashStripper>,
): Promise<TurnResult> {
  let clean = ''
  let stopReason: string | null = null
  const usage: TurnUsage = { input: null, cacheRead: null, cacheWrite: null, output: null }

  // ── EVERY BLOCK GOES BACK, IN THE ORDER IT CAME (13 September 2026) ───────
  //
  // The assistant turn is rebuilt here for the next request in a tool round.
  // It used to keep the text and the tool calls and drop everything else,
  // which was fine on a model that does not think and is a 400 waiting to
  // happen on one that does: a thinking model signs each thinking block and
  // expects it back, unchanged and in place, ahead of the tool call it
  // introduced. Fable 5.1 thinks on every request and cannot be told not to,
  // and from today it answers the chat. So the turn is kept by content block
  // index, thinking and redacted thinking included, with the signature the
  // model streams at the end of each thinking block. Under the default
  // display the thinking text is empty; the signature is what matters.
  type Partial =
    | { kind: 'text'; text: string }
    | { kind: 'tool_use'; id: string; name: string; json: string }
    | { kind: 'thinking'; thinking: string; signature: string }
    | { kind: 'redacted_thinking'; data: string }
  const partials = new Map<number, Partial>()
  const toolUses: ToolUse[] = []

  for await (const event of stream) {
    if (event.type === 'message_start') {
      const u = event.message.usage
      usage.input = u.input_tokens ?? null
      usage.cacheRead = u.cache_read_input_tokens ?? null
      usage.cacheWrite = u.cache_creation_input_tokens ?? null
    } else if (event.type === 'content_block_start') {
      const b = event.content_block
      if (b.type === 'tool_use') partials.set(event.index, { kind: 'tool_use', id: b.id, name: b.name, json: '' })
      else if (b.type === 'text') partials.set(event.index, { kind: 'text', text: b.text ?? '' })
      else if (b.type === 'thinking') partials.set(event.index, { kind: 'thinking', thinking: b.thinking ?? '', signature: b.signature ?? '' })
      else if (b.type === 'redacted_thinking') partials.set(event.index, { kind: 'redacted_thinking', data: b.data })
    } else if (event.type === 'content_block_delta') {
      const p = partials.get(event.index)
      const d = event.delta
      if (d.type === 'text_delta') {
        if (p?.kind === 'text') p.text += d.text
        else partials.set(event.index, { kind: 'text', text: d.text })
        const out = dashes.push(d.text)
        if (out) {
          clean += out
          controller.enqueue(encoder.encode(out))
        }
      } else if (d.type === 'input_json_delta') {
        if (p?.kind === 'tool_use') p.json += d.partial_json
      } else if (d.type === 'thinking_delta') {
        if (p?.kind === 'thinking') p.thinking += d.thinking
      } else if (d.type === 'signature_delta') {
        if (p?.kind === 'thinking') p.signature += d.signature
      }
    } else if (event.type === 'message_delta') {
      stopReason = event.delta.stop_reason ?? stopReason
      usage.output = event.usage?.output_tokens ?? usage.output
    }
  }

  // Text is accumulated RAW for the assistant turn and dash stripped for the
  // parent: the model's own words go back to the model.
  const blocks: Anthropic.ContentBlockParam[] = []
  for (const index of [...partials.keys()].sort((a, b) => a - b)) {
    const p = partials.get(index)!
    if (p.kind === 'text') {
      if (p.text.trim()) blocks.push({ type: 'text', text: p.text })
    } else if (p.kind === 'thinking') {
      blocks.push({ type: 'thinking', thinking: p.thinking, signature: p.signature })
    } else if (p.kind === 'redacted_thinking') {
      blocks.push({ type: 'redacted_thinking', data: p.data })
    } else {
      // An empty string is what an argumentless tool call looks like, and
      // JSON.parse('') throws. Malformed JSON means the call is unusable, so
      // it is dropped rather than passed on as a half object.
      let input: unknown = {}
      try { input = p.json.trim() ? JSON.parse(p.json) : {} } catch { continue }
      toolUses.push({ id: p.id, name: p.name, input })
      blocks.push({ type: 'tool_use', id: p.id, name: p.name, input })
    }
  }

  return { clean, blocks, toolUses, stopReason, usage }
}
