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

const SUCCESS = "#22A559";

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
        <LoaderCircle className="h-10 w-10 animate-spin text-ds-primary" />
        <p className="font-jakarta text-lg font-semibold text-ds-heading">
          Analyzing the call…
        </p>
        <p className="font-jakarta text-sm text-ds-muted">
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
        <div
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: `${SUCCESS}1F` }}
        >
          <CircleCheckBig className="h-7 w-7" style={{ color: SUCCESS }} />
        </div>
        <h2 className="font-jakarta text-2xl font-extrabold tracking-heading text-ds-heading">
          Call complete
        </h2>
        <p className="mt-1 font-jakarta text-sm text-ds-muted">
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
              className="flex items-start gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 py-3 shadow-[0_1px_8px_rgba(0,0,0,0.03)]"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ds-primary/[0.12]">
                <Icon className="h-4 w-4 text-ds-primary-dark" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-jakarta text-[10px] font-bold uppercase tracking-[0.12em] text-ds-primary-dark">
                  {row.label}
                </p>
                <p
                  className={
                    row.captured
                      ? "font-jakarta text-sm text-ds-heading"
                      : "font-jakarta text-sm italic text-ds-subtle"
                  }
                >
                  {row.text}
                </p>
              </div>
              {row.captured && (
                <CircleCheckBig
                  className="mt-1 h-4 w-4 shrink-0"
                  style={{ color: SUCCESS }}
                />
              )}
            </motion.div>
          );
        })}

        {/* Appointment — highlighted */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + rows.length * 0.18 }}
          className="flex items-start gap-3 rounded-2xl border border-ds-primary/35 bg-ds-primary/[0.1] px-4 py-3"
        >
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ds-primary/25">
            <CalendarCheck className="h-4 w-4 text-ds-primary-dark" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-jakarta text-[10px] font-bold uppercase tracking-[0.12em] text-ds-primary-dark">
              Appointment booked
            </p>
            <p className="font-jakarta text-sm font-bold text-ds-heading">
              {appointment.text}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Mock CRM + tech notification */}
      <div className="mt-3 space-y-3">
        <AnimatePresence>
          {(stage === "crm" || stage === "sms" || stage === "done") && (
            <motion.div
              key="crm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-center gap-2 font-jakarta text-sm font-semibold text-ds-text">
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ background: SUCCESS }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ background: SUCCESS }}
                  />
                </span>
                Pushed to ServiceTitan
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-3 rounded-xl border p-3"
                style={{
                  borderColor: `${SUCCESS}40`,
                  background: `${SUCCESS}0D`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-xs font-semibold"
                    style={{ color: "#1B7E45" }}
                  >
                    NEW WORK ORDER
                  </span>
                  <span
                    className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
                    style={{ background: `${SUCCESS}26`, color: "#1B7E45" }}
                  >
                    DISPATCHED
                  </span>
                </div>
                <p className="mt-1.5 font-jakarta text-sm font-bold text-ds-heading">
                  {display(summary.customerName).text} —{" "}
                  {display(summary.issue).text}
                </p>
                <p className="font-jakarta text-xs text-ds-muted">
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
              className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-center gap-2 font-jakarta text-sm font-semibold text-ds-text">
                <MessageSquareText className="h-4 w-4 text-ds-primary-dark" />
                Technician notified
              </div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-3 max-w-[88%] rounded-2xl rounded-bl-sm border border-black/[0.06] bg-ds-surface p-3 font-jakarta text-sm text-ds-text"
              >
                <p className="mb-1 font-jakarta text-[10px] font-bold uppercase tracking-[0.12em] text-ds-primary-dark">
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
        animate={{ opacity: stage === "done" ? 1 : 0.45 }}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={onRestart}
        >
          <RotateCcw className="h-4 w-4" />
          {restartLabel}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={onHome}
        >
          <House className="h-4 w-4" />
          Back to demo home
        </Button>
      </motion.div>
    </div>
  );
}
