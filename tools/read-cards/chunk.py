"""Chunk a script into read cards: one idea per card, about three lines of big
type. Splits on blank lines first (a paragraph is a card), then on sentence
ends when a paragraph runs long. Keeps bracketed directions as the card's
direction line. Usage: import chunk; chunk.cards(text, limit=170)."""
import re
def _sentences(p):
    return [s.strip() for s in re.split(r'(?<=[.!?])\s+', p) if s.strip()]
def cards(text, limit=170):
    out=[]
    for para in [p.strip() for p in re.split(r'\n\s*\n', text) if p.strip()]:
        para=re.sub(r'^CARD \d+\s*\n', '', para).strip()
        direction=''
        m=re.match(r'^\[(.+?)\]\s*', para)
        if m: direction=m.group(1); para=para[m.end():]
        para=' '.join(line.strip() for line in para.split('\n'))
        if len(para)<=limit:
            out.append({'text':para,'direction':direction}); continue
        cur=''
        for s in _sentences(para):
            if cur and len(cur)+1+len(s)>limit:
                out.append({'text':cur,'direction':direction}); direction=''; cur=s
            else: cur=(cur+' '+s).strip()
        if cur: out.append({'text':cur,'direction':direction})
    return out
