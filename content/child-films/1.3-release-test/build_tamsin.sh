#!/usr/bin/env bash
# The 1.3 public versions in DiGi's voice (Tamsin). Nothing here uploads anything.
#   python3 revoice.py build <1.3 full film>  (once the lines are generated)
#   python3 finish_tamsin.py
#   bash build_tamsin.sh
# The work is done by the shared ../revoice/build.sh, from this folder's film.json.
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)"
bash "$D/../revoice/build.sh" "$D"
