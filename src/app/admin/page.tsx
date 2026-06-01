import Link from "next/link";
import {
  Clock,
  Users,
  UserCheck,
  UserX,
  Building2,
  Award,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/get-profile";
import { buttonVariants } from "@/components/ui/button";

async function fetchCounts() {
  const supabase = await createClient();

  const [pending, approved, rejected, total, empresas, certificados] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending")
        .eq("role", "cliente"),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved")
        .eq("role", "cliente"),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("status", "rejected")
        .eq("role", "cliente"),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "cliente"),
      supabase.from("empresas").select("id", { count: "exact", head: true }),
      supabase
        .from("certificados_emitidos")
        .select("id", { count: "exact", head: true }),
    ]);

  return {
    pending: pending.count ?? 0,
    approved: approved.count ?? 0,
    rejected: rejected.count ?? 0,
    total: total.count ?? 0,
    empresas: empresas.count ?? 0,
    certificados: certificados.count ?? 0,
  };
}

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

export default async function AdminDashboard() {
  const [profile, counts] = await Promise.all([getProfile(), fetchCounts()]);
  const firstName = profile
    ? (profile.nome.split(" ")[0] || profile.nome).trim()
    : "Admin";

  return (
    <div className="flex flex-col gap-10">
      {/* Hero header */}
      <section>
        <div className="grid items-end gap-6 border-b border-border pb-8 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Admin · Painel
            </p>
            <h1 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight md:text-5xl">
              Olá,
              <br />
              {firstName}.
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              Visão geral do Projeto Pulsar — cadastros, empresas e
              certificados.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <span className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
              <ShieldCheck className="size-3" />
              Administrador
            </span>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Acesso · {formatDateTimeBR(new Date().toISOString())}
            </p>
          </div>
        </div>
      </section>

      {/* Featured row: highlight pending + quick action */}
      <section className="grid gap-4 md:grid-cols-[1.2fr_1fr] lg:gap-5">
        <PendingCard count={counts.pending} />
        <QuickActionsCard
          empresasCount={counts.empresas}
          certsCount={counts.certificados}
        />
      </section>

      {/* Stats grid */}
      <section>
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Métricas
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Clock}
            label="Pendentes"
            value={String(counts.pending)}
            tone="amber"
            href="/admin/cadastros"
          />
          <StatCard
            icon={UserCheck}
            label="Aprovados"
            value={String(counts.approved)}
            tone="emerald"
          />
          <StatCard
            icon={UserX}
            label="Rejeitados"
            value={String(counts.rejected)}
            tone="destructive"
          />
          <StatCard
            icon={Users}
            label="Total de clientes"
            value={String(counts.total)}
          />
          <StatCard
            icon={Building2}
            label="Empresas / Turmas"
            value={String(counts.empresas)}
            href="/admin/empresas"
          />
          <StatCard
            icon={Award}
            label="Certificados emitidos"
            value={String(counts.certificados)}
          />
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────

function PendingCard({ count }: { count: number }) {
  if (count === 0) {
    return (
      <div className="relative flex flex-col gap-4 overflow-hidden border border-border bg-card p-6 lg:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 size-40 rotate-45 border border-emerald-500/15"
        />
        <div className="flex items-start justify-between">
          <div className="flex size-11 items-center justify-center bg-emerald-100 text-emerald-700">
            <UserCheck className="size-5" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Tudo em dia
          </span>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          <h2 className="text-2xl font-bold uppercase leading-[1.05] tracking-tight md:text-3xl">
            Sem pendências.
          </h2>
          <p className="text-sm text-muted-foreground">
            Nenhum cadastro aguardando aprovação no momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-foreground p-6 text-background lg:p-7">
      {/* Decoração */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 size-24 rotate-45 border border-primary/30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-4 -right-4 size-12 rotate-45 bg-primary/15"
      />

      <div className="flex items-start justify-between">
        <div className="flex size-11 items-center justify-center bg-primary text-primary-foreground">
          <Clock className="size-5" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-background/50">
          {count} novo{count !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-background/60">
          Cadastros aguardando aprovação
        </p>
        <h2 className="text-2xl font-bold uppercase leading-[1.05] tracking-tight md:text-3xl">
          {count} cadastro{count !== 1 ? "s" : ""}
          <br />
          pendente{count !== 1 ? "s" : ""}.
        </h2>
        <p className="text-sm text-background/70">
          Aprove ou rejeite pra liberar o acesso aos clientes.
        </p>
      </div>

      <Link
        href="/admin/cadastros"
        className={buttonVariants({
          className:
            "mt-6 w-fit gap-2 bg-primary text-primary-foreground hover:bg-primary/90",
        })}
      >
        Revisar cadastros
        <ArrowUpRight className="size-4" />
      </Link>
    </div>
  );
}

function QuickActionsCard({
  empresasCount,
  certsCount,
}: {
  empresasCount: number;
  certsCount: number;
}) {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden border border-border bg-card p-6 lg:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 size-32 rotate-45 border border-primary/15"
      />

      <div className="flex items-start justify-between">
        <div className="flex size-11 items-center justify-center bg-primary text-primary-foreground">
          <Building2 className="size-5" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Atalhos
        </span>
      </div>

      <h2 className="mt-2 text-xl font-bold uppercase leading-[1.05] tracking-tight md:text-2xl">
        Gerencie o programa.
      </h2>

      <div className="mt-2 flex flex-col gap-2">
        <ActionLink
          href="/admin/empresas"
          label="Empresas & turmas"
          meta={`${empresasCount} cadastrada${empresasCount !== 1 ? "s" : ""}`}
        />
        <ActionLink
          href="/admin/cadastros"
          label="Clientes & aprovações"
          meta="Aprovar · Vincular"
        />
        <ActionLink
          href="/admin/cadastros"
          label="Certificados"
          meta={`${certsCount} emitido${certsCount !== 1 ? "s" : ""}`}
        />
      </div>
    </div>
  );
}

function ActionLink({
  href,
  label,
  meta,
}: {
  href: string;
  label: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between border-b border-border py-2.5 text-sm font-medium transition-colors hover:text-primary"
    >
      <div className="flex flex-col gap-0.5">
        <span>{label}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {meta}
        </span>
      </div>
      <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
    </Link>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone?: "emerald" | "amber" | "destructive";
  href?: string;
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-100 text-emerald-700"
      : tone === "amber"
        ? "bg-amber-100 text-amber-700"
        : tone === "destructive"
          ? "bg-destructive/10 text-destructive"
          : "bg-primary/10 text-primary";

  const content = (
    <div
      className={
        "flex items-center gap-4 border border-border bg-card p-4 transition-colors " +
        (href ? "hover:border-primary/40" : "")
      }
    >
      <div
        className={
          "flex size-10 shrink-0 items-center justify-center " + toneClass
        }
      >
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-2xl font-bold text-foreground">{value}</p>
      </div>
      {href && (
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
      )}
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
