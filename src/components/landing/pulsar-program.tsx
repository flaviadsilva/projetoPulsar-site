"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Check, ArrowUpRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { pulsarBullets, WHATSAPP_SIMPLE } from "@/data/landing";

export function PulsarProgram() {
  return (
    <section id="programas" className="py-16 lg:py-20">
      <div className="container-page">
        {/* Framed card with corner brackets */}
        <div className="relative mx-auto max-w-5xl px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <CornerBrackets />

          {/* Content grid */}
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left — text content */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-5"
            >
              <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                <Sparkles className="size-3 text-primary" />
                Exclusivo · Programa autoral
              </p>

              <h2 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight md:text-5xl lg:text-[58px]">
                O Projeto
                <br />
                Pulsar
              </h2>

              <p className="max-w-md text-sm leading-relaxed text-foreground/75 md:text-base">
                Um programa inovador para transformar a dinâmica de equipes
                através do autoconhecimento, da comunicação consciente e da
                saúde emocional aplicada ao trabalho.
              </p>

              <ul className="mt-2 flex flex-col gap-2.5">
                {pulsarBullets.map((bullet, i) => (
                  <motion.li
                    key={bullet}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                    className="flex items-start gap-2.5 text-sm text-foreground/85"
                  >
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center bg-primary text-primary-foreground">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {bullet}
                  </motion.li>
                ))}
              </ul>

              <a
                href={WHATSAPP_SIMPLE}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  size: "lg",
                  className: "mt-4 w-fit gap-2",
                })}
              >
                Solicitar Proposta
                <ArrowUpRight className="size-4" />
              </a>
            </motion.div>

            {/* Right — Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col items-center justify-center gap-5"
            >
              <div className="relative aspect-square w-full max-w-[320px]">
                <Image
                  src="/img/logo.png"
                  alt="Projeto Pulsar"
                  fill
                  sizes="(min-width: 1024px) 320px, 280px"
                  className="object-contain"
                />
              </div>

              {/* Small caption below logo */}
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="h-px w-12 bg-foreground/30" />
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Pulsar · Juliana Freitas
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CornerBrackets() {
  const corners = [
    { className: "-left-2 -top-2 border-l-[1.5px] border-t-[1.5px]", delay: 0.1 },
    { className: "-right-2 -top-2 border-r-[1.5px] border-t-[1.5px]", delay: 0.15 },
    { className: "-bottom-2 -left-2 border-b-[1.5px] border-l-[1.5px]", delay: 0.2 },
    { className: "-bottom-2 -right-2 border-b-[1.5px] border-r-[1.5px]", delay: 0.25 },
  ];

  return (
    <>
      {corners.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, delay: c.delay, ease: "easeOut" }}
          className={`pointer-events-none absolute size-8 border-foreground/70 ${c.className}`}
          aria-hidden
        />
      ))}
    </>
  );
}
