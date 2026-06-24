-- Guided Childhood — New Scripts Batch 2 (65 scripts)
-- Categories: screen-time, gaming, social-media, online-safety
-- Run AFTER 001_initial.sql and 002_add_category.sql
-- Sort orders: 101-115 (screen-time), 201-215 (gaming), 301-320 (social-media), 401-415 (online-safety)

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order)
values

(
  'foundation',
  'screen-time',
  'Asking for more screen time',
  'Your young child has used up their screen time for the day and is asking for more, becoming upset or persistent when you say no.',
  'I know you are not ready to stop, and that is completely normal. Your time is done for today, and that is not going to change. Let us find something fun to do together instead.',
  'Just five more minutes.',
  'Giving extra time when a child protests teaches them that persistence gets results, which makes every future limit harder to hold. Acknowledging their frustration without caving to it validates the feeling while keeping the boundary intact. Offering an alternative quickly redirects their energy before the upset escalates.',
  'Decide on your household screen time limit before tomorrow and write it somewhere your child can see it, so the rule exists before the argument does.',
  'none',
  true,
  101
),

(
  'foundation',
  'screen-time',
  'Screens before bed',
  'Your young child wants to watch something or play on a device in the hour before bed, and it has become part of their wind-down routine.',
  'Screens are done for the night now. Your brain needs time to slow down before sleep, and screens make that harder. Let''s do something calmer together.',
  'One more show won''t hurt.',
  'Blue light and fast-moving content raise alertness at exactly the time children need to be winding down, making it harder to fall asleep and reducing sleep quality. Framing it as brain science rather than a rule removes the battle of wills. A consistent pre-sleep routine without screens is one of the highest-impact things you can do for a young child''s mood and behaviour the next day.',
  'Tonight, turn off all screens one hour before your child''s bedtime and have something ready to replace it, a story, some drawing, or a quiet game.',
  'none',
  true,
  102
),

(
  'builder',
  'screen-time',
  'Refusing to stop when time is up',
  'Your child knows their screen time is up but flatly refuses to stop, either ignoring you, arguing, or having a meltdown.',
  'I can see you are really into what you''re doing. Time is still up. You can tell me about it while we sort out what''s next, but the screen is going off now.',
  'If you don''t stop right now, no screens for a week.',
  'Threatening a disproportionate consequence in a heated moment rarely gets followed through, which teaches children that limits are negotiable. Acknowledging their engagement shows you are not dismissing what matters to them, while still holding the line. Keeping the consequence predictable and proportionate is what actually builds compliance over time.',
  'Set a two-minute warning alarm tomorrow so your child gets a heads-up before time ends, giving their brain a chance to prepare rather than being cut off abruptly.',
  'none',
  false,
  103
),

(
  'builder',
  'screen-time',
  'Screens replacing outdoor play',
  'Your child is consistently choosing screens over playing outside or doing physical activity, and is resistant when you suggest going out.',
  'You''ve been on the screen for a while and your body needs to move. We''re going outside for thirty minutes. You can choose what we do out there.',
  'Get outside, screens are rotting your brain.',
  'Giving children a sense of agency over how they spend active time makes them far more likely to cooperate. Framing it as the body needing movement rather than screens being bad removes the shame and shifts it to something neutral and true. Regular physical activity is directly linked to better mood, focus, and sleep, which makes everything else in family life easier.',
  'Tonight, pick one outdoor activity your child actually enjoys and schedule it for this week rather than waiting for them to volunteer.',
  'none',
  false,
  104
),

(
  'builder',
  'screen-time',
  'Sneaking screen time',
  'You discover your child has been sneaking screen time, either getting up early, using a device after lights out, or hiding what they are doing.',
  'I found out you had the screen on when you were not supposed to. I''m not going to shout, but I do want to understand why. Can you tell me what was going on?',
  'That''s it, screens are gone for a month.',
  'Sneaking usually means the child feels the limit is either unfair or unachievable, and responding with curiosity gets you closer to solving the actual problem. A blanket punishment that feels disproportionate drives the behaviour underground rather than building honesty. The goal is a child who comes to you when they are struggling, and that only happens when they believe you will listen before you react.',
  'Have a calm ten-minute conversation tonight to find out whether the current screen time arrangement is working for your child and adjust anything that seems genuinely unreasonable.',
  'none',
  false,
  105
),

(
  'explorer',
  'screen-time',
  'Phone constantly out at meals',
  'Your child keeps their phone on the table or picks it up repeatedly during family meals, even when you have asked them not to.',
  'Phones away at meals is a family rule, and that includes mine. This is our time to actually talk. What''s going on with you today?',
  'Put that down, it''s rude.',
  'Calling out rudeness without a replacement behaviour leaves children with nowhere to go, whereas modelling the rule yourself removes the double standard that kills your credibility. Framing meals as connection time gives the rule a positive reason rather than just a prohibition. A genuine question immediately after redirects the energy into what the rule is actually for.',
  'Put your own phone in another room during dinner tonight before anyone else has to.',
  'none',
  false,
  106
),

(
  'explorer',
  'screen-time',
  'Screen time tied to mood',
  'You notice your child reaches for a screen the moment they feel bored, anxious, upset, or frustrated, and becomes difficult when access is removed.',
  'I''ve noticed you tend to reach for your phone whenever things feel hard. That''s really common, and I get it. I want to make sure you have other ways to deal with those feelings too, because the screen will not always be there.',
  'You need to stop using screens as a crutch.',
  'Screens are highly effective short-term mood regulators, which is why children and adults both reach for them instinctively. The problem is they do not build the emotional regulation skills that carry over into situations without a screen available. Naming the pattern without judgment opens a conversation rather than triggering defensiveness.',
  'Tonight, notice once when your child reaches for a screen after something frustrating happens, and gently name what you saw without making it a lecture.',
  'none',
  false,
  107
),

(
  'explorer',
  'screen-time',
  'Homework on a device with constant distraction',
  'Your child is supposed to be doing homework on a laptop or tablet but you can see they keep switching tabs, checking messages, or watching videos.',
  'How is the homework going? Let''s have a look together. I find it really hard to focus with notifications going off too, so let''s put the phone face down and put the laptop on do not disturb while you finish this.',
  'You''re never going to get anywhere if you can''t focus.',
  'Multitasking during study is one of the most researched productivity killers there is, reducing comprehension and increasing time on task significantly. Empathising with how hard it is to focus rather than criticising creates a shared problem rather than a character judgement. Helping them set up a distraction-free environment is more effective than expecting them to resist the pull of notifications through willpower alone.',
  'Tonight, try sitting with your child for just the first ten minutes of homework to help them get started without distractions, and see whether they stay on task once they have momentum.',
  'none',
  false,
  108
),

