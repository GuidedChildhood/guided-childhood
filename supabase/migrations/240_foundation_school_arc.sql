-- The school arc, Foundation. (Lesson excellence plan, steps 4 to 6.)
--
-- Justin, 1 September 2026: lessons "super structured to teach every aspect
-- of each stage... matching school lessons just a slight reduced version."
-- The audit found every deck teaching then asking twice and closing: no
-- vocabulary slide anywhere in the library, one recap, one tryit. A school
-- lesson puts its words on the board, checks understanding more than twice,
-- recaps, and sets home practice. This migration completes that arc for
-- every Foundation deck, in the deck's own register:
--
--   keywords after the objective (the words on the board, kid meanings),
--   two more choice questions before the close (FOUR per deck, so the 70
--     percent pass forgives one miss instead of demanding a perfect run,
--     and the stage check pool roughly doubles),
--   a recap (the lesson back in three ticks),
--   a try it tonight (the home practice a school lesson sets),
--   and the title slide names its Planet Friend, so the intro stops
--     guessing the character from a regex on the title.
--
-- Additive only: not one existing slide is touched, so nothing a family has
-- already seen changes under them. Guarded on the deck having no keywords
-- slide yet, so reapplying is a no op.

create or replace function public.gc_add_school_arc(
  deck jsonb, kw jsonb, extras jsonb, chr text
) returns jsonb language plpgsql as $fn$
declare
  built jsonb := '[]'::jsonb;
  sl jsonb;
  n int := jsonb_array_length(deck);
  i int;
  kw_placed boolean := false;
begin
  for i in 0..n-1 loop
    sl := deck->i;
    if i = 0 and sl->>'type' = 'title' and chr is not null then
      sl := jsonb_set(sl, '{character}', to_jsonb(chr));
    end if;
    -- The extras (questions, recap, tryit) slot in just before the DiGi close.
    if i = n-1 and sl->>'type' = 'digi' and extras is not null then
      built := built || extras;
    end if;
    built := built || jsonb_build_array(sl);
    -- The words go on the board right after the objective.
    if not kw_placed and sl->>'type' = 'objective' and kw is not null then
      built := built || jsonb_build_array(kw);
      kw_placed := true;
    end if;
  end loop;
  -- A deck that does not end on DiGi still gets the extras, at the end.
  if (deck->(n-1))->>'type' is distinct from 'digi' and extras is not null then
    built := built || extras;
  end if;
  return built;
end $fn$;

