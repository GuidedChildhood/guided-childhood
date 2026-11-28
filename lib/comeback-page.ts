import { NextResponse } from 'next/server'
import { APP_ORIGIN } from '@/lib/config/site'

// The free week page (app/api/comeback/route.ts), here so it can be rendered
// and looked at without a database.

// A standalone page served by a route, with no stylesheet, so the tokens in
// shared/tokens.css cannot reach it. The same values the emails use.
const INK = '#1A1A2E' // hex-ok: standalone route html, no stylesheet
const INK_SOFT = '#52526A' // hex-ok: standalone route html, no stylesheet
const CREAM = '#F9F8F6' // hex-ok: standalone route html, no stylesheet
const WHITE = '#ffffff' // hex-ok: standalone route html, no stylesheet
const BORDER = '#EAEAF0' // hex-ok: standalone route html, no stylesheet
const BUTTER = '#E9B949' // hex-ok: standalone route html, no stylesheet
const BUTTER_DARK = '#C29018' // hex-ok: standalone route html, no stylesheet

export function comebackPageHtml(title: string, body: string, action?: { u: string; k: string }): string {
  const form = action
    ? `<form method="post" action="/api/comeback" style="margin:24px 0 0">
        <input type="hidden" name="u" value="${action.u}">
        <input type="hidden" name="k" value="${action.k}">
        <button type="submit" style="font-family:'IBM Plex Mono',Menlo,monospace;font-size:14px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;background:${BUTTER};color:${INK};border:0;border-radius:16px;box-shadow:0 5px 0 ${BUTTER_DARK};padding:16px 26px;min-height:48px;cursor:pointer">Start my free week</button>
      </form>`
    : `<p style="margin:24px 0 0"><a href="${APP_ORIGIN}/dashboard" style="font-weight:800;color:${INK}">Open my dashboard</a></p>`
  return (
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&family=IBM+Plex+Mono:wght@700&display=swap" rel="stylesheet"></head>
    <body style="margin:0;background:${CREAM};font-family:Nunito,Helvetica,Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:16px;box-sizing:border-box">
      <div style="max-width:440px;width:100%;background:${WHITE};border:1px solid ${BORDER};border-radius:20px;padding:36px 28px;text-align:center;box-sizing:border-box">
        <h1 style="font-size:24px;font-weight:800;color:${INK};margin:0 0 12px">${title}</h1>
        <p style="font-size:16px;color:${INK_SOFT};line-height:1.6;margin:0">${body}</p>
        ${form}
      </div>
    </body></html>`
  )
}


export function comebackPage(title: string, body: string, action?: { u: string; k: string }): NextResponse {
  return new NextResponse(comebackPageHtml(title, body, action), { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } })
}
