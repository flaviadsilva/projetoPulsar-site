"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { aboutInfoBoxes } from "@/data/landing";

export function About() {
  return (
    <section id="sobre" className="py-16 lg:py-20">
      <div className="container-page">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 border-b border-border pb-5"
        >
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Sobre mim
          </p>
        </motion.div>

        {/* Main 3-column grid */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)_minmax(0,0.8fr)] lg:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-muted ring-1 ring-foreground/10"
          >
            <Image
              src="/img/JU.jpeg"
              alt="Juliana Freitas no escritório"
              fill
              sizes="(min-width: 1024px) 28vw, 100vw"
              className="object-cover"
            />
          </motion.div>

          {/* Body text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-5 text-sm leading-relaxed text-foreground/75 md:text-[15px]"
          >
            <p className="text-base font-semibold text-foreground md:text-lg">
              Uma jornada de transformação humana.
            </p>
            <p>
              Sou Juliana Freitas, psicoterapeuta e facilitadora de
              desenvolvimento humano. Minha trajetória nasceu da escuta
              profunda das relações humanas e da convicção de que saúde
              emocional, comunicação e consciência transformam pessoas,
              equipes e ambientes.
            </p>
            <p>
              Ao longo da minha prática, desenvolvi uma abordagem que integra
              acolhimento, percepção relacional e processos de transformação
              aplicados à vida pessoal e profissional.
            </p>
            <p>
              Sou a criadora do{" "}
              <strong className="font-semibold text-foreground">
                Projeto PULSAR
              </strong>
              , uma iniciativa voltada ao fortalecimento das relações, da
              comunicação e do bem-estar emocional em equipes, empresas e
              contextos institucionais.
            </p>
          </motion.div>

          {/* Right — pull quote */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col gap-5"
          >
            <div className="flex size-9 items-center justify-center bg-primary/15 text-primary">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
                aria-hidden
              >
                <path d="M9 7H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v3a2 2 0 0 1-2 2H4v2h1a4 4 0 0 0 4-4V7Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v3a2 2 0 0 1-2 2h-1v2h1a4 4 0 0 0 4-4V7Z" />
              </svg>
            </div>
            <p className="text-base font-semibold leading-snug text-foreground md:text-lg">
              Cuidar de quem cuida.{" "}
              <span className="font-normal text-muted-foreground">
                Trazer escuta, presença e qualificação relacional para
                ambientes de alta entrega humana.
              </span>
            </p>
            <div className="mt-2 flex flex-col gap-1 border-l-2 border-primary/60 pl-4">
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Atuação
              </span>
              <span className="text-sm text-foreground/80">
                Saúde · Educação · Setor público · Empresas · Terceiro setor
              </span>
            </div>
          </motion.div>
        </div>

        {/* Info boxes — outline cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 grid gap-3 sm:grid-cols-3"
        >
          {aboutInfoBoxes.map((box) => (
            <div
              key={box.label}
              className="flex items-center gap-4 rounded-sm border border-border bg-background p-5 transition-colors hover:border-primary/50"
            >
              <div className="flex size-10 shrink-0 items-center justify-center bg-primary/10 text-primary">
                <box.icon className="size-5" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {box.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