(
  'explorer',
  'screen-time',
  'Binge watching',
  'Your child has watched episode after episode for hours and shows no sign of stopping, even when they said they would only watch one or two.',
  'That''s a lot of episodes today. I''m not angry, but I want to check in. How are you actually feeling right now? Sometimes watching a lot in one go is a sign something else is going on.',
  'You''ve been staring at a screen all day, that''s disgusting.',
  'Shame shuts down conversation and increases the likelihood of hiding behaviour next time. Checking in first leaves space for your child to share if something is wrong, which is often the real story behind a binge. Autoplay is deliberately designed to remove the moment of decision, so blaming a child for not stopping ignores the system that was designed to keep them watching.',
  'Go and watch one episode of something your child loves alongside them tonight, and afterwards ask what they like about it rather than commenting on how long they have been watching.',
  'none',
  false,
  109
),

(
  'shaper',
  'screen-time',
  'Always on their phone, ignoring family',
  'Your teenager is perpetually on their phone, barely responds when spoken to, and seems more present with their online world than with your family.',
  'I feel like I''m losing you to your phone and I miss you. I''m not trying to control what you do, I just want some time where we''re actually together. Can we figure out something that works for both of us?',
  'You''re addicted to that thing, it''s not normal.',
  'Teenagers need increasing autonomy and respond very poorly to being pathologised or controlled, but they are also still hardwired to care what their parents think of them. Naming the feeling of missing them rather than attacking the behaviour shifts the conversation from a power struggle to a relationship conversation. Inviting them to find a solution together means they are far more likely to actually honour it.',
  'Pick one time slot this week, even thirty minutes, to do something with your teenager that is entirely their choice of activity, and leave your own phone in the other room.',
  'none',
  false,
  110
),

(
  'shaper',
  'screen-time',
  'Negotiating screen time limits',
  'Your teenager argues that your screen time rules are unfair, that their friends have no limits, and that you are treating them like a child.',
  'You''re right that you''re not a small kid anymore, and I do want to give you more control. Let''s talk about what you think is reasonable and why, and we can work out something together.',
  'As long as you live under my roof, my rules.',
  'Adolescence is the developmental stage where young people are supposed to be pushing for autonomy, and dismissing that drive rather than working with it creates conflict without a solution. Engaging them in genuine negotiation builds the self-regulation skills you actually want them to have as adults. A teenager who has agreed to a limit is far more likely to hold it than one who has had it imposed.',
  'Before your next conversation about screen time, write down three things you are actually willing to negotiate on so you can go in with genuine flexibility rather than just saying you will be reasonable.',
  'none',
  false,
  111
),

(
  'shaper',
  'screen-time',
  'Using screens to avoid difficult emotions',
  'You notice your teenager disappears into their phone or console whenever there is tension at home, something goes wrong at school, or they seem low.',
  'I''ve noticed you tend to head to your room and zone out when things feel tough. I do that too sometimes. I just want you to know you can talk to me, and I won''t make it into a big thing.',
  'You need to face your problems, not run from them.',
  'Avoidance is a completely normal human response to emotional discomfort, and shaming someone for it does not help them develop better coping strategies. Normalising it by including yourself removes the sting of being called out. Keeping the door open without pressure means your teenager is more likely to come to you when they are ready.',
  'Share something small you found hard this week with your teenager tonight, and be honest about how you dealt with it, even if you did not deal with it perfectly.',
  'none',
  false,
  112
),

(
  'shaper',
  'screen-time',
  'Comparing screen time to friends'' limits',
  'Your teenager tells you everyone else has unlimited screen time, that you are the only strict parent, and that your rules are making them a social outcast.',
  'I hear you, and I''m not going to pretend your friends all have the same limits we have. I also can''t parent based on what every other family does. What I can do is explain why I''ve made the choices I have, and I''m genuinely open to hearing what feels unfair to you.',
  'I don''t care what other parents do.',
  'Dismissing the comparison entirely closes the conversation and makes your teenager feel unheard, whereas engaging with it while holding your position models how to have a principled disagreement. Explaining your reasoning treats them as someone capable of understanding, which is what teenagers want. Asking what feels unfair opens the door to genuine negotiation without abandoning the rule.',
  'Tonight, actually ask your teenager what specific limits feel most unfair and listen fully before you respond, even if you end up keeping the same rules.',
  'none',
  false,
  113
),

(
  'independent',
  'screen-time',
  'Managing their own screen time as a young adult',
  'Your older teenager or young adult is starting to manage their own schedule and you are concerned they are spending too much time on screens without any structure.',
  'You''re at an age where you get to decide how you use your time. I just want to ask how you feel it''s going. Do you feel like you''re getting what you want out of life, or does the screen time feel out of balance?',
  'You need to sort yourself out, this is ridiculous.',
  'Young adults respond to being treated as capable of self-reflection far better than to being told what to do. Asking how they feel about their own choices respects their autonomy while opening a real conversation. The goal at this stage is helping them develop the internal monitoring skills they will need for the rest of their lives, not enforcing a rule.',
  'Share something you have changed about your own screen use recently and why, as a peer conversation rather than a parenting lesson.',
  'none',
  false,
  114
),

(
  'independent',
  'screen-time',
  'Late night phone use affecting sleep',
  'Your older teenager or young adult is routinely on their phone until one or two in the morning and is struggling to function during the day as a result.',
  'I can see you''re exhausted and I think the late night phone use is part of it. You''re old enough to make your own choices, but I''d love to share what the research says about sleep and phones because it genuinely surprised me. Can I send you something?',
  'You look terrible, you need to go to sleep at a normal time.',
  'Criticising appearance or lecturing about choices that feel autonomous to a young adult shuts the conversation down immediately. Offering information as something worth knowing rather than a corrective keeps the relationship collaborative. At this stage your job is to equip them with evidence and then trust them to act on it, which is also the only approach that actually works.',
  'Find one short, credible article about phones and sleep quality tonight and send it with a one-line message rather than a lecture, then leave it at that.',
  'none',
  false,
  115
),

(
  'foundation',
  'gaming',
  'Getting their first console',
  'Your child is getting access to a games console for the first time and you want to set clear expectations before they start playing.',
  'This is really exciting. Before we switch it on, let''s agree on the rules together so everyone knows what to expect. How long do you think is fair each day?',
  'You can play whenever you want, just don''t overdo it.',
  'Setting expectations before a habit forms is far easier than trying to pull back after one has formed. Inviting a child to name what they think is fair gives them ownership of the limit, which dramatically increases their likelihood of following it. Getting the rules in place before the console is switched on means the boundaries are established rather than invented in conflict.',
  'Sit down with your child before their first gaming session and write three simple house rules on paper together, then stick them somewhere visible near the console.',
  'none',
  true,
  201
),

