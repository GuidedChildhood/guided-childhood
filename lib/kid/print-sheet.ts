// The print window a child gets when they tap Print it now on a sheet.
//
// Justin, 9 August 2026: "when clicked printable it displays print which is
// great but need a way back to platform."
//
// What this used to write was an image and nothing else. On a desktop that is
// survivable, there is a tab to close. Inside the installed app there is no
// address bar, no tabs and no back button, so a child who printed the Kindness
// Bucket List was left looking at a sheet with no control of any kind on it.
// The print dialog is the only thing that ever appears, and once it is
// dismissed the screen is a dead end with the app behind it out of reach.
//
// The parent side hit the same wall on 6 August and was fixed by opening away
// from the app, because a PDF served by a route is not ours to decorate. This
// window IS ours: we write every byte of it, so it can simply carry its own way
// back instead.
//
// Lifted out of KidQuestScreen so it can actually be driven in a test. It sat
// three thousand lines into a screen that needs a live link token to render, so
// nothing had ever opened it except a child.

/** Escape for interpolation into the generated document. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * The document itself, separated from the window so it can be asserted on
 * without a popup. Titles and URLs come from our own registry, but a document
 * assembled by concatenation should never depend on that staying true.
 */
export function printSheetHtml(sheetUrl: string, title: string): string {
  const t = esc(title)
  return (
    `<!doctype html><html><head><title>${t}</title>` +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<style>' +
    '@page{margin:8mm}' +
    'html,body{margin:0;padding:0;background:#fff;font-family:system-ui,sans-serif}' +
    'img{width:100%;display:block}' +
    // Sticky rather than fixed, so it can never sit over the top of the sheet
    // on a short screen, and it is still there when the child scrolls back up.
    '.bar{position:sticky;top:0;z-index:2;display:flex;gap:10px;align-items:center;' +
    'padding:12px 14px;background:#FFF6E0;border-bottom:1.5px solid rgba(26,26,46,0.12)}' +
    '.btn{flex:1;padding:12px 10px;border:none;border-radius:14px;cursor:pointer;' +
    'font-family:inherit;font-weight:800;font-size:16px;color:#1A1A2E}' +
    '.back{background:#E07A5F;box-shadow:0 4px 0 #B4553C}' +
    '.again{background:#fff;box-shadow:0 4px 0 rgba(26,26,46,0.14)}' +
    '.oops{display:none;padding:26px 20px;text-align:center;font-size:17px;line-height:1.55;color:#1A1A2E}' +
    // The paper is still only the sheet. A toolbar that printed would be a
    // worse bug than the one this fixes.
    '@media print{.bar,.oops{display:none}}' +
    '</style></head>' +
    '<body>' +
    '<div class="bar">' +
    // The same words as the back link on every other child screen, and short
    // enough not to wrap onto two lines on a 390px phone.
    '<button class="btn back" id="gc-back" onclick="window.close()">← My quests</button>' +
    // The dialog fires once on load. A child who taps Cancel, or whose printer
    // was not switched on, otherwise has to go back and start the whole thing
    // again to get a second chance at it.
    '<button class="btn again" id="gc-again" onclick="window.print()">Print again</button>' +
    '</div>' +
    // The sheet art lives on the CDN, so on a bad connection the image is the
    // one thing here that can fail. It used to fail silently: no picture, and
    // no print dialog either, because that fires from the image's own onload.
    // A child was left on a blank white page with no idea whether they had
    // done something wrong. Now it says so, and the bar above still works.
    `<img src="${esc(sheetUrl)}" alt="${t}"` +
    ' onload="setTimeout(function(){window.focus();window.print()},250)"' +
    ' onerror="this.style.display=\'none\';document.getElementById(\'gc-oops\').style.display=\'block\'">' +
    '<p class="oops" id="gc-oops">That sheet did not come through. Check the wifi and tap Print again, or ask a grown up to print it for you.</p>' +
    '</body></html>'
  )
}

/**
 * Open the sheet in its own window and send it to the printer. The sheet art is
 * public on the CDN, so this needs no fetch and no auth.
 *
 * If the popup is blocked we open the image itself instead: that lands in the
 * system browser, which has its own back, so the button never dead ends.
 */
export function printSheet(sheetUrl: string, title: string): void {
  const w = window.open('', '_blank')
  if (!w) { window.open(sheetUrl, '_blank'); return }
  w.document.write(printSheetHtml(sheetUrl, title))
  w.document.close()
}
