import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const p = await b.newPage({ viewport: { width: 390, height: 1000 }, deviceScaleFactor: 2 })
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
await p.waitForTimeout(1000)
await p.screenshot({ path: process.argv[2] })
await b.close()
console.log('done')
