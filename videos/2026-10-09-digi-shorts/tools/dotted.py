# Where the result row starts on the check in recording: the dotted rule above it.
# A worry's name can wrap to one, two or three lines, which moves that rule, so the
# cut measures it instead of guessing.   python3 tools/dotted.py assets/rec/film-d01-checkin.mp4
import subprocess, sys
def rule_y(path, t=5.5, W=390, H=1000):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-ss', str(t), '-i', path, '-frames:v', '1', '-vf', f'scale={W}:{H},format=gray', '-f', 'rawvideo', '-'])
    tr = lambda y: sum(1 for a, b in zip(raw[y * W + 40:y * W + 350], raw[y * W + 41:y * W + 350]) if abs(a - b) > 6)
    T = {y: tr(y) for y in range(780, 952)}
    hits = [y for y in range(782, 948) if T[y] >= 130 and T[y + 1] >= 130 and T[y - 1] < 40 and T[y + 2] < 40]  # two rows of dots, clear above and below
    return hits[-1] if hits else None
if __name__ == '__main__': print(rule_y(sys.argv[1]))
