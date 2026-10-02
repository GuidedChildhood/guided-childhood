// DiGi's voice, both ways, stays an option and never becomes a nuisance.
//
// Justin, 2 October 2026: "how do we make it an option DiGi speaks out loud so
// not annoying? And how do we make it an option parent can speak to DiGi with
// voice". Plan: plans/2026-10-02-digi-voice-plan.md.
//
// The rules that make it not annoying are easy to lose in a later tidy, and
// none of them would break a build, so they are held here:
//   1. read aloud is off until the parent turns it on;
//   2. a reply is spoken only for the setting or a question asked by voice;
//   3. a tap, the microphone, a new question or leaving the page stops it;
//   4. only the one line is spoken, never the whole reply;
//   5. no audio is ever captured, only the browser's words;
//   6. the microphone is the parent's, never in the child app.
//
// Node builtins plus --experimental-strip-types. No database, no browser.

import { readFileSync, writeFileSync, mkdtempSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const fail = []
const read = p => { try { return readFileSync(p, 'utf8') } catch { fail.push(`${p} is missing`); return '' } }

const voice = read('lib/voice/digi-voice.ts')
const chat = read('app/(dashboard)/dashboard/digi/DigiChat.tsx')

// ── 1. OFF BY DEFAULT ───────────────────────────────────────────────────────
if (!/getItem\(KEY\) === 'on'/.test(voice)) fail.push('lib/voice/digi-voice.ts: read aloud must be off unless this device was set to on')
if (!/const \[readOn, setReadOn\] = useState\(false\)/.test(chat)) fail.push('DigiChat: readOn must start false and only take the stored setting after mount')

// ── 2. SPOKEN ONLY WHEN ASKED FOR ───────────────────────────────────────────
if (!/if \(readOnRef\.current \|\| spokeIt\)/.test(chat)) fail.push('DigiChat: a reply is read aloud only for the setting or a spoken question')
if (!/const spokeIt = !text && askedByVoiceRef\.current/.test(chat)) fail.push('DigiChat: a chip tap must never count as a spoken question')

// ── 3. EVERY WAY TO STOP IT ─────────────────────────────────────────────────
if (!/addEventListener\('pointerdown', stop/.test(chat)) fail.push('DigiChat: a tap anywhere must stop DiGi speaking')
const toggleMic = chat.slice(chat.indexOf('const toggleMic'), chat.indexOf('const messagesEndRef'))
if (!/stopReading\(\)/.test(toggleMic)) fail.push('DigiChat: opening the microphone must stop DiGi speaking')
const send = chat.slice(chat.indexOf('async function sendMessage'), chat.indexOf('async function sendMessage') + 1200)
if (!/stopReading\(\)/.test(send)) fail.push('DigiChat: a new question must stop the last answer being read')
if (!/return \(\) => \{ stopReading\(\); dictationRef\.current\?\.stop\(\) \}/.test(chat)) fail.push('DigiChat: leaving the page must stop speaking and listening')

// ── 4. ONE LINE, NOT THE REPLY ──────────────────────────────────────────────
// The real function, run on real shaped replies. The speech import is stubbed
// so the module loads under node.
{
  const dir = mkdtempSync(join(tmpdir(), 'digi-voice-'))
  const file = join(dir, 'digi-voice.ts')
  writeFileSync(file, voice.replace(/^import \{ speakEnglish \} from .*$/m, 'const speakEnglish = (_t: string, _o?: unknown) => {}'))
  const { spokenLine } = await import(file)
  const long = '**Keep the ending predictable.** A screen that stops at a known point is easier to leave than one that stops mid level. Agree the stop before it starts. Then give a two minute heads up. Then make the next thing something good. ' .repeat(3)
  const said = spokenLine(long)
  if (said.length > 300) fail.push(`spokenLine: spoke ${said.length} characters of a long reply, the cap is 300`)
  if (/\*\*/.test(said)) fail.push('spokenLine: markdown reached the voice')
  const withLine = 'That sounds like a hard evening.\n\n**Try this:** kneel down and say "I can see you are cross, the game is over for tonight and you can tell me about the level" and wait.'
  if (!spokenLine(withLine).startsWith('Try saying: I can see you are cross')) fail.push(`spokenLine: the line to say should lead, got "${spokenLine(withLine)}"`)
  const linked = 'Open [The cool down lap](/dashboard/scripts/12) tonight. It is the one that works.'
  if (/\/dashboard/.test(spokenLine(linked))) fail.push('spokenLine: a link address reached the voice')
  if (spokenLine('') !== '') fail.push('spokenLine: an empty reply should say nothing')
}

// ── 5. WORDS ONLY, NEVER AUDIO ──────────────────────────────────────────────
for (const [name, src] of [['lib/voice/digi-voice.ts', voice], ['DigiChat', chat]]) {
  if (/getUserMedia|MediaRecorder|new Blob\(/.test(src)) fail.push(`${name}: captures audio; DiGi holds the words only`)
}
if (!/rec\.lang = 'en-GB'/.test(voice)) fail.push('lib/voice/digi-voice.ts: dictation must listen for British English')

// ── 6. NOT IN THE CHILD APP ─────────────────────────────────────────────────
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p] })
for (const f of walk('app/k').filter(f => /\.tsx?$/.test(f))) {
  if (/digi-voice|startDictation|canDictate/.test(readFileSync(f, 'utf8'))) fail.push(`${f}: the microphone is for parents; the child app does not listen`)
}

if (fail.length) {
  console.error('check-digi-voice FAILED\n' + fail.map(f => '  ' + f).join('\n'))
  process.exit(1)
}
console.log('check-digi-voice: ok (off by default, spoken only when asked, four ways to stop, one line not the reply, words never audio, parents only)')
