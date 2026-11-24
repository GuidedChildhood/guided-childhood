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
def card_top(path, t=5.0, W=390, H=1000):
    # Where the script card's blue header starts on the deck recording. The title and the line under it wrap
    # differently for every script, so the card, and the words on it, sit at a different height each time.
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-ss', str(t), '-i', path, '-frames:v', '1', '-vf', f'scale={W}:{H},format=rgb24', '-f', 'rawvideo', '-'])
    for y in range(120, 700):
        r, g, b = raw[(y * W + 195) * 3:(y * W + 195) * 3 + 3]
        r2, g2, b2 = raw[((y + 30) * W + 195) * 3:((y + 30) * W + 195) * 3 + 3]
        if b - r > 40 and b2 - r2 > 40 and b > 200: return y
    return None
if __name__ == '__main__': print(rule_y(sys.argv[1]))
