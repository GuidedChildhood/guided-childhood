// DiGi asks "How did that go?" once, and the check in's help stays once.
//
// Justin, 7 October 2026: "Teo asked same thing 3 times ... it needs to show
// once", and "once check in done it flashes up ask digi but quickly flips to
// next child ... goes on alert notification? But only once."
//
// Usage: node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs scripts/check-followup-once.mjs

import { readFileSync } from 'node:fs'
import { planDeliveries, daysBetween, staleBefore, issueLabelFrom, followUpOpener, TOPIC_LABELS, CARD_STALE_DAYS, HOLD_MAX_DAYS, CHECKIN_INVITE_DAYS } from '../lib/digi/followup-queue.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}
const code = src => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

// ── THE RULES, RUN ──────────────────────────────────────────────────────────
const f = (id, key, dueOn, onWorry = false) => ({ id, key, dueOn, onWorry })
const TODAY = '2026-10-07'
const teo = 'u1:teo', olga = 'u1:olga'

let p = planDeliveries([f('a', teo, '2026-10-07')], new Set(), TODAY)
check('a due follow up with no card waiting goes out', p.deliver.includes('a') && p.hold.length === 0)

p = planDeliveries([f('a', teo, '2026-10-07')], new Set([teo]), TODAY)
check('a due follow up waits behind the child\'s unanswered card', p.hold.includes('a') && p.deliver.length === 0)

p = planDeliveries([f('a', teo, '2026-10-07'), f('b', teo, '2026-10-06'), f('c', teo, '2026-10-05')], new Set(), TODAY)
check('three due for one child: the oldest goes out, the other two wait', p.deliver.join() === 'c' && p.hold.sort().join() === 'a,b', JSON.stringify(p))
check('this is the Teo case: three questions, one card', p.deliver.length === 1)

p = planDeliveries([f('a', teo, '2026-10-07'), f('b', olga, '2026-10-07')], new Set(), TODAY)
check('two children each get their own card', p.deliver.length === 2)

p = planDeliveries([f('a', teo, '2026-10-07'), f('w', teo, '2026-10-07', true)], new Set([teo]), TODAY)
check('a follow up on a worry never takes the card slot', p.deliver.includes('w') && p.hold.includes('a'))

const old = `2026-09-${String(26 - HOLD_MAX_DAYS).padStart(2, '0')}`
p = planDeliveries([f('a', teo, old)], new Set([teo]), TODAY)
check(`waiting more than ${HOLD_MAX_DAYS} days past due is let go, not delivered late`, p.cancel.includes('a') && p.deliver.length === 0, JSON.stringify(p))
p = planDeliveries([f('a', teo, '2026-10-01')], new Set([teo]), TODAY)
check('waiting inside the limit is a hold', p.hold.includes('a'))
check('days between two dates', daysBetween('2026-09-23', TODAY) === 14 && daysBetween(TODAY, '2026-09-23') === -14)
check('a bad date is zero days, never a cancel', daysBetween('nope', TODAY) === 0)
const cutoff = staleBefore(new Date('2026-10-07T07:15:00Z'), CARD_STALE_DAYS)
check(`a card is stale after ${CARD_STALE_DAYS} days`, cutoff === '2026-09-23T07:15:00.000Z', cutoff)
check('an invite expires inside a fortnight', CHECKIN_INVITE_DAYS < CARD_STALE_DAYS)

// ── AN EXPIRING THREAD BECOMES A WORRY, AND A CARD OPENS ON ITS THREAD ─────
check('the trigger names the worry in the parent\'s words', issueLabelFrom({ trigger: 'goes straight to the TV before breakfast.', topic: 'routines' }) === 'Goes straight to the TV before breakfast')
check('with no trigger the topic names it', issueLabelFrom({ trigger: '', topic: 'social_media' }) === 'Social media')
check('a trigger too long to be a label falls back to the topic', issueLabelFrom({ trigger: 'x'.repeat(120), topic: 'sleep' }) === 'Sleep')
check('nothing honest to name is null, never invented', issueLabelFrom({ trigger: null, topic: 'zzz' }) === null)
check('every tool topic has a label', ['screen_time', 'gaming', 'social_media', 'sleep', 'mood', 'anxiety', 'safety', 'school', 'siblings', 'routines', 'devices', 'friendship', 'content', 'ai', 'new_phone', 'new_game', 'parent_stress'].every(k => TOPIC_LABELS[k]))
check('no dashes in any label', Object.values(TOPIC_LABELS).every(l => !/[–—]|\s-\s/.test(l)))
const opener = followUpOpener('Did you get a chance to ask Teo to show you how his feed works?')
check('the opener carries the thread, not the title', /show you how his feed works/.test(opener) && !/How did that go/.test(opener))
check('and reads as the parent picking it up', /^You said you would check back on this:/.test(opener) && /pick it up/.test(opener))
check('a long question is cut, not dropped', followUpOpener('q'.repeat(500)).length < 300)