(
  'builder',
  'gaming',
  'Gaming instead of homework',
  'Your child wants to game before doing homework and argues they will do it later, or says they need to finish a game before they can concentrate.',
  'I know you want to game first. We''ve got a rule in this house that homework comes before screens, and that''s not going to change today. Once it''s done you can game for your usual time.',
  'If you don''t do your homework now I''m cancelling your gaming for the week.',
  'Homework first is a simple, consistent rule that removes the daily negotiation that drains everyone''s energy. A disproportionate threat rarely gets carried out, which erodes your authority and the child''s trust in your word. Keeping the consequence predictable and directly connected to the situation teaches children that the system is fair even if they do not like it.',
  'Set a consistent after-school routine this week where gaming does not start until homework is done, and hold it the same way every day regardless of how much pushback you get.',
  'none',
  false,
  202
),

(
  'builder',
  'gaming',
  'Aggressive behaviour after gaming',
  'Your child comes off a gaming session and is noticeably more aggressive, rude, or emotionally dysregulated than before they started.',
  'I''ve noticed you''re really wound up after gaming lately. I''m not blaming the game, but your body needs a bit of time to calm down before we can talk or have dinner. Let''s give you ten minutes to decompress.',
  'Those games are making you violent, I''m getting rid of them.',
  'The post-gaming emotional spike is real and is related to the transition out of a high-stimulation state rather than necessarily the content of the game. Blaming the game and threatening removal usually escalates the moment and misses the actual issue. Building a deliberate wind-down buffer between gaming and family life is a practical solution that addresses what is actually happening physiologically.',
  'Build a ten to fifteen minute gap between screen-off and the next family demand tomorrow, and watch whether the transition goes differently.',
  'none',
  false,
  203
),

(
  'builder',
  'gaming',
  'Online gaming with strangers',
  'Your child mentions they have been playing games online with people they do not know in real life and chatting with them during gameplay.',
  'Who are you playing with? Tell me about them. I''m not going to stop you playing, but I want to make sure you know the rules about what''s safe to share with people you only know online.',
  'You are not allowed to talk to strangers online, full stop.',
  'A blanket ban without explanation does not build the judgement skills children need as they get older and gain more independence online. Teaching the specific rules around what to share and what to keep private is more durable and more honest. Children who understand why a rule exists are more likely to apply that thinking in new situations you have not anticipated.',
  'Play an online game with your child tonight and ask them to show you how they interact with other players so you can see exactly what is happening and have a real conversation about it.',
  'none',
  false,
  204
),

(
  'builder',
  'gaming',
  'Requests for in-game purchases',
  'Your child is asking to buy in-game items, passes, or currency and does not fully understand that real money is involved.',
  'Let me show you what that actually costs in real money. That skin costs the same as a trip to the cinema for both of us. I''m not saying never, but I want you to understand what you''re asking for before we decide.',
  'You are not getting anything, those games are just trying to take our money.',
  'Children often genuinely do not connect digital currency to real-world money, so dismissing the request without educating them misses an important learning opportunity. Translating the cost into something concrete and meaningful to them builds financial literacy at an age when habits are forming. Leaving the door open to a considered yes rather than a flat no keeps the conversation collaborative and honest.',
  'Tonight, look up one item your child has asked for and show them the real pound equivalent together, then decide together whether it is worth it.',
  'none',
  false,
  205
),

(
  'explorer',
  'gaming',
  'Gaming until very late',
  'Your child is staying up far later than agreed gaming, either because they lost track of time or because they kept pushing for just one more game.',
  'It''s really late and you''re going to be exhausted tomorrow. I''m not going to have a big argument about it now, but we need to talk tomorrow about what went wrong tonight and how we fix it.',
  'That''s it, no gaming for the rest of the week.',
  'Having the serious conversation when everyone is tired and frustrated rarely goes well. Holding the consequence for a calm moment the next day is not letting it go, it is being strategic. Sleep deprivation at this age has a significant impact on mood, learning, and mental health, and addressing the system that caused it rather than just punishing the outcome is more likely to change the behaviour.',
  'Tomorrow, sit down together and identify specifically what caused the overrun, whether it was no alarm, just one more game thinking, or something else, and put one practical fix in place.',
  'none',
  false,
  206
),

(
  'explorer',
  'gaming',
  'Online gaming friends they have never met',
  'Your child has formed genuine friendships with people they only know through gaming and talks about them as real friends, even though they have never met.',
  'It sounds like you''ve built some real connections through gaming, and that''s actually pretty cool. I want to understand more about who they are. What do you know about them outside of gaming?',
  'They are not real friends, you don''t even know them.',
  'Online friendships can be genuinely meaningful and dismissing them damages your credibility and your child''s trust in your understanding of their world. The safety issue is real, but it is not served by negating the relationship. Asking what your child knows about these friends opens a conversation about what is actually shared versus assumed, which is far more useful than a blanket dismissal.',
  'Ask your child to introduce you to one of their gaming friends by showing you their profile or messages, and respond with genuine curiosity rather than suspicion.',
  'none',
  false,
  207
),

(
  'explorer',
  'gaming',
  'Losing badly and getting angry',
  'Your child is getting extremely frustrated and angry when they lose at games, sometimes to the point of shouting, crying, or throwing things.',
  'I can see you''re really frustrated. Losing is genuinely annoying. When you''re ready to talk about what happened, I''m here. For now, step away from the screen for a few minutes.',
  'It''s just a game, calm down.',
  'Telling someone to calm down rarely helps them calm down, and minimising the frustration with "it''s just a game" teaches children that their feelings are disproportionate rather than manageable. Strong reactions to losing are developmentally normal at this age and are an opportunity to build emotional regulation skills. The brief pause before re-engagement is a practical tool that gives the nervous system a chance to reset.',
  'After the next gaming session, ask your child to describe a moment when they nearly lost their temper but held it together, and acknowledge that effort specifically.',
  'none',
  false,
  208
),

(
  'explorer',
  'gaming',
  'Obsessive gaming, nothing else matters',
  'Your child is refusing to do anything except game, has dropped hobbies they used to love, is neglecting friends, and becomes extremely agitated if gaming is limited.',
  'I''ve noticed gaming has become the only thing you want to do and I''m a bit worried. I''m not going to take it away, but I do want to understand what''s going on. Is there something that feels hard about the other parts of your life right now?',
  'You are addicted and we are doing something about it.',
  'Using the word addiction is alarming to children and parents alike but often oversimplifies what is happening, which is frequently that gaming meets a need that is not being met elsewhere. Asking what is hard about non-gaming life rather than attacking the gaming itself gets closer to the real issue. Complete removal of the coping mechanism before an alternative is in place usually makes things worse.',
  'Tonight, ask your child to show you one game they love and genuinely try to understand what they enjoy about it, without any agenda attached.',
  'none',
  false,
  209
),

(
  'shaper',
  'gaming',
  'Gaming culture and toxic masculinity',
  'Your son is spending a lot of time in gaming communities where misogynistic, racist, or bullying language is normalised and he has started using similar language himself.',
  'I''ve heard some of the language you use when you''re gaming and I want to talk about it. I''m not trying to embarrass you, but some of what I heard isn''t okay. Where do you think that comes from?',
  'That language is disgusting, I''m shutting down the gaming completely.',
  'Language absorbed through high-engagement social environments is genuinely sticky and will not disappear just because gaming is removed. Asking where it comes from invites your teenager to examine it rather than just defend it. A thoughtful conversation about how gaming communities can normalise harmful attitudes builds critical thinking that carries far beyond this specific context.',
  'Watch a short video together about gaming culture and toxic masculinity tonight, and ask your teenager what they think of it rather than telling them what to think.',
  'none',
  false,
  210
),

