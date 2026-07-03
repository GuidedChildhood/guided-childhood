-- GUIDED CHILDHOOD CATCH UP · STEP 08 · scripts-expansion-2
-- Paste into a NEW query tab, Run, look for the COMPLETE message.



-- ============================ explorer ============================
-- Guided Childhood: Explorer stage scripts (ages 11 to 13). Run after seed.sql.
insert into public.scripts
  (stage_id, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order)
values
(
  'explorer',
  'The first serious social media request',
  'Your 11, 12, or 13 year old asks, seriously and repeatedly, to join Instagram, TikTok, or Snapchat because everyone in their year is on it.',
  'I can hear that this matters to you, and being left out of where your friends are is a real thing, not a small thing. I do not want to give you a yes or a no in the next ten seconds. I want us to actually look at it together first and decide properly.',
  'No. You are far too young and that is the end of it.',
  'A flat refusal at this age does not stop access, it moves it out of your sight onto a friend''s phone. The adolescent brain is wired to prioritise peer belonging, so the social cost of exclusion is felt as genuine threat. Slowing the decision down, rather than slamming it shut, keeps you in the room for every choice that follows.',
  'Tonight, ask them which platform matters most and why. Just listen. Do not decide anything yet.',
  'partial_ban',
  false,
  301
),
(
  'explorer',
  'Explaining how the algorithm decides what they see',
  'Your child believes their feed simply shows them what is popular or what their friends like, and has never questioned how it is chosen.',
  'Here is something most adults do not even know. Nobody at the company chose what is on your feed. A system watched what made you pause, and now it shows you more of that, on purpose, to keep you there longer. That is worth understanding, because once you see it you can see past it.',
  'It is all fake and designed to manipulate you, so do not believe any of it.',
  'Naming the mechanism gives a young person genuine power rather than fear. The developing prefrontal cortex is building the capacity for abstract reasoning at this stage, so they are newly able to grasp how a system optimises for attention. Understanding the design is what lets them resist it, far more than being warned that it is bad.',
  'Tonight, open your own feed and ask them to guess why each of the first five posts was chosen for you.',
  'none',
  false,
  302
),
(
  'explorer',
  'Walking through their feed together',
  'You want to understand what your child actually sees and experiences when they scroll, rather than guessing or assuming the worst.',
  'Would you show me round your feed for ten minutes. I am not checking up on you and I am not going to comment on every single thing. I genuinely want to see what it is like to be in there, because I cannot understand it from the outside.',
  'Hand me your phone, I want to see exactly what you have been looking at.',
  'There is a difference between being invited in and being inspected, and adolescents are acutely sensitive to which one is happening. Heightened social awareness means they read your intent before they read your words. Curiosity opens the feed to you. Surveillance closes it, and teaches them to keep a cleaner version for you and a real one for themselves.',
  'Tonight, ask for a guided tour, not an inspection. Let them be the expert for once.',
  'none',
  false,
  303
),
(
  'explorer',
  'Influencers and body image',
  'Your child is following accounts that present highly edited or idealised bodies, and is starting to compare themselves to them.',
  'A lot of what you are seeing has been lit, posed, filtered, and chosen out of hundreds of attempts. I am not saying that to be a downer. I am saying it because your body is changing fast right now, and it is unfair to measure a changing real body against a finished, edited image.',
  'You do not need to look like them, just stop following accounts that make you feel bad.',
  'At this stage the body is changing rapidly and self-image is forming around social comparison, which adolescents are biologically primed to do. Pointing out the construction behind the image, calmly and without panic, restores a sense of proportion. Telling them simply to unfollow skips the understanding that makes the choice stick.',
  'Tonight, find one before and after editing video together and just notice the gap. No lecture needed.',
  'none',
  false,
  304
),
(
  'explorer',
  'Setting up a first smartphone',
  'Your child is getting their own smartphone for the first time and you are deciding together how it will work.',
  'This is your phone now, and I want it to actually be yours. So let us set it up together this once. We will turn off the bits designed to hook you, agree where it sleeps at night, and write down what we both expect. Then it is yours to look after.',
  'There are going to be a lot of rules and I will be checking it whenever I want.',
  'The first setup sets the tone for years, and doing it as a shared project rather than a handover with conditions builds ownership. The adolescent brain responds far better to autonomy framed with structure than to control. Notifications and infinite feeds exploit dopamine driven novelty seeking, so dialling those down at the start is the single most useful thing you can do.',
  'Tonight, turn off non-essential notifications together and agree where the phone charges overnight.',
  'none',
  false,
  305
),
(
  'explorer',
  'Being left out of a group chat',
  'Your child discovers they have been removed from, or deliberately left out of, a group chat and is hurt by it.',
  'That really stings, and it is meant to. Being shut out of where your friends are talking is one of the most painful things at your age, and I am not going to pretend it is no big deal. I am here. Do you want to talk about what happened or just sit with it for a bit.',
  'It is only a group chat, just ignore them and find better friends.',
  'Social exclusion activates the same brain regions as physical pain, and at this age the wiring that makes belonging feel urgent is at its peak. Minimising the hurt teaches them you do not understand the stakes, so they stop bringing things to you. Naming the pain as real is what keeps the door open.',
  'Tonight, validate the feeling before offering any solution. Sometimes being heard is the whole repair.',
  'none',
  false,
  306
),
(
  'explorer',
  'Late-night scrolling and sleep',
  'You realise your child is scrolling late into the night and is exhausted, foggy, or short-tempered in the mornings.',
  'I am not raising this to take anything away. I am raising it because your sleep is taking a hit, and at your age sleep is doing huge work on your mood and your brain. Let us sort out how the phone can rest somewhere at night so you actually get that sleep.',
  'You are on that thing all night, no wonder you are a nightmare in the mornings.',
  'Adolescent sleep need is high and their body clock naturally shifts later, so a glowing, endlessly novel feed at bedtime is working directly against their biology. Sleep loss at this stage feeds low mood and poor focus. Framing it as protecting their sleep, not policing their phone, keeps it a shared problem rather than a battle.',
  'Tonight, agree a charging spot outside the bedroom and offer a cheap alarm clock so the phone has no excuse to stay.',
  'none',
  false,
  307
),
(
  'explorer',
  'Comparison and dipping self-esteem',
  'Your child seems flatter and more self-critical lately, often after time on their phone, comparing their life to what others post.',
  'I have noticed you have seemed a bit down on yourself. I want to say one thing and then drop it. You are comparing your whole messy inside to everyone else''s best ten seconds. That is not a fair fight, and it is not the truth about you.',
  'Stop comparing yourself to other people, it is pathetic and a waste of time.',
  'Identity is actively forming at this age, and social media offers an endless stream of curated highlights to measure against, which the comparison wired adolescent brain finds hard to resist. Self-esteem dips are common and usually not permanent. Naming the unfair comparison gently, without shaming the feeling, protects the relationship and the self-worth at once.',
  'Tonight, tell them one specific thing you genuinely admire about who they are, not how they look.',
  'none',
  false,
  308
),
(
  'explorer',
  'Worry about too much gaming',
  'You are concerned your child is spending too long gaming and struggling to stop when they say they will.',
  'I want to get this right rather than just nag you. Games are built by very clever people to be hard to put down, so the struggle to stop is not a flaw in you. Let us work out together what a good amount looks like, and what would actually help you stop when you mean to.',
  'You are addicted to that game, you need to get a life and go outside.',
  'Games are engineered around variable rewards that drive the dopamine system, and the adolescent brain, with its still maturing self-control, finds these especially gripping. Calling it addiction or laziness shames a normal response to good engineering design. Treating stopping as a shared design problem teaches a skill they will use for life.',
  'Tonight, ask them to show you one trick the game uses to keep them playing. Be curious, not cross.',
  'none',
  false,
  309
),
(
  'explorer',
  'Online friends they have never met in person',
  'Your child talks about friends they have made online, through games or apps, whom they have never met face to face.',
  'I am genuinely glad you have people you click with, and online friendships can be real and good. I am not going to tell you they are not real friends. What I do want is to understand who they are with you, because not everyone online is who they say, and that is just worth us keeping our eyes open about together.',
  'You have no idea who that person really is, stop talking to strangers online.',
  'For this generation online friendships are genuine social bonds, and dismissing them outright tells your child you do not understand their world. At the same time, the adolescent drive toward connection can outrun their still developing judgement about risk. Respecting the friendship while staying involved is what keeps them telling you the truth about it.',
  'Tonight, ask them to tell you about one online friend the way they would a friend from school. Stay interested.',
  'none',
  false,
  310
),
(
  'explorer',
  'A first calm conversation about nudes and pressure',
  'Your child is at the age where the topic of being asked to send a photo, or seeing one shared, may come up, and you want to have a calm first conversation before it does.',
  'I want to talk about something a bit awkward, calmly, before it ever comes up. Sometimes people get pressured to send photos of themselves. If anyone ever asks you, the answer is always no, and you will never be in trouble with me for telling me it happened. That door is always open.',
  'If you ever send a photo like that you will be in serious trouble, do you understand me.',
  'Leading with threat guarantees they will hide it if it ever happens, exactly when they most need an adult. Peer pressure carries enormous weight at this age, and the impulse to please can outpace the still developing brakes of the prefrontal cortex. A calm, blame free conversation in advance makes you the person they come to, rather than the person they fear.',
  'Tonight, plant one sentence: whatever happens, you will never be in trouble for telling me. Then leave it there.',
  'none',
  false,
  311
),
(
  'explorer',
  'Negotiating more screen autonomy',
  'Your child is pushing for more freedom over their own screen time and resents rules they feel are babyish.',
  'You are growing up and it makes sense that you want more say over your own time. I am up for that. Freedom and trust go together though, so let us agree what more freedom looks like, and how we both know it is going well. If it works, it grows.',
  'You get freedom when you earn it, and right now you have not earned anything.',
  'Autonomy is the central developmental task of adolescence, and rules that feel babyish breed exactly the rebellion they are meant to prevent. Granting expanding freedom tied to visible responsibility works with the developing brain''s need for independence rather than against it. Negotiation also models the very judgement you want them to build.',
  'Tonight, agree one specific freedom they gain this month and what keeps it. Write it down together.',
  'none',
  false,
  312
),
(
  'explorer',
  'The link between mood and the phone',
  'You have noticed your child often comes off their phone in a worse mood, but they have not made the connection themselves.',
  'I have noticed something and I am curious whether you have too. You often seem a bit flatter after a long scroll than before it. I am not saying give it up. I just wonder if it is worth us both noticing how different apps actually leave you feeling.',
  'That phone is making you miserable, anyone can see it, so just put it down.',
  'Self-awareness about emotional triggers is a skill that is only beginning to develop at this age, and a feed designed to maximise engagement is not designed to leave anyone feeling good. Inviting them to notice the pattern themselves builds a lasting internal compass. Telling them how they feel just provokes denial and shuts the noticing down.',
  'Tonight, ask them which app leaves them feeling best and which leaves them worst. Let the answer surprise you both.',
  'none',
  false,
  313
),
(
  'explorer',
  'A secret or second account',
  'You have discovered your child has a second, hidden account that you did not know about.',
  'I found out there is another account, and my honest first feeling was hurt. But before I get into that, I want to understand why. Most people your age have one for a reason that makes sense to them. Help me get it, and let us talk about how we move forward.',
  'A secret account, so you have been lying to me this whole time. I cannot trust you at all now.',
  'Hidden accounts are extremely common at this age and usually reflect a healthy drive for a private space away from adult and family eyes, not deception for its own sake. Identity formation needs room to experiment. Reacting with betrayal confirms that honesty leads to punishment, while seeking the reason keeps the relationship, and your influence, intact.',
  'Tonight, lead with curiosity about the why before any consequence. Understand it before you judge it.',
  'none',
  false,
  314
),
(
  'explorer',
  'Doomscrolling distressing news',
  'Your child has been scrolling through frightening or upsetting news and world events and seems anxious or overwhelmed by it.',
  'It looks like a lot of heavy stuff has been coming up on your feed, and it is genuinely hard to take in that much at once. It is good to care about the world. It is also fine to put it down for a bit. You are allowed to look after yourself and still be someone who cares.',
  'Stop reading the news if it upsets you, there is nothing you can do about any of it anyway.',
  'The feed surfaces alarming content because it captures attention, and the still developing brain has not yet built strong filters for managing a constant stream of distant threat. The result is anxiety without any outlet for action. Permitting them to care and to step back at the same time teaches sustainable engagement, rather than either numbness or overwhelm.',
  'Tonight, help them turn the feeling into one small real action, then agree it is okay to step away.',
  'none',
  false,
  315
),
(
  'explorer',
  'Wanting to become a creator or go viral',
  'Your child dreams of becoming a creator, getting followers, or going viral, and talks about it as a real goal.',
  'I love that you make things and want people to see them. That is brilliant. Let us make this about what you create, not just the numbers. The likes are designed to come and go and they will mess with your head if you let them be the point. The work you are proud of, that lasts.',
  'You are not going to become famous on the internet, focus on something real instead.',
  'The desire for status and recognition peaks in adolescence, and platforms convert that into chasing metrics that trigger dopamine in unpredictable bursts, which is hard on a developing reward system. Dismissing the dream loses their trust. Redirecting it toward craft and pride, rather than the volatile scoreboard of likes, protects their sense of worth while honouring the ambition.',
  'Tonight, ask to see something they have made and respond to the work itself, not the view count.',
  'none',
  false,
  316
),
(
  'explorer',
  'Privacy and their digital footprint',
  'Your child shares freely online and has not yet thought about how permanent and public their digital trail is.',
  'Here is something the apps will never tell you. What you post does not really disappear, and a version of it can follow you for years. I am not trying to scare you. I want you to be the one in charge of what is out there about you, instead of leaving that to chance.',
  'You are putting your whole life online and one day it is going to come back to bite you.',
  'Adolescents live intensely in the present, and the part of the brain that weighs long term consequences is still maturing, so the permanence of a post is genuinely hard to feel. Framing privacy as power and control, rather than as a warning about future regret, fits the developmental wish for autonomy and is far more likely to change behaviour.',
  'Tonight, search their name together and check their privacy settings as a shared project, with no judgement.',
  'none',
  false,
  317
)
on conflict (sort_order) do nothing;

