/** Shared types for the HVAC AI receptionist demo. */

/** Which screen the demo is showing. */
export type DemoMode = "home" | "live" | "sample" | "dashboard";

/** Lifecycle of a call screen (used by Mode 1 and Mode 2). */
export type CallView =
  | "idle"
  | "requesting-mic"
  | "connecting"
  | "active"
  | "summary"
  | "error";

/** A single utterance in a live or sample transcript. */
export interface TranscriptUtterance {
  role: "agent" | "user";
  content: string;
}

/** A scripted transcript line for the Mode 2 sample call. */
export interface SampleLine extends TranscriptUtterance {
  /** Seconds into the recording when this line begins. */
  at: number;
}

/** Structured data extracted from a completed call. */
export interface CallSummary {
  customerName: string;
  issue: string;
  systemType: string;
  systemAge: string;
  urgency: string;
  address: string;
  phone: string;
  appointment: string;
}

/** Source of a summary — real extraction vs. graceful fallback. */
export type SummarySource = "openai" | "fallback" | "sample";