(
  'shaper',
  'gaming',
  'Gambling mechanics in games',
  'Your teenager is spending money on loot boxes, battle passes, or other randomised reward systems in games and does not seem to recognise the similarity to gambling.',
  'Do you know how loot boxes work? They''re actually designed using the same psychology as slot machines. I''m not saying you''re gambling, but I want you to understand what you''re actually paying for before we talk about whether it''s worth it.',
  'That is gambling, end of story.',
  'Framing loot boxes as straightforwardly gambling shuts down conversation with someone who does not experience them that way. Explaining the psychology of variable reward schedules invites intellectual engagement and gives your teenager a framework for making more informed decisions. Building awareness of persuasive design is a genuinely transferable skill in a world full of systems designed to exploit psychological vulnerabilities.',
  'Look up how variable reward schedules work together tonight and have a genuine conversation about where else your teenager encounters them beyond games.',
  'none',
  false,
  211
),

(
  'shaper',
  'gaming',
  'Serious esports ambitions',
  'Your teenager wants to pursue competitive gaming professionally, talks about it constantly, and uses it to justify excessive gaming hours.',
  'I can see how much this means to you and I''m not dismissing it. Professional gaming is real. I want to understand what the actual path looks like though, because the odds are genuinely difficult and I''d feel better supporting your dream if we both understood what it takes.',
  'That is not a real career, stop wasting your time.',
  'Dismissing a serious aspiration without engaging with it damages trust and rarely changes the behaviour. The esports industry is real, but the path to a professional career is genuinely competitive and most parents and teenagers have an inaccurate picture of what it requires. Researching it together opens a conversation that is both honest and respectful of what your teenager cares about.',
  'Ask your teenager to share three professional gamers they respect and spend twenty minutes genuinely reading about how those specific people built their careers.',
  'none',
  false,
  212
),

(
  'shaper',
  'gaming',
  'Gaming to cope with anxiety',
  'You suspect your teenager is using gaming heavily as a way to manage anxiety, avoiding social situations, school stress, or anything that feels threatening.',
  'I''ve noticed you often game when things feel overwhelming, and I get why that helps. I want to make sure you''re also building some other ways to cope, because gaming isn''t going to be available in every hard situation you face.',
  'You need to face your anxiety, not hide from it.',
  'Gaming is a genuine and effective short-term anxiety reducer for many people, and naming it as hiding dismisses something that actually works, just not sustainably. The issue is not the gaming but the absence of other tools. Acknowledging what works while gently building alternatives is a more realistic and compassionate approach than demanding they stop using their main coping mechanism.',
  'Ask your teenager''s GP about a referral for anxiety support if you have not already, regardless of how the gaming conversation goes.',
  'none',
  false,
  213
),

(
  'independent',
  'gaming',
  'Healthy gaming versus addiction',
  'Your older teenager or young adult games heavily and you are trying to understand whether this is a healthy hobby or something that has become a problem.',
  'I''m not trying to pathologise what you enjoy. I''m just curious how you feel about your gaming. Do you feel like it''s adding to your life or taking away from things that matter to you?',
  'You are clearly addicted and you need help.',
  'Gaming disorder is a genuine clinical condition but is also overdiagnosed by worried parents. The key indicators are not hours played but whether gaming is displacing things the person genuinely values and whether stopping causes significant distress. Asking someone to self-reflect rather than telling them they have a problem opens a far more honest conversation.',
  'Share an honest reflection on your own relationship with something you do to unwind, whether it is screens, food, exercise, or anything else, as a way of making the conversation feel equal rather than clinical.',
  'none',
  false,
  214
),

(
  'independent',
  'gaming',
  'Gaming affecting university or work',
  'Your young adult is missing lectures, arriving late to work, or failing to complete responsibilities because of late-night gaming.',
  'I''m worried about what''s happening with your commitments. Not the gaming itself, but the impact it''s having. You''re missing things that matter for your future. What''s going on?',
  'Gaming has ruined everything, this has to stop.',
  'Framing the conversation around impact rather than gaming itself is far more likely to land with a young adult who will otherwise feel unfairly targeted. The question of what is going on opens the possibility that the gaming is a symptom of something harder, whether that is depression, anxiety, social difficulties at university, or something else worth addressing. External consequences like missing work are often the moment when the cost of the behaviour becomes concrete enough to motivate change.',
  'Ask your young adult what would need to be true for them to feel good about how things were going at university or work, and listen to their answer without steering it toward gaming.',
  'none',
  false,
  215
),

(
  'builder',
  'social-media',
  'Too young for a first social media account',
  'Your child is asking to create a social media account and is under the minimum age, insisting that all their friends have one.',
  'I know it feels like everyone has one. The age limit exists because these platforms are designed for older brains, and I''m not willing to sign you up for something that wasn''t built for you yet. Let''s look at what we can do instead so you don''t feel completely left out.',
  'Absolutely not, end of conversation.',
  'A flat refusal without an explanation leaves children with no understanding to carry forward and tends to drive the behaviour underground. The age limit on social media platforms is not arbitrary; it reflects genuine concerns about the impact of these environments on developing brains and sense of identity. Offering an alternative rather than just a no gives the conversation somewhere to go.',
  'Find out which specific platform your child is asking about and read the age requirement and the reasons behind it together, so the explanation comes from evidence rather than just parental preference.',
  'full_ban_u16',
  true,
  301
),

(
  'explorer',
  'social-media',
  'Asking for Instagram at twelve',
  'Your twelve-year-old is asking for an Instagram account and arguing that they are mature enough to handle it.',
  'I hear you and I know twelve feels plenty old enough. Instagram is designed to keep you on it as long as possible, and that system is genuinely harder to handle than most adults realise, let alone at twelve. I''m not saying never, but not yet.',
  'You''re twelve, you''re not having it.',
  'Saying no because of age alone sounds arbitrary to a child who does not feel twelve years old inside. Explaining that the platform is deliberately engineered to exploit psychological vulnerabilities like social comparison and reward seeking makes the refusal make sense. It also plants a seed of critical awareness about platform design that will serve them when they do eventually have access.',
  'Watch a short documentary or news segment about how social media platforms are designed tonight with your child, without making it a lecture about their specific request.',
  'full_ban_u16',
  false,
  302
),

