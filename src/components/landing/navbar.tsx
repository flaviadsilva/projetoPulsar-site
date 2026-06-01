"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight, LogIn } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { navLinks, WHATSAPP_URL } from "@/data/landing";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="#inicio" className="flex items-center gap-3">
          <Image
            src="/img/logo.png"
            alt="Projeto Pulsar"
            width={48}
            height={48}
            className="object-contain"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground">
              Projeto
            </span>
            <span className="text-lg font-bold tracking-tight">Pulsar</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <ul className="flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group relative text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/75 transition-colors hover:text-foreground"
                >
                  {link.label}
                  <span
                    aria-hidden
                    className="absolute -bottom-1.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4 border-l border-border pl-6">
            <Link
              href="/login"
              aria-label="Área do cliente"
              title="Área do cliente"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogIn className="size-3.5" />
              Acessar
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ className: "gap-1.5" })}
            >
              Agendar
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Abrir menu"
                className="lg:hidden"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            }
          />
          <SheetContent side="right" className="w-72 p-5">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <nav className="mt-10 flex flex-col">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between border-b border-border py-3 text-xs font-medium uppercase tracking-[0.18em] text-foreground/75 transition-colors hover:text-foreground"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </span>
                  <ArrowUpRight className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex items-center justify-center gap-1.5 border border-border py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:bg-foreground hover:text-background"
              >
                <LogIn className="size-3.5" />
                Área do cliente
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className={buttonVariants({ className: "mt-2 gap-1.5" })}
              >
                Agendar
                <ArrowUpRight className="size-3.5" />
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
