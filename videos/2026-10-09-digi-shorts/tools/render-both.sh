#!/bin/sh
# Builds and renders each cut in turn (index.html is one cut at a time).
cd "$(dirname "$0")/.."
# Another session's HyperFrames render on this Mac cancels ours (SIGTERM), so
# each cut waits until no other render is running.
for c in "$@"; do
  while pgrep -f "hyperframes.* render" > /dev/null; do sleep 10; done
  node build.mjs cuts/$c.json | head -1
  npx --yes hyperframes@0.8.141 render --quality looks --output renders/out/$c.mp4 --quiet > renders/out/$c.log 2>&1
  echo "$c render exit $? $(ls -la renders/out/$c.mp4 2>/dev/null | awk '{print $5}') bytes"
done
