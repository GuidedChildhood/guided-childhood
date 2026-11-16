"""Re-voices film 1.3 in DiGi's chosen voice (Tamsin, speech rate minus 10).

The work is done by the shared tool, ../revoice/revoice.py, which every
re-voiced film uses. This folder's film.json holds the 1.3 lines, the cut and
the card words. Kept so the commands in the README still work:
  python3 revoice.py lines
  python3 revoice.py build <1.3 full film>
"""
import sys, pathlib, subprocess
here = pathlib.Path(__file__).parent
tool = here.parent / 'revoice' / 'revoice.py'
if __name__ == '__main__':
    subprocess.run([sys.executable, str(tool), str(here), *sys.argv[1:]], check=True)
