#!/usr/bin/env python3
"""The full VotesforSchools reply, generated from Justin's cut.

Every beat is anchored to a word Justin says (full/words.json, aligned to the
script below), so a re-cut only needs the words re-run, not the beats re-timed.
The look is sample 3 (frosted glass, the camera that never sleeps, paper
takeovers, real screens in browser cards), which follows Nate Herk's kit
(GuidedChildhood/Natemotion) dressed in our motion standard
(.claude/skills/talking-head-video/motion-standard.md). Real footage only:
our live lesson slides (schools.guidedchildhood.com), Meta's own newsroom page
for Muse (credited), and unbranded B-roll labelled illustrative.

  python3 full/gen.py   writes full/index.html
"""
import json, re, difflib, html, os

HERE = os.path.dirname(os.path.abspath(__file__))
OPEN = 2.6           # the silent 59,000 cold open before Justin
VOICE = 150.2        # length of talking.mp4
ENDCARD = 4.6
TOTAL = round(OPEN + VOICE + ENDCARD, 2)

# What Justin actually says, card by card (captions use these words, never
# the transcriber's mishearings).
SCRIPT = {
 1: "59,000 of you voted on smart glasses. That's a full football stadium of opinions. And honestly, some of them were sharper than us adults. I'm Justin. I run Guided Digital Childhood. We help families and schools keep the good of screens, learn the risks and make sure there's no cliff edge at the age of 16.",
 2: "You spotted the problem straight away. Being filmed without knowing, glasses on the roads, in tests and what happens to your data. And when enough people like you speak up, companies do move. This summer Meta made its glasses stop recording if you cover the light. Good start, but a light is not permission. It needs to go further.",
 3: "And you were right, there's real good here too. Glasses can translate and read text aloud for people with sight loss. Meta has even announced hearing support for some adults with hearing loss.",
 4: "Here's what's coming next. Meta's bringing an AI agent, Muse, to glasses in the next few months. So you'll be able to talk to your glasses and ask them to do things for you.",
 5: "So learning about tech can't stop at screens anymore. It has to cover the tech you wear and talk to.",
 6: "So here's the honest bit. Left alone, founders like me sit in a meeting room deciding what you need to know. Then we build a beautiful lesson about completely the wrong thing. You're the ones living with this. What you know and what you see in the real world should shape the answer. That's what VotesforSchools gets right. It asks the people it's actually about.",
 7: "So you asked for three simple rules. Ask before you film anyone. Say please stop if someone films you. Tell a trusted adult if it doesn't stop. So we've made those three the heart of the lesson we're building with our Planet Friends, in our Guided Childhood platform. Five characters, one for each stage from the age of 4 to 16. And yes, the adults and tech companies have homework to do too.",
 8: "So we'll share that lesson with VotesforSchools, free for your schools. Then we'll come back and show you exactly how your ideas have shaped it.",
 9: "So thank you. You know this world better than we do. Keep telling us, and we'll keep listening.",
}

norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower().replace("votesforschools", "vote"))
words = json.load(open(os.path.join(HERE, "words.json")))       # [t0, t1, word, card]

# ---- align the script to the transcript, card by card ----
ALIGNED = {}   # card -> list of [word, t]
for c, text in SCRIPT.items():
    sw = text.split()
    ww = [w for w in words if w[3] == c]
    a = [norm(w) for w in sw]; b = [norm(w[2]) for w in ww]
    times = [None] * len(sw)
    for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for k in range(blk.size):
            times[blk.a + k] = ww[blk.b + k][0]
    # interpolate the gaps
    known = [i for i, t in enumerate(times) if t is not None]
    for i in range(len(times)):
        if times[i] is None:
            lo = max([k for k in known if k < i], default=None); hi = min([k for k in known if k > i], default=None)
            if lo is None: times[i] = times[hi] - 0.3 * (hi - i)
            elif hi is None: times[i] = times[lo] + 0.3 * (i - lo)
            else: times[i] = times[lo] + (times[hi] - times[lo]) * (i - lo) / (hi - lo)
    ALIGNED[c] = [[w, round(t, 2)] for w, t in zip(sw, times)]

def T(card, word, occ=1, after=None):
    """Voice time of the occ-th occurrence of word in a card (optionally after a time)."""
    n = 0
    for w, t in ALIGNED[card]:
        if after is not None and t < after: continue
        if norm(w) == norm(word):
            n += 1
            if n == occ: return t
    raise KeyError(f"{word} #{occ} not in card {card}")

