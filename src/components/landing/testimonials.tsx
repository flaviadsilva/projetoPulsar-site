"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Play, ImageIcon, Quote } from "lucide-react";
import { testimonials } from "@/data/landing";

type Item = (typeof testimonials)[number];

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-16 lg:py-20">
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
              Na Prática
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Histórias reais
            </h2>
          </div>
          <div className="flex flex-col items-start gap-5">
            <p className="text-sm leading-relaxed text-foreground/70 md:text-base">
              O Projeto Pulsar já vem sendo aplicado em contextos reais —
              fortalecendo relações, comunicação e saúde emocional em ambientes
              de alta demanda humana.
            </p>
            <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Quote className="size-3" /> 2 relatos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Play className="size-3" /> 2 vídeos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ImageIcon className="size-3" /> 2 fotos
              </span>
            </div>
          </div>
        </motion.div>

        {/* Gallery — 3-col grid, portrait items */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3">
          {testimonials.map((item, i) => (
            <GalleryCell key={i} item={item} index={i} total={testimonials.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryCell({
  item,
  index,
  total,
}: {
  item: Item;
  index: number;
  total: number;
}) {
  const indexLabel = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  const colInRow = index % 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: colInRow * 0.08 }}
      className="group relative aspect-video overflow-hidden bg-muted"
    >
      {item.type === "text" && (
        <div className="relative flex h-full flex-col justify-between bg-primary p-4 text-primary-foreground md:p-5">
          <div className="flex items-start justify-between">
            <div className="flex size-8 items-center justify-center border border-primary-foreground/30">
              <Quote className="size-3.5" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary-foreground/50">
              {indexLabel}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary-foreground/60">
              Relato
            </p>
            <h3 className="text-base font-bold uppercase leading-[1.1] tracking-tight md:text-lg">
              {item.title}
            </h3>
            <p className="line-clamp-3 text-[11px] leading-snug text-primary-foreground/85 md:text-xs">
              {item.body}
            </p>
          </div>
        </div>
      )}

      {item.type === "video" && (
        <>
          <video
            controls
            preload="metadata"
            playsInline
            className="h-full w-full bg-foreground object-cover"
          >
            <source src={item.src} type="video/mp4" />
          </video>
          {/* Top corner badge */}
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5 bg-foreground/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-background backdrop-blur-sm">
            <Play className="size-3" /> Vídeo
          </div>
          <div className="pointer-events-none absolute right-4 top-4 bg-background/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground backdrop-blur-sm">
            {indexLabel}
          </div>
        </>
      )}

      {item.type === "image" && (
        <>
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Bottom gradient + caption */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent p-5">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-background">
              {item.alt}
            </p>
          </div>
          {/* Top corner badge */}
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5 bg-foreground/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-background backdrop-blur-sm">
            <ImageIcon className="size-3" /> Foto
          </div>
          <div className="pointer-events-none absolute right-4 top-4 bg-background/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground backdrop-blur-sm">
            {indexLabel}
          </div>
        </>
      )}
    </motion.div>
  );
}
