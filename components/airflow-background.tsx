"use client";

import { ParticleField } from "@/components/particle-field";

/**
 * Full-bleed page background: warm cream base, slow gold "heat glow"
 * blobs, and a drifting particle field. Purely decorative.
 */
export function AirflowBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ds-bg"
    >
      {/* Gold heat-glow blobs */}
      <div
        className="blob absolute -top-40 right-[5%] h-[34rem] w-[34rem]"
        style={{
          background: "linear-gradient(96deg, #C9A227, #E5C463)",
          filter: "blur(120px)",
          opacity: 0.16,
        }}
      />
      <div
        className="blob absolute bottom-[2%] left-[1%] h-[26rem] w-[26rem]"
        style={{
          background: "linear-gradient(96deg, #8C6F1E, #D4AF37)",
          filter: "blur(110px)",
          opacity: 0.1,
          animationDelay: "3s",
        }}
      />

      {/* Drifting particles */}
      <div className="absolute inset-0">
        <ParticleField density={1} />
      </div>
    </div>
  );
}