F = lambda t: round((t + OPEN) * 60) / 60      # voice time to composition time, on a frame
F0 = lambda t: round(t * 60) / 60
esc = html.escape

H = []   # html
J = []   # timeline js
HIDE = []  # voice time ranges with no captions
LEFT = []  # voice time ranges where the camera reframes right

def tl(s): J.append(s)

# ---------------- components ----------------
_id = [0]
def nid(p): _id[0] += 1; return f"{p}{_id[0]}"

def enter(sel, at, dur=0.45, frm="{opacity:0,x:-90}", to="{opacity:1,x:0}"):
    tl(f'tl.fromTo("{sel}",{frm},{{...{to},duration:{dur},ease:"power3.out"}},{F(at)});')
def leave(sel, at, dur=0.3):
    tl(f'tl.to("{sel}",{{opacity:0,x:-60,duration:{dur},ease:"power2.in"}},{F(at)});')
def mark(sel, at): tl(f'tl.fromTo("{sel}",{{"--m":0}},{{"--m":1,duration:0.4,ease:"power2.out"}},{F(at)});')
def pop(sel, at, dur=0.4): tl(f'tl.fromTo("{sel}",{{opacity:0,y:22}},{{opacity:1,y:0,duration:{dur},ease:"expo.out"}},{F(at)});')

def panel(a, b, inner, after=None):
    """Glass panel on the left while the camera slides Justin right."""
    i = nid("pn")
    H.append(f'<div class="glass panel" id="{i}"><div class="sheen"></div><div class="shine"></div><div class="pc">{inner}</div></div>')
    enter(f"#{i}", a + 0.12, 0.55, "{opacity:0,x:-110,rotation:-1.5}", "{opacity:1,x:0,rotation:0}")
    tl(f'tl.fromTo("#{i} .shine",{{x:0}},{{x:1300,duration:0.8,ease:"power2.out"}},{F(a+0.2)});')
    tl(f'tl.fromTo("#{i} .pc > *",{{opacity:0,y:16}},{{opacity:1,y:0,duration:0.4,ease:"power3.out",stagger:0.06}},{F(a+0.3)});')
    if after: after(i)
    if b is not None: leave(f"#{i}", b - 0.3)
    LEFT.append((a, b if b is not None else VOICE))
    return i

def screen(a, b, img, url, tag):
    """A real page in a glass browser card on the left, gently drifting."""
    i = nid("sc")
    H.append(f'<div class="screen" id="{i}"><div class="chrome"><i></i><i></i><i></i><div class="url">{esc(url)}</div></div>'
             f'<div class="shot"><img src="assets/{img}" alt=""></div></div><div class="stag" id="{i}t">{esc(tag)}</div>')
    tl(f'tl.fromTo("#{i}",{{opacity:0,x:-140,rotationY:24,transformPerspective:1800}},{{opacity:1,x:0,rotationY:9,transformPerspective:1800,duration:0.7,ease:"power3.out"}},{F(a+0.1)});')
    tl(f'tl.to("#{i}",{{rotationY:4,y:-10,transformPerspective:1800,duration:{max(0.5,b-a-0.9):.2f},ease:"sine.inOut"}},{F(a+0.8)});')
    tl(f'tl.fromTo("#{i} img",{{scale:1.0}},{{scale:1.06,duration:{b-a:.2f},ease:"none"}},{F(a)});')
    pop(f"#{i}t", a + 0.5)
    tl(f'tl.to("#{i}, #{i}t",{{opacity:0,x:-60,duration:0.3,ease:"power2.in"}},{F(b-0.3)});')
    LEFT.append((a, b))

def broll(a, b, src, ms, small, big):
    i = nid("br")
    H.append(f'<div class="broll" id="{i}"><video id="{i}v" class="clip" src="assets/{src}" muted playsinline data-start="{F(a):.3f}" data-duration="{b-a:.2f}" data-media-start="{ms}" data-track-index="2"></video>'
             f'<div class="tag">Illustrative footage</div><div class="glass pill" id="{i}p"><small>{esc(small)}</small>{esc(big)}</div></div>')
    whip(a)
    tl(f'tl.fromTo("#{i}",{{opacity:0,filter:"blur(18px)"}},{{opacity:1,filter:"blur(0px)",duration:0.3,ease:"power2.out"}},{F(a)});')
    tl(f'tl.fromTo("#{i}v",{{scale:1.0}},{{scale:1.1,duration:{b-a:.2f},ease:"none"}},{F(a)});')
    pop(f"#{i}p", a + 0.45)
    tl(f'tl.to("#{i}",{{opacity:0,duration:0.2,ease:"power2.in"}},{F(b-0.2)});')