(
  'explorer',
  'social-media',
  'Comparing followers and likes',
  'Your child is visibly upset about having fewer followers or likes than peers and is talking about their self-worth in terms of these numbers.',
  'Those numbers feel really real right now, and I understand why. But I want you to know that the people who built these apps specifically designed them to make you feel like the numbers matter, because it keeps you checking. You are not what your follower count says you are.',
  'Likes don''t matter, stop being so shallow.',
  'Calling out the behaviour as shallow misidentifies the problem and shames a child for responding normally to a system that was deliberately designed to provoke exactly this response. Explaining the mechanics of how these platforms manufacture feelings of social comparison gives children a framework for understanding their own reaction rather than feeling pathetic for having it. That framework is protective and lasts beyond the immediate conversation.',
  'Ask your child to tell you about a time when they felt genuinely good about themselves that had nothing to do with what anyone else thought, and stay with that conversation.',
  'full_ban_u16',
  false,
  303
),

(
  'explorer',
  'social-media',
  'Posting content they might regret',
  'Your child is posting photos, videos, or comments on social media that feel impulsive or attention-seeking and that you worry they will regret.',
  'I saw that post and I want to talk about it, not to embarrass you but because I''m not sure you''ve thought through who might see it and what they might think. Can we talk about it?',
  'Delete that right now, what were you thinking?',
  'Demanding immediate deletion creates shame and conflict without addressing the underlying judgement gap. Asking whether they have thought through the audience invites reflection and builds the habit of considering permanence before posting. The internet''s memory is much longer than a teenager''s embarrassment threshold, and this conversation is an opportunity to build a practical heuristic they can apply going forward.',
  'Use the conversation tonight to create a simple personal rule together, something like posting nothing you would not show a teacher or a grandparent, and write it down.',
  'full_ban_u16',
  false,
  304
),

(
  'explorer',
  'social-media',
  'Seeing something upsetting on TikTok',
  'Your child has seen disturbing, distressing, or age-inappropriate content on TikTok and is either upset, fascinated, or pretending they are fine when they are clearly not.',
  'Tell me what you saw. I''m not going to overreact, I just want to understand. Sometimes TikTok shows people things that no one asked to see, and it''s okay if it''s made you feel weird or uncomfortable.',
  'You should not have been on there in the first place.',
  'Responding to distress with blame ensures your child will not come to you next time, which is the one outcome you most want to avoid. Normalising the experience of accidentally encountering disturbing content and responding calmly means your child feels safe being honest with you. The goal of this conversation is connection and processing, not a lesson about platform usage.',
  'Check the content settings and parental controls on TikTok together tonight, and treat it as something you are doing with them rather than to them.',
  'full_ban_u16',
  false,
  305
),

(
  'explorer',
  'social-media',
  'Following people they do not know',
  'Your child is following and engaging with a large number of accounts of people they have never met, including adults and influencers.',
  'I''ve noticed you follow quite a few people you''ve never actually met. I''m not saying you can''t, but I want to understand who they are. Can you show me some of them and tell me what you like about their content?',
  'You''re not allowed to follow strangers.',
  'Blanket bans on following unknown accounts are unworkable and ignore the reality of how social media is actually used. The genuine concern is not following public figures but following people who might be interested in your child for the wrong reasons. Asking your child to walk you through who they follow creates a shared understanding and keeps the conversation going rather than going underground.',
  'Look through your child''s following list together tonight with genuine curiosity, not surveillance, and talk about what draws them to particular accounts.',
  'full_ban_u16',
  false,
  306
),

(
  'explorer',
  'social-media',
  'Social media affecting sleep',
  'Your child is checking social media late at night and their sleep is visibly suffering as a result, affecting their mood and school performance.',
  'I know it''s hard to put the phone down at night when things are happening online. Your brain actually cannot switch off properly while you''re still checking notifications. Can we try phones out of the bedroom for one week and see what happens?',
  'Give me your phone at nine o''clock or I''m taking it.',
  'An ultimatum delivered in frustration rarely sticks and creates nightly conflict. Offering a time-limited experiment that is about evidence rather than control gives your child some agency and frames it as a test rather than a punishment. Sleep deprivation in early adolescence is closely linked to anxiety, depression, and impaired learning, which makes this one of the highest-impact things a parent can address.',
  'Charge your own phone outside your bedroom tonight too, and mention it to your child so it feels like a family change rather than a targeted rule.',
  'full_ban_u16',
  false,
  307
),

(
  'shaper',
  'social-media',
  'Performing for social media rather than living',
  'Your teenager seems to be making decisions, attending events, or styling themselves entirely around what will look good online rather than what they actually enjoy.',
  'I''ve noticed a lot of what you do lately seems to be about what it looks like online. That''s completely normal at your age, but I want to check in. Is there stuff you genuinely want to do that doesn''t make it to the feed?',
  'You''re turning your whole life into a performance, it''s exhausting to watch.',
  'The pressure to perform a curated identity online is a genuine and documented challenge for this age group and is not a character flaw. Shaming it pushes the behaviour underground while leaving the underlying need unaddressed. Asking about what they do or enjoy outside the feed creates space for your teenager to separate their actual self from their online persona, which is developmentally important.',
  'Ask your teenager to do one thing with you this week that they agree in advance will not go on social media, and leave it at that.',
  'none',
  false,
  308
),

(
  'shaper',
  'social-media',
  'Being caught in an online pile-on',
  'Your teenager is either the target of an online pile-on or you discover they have participated in one against someone else.',
  'I need to understand what happened here. Whether you were on the receiving end or part of it, online pile-ons cause real harm that does not disappear when the phone goes down. Tell me what you know about how it started.',
  'How could you do that to someone, that''s disgusting.',
  'If your teenager participated in the pile-on, shame closes down the conversation you need to have about why it happened and what responsibility looks like. If they were the target, they need your support, not a post-mortem. Either way, curiosity before judgement gets you further. Group dynamics online are powerful and teenagers are particularly susceptible to them, which is worth understanding rather than just condemning.',
  'If your teenager was a participant, help them think through one step they could take to reduce the harm, whether that is removing a comment, messaging the person privately, or something else, and support them to do it.',
  'none',
  false,
  309
),

(
  'shaper',
  'social-media',
  'Fear of missing out driven by social media',
  'Your teenager is anxious about not being at events, not being included in things, or missing out on what appears to be an exciting social life happening without them.',
  'That feeling of everyone being somewhere amazing without you is really common and it''s genuinely uncomfortable. It''s also worth knowing that what you''re seeing online is people''s highlight reel, and even they don''t feel as good as it looks most of the time.',
  'Life is not what you see on Instagram.',
  'Telling teenagers that social media is fake does not make the feeling go away, but contextualising it as a curated performance rather than reality is more useful because it names something specific. The anxiety of missing out is a normal social pain point that social media amplifies deliberately, and naming the mechanism rather than just dismissing the feeling gives your teenager something to hold onto.',
  'Ask your teenager about one thing in their actual life right now that feels genuinely good, however small, and spend time on that answer tonight.',
  'none',
  false,
  310
),

