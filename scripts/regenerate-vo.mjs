#!/usr/bin/env node
/**
 * Regenerate ONLY the three voiceover files with the v6.3.3 scripts:
 *   public/vo-reveal.mp3, public/vo-features.mp3, public/vo-cta.mp3
 * Background music (bgm.mp3) and all SFX are left untouched, so this
 * costs far fewer credits than a full `generate-audio` run.
 *
 * Usage: node --env-file=.env scripts/regenerate-vo.mjs
 *   (or: ELEVENLABS_API_KEY=sk_xxx node scripts/regenerate-vo.mjs)
 *
 * Pronunciation note: "echook" is rendered as the literal phrase
 * "eck hook" in the TTS prompt so the model produces /ˈɛkˌhʊk/
 * (Echo + Hook). The display brand stays "echook" everywhere visual.
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public");

const API_KEY = process.env.ELEVENLABS_API_KEY || "";
if (!API_KEY) {
  console.error("ELEVENLABS_API_KEY missing. Add it to .env (see .env.example).");
  process.exit(1);
}
const BASE = "https://api.elevenlabs.io/v1";

// The three lines the video actually plays, in sync with v6.3.3 visuals.
const VO = [
  {
    file: "vo-reveal.mp3",
    text: "Introducing eck hook. Thirty-nine hooks. Three AI editors. Zero latency. Total awareness.",
  },
  {
    file: "vo-features.mp3",
    text: "A live status line keeps you oriented. Webhooks keep you connected.",
  },
  {
    file: "vo-cta.mp3",
    text: "Never miss a notification. Never lose your place. Just tell your agent to install it.",
  },
];

async function pickVoice() {
  console.log("[1/2] Fetching voices...");
  const res = await fetch(`${BASE}/voices`, {
    headers: { "xi-api-key": API_KEY },
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  Voice fetch failed (${res.status}): ${err.slice(0, 200)}`);
    process.exit(1);
  }
  const data = await res.json();
  const voices = data.voices || [];
  console.log(`  Found ${voices.length} voices.`);

  // ElevenLabs voice names look like "Daniel - Steady Broadcaster" — match
  // by leading first-name token so this stays portable across API keys.
  const preferred = ["Daniel", "Adam", "Charlie", "Clyde", "James"];
  let picked = null;
  for (const name of preferred) {
    picked = voices.find((v) =>
      v.name === name || v.name.startsWith(`${name} `) || v.name.startsWith(`${name}-`)
    );
    if (picked) break;
  }
  if (!picked) picked = voices[0];

  console.log(`  Selected voice: ${picked.name} (${picked.voice_id})`);
  return picked;
}

async function generateOne(voiceId, item) {
  process.stdout.write(`  Generating ${item.file} ...`);
  const res = await fetch(`${BASE}/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: item.text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.65, similarity_boost: 0.8 },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.log(` FAILED (${res.status})`);
    console.log(`    -> ${err.slice(0, 300)}`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(join(OUT, item.file), buf);
  console.log(` OK (${(buf.length / 1024).toFixed(0)} KB)`);
  return true;
}

async function main() {
  console.log("==============================================");
  console.log("  Regenerate voiceover (v6.3.3)");
  console.log("==============================================");
  const voice = await pickVoice();
  console.log("\n[2/2] Generating 3 voiceover files...");
  let ok = 0;
  for (const item of VO) {
    if (await generateOne(voice.voice_id, item)) ok++;
  }
  console.log(`\nDone. ${ok}/${VO.length} written. BGM and SFX were not touched.`);
  if (ok < VO.length) process.exit(1);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
