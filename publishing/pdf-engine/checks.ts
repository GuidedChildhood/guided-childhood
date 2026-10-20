// THE PRINTED PAGE, MEASURED.
//
// This function runs INSIDE the browser, on the laid out issue, after fonts
// and pictures have loaded. It is the reason the engine uses fixed page boxes:
// every frame has a size, so "does the text fit" is a measurement, not a guess.
//
// It is passed to page.evaluate as a function, so it must be self contained:
// no imports, no closures over Node values.

export type LayoutFinding = { level: 'error' | 'warn'; page: number; rule: string; detail: string }

export function layoutChecks(opts: { safeMm: number; minBodyPt: number; minAnyPt: number; minDpi: number; warnDpi: number }): { pages: number; findings: LayoutFinding[]; images: { page: number; src: string; dpi: number }[]; qrs: string[] } {
  const PX_PER_MM = 96 / 25.4
  const findings: LayoutFinding[] = []
  const images: { page: number; src: string; dpi: number }[] = []
  const pages = Array.from(document.querySelectorAll<HTMLElement>('section.page'))

  const parse = (c: string): [number, number, number, number] | null => {
    const m = c.match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    const parts = m[1].split(/[ ,/]+/).filter(Boolean).map(Number)
    return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1]
  }
  const hexToRgb = (h: string): [number, number, number, number] => {
    const x = h.replace('#', '')
    return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16), 1]
  }
  const lum = ([r, g, b]: number[]) => {
    const f = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4) }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const ratio = (a: number[], b: number[]) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05) }
  const blend = (top: number[], under: number[]) => [0, 1, 2].map(i => top[i] * top[3] + under[i] * (1 - top[3]))

  // The background a piece of text sits on: the nearest ancestor that paints
  // one, or a data-bg an overlay declares because it sits on artwork.
  const bgOf = (el: Element): number[] | null => {
    let n: Element | null = el
    const layers: number[][] = []
    while (n && n !== document.documentElement) {
      const declared = (n as HTMLElement).dataset?.bg
      if (declared) return layers.reduceRight((under, top) => blend(top, under), hexToRgb(declared).slice(0, 3))
      const cs = getComputedStyle(n)
      if (cs.backgroundImage && cs.backgroundImage !== 'none' && !n.classList.contains('blueprint')) {
        if (/gradient/.test(cs.backgroundImage) && cs.backgroundColor) { /* fall through to the colour under it */ } else return null
      }
      const c = parse(cs.backgroundColor)
      if (c && c[3] > 0) {
        layers.push(c)
        if (c[3] >= 1) return layers.reduceRight((under, top) => blend(top, under), [255, 255, 255])
      }
      n = n.parentElement
    }
    return [255, 255, 255]
  }

  pages.forEach((page, i) => {
    const n = i + 1
    const trim = page.querySelector<HTMLElement>('.trim')!.getBoundingClientRect()
    const safe = opts.safeMm * PX_PER_MM
    const edge = 4 * PX_PER_MM // folio and running head may sit in the margin, never nearer the trim than 4mm

    // 1. FRAMES THAT OVERFLOW. A frame is any container the template marked as
    // holding text that must not be clipped, plus every page's safe area.
    page.querySelectorAll<HTMLElement>('.frame, .safe, .body, .bubble').forEach(el => {
      const over = el.scrollHeight - el.clientHeight
      const wide = el.scrollWidth - el.clientWidth
      if (over > 1 || wide > 1) findings.push({ level: 'error', page: n, rule: 'overflow', detail: `${el.className.split(' ')[0] || el.tagName} overflows by ${(Math.max(over, wide) / PX_PER_MM).toFixed(1)}mm: "${(el.textContent || '').trim().slice(0, 50)}"` })
    })

    // 1b. BLOCKS THAT COLLIDE. A frame can be the right size while the grid
    // around it spills under the next block, which is how page 3 of the first
    // proof hid two lines of the story under its activity box with every frame
    // measuring clean. So the blocks a reader sees as separate things must not
    // overlap each other unless one is inside the other.
    const blocks = Array.from(page.querySelectorAll<HTMLElement>('.frame, .card, .activity, .facts, .refs, .art, .bubble, .rsum, .body, h1, .standfirst'))
      .filter(el => !el.closest('[data-template="cover"]'))
    const rects = blocks.map(el => el.getBoundingClientRect())
    for (let a = 0; a < blocks.length; a++) for (let b = a + 1; b < blocks.length; b++) {
      if (blocks[a].contains(blocks[b]) || blocks[b].contains(blocks[a])) continue
      const A = rects[a], B = rects[b]
      const x = Math.min(A.right, B.right) - Math.max(A.left, B.left)
      const y = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top)
      if (x > PX_PER_MM && y > 0.6 * PX_PER_MM) findings.push({ level: 'error', page: n, rule: 'collision', detail: `"${(blocks[a].textContent || '').trim().slice(0, 30)}" overlaps "${(blocks[b].textContent || '').trim().slice(0, 30)}" by ${(y / PX_PER_MM).toFixed(1)}mm` })
    }

    // 2. TEXT INSIDE THE SAFE AREA, AND READABLE.
    const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT)
    const seen = new Set<Element>()
    let t: Node | null
    while ((t = walker.nextNode())) {
      if (!t.textContent || !t.textContent.trim()) continue
      const el = t.parentElement!
      if (seen.has(el) || el.closest('svg')) continue
      seen.add(el)
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('.sample-mark')) continue
      const r = document.createRange(); r.selectNodeContents(t)
      const box = r.getBoundingClientRect()
      if (box.width === 0) continue
      const inMargin = !!el.closest('.folio, .runhead')
      const limit = inMargin ? edge : safe - 0.5 * PX_PER_MM
      const outside = box.left < trim.left + limit || box.right > trim.right - limit || box.top < trim.top + (inMargin ? edge : 0) || box.bottom > trim.bottom - limit
      if (outside && !el.closest('[data-template="cover"]')) findings.push({ level: 'error', page: n, rule: 'safe-area', detail: `text outside the ${inMargin ? '4mm edge' : `${opts.safeMm}mm safe area`}: "${t.textContent.trim().slice(0, 40)}"` })
      if (box.left < trim.left + edge || box.right > trim.right - edge || box.bottom > trim.bottom - edge) findings.push({ level: 'error', page: n, rule: 'trim', detail: `text within 4mm of the trim: "${t.textContent.trim().slice(0, 40)}"` })

      const pt = parseFloat(cs.fontSize) * 0.75
      if (pt < opts.minAnyPt) findings.push({ level: 'error', page: n, rule: 'tiny-text', detail: `${pt.toFixed(1)}pt text: "${t.textContent.trim().slice(0, 40)}"` })
      if (el.closest('.body') && !el.closest('.refs, .cite, .sub') && pt < opts.minBodyPt) findings.push({ level: 'error', page: n, rule: 'body-size', detail: `body copy at ${pt.toFixed(1)}pt, the floor is ${opts.minBodyPt}pt` })

      // 3. CONTRAST, WCAG AA: 4.5 to 1, or 3 to 1 for large text.
      // Lettering drawn with an ink outline (the boho masthead) is read by its
      // outline, not its fill, so the fill colour is not the contrast that counts.
      const outlined = parseFloat((cs as unknown as Record<string, string>).webkitTextStrokeWidth || '0') > 0.5
      const fg = parse(cs.color)
      const bg = bgOf(el)
      if (fg && bg && !outlined) {
        const c = ratio(blend(fg, bg), bg)
        const large = pt >= 18 || (pt >= 14 && Number(cs.fontWeight) >= 700)
        const need = large ? 3 : 4.5
        if (c < need) findings.push({ level: 'error', page: n, rule: 'contrast', detail: `${c.toFixed(2)} to 1 (needs ${need}) for "${t.textContent.trim().slice(0, 40)}"` })
      }
    }

    // 4. PICTURES: loaded, and sharp enough for print.
    page.querySelectorAll<HTMLImageElement>('img').forEach(img => {
      if (!img.complete || img.naturalWidth === 0) { findings.push({ level: 'error', page: n, rule: 'image-missing', detail: img.src.slice(-60) }); return }
      if (/\.svg(\?|$)/.test(img.src)) return // vector art has no resolution to run out of
      const rect = img.getBoundingClientRect()
      // object-fit: contain draws the picture at the smaller of the two scales
      const scale = Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight)
      const drawnMm = (img.naturalWidth * scale) / PX_PER_MM
      const dpi = img.naturalWidth / (drawnMm / 25.4)
      images.push({ page: n, src: img.src.split('/').pop() || '', dpi: Math.round(dpi) })
      if (dpi < opts.minDpi) findings.push({ level: 'error', page: n, rule: 'image-resolution', detail: `${img.src.split('/').pop()} prints at ${Math.round(dpi)} dpi, under ${opts.minDpi}` })
      else if (dpi < opts.warnDpi) findings.push({ level: 'warn', page: n, rule: 'image-resolution', detail: `${img.src.split('/').pop()} prints at ${Math.round(dpi)} dpi` })
    })

    // 5. THE PAGE NUMBER ON THE PAGE IS THE PAGE IT IS.
    const folio = page.querySelector('.folio .num')
    if (folio && folio.textContent?.trim() !== String(n)) findings.push({ level: 'error', page: n, rule: 'page-number', detail: `folio says ${folio.textContent}, page is ${n}` })
    if (page.dataset.page !== String(n)) findings.push({ level: 'error', page: n, rule: 'page-number', detail: `section is data-page ${page.dataset.page}` })
  })

  const qrs = Array.from(document.querySelectorAll<HTMLElement>('[data-qr]')).map(e => e.dataset.qr || '')
  return { pages: pages.length, findings, images, qrs }
}
