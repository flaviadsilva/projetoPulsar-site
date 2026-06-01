"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Instagram, Facebook, ArrowUpRight } from "lucide-react";

const heroNav = [
  { href: "#sobre", label: "Sobre" },
  { href: "#publicos", label: "Públicos" },
  { href: "#processo", label: "Como Funciona" },
  { href: "#depoimentos", label: "Na Prática" },
  { href: "#programas", label: "Projeto Pulsar" },
];

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden py-12 lg:py-16"
    >
      <div className="container-page grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-20">
        {/* LEFT — Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col"
        >
          <h1 className="text-[44px] font-bold leading-[1] tracking-tight text-foreground md:text-[56px] lg:text-[64px]">
            Juliana Freitas
          </h1>

          <p className="mt-4 max-w-md text-base font-medium text-primary">
            Psicoterapeuta · Facilitadora de desenvolvimento humano
          </p>

          <div className="mt-8 flex max-w-md flex-col gap-4 text-sm leading-relaxed text-foreground/75 md:text-[15px]">
            <p>
              Transformo relações, comunicação e bem-estar em equipes que cuidam
              de pessoas. Minha prática integra escuta, percepção relacional e
              processos aplicados ao cotidiano profissional.
            </p>
            <p className="italic">
              Porque saúde emocional também é produtividade.
            </p>
          </div>

          {/* Vertical nav */}
          <nav className="mt-10 flex flex-col">
            <div className="border-t border-border" />
            {heroNav.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between border-b border-border py-3 text-sm font-medium uppercase tracking-[0.12em] transition-colors hover:bg-foreground hover:text-background"
              >
                <div className="flex items-center gap-4 pl-1">
                  <span className="font-mono text-xs text-muted-foreground group-hover:text-background/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item.label}</span>
                </div>
                <ArrowUpRight className="mr-1 size-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-background" />
              </a>
            ))}
          </nav>

          {/* Socials */}
          <div className="mt-auto flex items-center gap-2 pt-10">
            <a
              href="https://www.instagram.com/jufreitas.essencia/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex size-10 items-center justify-center rounded-md border border-border text-foreground/70 transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="https://www.facebook.com/juh.jf"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex size-10 items-center justify-center rounded-md border border-border text-foreground/70 transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
            >
              <Facebook className="size-4" />
            </a>
            <a
              href="https://www.tiktok.com/@jufreitas.essencia"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="flex size-10 items-center justify-center rounded-md border border-border text-foreground/70 transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
            >
              <TikTokIcon className="size-4" />
            </a>
          </div>
        </motion.div>

        {/* RIGHT — Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-md lg:ml-auto lg:max-w-lg"
        >
          {/* Offset accent frame */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden translate-x-4 translate-y-4 rounded-sm border border-foreground/20 sm:block"
          />

          {/* Photo container */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-muted ring-1 ring-foreground/10">
            <Image
              src="/img/Perfil.jpeg"
              alt="Juliana Freitas — Psicoterapeuta e Facilitadora"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.6a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.03Z" />
    </svg>
  );
}
