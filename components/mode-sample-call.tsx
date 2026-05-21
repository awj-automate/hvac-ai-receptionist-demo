"use client";

import { motion } from "framer-motion";
import { CirclePlay, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AvatarOrb } from "@/components/avatar-orb";
import { CallSummary } from "@/components/call-summary";
import { TranscriptView } from "@/components/transcript-view";
import { Button } from "@/components/ui/button";
import {
  SAMPLE_CALL,
  SAMPLE_CALL_DURATION,
  SAMPLE_CALL_SUMMARY,
} from "@/lib/sample-call";
import type { TranscriptUtterance } from "@/lib/types";
import { formatClock } from "@/lib/utils";

// Average characters revealed per second while a line "types out".
const SECONDS_PER_CHAR = 0.04;
// Clock granularity — 20 ticks/sec keeps the typing animation smooth.
const TICK_MS = 50;

/**
 * Builds the visible transcript for a given playback position. Lines before the
 * current one are fully shown; the current line types out over its time window.
 */
function buildTranscript(elapsed: number): {
  utterances: TranscriptUtterance[];
  typing: boolean;
  agentSpeaking: boolean;
} {
  const visible = SAMPLE_CALL.filter((line) => elapsed >= line.at);
  if (visible.length === 0) {
    return { utterances: [], typing: false, agentSpeaking: false };
  }
  const idx = visible.length - 1;
  const current = SAMPLE_CALL[idx];
  const nextAt = SAMPLE_CALL[idx + 1]?.at ?? SAMPLE_CALL_DURATION;
  const window = Math.min(
    nextAt - current.at,
    current.content.length * SECONDS_PER_CHAR
  );
  const fraction = window > 0 ? Math.min(1, (elapsed - current.at) / window) : 1;
  const chars = Math.round(fraction * current.content.length);

  const utterances = visible.map((line, i) => ({
    role: line.role,
    content: i < idx ? line.content : line.content.slice(0, chars),
  }));

  return {
    utterances,
    typing: fraction < 1,
    agentSpeaking: current.role === "agent" && fraction < 1,
  };
}

export function ModeSampleCall({ onHome }: { onHome: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const stopClock = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startClock = useCallback(() => {
    stopClock();
    intervalRef.current = setInterval(() => {
      setElapsed((e) => Math.min(e + TICK_MS / 1000, SAMPLE_CALL_DURATION));
    }, TICK_MS);
  }, [stopClock]);

  useEffect(() => stopClock, [stopClock]);

  // Reaching the end of the recording transitions to the summary.
  useEffect(() => {
    if (started && !showSummary && elapsed >= SAMPLE_CALL_DURATION) {
      stopClock();
      setPlaying(false);
      audioRef.current?.pause();
      const t = setTimeout(() => setShowSummary(true), 900);
      return () => clearTimeout(t);
    }
  }, [elapsed, started, showSummary, stopClock]);

  const handlePlay = () => {
    setStarted(true);
    setPlaying(true);
    startClock();
    // The placeholder audio is silent; transcript timing is driven by the
    // clock above so playback works with or without a voiced recording.
    audioRef.current?.play().catch(() => {});
  };

  const handlePause = () => {
    setPlaying(false);
    stopClock();
    audioRef.current?.pause();
  };

  const handleRestart = () => {
    stopClock();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setElapsed(0);
    setPlaying(false);
    setStarted(false);
    setShowSummary(false);
  };

  const { utterances, typing, agentSpeaking } = useMemo(
    () => buildTranscript(elapsed),
    [elapsed]
  );

  const progress = Math.min(100, (elapsed / SAMPLE_CALL_DURATION) * 100);
  const orbState = !playing
    ? "idle"
    : agentSpeaking
      ? "speaking"
      : "listening";

  if (showSummary) {
    return (
      <CallSummary
        summary={SAMPLE_CALL_SUMMARY}
        loading={false}
        onRestart={handleRestart}
        onHome={onHome}
        restartLabel="Replay sample call"
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Hidden audio element — swap the file for a real recording later. */}
      <audio ref={audioRef} src="/audio/sample-call.mp3" preload="auto" />

      <div className="mb-6 text-center">
        <div className="sub-title mx-auto mb-4">
          <span className="sub-title-dot" />
          Mode 2 · Recorded sample
        </div>
        <h2 className="font-jakarta text-3xl font-extrabold tracking-heading text-ds-heading">
          A real <span className="gradient-text">&ldquo;AC not cooling&rdquo;</span>{" "}
          call
        </h2>
        <p className="mx-auto mt-2 max-w-md font-jakarta text-sm text-ds-muted">
          Watch the AI triage the issue and book a same-day service appointment.
        </p>
      </div>

      <div className="rounded-card border border-black/[0.06] bg-white p-5 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.2)]">
        <div className="flex justify-center pb-2">
          <AvatarOrb
            state={orbState}
            caption={
              !started
                ? "Press play to start"
                : playing
                  ? agentSpeaking
                    ? "Sarah is speaking"
                    : "Caller is speaking"
                  : "Paused"
            }
          />
        </div>

        <div className="mt-2 h-[320px] rounded-2xl border border-black/[0.05] bg-ds-surface p-3">
          {!started ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <CirclePlay className="h-12 w-12 text-ds-primary" />
              <p className="max-w-xs font-jakarta text-sm text-ds-muted">
                This is a pre-recorded example. The transcript types out in sync
                as the call plays.
              </p>
            </div>
          ) : (
            <TranscriptView utterances={utterances} typingLastLine={typing} />
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center gap-4">
          <Button
            variant="primary"
            size="md"
            onClick={playing ? handlePause : handlePlay}
          >
            {playing ? (
              <>
                <Pause className="h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> {started ? "Resume" : "Play call"}
              </>
            )}
          </Button>

          <div className="flex flex-1 items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ds-primary/15">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #E5C463, #8C6F1E)",
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
            <span className="w-20 text-right font-mono text-xs tabular-nums text-ds-muted">
              {formatClock(elapsed)} / {formatClock(SAMPLE_CALL_DURATION)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
