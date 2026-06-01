import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  children: React.ReactNode;
  sideEyebrow: string;
  sideTitle: React.ReactNode;
  sideSubtitle: string;
};

export function AuthShell({
  children,
  sideEyebrow,
  sideTitle,
  sideSubtitle,
}: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      {/* Left — form panel */}
      <div className="flex flex-col bg-background">
        {/* Top — brand + back link */}
        <header className="flex h-16 items-center justify-between px-6 sm:px-10">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/img/logo.png"
              alt="Projeto Pulsar"
              width={36}
              height={36}
              className="object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground">
                Projeto
              </span>
              <span className="text-base font-bold tracking-tight">
                Pulsar
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3" />
            Voltar ao site
          </Link>
        </header>

        {/* Center — form */}
        <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>

      {/* Right — marketing/decorative panel (desktop only) */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:p-16">
        {/* Decorative geometric elements */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 size-[28rem] rotate-45 border border-primary-foreground/12"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-48 -left-48 size-[32rem] rotate-45 border border-primary-foreground/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-20 top-1/3 size-12 rotate-45 bg-primary-foreground/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-32 bottom-32 size-3 rotate-45 bg-primary-foreground"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-1/3 top-24 size-2 rotate-45 bg-primary-foreground/50"
        />

        {/* Top — eyebrow tag */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="size-1.5 rotate-45 bg-primary-foreground" />
          <p className="text-[11px] font-medium uppercase tracking-[0.22em]">
            {sideEyebrow}
          </p>
        </div>

        {/* Center — marketing message */}
        <div className="relative z-10 flex max-w-lg flex-col gap-5">
          <h2 className="text-4xl font-bold uppercase leading-[1.02] tracking-tight md:text-5xl">
            {sideTitle}
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-primary-foreground/85 md:text-base">
            {sideSubtitle}
          </p>
        </div>

        {/* Bottom — small footer */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.22em] text-primary-foreground/70">
          <span>Bem-estar emocional</span>
          <span>Juliana Freitas · 2026</span>
        </div>
      </div>
    </div>
  );
}
