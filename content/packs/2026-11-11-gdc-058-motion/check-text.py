#!/usr/bin/env python3
"""The copy gate for GDC 058. Run: python3 check-text.py

1. No dash character of any kind anywhere in index.html (U+2010 to U+2015, U+2212),
   and no plain hyphen standing between two spaces.
2. Pull the words a viewer can actually see (text nodes outside script, style and
   comments) and check them: no hyphen at all, no digit outside the one allowed
   date, and "preliminar" present wherever the Commission is named.
Exits 1 on any failure.
"""
import re, sys
from html.parser import HTMLParser

SRC = "index.html"
src = open(SRC, encoding="utf-8").read()
fail = []

uni = re.findall("[‐-―−]", src)
print("unicode dashes in source:", len(uni))
if uni: fail.append("unicode dash in source")

spaced = [m.start() for m in re.finditer(r"\s-\s", src)]
print("plain hyphen between spaces in source:", len(spaced))
if spaced: fail.append("spaced hyphen in source")

class Seen(HTMLParser):
    def __init__(self):
        super().__init__(); self.skip = 0; self.out = []
    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "title"): self.skip += 1
    def handle_endtag(self, tag):
        if tag in ("script", "style", "title"): self.skip -= 1
    def handle_data(self, data):
        if not self.skip and data.strip(): self.out.append(data.strip())

p = Seen(); p.feed(src)
text = " ".join(p.out)
print("on screen text:", text)

if re.search("[-‐-―−]", text): fail.append("dash or hyphen in on screen text")
digits = re.sub(r"6 November 2026", "", text)
if re.search(r"\d", digits): fail.append("a number other than the date")
if "Commission" in text and "preliminar" not in text: fail.append("Commission without preliminary")
if "%" in text: fail.append("a percentage")

print("FAIL: " + "; ".join(fail) if fail else "PASS: no dashes, no number but the date, preliminary present")
sys.exit(1 if fail else 0)
