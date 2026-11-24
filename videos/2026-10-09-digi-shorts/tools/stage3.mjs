// The stage shot (teacher film v3, 24 November 2026): real screens inside real
// objects. A shot with `stage: true` lays its captures inside a phone, a
// classroom board or a sheet of A4 paper, each with the schools home page's own
// three layer warm shadow (rgba(46,40,24,a), never black), a soft contact shadow
// and a quiet glass sheen. A camera frames the whole set (eased push, then a
// focus move to the proof line, then a hold), and the words sit on their own
// layer above a veil of the ground colour, so a zoomed screen never runs under a
// line being read. Spec: plans/2026-11-24-teacher-film-walkthrough-research.md
// ("Premium motion spec").
//
// build.mjs only loads this file when a cut has a stage shot, and only then adds
// STAGE_CSS, so every other cut builds byte for byte as before.
//
// Shot fields: bg ('cream' | 'teal'), enter ('rise' | 'fade' | 'none' | 'dissolve'),
// exit ('lift' | 'fade' | 'none'), cam [{t, dur, ease, s, fx, fy, px, py}],
// veil {h} or {w} (the ground fading over the top or left of the frame),
// objs [object], words [word], sfx.
// An object: {id, kind: 'phone' | 'board' | 'paper', x, y, w, h, z, rot,
//   enter {t, dur, ease, from}, moves [{t, dur, ease, ...gsap props}],
//   pages [{src, srcW, top, t, trans: 'slide' | 'fade', mask [y0, y1],
//           pans [{t, dur, ease, top}], glows [{x, y, w, h, t0, t1, kind}], taps [{x, y, t}]}]}
// Page coordinates (glows, taps, top, mask) are CSS px of the capture.

const SHADOW = {
  device: '0 2px 4px rgba(46,40,24,0.08), 0 24px 48px -20px rgba(46,40,24,0.28), 0 70px 120px -50px rgba(46,40,24,0.55)',
  paper: '0 1px 2px rgba(46,40,24,0.06), 0 30px 60px -34px rgba(46,40,24,0.42), 0 8px 18px -10px rgba(46,40,24,0.16)',
}