def paper(a, b, inner, ruler=0.5):
    i = nid("pp")
    H.append(f'<div class="paper" id="{i}"><div class="dots" id="{i}d"></div><div class="crop tl"></div><div class="crop tr"></div><div class="crop bl"></div><div class="crop br"></div>'
             f'{inner}<div class="ruler"><div class="line"></div><div class="fill" style="width:{int(ruler*100)}%"></div>'
             + "".join(f'<span style="left:{p}%">{n}</span>' for p, n in [(0,4),(25,7),(50,10),(66,12),(91,15),(100,16)]) + '</div></div>')
    whip(a)
    tl(f'tl.fromTo("#{i}",{{opacity:0}},{{opacity:1,duration:0.12,ease:"none"}},{F(a)});')
    tl(f'tl.fromTo("#{i}d",{{x:0,y:0}},{{x:-26,y:-20,duration:{b-a:.2f},ease:"none"}},{F(a)});')
    whip(b)
    tl(f'tl.to("#{i}",{{opacity:0,duration:0.12,ease:"none"}},{F(b)});')
    HIDE.append((a, b))
    return i

_wh = [0]
def whip(at):
    _wh[0] += 1; i = f"sk{_wh[0]}"
    H.append(f'<div class="streak" id="{i}"></div>')
    tl(f'tl.fromTo("#{i}",{{xPercent:-160,skewX:-12}},{{xPercent:500,skewX:-12,duration:0.36,ease:"power3.in"}},{F(at-0.18)});')

def chap(a, b, label):
    i = nid("ch"); H.append(f'<div class="chap" id="{i}">{esc(label)}</div>')
    tl(f'tl.fromTo("#{i}",{{opacity:0,x:-24}},{{opacity:1,x:0,duration:0.4,ease:"power3.out"}},{F(a)});')
    tl(f'tl.to("#{i}",{{opacity:0,duration:0.2,ease:"power2.in"}},{F(b)});')

PUNCH = []
def punch(t, s): PUNCH.append((t, s))

def kin(lines):
    """Kinetic words over the camera, lower left: [(text, t)], out at the last t + hold."""
    i = nid("kn")
    H.append(f'<div class="kin" id="{i}">' + "<br>".join(f'<span class="w" id="{i}w{k}">{esc(t)}</span>' for k, (t, _) in enumerate(lines[:-1])) + '</div>')
    for k, (t, at) in enumerate(lines[:-1]):
        tl(f'tl.fromTo("#{i}w{k}",{{opacity:0,y:80,filter:"blur(14px)"}},{{opacity:1,y:0,filter:"blur(0px)",duration:0.36,ease:"expo.out"}},{F(at)});')
    tl(f'tl.to("#{i} .w",{{opacity:0,y:-60,filter:"blur(14px)",duration:0.28,ease:"power2.in"}},{F(lines[-1][1])});')

# ======================= the edit =======================
M = {m["label"]: m["at"] for m in reversed(json.load(open(os.path.join(HERE, "marks.json"))))}

# ---- card 1: the hook and who I am ----
punch(0, 1.0); punch(T(1, "honestly") - 0.05, 1.14)
screen(T(1, "sharper") - 0.4, M["intro"] - 0.1, "slide-08.jpg", "schools.guidedchildhood.com · Should people wear smart glasses?", "From our lesson: the real vote")
punch(M["intro"], 1.0)
i = nid("nm"); H.append(f'<div class="glass name" id="{i}"><b>Justin Phillips</b><span>Founder, Guided Digital Childhood</span></div>')
pop(f"#{i}", T(1, "I'm")); tl(f'tl.to("#{i}",{{opacity:0,y:-10,duration:0.3,ease:"power2.in"}},{F(T(1,"We")-0.3)});')
panel(T(1, "We") - 0.25, M["concerns"] - 0.1,
      '<div class="eb">What we do</div><div class="row" id="w1">Keep the good</div><div class="row" id="w2">Learn the risks</div><div class="row" id="w3">No <span class="mark" id="w3m">cliff edge</span> at 16</div>',
      after=lambda i: (pop("#w1", T(1, "good")), pop("#w2", T(1, "learn")), pop("#w3", T(1, "cliff") - 0.2), mark("#w3m", T(1, "edge"))))

