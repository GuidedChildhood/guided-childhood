# Audit stages one and two

Justin, 5 September 2026, on the audit (audit/2026-09-05-current-state-audit,
kept out of the repo): "let's go your suggestions, but we can ignore the old
HTML and the starter pack, not concerned about them. As we go, ask a question
in each change so we can clarify if necessary. The legal stuff we can address
after 50 sign ups."

## Out of scope by his call

- The legacy public/*.html pages (waitlist, Payment Links, Social Billboard
  footers on static pages).
- The starter pack reveal copy.
- Terms, Privacy, the legal entity block, the DPIA, the solicitor review:
  after 50 sign ups.

## Stage one, copy only (PR one)

The homepage's six claims and the ban tense, the two "reviewed weekly" lines,
"science backed", the annual saving arithmetic, the UK Surgeon General line,
the Australia figure on one source across both surfaces, the "everything
open" and "free tier" trial lines in the app, the pushes and the emails, the
three Social Billboard footers on Next pages, the schools "Ofsted asks for"
and "statutory by construction" and "line by line" wording, the 21 of 21
line, the pricing page catalogue line, the unlock placeholder.

Each change carries a question in the report where a judgement was made.
Defaults were chosen so one word from Justin reverts any of them.

## Stage two, small code (PR two)

push subscribe authentication; the wellbeing consent gate on the server;
plan_choice from the Stripe tier; the crisis gate before the model in the main
chat plus CEOP and the school DSL; the kid link ownership check; the schools
hero visible without JavaScript; one founder count source. The prices config
is a question, not a build.

## Checks

tsc root and schools, wiring, checkin-guard, dash grep, and for stage two a
request without a session to push subscribe returning 401, a tracker write
without consent returning 403.
