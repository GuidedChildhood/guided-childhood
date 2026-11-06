# Say This: The Guided Childhood Script Cards

A print at home deck of 60 cards: 50 moments, one for every hard screen and
tech moment from 4 to 16, in five levels (Pebble, Bloop, Orbit, Nova, Cosmo).
The moment on the front, the words on the back with one line on why. Built
5 November 2026. Plan: `plans/2026-11-05-script-cards-plan.md`.

## Files

| Path | What |
|---|---|
| `cards-data.js` | Every word on every card, with its proof path. The one place to edit |
| `print.html` | Page 1 how to print, 15 sheets of fronts and mirrored backs, the Passport finish |
| `phone.html` | Five screens, the first card of each level |
| `product/` | `say-this-script-cards-A4.pdf`, `-USLetter.pdf`, `-A4-ink-friendly.pdf`, 32 pages each |
| `phone/` | The five phone screens, zipped as the fourth Etsy file |
| `images/preview/` | One render per A4 page, for the check by eye |
| `images/cards/` | Every card alone, front and back, for the listing photos |
| `listing/` | `listing.md`, `images.html` and the 2000 by 2000 photos |

Rebuild everything:

    node content/printables/build-pack.mjs script-cards

## Printing and duplex

Four cards to an A4 sheet, 88 by 124mm, 6mm gutter. A back sheet is its front
sheet mirrored left to right, so double sided with flip on long edge lines up.
Card fills run 1.5mm past the dashed cut line. US Letter is the A4 page at 94
percent, centred, which keeps the mirror symmetric.

## Where every card comes from

Card 1 of each level is that stage's script in `lib/content/stages.ts`, the
talk the Passport's stage page asks for. Cards 2 to 10 are rows of the live
`scripts` table (law_flag none), read on 5 November 2026. The back's Say
this is the row's say_this word for word ("wind-down" written "wind down",
no dashes). Why it works is a cut of why_it_works, never reworded, chosen to
carry no statistic and no promise about a child. The front is the moment,
shortened from the row's situation or put in the child's words.

If a script changes in the app, change it here too and rebuild.

