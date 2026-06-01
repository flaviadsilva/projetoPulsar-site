import { createClient } from "@/lib/supabase/server";
import type { Profile, Empresa } from "@/lib/auth/get-profile";
import { CadastrosKanban } from "./cadastros-table";

async function fetchCadastros(status: "pending" | "approved" | "rejected") {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "cliente")
    .eq("status", status)
    .order("created_at", { ascending: false });

  return (data ?? []) as Profile[];
}

async function fetchEmpresas() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("empresas")
    .select("*")
    .order("nome", { ascending: true });
  return (data ?? []) as Empresa[];
}

export default async function CadastrosPage() {
  const [pending, approved, rejected, empresas] = await Promise.all([
    fetchCadastros("pending"),
    fetchCadastros("approved"),
    fetchCadastros("rejected"),
    fetchEmpresas(),
  ]);

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header>
        <div className="grid items-end gap-6 border-b border-border pb-8 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Admin · Cadastros
            </p>
            <h1 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight md:text-5xl">
              Cadastros.
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              Aprove ou rejeite cadastros direto no card. Vincule a uma turma
              no momento da aprovação.
            </p>
          </div>
          <div className="flex gap-2">
            <CountBadge label="Pendentes" value={pending.length} tone="amber" />
            <CountBadge
              label="Aprovados"
              value={approved.length}
              tone="emerald"
            />
            <CountBadge
              label="Rejeitados"
              value={rejected.length}
              tone="destructive"
            />
          </div>
        </div>
      </header>

      {/* Kanban board */}
      <CadastrosKanban
        pending={pending}
        approved={approved}
        rejected={rejected}
        empresas={empresas}
      />
    </div>
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
    <div
      className={`flex flex-col items-center border px-3 py-2 ${toneClass}`}
    >
      <span className="text-2xl font-bold leading-none">{value}</span>
      <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] opacity-80">
        {label}
      </span>
    </div>
  );
}
