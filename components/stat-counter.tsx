"use client";

import { animate } from "framer-motion";
import { useEffect, useState } from "react";

interface StatCounterProps {
  value: number;
  suffix?: string;
  decimals?: number;
  durationSeconds?: number;
}

/** Counts up from 0 to `value` once, on mount. */
export function StatCounter({
  value,
  suffix = "",
  decimals = 0,
  durationSeconds = 1.8,
}: StatCounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: durationSeconds,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [value, durationSeconds]);

  return (
    <span className="tabular-nums">
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
