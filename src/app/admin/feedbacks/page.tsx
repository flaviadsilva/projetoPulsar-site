import { createClient } from "@/lib/supabase/server";
import { FeedbackCard, type FeedbackItem } from "./feedback-card";

async function fetchByStatus(status: FeedbackItem["status"]) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("feedbacks")
    .select(
      "id, nome_snapshot, empresa_snapshot, mensagem, nota, status, created_at, reviewed_at",
    )
    .eq("status", status)
    .order("created_at", { ascending: false });
  return (data ?? []) as FeedbackItem[];
}

export default async function AdminFeedbacksPage() {
  const [pendentes, aprovados, rejeitados] = await Promise.all([
    fetchByStatus("pendente"),
    fetchByStatus("aprovado"),
    fetchByStatus("rejeitado"),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <header>
        <div className="grid items-end gap-6 border-b border-border pb-8 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Admin · Feedbacks
            </p>
            <h1 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight md:text-5xl">
              Depoimentos.
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              Modere os depoimentos enviados pelos clientes. Apenas os aprovados
              aparecem no site.
            </p>
          </div>
          <div className="flex gap-2">
            <CountBadge label="Pendentes" value={pendentes.length} tone="amber" />
            <CountBadge
              label="Aprovados"
              value={aprovados.length}
              tone="emerald"
            />
            <CountBadge
              label="Rejeitados"
              value={rejeitados.length}
              tone="destructive"
            />
          </div>
        </div>
      </header>

      <Column title="Pendentes" items={pendentes} emptyMsg="Nenhum feedback aguardando moderação." />
      <Column title="Aprovados" items={aprovados} emptyMsg="Nenhum feedback aprovado ainda." />
      <Column title="Rejeitados" items={rejeitados} emptyMsg="Nenhum feedback rejeitado." />
    </div>
  );
}

function Column({
  title,
  items,
  emptyMsg,
}: {
  title: string;
  items: FeedbackItem[];
  emptyMsg: string;
}) {
  return (
    <section>
      <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        {title} ({items.length})
      </h2>
      {items.length === 0 ? (
        <div className="border border-dashed border-border p-6 text-sm text-muted-foreground">
          {emptyMsg}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <FeedbackCard key={f.id} item={f} />
          ))}
        </div>
      )}
    </section>
  );
}

function CountBadge({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "amber" | "emerald" | "destructive";
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-300/50 bg-amber-50 text-amber-800"
      : tone === "emerald"
        ? "border-emerald-300/50 bg-emerald-50 text-emerald-800"
        : "border-destructive/30 bg-destructive/10 text-destructive";
  return (
    <div className={`flex flex-col items-center border px-3 py-2 ${toneClass}`}>
      <span className="text-2xl font-bold leading-none">{value}</span>
      <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] opacity-80">
        {label}
      </span>
    </div>
  );
}
