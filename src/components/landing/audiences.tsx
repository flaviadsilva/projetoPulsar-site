"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { audiences } from "@/data/landing";
import { buttonVariants } from "@/components/ui/button";

export function Audiences() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="publicos" className="py-16 lg:py-20">
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
              Públicos
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Onde o Pulsar atua
            </h2>
          </div>
          <div className="flex flex-col items-start gap-5">
            <p className="text-sm leading-relaxed text-foreground/70 md:text-base">
              O Projeto Pulsar atua em ambientes onde pessoas cuidam de
              pessoas, trabalham com pessoas e lideram pessoas — fortalecendo
              relações, comunicação e bem-estar emocional.
            </p>
            <a
              href="#processo"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Como funciona
              <ArrowUpRight className="size-3" />
            </a>
          </div>
        </motion.div>

        {/* Mobile: stacked cards */}
        <div className="flex flex-col gap-2 md:hidden">
          {audiences.map((a, i) => (
            <MobileCard key={a.title} audience={a} index={i} />
          ))}
        </div>

        {/* Desktop: horizontal accordion */}
        <div
          className="hidden h-[460px] gap-1 md:flex"
          onMouseLeave={() => setActiveIndex(0)}
        >
          {audiences.map((a, i) => (
            <Strip
              key={a.title}
              audience={a}
              index={i}
              isActive={i === activeIndex}
              onHover={() => setActiveIndex(i)}
              total={audiences.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type Audience = (typeof audiences)[number];

function Strip({
  audience,
  index,
  isActive,
  onHover,
  total,
}: {
  audience: Audience;
  index: number;
  isActive: boolean;
  onHover: () => void;
  total: number;
}) {
  const Icon = audience.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={onHover}
      style={{
        flex: isActive ? "3 1 0%" : "1 1 0%",
        transitionProperty: "flex",
        transitionDuration: "500ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className="group relative cursor-pointer overflow-hidden bg-primary text-primary-foreground"
      data-active={isActive}
    >
      {/* Inner border accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 border border-primary-foreground/10"
      />

      {/* Collapsed state */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-between p-5 transition-opacity duration-200"
        style={{
          opacity: isActive ? 0 : 1,
          pointerEvents: isActive ? "none" : "auto",
        }}
      >
        {/* Icon at top — well visible */}
        <div className="flex size-11 items-center justify-center border border-primary-foreground/30">
          <Icon className="size-5" />
        </div>

        {/* Vertical title in the middle */}
        <p
          className="whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em]"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          {audience.title}
        </p>

        {/* Number at bottom */}
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-foreground/50">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Expanded state */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-8 transition-opacity duration-500"
        style={{
          opacity: isActive ? 1 : 0,
          pointerEvents: isActive ? "auto" : "none",
          transitionDelay: isActive ? "200ms" : "0ms",
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex size-12 items-center justify-center bg-primary-foreground text-primary">
            <Icon className="size-6" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary-foreground/50">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-bold uppercase leading-[1.05] tracking-tight">
            {audience.title}
          </h3>
          <p className="max-w-md text-sm leading-relaxed text-primary-foreground/80">
            {audience.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function MobileCard({
  audience,
  index,
}: {
  audience: Audience;
  index: number;
}) {
  const Icon = audience.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="flex gap-4 bg-primary p-5 text-primary-foreground"
    >
      <div className="flex size-10 shrink-0 items-center justify-center bg-primary-foreground text-primary">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold uppercase tracking-tight">
            {audience.title}
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-foreground/50">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-primary-foreground/80">
          {audience.description}
        </p>
      </div>
    </motion.div>
  );
}
