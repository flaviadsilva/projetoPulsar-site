"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { enviarFeedback } from "./actions";

export function FeedbackForm() {
  const [nota, setNota] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (nota !== null) form.set("nota", String(nota));

    startTransition(async () => {
      const result = await enviarFeedback(form);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Feedback enviado! Vamos revisar em breve.");
      setMensagem("");
      setNota(null);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>Sua nota (opcional)</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNota(nota === n ? null : n)}
              aria-label={`Nota ${n}`}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={
                  "size-7 " +
                  (nota !== null && n <= nota
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/40")
                }
              />
            </button>
          ))}
          {nota !== null && (
            <button
              type="button"
              onClick={() => setNota(null)}
              className="ml-2 text-xs text-muted-foreground underline hover:text-foreground"
            >
              limpar
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="mensagem">Sua mensagem</Label>
        <Textarea
          id="mensagem"
          name="mensagem"
          required
          rows={6}
          minLength={10}
          maxLength={1000}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Conte como foi sua experiência com o Projeto Pulsar…"
        />
        <p className="text-right font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {mensagem.length} / 1000
        </p>
      </div>

      <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        Seu feedback passa por uma revisão antes de aparecer no site. Você pode
        acompanhar o status abaixo.
      </div>

      <Button type="submit" disabled={isPending} className="w-fit gap-2">
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        Enviar feedback
      </Button>
    </form>
  );
}
