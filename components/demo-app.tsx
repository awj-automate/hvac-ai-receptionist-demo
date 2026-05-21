"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CirclePlay, LayoutDashboard, Mic } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { AirflowBackground } from "@/components/airflow-background";
import { MobileNotice } from "@/components/mobile-notice";
import { ModeDashboard } from "@/components/mode-dashboard";
import { ModeLiveCall } from "@/components/mode-live-call";
import { ModeSampleCall } from "@/components/mode-sample-call";
import { Button } from "@/components/ui/button";
import type { DemoMode } from "@/lib/types";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface DemoAppProps {
  retellConfigured: boolean;
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt="DataStaq AI"
        width={34}
        height={34}
        className="h-8 w-8 object-contain"
        style={{ filter: "brightness(0)" }}
        priority
      />
      <span className="font-jakarta text-lg font-extrabold tracking-heading text-ds-heading">
        DataStaq<span className="gradient-text">AI</span>
      </span>
    </div>
  );
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
      <div className="relative mx-auto min-h-screen w-full max-w-content px-5 py-7 sm:px-8 sm:py-10">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between">
          <Brand />
          <AnimatePresence mode="wait">
            {mode === "home" ? (
              <motion.span
                key="tag"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden font-jakarta text-sm font-medium text-ds-muted sm:block"
              >
                HVAC AI Receptionist · Live Demo
              </motion.span>
            ) : (
              <motion.div
                key="back"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                <Button variant="ghost" size="sm" onClick={goHome}>
                  <ArrowLeft className="h-4 w-4" />
                  Back to demo home
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="sub-title mx-auto mb-6"
                >
                  <span className="sub-title-dot" />
                  AI Receptionist · Apex Heating &amp; Air
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                  className="font-jakarta text-[2.6rem] font-extrabold leading-[1.06] tracking-heading-tight text-ds-heading sm:text-6xl"
                >
                  Hear the AI Receptionist Answer a{" "}
                  <span className="gradient-text-flow">Real HVAC Call</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
                  className="mx-auto mt-5 max-w-xl font-jakarta text-base tracking-body-tight text-ds-muted sm:text-lg"
                >
                  This is what your prospects experience when they call your
                  business. Click below to try it yourself.
                </motion.p>
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
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4 }}
                      transition={{ delay: 0.35 + i * 0.12, ease: EASE }}
                      className="card group relative flex flex-col overflow-hidden p-6 text-left"
                    >
                      {/* Faint background number */}
                      <span className="pointer-events-none absolute -bottom-6 right-3 select-none font-jakarta text-[120px] font-bold leading-none text-ds-surface">
                        {card.number}
                      </span>

                      <div className="relative z-10 flex flex-1 flex-col">
                        <div className="icon-box mb-5">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-jakarta text-lg font-bold tracking-heading text-ds-heading">
                          {card.title}
                        </h3>
                        <p className="mt-1.5 flex-1 font-jakarta text-sm leading-relaxed text-ds-muted">
                          {card.description}
                        </p>
                        <div className="mt-5 flex items-center justify-between">
                          <span className="rounded-full border border-ds-primary/20 bg-ds-primary/[0.08] px-2.5 py-1 font-jakarta text-[11px] font-semibold text-ds-primary-dark">
                            {card.badge}
                          </span>
                          <span className="flex items-center gap-1 font-jakarta text-sm font-bold text-ds-primary-dark">
                            Open
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-12 flex flex-col items-center gap-3">
                <div className="section-divider max-w-xs" />
                <p className="font-jakarta text-xs text-ds-subtle">
                  Voice AI powered by Retell · A DataStaq AI demo
                </p>
              </div>
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
