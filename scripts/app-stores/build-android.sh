#!/usr/bin/env bash
# Builds the Google Play package for Guided Childhood: a Trusted Web Activity
# (TWA) that opens www.guidedchildhood.com full screen, with no browser bar,
# once public/.well-known/assetlinks.json vouches for the signing key.
#
# Run from the repo root:  npm run android-build
# Output: app-stores/android/build/app-release-bundle.aab  (upload this to Play)
#         app-stores/android/build/app-release-signed.apk  (sideload to test)
#
# The config that matters is app-stores/android/twa-manifest.json, committed.
# The generated Gradle project in app-stores/android/build/ is gitignored and
# rebuilt from scratch every run, so nothing hand edited can drift.
#
# ONE TIME SETUP on a Mac (done on Justin's Mac on 6 November 2026):
#   brew install openjdk@17
#   brew install --cask android-commandlinetools
#   SDK=/opt/homebrew/share/android-commandlinetools
#   yes | JAVA_HOME=$(brew --prefix openjdk@17)/libexec/openjdk.jdk/Contents/Home \
#     $SDK/cmdline-tools/latest/bin/sdkmanager --sdk_root=$SDK --licenses
#   JAVA_HOME=... $SDK/cmdline-tools/latest/bin/sdkmanager --sdk_root=$SDK \
#     "build-tools;35.0.0" "platforms;android-35" "platform-tools"
#   ln -sfn $SDK/cmdline-tools/latest $SDK/tools     # Bubblewrap looks for tools/
#   ~/.bubblewrap/config.json:
#     {"jdkPath":"<openjdk@17>/libexec/openjdk.jdk","androidSdkPath":"<SDK>"}
#
# THE SIGNING KEY never enters the repo. It lives in ~/GuidedChildhood-signing/
# (android-upload.keystore plus keystore-password.txt). Override with
# GC_KEYSTORE and GC_KEYSTORE_PASSWORD_FILE. It is the UPLOAD key: Play App
# Signing holds the key that signs what phones install. Lose this one and the
# app can only be updated after a key reset through Play support, which takes
# days; without Play App Signing it would mean losing the listing. Keep two
# copies, one off this laptop.
#
# ICON_BASE: Bubblewrap downloads the icons from a URL. Before the maskable
# icons are live, serve public/ locally and point at it, for example
#   (cd public && python3 -m http.server 8765) &
#   ICON_BASE=http://localhost:8765 npm run android-build
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/app-stores/android/twa-manifest.json"
BUILD="$ROOT/app-stores/android/build"
KEYSTORE="${GC_KEYSTORE:-$HOME/GuidedChildhood-signing/android-upload.keystore}"
PWFILE="${GC_KEYSTORE_PASSWORD_FILE:-$HOME/GuidedChildhood-signing/keystore-password.txt}"
BUBBLEWRAP="npx --yes @bubblewrap/cli@1.27.0"

[ -f "$HOME/.bubblewrap/config.json" ] || { echo "No ~/.bubblewrap/config.json. See the setup notes at the top of this script."; exit 1; }
[ -f "$KEYSTORE" ] || { echo "No signing key at $KEYSTORE. See app-stores/README.md, never make a second one by accident."; exit 1; }
[ -f "$PWFILE" ] || { echo "No password file at $PWFILE."; exit 1; }

rm -rf "$BUILD"
mkdir -p "$BUILD"

# The committed manifest says ~/..., which Bubblewrap does not expand, and the
# icon URLs may be pointed at a local server for a build before deploy.
node -e '
  const fs = require("fs")
  const [src, out, keystore, iconBase] = process.argv.slice(1)
  const m = JSON.parse(fs.readFileSync(src, "utf8"))
  m.signingKey.path = keystore
  if (iconBase) {
    for (const k of ["iconUrl", "maskableIconUrl"]) {
      m[k] = iconBase.replace(/\/$/, "") + new URL(m[k]).pathname
    }
  }
  fs.writeFileSync(out, JSON.stringify(m, null, 2))
' "$SRC" "$BUILD/twa-manifest.json" "$KEYSTORE" "${ICON_BASE:-}"

cd "$BUILD"
$BUBBLEWRAP update --skipVersionUpgrade

PW="$(head -n1 "$PWFILE")"
# --skipPwaValidation: the check runs PageSpeed against the LIVE site, so it
# fails on anything not deployed yet. Chrome still checks the app on the phone.
BUBBLEWRAP_KEYSTORE_PASSWORD="$PW" BUBBLEWRAP_KEY_PASSWORD="$PW" \
  $BUBBLEWRAP build --skipPwaValidation

echo
echo "Built:"
ls -lh "$BUILD"/app-release-bundle.aab "$BUILD"/app-release-signed.apk
echo
echo "Upload key fingerprint (must be in public/.well-known/assetlinks.json):"
keytool_bin="$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.env.HOME+"/.bubblewrap/config.json","utf8")).jdkPath)')/Contents/Home/bin/keytool"
[ -x "$keytool_bin" ] || keytool_bin=keytool
"$keytool_bin" -list -v -keystore "$KEYSTORE" -storepass "$PW" | grep "SHA256:" | head -1
