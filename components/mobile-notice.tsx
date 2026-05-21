"use client";

import { Monitor, X } from "lucide-react";
import { useState } from "react";

/** Dismissible "best on desktop" notice, shown only on small screens. */
export function MobileNotice() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-ds-primary/25 bg-ds-primary/[0.08] px-4 py-3 text-sm text-ds-primary-dark md:hidden">
      <Monitor className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="flex-1 font-jakarta">
        This demo runs on mobile, but it&apos;s best experienced on a desktop
        browser with a microphone.
      </p>
      <button
        type="button"
        aria-label="Dismiss notice"
        onClick={() => setDismissed(true)}
        className="text-ds-primary-dark/60 transition-colors hover:text-ds-heading"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
