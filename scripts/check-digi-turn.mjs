// The assistant turn DiGi replays to the model is the turn the model produced.
//
// 13 September 2026. Fable 5.1 answers the chat and thinks on every request.
// A thinking model signs each thinking block and expects it back, unchanged
// and in place, in the next request of a tool round; a turn with its thinking
// removed can be rejected outright. lib/digi/stream.ts used to keep the text
// and the tool calls and drop everything else, which is exactly that.
//
// So this feeds consumeStream a synthetic stream shaped like a real thinking
// turn (a signed thinking block, a redacted one, text with a dash in it, a
// tool call streamed as JSON fragments, then the stop reason and usage) and
// checks what comes back: every block, in order, the signature intact, the
// tool input parsed, the parent's text dash free, the usage captured. It runs
// the real function, so it tests what the code does and not how it is spelled.
//
//   node --experimental-strip-types scripts/check-digi-turn.mjs

import { consumeStream } from '../lib/digi/stream.ts'
import { makeDashStripper } from '../lib/digi/text.ts'

async function* events() {
  yield { type: 'message_start', message: { usage: { input_tokens: 1200, cache_read_input_tokens: 900, cache_creation_input_tokens: 0, output_tokens: 1 } } }
  yield { type: 'content_block_start', index: 0, content_block: { type: 'thinking', thinking: '', signature: '' } }
  yield { type: 'content_block_delta', index: 0, delta: { type: 'thinking_delta', thinking: '' } }
  yield { type: 'content_block_delta', index: 0, delta: { type: 'signature_delta', signature: 'sig-abc' } }
  yield { type: 'content_block_stop', index: 0 }
  yield { type: 'content_block_start', index: 1, content_block: { type: 'redacted_thinking', data: 'blob' } }
  yield { type: 'content_block_stop', index: 1 }
  yield { type: 'content_block_start', index: 2, content_block: { type: 'text', text: '' } }
  yield { type: 'content_block_delta', index: 2, delta: { type: 'text_delta', text: 'Let me check ' } }
  yield { type: 'content_block_delta', index: 2, delta: { type: 'text_delta', text: 'the week — one moment.' } }
  yield { type: 'content_block_stop', index: 2 }
  yield { type: 'content_block_start', index: 3, content_block: { type: 'tool_use', id: 'tu_1', name: 'read_week', input: {} } }
  yield { type: 'content_block_delta', index: 3, delta: { type: 'input_json_delta', partial_json: '{"days"' } }
  yield { type: 'content_block_delta', index: 3, delta: { type: 'input_json_delta', partial_json: ': 7}' } }
  yield { type: 'content_block_stop', index: 3 }
  yield { type: 'message_delta', delta: { stop_reason: 'tool_use' }, usage: { output_tokens: 42 } }
  yield { type: 'message_stop' }
}

const sent = []
const controller = { enqueue: chunk => sent.push(chunk) }
const encoder = new TextEncoder()
const dashes = makeDashStripper()

const turn = await consumeStream(events(), controller, encoder, dashes)
const problems = []
const types = turn.blocks.map(b => b.type)

if (types.join(',') !== 'thinking,redacted_thinking,text,tool_use') {
  problems.push(`the turn came back as [${types.join(', ')}]; the model produced [thinking, redacted_thinking, text, tool_use]. A thinking model rejects a turn with its reasoning removed or reordered.`)
}
const thinking = turn.blocks.find(b => b.type === 'thinking')
if (!thinking || thinking.signature !== 'sig-abc') problems.push('the thinking block lost its signature. The signature is the whole point of replaying it.')
const redacted = turn.blocks.find(b => b.type === 'redacted_thinking')
if (!redacted || redacted.data !== 'blob') problems.push('the redacted thinking block lost its data.')
const tool = turn.blocks.find(b => b.type === 'tool_use')
if (!tool || tool.id !== 'tu_1' || JSON.stringify(tool.input) !== '{"days":7}') problems.push('the tool call did not come back with its id and parsed input.')
if (turn.toolUses.length !== 1 || turn.toolUses[0].name !== 'read_week') problems.push('toolUses does not carry the one tool the model asked for.')
const text = turn.blocks.find(b => b.type === 'text')
if (!text || !text.text.includes('—')) problems.push('the raw text going back to the model was rewritten. The model must see its own words.')
if (turn.stopReason !== 'tool_use') problems.push(`stop reason ${turn.stopReason}, expected tool_use.`)
if (turn.usage.cacheRead !== 900 || turn.usage.input !== 1200 || turn.usage.output !== 42) problems.push(`usage not captured: ${JSON.stringify(turn.usage)}.`)
const parentSaw = new TextDecoder().decode(new Uint8Array(sent.flatMap(c => [...c]))) + (dashes.flush() ?? '')
if (/ - |—|–/.test(parentSaw)) problems.push(`a dash reached the parent: ${JSON.stringify(parentSaw)}.`)
if (!parentSaw.includes('Let me check')) problems.push('the parent did not receive the text.')

if (problems.length) {
  console.error('check-digi-turn FAILED\n')
  for (const p of problems) console.error('  ' + p)
  process.exit(1)
}
console.log(`check-digi-turn ok: ${types.length} blocks back in order, signature intact, tool parsed, parent text dash free.`)
