// After a child pitches a job, they are asked: another idea, or back to my day.
//
// Justin, 28 September 2026: when a child adds a job "it should ask if I want
// to add others, but also take me back to home if no, and complete the five a
// day, then take them on the flow, always giving them a reminder to request
// screen time here". This pins the three parts so a later tidy up cannot drop
// the child back into a dead end with only a toast.

import { readFileSync } from 'node:fs'

const src = readFileSync('components/kid/KidAskForJob.tsx', 'utf8')
const problems = []

// A. The sheet opens only on a send the server accepted, after the tick fires.
if (!/tickRef\.current = fetch\('\/api\/kid\/day'/.test(src) || !/setPitched\(clean\)/.test(src)) problems.push('A: a successful pitch does not open the choice sheet after ticking the ask step')
if (/say\('Quest idea sent/.test(src)) problems.push('A: the old optimistic toast is back, which claims a send before the server agrees')

// B. Both choices: pitch another, and back to the day (which waits for the tick).
if (!/data-pitch-another/.test(src)) problems.push('B: no "pitch another" choice')
if (!/data-back-to-day/.test(src) || !/onClick=\{backToDay\}/.test(src)) problems.push('B: no "back to my day" choice')
if (!/await Promise\.race\(\[tickRef\.current/.test(src) || !/router\.push\(`\/k\/\$\{token\}`\)/.test(src) || !/router\.refresh\(\)/.test(src)) problems.push('B: back to my day does not wait for the tick and refresh home, so the ask row could still look open')

// C. The screen time reminder is always on the sheet.
if (!/href=\{`\/k\/\$\{token\}\/ask`\}\s*data-screen-time-door/.test(src)) problems.push('C: the sheet has no screen time door')

if (problems.length) {
  console.error('check-pitch-then-day FAILED\n' + problems.map(p => '  ' + p).join('\n'))
  process.exit(1)
}
console.log('check-pitch-then-day: ok (choice sheet after a pitch, back to the day after the tick, screen time door)')
