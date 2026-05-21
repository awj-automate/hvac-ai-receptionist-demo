"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck,
  CircleCheckBig,
  House,
  LoaderCircle,
  MapPin,
  MessageSquareText,
  Phone,
  RotateCcw,
  Thermometer,
  TriangleAlert,
  User,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { CallSummary as CallSummaryData } from "@/lib/types";

interface CallSummaryProps {
  summary: CallSummaryData | null;
  loading: boolean;
  onRestart: () => void;
  onHome: () => void;
  restartLabel: string;
}

type Stage = "fields" | "crm" | "sms" | "done";

/** Treats blank / unknown values as "not captured". */
function display(value: string | undefined | null): {
  text: string;
  captured: boolean;
} {
  const v = (value ?? "").trim();
  if (!v || /^(n\/?a|unknown|none|not provided)$/i.test(v)) {
    return { text: "Not captured", captured: false };
  }
  return { text: v, captured: true };
}

export function CallSummary({
  summary,
  loading,
  onRestart,
  onHome,
  restartLabel,
}: CallSummaryProps) {
  const [stage, setStage] = useState<Stage>("fields");

  useEffect(() => {
    if (loading || !summary) return;
    const t1 = setTimeout(() => setStage("crm"), 2000);
    const t2 = setTimeout(() => setStage("sms"), 3600);
    const t3 = setTimeout(() => setStage("done"), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [loading, summary]);

  if (loading || !summary) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center">
        <LoaderCircle className="h-10 w-10 animate-spin text-ember-500" />
        <p className="text-lg font-medium text-white/80">
          Analyzing the call…
        </p>
        <p className="text-sm text-white/45">
          Extracting the issue, system details, and appointment.
        </p>
      </div>
    );
  }

  const systemText = [display(summary.systemType).text, summary.systemAge]
    .filter((p) => p && display(p).captured)
    .join(" · ");

  const rows = [
    { icon: User, label: "Customer", ...display(summary.customerName) },
    { icon: Wrench, label: "Issue", ...display(summary.issue) },
    {
      icon: Thermometer,
      label: "System",
      text: systemText || "Not captured",
      captured: Boolean(systemText),
    },
    { icon: TriangleAlert, label: "Urgency", ...display(summary.urgency) },
    { icon: MapPin, label: "Address", ...display(summary.address) },
    { icon: Phone, label: "Phone", ...display(summary.phone) },
  ];

  const appointment = display(summary.appointment);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
          <CircleCheckBig className="h-7 w-7 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Call complete</h2>
        <p className="mt-1 text-sm text-white/50">
          Here&apos;s what the AI receptionist captured and actioned.
        </p>
      </motion.div>

      {/* Extracted fields */}
      <div className="mt-6 space-y-2.5">
        {rows.map((row, i) => {
          const Icon = row.icon;
          return (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.18 }}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-ink-850/80 px-4 py-3"
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ember-700/20">
                <Icon className="h-4 w-4 text-ember-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
                  {row.label}
                </p>
                <p
                  className={
                    row.captured
                      ? "text-sm text-white/90"
                      : "text-sm italic text-white/35"
                  }
                >
                  {row.text}
                </p>
              </div>
              {row.captured && (
                <CircleCheckBig className="mt-1 h-4 w-4 shrink-0 text-emerald-400/80" />
              )}
            </motion.div>
          );
        })}

        {/* Appointment — highlighted */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + rows.length * 0.18 }}
          className="flex items-start gap-3 rounded-xl border border-ember-500/40 bg-ember-700/15 px-4 py-3"
        >
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ember-600/30">
            <CalendarCheck className="h-4 w-4 text-ember-300" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ember-300/80">
              Appointment booked
            </p>
            <p className="text-sm font-semibold text-white">
              {appointment.text}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Mock CRM + tech notification */}
      <div className="mt-4 space-y-3">
        <AnimatePresence>
          {(stage === "crm" || stage === "sms" || stage === "done") && (
            <motion.div
              key="crm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-ink-850/80 p-4"
            >
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Pushed to ServiceTitan
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-3 rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-emerald-300">
                    NEW WORK ORDER
                  </span>
                  <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
                    DISPATCHED
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-white">
                  {display(summary.customerName).text} — {display(summary.issue).text}
                </p>
                <p className="text-xs text-white/50">
                  {appointment.text} · {display(summary.address).text}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(stage === "sms" || stage === "done") && (
            <motion.div
              key="sms"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-ink-850/80 p-4"
            >
              <div className="flex items-center gap-2 text-sm text-white/70">
                <MessageSquareText className="h-4 w-4 text-ember-400" />
                Technician notified
              </div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-3 max-w-[88%] rounded-2xl rounded-bl-sm bg-ink-700 p-3 text-sm text-white/85"
              >
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-white/40">
                  SMS to on-call tech
                </p>
                New job: {display(summary.customerName).text},{" "}
                {display(summary.address).text}. {display(summary.issue).text}.
                Window {appointment.text}. Reply Y to accept.
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === "done" ? 1 : 0.4 }}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <Button variant="primary" size="lg" className="flex-1" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" />
          {restartLabel}
        </Button>
        <Button variant="secondary" size="lg" className="flex-1" onClick={onHome}>
          <House className="h-4 w-4" />
          Back to demo home
        </Button>
      </motion.div>
    </div>
  );
}
