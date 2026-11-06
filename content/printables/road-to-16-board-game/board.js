// The Road to 16 board, drawn once in millimetres on a 420 by 592 sheet (two
// A4 sheets wide, two tall). print.html shows it as four A4 tiles through a
// viewBox each; board-a3.html shows the whole of it on one A3 page.
//
// 60 squares, ten to a row, snaking up from the bottom left. Five zones of
// twelve, one per Planet Friend, in the stage order of lib/content/stages.ts.
// The rows stay clear of the two seams (x 210 and y 296) so trimming the tile
// edges never cuts a square.
//
// Square kinds (the rules sheet in print.html says what each does):
//   gate    the start of a zone: the Friend and the ages
//   card    draw a choice card from your zone
//   job     an earning job: take the stars shown
//   family  a family job: help another player, no stars (migration 223)
//   rest    protected time: stars cannot be spent here (lib/quests/time-tiers.ts)
//   go      a plain square
//   finish  16
window.BOARD = (() => {
const Z = [
  { key: 'pebble', name: 'Pebble', ages: '4 to 7', col: '#EDC35F', soft: '#FBEED0', ink: '#7A5A0E' },
  { key: 'bloop', name: 'Bloop', ages: '8 to 10', col: '#2F8F6B', soft: '#E4F0D4', ink: '#3F5E1E' },
  { key: 'orbit', name: 'Orbit', ages: '11 to 12', col: '#2E6F8E', soft: '#DCEBF7', ink: '#1F4E6E' },
  { key: 'nova', name: 'Nova', ages: '13 to 15', col: '#7A5CC0', soft: '#ECE3F7', ink: '#4A2F73' },
  { key: 'cosmo', name: 'Cosmo', ages: '16', col: '#D4600A', soft: '#FBE4D0', ink: '#8F4A12' },
]
// The twelve squares of a zone, in order. Jobs and rest squares vary by zone.
const PATTERN = ['gate', 'go', 'card', 'job', 'go', 'rest', 'card', 'family', 'go', 'job', 'card', 'rest']
const JOBS = [
  [['tidy', 'Tidy your toys', 1], ['pet', 'Feed the pet', 1]],
  [['settable', 'Set the table', 2], ['socksmatch', 'Pair the socks', 1]],
  [['car2', 'Wash the car', 3], ['sweep', 'Sweep the floor', 2]],
  [['cook', 'Cook tea', 3], ['bin', 'Bins out', 2]],
  [['recycle', 'Sort the recycling', 2], ['dishes', 'Wash up', 2]],
]
const RESTS = [['sleep', 'Bedtime'], ['meal', 'Tea time'], ['school', 'School time'], ['breakfast', 'Breakfast'], ['sleep', 'Bedtime'], ['meal', 'Tea time'], ['school', 'School time'], ['sleep', 'Bedtime'], ['meal', 'Tea time'], ['sleep', 'Bedtime']]

const S = 34
const colX = i => (i < 5 ? 22 + i * 37 : 216 + (i-5) * 37)
const rowY = r => [495, 415, 335, 255, 175, 95][r]
const squares = []
let ri = 0
for (let n = 0; n < 60; n++) {
  const r = Math.floor(n / 10), c = n % 10
  const col = r % 2 === 0 ? c : 9-c
  const z = Math.floor(n / 12), k = n % 12
  let kind = PATTERN[k]
  if (n === 59) kind = 'finish'
  const sq = { n: n + 1, x: colX(col), y: rowY(r), z, kind }
  if (kind === 'job') sq.job = JOBS[z][k === 3 ? 0 : 1]
  if (kind === 'rest') sq.rest = RESTS[ri++]
  squares.push(sq)
}

const esc = s => s.replace(/&/g, '&amp;')
const icon = (key, x, y, w, fill) => window.ICONS(key, fill).replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${w}" `)
const label = (lines, x, y, size, fill = '#1A1A2E', weight = 900) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Nunito" font-weight="${weight}" font-size="${size}" fill="${fill}">${lines.map((l, i) => `<tspan x="${x}" dy="${i ? size * 1.12 : 0}">${esc(l)}</tspan>`).join('')}</text>`
const starPath = (cx, cy, r) => {
  const p = []
  for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; p.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + -rr * Math.sin(a)).toFixed(2)}`) }
  return `<polygon points="${p.join(' ')}" fill="#EDC35F" stroke="#1A1A2E" stroke-width="0.5" stroke-linejoin="round" class="fill"/>`
}

const square = sq => {
  const z = Z[sq.z], { x, y } = sq, cx = x + S / 2
  const num = `<text x="${x + 2.6}" y="${y + 4.6}" font-family="IBM Plex Mono" font-weight="600" font-size="3" fill="#8888A0">${sq.n}</text>`
  const box = (fill, extra = '') => `<rect x="${x}" y="${y}" width="${S}" height="${S}" rx="4" fill="${fill}" stroke="#1A1A2E" stroke-width="0.8" class="fill" ${extra}/>`
  switch (sq.kind) {
    case 'gate': return `${box(z.col)}<rect x="${x + 2}" y="${y + 2}" width="${S-4}" height="${S-4}" rx="3" fill="${z.soft}" class="fill"/>
      <image href="images/friends/${z.key}.png" x="${x + 5}" y="${y + 2}" width="24" height="24" class="colour-only"/>
      ${label([z.name], cx, y + 27.6, 3.6, z.ink)}${label([`Ages ${z.ages}`], cx, y + 31.4, 2.5, z.ink, 700)}${sq.n === 1 ? `<text x="${x + 2.6}" y="${y + 5}" font-family="IBM Plex Mono" font-weight="600" font-size="3" fill="${z.ink}">START</text>` : ''}`
    case 'card': return `${box('#fff')}${num}<rect x="${cx-6.5}" y="${y + 6}" width="13" height="17" rx="2" fill="${z.soft}" stroke="#1A1A2E" stroke-width="0.7" transform="rotate(-8 ${cx} ${y + 14})" class="fill"/>
      ${label(['?'], cx, y + 19.4, 11, z.ink)}${label(['Choice card'], cx, y + 29.4, 3)}`
    case 'job': return `${box(z.soft)}${num}${icon(sq.job[0], cx-7.5, y + 4.2, 15, '#fff')}${label([sq.job[1]], cx, y + 24.6, sq.job[1].length > 13 ? 2.6 : 3)}
      ${starPath(cx-3.2, y + 29.4, 2.5)}<text x="${cx + 0.5}" y="${y + 30.6}" font-family="Nunito" font-weight="900" font-size="3.4" fill="#1A1A2E">${sq.job[2]}</text>`
    case 'family': return `${box('#FDE8EC')}${num}${icon('hug', cx-7, y + 4.4, 14, '#fff')}${label(['Family job'], cx, y + 23.4, 3, '#B4455C')}${label(['Help a player', 'forward 2'], cx, y + 27.2, 2.4, '#1A1A2E', 700)}`
    case 'rest': return `<defs><pattern id="st${sq.n}" width="2.6" height="2.6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1.3" height="2.6" fill="#1A1A2E"/></pattern></defs>
      ${box('#fff')}<rect x="${x}" y="${y}" width="${S}" height="${S}" rx="4" fill="url(#st${sq.n})"/><rect x="${x + 2.6}" y="${y + 2.6}" width="${S-5.2}" height="${S-5.2}" rx="2.6" fill="#fff" stroke="#1A1A2E" stroke-width="0.5"/>
      ${icon(sq.rest[0], cx-6.5, y + 5, 13, '#EDEDF3')}${label([sq.rest[1]], cx, y + 23.2, 3)}${label(['Stars rest here'], cx, y + 27.4, 2.4, '#52526A', 700)}`
    case 'finish': return `${box(z.col)}<rect x="${x + 2}" y="${y + 2}" width="${S-4}" height="${S-4}" rx="3" fill="#FFF6DE" class="fill"/>
      <image href="images/friends/cosmo.png" x="${x + 9}" y="${y + 1.5}" width="16" height="16" class="colour-only"/>${label(['16'], cx, y + 26.5, 10, z.ink)}${label(['Ready'], cx, y + 31, 3, z.ink)}`
    default: return `${box('#fff')}${num}${starPath(cx, y + S / 2, 2.2).replace('#EDC35F', z.soft)}`
  }
}

// The gold road behind the squares, the brand's one signature device.
const road = () => {
  const pts = squares.map(s => [s.x + S / 2, s.y + S / 2])
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ')
  return `<path d="${d}" fill="none" stroke="#EDC35F" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" class="road"/>
    <path d="${d}" fill="none" stroke="#FFF6DE" stroke-width="1" stroke-dasharray="4 3.5" stroke-linecap="round"/>`
}

// The Friends in the gaps between rows, beside their own zone.
const friends = () => [
  ['pebble', 330, 540, 40], ['bloop', 300, 371, 34], ['orbit', 60, 291, 34], ['nova', 300, 211, 34], ['cosmo', 80, 131, 34],
].map(([k, x, y, w]) => `<image href="images/friends/${k}.png" x="${x}" y="${y}" width="${w}" height="${w}" class="colour-only"/>`).join('')

const content = () => `
  <rect x="0" y="0" width="420" height="592" fill="#F9F8F6" class="bg"/>
  <text x="22" y="42" font-family="IBM Plex Mono" font-weight="600" font-size="5" letter-spacing="1.6" fill="#C99A28">THE BOARD GAME · AGES 6 TO 12</text>
  <text x="22" y="66" font-family="Nunito" font-weight="900" font-size="22" fill="#1A1A2E">The Road to 16</text>
  <image href="images/DiGi-star-3d.png" x="330" y="18" width="62" height="62"/>
  <text x="292" y="74" text-anchor="end" font-family="Nunito" font-weight="700" font-size="5" fill="#52526A">Your host: DiGi</text>
  ${road()}${squares.map(square).join('')}${friends()}
  <text x="22" y="560" font-family="Nunito" font-weight="900" font-size="7" fill="#1A1A2E">Start at 4. Get to 16.</text>
  <text x="22" y="569" font-family="Nunito" font-weight="700" font-size="4.2" fill="#52526A">Jobs earn stars. Stripy squares: stars rest. Family jobs: no stars, just help.</text>`

return { content, squares, zones: Z }
})()
