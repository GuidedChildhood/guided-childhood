// Notes on a child's screen, checked without a database (13 October 2026).
//
// Justin sent screenshots of Teo's app carrying a DiGi answer written for the
// parent, markdown stars and a parent dashboard link spelled out in full. The
// rules that stop it, pinned here so a later tidy up cannot quietly undo them:
//   a note pointing into the parent dashboard never reaches a child
//   markdown never shows as stars and brackets on a child's screen
//   Send to their phone only sits under the child's version in DiGi chat
//   the page, the live poll and the send route all go through the same rules
//
// Usage: node --experimental-strip-types scripts/check-kid-notes.mjs

import { readFileSync } from 'node:fs'
import { isParentOnlyNote, kidNoteText, kidNotes } from '../lib/kid/note-text.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}
const read = p => readFileSync(p, 'utf8')

// The note Teo actually got, cut down.
const teo = 'Teaching Teo social media is not teaching him the apps. **Let him pass it on.** Teo can do the first one himself in his own app, [Social media, group chats and the workarounds](/dashboard/lessons/path?child=b46c&lesson=e519#lesson-e519), one a week.'
check('the note Teo got is parent only', isParentOnlyNote(teo))
check('and is dropped from the child\'s notes', kidNotes([{ id: '1', message: teo }]).length === 0)

const fine = 'Your 🖍️ Colour the planets is done! 12 stars are in your bank.'
check('an ordinary note is not parent only', !isParentOnlyNote(fine))
check('an ordinary note passes through untouched', kidNoteText(fine) === fine)
check('the passport to do is not parent only', !isParentOnlyNote('Your passport this month: 17 lessons to watch with a grown up.'))

const md = kidNoteText('**Tonight.** Ask one question: [the lesson](https://example.com/x). See https://example.com/y now.')
check('bold stars come off', !md.includes('**'), md)
check('a link keeps its words and loses its address', md.includes('the lesson') && !md.includes('example.com'), md)
check('blank lines tidy to single breaks', kidNoteText('one\n\n\ntwo') === 'one\ntwo')
check('an empty result is dropped', kidNotes([{ id: '2', message: '**  **' }]).length === 0)

// ── EVERY DOOR USES THE RULES ───────────────────────────────────────────────
check('the kid page filters its notes', /kidNotes\(/.test(read('app/k/[token]/page.tsx')))
check('the live poll filters its notes', /kidNotes\(/.test(read('app/api/quests/time/status/route.ts')))
const send = read('app/api/digi/send-to-child/route.ts')
check('the DiGi send route refuses a parent only note', /isParentOnlyNote\(/.test(send) && /kidNoteText\(/.test(send))
const chat = read('app/(dashboard)/dashboard/digi/DigiChat.tsx')
check('Send to their phone only under the child\'s version', /\{isChildVersion && <button\s+onClick=\{\(\) => sendToChildPhone/.test(chat))

if (failures) { console.error(`\n${failures} kid note check(s) failed`); process.exit(1) }
console.log('\nKid notes: all clear')