# ---- card 2: what you raised ----
chap(M["concerns"], M["good"] - 0.2, "01 · What you raised")
punch(M["concerns"], 1.12)
broll(T(2, "Being") - 0.15, T(2, "glasses") - 0.1, "b1-filmed.mp4", 0.6, "You pointed out", "Filmed without knowing")
screen(T(2, "glasses") - 0.1, T(2, "enough") - 0.35, "slide-21.jpg", "schools.guidedchildhood.com · Should people wear smart glasses?", "From our lesson: where to be extra careful")
punch(T(2, "enough") - 0.35, 1.0); punch(T(2, "companies"), 1.16)
kin([("You speak up.", T(2, "speak")), ("Companies move.", T(2, "companies")), ("", T(2, "This") - 0.3)])
broll(T(2, "This") - 0.1, T(2, "Good") - 0.15, "b2-cover-light.mp4", 0.2, "Summer 2026", "Cover the light, recording stops")
p = paper(T(2, "Good") - 0.15, M["good"] - 0.05,
    '<div class="eb ctr" id="gs">Good start. But</div><div class="slam" id="slam1"><span class="w">a</span><span class="w">light</span><span class="w">is</span><span class="w">not</span><br><span class="w"><span class="mark" id="pm">permission</span></span></div>'
    '<img class="star3d" id="st1" src="assets/DiGi-star-3d.png" alt=""><div class="sub" id="sub1">It needs to go further.</div>', ruler=0.35)
pop("#gs", T(2, "Good"))
for k, (w, occ) in enumerate([("a", 1), ("light", 2), ("is", 1), ("not", 1), ("permission", 1)]):
    sel = f'#slam1 .w:nth-child({k+1 if k < 4 else 6})'
    tl(f'tl.fromTo("{sel}",{{opacity:0,scale:2.6,filter:"blur(16px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.26,ease:"expo.out"}},{F(T(2,w,occ) - 0.05)});')
mark("#pm", T(2, "permission") + 0.35)
sa = T(2, "permission") + 0.7
tl(f'tl.fromTo("#st1",{{opacity:0,y:-280,scaleX:1,scaleY:1}},{{opacity:1,y:0,duration:0.32,ease:"power2.in"}},{F(sa)});')
tl(f'tl.to("#st1",{{scaleX:1.22,scaleY:0.78,duration:0.08,ease:"power2.out"}},{F(sa+0.32)});')
tl(f'tl.to("#st1",{{scaleX:1,scaleY:1,duration:0.4,ease:"power3.out"}},{F(sa+0.4)});')
pop("#sub1", T(2, "It") - 0.1)

# ---- card 3: the good (angle B) ----
chap(M["good"] + 0.1, M["coming"] - 0.2, "02 · The good")
punch(M["good"], 1.0)
panel(M["good"] + 0.05, T(3, "Glasses") - 0.05,
      '<div class="eb">You were right</div><div class="st">There is<br><span class="mark" id="g1m">real good</span><br>here.</div>',
      after=lambda i: mark("#g1m", T(3, "good")))
screen(T(3, "Glasses") - 0.05, T(3, "read") - 0.1, "slide-11.jpg", "schools.guidedchildhood.com · Should people wear smart glasses?", "From our lesson: reading a menu abroad")
broll(T(3, "read") - 0.1, T(3, "Meta") - 0.05, "b3-read-aloud.mp4", 0.8, "You were right", "Reads text aloud")
panel(T(3, "Meta") - 0.05, M["coming"] - 0.1,
      '<div class="eb">Announced by Meta</div>'
      '<svg width="560" height="210" viewBox="0 0 690 260" style="margin-top:6px"><path d="M90 220c-34 0-58-28-58-76 0-66 46-116 108-116 58 0 100 44 100 100 0 42-24 62-44 80-16 15-22 28-22 46" fill="none" stroke="#1A1A2E" stroke-width="11" stroke-linecap="round"/>'
      '<path class="wave" d="M280 102c22 26 22 76 0 102" fill="none" stroke="#C99A28" stroke-width="11" stroke-linecap="round"/><path class="wave" d="M318 72c38 42 38 120 0 162" fill="none" stroke="#C99A28" stroke-width="11" stroke-linecap="round"/><path class="wave" d="M356 42c54 60 54 162 0 222" fill="none" stroke="#C99A28" stroke-width="11" stroke-linecap="round"/></svg>'
      '<div class="st" style="font-size:84px">Hearing support</div><div class="eb ink"><span class="mark" id="h1m">for some adults</span></div>',
      after=lambda i: (tl(f'tl.fromTo("#{i} .wave",{{opacity:0,scale:0.5,transformOrigin:"0% 50%"}},{{opacity:1,scale:1,duration:0.35,ease:"power2.out",stagger:0.16}},{F(T(3,"hearing"))});'), mark("#h1m", T(3, "some"))))

