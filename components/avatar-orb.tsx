"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type OrbState = "idle" | "connecting" | "speaking" | "listening";

interface AvatarOrbProps {
  state: OrbState;
  /** Optional label rendered under the orb. */
  caption?: string;
}

/**
 * Animated avatar for the AI receptionist. Pulses outward when the agent is
 * speaking, breathes gently while listening, and shimmers while connecting.
 */
export function AvatarOrb({ state, caption }: AvatarOrbProps) {
  const speaking = state === "speaking";
  const connecting = state === "connecting";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex h-44 w-44 items-center justify-center">
        {/* Expanding rings while speaking */}
        {speaking && (
          <>
            <span className="absolute h-32 w-32 rounded-full border border-ember-500/50 animate-pulse-ring" />
            <span
              className="absolute h-32 w-32 rounded-full border border-ember-500/40 animate-pulse-ring"
              style={{ animationDelay: "0.8s" }}
            />
            <span
              className="absolute h-32 w-32 rounded-full border border-ember-500/30 animate-pulse-ring"
              style={{ animationDelay: "1.6s" }}
            />
          </>
        )}

        {/* Core orb */}
        <motion.div
          className={cn(
            "relative flex h-32 w-32 items-center justify-center rounded-full",
            "bg-gradient-to-br from-ember-400 via-ember-600 to-ember-700"
          )}
          animate={
            speaking
              ? { scale: [1, 1.08, 0.97, 1.05, 1] }
              : connecting
                ? { scale: [1, 1.04, 1], opacity: [0.7, 1, 0.7] }
                : { scale: [1, 1.03, 1] }
          }
          transition={{
            duration: speaking ? 0.9 : connecting ? 1.1 : 3.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            boxShadow: speaking
              ? "0 0 70px -6px rgba(249,84,45,0.75)"
              : "0 0 45px -10px rgba(249,84,45,0.5)",
          }}
        >
          {/* Inner gloss */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
          {/* Soundwave bars */}
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((bar) => (
              <motion.span
                key={bar}
                className="w-1.5 rounded-full bg-white"
                animate={
                  speaking
                    ? { height: ["10px", "30px", "14px", "26px", "12px"] }
                    : { height: "10px" }
                }
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: bar * 0.12,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {caption && (
        <p className="text-sm font-medium text-white/60">{caption}</p>
      )}
    </div>
  );
}