| No. | Level | Moment | Front | Source |
|---|---|---|---|---|
| 01 | Pebble | The first screen | Screens are new, and there is no rule yet. | lib/content/stages.ts, pebble stage script |
| 02 | Pebble | The timer goes | I am not finished! | `scripts` 8c69f7bd-4149-4581-a950-45df4c7b5cdf, Meltdown when screen time ends |
| 03 | Pebble | The timer goes | Not yet! Two more minutes! | `scripts` c6510bcb-5ffa-4bb2-a80d-d0116e6c6be6, The two minute warning is making it worse |
| 04 | Pebble | The phone ask | Why can I not have my own phone? | `scripts` e9d06c4a-6f50-45f8-a355-b355a39a69fd, Asking for their own phone |
| 05 | Pebble | Everyone else has it | But all my friends play it! | `scripts` a979b76f-5385-4311-a749-432617fa4545, The game their friends play |
| 06 | Pebble | Bedtime | Just one more show before bed. | `scripts` 9fa1c85a-3d8c-402c-9531-4459c272ccff, Screens before bed |
| 07 | Pebble | After the screen | I am bored. There is nothing to do. | `scripts` dc6bc0ce-cfc7-46a9-a4d3-82728da521d0, When They Say Everything Is Boring Without a Screen |
| 08 | Pebble | Sharing | It is MY turn! | `scripts` 954358c1-8839-45f6-a4b9-86552de2b786, Sibling fight over the device |
| 09 | Pebble | Strangers online | Who is that talking in my game? | `scripts` 9ffe6ecf-eeb0-4fbf-9b10-2a3c2546520d, Strangers online |
| 10 | Pebble | Repair | You shouted. They are quiet now. | `scripts` 16318ed4-a5cd-4288-b4d2-811d4333f499, After you lost your temper |
| 11 | Bloop | The bedroom | Can my phone sleep in my room? | lib/content/stages.ts, bloop stage script |
| 12 | Bloop | The timer goes | I cannot stop now, I am mid match! | `scripts` c34dec15-0836-4e59-8a60-beb42a1236f4, They cannot stop in the middle of a match |
| 13 | Bloop | Gaming | It is so unfair! I always lose! | `scripts` dfb0c55a-16b2-48f1-90c2-fe2fc3fb7ae5, Gaming Rage |
| 14 | Bloop | Everyone else has it | Everyone is in the group chat but me. | `scripts` 5e89270c-0865-40a3-8091-39665a1fafdb, First social platform request |
| 15 | Bloop | The phone ask | Am I getting a phone for secondary school? | `scripts` 7c9229cc-875c-46a1-b3cf-596828ae85fb, The Year 6 phone plan, before the box is opened |
| 16 | Bloop | Alone with a screen | Can I watch YouTube in my room? | `scripts` 9319b187-438e-4420-876d-ea7092894485, Asking to watch YouTube unsupervised |
| 17 | Bloop | Strangers online | I play with someone online. They are really good. | `scripts` 2bb35db3-51f7-4356-a57f-01c53ce79eea, Online gaming with strangers |
| 18 | Bloop | Money in games | Can I buy this skin? It is only 800 coins. | `scripts` 0ececca5-ffc7-46e6-93b9-0e613fcaf533, Requests for in-game purchases |
| 19 | Bloop | Group chats | Nothing. I am fine. | `scripts` 7ee064e9-08b1-49b9-9a53-47acb7f4c2ba, When Group Chat Drama Comes Home |
| 20 | Bloop | Sneaking | The tablet was on under the covers again. | `scripts` a3a6d534-0143-4378-a975-14a89cf4506f, Sneaking screen time |
| 21 | Orbit | The feed | Why does it keep showing me this stuff? | lib/content/stages.ts, orbit stage script |
| 22 | Orbit | The timer goes | Five more minutes. Please. | `scripts` d0304dbe-df42-47d2-8feb-e42cc8159643, The Just Five More Minutes Loop |
| 23 | Orbit | The first phone | If I tell you, will you take my phone? | `scripts` 1ae25188-e159-4f53-b549-43f2e037c3bb, The no confiscation promise, said out loud |
| 24 | Orbit | Everyone else has it | Everyone else is allowed! | `scripts` 50f885f7-70ed-46f3-b443-9f74ed73a315, When rules feel unfair |
| 25 | Orbit | Group chats | I cannot mute it. I will miss everything. | `scripts` 9dfcab36-6c7e-43a5-99f8-569584d4678b, The class group at eleven at night |
| 26 | Orbit | Left out | They took me out of the group. | `scripts` 724e9b61-554f-4693-b5d7-cb59606ed020, Taken out of the group on purpose |
| 27 | Orbit | Something went wrong | Someone keeps being horrible to me online. | `scripts` 9b6b7652-11bb-42be-b57b-23091f2c2f22, They are being bullied online |
| 28 | Orbit | Feelings | Off the phone, upset, and not saying why. | `scripts` d4d435c6-9caf-4cba-8417-192a1e66283c, Mood change after phone use |
| 29 | Orbit | Money in games | It was only a few pounds. | `scripts` 9ab877b9-6285-43b3-8876-1052e0b903b9, They have spent real money on the game |
| 30 | Orbit | AI | What actually is AI? | `scripts` da63a8a5-6bd3-4738-b2d2-3857df98b898, What AI actually is |
| 31 | Nova | Something went wrong | Before anything goes wrong online. | lib/content/stages.ts, nova stage script |
| 32 | Nova | Sleep | I was only on it for a bit. | `scripts` abb1acd6-c240-4740-b6db-379b2c901351, Late night device use |
| 33 | Nova | The rules | I am not a little kid anymore! | `scripts` e93312a7-b1e3-4b35-bfdf-eaf4d33d5616, Negotiating screen time limits |
| 34 | Nova | Everyone else has it | Nobody else has rules like this. | `scripts` 41968e72-793c-48dc-8b86-69c488abf436, Comparing screen time to friends' limits |
| 35 | Nova | Trust | You are tempted to look through their phone. | `scripts` f3ab193d-0ae3-4e7e-97dc-a4c387b83e05, Checking their phone |
| 36 | Nova | Images | Someone has a photo of me. They want money. | `scripts` 35ef3a7f-ead3-4c23-a491-771ca4d92a85, Someone has a photo and is demanding money |
| 37 | Nova | Group chats | Someone sent something horrible to the group. | `scripts` 9a310bc6-ee65-46a5-a5d2-53034d3c7c22, Something vile got forwarded into the group |
| 38 | Nova | Feelings | Have you seen what they wrote under my post? | `scripts` aa5ec40d-e7d0-43d2-a5d0-3d512924c17d, A post got nasty comments |
| 39 | Nova | AI | It actually listens to me. | `scripts` d41aac74-8cb0-49fe-81b8-d0b49fee4694, An AI chatbot as a friend |
| 40 | Nova | Family time | Always on the phone, barely there. | `scripts` 5d51a9d4-3f6d-4699-b1a2-bcc0f98d5b99, Always on their phone, ignoring family |
| 41 | Cosmo | Independence | It is my phone. It is my life. | lib/content/stages.ts, cosmo stage script |
| 42 | Cosmo | The rules | Sixteen, and the rules have run out. | `scripts` ee8a5600-544f-4528-ab54-d8c6d7f83662, They are sixteen and you have run out of rules |
| 43 | Cosmo | Sleep | 2am, and the light is still on. | `scripts` 04f0566d-764d-4a28-a065-1cab7cb7c4b8, The 2am Discovery |
| 44 | Cosmo | Talking | You need a real talk. They are half scrolling. | `scripts` 4daedbb8-8c5c-45dd-9575-409e09ffb70c, Phone-free conversation |
| 45 | Cosmo | Talking | They tell their phone everything. You, nothing. | `scripts` 81c3adca-ad47-4f80-b2bc-f29a6b35a467, When They Stop Talking to You and Talk to Their Phone |
| 46 | Cosmo | The feed | My feed just shows me what is out there. | `scripts` de4f68c1-25a7-41c5-9d99-973f78fe9bdc, Recognising algorithm manipulation |
| 47 | Cosmo | Doomscrolling | I cannot stop scrolling the news. | `scripts` b3055a6a-a365-4ea3-a2da-7255c7364a38, Doomscrolling conversation |
| 48 | Cosmo | Gambling | It is just a free bet on the football. | `scripts` e2702acc-9aa8-453b-9a0e-71ba215d1eb5, Gambling and betting apps |
| 49 | Cosmo | Images | Old enough to date, and to share. | `scripts` 4083e4af-aa73-465b-8779-d77c051214ab, A mature conversation about image sharing and the law |
| 50 | Cosmo | AI | Will AI even leave me a job? | `scripts` b7900cc8-f455-48fb-97d1-8667ccf013d1, AI in their future |
