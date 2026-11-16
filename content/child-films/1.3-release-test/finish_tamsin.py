"""Subtitles and the vertical window for the re-voiced 1.3, on the new timing.
Run after revoice.py build. The work is done by ../revoice/revoice.py finish."""
import sys, pathlib, subprocess
here = pathlib.Path(__file__).parent
subprocess.run([sys.executable, str(here.parent / 'revoice' / 'revoice.py'), str(here), 'finish'], check=True)
