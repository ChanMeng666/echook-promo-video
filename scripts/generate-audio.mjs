#!/usr/bin/env node
/**
 * ElevenLabs Audio Generation Script
 * Generates BGM, voiceover, and sound effects for the promo video.
 *
 * Usage: node scripts/generate-audio.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public");

const API_KEY = process.env.ELEVENLABS_API_KEY || "";
const BASE = "https://api.elevenlabs.io/v1";

// ─── Helpers ─────────────────────────────────────────────

async function apiFetch(endpoint, body) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
}

async function saveAudio(label, endpoint, body, filename) {
  process.stdout.write(`  [${label}] Generating ${filename} ...`);
  try {
    const res = await apiFetch(endpoint, body);
    if (!res.ok) {
      const err = await res.text();
      console.log(` FAILED (${res.status})`);
      console.log(`    -> ${err.slice(0, 200)}`);
      return false;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const outPath = join(OUT, filename);
    writeFileSync(outPath, buf);
    console.log(` OK (${(buf.length / 1024).toFixed(0)} KB)`);
    return true;
  } catch (e) {
    console.log(` ERROR: ${e.message}`);
    return false;
  }
}

// ─── Step 1: List voices & pick one ─────────────────────

async function pickVoice() {
  console.log("\n[1/4] Fetching available voices...");
  const res = await fetch(`${BASE}/voices`, {
    headers: { "xi-api-key": API_KEY },
  });
  const data = await res.json();
  const voices = data.voices || [];
  console.log(`  Found ${voices.length} voices.`);

  // Show top candidates
  const good = voices.filter(
    (v) => v.labels && (v.labels.use_case === "narration" || v.labels.use_case === "characters")
  );
  const show = good.length > 0 ? good.slice(0, 8) : voices.slice(0, 8);
  show.forEach((v) => {
    const labels = v.labels || {};
    console.log(
      `    ${v.name.padEnd(16)} | ${(labels.gender || "").padEnd(6)} | ${(labels.accent || "").padEnd(12)} | ${labels.use_case || ""}`
    );
  });

  // Prefer a deep, professional male voice for tech promo. ElevenLabs voice
  // names include a tagline (e.g. "Daniel - Steady Broadcaster"), so match
  // by the leading first-name token rather than exact equality.
  const preferred = ["Daniel", "Adam", "Charlie", "Clyde", "James"];
  let picked = null;
  for (const name of preferred) {
    picked = voices.find((v) =>
      v.name === name || v.name.startsWith(`${name} `) || v.name.startsWith(`${name}-`)
    );
    if (picked) break;
  }
  if (!picked) picked = voices[0];

  console.log(`  Selected: ${picked.name} (${picked.voice_id})`);
  return picked;
}

// ─── Step 2: Generate TTS Voiceover ─────────────────────

async function generateVoiceover(voiceId) {
  console.log("\n[2/4] Generating voiceover (3 files)...");
  const results = {};

  results.reveal = await saveAudio(
    "VO",
    `/text-to-speech/${voiceId}`,
    {
      text: "Introducing eck hook. Thirty-nine hooks. Three AI editors. Zero latency. Total awareness.",
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.65, similarity_boost: 0.8 },
    },
    "vo-reveal.mp3"
  );

  results.cta = await saveAudio(
    "VO",
    `/text-to-speech/${voiceId}`,
    {
      text: "Never miss a notification. Never lose your place. Just tell your agent to install it.",
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.65, similarity_boost: 0.8 },
    },
    "vo-cta.mp3"
  );

  results.features = await saveAudio(
    "VO",
    `/text-to-speech/${voiceId}`,
    {
      text: "A live status line keeps you oriented. Webhooks keep you connected.",
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.65, similarity_boost: 0.8 },
    },
    "vo-features.mp3"
  );

  return results;
}

// ─── Step 3: Generate Sound Effects ─────────────────────

async function generateSFX() {
  console.log("\n[3/4] Generating sound effects...");
  const results = {};

  results.scan = await saveAudio(
    "SFX",
    "/sound-generation",
    {
      text: "futuristic digital scan line sweep, sci-fi interface reveal, clean electronic",
      duration: 2.0,
      prompt_influence: 0.4,
    },
    "sfx-scan.mp3"
  );

  results.whoosh = await saveAudio(
    "SFX",
    "/sound-generation",
    {
      text: "smooth cinematic whoosh transition, fast clean swoosh, modern UI",
      duration: 1.0,
      prompt_influence: 0.4,
    },
    "sfx-whoosh.mp3"
  );

  results.reveal = await saveAudio(
    "SFX",
    "/sound-generation",
    {
      text: "dramatic epic reveal impact with rising synth, cinematic hero moment, powerful",
      duration: 2.5,
      prompt_influence: 0.4,
    },
    "sfx-reveal.mp3"
  );

  results.notification = await saveAudio(
    "SFX",
    "/sound-generation",
    {
      text: "clean modern digital notification chime, pleasant short alert sound, minimal",
      duration: 1.5,
      prompt_influence: 0.4,
    },
    "sfx-notification.mp3"
  );

  results.success = await saveAudio(
    "SFX",
    "/sound-generation",
    {
      text: "positive achievement completion chime, task done success sound, satisfying",
      duration: 1.5,
      prompt_influence: 0.4,
    },
    "sfx-success.mp3"
  );

  results.breathe = await saveAudio(
    "SFX",
    "/sound-generation",
    {
      text: "soft calming ambient breathing tone, gentle meditation bowl resonance, peaceful digital atmosphere",
      duration: 4.0,
      prompt_influence: 0.3,
    },
    "sfx-breathe.mp3"
  );

  return results;
}

// ─── Step 4: Generate Background Music ──────────────────

async function generateBGM() {
  console.log("\n[4/4] Generating background music (this may take a while)...");

  const result = await saveAudio(
    "BGM",
    "/music",
    {
      prompt:
        "Dark cinematic electronic ambient instrumental track. Futuristic, minimal, polished synth soundscape. " +
        "Starts with soft digital pulse, builds tension with atmospheric pads, " +
        "then opens into a confident mid-tempo electronic groove with clean arpeggiated synths. " +
        "Tech product promotional feel. Subtle bass, no vocals, no guitar. D minor, 100 BPM.",
      music_length_ms: 50000,
      model_id: "music_v1",
      force_instrumental: true,
    },
    "bgm.mp3"
  );

  if (!result) {
    console.log("  BGM generation failed. Use Suno to generate BGM instead.");
    console.log("  Then save as: public/bgm.mp3");
  }

  return result;
}

// ─── Main ───────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  ElevenLabs Audio Generation for PromoVideo ║");
  console.log("╚══════════════════════════════════════════════╝");

  const voice = await pickVoice();
  const voResults = await generateVoiceover(voice.voice_id);
  const sfxResults = await generateSFX();
  const bgmResult = await generateBGM();

  // Summary
  console.log("\n════════════════════════════════════════════════");
  console.log("SUMMARY:");
  console.log("────────────────────────────────────────────────");
  const all = {
    "vo-reveal.mp3": voResults.reveal,
    "vo-features.mp3": voResults.features,
    "vo-cta.mp3": voResults.cta,
    "sfx-scan.mp3": sfxResults.scan,
    "sfx-whoosh.mp3": sfxResults.whoosh,
    "sfx-reveal.mp3": sfxResults.reveal,
    "sfx-notification.mp3": sfxResults.notification,
    "sfx-success.mp3": sfxResults.success,
    "sfx-breathe.mp3": sfxResults.breathe,
    "bgm.mp3": bgmResult,
  };

  let ok = 0;
  let fail = 0;
  for (const [file, status] of Object.entries(all)) {
    const icon = status ? "OK" : "FAIL";
    console.log(`  ${icon.padEnd(4)} ${file}`);
    if (status) ok++;
    else fail++;
  }
  console.log(`\n  ${ok} succeeded, ${fail} failed`);
  console.log("════════════════════════════════════════════════");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
