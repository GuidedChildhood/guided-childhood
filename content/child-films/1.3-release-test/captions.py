"""Timed captions for film 1.3, for the subtitle file and the vertical cut.

The words were written out by hand from a machine transcript of the narration
and timed from that transcript's sentence times. They have been read, not
checked by ear. Someone should listen once before the subtitle file is used.
"""
import json, sys, pathlib
here = pathlib.Path(__file__).parent
# (start, end, [caption, ...]) for each spoken stretch of the original film.
L = [
(0.0,5.14,["Hello, I'm DiGi. This one's for you and your grown up.","Snuggle up. Ready?"]),
(5.88,11.28,["Before we start, let's do our big breath.","Breathe in, and out."]),
(12.04,12.72,["Lovely."]),
(13.6,20.94,["Now, remember last time we learned about the uh oh feeling?","If a screen gives you the uh oh feeling,"]),
(20.94,23.42,["what do we do? Tell your grown up."]),
(23.76,28.9,["That's right. Turn it over. Go and tell.","You remembered. Brilliant."]),
(30.0,35.22,["Today we learn one big thing.","The internet remembers. Things we send can stay."]),
(35.22,40.68,["So before we share, we stop and ask a grown up.","Say our special word."]),
(41.32,47.8,["Remember.","I've brought a friend to help us.","This is Ellie. Ellie is an elephant."]),
(47.8,50.58,["Do you know the special thing about elephants?"]),
(51.32,59.2,["Elephants never, ever forget.","Ellie remembers everything.","She remembers her breakfast. She remembers your birthday."]),
(59.2,65.56,["She even remembers a picture you drew a long, long time ago.","Now, here is a big, friendly secret."]),
(65.56,69.66,["The phones and the games and the video calls."]),
(69.66,78.4,["The internet is a little bit like Ellie. It remembers too.","When you send a picture or a message or a funny video,"]),
(79.26,81.28,["it doesn't just float away."]),
(81.84,85.52,["Things we send can stay, and they could be copied."]),
(85.52,92.72,["Watch. Send. There it goes.","Ellie caught it, and she will never, ever forget it."]),
(92.72,96.26,["Even when the app is closed. Even when the screen goes dark."]),
(96.26,102.36,["The picture doesn't disappear.","The internet remembers, just like Ellie.","That's not scary."]),
(102.36,107.44,["It's just good to know.","The internet has a big, friendly memory."]),
(107.44,109.7,["So a picture you send today,"]),
(110.64,115.24,["someone might see it another day.","Maybe tomorrow. Maybe when you're bigger."]),
(115.52,122.04,["Pause me here. Grown up, ask your little one:","what is something you have sent to someone?"]),
(122.52,125.38,["A photo? A voice message? A drawing?"]),
(126.16,129.54,["Where do you think it is now?","Take your time. I'll wait."]),
(130.44,138.02,["Because the internet remembers, we have one little rule.","It is small and it is easy, and it keeps us happy."]),
(138.02,142.08,["Here it is. Stop. Ask a grown up. Then share."]),
(142.8,149.66,["Let's hear how that sounds. A child might say,","\"I want to send this picture to someone we love.\""]),
(149.66,152.24,["And the grown up says, \"Ooh, lovely. Let's do our rule first.\""]),
(152.24,158.52,["\"Stop and ask me. Shall we send it together?\"","And the child says, \"Stop. Ask.\""]),
(158.52,165.68,["\"Then share.\" See? Not scary. Just kind.","And look, Ellie loves that rule."]),
(165.68,173.66,["Asking a grown up is a clever, kind thing to do.","Your turn. Pause me and say it with your grown up, three times,"]),
(173.66,176.58,["like a little song. Stop. Ask. Then share."]),
(176.58,184.42,["I'll wait.","Now our special sentence, three times. Big voices!","Stop. Ask. Then share!"]),
(184.42,190.02,["Stop. Ask. Then share!","Stop. Ask. Then share!"]),
(190.6,194.36,["Tonight, here's your job. A fun one."]),
(194.36,197.86,["Together, make a little ask first sign."]),
(197.86,203.1,["Look, Ellie's got hers.","Draw a big hand. That means stop."]),
(203.1,207.8,["Colour it in, then pop it near where you use the phone or tablet."]),
(208.52,214.56,["Whenever you see it, you'll remember our rule.","Stop. Ask. Then share."]),
(215.44,220.4,["Before I go, show your grown up one thing you remember from today."]),
(220.4,223.34,["Anything at all. Got it?"]),
(223.34,227.95,["Brilliant. Ellie remembered it too.","Of course she did."]),
(237.4,241.48,["Remember, screens are better together.","See you next time."]),
]
CUT_A, CUT_B = 227.95, 237.15   # the closing promise to the grown up is removed
def timed():
    out=[]
    for s,e,caps in L:
        tot=sum(len(c) for c in caps); t=s
        for c in caps:
            d=(e-s)*len(c)/tot; out.append([t,t+d,c]); t+=d
    for i in range(len(out)-1):            # hold each line until the next, up to 1.2s
        out[i][1]=min(out[i+1][0], out[i][1]+1.2)
    return out
def ts(x):
    ms=int(round(x*1000)); return f"{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}"
T=timed()
# Subtitle file on the trimmed timeline.
srt=[]
for i,(s,e,c) in enumerate(T,1):
    if s>=CUT_B: s-=CUT_B-CUT_A; e-=CUT_B-CUT_A
    else: e=min(e,CUT_A)
    srt.append(f"{i}\n{ts(s)} --> {ts(e)}\n{c}\n")
(here/'the-internet-remembers.en-GB.srt').write_text("\n".join(srt))
# Vertical cut: the one big thing, 30.0 to 107.6 of the original.
V0,V1=30.0,107.6
v=[{"s":round(s-V0,2),"e":round(min(e,V1)-V0,2),"t":c} for s,e,c in T if V0<=s<V1]
(here/'work'/'captions.json').write_text(json.dumps(v,indent=1))
print(len(T),'subtitle lines,',len(v),'vertical captions')
