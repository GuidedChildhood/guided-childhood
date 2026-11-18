# ACE-Step 1.5 config for the Year 3 Colours lesson 1 song, the same program
# and settings as the Planet Friends rap (content/music/planet-friends-mission-control).
# Usage (on the Mac): python song.py <seed> [seconds] > ../../../music/planet-friends-mission-control/ACE-Step-1.5/sample.toml
import re, sys, toml
from pathlib import Path
D = Path(__file__).parent
style = (D / "style.txt").read_text()
caption = re.search(r"MAIN STYLE PROMPT.*?:\n(.*?)\n\n", style, re.S).group(1).replace("\n", " ")
print(toml.dumps({
    "task_type": "text2music", "config_path": "acestep-v15-turbo",
    "caption": caption, "lyrics": (D / "lyrics.txt").read_text(), "instrumental": False,
    "bpm": int(re.search(r"(\d+) BPM", caption).group(1)), "timesignature": "4",
    "vocal_language": "fr", "duration": int(sys.argv[2]) if len(sys.argv) > 2 else 75,
    "inference_steps": 8, "seed": int(sys.argv[1]), "use_random_seed": False,
    "thinking": True, "batch_size": 1, "audio_format": "mp3",
    "lm_model_path": "acestep-5Hz-lm-0.6B", "offload_to_cpu": True, "offload_dit_to_cpu": True,
    "save_dir": str((D / "outputs").resolve()),
}))
