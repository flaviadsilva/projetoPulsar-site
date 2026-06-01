"use client";

import { motion } from "motion/react";
import { ArrowDown, Search, Layers, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { processSteps } from "@/data/landing";

const STEP_ICONS: LucideIcon[] = [Search, Layers, Rocket];

export function Process() {
  return (
    <section id="processo" className="py-16 lg:py-20">
      <div className="container-page">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 grid gap-8 border-b border-border pb-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-12"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Como Funciona
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Nossa metodologia
            </h2>
          </div>
          <div className="flex flex-col items-start gap-5">
            <p className="text-sm leading-relaxed text-foreground/70 md:text-base">
              Cada vivência é construída a partir da realidade da sua equipe.
              Três passos que partem da escuta e desembocam em transformação
              concreta no cotidiano.
            </p>
          </div>
        </motion.div>

        {/* Mobile: simple vertical timeline */}
        <div className="flex flex-col gap-4 md:hidden">
          {processSteps.map((step, i) => (
            <MobileStep key={step.number} step={step} index={i} />
          ))}
        </div>

        {/* Desktop: tree/branch structure */}
        <div className="hidden md:block">
          {/* Root node */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="mx-auto flex w-fit items-center gap-3 bg-foreground px-5 py-2.5 text-background"
          >
            <span className="size-1.5 bg-primary" />
            <p className="text-[11px] font-medium uppercase tracking-[0.22em]">
              Metodologia Pulsar
            </p>
            <ArrowDown className="size-3" />
          </motion.div>

          {/* Branch structure */}
          <div className="relative mt-0 h-20">
            {/* Vertical from root */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4 }}
              style={{ transformOrigin: "top" }}
              className="absolute left-1/2 top-0 h-10 w-px -translate-x-1/2 bg-foreground/30"
            />
            {/* Horizontal connecting branches */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ transformOrigin: "center" }}
              className="absolute left-[16.67%] right-[16.67%] top-10 h-px bg-foreground/30"
            />
            {/* 3 verticals dropping to each card */}
            {[16.67, 50, 83.33].map((pos, i) => (
              <motion.div
                key={pos}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
                style={{
                  transformOrigin: "top",
                  left: `${pos}%`,
                }}
                className="absolute top-10 h-10 w-px -translate-x-1/2 bg-foreground/30"
              />
            ))}
            {/* Dots at junction with cards */}
            {[16.67, 50, 83.33].map((pos, i) => (
              <motion.div
                key={`dot-${pos}`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.3, delay: 0.85 + i * 0.08 }}
                style={{ left: `${pos}%` }}
                className="absolute bottom-0 size-2.5 -translate-x-1/2 translate-y-1/2 rotate-45 bg-primary"
              />
            ))}
          </div>

          {/* 3 cards */}
          <div className="grid grid-cols-3 gap-4 lg:gap-6">
            {processSteps.map((step, i) => (
              <DesktopCard
                key={step.number}
                step={step}
                index={i}
                Icon={STEP_ICONS[i]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type Step = (typeof processSteps)[number];

function DesktopCard({
  step,
  index,
  Icon,
}: {
  step: Step;
  index: number;
  Icon: LucideIcon;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
      className="group relative flex flex-col gap-4 border border-border bg-background p-6 transition-colors hover:border-primary/60"
    >
      {/* Top: number + icon */}
      <div className="flex items-start justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Passo {step.number}
        </span>
        <div className="flex size-10 items-center justify-center bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-5" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold uppercase leading-tight tracking-tight md:text-2xl">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-foreground/70">
        {step.description}
      </p>

      {/* Bottom accent line */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full"
      />
    </motion.div>
  );
}

function MobileStep({ step, index }: { step: Step; index: number }) {
  const Icon = STEP_ICONS[index];
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative flex gap-4"
    >
      {/* Left rail: number + connecting line */}
      <div className="relative flex flex-col items-center">
        <div className="flex size-10 shrink-0 items-center justify-center bg-primary text-primary-foreground">
          <Icon className="size-5" />
        </div>
        {index < processSteps.length - 1 && (
          <div className="mt-2 flex-1 w-px bg-border" />
        )}
      </div>

      {/* Right content */}
      <div className="flex-1 pb-2">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Passo {step.number}
        </span>
        <h3 className="mt-1 text-lg font-bold uppercase tracking-tight">
          {step.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/70">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}
