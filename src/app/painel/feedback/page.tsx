import { redirect } from "next/navigation";
import { MessageSquare, Star, Clock, CheckCircle2, XCircle } from "lucide-react";
import { getProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { FeedbackForm } from "./feedback-form";

type FeedbackRow = {
  id: string;
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

export default async function FeedbackPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (profile.status !== "approved") redirect("/painel/aguardando");

  const supabase = await createClient();
  const { data } = await supabase
    .from("feedbacks")
    .select("id, mensagem, nota, status, created_at, reviewed_at")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });

  const meus = (data ?? []) as FeedbackRow[];

  return (
    <div className="flex flex-col gap-10">
      <header>
        <div className="grid items-end gap-6 border-b border-border pb-8 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Painel · Feedback
            </p>
            <h1 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight md:text-5xl">
              Seu depoimento.
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              Compartilhe sua experiência. Após aprovação, seu depoimento poderá
              aparecer no site do Projeto Pulsar.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="border border-border bg-card p-6 lg:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center bg-primary text-primary-foreground">
              <MessageSquare className="size-5" />
            </div>
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Novo feedback
            </h2>
          </div>
          <FeedbackForm />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Meus envios ({meus.length})
          </p>
          {meus.length === 0 ? (
            <div className="border border-dashed border-border p-6 text-sm text-muted-foreground">
              Você ainda não enviou nenhum feedback.
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {meus.map((f) => (
                <li key={f.id} className="border border-border bg-card p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <StatusBadge status={f.status} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {formatDateTimeBR(f.created_at)}
                    </span>
                  </div>
                  {f.nota !== null && (
                    <div className="mb-2 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            "size-3.5 " +
                            (i < (f.nota ?? 0)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30")
                          }
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {f.mensagem}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: FeedbackRow["status"] }) {
  const cfg = {
    pendente: {
      icon: Clock,
      label: "Em revisão",
      cls: "border-amber-300/50 bg-amber-50 text-amber-800",
    },
    aprovado: {
      icon: CheckCircle2,
      label: "Aprovado",
      cls: "border-emerald-300/50 bg-emerald-50 text-emerald-800",
    },
    rejeitado: {
      icon: XCircle,
      label: "Rejeitado",
      cls: "border-destructive/30 bg-destructive/10 text-destructive",
    },
  }[status];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] ${cfg.cls}`}
    >
      <Icon className="size-3" />
      {cfg.label}
    </span>
  );
}