# ---- card 4: what is coming ----
chap(M["coming"] + 0.05, M["main"] - 0.2, "03 · What is coming")
punch(M["coming"], 1.0)
ma, mb = M["coming"] + 0.05, T(4, "talk") - 0.6
H.append('<div class="blurcam" id="blurcam"></div>'
         '<div class="museg" id="museg"><div class="glass" style="padding:44px 52px;border-radius:34px"><div class="eb">Meta\'s AI agent</div>'
         '<div class="word"><span class="ml">M</span><span class="ml">u</span><span class="ml">s</span><span class="ml">e</span><span class="cursor"></span></div>'
         '<div class="when" id="when">coming to glasses in the next few months</div></div></div>'
         f'<div class="browser" id="browser"><div class="chrome"><i></i><i></i><i></i><div class="url">about.fb.com/news · The Biggest News From Connect 2026</div></div>'
         f'<video id="vmeta" class="clip" src="assets/meta-muse.mp4" muted playsinline data-start="{F(ma):.3f}" data-duration="{mb-ma:.2f}" data-media-start="6.4" data-track-index="3"></video></div>'
         '<div class="credit" id="credit">Source: Meta Newsroom, Connect 2026</div>')
whip(ma)
tl(f'tl.to("#blurcam",{{opacity:1,duration:0.35,ease:"power2.out"}},{F(ma)});')
tl(f'tl.fromTo("#museg",{{opacity:0,x:-80}},{{opacity:1,x:0,duration:0.5,ease:"power3.out"}},{F(ma+0.15)});')
tl(f'tl.set("#museg .ml",{{opacity:0}},{F(ma)});')
tl(f'tl.to("#museg .ml",{{opacity:1,duration:0.01,ease:"none",stagger:0.11}},{F(T(4,"Muse")-0.1)});')
pop("#when", T(4, "next", 2) - 0.2)
tl(f'tl.fromTo("#browser",{{opacity:0,rotationY:-30,x:180,transformPerspective:1600}},{{opacity:1,rotationY:-12,x:0,transformPerspective:1600,duration:0.8,ease:"power3.out"}},{F(ma+0.3)});')
tl(f'tl.to("#browser",{{rotationY:-5,y:-14,transformPerspective:1600,duration:{mb-ma-1.2:.2f},ease:"sine.inOut"}},{F(ma+1.1)});')
pop("#credit", ma + 0.8)
tl(f'tl.to("#museg, #browser, #credit",{{opacity:0,duration:0.3,ease:"power2.in"}},{F(mb-0.35)});')
tl(f'tl.to("#blurcam",{{opacity:0,duration:0.35,ease:"power2.inOut"}},{F(mb-0.25)});')
panel(mb, M["main"] - 0.1,
      '<div class="eb">Talk to it</div><div><span class="bubble" id="bub">Hey Muse, order everything on this school list.</span></div>'
      '<div class="todo"><div class="r" id="q1"><span class="box"><b id="t1">✓</b></span>Pencils</div><div class="r" id="q2"><span class="box"><b id="t2">✓</b></span>Calculator</div><div class="r" id="q3"><span class="box"><b id="t3">✓</b></span>Pencil case</div></div>',
      after=lambda i: [tl(f'tl.fromTo("#t{k}",{{opacity:0,scale:0.3}},{{opacity:1,scale:1,duration:0.22,ease:"power2.out"}},{F(T(4,w,o))});') for k, w, o in [(1, "do", 1), (2, "things", 1), (3, "for", 1)]])

# ---- card 5: the main point (angle B), a takeover ----
punch(M["main"], 1.0)
paper(M["main"] + 0.05, M["view"] - 0.05,
      '<div class="two" id="m1"><div class="big"><span class="w">Learning about tech</span><br><span class="w">can\'t stop at <span class="strike" id="mstr">screens</span>.</span></div></div>'
      '<div class="two" id="m2"><div class="big" style="font-size:96px"><span class="w">It has to cover the tech</span><br><span class="w">you <span class="mark" id="mw">wear</span> and <span class="mark" id="mt">talk to</span>.</span></div></div>', ruler=0.55)
