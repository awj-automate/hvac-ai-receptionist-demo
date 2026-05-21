"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { type MouseEvent, type ReactNode, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Wraps a CTA so it eases toward the cursor on hover and snaps back on
 * leave. Ported from datastaq-hvac's MagneticButton.
 */
export function MagneticButton({
  children,
  strength = 0.4,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 230, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 230, damping: 15, mass: 0.4 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  );
}
