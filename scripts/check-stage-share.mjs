// The share action on the stage result (stage-result-share-action), checked
// without a browser. The things that would quietly break it:
//
//   a visitor's share landing uncounted (not the /v/ source link)
//   a member's share losing the £5 disclosure CAP Code rule 2.1 requires
//   the parent's own typed worry put into somebody else's WhatsApp
//   the share shown over a crisis answer, where the page helps rather than sells
//   a dash in the copy
//
// Usage: node --experimental-strip-types scripts/check-stage-share.mjs

import { readFileSync } from 'node:fs'
import { stageShareLink, stageShareMessage, whatsappHref, STAGE_SHARE_CODE } from '../lib/share/stage.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}
const read = p => readFileSync(p, 'utf8')
const DASH = /[‐-―−]|\s-\s/

const origin = 'https://www.guidedchildhood.com/'
check('a visitor shares the counted source link', stageShareLink(origin, null) === 'https://www.guidedchildhood.com/v/stage-share')
check('and the code is the one the founder page counts', STAGE_SHARE_CODE === 'stage-share')
check('a member shares their own referral link', stageShareLink(origin, 'SARAH47') === 'https://www.guidedchildhood.com/r/SARAH47')

const visitor = stageShareMessage('L', false)
const member = stageShareMessage('L', true)
check('a member’s message says plainly that both get £5', /£5 off/.test(member) && /I get £5/.test(member))
check('a visitor’s message promises no reward', !/£/.test(visitor))
check('both end on the link', visitor.endsWith(' L') && member.endsWith(' L'))
check('no dash in either message', !DASH.test(visitor) && !DASH.test(member))
check('WhatsApp gets the whole message, encoded', whatsappHref('a b&c') === 'https://wa.me/?text=a%20b%26c')

const comp = read('components/starter/ShareStage.tsx')
const copy = (comp.match(/>\s*([^<>{}\n][^<>{}]*?)\s*</g) ?? []).join(' ') + ' ' + (comp.match(/'[^'\n]{12,}'/g) ?? []).join(' ')
check('the line is the one the board asked for', comp.includes('Send this to a parent who has this fight.'))
check('WhatsApp and copy link are both there', /data-share-whatsapp/.test(comp) && /data-share-copy/.test(comp))
check('no dash in the share copy', !DASH.test(copy))
check('the worry never goes into the message', !/worry|concern|challenge/i.test(comp.replace(/\/\/[^\n]*/g, '')))

const reveal = read('app/(marketing)/starter-pack/ResultScreen.tsx')
check('the result screen carries the share', /<ShareStage member=\{!onJoin\} \/>/.test(reveal))
check('but never over an answer that needs help first', /\{!helpFirst && <ShareStage member=\{!onJoin\} \/>\}/.test(reveal))
check('and it sits after the door, not in front of it',
  reveal.indexOf('id="chapter-cta"') > -1 && reveal.indexOf('<ShareStage ') > reveal.indexOf('id="chapter-cta"'))

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
