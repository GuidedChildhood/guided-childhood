// Banded emails: the roundup shape, in our own colours.
//
// Justin sent the Good Inside August roundup and asked for the style. He then
// asked for alternating colours, saw them, and settled it: "can we use the blue
// its nicer".
//
// WHAT IS WORTH TAKING. Their email alternates full bleed coloured bands with
// white content, and that rhythm is the whole trick: it turns a long message
// into a few short ones. The colour itself is ours, one calm blue from the
// stage palette, at our own line lengths and in Nunito. Their pattern, our
// butter and ink, never another brand's look, which is the CLAUDE.md rule for
// working from a reference.
//
// The rotation through five stage colours was tried and dropped. Five colours
// down one email means every band competes with the one above it, so nothing is
// emphasis any more.
//
// WHY TABLES AND INLINE STYLES. Email clients. Outlook has no flexbox, Gmail
// strips <style> blocks, and a full bleed band is a table row with a background
// rather than a div. Everything here is deliberately old fashioned so it
// renders the same in Apple Mail, Gmail and Outlook.

const INK = '#1A1A2E'
const INK_SOFT = '#52526A'
const INK_MUTED = '#8888A0'
const BUTTER = '#E9B949'
const BUTTER_DARK = '#C29018'
const CREAM = '#F9F8F6'
const BORDER = '#EAEAF0'

const APP = process.env.NEXT_PUBLIC_APP_URL ?? 'https://guidedchildhood.com'

// THE FONT WAS THE REAL BUG, and it is worth writing down because it is
// invisible until somebody says "the font looks different".
//
// The first version asked for Nunito and never loaded it. Web fonts are not
// available in email unless the message carries them, so every client fell
// straight through to Helvetica and the whole thing rendered in a generic
// system face. It was never Nunito on any screen, including Justin's.
//
// Apple Mail and iOS Mail honour a linked web font, which is where most of
// these are actually opened. Gmail strips it and falls back, which is why the
// stack behind it matters and why the fallbacks are ordered widest support
// first rather than prettiest first.
const FONT = "'Nunito','Trebuchet MS',Verdana,Helvetica,Arial,sans-serif"
const MONO = "'IBM Plex Mono',Menlo,Consolas,monospace"

// Loaded twice on purpose: <link> for clients that support it, @import for the
// few that prefer it. Neither breaks a client that honours neither.
const FONT_HEAD = `<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=IBM+Plex+Mono:wght@600;700&display=swap" rel="stylesheet">
<style>@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=IBM+Plex+Mono:wght@600;700&display=swap');</style>`

// CALIBRATED TO ONE LIGHTNESS, and that is the whole correction.
//
// The first version used the -bold tokens straight from globals.css, and Justin
// said the colours were not quite right. He was correct and the reason is
// measurable rather than a matter of taste. The Good Inside band is #c2e1ff,
// which is around 88 percent lightness. Four of our five bolds sit near there,
// but stage 1 yellow at #FEF08A is 77 percent, so it arrived far heavier than
// everything around it and pulled the whole email from calm towards candy.
//
// These are the same five hues from the pathway, each taken to roughly the same
// lightness as each other. So they still read as our stages, and no single band
// shouts over the rest. On screen in the app the -bold tokens are right, because
// there they sit on white behind a card. Across a full width band they are not,
// and the same colour doing two jobs badly is worse than two values.
export const TONES = {
  1: { bg: '#FDF3BF', text: '#6B3D10', name: 'Ages 4 to 7' },
  2: { bg: '#C6E4FE', text: '#0B4569', name: 'Ages 8 to 10' },
  3: { bg: '#FED9DD', text: '#82122F', name: 'Ages 11 to 13' },
  4: { bg: '#FBDCEC', text: '#7D1640', name: 'Ages 13 to 15' },
  5: { bg: '#E4DFFE', text: '#38065F', name: 'Ages 16 plus' },
} as const

