import { chromium } from 'playwright-core';
import { existsSync } from 'fs';

const DIR = '/home/user/guided-childhood/content/printables/word-fishing';
const exe = ['/opt/pw-browsers/chromium/chrome-linux/chrome',
             '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
             '/opt/pw-browsers/chromium'].find(p => existsSync(p));

const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage();

// Print PDFs
await page.goto('file://' + DIR + '/print.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.pdf({ path: DIR + '/product/word-fishing-A4.pdf', format: 'A4', printBackground: true });
// A4 sheets are 296mm tall; US Letter is 279.4mm. Scale to fit and centre
// horizontally so nothing is clipped and margins stay even.
await page.pdf({ path: DIR + '/product/word-fishing-USLetter.pdf', format: 'Letter',
  printBackground: true, scale: 0.94, margin: { left: '9.25mm' } });
await page.evaluate(() => document.body.classList.add('ink'));
await page.pdf({ path: DIR + '/product/word-fishing-A4-ink-friendly.pdf', format: 'A4', printBackground: true });
console.log('PDFs done');

// Phone screens
const p2 = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await p2.goto('file://' + DIR + '/phone.html', { waitUntil: 'networkidle' });
await p2.waitForTimeout(1500);
for (const [id, name] of [['s1','how-to-play'], ['s2','tricky-words-practice']]) {
  const el = p2.locator('#' + id);
  await el.screenshot({ path: DIR + '/phone/' + name + '.png' });
}
console.log('Phone screens done');

// Preview thumbnails of the print pages for visual check
const p3 = await browser.newPage({ viewport: { width: 794, height: 1123 } });
await p3.goto('file://' + DIR + '/print.html', { waitUntil: 'networkidle' });
await p3.waitForTimeout(1200);
const sheets = p3.locator('.sheet');
const n = await sheets.count();
for (let i = 0; i < n; i++) {
  await sheets.nth(i).screenshot({ path: DIR + '/images/preview-page-' + (i + 1) + '.png' });
}
console.log('Previews done:', n, 'pages');

// Ink friendly spot checks
await p3.evaluate(() => document.body.classList.add('ink'));
await p3.waitForTimeout(400);
for (const i of [0, 3, 7]) {
  await sheets.nth(i).screenshot({ path: DIR + '/images/preview-ink-page-' + (i + 1) + '.png' });
}
console.log('Ink previews done');
await browser.close();
