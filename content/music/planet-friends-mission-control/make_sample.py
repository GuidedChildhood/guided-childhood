# Make one draft on the free ACE-Step 1.5 Hugging Face demo. Needs HF_TOKEN in the
# environment (a free Read token), because anonymous runs hit the demo limit.
# Usage: python make_sample.py <song folder> <out.mp3> <seed>
import os, sys, shutil, re
from gradio_client import Client
D = sys.argv[1]; out = sys.argv[2]; seed = sys.argv[3]
style = open(f"{D}/style.txt").read()
caption = re.search(r"MAIN STYLE PROMPT.*?:\n(.*?)\n\n", style, re.S).group(1).replace("\n", " ")
lyrics = open(f"{D}/lyrics.txt").read()
c = Client("ACE-Step/Ace-Step-v1.5", token=os.environ.get("HF_TOKEN"), verbose=False)
r = c.predict("acestep-v15-xl-turbo", "custom", "", "en",
    caption, lyrics, 95, "", "4", "en",
    8, 7.0, False, seed, None, 180, 1, None, "", 0.0, -1,
    "Fill the audio semantic mask based on the given conditions:", 1.0, "text2music",
    False, 0.0, 1.0, 3.0, "ode", "", "mp3", 0.85, True, 2.0, 0, 0.9, "NO USER INPUT",
    True, False, True, False, True, False, False, 0.5, 8, "vocals", [], False,
    api_name="/generation_wrapper")
print("status:", r[10]); print(r[9][:600] if r[9] else "")
src = r[0] if isinstance(r[0], str) else (r[0] or {}).get("path")
shutil.copy(src, out); print("saved", out)