(
  'shaper',
  'social-media',
  'Sexting or pressure to share images',
  'You discover your teenager has sent or received intimate images, or they tell you they are being pressured to do so.',
  'Thank you for telling me, or for me finding out rather than this staying hidden. I''m not angry with you. What''s happened is serious and we need to deal with it together, and I''m on your side in doing that.',
  'How could you be so stupid.',
  'Shame is the single biggest barrier to teenagers getting help when something like this happens, and the fear of a parent''s reaction often stops disclosure entirely. If your teenager has come to you, protecting that trust is the most important thing you can do in this moment. The practical, legal, and safety considerations can all be addressed once you have established that you are a safe person to be honest with.',
  'If intimate images have been shared without consent, report it tonight to the platform and, if appropriate, to the Revenge Porn Helpline, and do it together with your teenager present so they feel part of the process rather than handed over.',
  'none',
  false,
  311
),

(
  'shaper',
  'social-media',
  'Influencer culture and unrealistic standards',
  'Your teenager is heavily influenced by influencers, comparing their appearance, lifestyle, or achievements to filtered and sponsored content.',
  'Do you ever think about how much of what you see is actually real? I''m genuinely curious what you think about where the line is between someone sharing their life and someone selling you a version of it.',
  'Those people are fake, stop comparing yourself to them.',
  'Dismissing influencers as fake does not make them less compelling to a teenager whose social world includes them. Asking what your teenager actually thinks about authenticity online invites critical thinking from a position of respect rather than dismissal. The goal is not to remove the influence but to build the ability to interrogate it, which is a genuinely transferable skill.',
  'Pick one piece of sponsored content your teenager follows tonight and look up together what the disclosure requirements are and what the influencer is actually being paid to promote.',
  'none',
  false,
  312
),

(
  'shaper',
  'social-media',
  'Privacy settings and what to share',
  'Your teenager does not have their accounts set to private and is sharing location data, personal details, or content that identifies their school, address, or routine.',
  'Can I show you what someone who doesn''t know you can see on your profile right now? I''m not trying to invade your privacy, I just want to make sure you know what you''re actually sharing.',
  'Your account needs to be private, fix it now.',
  'Mandating without explanation rarely creates understanding or lasting behaviour change. Walking through what is actually visible to strangers makes the risk concrete and specific rather than abstract. A teenager who understands what information is being shared and makes an informed decision is in a fundamentally better position than one who has been told to comply without knowing why.',
  'Go through the privacy settings on one of your teenager''s main platforms together tonight and update anything that feels like too much information, with their agreement.',
  'none',
  false,
  313
),

(
  'shaper',
  'social-media',
  'Using social media to cope with loneliness',
  'Your teenager seems to be online constantly, seeking validation or connection through social media in a way that suggests genuine loneliness rather than healthy social use.',
  'I''ve been thinking about how much time you spend online and I want to ask you something honestly. Do you feel like you have the connections you actually want in real life, or does it sometimes feel lonely?',
  'You''re always on your phone, get off it and go and see real people.',
  'Loneliness in adolescence is painful and social media provides a real, if imperfect, form of connection that dismissing as fake or unhealthy does not address. Asking directly about loneliness names what might be happening without accusing. If the answer is yes, the conversation that follows matters far more than any rule about phone use.',
  'Think about whether your teenager has one or two relationships outside the home that feel genuinely nourishing and, if not, think about one practical step you could take to help that happen.',
  'none',
  false,
  314
),

(
  'shaper',
  'social-media',
  'Social media and political radicalisation',
  'You have noticed your teenager expressing increasingly extreme views, using language from ideological communities online, or following accounts that promote divisive or harmful political content.',
  'I''ve noticed some of the ideas you''ve been sharing lately and I''m genuinely curious where they''re coming from. I''m not trying to tell you what to think, but I''d love to understand what''s drawing you to this.',
  'You''re being brainwashed, those people are dangerous.',
  'Accusing a teenager of being brainwashed makes the influence more appealing, not less, because it activates the belief that their parents do not understand them or are trying to control their thinking. Genuine curiosity about what is drawing them to these ideas builds a relationship in which you can offer alternative perspectives over time. Radicalisation through social media is a process, not an event, and so is the path out of it.',
  'Find one specific account or community your teenager follows that concerns you and read about how those communities typically recruit and retain young people, so you understand what you are dealing with.',
  'none',
  false,
  315
),

(
  'independent',
  'social-media',
  'Social media and mental health awareness',
  'Your older teenager or young adult is noticing the impact of social media on their own mood and mental health and is trying to work out what to do about it.',
  'It''s really worth paying attention to that connection. You''re in a better position than most people to see it in yourself. What''s your sense of which parts of social media actually add something to your life and which parts leave you feeling worse?',
  'You should just delete everything.',
  'A nuclear option like deleting everything rarely sticks and is not necessary. The skill being built here is the ability to audit your own digital environment and make deliberate choices about it. Asking someone to identify what adds value versus what drains it treats them as capable of self-knowledge, which is exactly the capacity you want to strengthen.',
  'Share your own experience of social media and mental health honestly tonight, including what you have tried and what has or has not worked for you.',
  'none',
  false,
  316
),

(
  'independent',
  'social-media',
  'Building a positive online presence',
  'Your older teenager or young adult is starting to think about how their online presence reflects on them professionally or publicly and wants guidance on what to do.',
  'This is worth thinking about properly. What do you want someone to know about you if they search your name? Let''s work backwards from that and look at what''s actually out there right now.',
  'You need to delete everything embarrassing before an employer sees it.',
  'Starting with deletion as the strategy is reactive and incomplete. Building a positive presence is an active process of deciding what you want associated with your name and creating that intentionally. The question of what you want to be known for is a valuable one that goes beyond reputation management into genuine self-reflection about values and direction.',
  'Search your young adult''s name together tonight and have an honest conversation about what comes up and what, if anything, they want to change.',
  'none',
  false,
  317
),

(
  'independent',
  'social-media',
  'Recognising algorithm manipulation',
  'Your older teenager or young adult does not fully understand how algorithms shape what they see and may be mistaking algorithmically curated content for a balanced view of the world.',
  'Do you know how much of what you see on your feeds is actively chosen for you based on keeping you watching? I find it genuinely unsettling when I think about it. What do you reckon your algorithm thinks you want to see?',
  'The internet is just full of nonsense, you can''t trust any of it.',
  'Dismissing online content as uniformly untrustworthy is not a useful framework. Understanding how recommendation algorithms work, that they are optimised for engagement rather than accuracy or balance, is a specific and applicable form of media literacy. The question about what the algorithm thinks they want to see invites your young adult to look at their own feed with fresh eyes.',
  'Try using a search topic your young adult cares about in an incognito browser versus their usual logged-in feed tonight and compare the results together.',
  'none',
  false,
  318
),

