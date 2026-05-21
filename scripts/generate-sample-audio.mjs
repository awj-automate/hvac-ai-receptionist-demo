/**
 * Generates the Mode 2 sample-call audio — one OpenAI-TTS clip per line into
 * public/audio/lines/. Wired into the `build` script, so it runs at deploy
 * time on Vercel using OPENAI_API_KEY from the project environment.
 *
 * Always exits 0. A missing key, already-present clips, or an API error just
 * skip generation so the build never breaks — Mode 2 falls back to a typed
 * walkthrough when clips are absent.
 *
 * Run manually:  OPENAI_API_KEY=sk-... node scripts/generate-sample-audio.mjs
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "audio", "lines");
const clipPath = (i) =>
  join(outDir, `line-${String(i + 1).padStart(2, "0")}.mp3`);

/** Voice + delivery direction per speaker role. */
const VOICE = {
  agent: {
    voice: "coral", // gpt-4o-mini-tts
    fallbackVoice: "shimmer", // tts-1
    instructions:
      "You are Sarah, a warm, friendly HVAC office receptionist. Sound calm, " +
      "competent and reassuring, with a light Southern warmth. Natural, " +
      "unhurried conversational pacing.",
  },
  user: {
    voice: "ash",
    fallbackVoice: "onyx",
    instructions:
      "You are a homeowner calling about a broken air conditioner. Sound " +
      "natural and conversational — a little worn down by the heat, but " +
      "polite and easygoing. Everyday speech.",
  },
};

async function main() {
  const lines = JSON.parse(
    readFileSync(join(root, "lib", "sample-call-script.json"), "utf8")
  );

  if (lines.every((_, i) => existsSync(clipPath(i)))) {
    console.log("[sample-audio] clips already present — skipping generation.");
    return;
  }
  if (!process.env.OPENAI_API_KEY) {
    console.warn(
      "[sample-audio] OPENAI_API_KEY not set — skipping (Mode 2 uses the typed fallback)."
    );
    return;
  }

  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < lines.length; i++) {
    const { role, content } = lines[i];
    const cfg = VOICE[role];
    const num = String(i + 1).padStart(2, "0");

    let buffer;
    try {
      const speech = await openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: cfg.voice,
        input: content,
        instructions: cfg.instructions,
        response_format: "mp3",
      });
      buffer = Buffer.from(await speech.arrayBuffer());
    } catch {
      // Fall back to the broadly-available tts-1 (no `instructions` support).
      const speech = await openai.audio.speech.create({
        model: "tts-1",
        voice: cfg.fallbackVoice,
        input: content,
        response_format: "mp3",
      });
      buffer = Buffer.from(await speech.arrayBuffer());
    }

    writeFileSync(clipPath(i), buffer);
    console.log(`[sample-audio] ${num}/${lines.length} (${role})`);
  }
  console.log("[sample-audio] done.");
}

main().catch((err) => {
  console.warn(
    "[sample-audio] generation failed — Mode 2 will use the typed fallback."
  );
  console.warn(String(err?.message ?? err));
});
