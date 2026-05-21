"use client";

import { motion } from "framer-motion";

type OrbState = "idle" | "connecting" | "speaking" | "listening";

interface AvatarOrbProps {
  state: OrbState;
  /** Optional label rendered under the orb. */
  caption?: string;
}

/**
 * Animated avatar for the AI receptionist — a gold orb that pulses
 * outward while the agent speaks and breathes gently otherwise.
 */
export function AvatarOrb({ state, caption }: AvatarOrbProps) {
  const speaking = state === "speaking";
  const connecting = state === "connecting";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex h-44 w-44 items-center justify-center">
        {/* Expanding rings while speaking */}
        {speaking &&
          [0, 0.9, 1.8].map((delay, i) => (
            <span
              key={i}
              className="pulse-ring absolute h-32 w-32 rounded-full"
              style={{
                background: `rgba(201,162,39,${0.26 - i * 0.07})`,
                animationDelay: `${delay}s`,
              }}
            />
          ))}

        {/* Core orb */}
        <motion.div
          className="relative flex h-32 w-32 items-center justify-center rounded-full"
          style={{
            background:
              "radial-gradient(58% 62% at 50% 92%, #E5C463 0%, #C9A227 58%, #8C6F1E 100%)",
            boxShadow: speaking
              ? "0 20px 54px -10px rgba(201,162,39,0.62)"
              : "0 14px 40px -14px rgba(201,162,39,0.5)",
          }}
          animate={
            speaking
              ? { scale: [1, 1.06, 0.98, 1.04, 1] }
              : connecting
                ? { scale: [1, 1.04, 1], opacity: [0.78, 1, 0.78] }
                : { scale: [1, 1.03, 1] }
          }
          transition={{
            duration: speaking ? 0.9 : connecting ? 1.1 : 3.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Top gloss */}
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background:
                "radial-gradient(62% 50% at 50% 10%, rgba(255,255,255,0.55), transparent)",
            }}
          />
          {/* Soundwave bars */}
          <div className="flex items-end gap-1">
            {[0, 1, 2, 3, 4].map((bar) => (
              <motion.span
                key={bar}
                className="w-1.5 rounded-full bg-white"
                animate={
                  speaking
                    ? { height: ["9px", "26px", "13px", "22px", "11px"] }
                    : { height: "9px" }
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
        <p className="font-jakarta text-sm font-medium text-ds-muted">
          {caption}
        </p>
      )}
    </div>
  );
}
