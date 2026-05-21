"use client";

import { motion } from "framer-motion";
import { CirclePlay, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AvatarOrb } from "@/components/avatar-orb";
import { CallSummary } from "@/components/call-summary";
import { TranscriptView } from "@/components/transcript-view";
import { Button } from "@/components/ui/button";
import {
  lineAudioSrc,
  SAMPLE_CALL,
  SAMPLE_CALL_SUMMARY,
} from "@/lib/sample-call";
import type { TranscriptUtterance } from "@/lib/types";
import { formatClock } from "@/lib/utils";

const TOTAL = SAMPLE_CALL.length;

/** Reading-time used to type a line out when its audio clip is unavailable. */
const fallbackDur = (text: string) => Math.max(1.8, text.length * 0.055);

/**
 * Mode 2 — plays the sample call as a sequence of per-line voiced clips
 * (public/audio/lines/), typing each transcript line in sync. If a clip is
 * missing (e.g. audio wasn't generated), that line falls back to a timed
 * type-out so the walkthrough still flows.
 */
export function ModeSampleCall({ onHome }: { onHome: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);
  const idxRef = useRef(0);
  const completedRef = useRef(0); // seconds of all finished lines
  const doneRef = useRef(false);
  const fbRef = useRef({ active: false, elapsed: 0, dur: 0 });

  const [lineIndex, setLineIndex] = useState(0);
  const [lineProgress, setLineProgress] = useState(0); // 0..1 of current line
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const stopRaf = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTsRef.current = 0;
  }, []);

  /** Point the audio element at a line's clip; warm the next one. */
  const playLine = useCallback((index: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    fbRef.current = { active: false, elapsed: 0, dur: 0 };
    audio.src = lineAudioSrc(index);
    audio.currentTime = 0;
    setLineProgress(0);
    audio.play().catch(() => {
      // Clip missing / autoplay blocked → time this line out instead.
      if (!fbRef.current.active) {
        fbRef.current = {
          active: true,
          elapsed: 0,
          dur: fallbackDur(SAMPLE_CALL[index].content),
        };
      }
    });
    if (index + 1 < TOTAL) {
      const warm = new Audio();
      warm.preload = "auto";
      warm.src = lineAudioSrc(index + 1);
    }
  }, []);

  /** Move to the next line, or finish the call. */
  const advance = useCallback(
    (addSeconds: number) => {
      completedRef.current += addSeconds;
      const next = idxRef.current + 1;
      if (next >= TOTAL) {
        doneRef.current = true;
        stopRaf();
        setPlaying(false);
        setLineProgress(1);
        audioRef.current?.pause();
        window.setTimeout(() => setShowSummary(true), 900);
        return;
      }
      idxRef.current = next;
      setLineIndex(next);
      playLine(next);
    },
    [playLine, stopRaf]
  );

  const tick = useCallback(
    (ts: number) => {
      const audio = audioRef.current;
      const fb = fbRef.current;
      const dt = lastTsRef.current ? (ts - lastTsRef.current) / 1000 : 0;
      lastTsRef.current = ts;

      if (fb.active) {
        fb.elapsed += dt;
        const frac = fb.dur > 0 ? Math.min(1, fb.elapsed / fb.dur) : 1;
        setLineProgress(frac);
        setElapsed(completedRef.current + Math.min(fb.elapsed, fb.dur));
        if (frac >= 1) advance(fb.dur);
      } else if (audio) {
        const dur = audio.duration;
        const cur = audio.currentTime || 0;
        if (Number.isFinite(dur) && dur > 0) {
          setLineProgress(Math.min(1, cur / dur));
        }
        setElapsed(completedRef.current + cur);
      }

      if (!doneRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [advance]
  );

  // Clean up the animation frame on unmount.
  useEffect(() => stopRaf, [stopRaf]);

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!started) {
      setStarted(true);
      doneRef.current = false;
      idxRef.current = 0;
      completedRef.current = 0;
      fbRef.current = { active: false, elapsed: 0, dur: 0 };
      setLineIndex(0);
      playLine(0);
    } else if (!fbRef.current.active) {
      audio.play().catch(() => {});
    }
    setPlaying(true);
    stopRaf();
    rafRef.current = requestAnimationFrame(tick);
  };

  const handlePause = () => {
    audioRef.current?.pause();
    setPlaying(false);
    stopRaf();
  };

  const handleRestart = () => {
    stopRaf();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
    }
    doneRef.current = false;
    idxRef.current = 0;
    completedRef.current = 0;
    fbRef.current = { active: false, elapsed: 0, dur: 0 };
    setLineIndex(0);
    setLineProgress(0);
    setElapsed(0);
    setPlaying(false);
    setStarted(false);
    setShowSummary(false);
  };

  const { utterances, typing } = useMemo(() => {
    const out: TranscriptUtterance[] = [];
    for (let i = 0; i <= lineIndex && i < TOTAL; i++) {
      const line = SAMPLE_CALL[i];
      if (i < lineIndex) {
        out.push(line);
      } else {
        const chars = Math.round(lineProgress * line.content.length);
        out.push({ role: line.role, content: line.content.slice(0, chars) });
      }
    }
    return { utterances: out, typing: lineProgress < 1 };
  }, [lineIndex, lineProgress]);

  const currentRole = SAMPLE_CALL[lineIndex]?.role;
  const progress = Math.min(100, ((lineIndex + lineProgress) / TOTAL) * 100);
  const orbState = !playing
    ? "idle"
    : currentRole === "agent"
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
      {/* One audio element, re-pointed at each line's clip in sequence. */}
      <audio
        ref={audioRef}
        preload="auto"
        onEnded={() => {
          if (fbRef.current.active) return;
          const audio = audioRef.current;
          advance(
            audio && Number.isFinite(audio.duration) ? audio.duration : 0
          );
        }}
        onError={() => {
          // Missing clip → time this line out instead of stalling.
          if (started && !fbRef.current.active) {
            fbRef.current = {
              active: true,
              elapsed: 0,
              dur: fallbackDur(SAMPLE_CALL[idxRef.current].content),
            };
          }
        }}
      />

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
                  ? currentRole === "agent"
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
                A real, voiced example call. Press play — the transcript types
                out in sync with each line.
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
                transition={{ duration: 0.15, ease: "linear" }}
              />
            </div>
            <span className="w-24 text-right font-mono text-xs tabular-nums text-ds-muted">
              {formatClock(elapsed)} · {Math.min(lineIndex + 1, TOTAL)}/{TOTAL}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
