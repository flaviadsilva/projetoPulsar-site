"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "../actions";
import { maskPhone } from "@/lib/masks";

export function SignupForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [telefone, setTelefone] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signUp(form);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(
        "Cadastro realizado! Faça login para acompanhar a aprovação.",
      );
      router.replace("/login");
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Cadastro
        </p>
        <h1 className="text-3xl font-bold leading-[1.05] tracking-tight md:text-4xl">
          Criar
          <br />
          sua conta.
        </h1>
        <p className="text-sm text-muted-foreground">
          Após o cadastro, sua conta passará por aprovação do administrador.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="nome"
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/80"
          >
            Nome completo
          </Label>
          <Input
            id="nome"
            name="nome"
            required
            placeholder="Seu nome"
            className="h-11"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="email"
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/80"
          >
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="seu@email.com"
            className="h-11"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="empresa"
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/80"
            >
              Empresa
            </Label>
            <Input
              id="empresa"
              name="empresa"
              placeholder="Opcional"
              className="h-11"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="telefone"
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/80"
            >
              Telefone
            </Label>
            <Input
              id="telefone"
              name="telefone"
              type="tel"
              placeholder="(51) 98514-0070"
              value={telefone}
              onChange={(e) => setTelefone(maskPhone(e.target.value))}
              maxLength={15}
              className="h-11"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="password"
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/80"
          >
            Senha
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            className="h-11"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-3 h-11 gap-2"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : null}
          Criar conta
          <ArrowRight className="size-4" />
        </Button>
      </form>

      {/* Login link */}
      <div className="flex items-center justify-between border-t border-border pt-6 text-sm">
        <p className="text-muted-foreground">Já tem cadastro?</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-3" />
          Entrar
        </Link>
      </div>
    </div>
  );
}
