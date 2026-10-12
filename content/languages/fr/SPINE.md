# French KS2 spine: how it is put together

This note is for the primary teacher reviewing the French spine. The spine itself is `spine.json` in this folder. Every lesson, worksheet and print is generated from it, so a change here changes everything downstream.

Year 3 is planned lesson by lesson. Years 4, 5 and 6 are planned unit by unit for now, and are filled in once Year 3 has been taught and reviewed.

## The shape

- 6 units a year, 6 lessons a unit, about 40 minutes a lesson.
- Every lesson has 3 to 5 new words, one grammar focus, one or two sounds, three "I can" statements, a speaking task and a short chant, rhyme or story page.
- Year 3 teaches 127 words, 30 sound spelling links and 25 grammar points. Years 4 to 6 add about 325 more words (105, 110, 110), so KS2 ends near 450.

Year 3 is above the 100 words first pencilled in. The floor of three new words in every lesson sets a minimum of 108, and the Year 3 frame asks for numbers to twenty, all seven days and the core greetings, which brings it to 127. Years 4 to 6 were trimmed to keep the KS2 total where it was.

## Where the words come from

Topics are only the setting. The words are chosen because they are frequent in French, so that a child who leaves Year 6 already knows a slice of the GCSE list and secondary does not start again from zero.

- **gcse_list** is true when a word is on both the AQA and the Pearson Edexcel GCSE French lists. Both boards must build their lists mostly from the 2,000 most frequent French words, so a word on both is a safe high frequency word. We use the board lists as a check only. Nothing is copied from them.
- **dfe_annex_e** is true when the word is on the DfE's own required list (Annex E of the GCSE subject content), which is Crown copyright under the Open Government Licence. 38 Year 3 words are on it, mostly the verbs, articles and question words that hold sentences together.
- 122 of the 127 Year 3 words are on both board lists. The five that are not each carry a reason in their note: chat (on Edexcel only, and we need the cat for the family unit and the story), dix-sept, dix-huit and dix-neuf (built from two known words), and il neige (Edexcel lists it, AQA lists the noun neige).
- No word list, text or sequence from a commercial scheme has been used.

## Sounds first, and silent letters for seven year olds

Every lesson opens with a short phonics slot. French spelling is less regular than Spanish, so the sounds strand carries more weight here. Children who are never taught the sound spelling links do not pick them up from listening, even after a year of lessons.

The order runs from sounds that are easy and frequent to the harder ones:

- Unit 1: i, ou, a, u, oi, silent final consonants, ui, an and en, and liaison as a teacher note.
- Unit 2: on, ch, é, è and ê and ai, closed eu, and the silent final e.
- Unit 3: r, open eu and œu, qu, the z of onze and douze, ien, in and ain.
- Unit 4: j and soft g, ç and soft c, er and ez at the end, s between vowels and ss.
- Unit 5: un, the soft e, au and eau, ei, eil.
- Unit 6: review inside the story.

Each sound has three example words the class already knows or can guess, and a teacher tip on how to make it.

**Silent letters.** Seven year olds meet them in Unit 1 with deux and trois, and we treat them as sleeping letters. The class draws a little sleeping face over the last letter. Four letters at the end usually wake up, c, r, f and l, and the word careful is the hook (avec, bonjour, neuf, il). In Unit 2 the same idea pays off with gender: the silent final e wakes the letter before it, so petit has a sleeping t and petite says it. That is how children hear a feminine adjective before they can explain one. Liaison (deux ans sounding like "deu zan") is a teacher note in Year 3: children copy it from the audio and do not need the rule yet.

The end point is the 35 sound spelling links listed for GCSE French by the DfE. The `gcse_ssc` field on each sound says which of them it covers. Year 3 teaches 26 of them, Year 4 another 8, and the last one (ail, as in travail) comes at the start of Year 5. Year 6 secures them through dictation and reading aloud, and the Year 7 transition record lists which ones a class has secured.

## Grammar: explicit, small, then recycled

One point per lesson, said plainly, then met again in later lessons. The high frequency verbs come early and in the forms children need: je suis and j'ai in Unit 1, c'est and il y a in Unit 2, il est, elle est, il a and elle a in Unit 3, j'aime and je n'aime pas in Unit 4.

Two choices worth a look:

- Age is taught with avoir (j'ai huit ans) in the same lesson as the warning that je suis huit is wrong. It is the most common Year 3 error and it is cheaper to stop early.
- Gender is colour coded from the first noun, and every noun is learnt with un or une, never alone.

## Recycling

New words are taught in themed groups, because mixing brand new words from different topics slows learning. What gets mixed is the things children confuse: le and la, mon and ma, son and sa, je suis and j'ai, an and on.

Old words come back on a fixed spacing pattern. Each lesson's `recycled_words` holds the words from 1, 3, 6 and 9 lessons before. At one lesson a week that is a week, three weeks, a unit and about two months, so every word gets a long gap near day 60 as well as the short ones. The lesson starter is built from that list, and the home word bank runs the short daily gaps in between. Every Year 3 word comes back at least three times. The nine words taught in the last three lessons of the year cannot fit three returns before July, so they are listed as `carry_over_words` and open the Year 4 starters.

## Unit 6: our story

The class story follows Bloop, Pebble and a missing black cat, one page per lesson, then a performance and the end of year check. Every word on every page has already been taught: 88 words of story, 100% known, apart from the two names. Every chant and mini reader earlier in the year was checked the same way. The floor for a teacher led class reader is 95% known words, and anything a child reads alone at home should be at 98% or above.

The last three lessons teach classroom and goodbye words (écoute, répète, encore, vacances, à bientôt). They are words the class will hear every week from then on, which is why they are safe to teach at the end.

## The programme of study

Each lesson lists the KS2 statements it meets, using ks2-1 to ks2-12 in statutory order. All twelve are covered in Year 3. The dictionary statement (ks2-9) is met in Units 2, 4 and 5 with a picture dictionary and a word list, and presenting to an audience (ks2-6) in Units 3, 4, 5 and the Unit 6 performance.

## Years 4 to 6 in one line each

- **Year 4:** birthdays and dates, my body, where I live, the café, sport and time, a class play. Dictation starts in Unit 6.
- **Year 5:** going out, school opinions with reasons, clothes, animals of our planet, holiday plans, a class news report. The near future and the full present of er verbs.
- **Year 6:** my day, then and now, last weekend, healthy me, the wider world, ready for Year 7. The past with avoir and être, and a text in three time frames.

## What to check first

1. Does every French example read as natural French a child in France would say? Please flag anything stiff.
2. Is the order of sounds teachable? In particular, is fish lips the cue you use for u, and do you agree with treating un and in as one sound in the audio, which is what most speakers in France now do?
3. Are 3 to 5 new words a lesson right for your Year 3 class, or should Unit 1 slow down?
4. The story pages in Unit 6: do they work read aloud, and is the plot clear from the pictures and the French alone?
