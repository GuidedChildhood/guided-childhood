// Adds a signing certificate fingerprint to public/.well-known/assetlinks.json.
//
// Why: the Google Play app opens the site full screen, with no browser bar,
// only when assetlinks.json lists the certificate that signed the copy on the
// phone. The file ships with the UPLOAD key's fingerprint, which signs the APK
// we sideload to test. Copies installed from Play are re-signed by Google's
// app signing key, a different certificate, so that one has to be added too or
// every Play install shows a browser bar at the top.
//
// Where to find it: Play Console, the app, Test and release, App integrity,
// App signing, "App signing key certificate", the SHA-256 line.
//
// Run: npm run play-fingerprint -- AB:CD:...   (then commit, merge, deploy)
import fs from 'node:fs'

const FILE = 'public/.well-known/assetlinks.json'
const raw = (process.argv[2] ?? '').trim().toUpperCase()

if (!/^([0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(raw)) {
  console.error('Give the SHA-256 fingerprint as 32 pairs joined by colons, as Play Console shows it.')
  process.exit(1)
}

const links = JSON.parse(fs.readFileSync(FILE, 'utf8'))
const list = links[0].target.sha256_cert_fingerprints
if (list.includes(raw)) {
  console.log('Already there, nothing to do.')
} else {
  list.push(raw)
  fs.writeFileSync(FILE, JSON.stringify(links, null, 2) + '\n')
  console.log(`Added. ${FILE} now lists ${list.length} fingerprints.`)
}
