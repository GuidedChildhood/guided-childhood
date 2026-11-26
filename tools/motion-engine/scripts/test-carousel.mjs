// The evidence carousel gate, one case per rule. Run: node scripts/test-carousel.mjs
import { checkCarousel } from './carousel-gate.mjs'

let failed = 0
const ok = (name, cond) => { console.log(`${cond ? 'pass' : 'FAIL'}  ${name}`); if (!cond) failed++ }
const good = () => ({
  gdc: '066', source: 'Source: RAND, 12 November 2026.',
  pages: [
    { kicker: 'AI and homework', lines: ['Saying no to AI', 'is not the same as', '==talking about it.=='] },
    { kicker: 'What RAND found', lines: ['56 percent encourage it.', '24 percent discourage it.'] },
    { kicker: 'The shaky part', lines: ['==38 percent== used it anyway.'] },
    { kicker: 'What it does not show', lines: ['That rules change behaviour.'] },
    { kicker: 'What parents can do', role: 'practical', lines: ['Show me how you ask it.'] },
  ],
})
const cleared = '56 percent encourage, 24 percent discourage, 38 percent used it'
const hold = (mut, why) => { const s = good(); mut(s); ok(why, checkCarousel(s, cleared).verdict === 'HOLD') }

ok('a sound carousel passes', checkCarousel(good(), cleared).verdict === 'PASS')
hold((s) => { s.pages = s.pages.slice(0, 3) }, 'fewer than four pages is refused')
hold((s) => { s.pages[1].lines.push('99 percent agreed.') }, 'a figure that was not cleared is refused')
hold((s) => { s.pages[3].lines = ['Screens cause poor sleep.'] }, 'causal wording is refused')
hold((s) => { s.pages[2].kicker = 'GDC 066' }, 'a GDC number on a page is refused')
hold((s) => { s.pages[2].lines = ['A study — a big one.'] }, 'a dash is refused')
hold((s) => { s.pages[1].lines = ['one two three four five six seven eight nine ten eleven twelve', 'thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty', 'twenty one twenty two twenty three'] }, 'a crowded page is refused')
hold((s) => { s.pages[0].lines = ['No highlight on the opening page.'] }, 'an opening page with no highlight is refused')
hold((s) => { delete s.pages[4].role }, 'a last page not marked practical is refused')
hold((s) => { s.pages[2].lines = ['==Two== highlights ==here=='] }, 'two highlights on one page are refused')
hold((s) => { s.source = '' }, 'a missing source line is refused')
console.log(failed ? `\n${failed} FAILED` : '\nall carousel gate cases pass')
process.exit(failed ? 1 : 0)
