# Write the ACE-Step 1.5 CLI config for one local draft (Apple Silicon, MLX).
# Usage: python local_sample.py <seed> [seconds] [vocal|instrumental|jazz] > ACE-Step-1.5/sample.toml
#        cd ACE-Step-1.5 && uv run python cli.py -c sample.toml
import re, sys, toml
from pathlib import Path
D = Path(__file__).parent
style = (D / "style.txt").read_text()
mode = sys.argv[3] if len(sys.argv) > 3 else "vocal"
inst = mode == "instrumental"
head = {"vocal": "MAIN STYLE PROMPT", "instrumental": "INSTRUMENTAL BED", "jazz": "JAZZ STYLE PROMPT"}[mode]
caption = re.search(head + r".*?:\n(.*?)\n\n", style, re.S).group(1).replace("\n", " ")
bpm = int(re.search(r"(\d+) BPM", caption).group(1))
print(toml.dumps({
    "task_type": "text2music", "config_path": "acestep-v15-turbo",
    "caption": caption, "lyrics": "[Instrumental]" if inst else (D / "lyrics.txt").read_text(), "instrumental": inst,
    "bpm": bpm, "timesignature": "4", "vocal_language": "en", "duration": int(sys.argv[2]) if len(sys.argv) > 2 else 240,
    "inference_steps": 8, "seed": int(sys.argv[1]), "use_random_seed": False,
    "thinking": True, "batch_size": 1, "audio_format": "mp3",
    # 16 GB Mac: the 1.7B lyric model ran out of memory, 0.6B with offload fits.
    "lm_model_path": "acestep-5Hz-lm-0.6B", "offload_to_cpu": True, "offload_dit_to_cpu": True,
    "save_dir": str((D / "outputs").resolve()),
}))
