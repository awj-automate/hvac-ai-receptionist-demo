"use client";

/**
 * Decorative full-bleed background: slow "heat glow" blobs plus particles
 * drifting upward to suggest airflow from an HVAC vent. Purely visual.
 *
 * Particle parameters are derived deterministically from the index so server
 * and client render identically (no hydration mismatch).
 */

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 47 + 7) % 100,
  size: 2 + (i % 4),
  duration: 16 + (i % 7) * 4,
  delay: -((i * 2.3) % 20),
  opacity: 0.12 + (i % 5) * 0.05,
}));

export function AirflowBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950"
    >
      {/* Heat-glow blobs */}
      <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-ember-700/20 blur-[120px]" />
      <div className="absolute top-1/3 -right-32 h-[32rem] w-[32rem] rounded-full bg-ember-500/10 blur-[140px]" />
      <div className="absolute -bottom-40 left-1/3 h-[26rem] w-[26rem] rounded-full bg-ember-600/10 blur-[130px]" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Rising airflow particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-[-5vh] rounded-full bg-ember-400"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
