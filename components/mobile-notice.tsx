"use client";

import { Monitor, X } from "lucide-react";
import { useState } from "react";

/** Dismissible "best on desktop" notice, shown only on small screens. */
export function MobileNotice() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-ember-500/30 bg-ember-700/10 px-4 py-3 text-sm text-ember-200 md:hidden">
      <Monitor className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="flex-1">
        This demo runs on mobile, but it&apos;s best experienced on a desktop
        browser with a microphone.
      </p>
      <button
        type="button"
        aria-label="Dismiss notice"
        onClick={() => setDismissed(true)}
        className="text-ember-200/70 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