export type Tone = keyof typeof TONES | 'white'

/** 'auto' means "the email's colour, whatever that is". 'white' means white. */
export type BandTone = Tone | 'auto'

export interface Band {
  tone: BandTone
  /**
   * A function of the tone, not a string, and this is the point of 'auto'.
   *
   * Text inside a band has to match the band, so a heading on the blue band
   * uses the blue text colour. Passing the tone in at render time keeps that
   * true without every caller having to know which colour it got.
   */
  html: string | ((tone: Tone) => string)
}

/**
 * Give every coloured band the same tone.
 *
 * IT ROTATED FIRST, AND JUSTIN WAS RIGHT TO STOP IT. He asked for alternating
 * colours, saw it, and said "can we use the blue its nicer". He is right, and
 * the reason is worth keeping: five colours down one email means every band
 * competes with the one above it, so nothing is emphasis any more. One calm
 * colour, and the eye goes to the words.
 *
 * The stage palette still earns its keep in the app, where a colour marks which
 * part of childhood you are looking at. An email is one child at a time, so the
 * colour has nothing left to tell you.
 *
 * Kept as a parameter rather than hardcoded, because a Christmas or an end of
 * year email may well want a different single colour, and that is one argument
 * rather than a rewrite.
 */
export function paint(bands: Band[], tone: 1 | 2 | 3 | 4 | 5 = 2): { tone: Tone; html: string }[] {
  return bands
    .map(b => {
      const t: Tone = b.tone === 'auto' ? tone : b.tone
      return { tone: t, html: typeof b.html === 'function' ? b.html(t) : b.html }
    })
    // A section that rendered to nothing must not leave a stripe of colour
    // behind, so the filter runs after rendering rather than before.
    .filter(b => b.html.trim())
}

export function button(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 4px"><tr><td style="background:${BUTTER};border-radius:16px;box-shadow:0 5px 0 ${BUTTER_DARK}">
    <a href="${url}" style="display:inline-block;padding:15px 30px;font-family:${MONO};font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${INK};text-decoration:none">${label}</a>
  </td></tr></table>`
}

/**
 * A section heading with its own mark.
 *
 * Good Inside puts a small line drawing beside every section heading and it is
 * the thing that stops a long email reading as one wall. An emoji rather than
 * an image on purpose: an image needs hosting, survives no image blocking, and
 * every client that blocks images by default would show a section with no head
 * at all.
 */
export function sectionHead(mark: string, title: string, tone: Tone = 'white'): string {
  const colour = tone === 'white' ? INK : TONES[tone].text
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 12px"><tr>
    <td style="padding-right:11px;font-size:26px;line-height:1">${mark}</td>
    <td style="font-family:${FONT};font-size:24px;font-weight:800;line-height:1.25;color:${colour}">${title}</td>
  </tr></table>`
}

export function eyebrow(text: string, tone: Tone = 'white'): string {
  const colour = tone === 'white' ? BUTTER_DARK : TONES[tone].text
  return `<div style="font-family:${MONO};font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${colour};margin:0 0 10px">${text}</div>`
}

export function h1(text: string, tone: Tone = 'white'): string {
  const colour = tone === 'white' ? INK : TONES[tone].text
  // 34, up from 26. The reference runs its opening headline at 36 and it is a
  // large part of why theirs reads as a designed email and the first draft of
  // this read as a letter. On a phone a heading that is only ten points above
  // the body is not a heading, it is a bold line.
  return `<h1 style="font-family:${FONT};font-size:34px;font-weight:900;line-height:1.12;color:${colour};margin:0 0 16px;letter-spacing:-0.02em">${text}</h1>`
}

export function p(text: string, tone: Tone = 'white'): string {
  const colour = tone === 'white' ? INK : TONES[tone].text
  return `<p style="margin:0 0 14px;font-family:${FONT};font-size:16px;line-height:1.65;color:${colour}">${text}</p>`
}

