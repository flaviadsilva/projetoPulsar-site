"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Check,
  X,
  Loader2,
  Clock,
  UserCheck,
  UserX,
  Pencil,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { Profile, Empresa } from "@/lib/auth/get-profile";
import { approveUser, rejectUser, updateClientEmpresa } from "./actions";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─────────────────────────────────────────────
// KANBAN BOARD
// ─────────────────────────────────────────────

export function CadastrosKanban({
  pending,
  approved,
  rejected,
  empresas,
}: {
  pending: Profile[];
  approved: Profile[];
  rejected: Profile[];
  empresas: Empresa[];
}) {
  const empresaById = new Map(empresas.map((e) => [e.id, e]));

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* PENDING column */}
      <KanbanColumn
        icon={Clock}
        title="Aguardando"
        count={pending.length}
        tone="amber"
      >
        {pending.length === 0 ? (
          <EmptyState text="Nenhum cadastro pendente" />
        ) : (
          pending.map((profile) => (
            <PendingCard
              key={profile.id}
              profile={profile}
              empresas={empresas}
            />
          ))
        )}
      </KanbanColumn>

      {/* APPROVED column */}
      <KanbanColumn
        icon={UserCheck}
        title="Aprovados"
        count={approved.length}
        tone="emerald"
      >
        {approved.length === 0 ? (
          <EmptyState text="Nenhum cliente aprovado" />
        ) : (
          approved.map((profile) => (
            <ApprovedCard
              key={profile.id}
              profile={profile}
              empresas={empresas}
              empresaById={empresaById}
            />
          ))
        )}
      </KanbanColumn>

      {/* REJECTED column */}
      <KanbanColumn
        icon={UserX}
        title="Rejeitados"
        count={rejected.length}
        tone="destructive"
      >
        {rejected.length === 0 ? (
          <EmptyState text="Nenhum rejeitado" />
        ) : (
          rejected.map((profile) => (
            <RejectedCard key={profile.id} profile={profile} />
          ))
        )}
      </KanbanColumn>
    </div>
  );
}

// ─────────────────────────────────────────────
// COLUMN
// ─────────────────────────────────────────────

function KanbanColumn({
  icon: Icon,
  title,
  count,
  tone,
  children,
}: {
  icon: React.ElementType;
  title: string;
  count: number;
  tone: "amber" | "emerald" | "destructive";
  children: React.ReactNode;
}) {
  const accentBg =
    tone === "amber"
      ? "bg-amber-500"
      : tone === "emerald"
        ? "bg-emerald-500"
        : "bg-destructive";
  const iconTone =
    tone === "amber"
      ? "bg-amber-100 text-amber-700"
      : tone === "emerald"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-destructive/10 text-destructive";

  return (
    <div className="flex flex-col border border-border bg-muted/30">
      {/* Column header */}
      <div className="relative flex items-center justify-between gap-3 border-b border-border bg-card p-4">
        <div
          aria-hidden
          className={`absolute inset-x-0 top-0 h-0.5 ${accentBg}`}
        />
        <div className="flex items-center gap-3">
          <div
            className={`flex size-8 items-center justify-center ${iconTone}`}
          >
            <Icon className="size-4" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-[0.15em]">
            {title}
          </h2>
        </div>
        <span className="font-mono text-xs font-medium text-muted-foreground">
          {count.toString().padStart(2, "0")}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 p-3">{children}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-border bg-card/40 p-8 text-center text-xs text-muted-foreground">
      {text}
    </div>
  );
}

// ─────────────────────────────────────────────
// PENDING CARD — inline approve/reject
// ─────────────────────────────────────────────

