import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Award,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { getProfileWithEmpresa, type Empresa } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";

function formatDateBR(iso: string | null) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function formatDateTimeBR(iso: string | null) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function PainelHome() {
  const profile = await getProfileWithEmpresa();
  if (!profile) redirect("/login");
  if (profile.status !== "approved") redirect("/painel/aguardando");

  const empresa = profile.empresa_obj;
  const firstName = (profile.nome.split(" ")[0] || profile.nome).trim();
  const supabase = await createClient();

  const [{ count: certsCount }, { count: feedbacksCount }] = await Promise.all([
    supabase
      .from("certificados_emitidos")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profile.id),
    supabase
      .from("feedbacks")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profile.id),
  ]);

  return (
    <div className="flex flex-col gap-10">
      {/* Hero header */}
      <section className="relative overflow-hidden">
        <div className="grid items-end gap-6 border-b border-border pb-8 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Painel · {new Date().getFullYear()}
            </p>
            <h1 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight md:text-5xl">
              Olá,
              <br />
              {firstName}.
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              Bem-vindo de volta ao seu painel do Projeto Pulsar.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <span className="inline-flex items-center gap-2 border border-emerald-500/30 bg-emerald-50 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Conta ativa
            </span>
            {profile.approved_at && (
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Aprovado · {formatDateTimeBR(profile.approved_at)}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Featured cards */}
      {empresa ? (
        <section className="grid gap-4 md:grid-cols-[1.2fr_1fr] lg:gap-5">
          <EmpresaCard empresa={empresa} />
          <CertificadoCard count={certsCount ?? 0} disabled={false} />
        </section>
      ) : (
        <SemEmpresaCard />
      )}

      {/* Feedback */}
      <section>
        <FeedbackCard count={feedbacksCount ?? 0} />
      </section>

      {/* Stats row */}
      <section>
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Resumo
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={CheckCircle2}
            label="Status"
            value="Conta ativa"
            tone="emerald"
          />
          <StatCard
            icon={Award}
            label="Certificados"
            value={String(certsCount ?? 0)}
          />
          <StatCard
            icon={Building2}
            label="Sua turma"
            value={empresa?.nome ?? "—"}
            truncate
          />
          <StatCard
            icon={Calendar}
            label="Membro desde"
            value={formatDateTimeBR(profile.approved_at ?? profile.created_at)}
          />
        </div>
      </section>

    </div>
  );
}

// ─────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────

function EmpresaCard({ empresa }: { empresa: Empresa }) {
  return (
    <div className="relative flex flex-col gap-5 overflow-hidden border border-border bg-card p-6 lg:p-7">
      {/* Decorative corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 size-40 rotate-45 border border-primary/15"
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex size-11 items-center justify-center bg-primary text-primary-foreground">
          <Building2 className="size-5" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Seu treinamento
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold uppercase leading-[1.05] tracking-tight md:text-3xl">
          {empresa.nome}
        </h2>
        {empresa.descricao && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {empresa.descricao}
          </p>
        )}
      </div>

      <div className="grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-3">
        <InfoRow icon={MapPin} label="Local" value={empresa.local} />
        <InfoRow icon={Clock} label="Duração" value={empresa.duracao} />
        <InfoRow
          icon={Calendar}
          label="Data"
          value={formatDateBR(empresa.data_evento)}
        />
      </div>
    </div>
  );
}

function CertificadoCard({
  count,
  disabled,
}: {
  count: number;
  disabled: boolean;
}) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden bg-foreground p-6 text-background lg:p-7">
      {/* Decorative diamonds */}
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
          <Award className="size-5" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-background/50">
          {count} emitido{count !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-background/60">
          Certificado de participação
        </p>
        <h2 className="text-2xl font-bold uppercase leading-[1.05] tracking-tight md:text-3xl">
          Emitir agora.
        </h2>
        <p className="text-sm text-background/70">
          Baixe seu certificado oficial em PDF a qualquer momento.
        </p>
      </div>

      <Link
        href="/painel/certificado"
        aria-disabled={disabled}
        className={buttonVariants({
          className:
            "mt-6 w-fit gap-2 bg-primary text-primary-foreground hover:bg-primary/90",
        })}
      >
        Acessar certificado
        <ArrowUpRight className="size-4" />
      </Link>
    </div>
  );
}

function FeedbackCard({ count }: { count: number }) {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden border border-border bg-card p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 size-32 rotate-45 border border-primary/15"
      />

      <div className="flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center bg-primary text-primary-foreground">
          <MessageSquare className="size-5" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Sua opinião importa
          </p>
          <h2 className="text-xl font-bold uppercase leading-[1.1] tracking-tight md:text-2xl">
            Deixe seu depoimento.
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Conte como foi sua experiência com o Projeto Pulsar. Após aprovação,
            seu depoimento pode aparecer no site.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:flex-col lg:items-end">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {count} envio{count !== 1 ? "s" : ""}
        </span>
        <Link
          href="/painel/feedback"
          className={buttonVariants({
            className: "gap-2 bg-primary text-primary-foreground hover:bg-primary/90",
          })}
        >
          Enviar feedback
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function SemEmpresaCard() {
  return (
    <div className="border border-amber-200 bg-amber-50/60 p-6 lg:p-8">
      <div className="flex flex-col gap-3">
        <div className="flex size-10 items-center justify-center bg-amber-200 text-amber-800">
          <Clock className="size-5" />
        </div>
        <h2 className="text-xl font-bold uppercase tracking-tight text-amber-900">
          Aguardando vinculação de turma
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-amber-900/80">
          Sua conta foi aprovada, mas você ainda não está vinculado a uma
          turma. Entre em contato com a equipe pra resolver isso.
        </p>
        <a
          href="https://wa.me/5551985140070"
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "mt-2 w-fit gap-2",
          })}
        >
          Falar no WhatsApp
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <Icon className="size-3" />
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  truncate,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone?: "emerald";
  truncate?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 border border-border bg-card p-4">
      <div
        className={
          "flex size-10 shrink-0 items-center justify-center " +
          (tone === "emerald"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-primary/10 text-primary")
        }
      >
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </p>
        <p
          className={
            "mt-0.5 text-sm font-semibold text-foreground " +
            (truncate ? "truncate" : "")
          }
        >
          {value}
        </p>
      </div>
    </div>
  );
}

