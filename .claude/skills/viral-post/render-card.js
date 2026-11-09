// Render research card HTML files to 1080 by 1350 PNGs with the real fonts.
// Google Fonts is blocked in the build container, which is why GDC-046 first
// rendered in Georgia. This embeds the woff2 files in ./fonts (SIL Open Font
// License, from @fontsource) and refuses to write a card whose fonts did not load.
//
//   node .claude/skills/viral-post/render-card.js in.html out.png [in2.html out2.png ...]
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const FONTS = path.join(__dirname, 'fonts');
const faces = [
  ['Playfair Display', 'playfair-display', [['500', 'normal'], ['700', 'normal'], ['800', 'normal'], ['500', 'italic']]],
  ['Source Serif 4', 'source-serif-4', [['400', 'normal'], ['600', 'normal'], ['400', 'italic']]],
];
let css = '';
for (const [family, slug, weights] of faces) for (const [w, s] of weights) {
  const b64 = fs.readFileSync(path.join(FONTS, `${slug}-latin-${w}-${s}.woff2`)).toString('base64');
  css += `@font-face{font-family:"${family}";font-weight:${w};font-style:${s};src:url(data:font/woff2;base64,${b64}) format("woff2");}\n`;
}
(async () => {
  const args = process.argv.slice(2);
  if (!args.length || args.length % 2) { console.error('usage: render-card.js in.html out.png [...]'); process.exit(1); }
  const browser = await chromium.launch();
  for (let i = 0; i < args.length; i += 2) {
    const html = fs.readFileSync(args[i], 'utf8')
      .replace(/<link[^>]*fonts\.g[^>]*>/g, '')
      .replace('<style>', `<style>${css}`);
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const loaded = await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family));
    if (!loaded.some(f => f.includes('Playfair')) || !loaded.some(f => f.includes('Source Serif'))) {
      console.error(`${args[i]}: fonts did not load (${loaded.join(', ') || 'none'}), not writing`); process.exitCode = 1; continue;
    }
    const [scroll, client] = await page.evaluate(() => { const c = document.querySelector('.card'); return [c.scrollHeight, c.clientHeight]; });
    if (scroll > client) console.warn(`${args[i]}: content overflows the card by ${scroll - client}px`);
    await (await page.$('.card')).screenshot({ path: args[i + 1] });
    console.log(`${args[i + 1]} written`);
  }
  await browser.close();
})();
