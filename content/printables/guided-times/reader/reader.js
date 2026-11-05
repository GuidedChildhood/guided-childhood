// THE GUIDED TIMES, the page turning reader (5 November 2026).
//
// The printed pages (#pages, drawn by paper.js at build time) become a book:
// on a computer or a tablet held sideways, two page spreads that turn on the
// spine with the front page alone on the right, like a real paper; on a phone
// held upright, one page at a time that turns away to show the next. Swipe,
// tap the edges, use the arrow keys or the buttons. Double tap zooms in, and a
// zoomed page scrolls like any web page, because a whole newspaper page on a
// phone is too small to read without it.
//
// No network, no storage it depends on: the last page read is remembered in
// localStorage when the browser allows it and forgotten when it does not.
(() => {
  const W = 740, H = 1000
  document.documentElement.classList.add('js')
  const src = [...document.querySelectorAll('#pages > .gt-page')]
  const N = src.length
  const stage = document.getElementById('stage')
  const book = document.getElementById('book')
  const where = document.getElementById('where')
  const prevB = document.getElementById('prev'), nextB = document.getElementById('next')
  const zoomB = document.getElementById('zoom')
  let spread = false, cur = 0, leaves = [], zoom = 1, timer = null

  const KEY = 'guided-times-' + document.title
  const store = { get() { try { return +localStorage.getItem(KEY) || 1 } catch { return 1 } }, set(v) { try { localStorage.setItem(KEY, String(v)) } catch { /* private mode */ } } }

  const div = (cls, child) => { const d = document.createElement('div'); d.className = cls; if (child) d.appendChild(child); return d }
  const clone = i => {
    if (i < 0 || i >= N) return div('blank')
    const c = src[i].cloneNode(true); c.removeAttribute('id'); return c
  }
  const wantSpread = () => innerWidth > innerHeight * 1.05 && innerWidth >= 760

  function build(page) {
    spread = wantSpread()
    book.innerHTML = ''
    book.className = spread ? 'spread' : 'single'
    leaves = []
    const count = spread ? Math.ceil(N / 2) : N
    for (let k = 0; k < count; k++) {
      const front = div('face front', clone(spread ? 2 * k : k))
      const back = div('face back', spread ? clone(2 * k + 1) : div('blank'))
      const leaf = div('leaf'); leaf.append(front, back)
      book.appendChild(leaf); leaves.push(leaf)
    }
    fit()
    cur = toCur(page); show(false)
  }

  function fit() {
    const pad = innerWidth < 640 ? 10 : 24
    const avW = innerWidth - pad * 2 - (innerWidth < 640 ? 0 : 120), avH = innerHeight - 52 - pad * 2 - (innerWidth < 640 ? 64 : 0)
    const base = Math.min(avW / (spread ? W * 2 : W), avH / H)
    const s = base * zoom
    book.style.setProperty('--s', s)
    book.style.width = (spread ? W * 2 : W) * s + 'px'
    book.style.height = H * s + 'px'
  }

  const toCur = p => spread ? Math.floor(p / 2) : p - 1
  const maxCur = () => spread ? leaves.length : leaves.length - 1
  const firstPage = () => spread ? (cur === 0 ? 1 : Math.min(2 * cur, N)) : cur + 1

  function show(anim = true) {
    if (!anim) book.classList.add('still')
    leaves.forEach((l, k) => {
      l.classList.toggle('turned', k < cur)
      l.style.zIndex = k < cur ? k + 1 : leaves.length - k
    })
    if (!anim) { void book.offsetWidth; book.classList.remove('still') }
    book.classList.toggle('at-front', spread && cur === 0)
    book.classList.toggle('at-back', spread && cur === leaves.length)
    const a = firstPage()
    const pair = spread && cur > 0 && cur < leaves.length && a + 1 <= N
    where.textContent = pair ? `Pages ${a} and ${a + 1} of ${N}` : `Page ${a} of ${N}`
    prevB.disabled = cur === 0
    nextB.disabled = cur === maxCur()
    store.set(a)
    // Only the pages on show are read out by a screen reader.
    leaves.forEach((l, k) => {
      const showing = spread ? (k === cur || k === cur - 1) : k === cur
      l.setAttribute('aria-hidden', showing ? 'false' : 'true')
    })
  }

  function go(d) {
    const next = Math.max(0, Math.min(maxCur(), cur + d))
    if (next === cur) return
    const moving = d > 0 ? leaves[cur] : leaves[next]
    moving.style.zIndex = 999
    moving.classList.add('turning')
    setTimeout(() => moving.classList.remove('turning'), 760)
    cur = next
    show(true)
    moving.style.zIndex = 999
    clearTimeout(timer)
    timer = setTimeout(() => show(false), 780)
  }
  function goPage(p) { if (zoom > 1) setZoom(1); cur = Math.max(0, Math.min(maxCur(), toCur(p))); show(true) }
  window.guidedTimes = { go, goPage }

  function setZoom(z) {
    zoom = z
    stage.classList.toggle('zoomed', z > 1)
    zoomB.setAttribute('aria-pressed', String(z > 1))
    zoomB.textContent = z > 1 ? 'Fit' : 'Zoom'
    fit()
  }
  const toggleZoom = (x, y) => {
    if (zoom > 1) return setZoom(1)
    const r = book.getBoundingClientRect(), fx = (x - r.left) / r.width, fy = (y - r.top) / r.height
    setZoom(spread ? 1.8 : 2.2)
    const nr = book.getBoundingClientRect()
    stage.scrollLeft = Math.max(0, fx * nr.width - stage.clientWidth / 2)
    stage.scrollTop = Math.max(0, fy * nr.height - stage.clientHeight / 2)
  }

  // Buttons, keys, the contents.
  prevB.onclick = () => go(-1)
  nextB.onclick = () => go(1)
  zoomB.onclick = () => toggleZoom(innerWidth / 2, innerHeight / 2)
  addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('dialog')) return
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && zoom === 1)) { e.preventDefault(); go(1) }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1) }
    if (e.key === 'Home') goPage(1)
    if (e.key === 'End') goPage(N)
    if (e.key === 'Escape' && zoom > 1) setZoom(1)
  })
  const toc = document.getElementById('toc')
  const items = [[1, 'The front page'], ...[...src[0].querySelectorAll('[data-goto]')].map(a => [+a.dataset.goto, a.textContent.replace(/^\s*\d+\s*/, '').trim()])]
  toc.innerHTML = `<h2>Inside this issue</h2><ol>${items.map(([n, t]) => `<li><button type="button" data-page="${n}"><b>${n}</b>${t}</button></li>`).join('')}</ol><button type="button" data-close>Close</button>`
  toc.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return
    if (b.dataset.page) goPage(+b.dataset.page)
    toc.close()
  })
  document.getElementById('contents').onclick = () => (toc.showModal ? toc.showModal() : toc.setAttribute('open', ''))

  // Swipe, tap the edges, double tap to zoom, tap a page number on the front.
  let down = null, lastTap = 0, tapTimer = null
  stage.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: Date.now() } })
  stage.addEventListener('pointerup', e => {
    if (!down) return
    const dx = e.clientX - down.x, dy = e.clientY - down.y; down = null
    const link = e.target.closest && e.target.closest('[data-goto]')
    if (zoom === 1 && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) { go(dx < 0 ? 1 : -1); return }
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) return
    const now = Date.now()
    if (now - lastTap < 320) { clearTimeout(tapTimer); lastTap = 0; toggleZoom(e.clientX, e.clientY); return }
    lastTap = now
    const x = e.clientX
    tapTimer = setTimeout(() => {
      if (link) return goPage(+link.dataset.goto)
      if (zoom > 1) return
      if (x > innerWidth * 0.7) go(1)
      else if (x < innerWidth * 0.3) go(-1)
    }, 330)
  })
  stage.addEventListener('click', e => { if (e.target.closest && e.target.closest('a')) e.preventDefault() })
  stage.addEventListener('dblclick', e => e.preventDefault())

  // First visit: say how it works, then get out of the way.
  const hint = document.getElementById('hint')
  let seen = false; try { seen = localStorage.getItem('guided-times-hint') === '1' } catch { /* fine */ }
  if (!seen) {
    hint.hidden = false
    const hide = () => { hint.hidden = true; try { localStorage.setItem('guided-times-hint', '1') } catch { /* fine */ } }
    setTimeout(hide, 5000); stage.addEventListener('pointerdown', hide, { once: true })
  }

  addEventListener('resize', () => {
    const page = firstPage()
    if (wantSpread() !== spread) build(page); else fit()
  })
  stage.removeAttribute('aria-hidden')
  build(Math.min(N, Math.max(1, store.get())))
})()
