import { chromium } from '@playwright/test';
const dir = '/home/user/guided-childhood/content/packs/2026-08-27-big-tech-fines/cards';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1080, height: 1400 } });
for (const n of [1, 2, 4, 5]) {
  await page.goto(`file://${dir}/card-${n}.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.locator('.card').screenshot({ path: `${dir}/card-${n}.png` });
  console.log(`card-${n}.png done`);
}
for (const n of [3, 6]) {
  await page.goto(`file://${dir}/carousel-${n}.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.pdf({ path: `${dir}/carousel-${n}.pdf`, width: '1080px', height: '1350px', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  console.log(`carousel-${n}.pdf done`);
}
await browser.close();