(
  'independent',
  'social-media',
  'Social media for mental health versus escapism',
  'Your older teenager or young adult is using social media for community and connection around mental health but you are unsure whether it is helping or becoming another form of avoidance.',
  'Online mental health communities can be genuinely helpful and I don''t want to dismiss what you''re getting from them. I''m also curious whether they''re helping you feel more capable of dealing with things or more immersed in the difficulty. What do you think?',
  'Those mental health accounts are toxic, get off them.',
  'Online mental health communities exist on a spectrum from genuinely supportive to actively harmful, and the difference matters. Rather than blanket dismissal, asking whether the community is building capacity or deepening the sense of being unwell is a useful and honest question. Your young adult is far more likely to reflect on this if you treat them as someone capable of making that assessment themselves.',
  'Ask your young adult to describe one thing they have learned or applied from an online mental health community that has made a real difference to how they function.',
  'none',
  false,
  319
),

(
  'independent',
  'social-media',
  'Social media fast or digital detox',
  'Your older teenager or young adult is thinking about taking a break from social media and wants to talk it through, or you want to suggest it without it feeling like a punishment.',
  'I think taking a break is actually worth trying, even for a few days. Lots of people find they feel different afterwards in ways they didn''t predict. What would make it easier to actually do?',
  'You should have done this ages ago.',
  'A social media fast can be a genuinely valuable reset, but suggesting they should have done it sooner makes it feel like criticism rather than support. Asking what would make it easier shifts from talking about it to actually planning it. The research on even brief breaks from social media shows measurable improvements in mood and subjective wellbeing, which is worth sharing as motivation rather than as a lecture.',
  'Offer to do a social media break alongside your young adult for a few days this week and check in with each other on how it feels.',
  'none',
  false,
  320
),

(
  'foundation',
  'online-safety',
  'Strangers online',
  'Your young child is starting to play games or use apps online and you want to establish a clear and memorable rule about strangers before an incident happens.',
  'You know how we have a rule about strangers in real life? We have the same rule online. Someone online you have never met in real life is a stranger, even if they seem friendly. You always come and tell me if someone you don''t know tries to talk to you.',
  'Never talk to anyone online, ever.',
  'A total ban on any online communication is both unworkable and not what children need to navigate the internet safely. Teaching the same framework they already understand from real-world stranger awareness makes the lesson concrete and memorable. The most important outcome is a child who comes to a trusted adult rather than handling something confusing or worrying alone.',
  'Tonight, play alongside your child in whatever game or app they use online and show them together how to identify and report unknown contacts.',
  'none',
  true,
  401
),

(
  'builder',
  'online-safety',
  'Clicking suspicious links',
  'Your child has clicked on a suspicious link in a message, email, or game, or you want to build awareness before this happens.',
  'If a message you didn''t expect asks you to click something, the answer is always to come and show me first before you do anything. Even if it looks like it''s from someone you know. Real messages don''t need you to click urgently.',
  'Never click anything, you''ll get us all hacked.',
  'Absolute prohibitions create anxiety without building judgement. Teaching the specific red flags, unexpected messages, urgent language, requests to click, and training the habit of checking before clicking gives children a practical filter they can apply. The framing that real messages do not create urgency is a genuinely memorable heuristic.',
  'Show your child one real phishing email or message tonight (there are safe examples online) and walk through together how you can tell something is not right about it.',
  'none',
  false,
  402
),

(
  'builder',
  'online-safety',
  'Sharing personal information',
  'Your child does not fully understand what counts as personal information or why sharing it online could be dangerous.',
  'Let''s think about what personal information is. It''s anything that could help someone find you in real life: your full name, where you go to school, your address, your phone number, what you look like in a photo with your school uniform on. That stuff stays offline.',
  'Don''t put anything personal online.',
  'Vague instructions without specifics are not memorable or actionable. Making the category concrete, what could help someone find you in real life, gives children a clear test they can apply to specific situations. Including the school uniform example makes it real rather than abstract, because many children share photos without thinking about what identifying information is in the background.',
  'Tonight, look at your child''s profile on any app they use and go through together whether any personal information is visible that should not be.',
  'none',
  false,
  403
),

(
  'builder',
  'online-safety',
  'Someone asking to meet in person',
  'Someone your child knows only online has asked to meet in real life, or you want to build this awareness before it happens.',
  'If anyone you only know online ever asks to meet you in real life, you come and tell me straight away, no matter who they say they are or how well you feel you know them. That is not something you ever agree to without me knowing. That is a very important rule.',
  'Obviously you never do that, use your common sense.',
  'Telling a child to use their common sense assumes they already have the specific social knowledge needed to recognise when something is wrong, which they may not. Making the rule explicit and absolute removes the need for judgement in a high-stakes moment. The phrase no matter who they say they are addresses the most common grooming dynamic, where online contacts claim a benign identity.',
  'Have this specific conversation tonight with your child and ask them to repeat the rule back to you in their own words to make sure it has landed.',
  'none',
  true,
  404
),

(
  'explorer',
  'online-safety',
  'Recognising grooming warning signs',
  'You want to give your child the awareness to recognise when an adult online is behaving in ways that do not feel right, without frightening them.',
  'I want to talk about something important. Some adults online try to build a special friendship with kids your age, just to get something from them. The signs are: they want to keep the friendship secret, they give you lots of attention and gifts, they ask personal questions, and they slowly make conversations more adult. Trust your gut. If something feels off, you tell me.',
  'Don''t trust anyone online.',
  'Blanket distrust is not a workable framework and does not give children the specific knowledge they need. Naming the specific grooming tactics, secrecy, special attention, escalation, and trusting the gut empowers a child with concrete things to look out for. Ensuring they know they will not get in trouble for telling you is the single most important thing you can communicate in this conversation.',
  'Ask your child tonight if anyone online has ever made them feel uncomfortable, and respond to whatever they say with calm rather than alarm so they know it is always safe to tell you.',
  'none',
  false,
  405
),

(
  'explorer',
  'online-safety',
  'Password safety',
  'Your child uses weak passwords, shares passwords with friends, or does not understand why password security matters.',
  'Your password is basically the key to your whole digital life. Let''s make sure yours is actually strong. A good password is long and random, not a word or a name. And you never share it, even with your best friend, because friendships change.',
  'Make your password something strong and don''t share it.',
  'Generic instructions without a practical example do not stick. The metaphor of a key to your digital life makes the stakes concrete. The point about friendships changing is an honest and memorable reason for not sharing passwords that treats the child as someone who can understand a nuanced social truth.',
  'Go through the passwords on your child''s key accounts tonight and help them create at least one strong, unique password together.',
  'none',
  false,
  406
),

(
  'explorer',
  'online-safety',
  'Screenshot culture and privacy',
  'Your child is not thinking about the fact that what they send or post can be screenshotted and shared beyond their intended audience.',
  'Anything you send or post online can be screenshotted and shared with people you never intended to see it. That''s not being paranoid, that''s just how it works. A good rule is to only send something if you''d be fine with anyone in your school seeing it.',
  'You need to be more careful what you send.',
  'Vague warnings about being more careful do not translate to changed behaviour. The school test is a concrete, easily applicable heuristic that children at this age can actually use in the moment before they send something. Understanding that screenshots make private communications permanently shareable fundamentally changes how they should think about anything they create online.',
  'Share one example of a public screenshot controversy that made the news (there are many safe examples) with your child tonight and ask what they think about it.',
  'none',
  false,
  407
),

