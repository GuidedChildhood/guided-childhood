// Fills a printed page in the way a family would, for the real life listing
// photos only. Never part of a product file.
//
// Justin, 6 November 2026: "super real images and make the chart look great
// printed out, special that someone will buy". A blank chart on a fridge reads
// as a mockup; the same chart with a name on it, jobs written in and a week of
// stars coloured reads as a family using it. Every mark here is drawn on top
// of the real page render, so the page itself is still exactly what the buyer
// downloads.
//
//   fillInUse(sheet, { name, writes, rows, days })
//
// name    the child's name, written in the "belongs to" box or on a name line
// writes  words for the blank write in lines, in order
// days    how many day columns of stars are coloured (the week so far)
// Everything is deterministic (seeded), so a rebuild gives the same photo.
window.fillInUse = function fillInUse(sheet, opt = {}) {
  const o = { name: 'Maisie', writes: ['Feed Biscuit', 'Read for 10 mins', 'Shoes by the door', 'Water the plants', 'Pack my school bag'], days: 4, ...opt }
  let seed = 7
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  const NS = 'http://www.w3.org/2000/svg'
  const hand = (el, text, size, extra = '') => {
    const s = document.createElement('span')
    s.textContent = text
    s.style.cssText = `font-family:'InUseHand',cursive;font-size:${size};color:#2B3A67;line-height:1;white-space:nowrap;display:inline-block;transform:rotate(${(rnd() * 3 - 1.5).toFixed(2)}deg);${extra}`
    el.appendChild(s)
    return s
  }

  // A crayon grain for coloured in stars: turbulence knocked out of the fill,
  // so it reads as wax on paper, not a flat vector shape.
  if (!document.getElementById('crayon')) {
    const svg = document.createElementNS(NS, 'svg')
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.style.position = 'absolute'
    svg.innerHTML = '<filter id="crayon" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.55" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>'
    document.body.appendChild(svg)
  }

  // 1. The name.
  const belongs = [...sheet.querySelectorAll('.eyebrow')].find(e => /belongs to|my name|name:/i.test(e.textContent))
  if (belongs) {
    const box = belongs.parentElement
    box.style.position = 'relative'
    const n = hand(box, o.name, '26pt', 'position:absolute;left:6mm;bottom:1.2mm;')
    n.style.transform += ' translateY(1mm)'
  } else {
    // "My name is ____" as a heading: the name goes on its line.
    const h = [...sheet.querySelectorAll('h1, h2, .title')].find(e => /^\s*my name is/i.test(e.textContent))
    if (h) {
      h.style.position = 'relative'
      const r = h.getBoundingClientRect()
      const words = [...h.childNodes].find(c => c.nodeType === 3 && /name is/i.test(c.textContent))
      let left = r.width * 0.45
      if (words) { const rr = document.createRange(); rr.selectNodeContents(words); left = rr.getBoundingClientRect().right - r.left + 12 }
      hand(h, o.name, '30pt', `position:absolute;left:${left}px;bottom:4px;font-weight:400;`)
    } else {
      // A name line that is a fillable field ("____'s week").
      const f = sheet.querySelector('[data-field^="name"]')
      if (f && !f.textContent.trim()) { f.style.position = 'relative'; hand(f, o.name, '26pt', 'position:absolute;left:2mm;bottom:0.5mm;font-weight:400;') }
    }
  }

  // 2. Write in lines.
  let w = 0
  sheet.querySelectorAll('.writeline, .wr, .bl').forEach(line => {
    if (w >= o.writes.length) return
    line.style.position = 'relative'
    hand(line, o.writes[w++], '15pt', 'position:absolute;left:1mm;bottom:-0.6mm;')
  })

  // 2b. Blank number lines (a price in stars, stars saved): a number.
  // A blank line that is not beside "stars" or "minutes" is a name to write
  // (a treat on a blank tag), and takes the next of the writes.
  const nums = o.numbers || ['3', '8', '5', '12', '4', '20', '10', '25', '30', '6']
  let k = 0
  sheet.querySelectorAll('span.line').forEach(line => {
    if (line.textContent.trim()) return
    const isNum = /stars?|minutes/i.test(line.parentElement.textContent.replace(line.textContent, ''))
    if (isNum && k >= nums.length) return
    if (!isNum && w >= o.writes.length) return
    line.style.position = 'relative'
    if (isNum) hand(line, nums[k++], '15pt', 'position:absolute;left:50%;bottom:-0.4mm;transform:translateX(-50%);')
    else hand(line, o.writes[w++], '14pt', 'position:absolute;left:0.5mm;bottom:-0.4mm;')
  })

  // 2c. A short fillable blank beside "minutes" or "stars" takes a number.
  sheet.querySelectorAll('span.fl').forEach(f => {
    if (f.textContent.trim() || k >= nums.length || !/stars?|minutes/i.test(f.parentElement.textContent)) return
    f.style.position = 'relative'; f.style.display = 'inline-block'
    hand(f, o.minutes || '30', '14pt', 'position:absolute;left:50%;bottom:-0.4mm;transform:translateX(-50%);')
  })

  // 2d. A week of tick boxes (.wk .c, seven to a row): ticked for the days
  // done so far, with the odd one missed, as a real week is.
  const boxes = [...sheet.querySelectorAll('.wk .c')]
  const rowsOf = []
  for (const b of boxes) {
    const top = Math.round(b.getBoundingClientRect().top)
    let row = rowsOf.find(r => Math.abs(r.top - top) < 4)
    if (!row) rowsOf.push(row = { top, cells: [] })
    row.cells.push(b)
  }
  rowsOf.forEach(row => row.cells.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left).forEach((b, di) => {
    if (di >= o.days || rnd() < 0.14) return
    b.style.display = 'flex'; b.style.alignItems = 'center'; b.style.justifyContent = 'center'
    hand(b, '✓', '21pt', 'color:#2B3A67;')
  }))

  // 3. Stars coloured for the days done so far. A real week has gaps.
  // Rows are found by position, not markup: small icons (under 12mm) that
  // share a line seven or more at a time are a week of stars, read left to
  // right. A weekly total column (.tot) is left for the parent.
  const colour = svg => {
    // The outline's colour, from a path's own stroke when it sets one.
    const shape = svg.querySelector('path, polygon')
    const own = shape && shape.getAttribute('stroke')
    const c = getComputedStyle(own ? shape : svg)[own ? 'stroke' : 'color'].match(/\d+/g).map(Number)
    // An outline printed in near black would colour in black: use gold.
    const fill = (c[0] + c[1] + c[2] < 200) ? '#F2B705' : (own ? `rgb(${c.slice(0, 3)})` : 'currentColor')
    svg.style.fill = fill
    // A path that says fill="none" itself overrides the svg, so fill it too.
    svg.querySelectorAll('path, polygon').forEach(p => { if (p.getAttribute('fill') === 'none') p.style.fill = fill })
    svg.style.fillOpacity = '1'
    svg.style.filter = 'url(#crayon)'
    svg.style.transform = `rotate(${(rnd() * 16 - 8).toFixed(1)}deg) scale(${(1.02 + rnd() * 0.1).toFixed(2)})`
  }
  const mm = 96 / 25.4
  const icons = [...sheet.querySelectorAll('svg')].filter(s => {
    const r = s.getBoundingClientRect()
    return r.width > 2 * mm && r.width < 12 * mm && Math.abs(r.width - r.height) < 2 * mm && !s.closest('.tot')
  })
  const lines = []
  for (const s of icons) {
    const r = s.getBoundingClientRect(), cy = r.top + r.height / 2
    let line = lines.find(l => Math.abs(l.cy - cy) < 2 * mm)
    if (!line) lines.push(line = { cy, items: [] })
    line.items.push(s)
  }
  let ownSeen = 0
  lines.filter(l => l.items.length >= 7).sort((a, b) => a.cy - b.cy).forEach(l => {
    const tr = l.items[0].closest('tr')
    if (tr && tr.classList.contains('own') && ownSeen++ >= Math.min(2, o.writes.length)) return
    const bonus = tr && tr.classList.contains('bonus')
    l.items.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left).forEach((s, di) => {
      if (di >= o.days || rnd() < (bonus ? 0.55 : 0.18)) return
      colour(s)
    })
  })

  // 4. Totals in the total row, for the days coloured.
  sheet.querySelectorAll('tr.total').forEach(tr => {
    const cells = [...tr.querySelectorAll('td.cel')].filter(td => !td.classList.contains('tot'))
    cells.forEach((td, di) => {
      if (di >= o.days) return
      const table = tr.closest('table')
      const col = di + 2
      const count = [...table.querySelectorAll(`tbody tr:not(.total) td:nth-child(${col}) svg`)].filter(s => s.style.fill).length
      td.style.textAlign = 'center'
      hand(td, String(count), '17pt')
    })
  })

  // 5. A few ticks in tick boxes.
  sheet.querySelectorAll('.mtick').forEach(t => {
    if (rnd() < 0.55) return
    t.style.position = 'relative'
    hand(t, '✓', '15pt', 'position:absolute;left:-0.4mm;top:-2.6mm;color:#2B3A67;')
  })
}