export const STAGE_CSS = `
/* Stage shots (tools/stage3.mjs): the schools home page tokens. */
.ground{background:#F9F8F6}
.shot.bg-cream{background:radial-gradient(60% 45% at 50% 46%,#FFFFFF 0%,#F9F8F6 60%,#F1EFEA 100%)}
.shot.bg-teal{background:linear-gradient(150deg,#2B5665 0%,#1E4652 55%,#173C46 100%)}
.s3move,.s3world{position:absolute;left:0;top:0;width:100%;height:100%}
.s3world{transform-origin:0 0;will-change:transform}
.s3words{position:absolute;inset:0;pointer-events:none}
.s3veil{position:absolute;left:0;top:0;pointer-events:none}
.o3wrap{position:absolute;transform-style:preserve-3d;will-change:transform}
.o3contact{position:absolute;left:8%;right:8%;bottom:-3.5%;height:9%;border-radius:50%;background:radial-gradient(closest-side,rgba(46,40,24,0.30),rgba(46,40,24,0.10) 60%,rgba(46,40,24,0));filter:blur(14px)}
.o3{position:absolute;left:0;top:0;width:100%;height:100%}
.o3.phone{background:linear-gradient(160deg,#2A2A40 0%,#1A1A2E 40%,#121222 100%);box-shadow:${SHADOW.device},inset 0 0 0 2px rgba(255,255,255,0.07)}
.o3.board{background:linear-gradient(170deg,#262640 0%,#1A1A2E 45%,#141426 100%);box-shadow:${SHADOW.device},inset 0 0 0 2px rgba(255,255,255,0.06)}
.o3.board::after{content:'';position:absolute;left:30%;right:30%;bottom:-10px;height:10px;border-radius:0 0 10px 10px;background:#121222;box-shadow:0 12px 20px -10px rgba(46,40,24,0.45)}
.o3.paper{background:#FFFFFF;box-shadow:${SHADOW.paper}}
.o3scr{position:absolute;overflow:hidden;background:#fff;isolation:isolate}
.o3.paper .o3scr{background:transparent}
.o3.phone .o3scr,.o3.board .o3scr{background:#F9F8F6}
.o3page{position:absolute;inset:0;overflow:hidden}
.o3in{position:absolute;left:0;top:0;transform-origin:0 0}
.o3in img{display:block;width:100%;height:auto}
.o3glass{position:absolute;inset:0;pointer-events:none;background:linear-gradient(118deg,rgba(255,255,255,0.10) 0%,rgba(255,255,255,0.02) 28%,rgba(255,255,255,0) 46%);mix-blend-mode:screen}
.o3.paper .o3glass{background:linear-gradient(170deg,rgba(255,255,255,0) 60%,rgba(46,40,24,0.025) 100%);mix-blend-mode:normal}
.g3{position:absolute;opacity:0}
.g3.glow{border-radius:10px;background:rgba(237,195,95,0.30);box-shadow:0 0 22px 8px rgba(237,195,95,0.30);mix-blend-mode:multiply}
.g3.under{border-radius:4px;background:#EDC35F;transform-origin:0 50%}
.t3{position:absolute;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(26,26,46,0.16);border:2px solid rgba(26,26,46,0.35);opacity:0}
.w3{position:absolute;opacity:0}
.w3-eye{font-family:plexMono,monospace;font-weight:600;font-size:30px;letter-spacing:.16em;text-transform:uppercase;color:#A57A12}
.on-teal .w3-eye{color:#EDC35F}
.w3-head{font-weight:900;font-size:76px;line-height:1.06;letter-spacing:-.035em;color:#1A1A2E}
.w3-head .ln{display:block}
.on-teal .w3-head{color:#FFFFFF}
.w3-pill{display:inline-block;background:rgba(255,255,255,0.97);color:#1A1A2E;border-radius:44px;padding:40px 50px;font-weight:800;font-size:80px;line-height:1.16;letter-spacing:-.02em;box-shadow:0 2px 4px rgba(10,30,36,0.12),0 40px 80px -30px rgba(5,20,26,0.55)}
.w3-pill .pw{opacity:0}
.w3-brand{display:inline-flex;align-items:center;gap:22px;font-weight:800;font-size:46px;letter-spacing:-.02em;color:rgba(255,250,240,0.95)}
.w3-brand .sch{color:#EDC35F}
.w3-chips{display:flex;gap:18px}
.w3-chips{font-size:40px}
.w3-chip{display:flex;align-items:center;gap:.35em;background:#FFFFFF;border:1.5px solid #EAEAF0;border-radius:100px;padding:.32em .7em .32em .32em;font-weight:800;font-size:inherit;color:#52526A;box-shadow:0 1px 2px rgba(46,40,24,0.05),0 18px 30px -22px rgba(46,40,24,0.4)}
.w3-chip .n{width:1.75em;height:1.75em;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#F1EFEA;color:#52526A;font-weight:900;font-size:.75em}
.w3-chip .on{position:absolute;inset:0;border-radius:100px;background:#EDC35F;box-shadow:0 5px 0 #C99A28;opacity:0}
.w3-chip{position:relative}
.w3-chip>span{position:relative}
.w3-end{display:flex;flex-direction:column;align-items:center;text-align:center}
.w3-end>*{opacity:0}
.w3-end .e-tag{font-weight:800;font-size:44px;line-height:1.2;color:rgba(255,250,240,0.86);margin-top:26px}
.w3-end .e-line{font-weight:900;font-size:92px;line-height:1.04;letter-spacing:-.035em;color:#FFFFFF;margin-top:54px;text-wrap:balance}
.w3-end .e-sub{font-weight:700;font-size:46px;line-height:1.25;color:rgba(255,250,240,0.9);margin-top:24px}
.w3-end .e-btn{margin-top:58px;background:#EDC35F;color:#1A1A2E;border-radius:16px;padding:28px 58px;font-weight:800;font-size:54px;box-shadow:0 5px 0 #C99A28,0 30px 50px -24px rgba(0,0,0,0.45)}
.w3-end .e-url{font-family:plexMono,monospace;font-weight:600;font-size:34px;letter-spacing:.04em;color:rgba(255,250,240,0.9);margin-top:36px}
.w3-end .e-slate{font-family:plexMono,monospace;font-weight:600;font-size:24px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,250,240,0.6);margin-top:40px}
.w3-digi{position:absolute;opacity:0}
.w3-digi img{width:100%;height:100%;display:block;filter:drop-shadow(0 30px 40px rgba(5,20,26,0.45))}
.w3-digi .halo{position:absolute;left:-30%;top:-30%;width:160%;height:160%;border-radius:50%;background:radial-gradient(closest-side,rgba(237,195,95,0.30),rgba(237,195,95,0))}
`

