#!/bin/sh
# Records every scene named, one after another, with the fake clock recorder.
cd "$(dirname "$0")/.."
for n in "$@"; do DEV=${DEV:-http://localhost:3000} node tools/record2.mjs scenes/$n.json 2>&1 | grep -v "^frame [0-9]*/" ; done