// ── THE WIRE ────────────────────────────────────────────────────────────────
const cron = code(readFileSync('app/api/cron/followups/route.ts', 'utf8'))
check('the cron plans deliveries through the rules', /planDeliveries\(/.test(cron))
check('the cron dismisses stale follow up cards', /\.eq\('kind', 'follow_up'\)\.in\('status', \['pending', 'seen'\]\)\.lt\('created_at', staleBefore\(now, CARD_STALE_DAYS\)\)/.test(cron))
check('and old check in invites', /\.like\('source', 'checkin:%'\)[\s\S]{0,80}staleBefore\(now, CHECKIN_INVITE_DAYS\)/.test(cron))
check('an expiring thread is raised onto the tracker before the card goes',
  /issueLabelFrom\(\{ trigger: o\.trigger, topic: o\.topic \}\)/.test(cron) && /raiseConcern\(admin, card\.user_id, card\.child_id/.test(cron)
  && cron.indexOf('raiseConcern(admin') < cron.indexOf("update({ status: 'dismissed' })\n    .eq('kind', 'follow_up')"))
check('and only when the thread was not already on a worry', /if \(!o \|\| o\.concern_id\) continue/.test(cron))
check('and the outcome is linked to the worry it became', /update\(\{ concern_id: row\.id \}\)/.test(cron))
check('a new card opens DiGi on its thread', /href: `\/dashboard\/digi\?\$\{f\.child_id[\s\S]{0,80}q=\$\{encodeURIComponent\(followUpOpener\(f\.question\)\)\}`/.test(cron))
const collect = code(readFileSync('lib/notifications/collect.ts', 'utf8'))
check('an old card without an href opens on its thread too', /followUpOpener\(String\(d\.body\)\)/.test(collect))
const deck = code(readFileSync('components/digi/DigiPrompts.tsx', 'utf8'))
check('and on Home', /followUpOpener\(p\.body\)/.test(deck))
check('the sweep runs before anything is delivered', cron.indexOf('staleBefore(now, CARD_STALE_DAYS)') < cron.indexOf("from('digi_prompts').insert"))
check('a let go follow up is cancelled, never left pending', /update\(\{ status: 'cancelled' \}\)\.in\('id', plan\.cancel\)/.test(cron))
check('only the planned ones are delivered', /deliverIds\.has\(/.test(cron))

const route = code(readFileSync('app/api/daily/concern-check/route.ts', 'utf8'))
check('the save route plants the invite on a tough score', /band <= ATTENTION_BAND/.test(route) && /kind: 'watch_for'/.test(route))
check('keyed by the worry, so it lands once', /source = `checkin:\$\{concern\.id\}`/.test(route) && /\.eq\('source', source\)\.in\('status', \['pending', 'seen'\]\)/.test(route))
check('and only when no card is already open', /if \(!count\)/.test(route))
check('and clears when the worry lifts', /update\(\{ status: 'dismissed' \}\)[\s\S]{0,120}\.eq\('source', source\)/.test(route))
check('the invite opens DiGi with the same ask as the row', /What is our next move\?/.test(route) && /\/dashboard\/digi\?/.test(route))
check('the route compares bands through the one bandOf', /from '@\/lib\/concerns\/bands'/.test(route) && !/const band = \(n: number\)/.test(route))
check('the invite can never block the save', route.indexOf('if (isScore(score)) {\n    try {') > route.indexOf('await markFirstCheckIn'))

const card = code(readFileSync('components/daily/ConcernCheckIn.tsx', 'utf8'))
check('a tough row stays open instead of folding', /bandOf\(score\) <= ATTENTION_BAND/.test(card) && /if \(!stayOpen\) setFolded/.test(card))
check('and still hands over to the next worry', /if \(!stayOpen\) setFolded[\s\S]{0,400}handOver\(id, posted\.current\)/.test(card))

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
