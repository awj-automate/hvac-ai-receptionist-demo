/**
 * Generates a valid, silent CBR MP3 used as the Mode 2 "sample call" placeholder.
 *
 * The demo's transcript is driven by the <audio> element's currentTime, so it
 * needs a real, seekable MP3 of a known length even before a voiced recording
 * exists. This writes ~100s of MPEG-1 Layer III silence (128 kbps, 44.1 kHz).
 *
 * TODO: Replace public/audio/sample-call.mp3 with a real recording of the
 * "AC not cooling" call (e.g. rendered from ElevenLabs) once available. Keep the
 * line timings in lib/sample-call.ts in sync with the recording.
 *
 * Run with:  node scripts/generate-silent-mp3.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// MPEG-1 Layer III frame header: 0xFF 0xFB 0x90 0x04
// -> MPEG1, Layer III, no CRC, 128 kbps, 44.1 kHz, stereo.
const FRAME_HEADER = [0xff, 0xfb, 0x90, 0x04];
// CBR frame size = floor(144 * bitrate / samplerate) = floor(144*128000/44100).
const FRAME_SIZE = 417;
// Each frame carries 1152 samples -> 1152 / 44100 s of audio.
const SECONDS_PER_FRAME = 1152 / 44100;
const TARGET_SECONDS = 100;
const FRAME_COUNT = Math.ceil(TARGET_SECONDS / SECONDS_PER_FRAME);

const frame = Buffer.alloc(FRAME_SIZE, 0);
frame.set(FRAME_HEADER, 0); // remaining bytes stay zero -> decoded as silence

const mp3 = Buffer.concat(Array.from({ length: FRAME_COUNT }, () => frame));

const outDir = join(__dirname, "..", "public", "audio");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "sample-call.mp3");
writeFileSync(outPath, mp3);

console.log(
  `Wrote ${outPath} (${FRAME_COUNT} frames, ~${(
    FRAME_COUNT * SECONDS_PER_FRAME
  ).toFixed(1)}s, ${(mp3.length / 1024).toFixed(0)} KB)`
);