const PE = { out: 'power3.out', inout: 'power2.inOut' }
const ease = (e, d) => PE[e] || e || d

export function stageShot(sh, X) {
  const { id, s, d, e, last, W, H, fromTo, to, set, SFX, esc, logo } = X
  const bg = sh.bg || 'cream'
  let html = `<div id="${id}" class="shot bg-${bg}${bg === 'teal' ? ' on-teal' : ''}"><div id="${id}-move" class="s3move"><div id="${id}-world" class="s3world">`

  // ── Objects ──
  for (const o of sh.objs || []) {
    const oid = `${id}-${o.id}`
    const kind = o.kind
    const w = o.w, h = o.h
    const b = kind === 'phone' ? Math.round(w * 0.046) : kind === 'board' ? Math.round(w * 0.023) : 0
    const R = kind === 'phone' ? Math.round(w * 0.16) : kind === 'board' ? Math.round(w * 0.03) : 6
    const r = kind === 'phone' ? R - b : kind === 'board' ? Math.max(6, R - b) : 2
    const pad = kind === 'paper' ? (o.pad ?? Math.round(w * 0.045)) : 0
    const OW = kind === 'paper' ? w : w + b * 2
    const OH = kind === 'paper' ? (o.ph ?? Math.round(w * 1.414)) : h + b * 2
    const sw = kind === 'paper' ? w - pad * 2 : w
    const shh = kind === 'paper' ? OH - pad * 2 : h
    html += `<div id="${oid}" class="o3wrap" style="left:${o.x}px;top:${o.y}px;width:${OW}px;height:${OH}px;z-index:${o.z ?? 1}">` +
      `<div class="o3contact"></div><div class="o3 ${kind}" style="border-radius:${R}px">` +
      `<div class="o3scr" style="left:${b + pad}px;top:${b + pad}px;width:${sw}px;height:${shh}px;border-radius:${r}px">`
    for (const [k, pg] of (o.pages || []).entries()) {
      const sc = sw / pg.srcW
      const mask = pg.mask ? `-webkit-mask-image:linear-gradient(to bottom,#000 ${pg.mask[0]}px,transparent ${pg.mask[1]}px);mask-image:linear-gradient(to bottom,#000 ${pg.mask[0]}px,transparent ${pg.mask[1]}px);` : ''
      html += `<div id="${oid}-p${k}" class="o3page"><div id="${oid}-p${k}-in" class="o3in" style="width:${pg.srcW}px;${mask}"><img src="assets/${pg.src}" alt="">` +
        (pg.glows || []).map((g, j) => `<div id="${oid}-p${k}-g${j}" class="g3 ${g.kind || 'glow'}" style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px"></div>`).join('') +
        (pg.taps || []).map((t, j) => `<div id="${oid}-p${k}-t${j}" class="t3" style="left:${t.x}px;top:${t.y}px"></div>`).join('') +
        `</div></div>`
      set(`#${oid}-p${k}-in`, { scale: sc, y: -(pg.top || 0) * sc, transformOrigin: '0 0' }, s)
      // Page changes inside the same frame: a slide (the next step) or a cross fade.
      if (k === 0) set(`#${oid}-p${k}`, { xPercent: 0, opacity: 1 }, s)
      else {
        const T = s + pg.t, dur = pg.dur ?? 0.38
        if ((pg.trans || 'slide') === 'slide') {
          set(`#${oid}-p${k}`, { xPercent: 100, opacity: 1 }, s)
          to(`#${oid}-p${k}`, { xPercent: 0, duration: dur, ease: 'power3.inOut' }, T)
          to(`#${oid}-p${k - 1}`, { xPercent: -30, opacity: 0.0, duration: dur, ease: 'power3.inOut' }, T)
        } else {
          set(`#${oid}-p${k}`, { xPercent: 0, opacity: 0 }, s)
          to(`#${oid}-p${k}`, { opacity: 1, duration: dur, ease: 'power1.inOut' }, T)
        }
      }
      for (const pn of pg.pans || []) to(`#${oid}-p${k}-in`, { y: -pn.top * sc, duration: pn.dur ?? 1.2, ease: ease(pn.ease, 'power2.inOut') }, s + pn.t)
      for (const [j, g] of (pg.glows || []).entries()) {
        const sel = `#${oid}-p${k}-g${j}`
        if ((g.kind || 'glow') === 'under') fromTo(sel, { scaleX: 0, opacity: 1 }, { scaleX: 1, opacity: 1, duration: 0.55, ease: 'power3.inOut' }, s + g.t0)
        else fromTo(sel, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, s + g.t0)
        if (g.t1 != null) to(sel, { opacity: 0, duration: 0.3 }, s + g.t1)
      }
      for (const [j, t] of (pg.taps || []).entries()) {
        fromTo(`#${oid}-p${k}-t${j}`, { scale: 0.3, opacity: 0.9 }, { scale: 1.9, opacity: 0, duration: 0.45, ease: 'power2.out', immediateRender: false }, s + t.t)
        SFX.push({ name: 'sfx-tap', at: s + t.t, vol: t.vol ?? 0.45 })
      }
    }
    html += `</div><div class="o3glass" style="border-radius:${R}px"></div></div></div>`
    // Object motion: the entry (rise with a 2 degree tilt that settles, or a drop for paper), then moves.
    const base = { x: 0, y: 0, rotation: o.rot || 0, rotationX: 0, scale: 1, opacity: 1, transformPerspective: 2400, transformOrigin: '50% 50%' }
    if (o.enter) {
      set(`#${oid}`, { ...base, ...o.enter.from }, s)
      to(`#${oid}`, { x: 0, y: 0, rotation: o.rot || 0, rotationX: 0, scale: 1, opacity: 1, duration: o.enter.dur ?? 0.9, ease: ease(o.enter.ease, 'power3.out') }, s + (o.enter.t || 0))
    } else set(`#${oid}`, base, s)
    for (const m of o.moves || []) { const { t, dur, ease: me, ...props } = m; to(`#${oid}`, { ...props, duration: dur ?? 0.8, ease: ease(me, 'power3.out') }, s + t) }
  }
  html += `</div></div>`

  // ── Veil: the ground over the top (or left) of the frame, under the words ──
  if (sh.veil) {
    const c = bg === 'teal' ? '23,60,70' : '249,248,246'
    const st = sh.veil.h
      ? `width:${W}px;height:${sh.veil.h}px;background:linear-gradient(to bottom,rgba(${c},1) 0%,rgba(${c},0.97) ${sh.veil.solid ?? 72}%,rgba(${c},0) 100%)`
      : `width:${sh.veil.w}px;height:${H}px;background:linear-gradient(to right,rgba(${c},1) 0%,rgba(${c},0.97) ${sh.veil.solid ?? 72}%,rgba(${c},0) 100%)`
    html += `<div id="${id}-veil" class="s3veil" style="${st}"></div>`
    set(`#${id}-veil`, { opacity: sh.veil.o0 ?? 1 }, s)
    for (const v of sh.veil.keys || []) to(`#${id}-veil`, { opacity: v.o, duration: v.dur ?? 0.6, ease: 'power1.inOut' }, s + v.t)
  }

  // ── Words ──
  html += `<div id="${id}-words" class="s3words">`
  for (const [j, wd] of (sh.words || []).entries()) {
    const sel = `${id}-w${j}`
    const pos = `left:${wd.x ?? 90}px;top:${wd.y}px;width:${wd.w ?? W - 180}px;text-align:${wd.align || 'center'}`
    const t0 = s + (wd.t0 || 0)
    if (wd.kind === 'eyebrow') {
      html += `<div id="${sel}" class="w3 w3-eye" style="${pos}">${esc(wd.text)}</div>`
      fromTo(`#${sel}`, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, t0)
    } else if (wd.kind === 'head') {
      html += `<div id="${sel}" class="w3 w3-head" style="${pos}${wd.size ? `;font-size:${wd.size}px` : ''}">${wd.lines.map((l, k) => `<span class="ln" id="${sel}-l${k}">${esc(l)}</span>`).join('')}</div>`
      set(`#${sel}`, { opacity: 1 }, t0)
      wd.lines.forEach((_, k) => fromTo(`#${sel}-l${k}`, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, t0 + k * (wd.stagger ?? 0.09)))
    } else if (wd.kind === 'pill') {
      const words = esc(wd.text).split(' ')
      html += `<div id="${sel}" class="w3" style="${pos}"><span class="w3-pill" style="text-align:left">${words.map((w, k) => k < (wd.typedFrom || 0) ? w : `<span class="pw">${w}</span>`).join(' ')}</span></div>`
      if (wd.instant) set(`#${sel}`, { opacity: 1 }, t0)
      else fromTo(`#${sel}`, { opacity: 0, y: 16, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }, t0)
      fromTo(`#${sel} .pw`, { opacity: 0 }, { opacity: 1, duration: 0.14, stagger: wd.typed ?? 0.13, ease: 'none' }, t0 + (wd.typeAt ?? 0.15))
    } else if (wd.kind === 'brand') {
      html += `<div id="${sel}" class="w3" style="${pos}"><span class="w3-brand">${logo(wd.size || 64, 0)}<span>Guided Childhood <span class="sch">Schools</span></span></span></div>`
      fromTo(`#${sel}`, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, t0)
    } else if (wd.kind === 'chips') {
      html += `<div id="${sel}" class="w3" style="${pos}"><div class="w3-chips" style="justify-content:${wd.align === 'left' ? 'flex-start' : 'center'}${wd.stack ? `;flex-direction:column;align-items:${wd.align === 'left' ? 'flex-start' : 'center'}` : ''}${wd.size ? `;font-size:${wd.size}px` : ''}">${wd.items.map((c, k) => `<div class="w3-chip" id="${sel}-c${k}"><i class="on" id="${sel}-c${k}-on"></i><span class="n">${esc(c.n)}</span><span>${esc(c.text)}</span></div>`).join('')}</div></div>`
      set(`#${sel}`, { opacity: 1 }, t0)
      wd.items.forEach((c, k) => {
        fromTo(`#${sel}-c${k}`, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, t0 + k * 0.08)
        fromTo(`#${sel}-c${k}-on`, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' }, s + c.at)
        to(`#${sel}-c${k}`, { color: '#1A1A2E', duration: 0.3 }, s + c.at)
        fromTo(`#${sel}-c${k}`, { scale: 1 }, { scale: 1.06, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, s + c.at)
      })
    } else if (wd.kind === 'digi') {
      html += `<div id="${sel}" class="w3-digi" style="left:${wd.x}px;top:${wd.y}px;width:${wd.size}px;height:${Math.round(wd.size * 430 / 400)}px"><div class="halo"></div><img src="assets/digi/DiGi-star.svg" alt=""></div>`
      fromTo(`#${sel}`, { opacity: 0, y: 30, scale: 0.86 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.5)' }, t0)
      // A slow float while the card holds.
      to(`#${sel}`, { y: -12, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: Math.max(0, Math.floor((d - (wd.t0 || 0) - 0.8) / 1.6) - 1) }, t0 + 0.8)
    } else if (wd.kind === 'end') {
      const kids = [
        wd.brand ? `<div class="e-brand"><span class="w3-brand">${logo(58, 0)}<span>Guided Childhood <span class="sch">Schools</span></span></span></div>` : '',
        wd.tagline ? `<div class="e-tag">${esc(wd.tagline)}</div>` : '',
        `<div class="e-line">${esc(wd.line)}</div>`,
        `<div class="e-sub">${esc(wd.sub)}</div>`,
        `<div class="e-btn" id="${sel}-btn">${esc(wd.button)}</div>`,
        `<div class="e-url">${esc(wd.url)}</div>`,
        wd.slate ? `<div class="e-slate">${esc(wd.slate)}</div>` : '',
      ].filter(Boolean)
      html += `<div id="${sel}" class="w3 w3-end" style="${pos}${wd.align === 'left' ? ';align-items:flex-start' : ''}">${kids.join('')}</div>`
      set(`#${sel}`, { opacity: 1 }, t0)
      kids.forEach((_, k) => fromTo(`#${sel} > :nth-child(${k + 1})`, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, t0 + k * (wd.stagger ?? 0.12)))
      const bi = kids.findIndex((x) => x.includes('e-btn'))
      fromTo(`#${sel}-btn`, { scale: 0.9 }, { scale: 1, duration: 0.55, ease: 'back.out(2.2)', immediateRender: false }, t0 + bi * (wd.stagger ?? 0.12))
      if (wd.pressAt != null) to(`#${sel}-btn`, { y: 3, boxShadow: '0 2px 0 #C99A28,0 20px 40px -24px rgba(0,0,0,0.45)', duration: 0.1, yoyo: true, repeat: 1 }, s + wd.pressAt)
    }
    if (wd.t1 != null) to(`#${sel}`, { opacity: 0, y: -8, duration: 0.3 }, s + wd.t1 - 0.3)
  }
  html += `</div></div>\n`

  // ── Camera ──
  const cam = sh.cam || [{ t: 0, s: 1, fx: W / 2, fy: H / 2 }]
  const xy = (k) => ({ x: (k.px ?? k.fx) - k.fx * k.s, y: (k.py ?? k.fy) - k.fy * k.s, scale: k.s })
  set(`#${id}-world`, { ...xy(cam[0]), transformOrigin: '0 0' }, s)
  for (const k of cam.slice(1)) to(`#${id}-world`, { ...xy(k), duration: k.dur ?? 0.9, ease: ease(k.ease, 'power2.inOut') }, s + k.t)
  // The words drift a few pixels while the shot holds: the parallax layer.
  if (sh.drift !== 0) fromTo(`#${id}-words`, { y: 0 }, { y: -(sh.drift ?? 8), duration: d, ease: 'sine.inOut' }, s)

  // ── In and out ──
  const enter = sh.enter || 'rise'
  set(`#${id}`, { opacity: enter === 'dissolve' ? 0 : 1 }, s)
  if (enter === 'dissolve') to(`#${id}`, { opacity: 1, duration: sh.enterDur ?? 0.5, ease: 'power1.inOut' }, s)
  if (enter === 'rise') { fromTo(`#${id}-move`, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, s) }
  else if (enter === 'fade') fromTo(`#${id}-move`, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power1.out' }, s)
  else set(`#${id}-move`, { y: 0, opacity: 1 }, s)
  if (!last) {
    const exit = sh.exit || 'lift'
    if (exit === 'lift') to(`#${id}-move`, { y: -60, opacity: 0, duration: 0.35, ease: 'power2.in' }, e - 0.35)
    else if (exit === 'fade') to(`#${id}-move`, { opacity: 0, duration: 0.3, ease: 'power1.in' }, e - 0.3)
    if (!sh.keepWords) to(`#${id}-words`, { opacity: 0, duration: 0.28, ease: 'power1.in' }, e - 0.3)
    set(`#${id}`, { opacity: 0 }, e)
  }
  for (const f of sh.sfx || []) SFX.push({ name: f.name, at: s + f.at, vol: f.vol ?? 0.5 })
  return html
}
