# 1.4 animation pilot: safeguarding and evidence lens

Reviewer: the safeguarding and evidence lens of the four lens panel, 18 November 2026. Read only review; no script, line or database row was changed.

Read: THE-STORY.md, digi/07-trust-framework.md, CLAUDE.md non negotiables, the original film words (content/child-films/1.4-release/isla-lines.json and film.json), the remake (parent-reaction-series/1.4-feeling/child-film-script.md and build/lines.json), the parent film script, the live lesson rows (supabase/migrations/050_parent_lessons_seed.sql lines 57 to 62 and 169 to 170) and the live after watching prompt (supabase/migrations/400_watch_bookings.sql line 60).

Line ids below are the ids in build/lines.json (c for the child film, a for the parent film). "Original line N" is the index in 1.4-release/isla-lines.json.

## The verdict in one paragraph

The remake is safe in spirit and mostly safe in detail: nothing upsetting is shown or named, there are no people, the grown up's card carries the promise, and the parent film points at the right helpline without giving hours that would go stale. Four things need fixing before any animation is generated. DiGi makes the never in trouble promise itself (c19), and in the public portrait cut that line plays with the grown up's card cut out. The remake dropped the original's safety net for a child whose body gives no warning. One picture (u05) puts content on a tablet screen. And the parent is told to keep the promise without being told what to do in the five minutes after the telling, including the rare case where it is more than upsetting.

## MUST fix before animation

**M1. DiGi makes the promise the grown up has to keep (c19, beat 12).**
Line: "You will never be in trouble for telling. Even if you were watching something you weren't meant to. Telling is always the right thing."
Why: the script's own safeguarding section says "The grown up says the promise, not DiGi", and this line contradicts it. Worse, the public portrait cut (beats 1, 6, 7, 8, 9, 10 and 12) keeps beat 12 and drops pause card 2, so on the family account a cartoon promises a child something their parent has never said and may not have agreed to. A promise made on the parent's behalf is a promise the child may later find broken, and the trust framework's open door says the promise must come from the parent, said in a calm moment, with follow through.
Fix: DiGi points at the grown up instead of promising. Suggested words: "Did you hear your grown up? Telling is always the right thing. Even if you were watching something you weren't meant to, you can still tell." In the portrait public cut, either drop beat 12 or put the grown up's card (ask2) on screen in its place, so the promise is always framed as the grown up's.

**M2. The feeling is the only trigger to tell (c09 and c10, beat 7).**
Lines: "You might feel it in your body. A wobbly tummy. A hot face. A heart going fast." then "That's your body saying uh oh."
Why: some of the things a child most needs to tell about do not feel bad at the time: a friendly stranger in a game, a "special secret", a request that feels exciting. A film that teaches only "notice the bad feeling, then tell" leaves those out. The original film covered this (original line 18: "And if your tummy does not say anything, but something still seems wrong, you can still turn it over and tell."), and the remake dropped it. UKCIS frames it for ages 4 to 7 as knowing when and how to speak to an adult you can trust, not only when you feel bad.
Fix: add one line after c10: "And if you're not sure, or something just seems wrong, you can still turn it over and tell." Soften c10 to "That might be your body saying uh oh," which also keeps the script's own promise that no fact about the body is claimed.

**M3. A tablet screen shows content (u05, beat 5).**
Direction: "Pebble watching a tablet showing bright music notes and a dancing cartoon."
Why: the brief is that a screen never shows content. Happy content still carries risk once a video model animates it: an app interface, a logo, a recognisable cartoon character (copyright), or a face that appears out of the pattern. It also undoes the clean rule the animator can follow everywhere else: we never see the screen.
Fix: shoot the tablet from behind or from the side, so only its back or edge is visible, with soft music notes floating up out of the top of the tablet into the room. The joy is shown on Pebble, not on the screen.

**M4. The parent is told to keep the promise, but not how (parent note, after watching prompt, card ask2).**
Lines: "Then keep that promise the first time it is tested." (parent note in the script, and the live after_prompt in migration 400). Card ask2: "Then keep that promise."
Why: "keep the promise" is right, and it matches CEOP's advice for this age (never blame the child; respond with calm, loving support) and YoungMinds (avoid overreacting; shame or punishment may make them hide things next time). But the parent gets no steps for the moment itself, and no route for the rare telling that is more than upsetting: an adult talking to their child, or a sexual image. That is exactly when a calm parent with no plan can make the wrong move: deleting the evidence, questioning the child hard, or forwarding a screenshot of an image they must never keep. On a branch named for Roblox strangers, this gap is real.
Fix: the parent note beside the film (text, not narration) carries the five minutes. Suggested words:
"When they tell you: say thank you, stay calm, and look at the screen yourself so they don't have to describe it. They are not in trouble, even if a rule was broken. If someone was talking to them, don't delete anything: report it at ceop.police.uk. If it was a sexual picture of a child, don't save or share it, report the link to the IWF. If they are in danger now, call 999. Worried and not sure? NSPCC helpline, 0808 800 5000."
The CEOP and IWF line is deliberately split, because Childnet advises saving evidence, while CEOP advises never saving or screenshotting child sexual abuse material. A parent who hears only "save the evidence" could commit an offence by screenshotting an image.

