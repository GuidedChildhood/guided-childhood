# Rehearsal Quality Audit

What children actually say in the ten core rehearsal scenarios, by age band, so the
role play prompt in `app/api/scripts/rehearse/route.ts` can be checked against
evidence rather than vibes. Paired with migration `074_rehearsal_evidence_bank.sql`,
which puts these findings into the expert knowledge bank the suggest prompt retrieves.

## Scenario by age: the typical child utterance

Register by band (Kuczynski et al; Blake and McAuliffe; Ofcom): 4 to 7 is egocentric,
body led, in the moment protest. 8 to 10 is fairness appeals and bargaining. 11 to 13
is peer norm appeals, everyone else. 13 to 15 is autonomy, privacy and trust appeals.
16+ is near adult negotiation, often quieter and more self aware.

| Scenario | 4 to 7 | 8 to 10 | 11 to 13 | 13 to 15 | 16+ |
|---|---|---|---|---|---|
| Screen or TV turned off | "No! I was watching it! You ruined it!" (tears, grabs remote) | "That's so unfair, I only just started. You let me yesterday." | "One more episode. Everyone at school has seen it except me." | "I'll turn it off in a minute. Why are you policing what I watch?" | "I manage my own time. I'll stop after this." |
| Phone or tablet handover | "It's mine! I need it!" (clings, runs off with it) | "Two more minutes, I just have to finish this level." | "My friends are still on. I'll miss everything in the chat." | "You don't trust me. Nobody else's mum takes their phone at night." | "It's my alarm. I'm not a kid." |
| Everyone else has a phone | "When do I get a phone?" (curiosity, copying) | "Literally everyone in my class has one. I'm the only one." | "I'm the only one not in the group chat. I don't know what's going on." | "You're ruining my social life. It's embarrassing." | "I need it for college and work anyway." |
| Cannot come off the game | "I haven't finished! I'll lose my stuff!" | "I can't pause it! My team needs me!" | "We're mid match. If I leave I let Alfie down and get a penalty." | "This is ranked. Ten more minutes. You don't get how it works." | "I'm in a session with mates, I'll come off after this one." |
| Bedtime resistance | "I'm not tired! One more story! I need a drink." (curtain calls) | "It's not even late. Callum goes to bed at ten." | "I'll sleep when I'm tired. Let me finish this video." | "I can't fall asleep this early anyway." (partly true, sleep phase shifts) | "Stop treating me like I'm ten." |
| Morning battles | "I don't want to go! My tummy hurts!" (won't dress) | "In a minute. I can't find my shoes. Why are you shouting?" | "I'm so tired. Stop going on at me." | Silence, headphones on, "I'm up. Leave me alone." | "I've got it handled." (hasn't) |
| Homework refusal | "It's too hard! I can't do it!" (tears, rips page) | "It's boring. I'll do it later. Why do I even need this?" | "Already done it." (hasn't) "The teacher never checks." | "It's my grade, not yours. Get off my back." | "I know what I'm doing. I've got a system." |
| Sibling device fights | "He grabbed it! It's MY turn! MUM!" | "She got twenty minutes more. Not fair. You always take her side." | "Why does he get a phone at his age when I had to wait?" | "Tell her to stay off my stuff and out of my room." | "Sort the kids out, nothing to do with me." |
| Social media comparison | (not typical at this age) | "Why can't I have TikTok? Everyone watches it." | "I look horrible in every photo. Why don't I look like her?" | "Everyone's life is better than mine. They all went out without me." | "I know it's fake. I still feel rubbish after scrolling." |
| Saw something upsetting online | Nightmares, sideways questions at bedtime: "Can bad men get in our house?" | "My friend showed me something on his phone. Am I in trouble?" | Goes quiet, deletes history. "It's nothing. Promise you won't take my phone?" | Tells a friend first. "If I tell you something you can't go mad." | "I dealt with it. I just wanted you to know." |

## Audit of the current prompts

What is right in `rehearse/route.ts` today:

1. The child prompt already asks for the blurt first, half sentences, real app and friend
   names, and softening when the parent stays calm. That matches the emotion coaching arc
   (child settles once felt) and the Ofcom picture of real digital life.
2. The suggest prompt encodes the canon correctly: two things are true, the calm confident
   boundary, name the feeling first, choice and collaboration, never a flat no. All five
   points check out against the named experts' published teaching.
3. The coach prompt leads with a genuine strength and ends on belief, which is Kennedy's
   most generous interpretation applied to the parent. Keep that.
4. The fallback lines are genuinely defensible: validate, hold, collaborate.

Recommendations, each a small prompt edit:

1. Add an age register line to the child prompt: at 4 to 7 protest is body led and
   egocentric, at 8 to 10 lead with fairness appeals and bargaining, at 11 to 13 lead
   with peer norms, at 13 to 15 lead with autonomy, privacy and trust. One sentence
   switched on `stage.id`. (Kuczynski et al; Blake and McAuliffe; Ofcom 2025.)
2. Add the flipped lid rule to the child prompt: while the child is at peak upset they do
   not respond to logic or consequences, only to being felt; reasoning starts working after
   the parent connects. Currently DiGi's child can soften on a well argued line alone.
   (Siegel and Bryson, The Whole Brain Child.)
3. Gaming realism: when the situation involves an online game, the child should reference
   the live match and teammates, because I cannot pause it is factually true and the best
   parents negotiate the match boundary, not the minute. (Childnet.)
4. Disclosure safety: when the situation involves upsetting content, make the child's first
   line fear of trouble or losing the device, and have the coach explicitly praise any
   parent line that says you are not in trouble and never suggest confiscation. (NSPCC;
   Internet Matters; Knibbs.)
5. Wire `getExpertKnowledge` into coach mode too, so feedback can cite the bank by name the
   way suggest mode already does. It is a three line change mirroring the suggest block.
   (House rule: every claim traceable to a named source.)
6. Add Ross Greene to the suggest prompt canon: the Plan B empathy step (I have noticed X
   has been hard, what is up) is the strongest documented fit for homework refusal and
   morning battles, and the canon currently has nothing for skill gaps. (Lives in the
   Balance.)
7. Make the win require two holds: instruct the child to push back at least once more after
   the first good parent line, so the parent practises holding the boundary under repeated
   protest, which is where real conversations are lost. (Kennedy sturdy leadership;
   Atkins say it once without wobble.)
8. Strengthen retrieval: pass the last one or two child messages into the
   `getExpertKnowledge` query alongside title and situation, since titles like The Bedroom
   Rule contain no topic keywords and the child's own words (game, fair, phone) are what
   the topic matcher in `lib/digi/brain.ts` keys on. (Bank retrieval design, brain.ts.)

## Suggested line patterns to ban

1. Bribes to end screens (come off now and you can have sweets): teaches that protest has a
   price, and the parent's job is the boundary, not the child's momentary happiness.
   (Kennedy.)
2. Because I said so: power without skill building; solves nothing the child was stuck on.
   (Greene, Plan A vs Plan B.)
3. Comparison to siblings (your sister never makes this fuss): fuels the fairness injury
   that drives sibling conflict at 8 to 10. (Blake and McAuliffe; Gottman.)
4. Sarcasm and mockery: contempt is the most corrosive pattern in any relationship.
   (Gottman.)
5. Threatening confiscation in a disclosure moment: drives the behaviour underground and
   ends future telling. (Internet Matters; NSPCC; Knibbs.)
6. Labels like you are addicted or that app is rotting your brain: shame closes the
   conversation before it starts, and the evidence does not support the label. (Knibbs;
   stages.ts notThis lines; Odgers.)
7. Minimising (it is just a game, you will get over it): the dismissing style emotion
   coaching exists to replace, and factually wrong for online matches. (Gottman; Childnet.)
8. Flat allow or deny endings: house non negotiable one, always a calibrated pathway.

## Sources

1. Dr Becky Kennedy, Good Inside: https://www.goodinside.com and
   https://fortune.com/well/article/dr-becky-potential-cost-of-not-setting-screen-time-boundaries-for-kids-has-never-been-higher/
   and the Tim Ferriss transcript https://tim.blog/2024/12/31/dr-becky-kennedy-good-inside-transcript/
2. Siegel and Bryson, The Whole Brain Child handouts: https://drdansiegel.com/whole-brain-child-handouts/
3. Gottman Institute, emotion coaching step five: https://www.gottman.com/blog/emotion-coaching-step-5-helping-the-child-problem-solve-and-setting-limits/
4. Ross Greene, Lives in the Balance (kids do well if they can, Plan B): https://livesinthebalance.org
5. Sue Atkins, smartphone scripts for parents: https://sueatkinsparentingcoach.com/2024/02/building-confidence-in-saying-no-to-smartphones-until-aged-14-tips-scripts-for-parents/
6. Catherine Knibbs, cybertrauma and children's healthy development: https://www.internetmatters.org/hub/author/catherineknibbs/
7. NSPCC, distressing online content: https://www.nspcc.org.uk/keeping-children-safe/online-safety/inappropriate-explicit-content/distressing-content/
8. Internet Matters, dealing with inappropriate content: https://www.internetmatters.org/issues/inappropriate-content/deal-with-it/
9. UK Safer Internet Centre, when a child sees something upsetting: https://saferinternet.org.uk/blog/advice-for-parents-what-to-do-if-your-child-sees-something-upsetting-online
10. Blake and McAuliffe 2011, eight year olds reject two forms of inequity: https://www.bu.edu/cdl/files/2013/08/BlakeMcAuliffe2011.pdf
11. Ofcom, Children and Parents Media Use and Attitudes 2025 (56 percent of ten year olds to 83 percent of eleven year olds own a smartphone): https://www.ofcom.org.uk/media-use-and-attitudes/media-habits-children/children-and-parents-media-use-and-attitudes-report-2025
12. Child Mind Institute, helping kids with transitions: https://childmind.org/article/how-can-we-help-kids-with-transitions/
13. Childnet, Fortnite guide for parents (no pause in online matches): https://www.childnet.com/blog/what-do-i-need-to-know-about-fortnite-a-guide-for-parents-and-carers/
14. BMC Womens Health 2022, why don't I look like her: https://bmcwomenshealth.biomedcentral.com/articles/10.1186/s12905-022-01845-4
15. Kuczynski et al, flirting with resistance, children's autonomy in middle childhood: https://pmc.ncbi.nlm.nih.gov/articles/PMC6366431/
