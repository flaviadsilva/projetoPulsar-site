"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "../actions";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signIn(form);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Entrando…");
      const redirectTo = params.get("redirect") ?? "/painel";
      router.replace(redirectTo);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Acesso
        </p>
        <h1 className="text-3xl font-bold leading-[1.05] tracking-tight md:text-4xl">
          Bem-vindo
          <br />
          de volta.
        </h1>
        <p className="text-sm text-muted-foreground">
          Acesse seu painel pra acompanhar o programa.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            placeholder="seu@email.com"
            autoComplete="email"
            required
            className="h-11"
          />
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
            placeholder="••••••••"
            autoComplete="current-password"
            required
            minLength={6}
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
          Entrar
          <ArrowRight className="size-4" />
        </Button>
      </form>

      {/* Signup link */}
      <div className="flex items-center justify-between border-t border-border pt-6 text-sm">
        <p className="text-muted-foreground">Ainda não tem cadastro?</p>
        <Link
          href="/cadastro"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          Criar conta
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}
