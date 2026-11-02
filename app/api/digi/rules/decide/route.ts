import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyRuleSig, forgetLearnedRules, type ProposalRow } from '@/lib/digi/learned-rules'

// Justin's one tap on a DiGi rule proposal (lib/digi/learned-rules.ts).
//
// The Monday email links here with a signed id. GET only SHOWS the proposal
// with its buttons: mail scanners open every link in an email, and a GET that
// approved would let a virus checker teach DiGi a rule. Only the POST from the
// buttons changes anything, and only with the same signature.
//
// Approve makes a rule live on the next reply. Decline keeps it as history.
// Retire takes an approved rule out of DiGi without losing the record.

export const dynamic = 'force-dynamic'

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))

function page(body: string, status = 200) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DiGi rule</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800;900&family=IBM+Plex+Mono:wght@700&display=swap">
<style>/* hex-ok: a standalone page served from a route, no app stylesheet loads here */body{margin:0;background:#F9F8F6;color:#1A1A2E;font:16px/1.6 Nunito,Helvetica,Arial,sans-serif}main{max-width:560px;margin:0 auto;padding:28px 16px}h1{font-size:24px;font-weight:900;margin:0 0 12px}.card{background:#fff;border:2px solid #1A1A2E;border-radius:20px;padding:18px;margin:0 0 16px}.label{font:700 12px/1.4 'IBM Plex Mono',monospace;letter-spacing:.1em;text-transform:uppercase;color:#52526A;margin:0 0 4px}.card p{margin:0 0 10px}.card p:last-child{margin:0}.rule{font-size:19px;font-weight:800}form{display:inline}button{font:800 17px Nunito,Helvetica,Arial,sans-serif;border:2px solid #1A1A2E;border-radius:16px;padding:12px 20px;margin:0 8px 8px 0;cursor:pointer;box-shadow:0 5px 0 #1A1A2E;background:#fff;color:#1A1A2E}button.yes{background:#F5C842}.muted{color:#52526A;font-size:14px}</style></head><body><main>${body}</main></body></html>`
  return new NextResponse(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } })
}

async function load(id: string) {
  const { data } = await createAdminClient()
    .from('digi_rule_proposals')
    .select('id, case_id, case_prompt, failure, kind, rule, status, created_at')
    .eq('id', id).maybeSingle()
  return data as ProposalRow | null
}

function view(p: ProposalRow, sig: string, note = '') {
  const action = (a: string, label: string, cls = '') =>
    `<form method="post"><input type="hidden" name="id" value="${esc(p.id)}"><input type="hidden" name="sig" value="${esc(sig)}"><input type="hidden" name="action" value="${a}"><button class="${cls}">${label}</button></form>`
  const buttons = p.kind === 'test'
    ? `<p class="muted">This one says the test looks wrong, not DiGi. Nothing to switch on: paste it to Claude and the test gets fixed in code, with the reason written down.</p>${p.status === 'pending' ? action('decline', 'Mark as read') : ''}`
    : p.status === 'pending'
      ? `${action('approve', 'Approve, DiGi follows this', 'yes')}${action('decline', 'Decline')}`
      : p.status === 'approved' ? action('retire', 'Retire this rule') : ''
  return page(`
    ${note ? `<p class="card"><strong>${esc(note)}</strong></p>` : ''}
    <h1>${p.kind === 'test' ? 'A test that looks out of date' : 'A rule DiGi would like to learn'}</h1>
    <div class="card"><p class="label">${p.kind === 'test' ? 'What looks wrong with the test' : 'The rule'}</p><p class="rule">${esc(p.rule)}</p></div>
    <div class="card"><p class="label">The test question</p><p>${esc(p.case_prompt)}</p><p class="label">Why it failed</p><p>${esc(p.failure)}</p></div>
    <p class="label">Status: ${esc(p.status)}</p>
    ${buttons}
    <p class="muted">Approved rules reach DiGi within five minutes and sit under every house rule, never over one. Next Monday's check measures whether it helped.</p>`)
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id') ?? ''
  const sig = url.searchParams.get('sig')
  if (!id || !verifyRuleSig(id, sig)) return page('<h1>That link has expired or is not right.</h1>', 403)
  const p = await load(id).catch(() => null)
  if (!p) return page('<h1>That proposal is not there any more.</h1>', 404)
  return view(p, sig as string)
}

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null)
  const id = String(form?.get('id') ?? '')
  const sig = String(form?.get('sig') ?? '')
  const action = String(form?.get('action') ?? '')
  if (!id || !verifyRuleSig(id, sig)) return page('<h1>That link has expired or is not right.</h1>', 403)

  const p = await load(id).catch(() => null)
  if (!p) return page('<h1>That proposal is not there any more.</h1>', 404)

  // Only the moves that make sense from where it stands.
  const next =
    action === 'approve' && p.status === 'pending' && p.kind === 'rule' ? 'approved'
    : action === 'decline' && p.status === 'pending' ? 'declined'
    : action === 'retire' && p.status === 'approved' ? 'retired'
    : null
  if (!next) return view(p, sig, 'Nothing changed: that was already decided.')

  const { error } = await createAdminClient()
    .from('digi_rule_proposals')
    .update({ status: next, decided_at: new Date().toISOString() })
    .eq('id', id).eq('status', p.status)
  if (error) return view(p, sig, 'That did not save. Please try again.')

  forgetLearnedRules()
  const note = next === 'approved' ? 'Approved. DiGi follows this within five minutes.'
    : next === 'retired' ? 'Retired. DiGi no longer follows this, and the record stays.'
    : 'Done. It will not be asked again for four weeks.'
  return view({ ...p, status: next }, sig, note)
}
