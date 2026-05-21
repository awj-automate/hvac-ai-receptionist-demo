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

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [utterances.length, lastLine?.content]);

  return (
    <div className="h-full overflow-y-auto px-1">
      {utterances.length === 0 ? (
        <div className="flex h-full min-h-[200px] items-center justify-center">
          <p className="font-jakarta text-sm text-ds-subtle">{emptyHint}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5 py-2">
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
                    isAgent ? "justify-start" : "flex-row-reverse"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      isAgent
                        ? "text-white"
                        : "border border-black/[0.06] bg-white text-ds-muted"
                    )}
                    style={
                      isAgent
                        ? {
                            background:
                              "radial-gradient(50% 58% at 50% 95%, #E5C463, #C9A227)",
                          }
                        : undefined
                    }
                  >
                    {isAgent ? (
                      <Headset className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[78%] rounded-2xl px-4 py-2.5",
                      isAgent
                        ? "rounded-bl-sm border border-black/[0.06] bg-white shadow-sm"
                        : "rounded-br-sm text-white shadow-sm"
                    )}
                    style={
                      isAgent
                        ? undefined
                        : {
                            background:
                              "linear-gradient(135deg, #C9A227, #8C6F1E)",
                          }
                    }
                  >
                    <p
                      className={cn(
                        "mb-0.5 font-jakarta text-[10px] font-bold uppercase tracking-[0.12em]",
                        isAgent ? "text-ds-primary-dark" : "text-white/75"
                      )}
                    >
                      {isAgent ? "Sarah · Apex Heating & Air" : "Caller"}
                    </p>
                    <span
                      className={cn(
                        "font-jakarta text-sm leading-relaxed",
                        isAgent ? "text-ds-text" : "text-white",
                        typingLastLine && isLast && u.content
                          ? "type-caret"
                          : ""
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
