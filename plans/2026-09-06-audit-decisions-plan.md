# The audit's decisions, answered

Justin, 6 September 2026, on the eight decisions the 5 September audit
(audit/2026-09-05-current-state-audit/01-report.md, section 9) said only he
could make: "1 limited co 2 asked at set up 3 ignore 4 yea 5 should be 6 its
demo 7 agreed name of the guided digital child passport 8 remind for 2
months go ahead."

Stages one and two of the audit shipped on 5 September (the copy that outran
the evidence, and seven code fixes). This is stage three: the answers.

| Decision | Answer | What changes |
| --- | --- | --- |
| 1 Legal entity | A limited company | lib/content/contact.ts gains companyName, companyNumber and registeredOffice, empty until Justin sends them; Terms and Privacy print the company sentence only once they are filled. Never a guess on a legal page. |
| 2 Core time | Asked at setup | The Setup Quest gains a fourth step, "Decide their free screen time", one tap per child (None, 30, 45, 60, 90). None is a real answer. Saved through the existing time settings route; the step ticks when every child has a row. |
| 3 Old HTML pages | Ignore | Nothing. |
| 4 The 30 day refund | Real | The Terms say it: first 30 days as a paying member, email us, every penny back, no questions. |
| 5 Stripe billing portal | Should be on | Not verifiable from the repo. Justin checks Stripe, Settings, Billing, Customer portal. The cancel button in settings depends on it. |
| 6 oakfield-2026 | A demo code | Nothing; the placeholder already reads "your school code". |
| 7 The passport's name | The Guided Digital Childhood Passport | One name on the homepage, the passport book, the child's path, the keepsakes, the verify page and the schools lesson page. |
| 8 DPIA and solicitor | Remind in two months | A routine fires on 6 November 2026 with the reminder. |

The Terms also stop describing a product that does not exist: four free
days, both doors, the starter set and three DiGi questions a day, and "the
app waits for you" instead of "you move to the free tier". Last updated
6 September 2026.

The audit folder itself is committed with this change, on Justin's go ahead.