/** A list where every item goes somewhere. The Good Inside resource block. */
export function linkList(items: { label: string; href: string }[]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 14px">${items.map(i => `
    <tr><td style="padding:0 0 9px;font-family:${FONT};font-size:16px;line-height:1.5">
      <span style="color:${INK_MUTED};padding-right:8px">&bull;</span>
      <a href="${i.href}" style="color:${BUTTER_DARK};font-weight:700;text-decoration:underline">${i.label}</a>
    </td></tr>`).join('')}</table>`
}

/** What you walk away with. Ticks rather than bullets, because it is a promise. */
export function tickList(items: string[], tone: Tone = 'white'): string {
  const colour = tone === 'white' ? INK : TONES[tone].text
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 14px">${items.map(t => `
    <tr>
      <td valign="top" style="padding:0 10px 9px 0;font-size:15px;line-height:1.5">&#10003;</td>
      <td style="padding:0 0 9px;font-family:${FONT};font-size:16px;line-height:1.55;color:${colour}">${t}</td>
    </tr>`).join('')}</table>`
}

/** A quiet rule between two sections inside the same band. */
export function rule(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0"><tr><td style="border-top:1px solid ${BORDER};font-size:0;line-height:0">&nbsp;</td></tr></table>`
}

/**
 * The banded shell.
 *
 * Bands are full width rows of one outer table, so the colour runs edge to edge
 * the way it does in the reference rather than stopping at a card. The rounded
 * corners live on the outer table with overflow hidden, which Outlook ignores
 * and everything else honours, and a square corner in Outlook is a fine place
 * to lose.
 */
export function bandedWrapper(params: {
  bands: Band[]
  unsubscribe: string
  signOff?: string
  /** The one colour every band uses. Blue by default. */
  tone?: 1 | 2 | 3 | 4 | 5
}): string {
  const { bands, unsubscribe, signOff, tone = 2 } = params
  // paint() also drops empty bands, so a section that rendered to nothing
  // cannot leave a stripe of colour behind and take a turn in the rotation with
  // it.
  const rows = paint(bands, tone)
    .map(b => {
      const bg = b.tone === 'white' ? '#ffffff' : TONES[b.tone].bg
      return `<tr><td style="background:${bg};padding:28px 30px">${b.html}</td></tr>`
    })
    .join('')

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${FONT_HEAD}</head><body style="margin:0;padding:0;background:${CREAM}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:28px 14px"><tr><td align="center">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;border:1px solid ${BORDER};border-radius:20px;overflow:hidden">
      <tr><td style="background:#ffffff;padding:26px 30px 4px">
        <div style="font-family:${MONO};font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${BUTTER_DARK}">Guided Childhood</div>
      </td></tr>
      ${rows}
      <tr><td style="background:#ffffff;padding:26px 30px 30px">
        <div style="font-family:${FONT};font-size:16px;line-height:1.6;color:${INK}">${signOff ?? 'Until next time,'}<br><strong>Justin</strong></div>
        <div style="font-family:${FONT};font-size:13px;color:${INK_MUTED};margin-top:4px">Founder, Guided Childhood &middot; Bath, UK</div>
      </td></tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px"><tr><td style="padding:18px 8px;text-align:center">
      <span style="font-family:${MONO};font-size:11px;color:${INK_MUTED};line-height:1.7">
        <a href="${APP}/dashboard" style="color:${INK_MUTED};text-decoration:none">Home</a>
        &nbsp;&nbsp;<a href="${APP}/dashboard/scripts" style="color:${INK_MUTED};text-decoration:none">Scripts</a>
        &nbsp;&nbsp;<a href="${APP}/dashboard/pathway" style="color:${INK_MUTED};text-decoration:none">Pathway</a>
        <br>You get these because you joined Guided Childhood.
        <a href="${unsubscribe}" style="color:${INK_MUTED}">Stop the emails</a>
      </span>
    </td></tr></table>

  </td></tr></table>
</body></html>`
}
