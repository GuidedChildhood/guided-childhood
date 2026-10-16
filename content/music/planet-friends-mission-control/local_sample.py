# Write the ACE-Step 1.5 CLI config for one local draft (Apple Silicon, MLX).
# Usage: python local_sample.py <seed> > ACE-Step-1.5/sample.toml
#        cd ACE-Step-1.5 && uv run python cli.py -c sample.toml
import re, sys, toml
from pathlib import Path
D = Path(__file__).parent
style = (D / "style.txt").read_text()
caption = re.search(r"MAIN STYLE PROMPT.*?:\n(.*?)\n\n", style, re.S).group(1).replace("\n", " ")
print(toml.dumps({
    "task_type": "text2music", "config_path": "acestep-v15-turbo",
    "caption": caption, "lyrics": (D / "lyrics.txt").read_text(),
    "bpm": 95, "timesignature": "4", "vocal_language": "en", "duration": 180,
    "inference_steps": 8, "seed": int(sys.argv[1]), "use_random_seed": False,
    "thinking": True, "batch_size": 1, "audio_format": "mp3",
    # 16 GB Mac: the 1.7B lyric model ran out of memory, 0.6B with offload fits.
    "lm_model_path": "acestep-5Hz-lm-0.6B", "offload_to_cpu": True, "offload_dit_to_cpu": True,
    "save_dir": str((D / "outputs").resolve()),
}))