-- ============================ shaper ============================
-- Guided Childhood: Shaper stage scripts (ages 13 to 15). Run after seed.sql.
insert into public.scripts
  (stage_id, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order)
values
(
  'shaper',
  'Something has gone wrong and they are scared to tell you',
  'You sense your teenager is carrying something heavy that happened online, but they are afraid of how you will react.',
  'Whatever it is, you are not in trouble for telling me. I would rather know and help than have you carry it alone. There is almost nothing you could say that we cannot sort out together. Take your time.',
  '"You can tell me anything, but you had better not have done something stupid." The threat cancels out the invitation and guarantees silence.',
  'At this age the threat-detection system is highly active while the brakes of the prefrontal cortex are still maturing, so fear of your reaction can outweigh the need for help. Leading with safety, not consequences, lowers that threat response and lets them think clearly. A teenager who believes coming to you is safe will come to you sooner next time, which is when problems are still small.',
  'Say out loud, with no problem on the table, that they will never be in trouble simply for telling you something. Plant it before they need it.',
  'none',
  false,
  401
),
(
  'shaper',
  'Heavy social media use and their mood',
  'You have noticed your teenager seems flatter or more irritable, and it tracks with long stretches on social media.',
  'I have noticed you seem a bit low lately, and I am not blaming the phone. I just want to understand how you are feeling. Can we talk about what is going on for you, on the apps and off them?',
  '"That phone is making you miserable, give it here." It treats the device as the whole cause and shuts down the conversation you actually need.',
  'Heavy passive scrolling is linked with lower mood in some teenagers, though the picture is complex and the phone is rarely the only factor. Leading with curiosity rather than blame keeps them talking, which is how you find the real driver. If low mood persists for more than a couple of weeks, affects sleep or appetite, or worries you, it is worth speaking to your GP or a mental health professional. You do not have to diagnose this alone.',
  'Ask one open question about how they have been feeling lately, and listen without mentioning the phone first.',
  'none',
  false,
  402
),
(
  'shaper',
  'Curious or accidental exposure to pornography',
  'You have learned your teenager has come across pornography, whether by accident, by curiosity, or sent by someone.',
  'I am not angry, and you are not in trouble. Being curious about sex and bodies is completely normal at your age. The thing is, a lot of what is online is not realistic and not how real relationships work, so I want us to be able to talk about it honestly.',
  '"That is disgusting, I never want to hear about you looking at that again." Shame teaches them to hide it and leaves the false picture uncorrected.',
  'Sexual curiosity is a normal part of adolescent development, and most teenagers will encounter pornography. Responding with shame drives the behaviour underground and removes your chance to provide context. Calm conversation lets you separate fantasy from real intimacy, consent, and respect. If the content was extreme, involved coercion, or you are worried about its effect, professional support through your GP or a counsellor is a sensible step.',
  'Decide your own calm opening line in advance, so that if this comes up you respond from a steady place rather than shock.',
  'none',
  false,
  403
),
(
  'shaper',
  'Extreme or radicalising content',
  'Your teenager is repeating extreme views or has been drawn into content that pulls them toward an us-and-them way of seeing the world.',
  'I have heard you say a few things lately that I want to understand better. I am not going to tell you what to think. I do want to know where these ideas are coming from and to think them through with you. Walk me through it.',
  '"That is poison and I forbid you from watching it." Forbidding it confirms the narrative that you are the enemy and they are being silenced.',
  'Adolescents are wired to seek identity, belonging, and certainty, which is exactly what radicalising content offers. Banning it can deepen the appeal and confirm the grievance the content feeds on. Staying curious and reasoning together keeps you inside their thinking, where you can introduce doubt and complexity. If you see fixation, secrecy, or talk of harm, contact your school safeguarding lead or local support services without delay.',
  'Ask them to explain one idea they have picked up, and stay genuinely curious rather than correcting.',
  'none',
  false,
  404
),
(
  'shaper',
  'Self-harm content in their feed',
  'Self-harm or other unhealthy content has started surfacing in your teenager''s feed, whether they sought it out or it was served to them.',
  'I have seen that some heavy stuff is showing up on your feed. I am not cross with you. I want to make sure you are okay, and I want to understand whether you are looking for this or it is just finding you. Either way, we are in this together.',
  '"I am deleting all your apps right now." A sudden cut-off can feel like punishment for struggling and may stop them telling you anything real.',
  'Recommendation algorithms can amplify distressing content once a teenager engages with it, deepening a low mood loop. Approaching with concern rather than punishment keeps them talking and lets you judge how serious things are. Self-harm content can normalise harmful behaviour, so it matters that they have a trusted adult, not an algorithm, to turn to. If you have any worry that your child is hurting themselves or thinking about it, contact your GP or a mental health professional promptly. You do not need to wait for certainty.',
  'Sit with them and look at how to mute or report this kind of content, so they feel some control over what reaches them.',
  'none',
  false,
  405
),
(
  'shaper',
  'Pressure, consent, and healthy relationships online',
  'Your teenager is navigating early romantic or sexual interest online, including pressure to send photos or do things they are unsure about.',
  'Anyone who really cares about you will never pressure you, and will always take a no without sulking or punishing you. Your body and your choices are yours. If anyone pushes, that tells you something about them, not about you. And you can always come to me.',
  '"Do not ever send pictures or you will ruin your life." Fear-based warnings make them too ashamed to come to you if something has already happened.',
  'Adolescents are highly sensitive to peer approval, which can make it hard to hold a boundary in the moment. Naming consent and pressure in advance gives them words and permission to refuse before they are tested. Framing it around respect rather than catastrophe keeps the door open if a mistake has already been made. If an image has been shared or they are being coerced, report it and seek support, including the police or a specialist service, rather than handling it alone.',
  'Tell them plainly that real care never comes with pressure, so they have the standard in their head before they need it.',
  'none',
  false,
  406
),
(
  'shaper',
  'Holding oversight while they grow independent',
  'Your teenager is asking for more privacy and less monitoring, and you are unsure how much to loosen the reins.',
  'You are getting older and you have earned more privacy. I am not trying to spy on you. My job is shifting from watching to trusting, and the way we keep that trust is honesty both ways. Let us agree what stays private and what I still need to know.',
  '"As long as you live here, I read everything on your phone." Total surveillance at this age breeds resentment and teaches them to hide better.',
  'Autonomy is a core developmental need in adolescence, and granting it in step with maturity supports healthy identity and self-regulation. Heavy-handed monitoring tends to push risky behaviour out of sight rather than reduce it. Shifting from control to negotiated trust keeps you informed of the things that matter most: safety, wellbeing, and who they are talking to. The aim is a teenager who chooses to tell you, not one who has been caught.',
  'Agree one thing you will stop checking and one thing you still need to know about, and say both out loud.',
  'none',
  false,
  407
),
(
  'shaper',
  'Gambling mechanics and loot boxes',
  'Your teenager is spending real or in-game money on loot boxes, skins, or other chance-based rewards in games.',
  'I want to show you something about how these games make money. Those boxes are built to feel like a win even when you lose, the same way a slot machine works. That does not make you daft for enjoying it. It means the design is clever, and I want you to see the trick.',
  '"You are wasting money on rubbish, no more." Banning it without explaining the mechanic leaves the susceptibility in place for the next time.',
  'Loot boxes use variable-ratio rewards, the same reinforcement schedule that makes gambling so compelling, and the adolescent reward system is especially responsive to it. Explaining the mechanism builds genuine resistance, because they learn to recognise the pattern rather than just obey a rule. Teenagers respect being treated as capable of understanding the trick. If spending becomes secretive, distressing, or hard to stop, that is worth taking seriously and may warrant professional support.',
  'Watch a short clip together explaining how loot boxes are designed, and ask them what they notice.',
  'none',
  false,
  408
),
(
  'shaper',
  'Pressure to perform as a creator',
  'Your teenager is posting content and is increasingly anxious about views, likes, followers, or going viral.',
  'I love that you make things. I want to check in on how it feels, not just how it performs. The numbers are not a measure of you. On the days the post does badly, you are exactly the same person you were the day before. Tell me how it has been.',
  '"It is just a silly app, stop caring what strangers think." It dismisses something that feels significant to them and ends the conversation.',
  'Adolescents are acutely tuned to social feedback, and likes and follower counts deliver that feedback in a fast, quantified, and public form. Tying self-worth to metrics can fuel anxiety and a fragile sense of identity. Separating who they are from how a post performs protects self-esteem while still honouring their creativity. If the pressure is causing real distress or compulsive checking, it is worth talking it through with a counsellor.',
  'Ask how creating actually feels day to day, and listen for whether it is bringing joy or just pressure.',
  'none',
  false,
  409
),
(
  'shaper',
  'Chronic sleep loss from devices',
  'Your teenager is regularly up late on their phone and is exhausted, struggling to wake, or running on empty.',
  'You are shattered, and your body genuinely needs more sleep than mine does right now. This is not me being strict for the sake of it. Let us solve the sleep problem together, because everything else gets harder when you are running on empty. What would actually help?',
  '"Phone off at nine, no argument." The flat rule invites a nightly battle and ignores that they need to own the solution to keep it.',
  'Adolescent body clocks shift later, so teenagers are biologically wired to feel awake at night, and screens plus notifications make settling harder. Sustained sleep loss affects mood, concentration, and mental health, all of which are already under strain at this age. Solving it with them rather than imposing it increases the chance the habit sticks, because autonomy supports follow-through. A consistent wind-down and the phone charging outside the room are the highest-impact changes.',
  'Ask them what they think would help them wind down, and build the plan around their answer.',
  'none',
  false,
  410
),
(
  'shaper',
  'Comparison and anxiety',
  'Your teenager seems to measure themselves against the lives, bodies, and successes they see online, and it is feeding anxiety.',
  'What you see on those feeds is the highlight reel, carefully chosen and often edited. You are comparing your whole messy inside to everyone else''s best outside. That is not a fair fight, and it would make anyone feel rotten. You are not falling behind.',
  '"Just stop comparing yourself, it is pointless." Telling them to stop a feeling they cannot control only adds the failure of not managing it.',
  'The adolescent brain is primed for social comparison as part of working out where they fit, and curated feeds supply an endless stream of upward comparisons. This can quietly erode self-esteem and feed anxiety. Naming the highlight-reel effect gives them a frame to question what they see rather than absorb it as truth. If anxiety is persistent or interfering with daily life, a GP or counsellor can help, and seeking that support is a sign of good parenting, not failure.',
  'Look at one polished post together and talk about what was likely cropped, staged, or left out.',
  'none',
  false,
  411
),
(
  'shaper',
  'Supporting a friend in crisis online',
  'Your teenager has a friend who is in distress online, perhaps talking about self-harm or feeling unsafe, and is carrying that weight alone.',
  'It says a lot about you that your friend trusts you. That is a heavy thing to hold by yourself, and you are not meant to carry it alone. Helping a friend in real trouble sometimes means telling a trusted adult, even if they asked you not to. That is not betrayal. That is keeping them safe.',
  '"That is not your problem, just block them and stay out of it." It abandons a frightened friend and teaches your child to look away from someone in need.',
  'Teenagers often become the first point of contact when a peer is struggling, and they can feel torn between loyalty and a promise of secrecy. Carrying that responsibility alone is a real burden and can affect their own wellbeing. Helping them understand when a secret must be shared to keep someone safe protects both the friend and your child. Make sure they know the relevant resources, such as a school counsellor, a GP, or a crisis line, and that adults exist to take this weight from them.',
  'Tell them clearly that a secret which could keep someone safe is one they are allowed to share with you.',
  'none',
  false,
  412
),
(
  'shaper',
  'Location sharing and personal safety',
  'Your teenager shares their location through apps, posts, or with friends, and may not have thought through who can see it.',
  'I am not worried about most of the people you share with. I want you to think about the edges. Who exactly can see where you are, and could that map be seen by someone you do not actually know? Let us go through the settings together so you are the one deciding.',
  '"Turn off all location sharing, it is dangerous." A blanket ban skips teaching the judgement they will rely on once you are not checking.',
  'Adolescents tend to focus on the immediate social benefit of sharing and underweight low-probability risks, partly because the brain''s reward system outpaces its risk-assessment system at this age. Helping them think through who can actually see their location builds lasting judgement rather than dependence on your rules. Putting them in charge of the settings respects their autonomy while raising their awareness. The goal is a teenager who shares deliberately, not by default.',
  'Go through their location settings together and have them decide who stays on and who comes off.',
  'none',
  false,
  413
),
(
  'shaper',
  'Their digital footprint and future',
  'Your teenager is posting freely without much thought for how it might look to a future employer, college, or their older self.',
  'What you post tends to stick around longer than the moment it was made for. I am not saying live in fear of it. I am saying post like a version of you in five years is reading it, because one day they will be. Would future you be glad this is out there?',
  '"One stupid post will ruin your whole life." Catastrophising makes them tune you out rather than think it through.',
  'Adolescents are wired to prioritise the immediate and social over the distant and abstract, so the long-term cost of a post is hard to feel in the moment. Offering a simple, concrete frame, picturing their future self, helps the still-developing prefrontal cortex weigh consequences without inducing paralysing fear. Treating them as capable of foresight tends to draw out more careful behaviour than threats do. The aim is thoughtful posting, not anxious silence.',
  'Ask them to pause before one post and consider whether they would be happy for future them to find it.',
  'none',
  false,
  414
),
(
  'shaper',
  'Standing firm against group pressure',
  'Your teenager is being pushed by a group chat or friends to join in on something they are uneasy about, like piling on someone or sharing a photo.',
  'It is genuinely hard to be the one who says no when everyone else is in. That takes more guts than going along with it. You are allowed to step back, stay quiet, or say it is not for you. If you need a way out, you can always blame me. Say your dad would lose it.',
  '"Just say no, it is simple." It is not simple under that much pressure, and saying so leaves them without a usable strategy.',
  'Peer influence peaks in adolescence, and the presence of peers measurably increases risk-taking by amping up the brain''s reward response. Acknowledging how hard it is to resist, rather than pretending it is easy, validates their real experience and keeps them listening. Giving them a concrete exit, including permission to blame you, hands them a workable tool for the moment of pressure. A teenager with a ready-made out is far more likely to use it.',
  'Offer yourself as the ready-made excuse, so they have a face-saving way out of group pressure.',
  'none',
  false,
  415
),
(
  'shaper',
  'Spotting misinformation and manipulation',
  'Your teenager shares or believes things they have seen online without checking whether they are true or who is behind them.',
  'A lot of what goes viral is designed to make you feel something fast, usually angry or scared, because strong feelings get shared. Before you pass something on, it is worth a pause: who made this, what do they want me to do, and is it actually true? You are smart enough to spot the play.',
  '"Do not believe anything you read online." Blanket cynicism is as useless as blanket trust and gives them no way to tell the two apart.',
  'Adolescents are developing critical reasoning but are also drawn to emotionally charged, identity-affirming content, which is exactly what manipulative material exploits. Teaching a few quick questions about source and intent builds media literacy they can apply themselves, which is far more durable than a rule. Framing them as capable of seeing the manipulation appeals to their growing desire for autonomy and respect. The goal is a discerning teenager, not a cynical or a credulous one.',
  'Take one thing they shared recently and work through together who made it and why.',
  'none',
  false,
  416
),
(
  'shaper',
  'Renegotiating the phone-free bedroom',
  'Your teenager is pushing back on the phone staying out of the bedroom at night, arguing they are old enough to manage it.',
  'You are older now, so let us talk about this properly rather than me just laying down the law. The reason is not trust, it is sleep. Your phone in arm''s reach at night makes good sleep almost impossible for anyone, me included. Let us find a version of this that works for you.',
  '"The rule is the rule, you are not special." Refusing to revisit a rule they have outgrown invites them to break it the moment you are not looking.',
  'As teenagers mature, rules imposed without negotiation lose their force, because autonomy is the developmental priority. The science on sleep, however, does not change: a phone in the bedroom disrupts sleep through notifications, late-night use, and the pull to check. Reopening the conversation respectfully, while holding the principle, models how to keep a sound boundary while honouring their growing independence. A charging spot just outside the room is a common compromise that keeps the principle intact.',
  'Sit down and renegotiate the bedroom phone rule together, holding the sleep principle while updating the detail.',
  'none',
  false,
  417
)
on conflict (sort_order) do nothing;
select 'STEP 08 COMPLETE · scripts-expansion-2' as status;
