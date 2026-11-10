# Pull the base64 a Drive download returned out of the session transcript, so
# the comparison is done by a program on the real bytes, not by eye.
import sys, json, re, base64, hashlib
tr, fid, out = sys.argv[1:4]
best = None
with open(tr, encoding='utf-8', errors='replace') as f:
    for line in f:
        if fid not in line or '\\"content\\":\\"' not in line and '"content":"' not in line: continue
        # the tool result is JSON nested inside JSON; find the content field for this file id
        for m in re.finditer(r'\\?"content\\?":\s*\\?"([A-Za-z0-9+/=]{200,})\\?"', line):
            tail = line[m.end():m.end()+400]
            if fid in tail: best = m.group(1)
if not best: sys.exit('no download for %s found in the transcript' % fid)
raw = base64.b64decode(best)
open(out, 'wb').write(raw)
print(len(raw), hashlib.sha256(raw).hexdigest())
