#!/usr/bin/env node
// Build an explainer draw composition from a brief.
// Usage: node build.mjs brief.json out-dir [--vertical]
// A beat is {headline, sub, icon, duration, accent}. The last beat is the stage check.
// Everything is one paused GSAP timeline; seek safe; no random, no CSS transitions.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [briefPath, outDir, ...flags] = process.argv.slice(2);
if (!briefPath || !outDir) { console.error('usage: build.mjs brief.json out-dir [--vertical]'); process.exit(1); }
const vertical = flags.includes('--vertical');
const brief = JSON.parse(fs.readFileSync(briefPath, 'utf8'));
const icons = JSON.parse(fs.readFileSync(path.join(here, 'icons.json'), 'utf8'));
const W = vertical ? 1080 : 1920, H = vertical ? 1920 : 1080;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const noDash = s => { if (/[–—]|(\s-\s)/.test(s)) throw new Error('dash in copy: ' + s); return s; };
const words = (s, cls) => noDash(s).split(/\s+/).map(w => `<span class="${cls}">${esc(w)}</span>`).join('\n');

let t = 0;
const beats = brief.beats.map((b, i) => {
  const start = t; const dur = b.duration ?? 4; t += dur;
  return { ...b, start, dur, i };
});
const total = Math.round(t * 100) / 100;

const beatHtml = beats.map(b => {
  const paths = (icons[b.icon] || icons.star).map((d, k) => `<path class="ink draw" id="b${b.i}-p${k}" d="${d}" />`).join('\n');
  const isCta = b.i === beats.length - 1;
  return `
    <div id="beat-${b.i}" class="clip beat${isCta ? ' cta' : ''}" data-start="${b.start}" data-duration="${b.dur}" data-track-index="${b.i % 2}">
      <div class="field"></div>
      <div class="eyebrow">${esc(brief.series || 'GUIDED CHILDHOOD')} · ${String(b.i + 1).padStart(2, '0')} OF ${String(beats.length).padStart(2, '0')}</div>
      <div class="icon-wrap"><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${paths}
        <g id="b${b.i}-pen" class="pen"><path d="M-6 6 L-2 -4 L14 -20 L20 -14 L4 2 Z" /><path d="M-2 -4 L4 2" /></g>
      </svg></div>
      <div class="headline">${words(b.headline, 'hw')}</div>
      ${b.sub ? `<div class="subline">${words(b.sub, 'sw')}</div>` : ''}
      ${isCta && brief.cta?.url ? `<div class="url">${esc(brief.cta.url)}</div>` : ''}
      <div class="underline" id="b${b.i}-ul"></div>
    </div>`;
}).join('\n');