tl(f'tl.fromTo("#m1 .w",{{opacity:0,y:40,filter:"blur(14px)"}},{{opacity:1,y:0,filter:"blur(0px)",duration:0.4,ease:"expo.out",stagger:{max(0.3,T(5,"stop")-T(5,"learning")):.2f}}},{F(T(5,"learning")-0.1)});')
tl(f'tl.fromTo("#mstr",{{"--s":0}},{{"--s":1,duration:0.35,ease:"power2.out"}},{F(T(5,"screens")+0.2)});')
tl(f'tl.to("#m1",{{opacity:0,y:-40,filter:"blur(12px)",duration:0.3,ease:"power2.in"}},{F(T(5,"It")-0.3)});')
tl(f'tl.fromTo("#m2 .w",{{opacity:0,y:40,filter:"blur(14px)"}},{{opacity:1,y:0,filter:"blur(0px)",duration:0.4,ease:"expo.out",stagger:0.55}},{F(T(5,"It")-0.05)});')
mark("#mw", T(5, "wear")); mark("#mt", T(5, "talk"))

# ---- card 6: your view leads ----
chap(M["view"] + 0.1, M["rules"] - 0.2, "04 · Your view leads")
punch(M["view"], 1.18); punch(T(6, "Left") - 0.1, 1.0)
panel(T(6, "founders") - 0.6, T(6, "You're") - 0.15,
      '<div class="eb">The honest bit</div><div class="swap"><div class="st a" id="v1" style="font-size:76px">Founders deciding what you need to know</div>'
      '<div class="st b" id="v2" style="font-size:76px">A beautiful lesson about <span class="mark" id="v2m">completely the wrong thing</span></div></div>',
      after=lambda i: (tl(f'tl.set("#v2",{{opacity:0}},{F(T(6,"founders")-0.6)});'),
                       tl(f'tl.to("#v1",{{opacity:0,y:-20,duration:0.3,ease:"power2.in"}},{F(T(6,"beautiful")-0.4)});'),
                       tl(f'tl.fromTo("#v2",{{opacity:0,y:20}},{{opacity:1,y:0,duration:0.4,ease:"expo.out"}},{F(T(6,"beautiful")-0.15)});'),
                       mark("#v2m", T(6, "wrong"))))
screen(T(6, "You're") - 0.1, T(6, "That's") - 0.2, "slide-09.jpg", "schools.guidedchildhood.com · Should people wear smart glasses?", "A pupil who voted, in our lesson")
punch(T(6, "That's") - 0.2, 1.12)
panel(T(6, "That's") - 0.15, M["rules"] - 0.1,
      '<div class="eb">VotesforSchools</div><div class="st" style="font-size:80px">Asks the people it\'s <span class="mark" id="vfm">actually about</span>.</div><div class="eb ink" style="margin-top:26px">58,767 of you this time</div>',
      after=lambda i: mark("#vfm", T(6, "actually")))

# ---- card 7: your three rules ----
chap(M["rules"] + 0.1, M["promise"] - 0.2, "05 · Your three rules")
punch(M["rules"], 1.1)
paper(T(7, "Ask") - 0.45, T(7, "So", 2) - 0.2,
      '<div class="eb ctr" style="top:210px">The three rules you asked for</div><div class="rules">'
      '<div class="rule" id="r1"><b>Ask</b><span>before you film anyone</span></div>'
      '<div class="rule" id="r2"><b>Say</b><span>please stop</span></div>'
      '<div class="rule" id="r3"><b>Tell</b><span>a trusted adult</span></div></div>', ruler=0.75)
for k, w in [(1, "Ask"), (2, "Say"), (3, "Tell")]:
    tl(f'tl.fromTo("#r{k}",{{opacity:0,y:60,scale:0.9,filter:"blur(12px)"}},{{opacity:1,y:0,scale:1,filter:"blur(0px)",duration:0.42,ease:"expo.out"}},{F(T(7,w)-0.1)});')
screen(T(7, "So", 2) - 0.1, T(7, "Five") - 0.35, "slide-19.jpg", "schools.guidedchildhood.com · Should people wear smart glasses?", "Bloop teaches ask, say, tell in our lesson")
fa, fb = T(7, "Five") - 0.25, T(7, "And", 2) - 0.2
fr = [("pebble", "4 to 7"), ("bloop", "8 to 10"), ("orbit", "11 to 13"), ("nova", "13 to 15"), ("cosmo", "16 plus")]
paper(fa, fb, '<div class="eb ctr" style="top:170px">Our Planet Friends, one for each stage</div><div class="friends">'
      + "".join(f'<div class="fr" id="f{k}"><img src="assets/{n}.png" alt=""><b>{n.title()}</b><span>{a}</span></div>' for k, (n, a) in enumerate(fr)) + '</div>', ruler=1.0)
