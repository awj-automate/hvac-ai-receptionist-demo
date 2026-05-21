"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Headset, User } from "lucide-react";
import { useEffect, useRef } from "react";

import type { TranscriptUtterance } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TranscriptViewProps {
  utterances: TranscriptUtterance[];
  /** Show a blinking caret on the final line (used while typing/streaming). */
  typingLastLine?: boolean;
  emptyHint?: string;
}

/** Chat-style transcript shared by the live call and sample playback modes. */
export function TranscriptView({
  utterances,
  typingLastLine = false,
  emptyHint = "The conversation will appear here…",
}: TranscriptViewProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const lastLine = utterances[utterances.length - 1];

  // Keep the newest line in view as the transcript grows.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [utterances.length, lastLine?.content]);

  return (
    <div className="scroll-thin h-full overflow-y-auto px-1">
      {utterances.length === 0 ? (
        <div className="flex h-full min-h-[200px] items-center justify-center">
          <p className="text-sm text-white/35">{emptyHint}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 py-2">
          <AnimatePresence initial={false}>
            {utterances.map((u, i) => {
              const isAgent = u.role === "agent";
              const isLast = i === utterances.length - 1;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "flex items-end gap-2.5",
                    isAgent ? "justify-start" : "flex-row-reverse justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      isAgent
                        ? "bg-gradient-to-br from-ember-500 to-ember-700 text-white"
                        : "bg-ink-700 text-white/70"
                    )}
                  >
                    {isAgent ? (
                      <Headset className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      isAgent
                        ? "rounded-bl-sm bg-ink-750 text-white/90"
                        : "rounded-br-sm bg-ember-700/25 text-ember-50"
                    )}
                  >
                    <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/40">
                      {isAgent ? "Sarah · Apex Heating & Air" : "Caller"}
                    </p>
                    <span
                      className={cn(
                        typingLastLine && isLast && u.content ? "caret" : ""
                      )}
                    >
                      {u.content}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
      )}
    </div>
  );
}
