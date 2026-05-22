"use client";

import { motion } from "framer-motion";
import {
  CalendarPlus,
  CircleCheck,
  ExternalLink,
  FileSpreadsheet,
  LoaderCircle,
  type LucideIcon,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";

import type { CallSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

type DestState = "idle" | "loading" | "success" | "error" | "unconfigured";

interface Destination {
  id: string;
  label: string;
  doneLabel: string;
  icon: LucideIcon;
  endpoint: string;
}

const DESTINATIONS: Destination[] = [
  {
    id: "sheets",
    label: "Add to Google Sheet",
    doneLabel: "Added to Google Sheet",
    icon: FileSpreadsheet,
    endpoint: "/api/booking/google-sheets",
  },
  {
    id: "calendar",
    label: "Book in Google Calendar",
    doneLabel: "Booked in Google Calendar",
    icon: CalendarPlus,
    endpoint: "/api/booking/google-calendar",
  },
];

interface Result {
  state: DestState;
  message: string;
  url?: string;
}

/**
 * Real booking actions on the Call Summary — each button posts the extracted
 * summary to an API route that writes to Google Sheets / Calendar. Integrations
 * that aren't configured report it gracefully instead of breaking the demo.
 */
export function BookingDestinations({ summary }: { summary: CallSummary }) {
  const [results, setResults] = useState<Record<string, Result>>({});

  const book = async (dest: Destination) => {
    setResults((r) => ({ ...r, [dest.id]: { state: "loading", message: "" } }));
    try {
      const res = await fetch(dest.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.ok) {
        setResults((r) => ({
          ...r,
          [dest.id]: {
            state: "success",
            message: data.message ?? "Done.",
            url: data.url,
          },
        }));
      } else {
        setResults((r) => ({
          ...r,
          [dest.id]: {
            state: data?.configured === false ? "unconfigured" : "error",
            message: data?.message ?? "Something went wrong.",
          },
        }));
      }
    } catch {
      setResults((r) => ({
        ...r,
        [dest.id]: {
          state: "error",
          message: "Couldn't reach the server — please try again.",
        },
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-3 rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.03)]"
    >
      <p className="font-jakarta text-[10px] font-bold uppercase tracking-[0.12em] text-ds-primary-dark">
        Send this booking to
      </p>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {DESTINATIONS.map((dest) => {
          const result = results[dest.id];
          const state = result?.state ?? "idle";
          const done = state === "success";
          const Icon = dest.icon;
          return (
            <div key={dest.id}>
              <button
                type="button"
                onClick={() => book(dest)}
                disabled={state === "loading" || done}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 font-jakarta text-sm font-semibold transition-all disabled:cursor-default",
                  done
                    ? "border-[#22A559]/35 bg-[#22A559]/[0.1] text-[#1B7E45]"
                    : "border-ds-primary/30 bg-ds-primary/[0.08] text-ds-primary-dark hover:border-ds-primary hover:bg-ds-primary/[0.14]"
                )}
              >
                {state === "loading" ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : done ? (
                  <CircleCheck className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                {done ? dest.doneLabel : dest.label}
              </button>

              {done && result?.url && (
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 flex items-center justify-center gap-1 font-jakarta text-xs text-ds-muted transition-colors hover:text-ds-primary-dark"
                >
                  View <ExternalLink className="h-3 w-3" />
                </a>
              )}

              {(state === "error" || state === "unconfigured") && (
                <p
                  className={cn(
                    "mt-1.5 flex items-start gap-1.5 rounded-lg px-2.5 py-1.5 font-jakarta text-xs",
                    state === "unconfigured"
                      ? "bg-ds-primary/[0.08] text-ds-primary-dark"
                      : "bg-red-500/[0.08] text-red-600"
                  )}
                >
                  <TriangleAlert className="mt-0.5 h-3 w-3 shrink-0" />
                  {result?.message}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
