// The Node twin of make_sample.py, for a Mac whose system Python (3.9) is too old
// for the current Gradio client. Reads HF_TOKEN from the environment or from
// .env in the song folder (gitignored), because anonymous runs hit the demo limit.
// Setup once, in this folder: npm i --no-save @gradio/client@1.15.1
// Usage: node make_sample.mjs <song folder> <out.mp3> <seed>
import { Client } from "@gradio/client";
import fs from "node:fs";
const [D, out, seed] = process.argv.slice(2);
const env = fs.existsSync(`${D}/.env`) ? fs.readFileSync(`${D}/.env`, "utf8") : "";
const token = process.env.HF_TOKEN || env.match(/^HF_TOKEN=(\S+)/m)?.[1];
const style = fs.readFileSync(`${D}/style.txt`, "utf8");
const caption = style.match(/MAIN STYLE PROMPT.*?:\n([\s\S]*?)\n\n/)[1].replace(/\n/g, " ");
const lyrics = fs.readFileSync(`${D}/lyrics.txt`, "utf8");
const c = await Client.connect("ACE-Step/Ace-Step-v1.5", token ? { hf_token: token } : {});
const r = await c.predict("/generation_wrapper", ["acestep-v15-xl-turbo", "custom", "", "en",
  caption, lyrics, 95, "", "4", "en",
  8, 7.0, false, seed, null, 180, 1, null, "", 0.0, -1,
  "Fill the audio semantic mask based on the given conditions:", 1.0, "text2music",
  false, 0.0, 1.0, 3.0, "ode", "", "mp3", 0.85, true, 2.0, 0, 0.9, "NO USER INPUT",
  true, false, true, false, true, false, false, 0.5, 8, "vocals", [], false]);
console.log("status:", r.data[10]); console.log(String(r.data[9] || "").slice(0, 600));
const res = await fetch(r.data[0].url, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
fs.writeFileSync(out, Buffer.from(await res.arrayBuffer())); console.log("saved", out);
process.exit(0);