const tlJs = beats.map(b => {
  const n = (icons[b.icon] || icons.star).length;
  const drawDur = Math.min(1.6, Math.max(0.9, b.dur * 0.35));
  const per = drawDur / n;
  const draws = Array.from({ length: n }, (_, k) =>
    `drawPath("#b${b.i}-p${k}", "#b${b.i}-pen", ${(b.start + 0.25 + k * per).toFixed(2)}, ${per.toFixed(2)});`).join('\n      ');
  return `
      tl.fromTo("#beat-${b.i}", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, ${b.start});
      tl.fromTo("#beat-${b.i} .hw", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.07 }, ${(b.start + 0.1).toFixed(2)});
      ${draws}
      tl.fromTo("#b${b.i}-ul", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.out" }, ${(b.start + 0.25 + drawDur).toFixed(2)});
      tl.fromTo("#beat-${b.i} .sw", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.04 }, ${(b.start + 0.45 + drawDur).toFixed(2)});
      ${b.i < beats.length - 1 ? `tl.to("#beat-${b.i}", { opacity: 0, duration: 0.3, ease: "power2.in" }, ${(b.start + b.dur - 0.3).toFixed(2)});` : ''}`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=${W}, height=${H}">
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js" crossorigin="anonymous"></script>
    <style>
      @font-face{font-family:nunito;src:url("assets/fonts/captured-nunito_latin_wght_normal-s.p.1wzrasd95pxo_.woff2")format("woff2");font-weight:200 1000;font-style:normal}
      @font-face{font-family:plexMono;src:url("assets/fonts/captured-ibm_plex_mono_latin_600_normal-s.p.30e0eqd5fxn92.woff2")format("woff2");font-weight:600;font-style:normal}
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #000; }
      #root { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; background: #FFFBEE; container-type: size; font-family: nunito, sans-serif; color: #1A1A2E; }
      .beat { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; }
      .field { position: absolute; inset: 0; background: #FFFBEE; }
      .eyebrow { position: absolute; top: ${vertical ? '6cqh' : '7cqh'}; left: 0; right: 0; text-align: center; font-family: plexMono, monospace; font-weight: 600; font-size: ${vertical ? '2.6cqw' : '1.1cqw'}; letter-spacing: 0.14em; text-transform: uppercase; color: #52526A; }
      .icon-wrap { position: absolute; ${vertical ? 'top: 14cqh; left: 50%; transform: translateX(-50%); width: 56cqw; height: 56cqw;' : 'top: 22cqh; left: 10cqw; width: 30cqw; height: 30cqw;'} }
      .icon-wrap svg { width: 100%; height: 100%; overflow: visible; }
      .ink { fill: none; stroke: #1A1A2E; stroke-width: 7; stroke-linecap: round; stroke-linejoin: round; }
      .pen path { fill: #EDC35F; stroke: #1A1A2E; stroke-width: 2.5; stroke-linejoin: round; }
      .pen { opacity: 0; }
      .headline { position: absolute; ${vertical ? 'top: 50cqh; left: 7cqw; right: 7cqw; text-align: center; font-size: 8.4cqw;' : 'top: 24cqh; left: 46cqw; right: 7cqw; font-size: 4.6cqw;'} font-weight: 900; line-height: 1.08; letter-spacing: 0.01em; color: #1A1A2E; }
      .hw, .sw { display: inline-block; margin-right: 0.3em; will-change: transform, opacity; }
      .subline { position: absolute; ${vertical ? 'top: 72cqh; left: 9cqw; right: 9cqw; text-align: center; font-size: 4.2cqw;' : 'top: 58cqh; left: 46cqw; right: 7cqw; font-size: 2.0cqw;'} font-weight: 600; line-height: 1.3; color: #52526A; }
      .underline { position: absolute; ${vertical ? 'top: 69cqh; left: 30cqw; width: 40cqw;' : 'top: 55cqh; left: 46cqw; width: 22cqw;'} height: 0.9cqw; background: #EDC35F; border-radius: 6px; transform-origin: 0 50%; }
      .cta .headline { ${vertical ? 'top: 50cqh;' : 'top: 30cqh;'} }
      .url { position: absolute; ${vertical ? 'top: 86cqh; left: 0; right: 0; text-align: center; font-size: 3.2cqw;' : 'top: 76cqh; left: 46cqw; font-size: 1.5cqw;'} font-family: plexMono, monospace; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #1A1A2E; background: #EDC35F; display: inline-block; padding: 0.7cqw 1.6cqw; border: 3px solid #1A1A2E; border-radius: 16px; box-shadow: 0 5px 0 #C99A28; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${W}" data-height="${H}">
${beatHtml}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      var tl = window.__timelines["main"] = gsap.timeline({ paused: true });
      function drawPath(sel, penSel, at, dur) {
        var el = document.querySelector(sel); var pen = document.querySelector(penSel);
        var len = el.getTotalLength();
        el.style.strokeDasharray = len; el.style.strokeDashoffset = len;
        var state = { p: 0 };
        tl.set(pen, { opacity: 1 }, at);
        tl.to(state, { p: 1, duration: dur, ease: "power1.inOut", onUpdate: function () {
          el.style.strokeDashoffset = len * (1 - state.p);
          var pt = el.getPointAtLength(len * state.p);
          pen.setAttribute("transform", "translate(" + pt.x + " " + pt.y + ")");
        } }, at);
        tl.set(pen, { opacity: 0 }, at + dur + 0.05);
      }
${tlJs}
      tl.to({}, { duration: ${total} }, 0);
    </script>
  </body>
</html>
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, vertical ? 'index-vertical.html' : 'index.html'), html);
if (!fs.existsSync(path.join(outDir, 'assets'))) fs.cpSync(path.join(here, 'assets'), path.join(outDir, 'assets'), { recursive: true });
for (const f of ['hyperframes.json', 'frame.md']) if (!fs.existsSync(path.join(outDir, f))) fs.copyFileSync(path.join(here, f), path.join(outDir, f));
fs.writeFileSync(path.join(outDir, 'package.json'), JSON.stringify({ name: path.basename(outDir), private: true, type: 'module', scripts: { check: 'npx --yes hyperframes@0.8.82 check', preview: 'npx --yes hyperframes@0.8.82 preview', render: 'npx --yes hyperframes@0.8.82 render' } }, null, 2));
console.log(`built ${vertical ? 'vertical' : 'landscape'} ${W}x${H}, ${beats.length} beats, ${total}s -> ${outDir}`);
