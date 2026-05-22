"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck,
  CircleCheckBig,
  House,
  LoaderCircle,
  MapPin,
  Phone,
  RotateCcw,
  Thermometer,
  TriangleAlert,
  User,
  Wrench,
} from "lucide-react";

import { BookingDestinations } from "@/components/booking-destinations";
import { Button } from "@/components/ui/button";
import type { CallSummary as CallSummaryData } from "@/lib/types";

interface CallSummaryProps {
  summary: CallSummaryData | null;
  loading: boolean;
  onRestart: () => void;
  onHome: () => void;
  restartLabel: string;
}

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
          Here&apos;s what the AI receptionist captured — book it anywhere below.
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
              transition={{ delay: 0.15 + i * 0.16 }}
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
          transition={{ delay: 0.15 + rows.length * 0.16 }}
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

      {/* Real booking actions */}
      <BookingDestinations summary={summary} />

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
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
