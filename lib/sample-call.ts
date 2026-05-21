import type { CallSummary, SampleLine } from "@/lib/types";

/**
 * Scripted "AC not cooling -> booked service appointment" call for Mode 2.
 *
 * `at` is the second-offset into public/audio/sample-call.mp3 when each line
 * begins. The placeholder MP3 is ~100s of silence; if you swap in a real
 * recording, re-time these values to match the voiced audio.
 */
export const SAMPLE_CALL: SampleLine[] = [
  {
    role: "agent",
    at: 0,
    content: "Apex Heating and Air, this is Sarah, how can I help you today?",
  },
  {
    role: "user",
    at: 4,
    content:
      "Hi — my AC's been running all morning but the house just won't cool down. It's 81 degrees in here.",
  },
  {
    role: "agent",
    at: 11,
    content:
      "Oh no, that's miserable in this heat. Is the system blowing air at all, or completely not working?",
  },
  {
    role: "user",
    at: 18,
    content: "It's blowing, but the air isn't cold. Feels close to room temperature.",
  },
  {
    role: "agent",
    at: 24,
    content:
      "Got it — that usually points to a refrigerant or compressor issue. Roughly how old is the system?",
  },
  {
    role: "user",
    at: 31,
    content: "I think about eight years? It came with the house.",
  },
  {
    role: "agent",
    at: 36,
    content: "Okay, eight years. And is this a central AC unit?",
  },
  {
    role: "user",
    at: 40,
    content: "Yeah, central air — there's the big unit outside.",
  },
  {
    role: "agent",
    at: 44,
    content:
      "Perfect. Have we serviced your system before, or is this your first time with us?",
  },
  {
    role: "user",
    at: 49,
    content: "First time — I just found you online.",
  },
  {
    role: "agent",
    at: 53,
    content:
      "Happy to help. I can get a tech out today between 2 and 5pm, or tomorrow 8 to 11am — which works better?",
  },
  {
    role: "user",
    at: 61,
    content: "Today would be amazing, it's really hot in here.",
  },
  {
    role: "agent",
    at: 65,
    content:
      "You got it — today, 2 to 5. Can I grab your name and the service address?",
  },
  {
    role: "user",
    at: 70,
    content: "It's Mike Reynolds, 4412 Bayshore Boulevard, Tampa.",
  },
  {
    role: "agent",
    at: 76,
    content: "Thanks Mike. And the best phone number to reach you?",
  },
  {
    role: "user",
    at: 80,
    content: "813-555-0142.",
  },
  {
    role: "agent",
    at: 84,
    content:
      "Perfect, you're all set. Our diagnostic fee is $89 and the tech will give you a full estimate on-site. He'll text you 30 minutes before he arrives — thanks for calling Apex, Mike!",
  },
  {
    role: "user",
    at: 94,
    content: "Great, thank you so much!",
  },
];

/** Total length of the sample recording, in seconds. */
export const SAMPLE_CALL_DURATION = 100;

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