(
  'explorer',
  'online-safety',
  'Deepfakes and manipulated images',
  'Your child has encountered a manipulated or AI-generated image or video and is either fooled by it or confused about how to tell what is real.',
  'What you just saw might have been a deepfake. AI can now make videos and images of real people doing or saying things they never did. It is getting hard to tell the difference. Let me show you some of the signs to look for.',
  'You can''t trust anything you see online.',
  'Total distrust of all content is not actionable and not the goal. Teaching specific visual and contextual signals of manipulation builds a skill that is increasingly necessary. Encountering a possible deepfake is an excellent real-time teaching opportunity and treating it as one, with curiosity rather than alarm, is more effective than a general warning.',
  'Look up a short explainer about deepfake detection together tonight and practise spotting one or two examples from the examples available online.',
  'none',
  false,
  408
),

(
  'shaper',
  'online-safety',
  'Scams targeting teenagers',
  'Your teenager has been targeted by an online scam, whether a fake job offer, a too-good-to-be-true prize, a romantic scam, or a request for money.',
  'I want to tell you about something important without making you feel stupid, because these scams are very sophisticated and they catch adults too. Let''s look at what happened and what we can do.',
  'How did you fall for that, you need to be more careful.',
  'Scams targeting teenagers are designed by professionals who understand psychology. Shame makes teenagers less likely to disclose future incidents and less likely to ask for help when money or personal information is at risk. Normalising that these scams catch adults too removes the sting while keeping the conversation focused on learning and practical next steps.',
  'Look up the most common online scams targeting teenagers tonight together and see whether any of them match what your teenager has encountered or is likely to encounter.',
  'none',
  false,
  409
),

(
  'shaper',
  'online-safety',
  'Revenge porn and image-based abuse',
  'Your teenager tells you that intimate images of them, or someone they know, have been shared without consent, or you want to build awareness before this happens.',
  'This is a serious crime and it is not the fault of the person in the image. If this is happening to you or someone you know, we need to deal with it together and there is real support available. You are not in trouble.',
  'You should never have sent those pictures in the first place.',
  'Blaming the victim for creating or sharing intimate images in the first place is both cruel and legally inaccurate. Non-consensual sharing of intimate images is a criminal offence in the UK regardless of how the images were originally created. The most important thing a parent can do in this moment is make it clear that they will not punish their teenager for coming to them, because shame and fear of parental reaction are the primary barriers to getting help.',
  'Look up the Revenge Porn Helpline and the Stop-NCII tool tonight so you know exactly what support is available if you or your teenager ever need it.',
  'none',
  false,
  410
),

(
  'shaper',
  'online-safety',
  'Online predators',
  'You are concerned that your teenager may be in contact with someone online who is not who they claim to be, or you want to have a serious safety conversation at this age.',
  'I need to have a real conversation with you about something. Some people online deliberately target teenagers by pretending to be younger, building a friendship over months, and then using that to ask for things. I''m not saying your friends aren''t real. I just want you to know how to spot when something doesn''t add up.',
  'Everyone online is lying about who they are.',
  'Sweeping statements about universal deception are not credible and do not help teenagers make real distinctions. Understanding the specific pattern of how predators build trust over time and gradually escalate gives them a framework they can apply to actual relationships. The goal is not paranoia but pattern recognition.',
  'Ask your teenager tonight whether there is anyone they talk to online who they have never verified in any way, and have an honest conversation about how you could check.',
  'none',
  false,
  411
),

(
  'shaper',
  'online-safety',
  'Privacy on dating apps',
  'Your teenager is using or considering using a dating app and does not have a clear picture of the privacy and safety risks involved.',
  'If you''re going to use a dating app, I want to make sure you know how to do it as safely as possible. There are specific things worth knowing about what to share and what to keep back, how to verify someone is who they say, and what the safest way to meet someone for the first time looks like.',
  'You are not using a dating app.',
  'A flat refusal without engagement leaves a teenager who is going to use the app anyway without any safety information. Having a practical conversation about how to use these platforms safely is far more protective than prohibition. The specific guidance around what to share, how to verify, and first meeting safety gives them tools they will actually use.',
  'Look up the safety guidelines from one of the major dating app platforms together tonight and talk through which ones feel realistic and which feel too cautious.',
  'none',
  false,
  412
),

(
  'independent',
  'online-safety',
  'Digital security habits',
  'Your older teenager or young adult has not developed strong digital security habits around passwords, two-factor authentication, or data protection.',
  'I want to talk about digital security, not in a scary way but because a lot of people only think about it after something goes wrong. Can we go through a few basics together? It won''t take long and it''s genuinely worth doing.',
  'You need to sort out your digital security.',
  'Vague urgency without a concrete next step does not change behaviour. Offering to go through it together removes the barrier of not knowing where to start and makes it a collaborative activity rather than a criticism. The frame of before something goes wrong rather than because something is wrong removes the defensiveness.',
  'Go through the security settings on your young adult''s email account together tonight, set up two-factor authentication if it is not already on, and make sure the recovery information is up to date.',
  'none',
  false,
  413
),

(
  'independent',
  'online-safety',
  'Doxxing and online harassment',
  'Your older teenager or young adult has had their personal information shared publicly without consent, or is experiencing coordinated online harassment.',
  'What''s happening to you is a form of abuse and it is not okay. There are real steps we can take right now to limit the damage and report what''s happening. You don''t have to deal with this alone.',
  'Just ignore it and it will stop.',
  'Telling someone to ignore coordinated harassment dismisses a genuinely frightening experience and is also poor advice, as ignoring it does not always cause it to stop. Framing it as abuse rather than something to toughen up about validates the severity of the experience. Having a concrete plan of action restores a sense of agency at a time when the violation of privacy feels overwhelming.',
  'Document everything that is happening tonight, take screenshots with dates and URLs, and look up the reporting process for the platform where it is happening as a first step.',
  'none',
  false,
  414
),

(
  'independent',
  'online-safety',
  'Protecting personal data',
  'Your older teenager or young adult does not think carefully about the data they share with apps, websites, and services, and does not understand the implications.',
  'Do you know how much data you''ve given to the apps and services you use? Most people have no idea. I''ve found it genuinely interesting to look at what I''ve agreed to share without thinking about it. Want to have a look together?',
  'You need to read the terms and conditions before you agree to anything.',
  'Telling someone to read terms and conditions is both unrealistic and not how any of us actually behave. Framing data privacy as something genuinely interesting to look at rather than a compliance obligation is far more likely to engage a young adult. Doing it together and including your own data as part of the exercise removes the sense that this is being done to them.',
  'Go through the privacy settings on one major app your young adult uses tonight and look together at what data it has collected and what they can turn off.',
  'none',
  false,
  415
);