## SHOULD fix

**S1. "Tell them what you saw" asks a four year old to describe it (c14, beat 9).**
Line: "Then, go and tell. Find your grown up, and tell them what you saw."
Why: describing it puts the child back in front of it, and it is hard at 4. The original gave the child ready words (original line 30: "Something on the screen made me feel yucky.") and told them they need not work out why (original line 27).
Fix: "Then, go and tell. Find your grown up and say: something gave me the uh oh feeling." The parent then looks for themselves (see M4).

**S2. Only one grown up (c14, c16, c22).**
Why: CEOP's message for 4 to 7 year olds is to tell a grown up they trust, and UKCIS says an adult I can trust. A child at a childminder's, at nan's or at school needs to know any trusted grown up counts, and so does the child whose own grown up is the problem.
Fix: in c14 or c21, add "your grown up, or another grown up you trust." Keep Childline out of this film (see section on help routes).

**S3. An outcome promised as fact (c20, beat 13).**
Line: "When you tell, the uh oh feeling gets smaller. Your grown up helps you carry it."
Why: the parent film rightly refuses to promise outcomes ("We claim a calmer conversation and a route, not an outcome"). The child film should hold the same line.
Fix: "Telling can help the uh oh feeling get smaller. Your grown up can help you carry it."

**S4. A certainty that should be a possibility (a01, parent film beat 1).**
Line: "One day, your child will see something on a screen that upsets them."
Why: stated as fact with no source, in a film whose own rules say no figures.
Fix: "One day, your child may see something on a screen that upsets them." If Justin wants the stronger word, it needs a cited UK figure in the script's "Checked before writing" section.

**S5. The parent needs an action other than removal (parent film, "What it does not say").**
Why: the film rightly never says "take the device away", but a parent will still want to do something, and some changes are sensible: CEOP advises that 4 to 7 year olds use devices in shared family spaces, not alone in a bedroom. If the tablet moves to the living room the morning after a telling, the child reads it as punishment for telling.
Fix: add to the parent note: "If you change anything afterwards, like a setting or where the tablet lives, do it later and tell them why: to keep them safe, never because they told you."

**S6. Source the reasoning behind a02.**
Line: "If telling you costs them the tablet, they may stop telling you."
Why: worded as "may", which is right. It has public support: YoungMinds' parents guide says shame or punishment might make a child hide things next time.
Fix: add the YoungMinds page to the parent script's "Checked before writing" list so the line has its proof path. No change to the words.

## COULD fix

**C1. The helpline after the product pitch (a06 then a07).** The safeguarding route comes after "you can book a time to watch it together". Swapping a06 and a07 puts help before product. Small, but it is the order a hostile expert would notice.

**C2. Turning it over does not stop the sound.** A face down tablet keeps playing. One clause in c13 ("Put the screen face down. Now you can't see it.") could add "and if it's noisy, bring your grown up to it." Or leave it to the parent note.

**C3. The high five game says "run" in the original (original line 44: "run as fast as you can").** The remake already says "run to them". Fine, but "hurry to them" avoids a parent wincing at running indoors.

## Lines in the original film to leave behind

The original is live and goes out first in its old pictures (14 November decision). If any of its lines are reused in the animated remake, these should not come across:

1. Original line 12: "Maybe a scary picture pops up." It describes the upsetting thing and plants the expectation. The remake's c08 ("It might be sad, or scary, or it just feels wrong") names the feeling, not the thing, which is right.
2. Original line 15: "And here's a secret." In a safeguarding film, "secret" should never be framed as a nice thing. Same line: "Your body is very clever. When something isn't right, your body tells you." That states as fact how bodies work, and it is not reliable for the cases in M2.
3. Original line 38: "They'll remember it forever." and line 45: "Now your body knows exactly what to do without even thinking." Both overclaim what two or three rehearsals can do.

## Help routes, checked

