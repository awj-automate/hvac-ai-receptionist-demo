import type { CallSummary, TranscriptUtterance } from "@/lib/types";

import script from "./sample-call-script.json";

/**
 * Scripted "AC not cooling -> booked service appointment" call for Mode 2.
 *
 * The line text lives in sample-call-script.json (single source of truth, also
 * read by scripts/generate-sample-audio.mjs). Each line has its own voiced
 * audio clip in public/audio/lines/, and Mode 2 plays them in sequence.
 */
export const SAMPLE_CALL = script as { role: "agent" | "user"; content: string }[];

/** Path to the voiced clip for a given line index (0-based). */
export function lineAudioSrc(index: number): string {
  return `/audio/lines/line-${String(index + 1).padStart(2, "0")}.mp3`;
}

// Re-export so the line shape stays interchangeable with transcript types.
export type SampleLine = TranscriptUtterance;

/**
 * Pre-extracted summary for the sample call. Mode 2 uses this directly (the
 * transcript is fixed) so the Call Summary view is instant and reliable on a
 * sales call. Mode 1 extracts the equivalent live via /api/summarize.
 */
export const SAMPLE_CALL_SUMMARY: CallSummary = {
  customerName: "Mike Reynolds",
  issue: "AC not cooling — air blowing warm, possible refrigerant or compressor issue",
  systemType: "Central AC",
  systemAge: "~8 years",
  urgency: "Same-day — residential, 81°F indoors",
  address: "4412 Bayshore Boulevard, Tampa, FL",
  phone: "(813) 555-0142",
  appointment: "Today, 2:00–5:00 PM window",
};
