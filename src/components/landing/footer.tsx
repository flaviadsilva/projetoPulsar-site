import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, ArrowUpRight, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { WHATSAPP_URL, WHATSAPP_SIMPLE } from "@/data/landing";

const footerNav = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#publicos", label: "Públicos" },
  { href: "#depoimentos", label: "Na Prática" },
  { href: "#processo", label: "Como Funciona" },
  { href: "#programas", label: "Projeto Pulsar" },
  { href: "/login", label: "Área do Cliente" },
];

export function Footer() {
  return (
    <footer id="contato" className="bg-[#0a0a0c] text-background">
      {/* Top — wordmark + CTA */}
      <div className="container-page border-b border-background/10 py-12 lg:py-16">
        <div className="grid items-end gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-background/50">
              Contato
            </p>
            <h2 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight text-background md:text-5xl lg:text-6xl">
              Vamos
              <br />
              Conversar?
            </h2>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({
              size: "lg",
              className: "gap-2 self-end",
            })}
          >
            <MessageCircle className="size-4" />
            Falar no WhatsApp
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>

      {/* Middle — 3 columns */}
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link href="#inicio" className="flex items-center gap-3">
            <Image
              src="/img/logo.png"
              alt="Projeto Pulsar"
              width={40}
              height={40}
              className="object-contain"
              style={{ filter: "invert(1) hue-rotate(180deg)" }}
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-light tracking-wider text-background/50">
                Projeto
              </span>
              <span className="text-lg font-bold text-background">Pulsar</span>
            </div>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-background/65">
            Transformando relações, comunicação e bem-estar. Porque saúde
            emocional também é produtividade.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-background/50">
            Navegação
          </p>
          <ul className="flex flex-col gap-2.5">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-1.5 text-sm text-background/75 transition-colors hover:text-primary"
                >
                  {item.label}
                  <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social + contact */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-background/50">
            Redes sociais
          </p>
          <div className="flex items-center gap-2">
            <SocialLink
              href="https://www.instagram.com/jufreitas.essencia/"
              label="Instagram"
            >
              <Instagram className="size-4" />
            </SocialLink>
            <SocialLink
              href="https://www.facebook.com/juh.jf"
              label="Facebook"
            >
              <Facebook className="size-4" />
            </SocialLink>
            <SocialLink
              href="https://www.tiktok.com/@jufreitas.essencia"
              label="TikTok"
            >
              <TikTokIcon className="size-4" />
            </SocialLink>
          </div>

          <div className="mt-2 flex flex-col gap-1.5 border-l-2 border-primary pl-4">
            <span className="text-[10px] uppercase tracking-[0.22em] text-background/50">
              WhatsApp
            </span>
            <a
              href={WHATSAPP_SIMPLE}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-background transition-colors hover:text-primary"
            >
              (51) 98514-0070
            </a>
          </div>
        </div>
      </div>

      {/* Bottom — copyright */}
      <div className="border-t border-background/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-background/55 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Juliana Freitas — Projeto Pulsar.
          </p>
          <p className="font-mono uppercase tracking-[0.22em]">
            Criação: Flávia Silva · Apoio{" "}
            <a
              href="https://db.app.br/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-primary"
            >
              db.app
            </a>{" "}
            · Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex size-10 items-center justify-center border border-background/20 text-background/70 transition-colors hover:border-background hover:bg-background hover:text-foreground"
    >
      {children}
    </a>
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