-- ── When screens make you sad ───────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Our special words","words":[
  {"word":"stop and tell","meaning":"Our family rule: put the screen down and tell your grown up."},
  {"word":"tummy feeling","meaning":"The funny feeling inside that says something is wrong."}],
  "script":"Say each word out loud and let your child say it back. These two are the whole lesson in four words."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"A friend says telling a grown up about screen stuff is telling tales. What is true in our family?","options":[
  {"text":"Telling keeps us safe, and it is always brave","correct":true,"feedback":"That is our rule. Telling tales is trying to get someone IN trouble. Stop and tell is getting someone OUT of trouble."},
  {"text":"Telling gets you in trouble","correct":false,"feedback":"Never in our family. The promise is: you are never in trouble for telling, whatever was on the screen."},
  {"text":"Only tell if it happens twice","correct":false,"feedback":"Once is enough. The very first funny tummy feeling is the time to stop and tell."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Something scary popped up all by itself. Whose fault is that?","options":[
  {"text":"Mine, for watching","correct":false,"feedback":"Not yours, not ever. Screens sometimes just show things. The strong move is still stop and tell."},
  {"text":"Nobody may talk about it","correct":false,"feedback":"We always talk about it. That is exactly what stop and tell is for."},
  {"text":"Not mine, screens sometimes just show things","correct":true,"feedback":"Right. It is never your fault, and telling your grown up is how the yucky feeling gets sorted."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Your tummy feeling is a helper, not a bother.",
  "Stop: put the screen down. Tell: find your grown up.",
  "You are never in trouble for telling."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Practise the move tonight","body":"Hand your child a cushion as a pretend screen. Something silly pops up on it. They put it down, come and find you, and tell. Cheer the telling, not the thing.",
  "script":"Do the practice run for real. A move rehearsed once when everything is fine is a move they can find when something is not."}
] $ex$::jsonb, 'dance')
where stage_id = 'foundation' and status = 'live' and title = 'When screens make you sad'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Some voices are not people ──────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Our special words","words":[
  {"word":"person check","meaning":"The game where you ask: person or tool?"},
  {"word":"tool","meaning":"A machine that helps, with no feelings inside."}],
  "script":"Say each word and let your child say it back. Ask them to point at one tool in the room before you go on."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"You ask the speaker for a joke and it tells a funny one. Does it think you are funny too?","options":[
  {"text":"Yes, it likes my jokes","correct":false,"feedback":"It sounds like it could, and that is the clever trick. There are no thoughts inside. Tool, not person."},
  {"text":"No, it is a tool. It does not think or feel","correct":true,"feedback":"The person check, passed. It can talk about jokes without ever finding anything funny."},
  {"text":"Only if I say please","correct":false,"feedback":"Please is lovely manners, but no magic word gives a machine feelings. Tool, not person."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"The talking toy asks where you live. What is the strong move?","options":[
  {"text":"Tell it, toys keep secrets","correct":false,"feedback":"A talking toy is a tool, and tools do not need to know where you live. That is a fetch your grown up moment."},
  {"text":"Whisper it very quietly","correct":false,"feedback":"Whispering is still telling. Where you live is special information, and it stays with your family."},
  {"text":"Tell it nothing and fetch your grown up","correct":true,"feedback":"Exactly right. A voice that asks about your home gets nothing, and your grown up gets fetched."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Some voices come from machines, not people.",
  "Play the person check: person or tool?",
  "Not sure? Your grown up always knows."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Play the person check tonight","body":"Go round the voices in your child's day together: grandma on a video call, the kitchen speaker, a game character who says their name. Person or tool for each one.",
  "script":"Let them be the quiz master and test YOU. Getting to correct a grown up makes the idea stick twice as hard."}
] $ex$::jsonb, 'football')
where stage_id = 'foundation' and status = 'live' and title = 'Some voices are not people'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Me on a screen and me in real life ──────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Our special words","words":[
  {"word":"biscuit test","meaning":"Ask: could I eat it, hug it, touch it? A picture cannot."},
  {"word":"moment","meaning":"One tiny second. A photo only ever holds one."}],
  "script":"Say each word and let your child say it back. If they can teach you the biscuit test in their own words, the lesson has already worked."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"A video shows a fluffy puppy. Can the puppy lick your hand?","options":[
  {"text":"Yes, if I hold my hand very close","correct":false,"feedback":"You would just get a screen smudge! It is a picture of a puppy, not the puppy. Biscuit test."},
  {"text":"No, it is a picture of a puppy, not the puppy","correct":true,"feedback":"Biscuit test, passed. Real licks only come from real puppies."},
  {"text":"Yes, all puppies can","correct":false,"feedback":"Real ones can! But this one is a picture, and a picture of a thing is not the thing."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Your friend looks super happy in every single photo. What do you know?","options":[
  {"text":"They are happy every minute of every day","correct":false,"feedback":"Nobody is! Photos hold the smiley moments. Everyone has all the other feelings too, off camera."},
  {"text":"Photos show single moments. Everyone has all kinds of feelings","correct":true,"feedback":"That is the big one. People on screens are like your grumpy photo: one second, never the whole person."},
  {"text":"Their life is better than mine","correct":false,"feedback":"A photo cannot tell you that. It holds one chosen moment, and real life is millions of them."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "A picture of a thing is not the thing.",
  "A photo holds one tiny moment.",
  "Real you is bigger than every photo of you."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"The photo hunt tonight","body":"Find three photos of your child together. For each one, ask: what happened just before this? And just after? The photo cannot show any of it, and they know all of it.",
  "script":"This lands the whole idea in their own life: they are the proof that a person is bigger than their pictures."}
] $ex$::jsonb, 'dance')
where stage_id = 'foundation' and status = 'live' and title = 'Me on a screen and me in real life'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Real or pretend? ────────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Our special words","words":[
  {"word":"story","meaning":"Pretend, made for fun. Dragons live here."},
  {"word":"advert","meaning":"Made to make you want a thing."},
  {"word":"true","meaning":"Really happened. Real animals, real places."}],
  "script":"Three words, three boxes. Say each one and let your child give you an example before you go on."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"A cartoon dragon flies over a rainbow castle. Which box?","options":[
  {"text":"The true box","correct":false,"feedback":"If dragons were true we would all know about it! Pretend and lovely: the story box."},
  {"text":"The story box","correct":true,"feedback":"Sorted. Pretend, made for fun, and fun is exactly what stories are for."},
  {"text":"The advert box","correct":false,"feedback":"It is not trying to sell you a dragon. Pretend for fun goes in the story box."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"A video shows a real lion at the zoo eating its lunch. Which box?","options":[
  {"text":"The true box","correct":true,"feedback":"Sorted. A real animal doing a real thing: that is the true box."},
  {"text":"The story box","correct":false,"feedback":"No pretend here. That lion and that lunch really happened, so it goes in the true box."},
  {"text":"The advert box","correct":false,"feedback":"Nobody is selling you a lion! Real things that really happened go in the true box."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Story box: pretend, made for fun.",
  "Advert box: wants you to want things.",
  "True box: really happened. Tricky ones get sorted together."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"The advert hunt tonight","body":"Watch one show together and be advert detectives: shout advert when one appears, then ask the winning question. What does it want us to want?",
  "script":"One spotted advert tonight is worth ten explained ones. The shout makes it a game they will keep playing without you."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'foundation' and status = 'live' and title = 'Real or pretend?'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Someone made that ───────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Our special words","words":[
  {"word":"maker","meaning":"The person who drew, wrote or built a screen thing."},
  {"word":"asking first","meaning":"Checking before we use someone else's work."}],
  "script":"Say each word and let your child say it back. Ask: what have YOU made this week? That makes them a maker too, which is the whole point."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Your drawing is on the fridge. Someone copies it and says they made it. How does that feel?","options":[
  {"text":"Fine, drawings belong to everyone","correct":false,"feedback":"Your drawing came from your hands and your ideas. It is yours, and that is why copying without asking stings."},
  {"text":"A bit sad, because I made it","correct":true,"feedback":"That feeling is the lesson. Every maker feels it, which is why we play the maker game and ask first."},
  {"text":"Happy, copying is a present","correct":false,"feedback":"Copying WITH asking can be lovely. Taking it and saying it is theirs is the bit that hurts."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"You want to use a song in your video for school. What is the strong move?","options":[
  {"text":"Just use it, songs are free","correct":false,"feedback":"Songs feel free because they are everywhere, but every one has a maker. Check first with your grown up."},
  {"text":"Ask a grown up to help check whose it is","correct":true,"feedback":"The maker game, played properly. Someone made that song, and checking is how we are fair to them."},
  {"text":"Say I made it myself","correct":false,"feedback":"That is the copying that stings, the fridge drawing all over again. The maker deserves their name on it."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Every screen thing has a maker.",
  "Play the maker game: who made it?",
  "Ask before you use it, like you would want to be asked."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Spot the makers tonight","body":"At the end of a cartoon tonight, let the names roll instead of skipping them. Every single name is a maker. Count how far you get before you both lose count.",
  "script":"The rolling names turn an idea into a picture: that little film took a whole crowd of real people."}
] $ex$::jsonb, 'dance')
where stage_id = 'foundation' and status = 'live' and title = 'Someone made that'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── My privacy shield ───────────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Our special words","words":[
  {"word":"shield words","meaning":"Name, school, home and passwords. The four behind the shield."},
  {"word":"private","meaning":"Only for us and the people we trust."}],
  "script":"Say each word and let your child say it back, then count the four shield words on their fingers together."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"A friendly cartoon in an app asks for your password and promises extra stars. What do you do?","options":[
  {"text":"Type it in, it is a nice cartoon","correct":false,"feedback":"The friendlier the asker, the harder the shield works. Passwords are shield words: type nothing."},
  {"text":"Shield up! Type nothing and fetch my grown up","correct":true,"feedback":"Perfect. No stars are worth a shield word, and your grown up sorts out what the app really needed."},
  {"text":"Type just half of it","correct":false,"feedback":"Half a secret is still a secret out. Shield words stay whole and stay behind the shield."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Who decides if it is ever safe to tell a screen your name?","options":[
  {"text":"The screen, it asked nicely","correct":false,"feedback":"Screens can ask as nicely as they like. Asking nicely does not make a thing safe."},
  {"text":"My grown up","correct":true,"feedback":"Always. Sometimes a grown up will say yes, this one is fine, and that is exactly how the shield is meant to work."},
  {"text":"Nobody, names are secret forever","correct":false,"feedback":"Almost! Your name is not secret from everyone, it is private. Your grown up decides where it is safe."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Four shield words: name, school, home, passwords.",
  "A screen that asks gets nothing typed in.",
  "Fetch your grown up. They decide, not the screen."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Make the shield tonight","body":"Draw a big shield together and write the four shield words on it. Stick it up near where the screens live, so the shield is right there when a screen starts asking.",
  "script":"A shield they drew themselves guards better than any rule you said once. Let them choose the colours."}
] $ex$::jsonb, 'football')
where stage_id = 'foundation' and status = 'live' and title = 'My privacy shield'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Kind words on screens ───────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Our special words","words":[
  {"word":"face test","meaning":"Imagine the person right here. Would I say it to their face?"},
  {"word":"land","meaning":"Where words end up: in somebody's tummy."}],
  "script":"Say each word and let your child say it back. Words landing in tummies is the picture the whole lesson hangs on."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"You cannot see your friend's face in the game. Are their feelings still real?","options":[
  {"text":"No, no face means no feelings","correct":false,"feedback":"The face is hidden, never gone. There is a whole real person behind the screen, feelings and all."},
  {"text":"Yes. Real person, real feelings, even through a screen","correct":true,"feedback":"That is the secret most grown ups forget. The screen hides faces, and the feelings stay completely real."},
  {"text":"Only if they say so","correct":false,"feedback":"Feelings do not wait to be announced. Every person behind a screen has them, every time."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Someone sends YOU an unkind message and your tummy hurts. What is the strong move?","options":[
  {"text":"Send something unkind back","correct":false,"feedback":"Then two tummies hurt instead of one. Unkind back never makes it better."},
  {"text":"Keep it secret and feel sad","correct":false,"feedback":"A hurt kept secret stays stuck inside. This is exactly what stop and tell is for."},
  {"text":"Stop and tell my grown up","correct":true,"feedback":"Yes. The same rule as always: your grown up helps it stop, and you are never in trouble for telling."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Real people are behind screens, feelings and all.",
  "Do the face test before your words go in.",
  "Kind through a screen still counts as kind."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Send one kind thing tonight","body":"Together, send one kind message to someone you love. Grandma, a cousin, anyone. Then watch what comes back, and talk about where your words landed.",
  "script":"The reply is the proof: kind words through a screen land in real tummies and bounce right back."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'foundation' and status = 'live' and title = 'Kind words on screens'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── The internet remembers ──────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Our special words","words":[
  {"word":"copy","meaning":"When other people can keep your photo too."},
  {"word":"ask before it goes","meaning":"Our rule for every photo and message."}],
  "script":"Say each word and let your child say it back. The album everyone can copy is the picture to keep returning to."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Grandma wants to put your birthday photo online. What happens first in our family?","options":[
  {"text":"Nothing, grandmas are allowed","correct":false,"feedback":"We love Grandma, and the rule is still the rule: the people IN the photo get asked first. That is you!"},
  {"text":"She asks me first. My photo, my say","correct":true,"feedback":"That is the family rule working both ways. You get asked, just like you ask your sister."},
  {"text":"She posts it quickly before I see","correct":false,"feedback":"Quick posting is how photos end up in the album everyone can copy without anyone choosing it."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"You posted a silly photo and want it back an hour later. What do you know?","options":[
  {"text":"One tap deletes it from everywhere","correct":false,"feedback":"Delete removes YOUR copy. Anyone who copied it still has theirs. That is why asking comes first."},
  {"text":"Getting things back out is hard. That is why we ask first","correct":true,"feedback":"Exactly. The asking moment is the easy moment. After it goes, the photo can be copied beyond reach."},
  {"text":"The internet forgets after bedtime","correct":false,"feedback":"The internet remembers, that is its whole trick. Bedtime does not empty the album."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "The internet is an album other people can copy.",
  "Ask the people in the photo, then your grown up.",
  "You get asked too. Your photo, your say."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"The family asking rule, agreed tonight","body":"Say it out loud at the table so it is real: nobody's photo goes anywhere without asking them first. Grown ups included, and your child gets to hold you to it.",
  "script":"The rule binding the grown ups is what makes it feel fair, and fair rules are the ones children keep."}
] $ex$::jsonb, 'dance')
where stage_id = 'foundation' and status = 'live' and title = 'The internet remembers'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Screens, sleep and growing bodies ───────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Our special words","words":[
  {"word":"builder time","meaning":"Sleep, when your body grows and your brain tidies up."},
  {"word":"screen bed","meaning":"Where screens sleep at night, outside the bedrooms."}],
  "script":"Say each word and let your child say it back. Builder time reframes sleep as the opposite of boring, which is half the battle."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why does a bright screen at bedtime make sleeping harder?","options":[
  {"text":"Screens are too heavy to hold in bed","correct":false,"feedback":"It is not the weight, it is the light. Screen light tells your brain the day is still going."},
  {"text":"Screen light tells my brain it is daytime","correct":true,"feedback":"That is it. Little suns saying stay awake, right when your body wants to start builder time."},
  {"text":"It does not, screens help sleep","correct":false,"feedback":"They feel cosy, but the light works against you. Brains sleep best after the screens are tucked away."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Where does the tablet go at night in our house?","options":[
  {"text":"Under my pillow, nice and close","correct":false,"feedback":"Then the little sun sleeps an inch from your brain! Screens have their own bed, outside the bedrooms."},
  {"text":"Into its own screen bed, outside the bedrooms","correct":true,"feedback":"Every screen, every night. Your room stays a sleeping room, and builder time gets the whole night."},
  {"text":"Anywhere it lands","correct":false,"feedback":"Screens that land anywhere sneak back at bedtime. A screen with its own bed stays put till morning."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Sleep is builder time for bodies and brains.",
  "Screen light says wake up, so screens sleep elsewhere.",
  "Every screen in the screen bed, every night."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Make the screen bed tonight","body":"Choose the spot together, outside every bedroom. A box, a basket, a drawer. Decorate it if you like, then tuck every screen in tonight and say goodnight to them.",
  "script":"When the child builds the screen bed, the bedtime handover becomes their routine instead of your rule."}
] $ex$::jsonb, 'football')
where stage_id = 'foundation' and status = 'live' and title = 'Screens, sleep and growing bodies'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── The stop and tell rule ──────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Our special words","words":[
  {"word":"stop","meaning":"Put the screen down or look away."},
  {"word":"tell","meaning":"Find your grown up and say what happened."}],
  "script":"Two words, one rule. Say them, let your child say them back, and keep them in this order all lesson: stop first, then tell."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"You tapped the strange thing by accident yourself. Do you still tell?","options":[
  {"text":"No, better to hide it","correct":false,"feedback":"Hiding keeps the yucky feeling stuck inside you. The promise covers accidents too: telling is safe."},
  {"text":"Yes. Telling is safe even when I tapped it","correct":true,"feedback":"Especially then. The promise has no small print: never in trouble for telling, whoever tapped."},
  {"text":"Only if someone saw me","correct":false,"feedback":"The rule is not about being caught. It is about the feeling in your tummy, and that one saw everything."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Which is the FIRST step of the rule?","options":[
  {"text":"Keep watching, to be really sure it is bad","correct":false,"feedback":"Your tummy already told you. More watching just means more yuck. Stop comes first."},
  {"text":"Stop: put it down or look away","correct":true,"feedback":"That is the order. Stop protects you right now, then tell brings your grown up in to sort it."},
  {"text":"Shout at the screen","correct":false,"feedback":"The screen cannot hear you! Put it down, look away, and go find your grown up."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Stop first, then tell.",
  "Your tummy is a helper.",
  "Telling is always safe, whoever tapped it."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Say the promise tonight","body":"Grown up, this one is yours. Say it word for word: if you stop and tell, I will never be cross with you, whatever was on the screen. Then let them hear you mean it.",
  "script":"The promise is the engine of the whole rule. A child who believes it tells you everything. One who doubts it tells you nothing."}
] $ex$::jsonb, 'dance')
where stage_id = 'foundation' and status = 'live' and title = 'The stop and tell rule'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── When the screen goes to sleep ───────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Our special words","words":[
  {"word":"the whisper","meaning":"The quiet five more minutes warning before the end."},
  {"word":"the next thing","meaning":"What we run to after the screen: a snack, a story, a job."}],
  "script":"Say each word and let your child say it back. The whisper and the next thing are the two halves of every calm ending."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Why do endings feel easier after the whisper?","options":[
  {"text":"Because whispering is quieter than shouting","correct":false,"feedback":"It is quiet, but that is not the magic. The magic is TIME: your body gets five minutes to get ready."},
  {"text":"Because nothing is a surprise. My body gets ready","correct":true,"feedback":"That is it. Big feelings come from sudden stops. The whisper means the stop is never sudden."},
  {"text":"They do not, endings always feel horrible","correct":false,"feedback":"Endings are hard, and the whisper makes them smaller. Ask your body next time: it will notice."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"The screen is done and your body still feels cross. What helps most?","options":[
  {"text":"Grabbing the tablet back","correct":false,"feedback":"That makes the ending start all over again, crosser than before. The next thing is the way out."},
  {"text":"Waving bye bye and running to the next thing","correct":true,"feedback":"The wave finishes it, the next thing catches you. Cross feelings shrink fast when your hands are busy."},
  {"text":"Shouting until the feeling goes","correct":false,"feedback":"Shouting feeds the cross feeling. A snack, a story or a job helping shrinks it much faster."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "The whisper comes first: five more minutes.",
  "Wave bye bye screen, see you tomorrow.",
  "Run straight to the next thing together."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Pick tomorrow's next thing tonight","body":"Before bed, let your child choose what comes straight after screen time tomorrow, and have it ready. A snack, a story, a job with you. Their choice, waiting for them.",
  "script":"A next thing they chose themselves pulls twice as hard as one you announce at switch off time."}
] $ex$::jsonb, 'football')
where stage_id = 'foundation' and status = 'live' and title = 'When the screen goes to sleep'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Who is behind the screen ────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Our special words","words":[
  {"word":"stranger","meaning":"Someone we have never met, even a friendly one."},
  {"word":"special information","meaning":"My name, my home, my school."}],
  "script":"Say each word and let your child say it back. Friendly stranger is the pair of words this lesson exists to put together."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"A player gives you a present in the game and asks to be your friend. What do you do?","options":[
  {"text":"Say yes, presents mean they are kind","correct":false,"feedback":"Presents are how screen strangers say trust me. You do not have to answer. Come and show your grown up."},
  {"text":"Come and show my grown up before answering","correct":true,"feedback":"Exactly. You never have to answer anyone in a game. Showing first is always the strong move."},
  {"text":"Give them my name to say thank you","correct":false,"feedback":"Your name is special information. A thank you never needs it, and a stranger never gets it."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Can a stranger in a game feel like a friend?","options":[
  {"text":"No, strangers always feel scary","correct":false,"feedback":"That is the tricky bit: they often feel lovely. Feeling friendly does not make someone known."},
  {"text":"Yes, and they are still a stranger","correct":true,"feedback":"Both things at once. They can be funny and kind AND someone we have never met. Show your grown up."},
  {"text":"Yes, so they become a real friend","correct":false,"feedback":"Real friends are people your family knows in real life. Screen friendly is not the same as known."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Screen people are strangers, even friendly ones.",
  "Special information stays ours: name, home, school.",
  "Come and show me. Showing is always safe."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Practise come and show me","body":"Play pretend tonight: you are a game character saying hi, what is your name? Your child puts the pretend screen down, runs over and shows you. Cheer the showing.",
  "script":"Rehearsed once for pretend, the run to show you becomes the reflex when a real hello ever comes."}
] $ex$::jsonb, 'football')
where stage_id = 'foundation' and status = 'live' and title = 'Who is behind the screen'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Big feelings and the screen ─────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Our special words","words":[
  {"word":"fizzy","meaning":"The shaken bottle feeling screens can leave in your body."},
  {"word":"visitor","meaning":"What a feeling is. It comes, and then it goes."}],
  "script":"Say each word and let your child say it back. Feelings as visitors is the idea that makes every later conversation possible."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"Which feelings are allowed after screen time?","options":[
  {"text":"Only the calm, happy ones","correct":false,"feedback":"Then fizzy and wobbly would have nowhere to go! Every feeling is allowed. It is what we DO with them that we practise."},
  {"text":"All of them. Fizzy, wobbly and calm","correct":true,"feedback":"All of them, always. Feelings are visitors, and no visitor is naughty just for turning up."},
  {"text":"None, feelings should stay hidden","correct":false,"feedback":"Hidden feelings grow bigger in the dark. Named ones shrink. Bring them out to your grown up."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Why does saying I feel fizzy out loud actually help?","options":[
  {"text":"It does not, words are just words","correct":false,"feedback":"Try it and watch! A named feeling is a tamed feeling. Saying it starts the shrinking."},
  {"text":"Naming a feeling makes it smaller","correct":true,"feedback":"That is the trick. A named feeling is a tamed feeling, and a grown up nearby shrinks it even faster."},
  {"text":"It makes the feeling go fizzier","correct":false,"feedback":"The opposite! Keeping it in is what shakes the bottle. Naming it lets the fizz out slowly and safely."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Fizzy, wobbly or calm, every feeling is allowed.",
  "A named feeling is a tamed feeling.",
  "Bring your feelings to your grown up, always."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"The feelings check tonight","body":"After screen time tonight, you both say one word for how your body feels. Grown up goes first, and be honest: children can smell a pretend feeling a mile off.",
  "script":"You going first, truthfully, is the whole exercise. It shows naming feelings is a family thing, not a child thing."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'foundation' and status = 'live' and title = 'Big feelings and the screen'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── Is this app safe to open? ───────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Our special words","words":[
  {"word":"green","meaning":"My grown up said yes. I can open it."},
  {"word":"amber","meaning":"I do not know yet, so I ask first."},
  {"word":"red","meaning":"We looked together and it is not for me."}],
  "script":"Three lights, three words. Say each one and let your child act it: green go, amber freeze and ask, red turn away."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"A video ends and a new one starts playing all by itself. What light is the new one?","options":[
  {"text":"Green, the screen chose it for me","correct":false,"feedback":"The screen choosing is exactly why it is NOT green. Nobody in your family picked it. Amber: ask first."},
  {"text":"Amber. I did not choose it, so I ask","correct":true,"feedback":"Spot on. Things that arrive by themselves always start amber, however fun they look."},
  {"text":"Red, all new videos are bad","correct":false,"feedback":"Not bad, just unknown! Amber means we find out together. Plenty of ambers turn green."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"What turns an amber game green?","options":[
  {"text":"Really really wanting it","correct":false,"feedback":"Wanting is allowed and it is not the test. Green comes from looking at it with your grown up."},
  {"text":"Looking at it together with my grown up","correct":true,"feedback":"That is the only door. You ask, you look together, and the light changes for real."},
  {"text":"Waiting until tomorrow","correct":false,"feedback":"Time does not change lights. An amber left alone stays amber. Asking is what moves it."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "Green is yes. Amber is ask first. Red is not for me.",
  "New things always start amber.",
  "Asking is free, and asking turns ambers green."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Sort your apps tonight","body":"Open the home screen together and give every app its light. Green, amber or red, out loud, one by one. Any ambers get looked at together this week.",
  "script":"Ten minutes of sorting tonight gives every future ask a shared language: is that one green for me?"}
] $ex$::jsonb, 'football')
where stage_id = 'foundation' and status = 'live' and title = 'Is this app safe to open?'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');

-- ── My online neighbourhood ─────────────────────────────────────────────────
update public.lessons set slides = public.gc_add_school_arc(slides,
$kw$ {"type":"keywords","phase":"starter","minutes":1,"heading":"Our special words","words":[
  {"word":"neighbourhood","meaning":"The online places where you play and talk with people you know."},
  {"word":"good neighbour","meaning":"Taking turns, kind words, helping when someone is stuck."}],
  "script":"Say each word and let your child say it back. Then name one real neighbour you both like, and hold that picture for the lesson."} $kw$::jsonb,
$ex$ [
{"type":"choice","phase":"prove","minutes":2,"question":"You win the game three times in a row. What does a good neighbour do?","options":[
  {"text":"Shout I am the champion at everyone","correct":false,"feedback":"Champions who shout run out of neighbours to play with. Winning kindly keeps the game going."},
  {"text":"Offer a turn and say good game","correct":true,"feedback":"That is a good neighbour. Everyone gets more games, and everyone wants you in them."},
  {"text":"Stop playing so nobody else can win","correct":false,"feedback":"Taking the game away is the opposite of taking turns. Good neighbours keep the fun going."}]},
{"type":"choice","phase":"prove","minutes":2,"question":"Is the you in the game the same you as at home?","options":[
  {"text":"No, screen me can be anyone","correct":false,"feedback":"The screen changes what people can SEE, never who you ARE. Your kindness travels with you."},
  {"text":"Yes. Same kind person, everywhere I go","correct":true,"feedback":"That is the whole lesson in one line. One you, at home, at school and in every online place."},
  {"text":"Only when my grown up is watching","correct":false,"feedback":"Good neighbours are good when nobody is watching. That is what makes it real."}]},
{"type":"recap","phase":"close","minutes":1,"heading":"The lesson in three ticks","points":[
  "You already belong to an online neighbourhood.",
  "Good neighbours take turns, help, and use kind words.",
  "You are the same kind person everywhere you go."]},
{"type":"tryit","phase":"close","minutes":1,"heading":"Wave to the neighbourhood","body":"On your next family video call, let your child run the hellos and the goodbyes. The waving, the asking how people are: that is being a good neighbour, live.",
  "script":"Hosting the hellos gives them the good neighbour job for real, at the friendliest end of their neighbourhood."}
] $ex$::jsonb, 'celebrate')
where stage_id = 'foundation' and status = 'live' and title = 'My online neighbourhood'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'keywords');