function PendingCard({
  profile,
  empresas,
}: {
  profile: Profile;
  empresas: Empresa[];
}) {
  const [empresaId, setEmpresaId] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  function handleApprove() {
    if (!empresaId) {
      toast.error("Selecione uma empresa primeiro.");
      return;
    }
    startTransition(async () => {
      const result = await approveUser(profile.id, empresaId);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`${profile.nome.split(" ")[0]} aprovado!`);
    });
  }

  function handleReject() {
    if (!confirm(`Rejeitar cadastro de ${profile.nome || profile.email}?`)) {
      return;
    }
    startTransition(async () => {
      const result = await rejectUser(profile.id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Cadastro rejeitado.");
    });
  }

  const selectedEmp = empresas.find((e) => e.id === empresaId);

  return (
    <div className="flex flex-col gap-3 border border-border bg-card p-3 transition-colors hover:border-foreground/30">
      <div className="flex items-start gap-3">
        <Avatar nome={profile.nome || profile.email} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {profile.nome || "—"}
          </p>
          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
            <Mail className="size-3 shrink-0" />
            {profile.email}
          </p>
          {profile.telefone && (
            <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
              <Phone className="size-3 shrink-0" />
              {profile.telefone}
            </p>
          )}
          {profile.empresa && (
            <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
              <Building2 className="size-3 shrink-0" />
              {profile.empresa}
            </p>
          )}
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          {formatDate(profile.created_at)}
        </span>
      </div>

      {/* Inline approve action */}
      <div className="flex flex-col gap-2 border-t border-border pt-3">
        {empresas.length === 0 ? (
          <p className="text-xs text-amber-700">
            Nenhuma empresa cadastrada.{" "}
            <Link
              href="/admin/empresas"
              className="font-medium underline hover:no-underline"
            >
              Criar →
            </Link>
          </p>
        ) : (
          <Select
            value={empresaId}
            onValueChange={(v) => setEmpresaId(v ?? "")}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Vincular a uma turma...">
                {selectedEmp
                  ? `${selectedEmp.nome} — ${selectedEmp.local}`
                  : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {empresas.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.nome} — {emp.local}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 gap-1.5"
            disabled={isPending || !empresaId || empresas.length === 0}
            onClick={handleApprove}
          >
            {isPending ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Check className="size-3" />
            )}
            Aprovar
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={handleReject}
            aria-label="Rejeitar"
          >
            <X className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// APPROVED CARD — edit empresa link
// ─────────────────────────────────────────────

function ApprovedCard({
  profile,
  empresas,
  empresaById,
}: {
  profile: Profile;
  empresas: Empresa[];
  empresaById: Map<string, Empresa>;
}) {
  const empresaVinculada = profile.empresa_id
    ? empresaById.get(profile.empresa_id)
    : undefined;

  return (
    <div className="flex flex-col gap-2 border border-border bg-card p-3">
      <div className="flex items-start gap-3">
        <Avatar nome={profile.nome || profile.email} tone="emerald" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {profile.nome || "—"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {profile.email}
          </p>
        </div>
        <ChangeEmpresaDialog profile={profile} empresas={empresas} />
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-2">
        {empresaVinculada ? (
          <span className="inline-flex items-center gap-1.5 truncate bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
            <Building2 className="size-3" />
            {empresaVinculada.nome}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-700">
            Sem turma
          </span>
        )}
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">
          {formatDate(profile.approved_at)}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// REJECTED CARD
// ─────────────────────────────────────────────

function RejectedCard({ profile }: { profile: Profile }) {
  return (
    <div className="flex items-start gap-3 border border-border bg-card p-3 opacity-75">
      <Avatar nome={profile.nome || profile.email} tone="destructive" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{profile.nome || "—"}</p>
        <p className="truncate text-xs text-muted-foreground">
          {profile.email}
        </p>
      </div>
      <span className="font-mono text-[10px] text-muted-foreground">
        {formatDate(profile.approved_at)}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// EDIT EMPRESA DIALOG
// ─────────────────────────────────────────────

function ChangeEmpresaDialog({
  profile,
  empresas,
}: {
  profile: Profile;
  empresas: Empresa[];
}) {
  const [open, setOpen] = useState(false);
  const [empresaId, setEmpresaId] = useState<string>(profile.empresa_id ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    if (!empresaId) {
      toast.error("Selecione uma empresa.");
      return;
    }
    startTransition(async () => {
      const result = await updateClientEmpresa(profile.id, empresaId);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Turma atualizada.");
      setOpen(false);
    });
  }

  const selected = empresas.find((e) => e.id === empresaId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Trocar turma"
            className="shrink-0"
          >
            <Pencil className="size-3" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Trocar turma</DialogTitle>
          <DialogDescription>
            Vincule <strong>{profile.nome || profile.email}</strong> a uma
            empresa diferente.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label>Empresa / Turma</Label>
          <Select
            value={empresaId}
            onValueChange={(v) => setEmpresaId(v ?? "")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione...">
                {selected
                  ? `${selected.nome} — ${selected.local}`
                  : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {empresas.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.nome} — {emp.local}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button disabled={isPending || !empresaId} onClick={handleSave}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// Avatar
// ─────────────────────────────────────────────

function Avatar({
  nome,
  tone,
}: {
  nome: string;
  tone?: "emerald" | "destructive";
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-100 text-emerald-700"
      : tone === "destructive"
        ? "bg-destructive/10 text-destructive"
        : "bg-primary/10 text-primary";

  return (
    <div
      className={`flex size-9 shrink-0 items-center justify-center font-mono text-xs font-bold ${toneClass}`}
    >
      {getInitials(nome)}
    </div>
  );
}
