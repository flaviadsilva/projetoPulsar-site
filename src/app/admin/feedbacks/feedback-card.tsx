"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Check, X, Trash2, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  aprovarFeedback,
  rejeitarFeedback,
  deletarFeedback,
} from "./actions";

export type FeedbackItem = {
  id: string;
  nome_snapshot: string;
  empresa_snapshot: string | null;
  mensagem: string;
  nota: number | null;
  status: "pendente" | "aprovado" | "rejeitado";
  created_at: string;
  reviewed_at: string | null;
};

function formatDateTimeBR(iso: string | null) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function FeedbackCard({ item }: { item: FeedbackItem }) {
  const [isPending, startTransition] = useTransition();

  function run(
    action: () => Promise<{ ok: true } | { ok: false; error: string }>,
    successMsg: string,
  ) {
    startTransition(async () => {
      const r = await action();
      if (!r.ok) toast.error(r.error);
      else toast.success(successMsg);
    });
  }

  return (
    <div className="flex flex-col gap-3 border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{item.nome_snapshot}</p>
          {item.empresa_snapshot && (
            <p className="truncate text-xs text-muted-foreground">
              {item.empresa_snapshot}
            </p>
          )}
        </div>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {formatDateTimeBR(item.created_at)}
        </span>
      </div>

      {item.nota !== null && (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={
                "size-3.5 " +
                (i < (item.nota ?? 0)
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30")
              }
            />
          ))}
        </div>
      )}

      <p className="text-sm leading-relaxed text-foreground/90">
        {item.mensagem}
      </p>

      <div className="mt-1 flex flex-wrap gap-2 border-t border-border pt-3">
        {item.status !== "aprovado" && (
          <Button
            size="sm"
            disabled={isPending}
            onClick={() =>
              run(() => aprovarFeedback(item.id), "Feedback aprovado.")
            }
            className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Check className="size-3.5" />
            )}
            Aprovar
          </Button>
        )}
        {item.status !== "rejeitado" && (
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() =>
              run(() => rejeitarFeedback(item.id), "Feedback rejeitado.")
            }
            className="gap-1.5"
          >
            <X className="size-3.5" />
            Rejeitar
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          disabled={isPending}
          onClick={() => {
            if (!confirm("Excluir este feedback permanentemente?")) return;
            run(() => deletarFeedback(item.id), "Feedback excluído.");
          }}
          className="ml-auto gap-1.5 text-destructive hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
          Excluir
        </Button>
      </div>
    </div>
  );
}
