-- GUIDED CHILDHOOD CATCH UP · STEP 09 · scripts-expansion-3
-- Paste into a NEW query tab, Run, look for the COMPLETE message.



-- ============================ independent ============================
-- Guided Childhood: Independent stage scripts (ages 16 and over). Run after seed.sql.
insert into public.scripts
  (stage_id, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order)
values
(
  'independent',
  'Preparing for full digital independence before leaving home',
  'They are within a year or two of leaving home, and soon nobody will be checking their screen habits but them.',
  'Soon you will be running all of this on your own, and I think you are ready for it. I am not here to manage your phone any more, I am here as someone to think out loud with. What do you already know about yourself online, the good habits and the ones you want to keep an eye on?',
  '"While you are still under my roof, my rules apply." It frames independence as something you grant rather than something they are growing into, so they leave home with no practice at self-governing.',
  'In late adolescence the goal shifts from external control to internal regulation, because the structures you provide will vanish the moment they move out. Treating them as the future manager of their own habits builds the self-awareness they will actually rely on. Coaching now, while you can still observe and discuss, is the last and best window to hand the controls over deliberately rather than abruptly.',
  'Ask them to name one digital habit they want to take with them and one they want to leave behind.',
  'none',
  false,
  501
),
(
  'independent',
  'Owning their own mental health online',
  'You sense that how they feel is closely tied to what they see and post, and they are starting to notice it too.',
  'You are old enough now to be the one watching how this stuff affects you, not me. I have noticed feeds can lift you or flatten you depending on the day. You know yourself better than anyone. What does your phone do to your mood, honestly, and what would you change if it were entirely your call?',
  '"You are on that thing too much, it is making you miserable." A verdict delivered from outside invites a defence, and it teaches them to wait for someone else to diagnose them.',
  'Emerging adults regulate mood far better when they own the insight rather than receive it as a complaint. Asking them to observe the link between input and feeling builds the metacognition that underpins lifelong mental health. The aim is a young person who notices their own state and adjusts it, which only develops when they are trusted to be the observer.',
  'Ask them which account or app reliably lifts their mood and which one reliably drains it.',
  'none',
  false,
  502
),
(
  'independent',
  'Building a healthy relationship with algorithms and feeds',
  'Their feed seems to know them almost too well, and they are not always sure why they are being shown what they see.',
  'The feed is not neutral. It is built to keep you scrolling, and it learns what holds you, including the things that wind you up. You are sharp enough to see the machinery now. What do you think yours has decided you are, and is that actually who you want to be fed?',
  '"It is all rubbish, just delete the app." Telling them to walk away skips the more useful skill, which is understanding the system well enough to bend it to their own ends.',
  'A young adult who understands that engagement, not wellbeing, is the goal of a feed can curate deliberately rather than be curated. Recommender systems amplify whatever provokes a reaction, so naming that mechanism turns a passive user into an active one. The skill they need for the next sixty years is shaping the algorithm, not just escaping it.',
  'Ask them to unfollow or mute three accounts that consistently leave them worse off, tonight.',
  'none',
  false,
  503
),
(
  'independent',
  'Spotting deepfakes and synthetic media',
  'Convincing fake videos, voices, and images are everywhere, and even careful people are being fooled.',
  'It is getting genuinely hard to tell what is real, and that is not a failing on your part, it is the technology. I would rather we both got good at pausing before we believe or share something. What makes you trust a clip when you see one, and where could that trust be played?',
  '"Do not believe anything you see online." Blanket distrust is no more useful than blanket trust, and it leaves them with no actual method for telling the two apart.',
  'Emerging adults navigate a media environment where synthetic content is cheap and convincing, so the durable skill is verification, not cynicism. Asking what earns their trust surfaces the shortcuts a forger exploits. Building a habit of checking the source and seeking a second confirmation gives them a method they can apply long after any single tool is outdated.',
  'Look up one recent deepfake together and work out what gave it away.',
  'none',
  false,
  504
),
(
  'independent',
  'Financial scams, crypto, and get rich quick content',
  'Their feed is full of people promising fast money through crypto, trading, or some course, and some of it is tempting.',
  'There is a whole industry online aimed at people your age with the line that fast money is one purchase away. Some of it is outright fraud, some of it is just people selling you the dream of selling the dream. You are smart, so let us pressure test it: who actually profits when you buy in?',
  '"You are not putting a penny near any of that nonsense." A ban teaches nothing about how the trick works, and the moment you are not there to forbid it, the pitch lands unanswered.',
  'Young adults are prime targets for financial manipulation precisely because they are building independence and want to get ahead. Teaching them to ask who profits and what is being promised gives them a reusable filter rather than a single prohibition. The protection that lasts is a sceptical question they carry, not a rule they outgrow the day they move out.',
  'Pick one get rich quick post together and trace exactly how the person behind it actually makes their money.',
  'none',
  false,
  505
),
(
  'independent',
  'Online dating safety and respect',
  'They are starting to meet people online, and you want them safe without treating them like a child.',
  'Meeting people online is normal now, and I trust you to do it well. A couple of things keep grown adults safe, not just teenagers: meet first in public, tell someone where you are, and trust the feeling if something is off. And the respect goes both ways, in how you are treated and how you treat them.',
  '"Just be careful out there." It sounds caring but gives them nothing concrete, and it quietly implies the danger is all on the other side.',
  'Emerging adults benefit from specific, dignifying safety practices rather than vague warnings or surveillance. Naming public meetings, a trusted contact, and the legitimacy of their own instincts gives them a portable protocol. Framing respect as mutual also builds them into someone who treats partners well, which is half of what makes a relationship safe.',
  'Agree one simple plan: when they meet someone new, they tell a named person where and when.',
  'none',
  false,
  506
),
(
  'independent',
  'Their professional and public digital footprint',
  'What they post now can be seen by future employers, universities, and people who do not yet know them.',
  'Almost everything you put out is searchable, and people who will decide things about your future, jobs, courses, references, can see it. I am not saying scrub yourself into a blank profile. I am saying post like the person you are becoming, because that record follows you.',
  '"Delete those photos before someone sees them." Panic and policing teach concealment, not the lifelong judgement of deciding for themselves what is worth putting into the world.',
  'In emerging adulthood identity becomes public and consequential, and the footprint they build now shapes real opportunities. Helping them think about audience and permanence develops the forward looking judgement that no amount of deleting can replace. The aim is a young person who curates their public self on purpose, because they will be doing it for the rest of their working life.',
  'Search their own name together and talk about what a stranger would conclude from the first page.',
  'none',
  false,
  507
),
(
  'independent',
  'Helping them support a younger sibling well',
  'A younger sibling looks up to them, and their example online carries real weight in the house.',
  'Your younger sibling watches you more than they listen to me, and that gives you a kind of quiet influence I do not have. I am not asking you to police them. I am asking you to be the older one who shows what good looks like, and who they can come to before they would ever come to me.',
  '"Set a better example, they copy everything you do." Framed as a duty and a fault, it makes them resent the role instead of stepping into it.',
  'Older adolescents take on mentoring identities readily when the role is offered as trust rather than obligation. A near adult who models healthy habits gives a younger child a closer, more credible guide than a parent. Inviting them into that role also deepens their own standards, because people live up to the version of themselves they are asked to be.',
  'Tell them one thing their younger sibling already copies from them, and thank them for it.',
  'none',
  false,
  508
),
(
  'independent',
  'News literacy and political polarisation',
  'They are forming strong views, and their feeds may be feeding them one side hard while hiding the other.',
  'You are forming your own politics now, and I respect that, even where we differ. The thing I want for you is not a particular view, it is the habit of knowing where yours came from. Feeds tend to show you more of what you already believe. Who do you read that you actually disagree with?',
  '"You only think that because of what you watch." It dismisses their reasoning as brainwashing and guarantees they stop discussing politics with you at all.',
  'As young adults consolidate their worldview, the lasting skill is recognising the information environment that shaped it, not adopting yours. Personalised feeds narrow the range of views people encounter, which hardens opinion into identity. Asking who they read across the divide builds intellectual independence, which serves them far better than agreement.',
  'Each of you names one thoughtful source you disagree with and says one fair thing about it.',
  'none',
  false,
  509
),
(
  'independent',
  'Focus, productivity, and distraction during study',
  'Phones and feeds are pulling their attention apart while they are trying to study or revise.',
  'Your attention is the thing every app is built to capture, and they are very good at it. This is not about willpower, it is about design. You are old enough to run your own experiment: what actually helps you concentrate, and what would you have to do to your phone to find out?',
  '"Hand me your phone, you cannot be trusted to study with it." Confiscation works for one evening and teaches nothing they can use when they are alone in a library next year.',
  'Emerging adults must build their own attention management because no one will be there to remove the phone at university or work. Framing focus as a design problem rather than a character flaw removes shame and invites strategy. Letting them test what works gives them a system they own, which is the only kind that survives leaving home.',
  'Ask them to try one study session with the phone in another room and report back on the difference.',
  'none',
  false,
  510
),
(
  'independent',
  'Sleep and study balance',
  'Late nights on screens are eating into their sleep, and it is starting to show in how they cope.',
  'You are running your own schedule now, which is exactly right. I will just say what I know: sleep is when your brain files everything you studied, so screens late at night cost you twice, the rest and the recall. You decide the line. I am only making sure you have the facts to decide with.',
  '"Lights off and phone away, it is a school night." Imposing a bedtime on a near adult invites rebellion and removes the chance for them to learn to manage their own rest.',
  'Young adults regulate sleep best when they own the decision and understand the cost, because soon no one will set their bedtime. Sleep consolidates learning, so the trade off is concrete and worth naming plainly. Handing them the facts and the choice builds the self regulation they will need in every term and every job ahead.',
  'Share one fact about sleep and learning, then leave the decision genuinely with them.',
  'none',
  false,
  511
),
(
  'independent',
  'A mature conversation about image sharing and the law',
  'They are old enough to date and share, and they need to understand consent and the law around intimate images.',
  'You are an adult or nearly one, so I will speak to you straight. Sharing an intimate image of someone without their consent is not just unkind, it is against the law, and so is pressuring someone to send one. The principle underneath all of it is consent. Are you clear on where those lines are?',
  '"Do not ever send pictures like that." A flat prohibition shuts the topic down and leaves them unsure what the actual law and the actual harm are when it matters.',
  'Emerging adults need an honest, adult level grasp of consent and the legal reality around intimate images, because the stakes are serious and lifelong. Grounding the conversation in consent gives them a principle that covers situations a rule cannot anticipate. Speaking to them as a responsible adult makes them more likely to come to you if something goes wrong.',
  'Make sure they can state in their own words what consent means before an image is ever shared.',
  'none',
  false,
  512
),
(
  'independent',
  'Knowing when and how to seek help',
  'They are increasingly handling things alone, and you want them to know that asking for help is a strength, not a failure.',
  'Being independent does not mean handling everything by yourself. The most capable adults I know are the ones who know when to ask for help and are not too proud to do it. If something online ever frightens you, traps you, or gets out of hand, you can come to me with zero judgement, and there are services that exist for exactly this too.',
  '"You are an adult now, you should be able to sort your own problems." It teaches them that needing help is a failure of independence, so they will hide the moment they most need you.',
  'Help seeking is a learned skill that protects emerging adults through every crisis they will face away from home. Framing it as a mark of capability rather than weakness keeps the door open precisely when shame would otherwise close it. Knowing both that you are available and that formal services exist gives them more than one route when they are alone.',
  'Tell them plainly that asking for help is something strong adults do, and that your door has no judgement behind it.',
  'none',
  false,
  513
),
(
  'independent',
  'Gambling and betting apps',
  'Betting and gambling are heavily marketed to young men especially, and the apps are designed to keep them playing.',
  'Betting apps are everywhere now, dressed up as a bit of fun with the football. Here is what they do not advertise: they are engineered so the house wins over time, and they are very good at getting young people hooked. You are sharp enough to see the design. What do you reckon the free bet is actually buying them?',
  '"Gambling is a mug''s game, never touch it." The slogan is easy to ignore, and it gives them no understanding of how the hook is set so they can recognise it later.',
  'Young adults, particularly young men, are intensively targeted by gambling marketing during the years their impulse control is still settling. Explaining the mechanics, the free bet, the near miss, the always on access, gives them a working knowledge they can apply to any product. Understanding the design protects far longer than a slogan they will tune out.',
  'Look at one betting advert together and work out what behaviour it is really trying to start.',
  'none',
  false,
  514
),
(
  'independent',
  'World event anxiety and doomscrolling',
  'A relentless stream of crises and bad news is leaving them anxious, hopeless, or unable to look away.',
  'The news never stops now, and it is weighted towards the worst of everything because that is what holds attention. Caring about the world is good. Drowning in it helps no one, least of all the people you care about. How do you want to stay informed without it flattening you?',
  '"Just stop reading the news then." It dismisses a genuine moral instinct to care, and it offers no middle path between drowning and switching off entirely.',
  'Emerging adults are developing their relationship with a wider world that arrives mainly through an anxiety optimised feed. Validating the care while questioning the consumption helps them stay engaged without being overwhelmed. The lasting skill is a sustainable way to be informed, which they will need across a lifetime of difficult news.',
  'Help them set one boundary on news intake, a time of day or a number of minutes, and see how it feels.',
  'none',
  false,
  515
),
(
  'independent',
  'The lifelong, ongoing nature of this conversation',
  'They are about to leave, and you want them to know this thinking does not end when the parenting does.',
  'We have been working this out together for years, and I want you to know it does not stop when you leave. The tech will keep changing, and so will you. The job is never finished, for you or for me. I am always here to think it through with you, not as your parent telling you what to do, but as someone who is in it too.',
  '"Right, you know it all now, off you go." It pretends the work is done, when in truth the questions only get more complex once they are out in the world alone.',
  'Digital life evolves continuously, so the most useful thing you can leave an emerging adult with is the expectation that reflection is permanent, not a phase they complete. Reframing yourself from controller to lifelong thinking partner keeps the relationship open across adulthood. They leave home equipped not with a finished rulebook but with a habit of asking, which is what actually lasts.',
  'Tell them this conversation has no finish line, and that you are in it alongside them for good.',
  'none',
  false,
  516
)
on conflict (sort_order) do nothing;
select 'STEP 09 COMPLETE · scripts-expansion-3' as status;
