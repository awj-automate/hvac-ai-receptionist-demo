"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bot,
  CalendarPlus,
  ClipboardCheck,
  Clock,
  Database,
  ListChecks,
  Moon,
  PhoneCall,
  PhoneIncoming,
  Sun,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

import { StatCounter } from "@/components/stat-counter";
import {
  ACTIVITY_FEED,
  type ActivityEvent,
  DASHBOARD_STATS,
  type DispatchJob,
  INCOMING_DISPATCH_JOBS,
  LIVE_FEED_POOL,
  SEED_DISPATCH_JOBS,
  WORKFLOW_STEPS,
} from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const STAT_ICONS = [PhoneCall, ClipboardCheck, Clock, TrendingUp];
const WORKFLOW_ICONS = [
  PhoneIncoming,
  Bot,
  Activity,
  ListChecks,
  CalendarPlus,
  Database,
];

const PRIORITY_STYLES: Record<DispatchJob["priority"], string> = {
  Emergency: "bg-red-500/15 text-red-300 border-red-500/30",
  Standard: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  Maintenance: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

/** Picks a 12-hour time string consistent with the after-hours flag. */
function randomTimeFor(afterHours: boolean): string {
  const hours24 = afterHours
    ? [0, 1, 2, 3, 4, 5, 6, 7, 21, 22, 23]
    : [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const h = hours24[Math.floor(Math.random() * hours24.length)];
  const m = Math.floor(Math.random() * 60);
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function ModeDashboard() {
  const [jobs, setJobs] = useState<DispatchJob[]>(SEED_DISPATCH_JOBS);
  const [events, setEvents] = useState<ActivityEvent[]>(ACTIVITY_FEED);

  // Feed the AI-booked jobs onto the dispatch board one at a time.
  useEffect(() => {
    const timers = INCOMING_DISPATCH_JOBS.map((job, i) =>
      setTimeout(
        () => setJobs((prev) => [job, ...prev]),
        3500 + i * 5000
      )
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Prepend a fresh activity event on a loop.
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      const template = LIVE_FEED_POOL[i % LIVE_FEED_POOL.length];
      i += 1;
      setEvents((prev) =>
        [
          { ...template, time: randomTimeFor(template.afterHours) },
          ...prev,
        ].slice(0, 14)
      );
    }, 5200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ink-800 px-3 py-1 text-xs font-medium text-white/60">
          Mode 3 · Operations dashboard
        </span>
        <h2 className="mt-3 text-2xl font-bold text-white">
          What the front office sees
        </h2>
        <p className="mt-1 text-sm text-white/50">
          Every call answered, triaged, and booked — around the clock.
        </p>
      </div>

      {/* Stat counters */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {DASHBOARD_STATS.map((stat, i) => {
          const Icon = STAT_ICONS[i];
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-ink-850/80 p-4"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-ember-700/20">
                <Icon className="h-4 w-4 text-ember-400" />
              </div>
              <div className="text-3xl font-bold text-ember-gradient">
                <StatCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-1 text-xs text-white/50">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Workflow */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-ink-850/80 p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">
          Call handling workflow
        </h3>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
          {WORKFLOW_STEPS.map((step, i) => {
            const Icon = WORKFLOW_ICONS[i];
            return (
              <div key={step.title} className="flex items-center gap-2 lg:flex-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.18 }}
                  className="flex-1 rounded-xl border border-white/10 bg-ink-900/60 p-3"
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-ember-500 to-ember-700">
                      <Icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-[11px] font-mono text-white/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {step.title}
                  </p>
                  <p className="text-xs text-white/45">{step.detail}</p>
                </motion.div>
                {i < WORKFLOW_STEPS.length - 1 && (
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-ember-500/60 lg:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispatch board + activity feed */}
      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        {/* Dispatch board */}
        <div className="rounded-2xl border border-white/10 bg-ink-850/80 p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
              ServiceTitan dispatch board
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Live
            </span>
          </div>
          <div className="space-y-2.5">
            <AnimatePresence initial={false}>
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: -12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-xl border border-white/10 bg-ink-900/60 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-white/40">
                      {job.id}
                    </span>
                    <span
                      className={cn(
                        "rounded border px-1.5 py-0.5 text-[10px] font-semibold",
                        PRIORITY_STYLES[job.priority]
                      )}
                    >
                      {job.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {job.customer} — {job.job}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-xs text-white/45">
                    <span>{job.window}</span>
                    <span
                      className={
                        job.tech === "Unassigned"
                          ? "text-ember-300"
                          : "text-white/55"
                      }
                    >
                      {job.tech}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Activity feed */}
        <div className="rounded-2xl border border-white/10 bg-ink-850/80 p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">
            24/7 activity feed
          </h3>
          <div className="scroll-thin max-h-[340px] space-y-2 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {events.map((event, i) => (
                <motion.div
                  key={`${event.time}-${event.summary}-${i}`}
                  layout
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-2.5 rounded-lg border border-white/5 bg-ink-900/60 p-2.5"
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                      event.afterHours
                        ? "bg-indigo-500/15 text-indigo-300"
                        : "bg-amber-500/15 text-amber-300"
                    )}
                  >
                    {event.afterHours ? (
                      <Moon className="h-3.5 w-3.5" />
                    ) : (
                      <Sun className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] text-white/40">
                      {event.time}
                      {event.afterHours && (
                        <span className="ml-1.5 text-indigo-300/80">
                          after hours
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-white/75">{event.summary}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
