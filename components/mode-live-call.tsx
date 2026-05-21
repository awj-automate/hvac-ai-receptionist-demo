"use client";

import {
  LoaderCircle,
  Mic,
  PhoneCall,
  PhoneOff,
  RefreshCw,
  Settings,
  TriangleAlert,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RetellWebClient } from "retell-client-js-sdk";

import { AvatarOrb } from "@/components/avatar-orb";
import { CallSummary } from "@/components/call-summary";
import { MagneticButton } from "@/components/magnetic-button";
import { TranscriptView } from "@/components/transcript-view";
import { Button } from "@/components/ui/button";
import type {
  CallSummary as CallSummaryData,
  CallView,
  TranscriptUtterance,
} from "@/lib/types";
import { formatClock } from "@/lib/utils";

interface ModeLiveCallProps {
  retellConfigured: boolean;
  onHome: () => void;
}

type ErrorKind = "mic" | "connection";
interface ErrorInfo {
  kind: ErrorKind;
  message: string;
}

const EMPTY_SUMMARY: CallSummaryData = {
  customerName: "",
  issue: "",
  systemType: "",
  systemAge: "",
  urgency: "",
  address: "",
  phone: "",
  appointment: "",
};

export function ModeLiveCall({ retellConfigured, onHome }: ModeLiveCallProps) {
  const [view, setView] = useState<CallView>("idle");
  const [transcript, setTranscript] = useState<TranscriptUtterance[]>([]);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [summary, setSummary] = useState<CallSummaryData | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const clientRef = useRef<RetellWebClient | null>(null);
  const transcriptRef = useRef<TranscriptUtterance[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cleanupClient = useCallback(() => {
    const client = clientRef.current;
    if (client) {
      try {
        client.removeAllListeners?.();
      } catch {
        /* noop */
      }
      clientRef.current = null;
    }
    clearTimer();
  }, [clearTimer]);

  // Stop any in-progress call if the user leaves the mode.
  useEffect(() => {
    return () => {
      try {
        clientRef.current?.stopCall?.();
      } catch {
        /* noop */
      }
      cleanupClient();
    };
  }, [cleanupClient]);

  /** Sends the finished transcript to the summary extraction endpoint. */
  const runSummary = useCallback(async (lines: TranscriptUtterance[]) => {
    setSummaryLoading(true);
    const text = lines
      .map((l) => `${l.role === "agent" ? "Sarah" : "Caller"}: ${l.content}`)
      .join("\n");
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });
      const data = await res.json();
      setSummary(data?.summary ?? EMPTY_SUMMARY);
    } catch {
      setSummary(EMPTY_SUMMARY);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  /** Idempotent end-of-call handling — fires once per call. */
  const handleCallEnded = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    clearTimer();
    setAiSpeaking(false);
    setView("summary");
    runSummary(transcriptRef.current);
    cleanupClient();
  }, [clearTimer, runSummary, cleanupClient]);

  /** Transition into the active call state and start the timer. */
  const goActive = useCallback(() => {
    setView((v) => (v === "summary" || v === "error" ? v : "active"));
    if (!timerRef.current) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
  }, []);

  const startCall = useCallback(async () => {
    setError(null);
    setSummary(null);
    setTranscript([]);
    transcriptRef.current = [];
    setElapsed(0);
    setAiSpeaking(false);
    endedRef.current = false;

    // 1. Microphone permission — surfaced separately for a clear error UI.
    setView("requesting-mic");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      setError({
        kind: "mic",
        message:
          "We need microphone access so you can talk to the receptionist.",
      });
      setView("error");
      return;
    }

    // 2. Request a short-lived web call token from our API route.
    setView("connecting");
    let accessToken: string | undefined;
    try {
      const res = await fetch("/api/retell-token", { method: "POST" });
      const data = await res.json();
      accessToken = data?.access_token;
      if (!res.ok || !accessToken) throw new Error("no token");
    } catch {
      setError({
        kind: "connection",
        message:
          "We couldn't reach the AI receptionist. Please try again in a moment.",
      });
      setView("error");
      return;
    }

    // 3. Connect via the Retell Web SDK (imported lazily — browser only).
    try {
      const { RetellWebClient } = await import("retell-client-js-sdk");
      const client = new RetellWebClient();
      clientRef.current = client;

      client.on("call_started", goActive);

      client.on("update", (update: { transcript?: TranscriptUtterance[] }) => {
        // For web calls, update.transcript is the full running transcript.
        const lines = (update.transcript ?? []).map((u) => ({
          role: u.role,
          content: u.content,
        }));
        transcriptRef.current = lines;
        setTranscript(lines);
      });

      client.on("agent_start_talking", () => setAiSpeaking(true));
      client.on("agent_stop_talking", () => setAiSpeaking(false));
      client.on("call_ended", handleCallEnded);

      client.on("error", (err: unknown) => {
        console.error("[retell] call error:", err);
        try {
          client.stopCall();
        } catch {
          /* noop */
        }
        if (!endedRef.current) {
          setError({
            kind: "connection",
            message: "The call dropped unexpectedly. Please try again.",
          });
          setView("error");
          cleanupClient();
        }
      });

      await client.startCall({ accessToken });
      goActive(); // Belt-and-suspenders in case call_started is missed.
    } catch (err) {
      console.error("[retell] failed to start call:", err);
      setError({
        kind: "connection",
        message: "We couldn't start the call. Please try again.",
      });
      setView("error");
      cleanupClient();
    }
  }, [goActive, handleCallEnded, cleanupClient]);

  const endCall = useCallback(() => {
    try {
      clientRef.current?.stopCall();
    } catch {
      /* noop */
    }
    handleCallEnded();
  }, [handleCallEnded]);

  // ----- Summary view -----
  if (view === "summary") {
    return (
      <CallSummary
        summary={summary}
        loading={summaryLoading}
        onRestart={startCall}
        onHome={onHome}
        restartLabel="Start a new call"
      />
    );
  }

  // ----- Error view -----
  if (view === "error" && error) {
    return (
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-card border border-red-500/25 bg-red-500/[0.05] p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/[0.12]">
            <TriangleAlert className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="font-jakarta text-lg font-extrabold tracking-heading text-ds-heading">
            {error.kind === "mic"
              ? "Microphone access needed"
              : "Connection problem"}
          </h3>
          <p className="mt-1.5 font-jakarta text-sm text-ds-muted">
            {error.message}
          </p>

          {error.kind === "mic" && (
            <div className="mt-4 rounded-xl border border-black/[0.06] bg-white p-4 text-left font-jakarta text-sm text-ds-text">
              <p className="mb-2 font-bold text-ds-heading">
                To enable your microphone:
              </p>
              <ol className="list-inside list-decimal space-y-1 text-ds-muted">
                <li>
                  Click the lock or camera icon in your browser&apos;s address
                  bar.
                </li>
                <li>Set Microphone for this site to &ldquo;Allow&rdquo;.</li>
                <li>Reload the page, then try the call again.</li>
              </ol>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={startCall}
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={onHome}
            >
              Back to demo home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ----- Active / connecting call view -----
  if (view === "active" || view === "connecting" || view === "requesting-mic") {
    const connecting = view !== "active";
    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-5 flex items-center justify-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ds-primary opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ds-primary" />
          </span>
          <span className="font-mono text-sm tabular-nums text-ds-text">
            {connecting ? "Connecting…" : formatClock(elapsed)}
          </span>
        </div>

        <div className="rounded-card border border-black/[0.06] bg-white p-5 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.2)]">
          <div className="flex justify-center pb-2">
            <AvatarOrb
              state={
                connecting
                  ? "connecting"
                  : aiSpeaking
                    ? "speaking"
                    : "listening"
              }
              caption={
                view === "requesting-mic"
                  ? "Requesting microphone…"
                  : view === "connecting"
                    ? "Connecting you to Sarah…"
                    : aiSpeaking
                      ? "Sarah is speaking"
                      : "Sarah is listening — go ahead"
              }
            />
          </div>

          <div className="mt-2 h-[300px] rounded-2xl border border-black/[0.05] bg-ds-surface p-3">
            {connecting ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <LoaderCircle className="h-7 w-7 animate-spin text-ds-primary" />
                <p className="font-jakarta text-sm text-ds-muted">
                  {view === "requesting-mic"
                    ? "Allow microphone access when your browser asks."
                    : "Setting up your call with Apex Heating & Air…"}
                </p>
              </div>
            ) : (
              <TranscriptView
                utterances={transcript}
                emptyHint="Say hello to Sarah to get started…"
              />
            )}
          </div>

          <div className="mt-4 flex justify-center">
            <Button
              variant="danger"
              size="lg"
              onClick={endCall}
              disabled={connecting}
            >
              <PhoneOff className="h-4 w-4" />
              End call
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ----- Idle view -----
  return (
    <div className="mx-auto w-full max-w-xl">
      {!retellConfigured && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-ds-primary/30 bg-ds-primary/[0.08] p-4">
          <Settings className="mt-0.5 h-5 w-5 shrink-0 text-ds-primary-dark" />
          <div className="font-jakarta text-sm">
            <p className="font-bold text-ds-primary-dark">
              Live calling needs setup
            </p>
            <p className="mt-0.5 text-ds-text">
              Add <code className="font-mono text-ds-primary-dark">RETELL_API_KEY</code>{" "}
              and{" "}
              <code className="font-mono text-ds-primary-dark">
                RETELL_AGENT_ID
              </code>{" "}
              to enable Mode 1. See the README for the 5-minute Retell agent
              setup. Modes 2 and 3 work without any keys.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-card border border-black/[0.06] bg-white p-8 text-center shadow-[0_18px_50px_-20px_rgba(0,0,0,0.2)]">
        <div className="flex justify-center pb-4">
          <AvatarOrb state="idle" />
        </div>
        <h2 className="font-jakarta text-2xl font-extrabold tracking-heading text-ds-heading">
          Talk to Sarah, the AI receptionist
        </h2>
        <p className="mx-auto mt-2 max-w-md font-jakarta text-sm text-ds-muted">
          You&apos;re the homeowner. Call in with any HVAC problem — your AC
          quit, a strange noise, time for a tune-up — and let Sarah triage it
          and book the appointment.
        </p>

        <div className="mt-6 flex justify-center">
          <MagneticButton strength={0.45}>
            <Button
              variant="primary"
              size="lg"
              onClick={startCall}
              disabled={!retellConfigured}
            >
              <Mic className="h-5 w-5" />
              Talk to the AI Receptionist
            </Button>
          </MagneticButton>
        </div>

        <p className="mt-3 flex items-center justify-center gap-1.5 font-jakarta text-xs text-ds-subtle">
          <PhoneCall className="h-3.5 w-3.5" />
          Your browser will ask for microphone access.
        </p>
      </div>
    </div>
  );
}
