// Ask DiGi, the first three answer videos (2 October 2026).
//
// Justin: the video answers are for social, where parents can also comment the
// question they need help with. Each video takes one moment parents ask DiGi
// about, has DiGi (the star, never a person) give the line to say, word for
// word from a real script in the scripts table, then ends at the stage check.
// The silent UGC rules apply: no synthetic person, no dashes, no outcome
// claimed for a child, every line traceable to the product.
//
// One generator so the three share one visual world, the five o'clock fight
// look (cream, ink, butter, Nunito, GSAP). Run: node build.mjs, then in each
// folder: npx --yes hyperframes@0.8.82 render.

import { mkdirSync, writeFileSync, readFileSync, copyFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const fontsFrom = join(here, '../2026-10-01-five-oclock-fight/vertical/assets/fonts')

// The star, inline so its smile can move while DiGi talks.
const star = readFileSync(join(here, '../../public/digi-squad/DiGi-star.svg'), 'utf8')
  .replace(/^<svg[^>]*>/, '<svg viewBox="0 0 400 430" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">')
  .replace('<path d="M 183 248 Q 200 264 217 248"', '<path class="mouth" d="M 183 248 Q 200 264 217 248"')

// Each say line is the script's own say_this, quoted exactly or as a whole
// sentence run from it. The why is the script's why_it_works in fewer words,
// with nothing added.
const VIDEOS = [
  {
    slug: '01-morning-tv',
    script: 'The Morning TV Standoff (foundation, free)',
    eyebrow: 'ASK DIGI · AGES 4 TO 7',
    hook: 'Asked three times. The TV is still on.',
    sub: 'It is 7:45 and you are going to be late. Again.',
    say: 'I am going to turn this off now. I know that feels unfair. You can choose one show after school.',
    why: 'The fight is not about the TV. It is about the switch to what comes next.',
  },
  {
    slug: '02-mid-match',
    script: 'They cannot stop in the middle of a match (builder, free)',
    eyebrow: 'ASK DIGI · AGES 7 TO 10',
    hook: 'Fine to furious in four seconds.',
    sub: 'You said time is up. They are mid match.',
    say: 'I will give you the warning at the end, not in the middle. You tell me how long this one has left, and I will hold you to it.',
    why: 'Leaving mid match lets the whole team down. At this age that fear is real.',
  },
  {
    slug: '03-phone-in-bed',
    script: 'Refusing to come off their phone (shaper, free)',
    eyebrow: 'ASK DIGI · AGES 13 TO 16',
    hook: 'Midnight. The phone is still glowing.',
    sub: 'And every talk about it ends in a row.',
    say: 'I am not going to fight about the phone. But the bedroom rule stays. Phone charges outside the room tonight.',
    why: 'Hold one line, the bedroom. Everything else stays open to talk about.',
  },
]

const words = (text, cls) => text.split(/\s+/).map(w => `<span class="${cls}">${w}</span>`).join('\n')

function page(v) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1080, height=1920">
    <script src="assets/gsap.min.js"></script>
    <style>
      @font-face{font-family:nunito;src:url("assets/fonts/captured-nunito_latin_wght_normal-s.p.1wzrasd95pxo_.woff2")format("woff2");font-weight:200 1000;font-style:normal}
      @font-face{font-family:plexMono;src:url("assets/fonts/captured-ibm_plex_mono_latin_600_normal-s.p.30e0eqd5fxn92.woff2")format("woff2");font-weight:600;font-style:normal}
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1080px; height: 1920px; overflow: hidden; background: #000; }
      #root { position: relative; width: 1080px; height: 1920px; overflow: hidden; background: #FFFBEE; container-type: size; font-family: nunito, sans-serif; color: #1A1A2E; }
      .beat { position: absolute; inset: 0; opacity: 0; }
      .eyebrow { position: absolute; top: 6cqh; left: 0; right: 0; text-align: center; font-family: plexMono, monospace; font-weight: 600; font-size: 2.6cqw; letter-spacing: 0.14em; color: #52526A; }
      .headline { position: absolute; top: 30cqh; left: 7cqw; right: 7cqw; text-align: center; font-size: 8.4cqw; font-weight: 900; line-height: 1.2; }
      .sub { position: absolute; top: 56cqh; left: 9cqw; right: 9cqw; text-align: center; font-size: 4.6cqw; font-weight: 600; line-height: 1.3; color: #52526A; }
      .hw, .sw, .bw { display: inline-block; margin-right: 0; will-change: transform, opacity; }
      .underline { position: absolute; top: 52cqh; left: 30cqw; width: 40cqw; height: 0.9cqw; background: #EDC35F; border-radius: 6px; transform-origin: 0 50%; }
      .star { position: absolute; top: 9cqh; left: 50%; width: 34cqw; margin-left: -17cqw; }
      .star svg { width: 100%; height: auto; overflow: visible; }
      .name { position: absolute; top: 31cqh; left: 0; right: 0; text-align: center; font-weight: 900; font-size: 5cqw; }
      .bubble { position: absolute; top: 39cqh; left: 7cqw; right: 7cqw; background: #FFFFFF; border: 3px solid #1A1A2E; border-radius: 32px; box-shadow: 0 8px 0 #1A1A2E; padding: 4.5cqw 5cqw 5cqw; }
      .bubble::before { content: ''; position: absolute; top: -26px; left: 50%; margin-left: -22px; border: 22px solid transparent; border-bottom-color: #1A1A2E; border-top: 0; }
      .label { font-family: plexMono, monospace; font-weight: 600; font-size: 2.6cqw; letter-spacing: 0.14em; color: #52526A; margin-bottom: 2cqw; }
      .line { font-size: 5.6cqw; font-weight: 800; line-height: 1.3; }
      .why { position: absolute; top: 34cqh; left: 8cqw; right: 8cqw; text-align: center; font-size: 7cqw; font-weight: 900; line-height: 1.22; }
      .cta-h { position: absolute; top: 30cqh; left: 7cqw; right: 7cqw; text-align: center; font-size: 8.4cqw; font-weight: 900; line-height: 1.2; }
      .cta-s { position: absolute; top: 47cqh; left: 0; right: 0; text-align: center; font-size: 4.8cqw; font-weight: 600; color: #52526A; }
      .url { position: absolute; top: 58cqh; left: 50%; transform: translateX(-50%); white-space: nowrap; font-family: plexMono, monospace; font-weight: 600; font-size: 3.2cqw; letter-spacing: 0.06em; text-transform: uppercase; background: #EDC35F; padding: 1.4cqw 2.6cqw; border: 3px solid #1A1A2E; border-radius: 16px; box-shadow: 0 5px 0 #C99A28; }
      .comment { position: absolute; top: 74cqh; left: 10cqw; right: 10cqw; text-align: center; font-size: 4.4cqw; font-weight: 800; line-height: 1.3; }
      .mini { position: absolute; top: 66cqh; left: 50%; width: 12cqw; margin-left: -6cqw; }
      .mini svg { width: 100%; height: auto; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="19" data-width="1080" data-height="1920">

    <div id="beat-0" class="clip beat" data-start="0" data-duration="4.2" data-track-index="0">
      <div class="eyebrow">${v.eyebrow}</div>
      <div class="headline">${words(v.hook, 'hw')}</div>
      <div class="underline" id="ul0"></div>
      <div class="sub">${words(v.sub, 'sw')}</div>
    </div>

    <div id="beat-1" class="clip beat" data-start="4.2" data-duration="7.6" data-track-index="1">
      <div class="eyebrow">${v.eyebrow}</div>
      <div class="star" id="star">${star}</div>
      <div class="name">DiGi says</div>
      <div class="bubble" id="bubble">
        <div class="label">TRY SAYING</div>
        <div class="line">“${words(v.say, 'bw')}”</div>
      </div>
    </div>

    <div id="beat-2" class="clip beat" data-start="11.8" data-duration="3" data-track-index="0">
      <div class="eyebrow">WHY IT WORKS</div>
      <div class="why">${words(v.why, 'hw')}</div>
    </div>

    <div id="beat-3" class="clip beat" data-start="14.8" data-duration="4.2" data-track-index="1">
      <div class="cta-h">${words('What stage is your child?', 'hw')}</div>
      <div class="cta-s">Three questions, no sign up.</div>
      <div class="url">guidedchildhood.com/starter-pack</div>
      <div class="mini">${star.replace('class="mouth" ', '')}</div>
      <div class="comment">Stuck on a moment? Comment it below and DiGi will answer.</div>
    </div>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      var tl = window.__timelines["main"] = gsap.timeline({ paused: true });

      tl.fromTo("#beat-0", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0);
      tl.fromTo("#beat-0 .hw", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.08 }, 0.1);
      tl.fromTo("#ul0", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.out" }, 1.0);
      tl.fromTo("#beat-0 .sw", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.05 }, 1.3);
      tl.to("#beat-0", { opacity: 0, duration: 0.3, ease: "power2.in" }, 3.9);

      tl.fromTo("#beat-1", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 4.2);
      tl.fromTo("#star", { y: 120, scale: 0.6, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.8)" }, 4.25);
      tl.fromTo("#bubble", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 4.8);
      tl.fromTo("#beat-1 .bw", { opacity: 0.12 }, { opacity: 1, duration: 0.2, stagger: ${(5.4 / v.say.split(/\s+/).length).toFixed(3)} }, 5.0);
      tl.to("#beat-1 .mouth", { scaleY: 1.9, svgOrigin: "200 248", duration: 0.14, yoyo: true, repeat: 33, ease: "sine.inOut" }, 5.0);
      tl.to("#star", { y: -12, duration: 0.6, yoyo: true, repeat: 7, ease: "sine.inOut" }, 5.0);
      tl.to("#beat-1", { opacity: 0, duration: 0.3, ease: "power2.in" }, 11.5);

      tl.fromTo("#beat-2", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 11.8);
      tl.fromTo("#beat-2 .hw", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.06 }, 11.9);
      tl.to("#beat-2", { opacity: 0, duration: 0.3, ease: "power2.in" }, 14.5);

      tl.fromTo("#beat-3", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 14.8);
      tl.fromTo("#beat-3 .hw", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.07 }, 14.9);
      tl.fromTo("#beat-3 .cta-s, #beat-3 .url", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.15 }, 15.5);
      tl.fromTo("#beat-3 .mini, #beat-3 .comment", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.15 }, 16.2);
      tl.to({}, { duration: 19 }, 0);
    </script>
  </body>
</html>
`
}

for (const v of VIDEOS) {
  const dir = join(here, v.slug)
  mkdirSync(join(dir, 'assets/fonts'), { recursive: true })
  for (const f of readdirSync(fontsFrom)) copyFileSync(join(fontsFrom, f), join(dir, 'assets/fonts', f))
  // GSAP travels with the video: the render browser cannot always reach a CDN.
  copyFileSync(join(here, '../../node_modules/gsap/dist/gsap.min.js'), join(dir, 'assets/gsap.min.js'))
  writeFileSync(join(dir, 'index.html'), page(v))
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: `ask-digi-${v.slug}`, private: true, type: 'module', scripts: { check: 'npx --yes hyperframes@0.8.82 check', render: 'npx --yes hyperframes@0.8.82 render' } }, null, 2) + '\n')
  copyFileSync(join(here, '../2026-10-01-five-oclock-fight/vertical/hyperframes.json'), join(dir, 'hyperframes.json'))
  console.log('built', v.slug, '·', v.script)
}