step = 0.32
for k in range(5):
    tl(f'tl.fromTo("#f{k}",{{opacity:0,y:90,scale:0.7}},{{opacity:1,y:0,scale:1,duration:0.45,ease:"back.out(1.6)"}},{F(fa+0.3+k*step)});')
panel(T(7, "adults") - 0.5, M["promise"] - 0.1,
      '<div class="eb">And yes</div><div class="st" style="font-size:76px">Homework for the grown ups too</div><div class="row" id="h1">The adults</div><div class="row" id="h2">The tech companies</div>',
      after=lambda i: (pop("#h1", T(7, "adults")), pop("#h2", T(7, "companies"))))

# ---- card 8: what happens next ----
chap(M["promise"] + 0.1, M["thanks"] - 0.2, "06 · What happens next")
punch(M["promise"], 1.0)
screen(T(8, "share") - 0.5, T(8, "Then") - 0.2, "slide-00.jpg", "schools.guidedchildhood.com/lesson/should-people-wear-smart-glasses", "The lesson, free for every school that voted")
panel(T(8, "Then") - 0.15, M["thanks"] - 0.1,
      '<div class="eb">Then</div><div class="st" style="font-size:80px">We come back and show you how your ideas shaped it</div>'
      '<div class="loop"><span id="l1">Your ideas</span><i>→</i><span id="l2">Our lesson</span><i>→</i><span id="l3">Back to you</span></div>',
      after=lambda i: (pop("#l1", T(8, "your")), pop("#l2", T(8, "ideas")), pop("#l3", T(8, "shaped"))))

# ---- card 9: thank you (angle B) and the lockup ----
punch(M["thanks"], 1.0); punch(T(9, "Keep") - 0.05, 1.12)
ea = VOICE + 0.1
H.append('<div class="endc" id="endc"><div class="dots"></div><img class="estar" id="estar" src="assets/DiGi-star-3d.png" alt="">'
         '<div class="eword" id="eword">Guided Digital Childhood</div><div class="ewith" id="ewith">with VotesforSchools</div></div>')
whip(ea)
tl(f'tl.fromTo("#endc",{{opacity:0}},{{opacity:1,duration:0.14,ease:"none"}},{F(ea)});')
tl(f'tl.fromTo("#estar",{{opacity:0,y:-260,scaleX:1,scaleY:1}},{{opacity:1,y:0,duration:0.34,ease:"power2.in"}},{F(ea+0.25)});')
tl(f'tl.to("#estar",{{scaleX:1.22,scaleY:0.78,duration:0.08,ease:"power2.out"}},{F(ea+0.59)});')
tl(f'tl.to("#estar",{{scaleX:1,scaleY:1,duration:0.4,ease:"power3.out"}},{F(ea+0.67)});')
pop("#eword", ea + 0.7, 0.6); pop("#ewith", ea + 1.2, 0.5)
HIDE.append((ea - 0.1, VOICE + ENDCARD))

# ---------------- the camera ----------------
# reframe: merge left side beats that touch, slide in once, out once
LEFT.sort(); merged = []
for a, b in LEFT:
    if merged and a - merged[-1][1] < 0.7: merged[-1][1] = max(merged[-1][1], b)
    else: merged.append([a, b])
for a, b in merged:
    tl(f'tl.to("#reframe",{{scale:1.32,duration:0.8,ease:"power3.inOut"}},{F(a)});')
    tl(f'tl.to("#reframe",{{scale:1,duration:0.7,ease:"power3.inOut"}},{F(b-0.1)});')
for t, s in sorted(PUNCH): tl(f'tl.set("#punch",{{scale:{s}}},{F(t)});')

# ---------------- captions ----------------
caps = []
for c in SCRIPT:
    cur = []
    for w, t in ALIGNED[c]:
        cur.append((w, t))
        if (w[-1] in ".?!" and len(cur) >= 3) or (w[-1] == "," and len(cur) >= 4) or len(cur) >= 7:
            caps.append(cur); cur = []
    if cur: caps.append(cur)
