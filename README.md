# HVAC AI Receptionist Demo

A single-page, shareable demo of an AI phone receptionist for a residential HVAC
company ("Sarah" at the fictional **Apex Heating & Air**). It's built to be
opened on a sales call or sent as a link — a prospect can hear exactly what
their customers would experience when an AI answers the phone.

The demo has three modes:

1. **Live Inbound Call** — the visitor clicks a button, grants mic access, and
   has a real voice conversation with the AI receptionist in the browser
   (powered by [Retell](https://www.retellai.com)). A live transcript renders on
   screen and the call ends in an animated, extracted call summary.
2. **Sample Call Playback** — a pre-recorded "AC not cooling → booked
   appointment" call with a transcript that types out in sync with playback.
   Works with **no API keys**.
3. **Operations Dashboard** — animated stats, a call-handling workflow, a mock
   ServiceTitan dispatch board, and a 24/7 activity feed. Works with **no API
   keys**.

## Live demo

> **Live URL:** https://hvac-ai-receptionist-demo.vercel.app

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion ·
Retell Web SDK · OpenAI (GPT-4o) · deployed on Vercel.

## Local setup

```bash
pnpm install          # (npm install also works)
cp .env.example .env.local
# fill in the keys you have — see "Environment variables" below
pnpm dev              # http://localhost:3000
```

Modes 2 and 3 run immediately with no keys. Mode 1 (live calling) needs a Retell
agent — see below.

### Environment variables

| Variable           | Required for         | Notes                                            |
| ------------------ | -------------------- | ------------------------------------------------ |
| `RETELL_API_KEY`   | Mode 1 (live call)   | From the Retell dashboard.                       |
| `RETELL_AGENT_ID`  | Mode 1 (live call)   | The `agent_id` of the Sarah agent you create.    |
| `OPENAI_API_KEY`   | Summary + sample audio | Mode 1 call-summary extraction; build-time Mode 2 voice generation. |

If `RETELL_API_KEY` / `RETELL_AGENT_ID` are missing, Mode 1 is disabled and a
setup banner is shown — Modes 2 and 3 stay fully functional. If `OPENAI_API_KEY`
is missing, the Mode 1 call summary degrades gracefully.

## Retell agent setup (required for Mode 1)

The AI agent itself lives in Retell, not in this repo. Create it once:

1. Sign in at [dashboard.retellai.com](https://dashboard.retellai.com) and
   **create a new agent**.
2. **Voice:** choose a natural ElevenLabs female voice — warm and professional.
   A slight Southern accent works well for the HVAC market.
3. **LLM:** GPT-4o.
4. **System prompt:** paste the prompt below exactly.
5. Copy the agent's `agent_id` into `.env.local` (and your Vercel project) as
   `RETELL_AGENT_ID`. Create an API key and set it as `RETELL_API_KEY`.

### System prompt

```
You are Sarah, the receptionist at Apex Heating & Air, a residential HVAC company in Tampa, Florida. You're answering an inbound call.

CONTEXT: The caller is a homeowner who is calling because they have an HVAC issue. You don't know what issue yet — you need to find out.

YOUR GOAL:
1. Answer warmly and quickly
2. Identify the issue (AC not cooling, heating problem, no heat, strange noise, install/replace, maintenance, etc.)
3. Run HVAC-specific triage to determine urgency and job type
4. Collect required info: name, address, phone, system type (central AC, mini-split, heat pump, furnace, etc.), system age if known
5. Book a service appointment

QUALIFICATION/TRIAGE QUESTIONS (ask as relevant):
- What's going on with your system?
- Is it cooling/heating at all, or completely not working?
- How old is your system roughly?
- Is this an emergency or can it wait a day or two?
- Have we serviced your system before?

APPOINTMENT BOOKING:
- Offer two specific time slots: "I can get a tech out today between 2pm and 5pm, or tomorrow morning between 8am and 11am — which works better?"
- For emergencies (no AC in summer, no heat in winter, water leak, electrical issue): offer same-day
- Standard service: next-day or 2-day window
- Confirm address, phone, and the time slot

CONVERSATION RULES:
- 1-2 sentences per turn, MAX
- Sound warm and competent, like a real HVAC office receptionist
- Use natural acknowledgments: "got it", "okay", "no problem"
- Never quote exact repair costs ("our diagnostic fee is $89, and our tech will give you a full estimate when he's there")
- Never promise specific repair outcomes
- If asked questions you can't answer: "Let me have one of our techs follow up on that when they arrive"
- Common service categories: AC repair, AC installation, heating repair, furnace repair, maintenance/tune-up, duct work, thermostat issues, indoor air quality

First message: "Apex Heating and Air, this is Sarah, how can I help you today?"

End the call warmly after booking: "Perfect, I have you scheduled for [time]. Our tech will text you 30 minutes before arrival. Thanks for calling Apex — talk to you soon!"
```

### Modifying the system prompt

The prompt above is edited **in the Retell dashboard** (your agent → LLM → prompt),
not in this codebase. Re-pasting it there updates the agent's behavior
immediately; no redeploy of this app is needed.

To adapt the demo for a different business, also update the on-screen copy and
the brand name in `components/demo-app.tsx`, and the sample-call script in
`lib/sample-call.ts`.

## Sample call audio

The Mode 2 sample call is voiced with one OpenAI-TTS clip per line. Generation
runs **at build time** — `scripts/generate-sample-audio.mjs` is chained into the
`build` script and reads `OPENAI_API_KEY` from the environment, so no local
setup is needed: just set the key in your Vercel project.

- With the key set, each deploy renders the 18 clips into `public/audio/lines/`
  (Sarah and the caller use different voices).
- Without it, generation is skipped and Mode 2 falls back to a silent typed
  walkthrough — the build never fails.
- The call text lives in `lib/sample-call-script.json`.

To avoid regenerating on every deploy, render the clips once locally
(`OPENAI_API_KEY=sk-... node scripts/generate-sample-audio.mjs`) and commit
`public/audio/lines/` — the script skips when the clips already exist.

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new) — Vercel
   auto-detects Next.js.
3. In **Project Settings → Environment Variables**, add `RETELL_API_KEY`,
   `RETELL_AGENT_ID`, and `OPENAI_API_KEY` (Mode 1 only — the app deploys and
   runs Modes 2 + 3 without them).
4. Every push to `main` auto-deploys. Paste the production URL into the **Live
   demo** section above.

## Project structure

```
app/
  api/retell-token/route.ts   Creates a Retell web call (server-side key)
  api/summarize/route.ts      GPT-4o transcript → structured summary
  page.tsx                    Server component; checks env, renders the demo
components/
  demo-app.tsx                Hero + mode switcher + navigation
  mode-live-call.tsx          Mode 1 — Retell Web SDK integration
  mode-sample-call.tsx        Mode 2 — synced playback
  mode-dashboard.tsx          Mode 3 — animated dashboard
  call-summary.tsx            Animated post-call summary + mock CRM push
lib/
  sample-call.ts              Mode 2 transcript + pre-extracted summary
  dashboard-data.ts           Mode 3 mock data
```

---

A DataStaq AI demo. Voice AI by Retell.
