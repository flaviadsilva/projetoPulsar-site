"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

export type PublicFeedback = {
  id: string;
  nome: string;
  empresa: string | null;
  mensagem: string;
  nota: number | null;
};

export function FeedbacksCarousel({ items }: { items: PublicFeedback[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items.length]);

  function scrollBy(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.9;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  }

  return (
    <section className="py-16 lg:py-20">
      <div className="container-page">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 grid gap-8 border-b border-border pb-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-12"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Casos Reais
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              O que dizem sobre o Pulsar
            </h2>
          </div>
          <div className="flex flex-col items-start gap-5">
            <p className="text-sm leading-relaxed text-foreground/70 md:text-base">
              Depoimentos de participantes que vivenciaram o Projeto Pulsar em
              suas equipes e instituições.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                disabled={!canPrev}
                aria-label="Anterior"
                className="flex size-9 items-center justify-center border border-border bg-background transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                disabled={!canNext}
                aria-label="Próximo"
                className="flex size-9 items-center justify-center border border-border bg-background transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Carousel */}
        {items.length === 0 ? (
          <div className="border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Em breve, depoimentos de participantes aparecerão aqui.
            </p>
          </div>
        ) : (
        <div className="relative">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((f, i) => (
              <article
                key={f.id}
                data-card
                className="flex w-[85%] shrink-0 snap-start flex-col justify-between gap-5 border border-border bg-card p-6 sm:w-[420px] md:p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-9 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                    <Quote className="size-4" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(items.length).padStart(2, "0")}
                  </span>
                </div>

                {f.nota !== null && (
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star
                        key={k}
                        className={
                          "size-3.5 " +
                          (k < (f.nota ?? 0)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30")
                        }
                      />
                    ))}
                  </div>
                )}

                <p className="text-sm leading-relaxed text-foreground/85 md:text-[15px]">
                  “{f.mensagem}”
                </p>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-semibold uppercase tracking-tight">
                    {f.nome}
                  </p>
                  {f.empresa && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {f.empresa}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