* **NSPCC helpline, 0808 800 5000, for adults worried about a child.** Correct. Confirmed on the UK government's kids online safety support page and on Childnet's parents page. The NSPCC's own pages refused automated fetches (HTTP 403), so I could not reread them directly today; the script records a check on nspcc.org.uk/helpline on 17 November. The hours genuinely conflict: the government page gives Monday to Friday 10am to 4pm, and a search summary of the NSPCC's report page gives 10am to 6pm on weekdays. The script's decision to give the number only, never the hours, is right. help@nspcc.org.uk is a useful second route for the parent note.
* **Childline, 0800 1111.** Free, 24 hours, for children and young people up to 19, per the government page and Childnet. A 5 year old is technically eligible, but for 4 to 7 the right route is a grown up they trust (CEOP's Tell a Grown Up message; UKCIS 4 to 7). Keep Childline out of this film. It belongs in Stage 2 onwards, as in 2.1. It is fine in the parent note as an optional extra.
* **CEOP (ceop.police.uk), the IWF, and 999.** Missing from both 1.4 films. They belong in the parent note, not the narration (see M4).

## Safe to animate: the animator's checklist

1. **We never see a screen.** Every tablet is shot from behind, side on, or face down. No interface, no logos, no characters, no faces, no text, no glow that suggests an image. This covers u05 and u06 too: show Pebble's face, not the screen. If a screen must be in shot, composite a flat static plate over it in post. Never let the video model draw it, because scribbles drift into eyes and faces.
2. **Pebble is unsure, never frightened.** No tears, no trembling, no screaming, no hiding under a blanket, no wide eyed fear. Light stays warm in every beat, with no darkening of the room in u06, no push in on the tablet, and no shadow falling across Pebble.
3. **No sound that frightens.** No music (house rule), no sting, whoosh, rumble or jump sound at the uh oh moment.
4. **The tablet is put down, not hidden.** Face down on an open table where a grown up would see it. Never under a cushion, in a drawer, behind Pebble's back, or carried off to another room.
5. **Nothing that models secrecy.** No finger to lips, no whispering, no looking back over a shoulder, no closing a door. The doorway Pebble runs to is open and warm.
6. **Hurrying is purposeful, not fleeing.** In u09 Pebble moves towards the light with a determined, cheerful face, not away from something chasing.
7. **No people.** No drawn human who could read as a real child or parent. If the grown up must appear, use a warm open doorway, or a clearly cartoon Planet Friend, never a realistic adult. No synthetic person presented as real, ever.
8. **Nobody is told off.** No looming silhouette, no pointing finger, no frown, no crossed arms. Nobody takes the tablet from Pebble, puts it on a high shelf or locks it away after the telling.
9. **The grey cloud stays soft.** In u10 it is small, light grey and floats up; no storm cloud, no face, no lightning.
10. **Real B roll is objects and places only.** A sofa, a cosy hallway, a tablet turned face down with its screen off. No real children, no stock footage of a child looking upset at a screen, and no child's hands. If a hand is needed, it is a consenting adult on the team, with the screen off.
11. **Off model frames get regenerated.** Any frame where a character changes colour, distorts or makes an unexpected expression (the test showed both) is regenerated before review, because a melting face is a frightening face to a four year old.
12. **Justin watches it with the sound on before anything goes anywhere** (the plan's rule), with this checklist beside him.

## Pages checked on the web, 18 November 2026

* CEOP Education, Jessie and Friends, parents page: https://www.ceopeducation.co.uk/parents/jessie-and-friends/ (tell a grown up they trust; never blame the child; calm, loving support; devices in shared spaces for 4 to 7).
* CEOP Education, what to do if you come across child sexual abuse material: https://www.ceopeducation.co.uk/parents/articles/what-to-do-if-you-come-across-child-sexual-abuse-material/ (report to the IWF and the platform; do not save or send it).
* Childnet, advice for parents when a child sees something upsetting: https://childnet.com/blog/advice-for-parents-what-to-do-if-your-child-sees-something-upsetting-online (stay calm and curious, avoid blame whether it was an accident or a search; helplines with numbers).
* Childnet, get help: https://www.childnet.com/parents-and-carers/get-help/ (reassure them they can always come to you; save evidence; CEOP for grooming, IWF for criminal content).
* UK Safer Internet Centre, the same advice: https://saferinternet.org.uk/blog/advice-for-parents-what-to-do-if-your-child-sees-something-upsetting-online
* YoungMinds, parents guide to social media: https://www.youngminds.org.uk/parent/parents-a-z-mental-health-guide/social-media/ (avoid overreacting; shame or punishment may make them hide things; they won't be in trouble for telling).
* UK government, kids online safety, where to get support: https://kidsonlinesafety.campaign.gov.uk/find-out-where-to-get-support (NSPCC 0808 800 5000, weekdays 10am to 4pm; Childline 0800 1111, 24 hours, up to 19; 999 in danger).
* UKCIS, Education for a Connected World, 2020 edition, page 6, Self image and identity, ages 4 to 7 and 7 to 11: https://assets.publishing.service.gov.uk/media/5efa05b4e90e075c5492d58c/UKCIS_Education_for_a_Connected_World_.pdf
* Tried and refused automated access (HTTP 403): nspcc.org.uk helpline and report pages, childline.org.uk contacting Childline. Numbers confirmed through the government and Childnet pages above instead.
