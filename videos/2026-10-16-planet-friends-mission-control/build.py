# Builds index.html for the Planet Friends (Mission Control) music video from
# lyrics-timed.json (the lyric words with their times in the jazz take) and
# audiomap.json (the beat grid). Re-run after a new take:
#   python3 build.py [--vertical]
# The page carries the data; the script inside it lays out the scenes and builds
# one seekable GSAP timeline. Approved cutouts only, house tokens and fonts only.
import json, sys
from pathlib import Path

D = Path(__file__).parent
VERT = "--vertical" in sys.argv
W, H = (1080, 1920) if VERT else (1920, 1080)
sections = json.load(open(D / "lyrics-timed.json"))
audiomap = json.load(open(D / "audiomap.json"))
beats = [round(b, 3) for b in audiomap["grid"]["beats_sec"]]
duration = round(audiomap["audio"]["duration_sec"], 3)

# Scene plan. Section index -> scene kind and who raps each line (mic_map.md).
ALL = "all"
PLAN = [
    {"kind": "group", "name": "intro", "who": [ALL, ALL, ALL]},
    {"kind": "group", "name": "mission", "who": ["nova", "orbit", "bloop", "cosmo", ["pebble", "bloop", "orbit"], "pebble", "nova", ALL]},
    {"kind": "group", "name": "chorus1", "who": ["pebble", "pebble", ALL, ALL], "chorus": True},
    {"kind": "verse", "friend": "pebble"},
    {"kind": "verse", "friend": "bloop"},
    {"kind": "verse", "friend": "orbit"},
    {"kind": "group", "name": "chorus2", "who": ["pebble", "pebble", ALL, ALL], "chorus": True},
    {"kind": "verse", "friend": "nova"},
    {"kind": "verse", "friend": "cosmo"},
    {"kind": "bridge"},
    {"kind": "services"},
    {"kind": "group", "name": "chorus3", "who": ["pebble", "pebble", ALL, ALL], "chorus": True},
    {"kind": "group", "name": "outro", "who": [ALL, ALL], "end": True},
]
assert len(PLAN) == len(sections), (len(PLAN), len(sections))

# The lesson titles each friend fronts, from shared/schools-curriculum.ts, keyed
# to the lyric line that raps them (0 based).
LESSONS = {
    "pebble": {1: "Real, pretend, or made by a computer", 4: "Paws off, ask first", 5: "The screen never says stop",
               6: "Private like a toothbrush", 7: "Who is on the other side?"},
    "bloop": {2: "Screen routines that work", 3: "Gaming: time, intensity and spend", 4: "Privacy and digital reputation",
              5: "Being kind and safe with others online", 6: "My work and other people's work", 7: "Stay the maker"},
    "orbit": {1: "Scams, fraud and money online", 2: "Mood and screens", 3: "Misinformation, deepfakes and AI content",
              4: "Social media, group chats and the workarounds", 5: "When it turns on you", 6: "Is it doing my thinking?",
              7: "Who owns what you make"},
    "nova": {2: "Manipulation and persuasion", 3: "The money and the odds", 4: "Readiness at 16: the ban world"},
    "cosmo": {2: "AI mastery and data rights", 3: "Digital identity and the future of work", 7: "The Passport to Sixteen"},
}
# The services verse: one card per line, who raps it, what the product does.
SERVICES = [
    ("pebble", "STAGE CHECK", "Three questions"), ("bloop", "TEN MINUTES", "A day, together"),
    ("orbit", "DIGI", "Never yes or no"), ("nova", "SCRIPTS", "The words for hard talks"),
    ("cosmo", "STARS", "Jobs earn screen time"), ("pebble", "PAPER CHART", "No device needed"),
    ("bloop", "CHECK IN", "Five faces"), ("orbit", "QUEST BOARD", "Pitch your own"),
    ("nova", "SCHOOL LETTERS", "Snap and decode"), ("cosmo", "DEVICE GUIDES", "Every screen"),
    ("pebble", "THE GUIDED PLANET", "Free paper, monthly"), ("bloop", "SCHOOLS", "Zero prep lessons"),
]

data = {"W": W, "H": H, "vertical": VERT, "duration": duration, "beats": beats,
        "sections": sections, "plan": PLAN, "lessons": LESSONS, "services": SERVICES}

template = (D / "film.tpl").read_text()
out = template.replace("/*DATA*/", "const DATA = " + json.dumps(data, separators=(",", ":")) + ";")
out = out.replace("ASSET/", "assets/").replace("__W__", str(W)).replace("__H__", str(H)).replace("__DUR__", str(duration))
target = D / ("vertical/index.html" if VERT else "index.html")
target.parent.mkdir(exist_ok=True)
target.write_text(out)
print("wrote", target, W, "x", H, duration, "s")
