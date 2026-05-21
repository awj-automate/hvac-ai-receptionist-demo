"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CirclePlay,
  Flame,
  LayoutDashboard,
  Mic,
} from "lucide-react";
import { useState } from "react";

import { AirflowBackground } from "@/components/airflow-background";
import { MobileNotice } from "@/components/mobile-notice";
import { ModeDashboard } from "@/components/mode-dashboard";
import { ModeLiveCall } from "@/components/mode-live-call";
import { ModeSampleCall } from "@/components/mode-sample-call";
import { Button } from "@/components/ui/button";
import type { DemoMode } from "@/lib/types";

interface DemoAppProps {
  retellConfigured: boolean;
}

export function DemoApp({ retellConfigured }: DemoAppProps) {
  const [mode, setMode] = useState<DemoMode>("home");

  const goHome = () => setMode("home");

  const modeCards = [
    {
      id: "live" as const,
      number: "01",
      title: "Live Inbound Call",
      description:
        "Pick up the phone yourself — talk to the AI receptionist live in your browser and watch it triage your problem.",
      icon: Mic,
      badge: retellConfigured ? "Uses your microphone" : "Setup required",
    },
    {
      id: "sample" as const,
      number: "02",
      title: "Sample Call Playback",
      description:
        'Hear a recorded "AC not cooling" call, from first ring to a booked same-day service appointment.',
      icon: CirclePlay,
      badge: "~90-second listen",
    },
    {
      id: "dashboard" as const,
      number: "03",
      title: "Operations Dashboard",
      description:
        "The owner's view: calls answered, jobs booked, and a live 24/7 dispatch board updating in real time.",
      icon: LayoutDashboard,
      badge: "Always-on",
    },
  ];

  return (
    <>
      <AirflowBackground />
      <div className="relative mx-auto min-h-screen w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        {/* Brand bar — shown in mode views with a back button */}
        <AnimatePresence mode="wait">
          {mode !== "home" && (
            <motion.div
              key="bar"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-ember-500 to-ember-700">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-white">
                    Apex Heating &amp; Air
                  </p>
                  <p className="text-xs text-white/45">AI Receptionist Demo</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={goHome}>
                <ArrowLeft className="h-4 w-4" />
                Back to demo home
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {mode === "home" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <MobileNotice />

              {/* Hero */}
              <div className="mx-auto max-w-3xl pt-6 text-center sm:pt-12">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ember-500/25 bg-ember-700/10 px-3.5 py-1.5">
                  <Flame className="h-3.5 w-3.5 text-ember-400" />
                  <span className="text-xs font-medium text-ember-200">
                    Apex Heating &amp; Air · AI Receptionist
                  </span>
                </div>
                <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl">
                  Hear the AI Receptionist Answer a{" "}
                  <span className="text-ember-gradient">Real HVAC Call</span>
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-balance text-base text-white/55 sm:text-lg">
                  This is what your prospects experience when they call your
                  business. Click below to try it yourself.
                </p>
              </div>

              {/* Mode cards */}
              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {modeCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <motion.button
                      key={card.id}
                      type="button"
                      onClick={() => setMode(card.id)}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.12 }}
                      whileHover={{ y: -6 }}
                      className="group relative flex flex-col rounded-2xl border border-white/10 bg-ink-850/80 p-6 text-left backdrop-blur-sm transition-colors hover:border-ember-500/40 hover:shadow-ember"
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-ember-500 to-ember-700 shadow-ember">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-mono text-3xl font-bold text-white/10 transition-colors group-hover:text-ember-500/30">
                          {card.number}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-white/50">
                        {card.description}
                      </p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="rounded-full border border-white/10 bg-ink-800 px-2.5 py-1 text-[11px] font-medium text-white/55">
                          {card.badge}
                        </span>
                        <span className="flex items-center gap-1 text-sm font-semibold text-ember-400">
                          Open
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <p className="mt-12 text-center text-xs text-white/30">
                Voice AI powered by Retell · A DataStaq AI demo
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {mode === "live" && (
                <ModeLiveCall
                  retellConfigured={retellConfigured}
                  onHome={goHome}
                />
              )}
              {mode === "sample" && <ModeSampleCall onHome={goHome} />}
              {mode === "dashboard" && <ModeDashboard />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