CAPJS = []
for k, ph in enumerate(caps):
    a = ph[0][1] - 0.08
    nxt = caps[k + 1][0][1] - 0.08 if k + 1 < len(caps) else VOICE
    b = min(nxt - 0.06, ph[-1][1] + 0.9)
    if any(x <= a < y for x, y in HIDE): continue
    for x, y in HIDE:
        if a < x < b: b = x - 0.05
    if b - a < 0.45: continue
    ws = [w for w, _ in ph]; ts = [t for _, t in ph] + [b]
    H.append(f'<div class="cap" id="cap{k}">' + " ".join(f'<span class="cw" id="cw{k}_{j}">{esc(w)}</span>' for j, w in enumerate(ws)) + '</div>')
    tl(f'tl.fromTo("#cap{k}",{{opacity:0,y:14}},{{opacity:1,y:0,duration:0.16,ease:"power2.out"}},{F(a)});')
    for j in range(len(ws)):
        tl(f'tl.fromTo("#cw{k}_{j}",{{backgroundColor:"rgba(237,195,95,0)",color:"#FFFBEE",textShadow:"0 4px 0 #1A1A2E"}},{{backgroundColor:"rgba(237,195,95,1)",color:"#1A1A2E",textShadow:"0 0 0 rgba(0,0,0,0)",duration:0.05,ease:"none"}},{F(ts[j])});')
        tl(f'tl.to("#cw{k}_{j}",{{backgroundColor:"rgba(237,195,95,0)",color:"#FFFBEE",textShadow:"0 4px 0 #1A1A2E",duration:0.05,ease:"none"}},{F(min(ts[j+1], b))});')
    tl(f'tl.to("#cap{k}",{{opacity:0,duration:0.04,ease:"none"}},{F(b)});')

CSS = open(os.path.join(HERE, "style.css")).read()
out = f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=1920, height=1080">
<title>Smart glasses reply: the full edit</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js" crossorigin="anonymous"></script>
<style>{CSS}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1920" data-height="1080">
<div class="reframe" id="reframe"><div class="drift" id="drift"><div class="punch" id="punch">
<video id="vt" class="clip" src="assets/talking.mp4" muted playsinline data-start="{OPEN}" data-duration="{VOICE}" data-media-start="0" data-track-index="1"></video>
</div></div></div>
<audio id="voice" src="assets/voice.m4a" data-start="{OPEN}" data-duration="{VOICE}" data-track-index="4" data-volume="1"></audio>
{chr(10).join(H)}
<div class="open" id="open"><div class="dots" id="odots"></div><div class="num" id="num">0</div><div class="lbl" id="olbl">pupils voted on smart glasses</div></div>
<div class="hud"><div class="tl"><span class="rec"></span>GDC · VotesforSchools reply</div><div class="tr" id="tc">00:00:00</div>
<div class="x" style="left:40px;top:40px"></div><div class="x" style="right:40px;top:40px"></div><div class="x" style="left:40px;bottom:40px"></div><div class="x" style="right:40px;bottom:40px"></div></div>
</div>
<script>
window.__timelines = window.__timelines || {{}};
var tl = window.__timelines["main"] = gsap.timeline({{ paused: true }});
gsap.set(".streak",{{xPercent:-160,skewX:-12}});
tl.fromTo("#drift",{{scale:1}},{{scale:1.07,duration:{VOICE},ease:"none"}},{F(0)});
// cold open: the 59,000, then the camera
var cnt = {{v:0}};
tl.to(cnt,{{v:59000,duration:1.5,ease:"power3.out",onUpdate:function(){{ document.getElementById("num").textContent = Math.round(cnt.v).toLocaleString("en-GB"); }}}},{F0(0.2)});
tl.fromTo("#odots",{{x:0,y:0}},{{x:-30,y:-22,duration:{OPEN},ease:"none"}},0);
tl.fromTo("#num",{{scale:0.86,filter:"blur(10px)"}},{{scale:1,filter:"blur(0px)",duration:0.9,ease:"expo.out"}},{F0(0.2)});
tl.fromTo("#olbl",{{opacity:0,y:16}},{{opacity:1,y:0,duration:0.5,ease:"power2.out"}},{F0(0.9)});
tl.to("#open",{{opacity:0,duration:0.1,ease:"none"}},{F0(OPEN)});
var tc = {{s:0}};
tl.to(tc,{{s:{TOTAL},duration:{TOTAL},ease:"none",onUpdate:function(){{ var f=Math.floor(tc.s*30)%30, sec=Math.floor(tc.s)%60, m=Math.floor(tc.s/60); document.getElementById("tc").textContent=("0"+m).slice(-2)+":"+("0"+sec).slice(-2)+":"+("0"+f).slice(-2); }}}},0);
{chr(10).join(J)}
tl.to({{}}, {{duration:{TOTAL}}}, 0);
</script></body></html>'''
open(os.path.join(HERE, "index.html"), "w").write(out)
print("wrote full/index.html", TOTAL, "s,", len(H), "elements,", len(J), "tweens,", len(caps), "captions")
for c in SCRIPT: print(c, " ".join(f"{w}@{t:.1f}" for w, t in ALIGNED[c][:6]), "...")
