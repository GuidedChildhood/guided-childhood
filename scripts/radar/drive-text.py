# Pull the text a Drive read returned out of the session transcript, so a pack
# is parsed from exactly what Drive handed back and not from a retyped copy.
# usage: drive-text.py <transcript.jsonl> <fileId or a phrase from the title> <out.txt>
import sys, json
tr, needle, out = sys.argv[1:4]
found = None
def walk(o):
    global found
    if isinstance(o, str):
        if o.startswith('{"fileContent"') and needle in o:
            try: found = json.loads(o)['fileContent']
            except Exception: pass
    elif isinstance(o, dict):
        for v in o.values(): walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
with open(tr, encoding='utf-8', errors='replace') as f:
    for line in f:
        if needle in line and 'fileContent' in line:
            try: walk(json.loads(line))
            except Exception: pass
if found is None: sys.exit('no Drive read matching %r found in the transcript' % needle)
open(out, 'w', encoding='utf-8').write(found)
print(len(found), 'characters')
