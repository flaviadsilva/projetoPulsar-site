"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmpresaFormDialog } from "./empresa-form-dialog";
import { deleteEmpresa } from "./actions";
import type { Empresa } from "@/lib/auth/get-profile";

type EmpresaWithCount = Empresa & { count: number };

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function EmpresasTable({ empresas }: { empresas: EmpresaWithCount[] }) {
  if (empresas.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Nenhuma empresa cadastrada. Crie a primeira clicando em &quot;Nova
        empresa&quot;.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden md:table-cell">Local</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead className="hidden lg:table-cell">Data</TableHead>
            <TableHead>Alunos</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {empresas.map((emp) => (
            <Row key={emp.id} empresa={emp} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Row({ empresa }: { empresa: EmpresaWithCount }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (
      !confirm(
        `Excluir a empresa "${empresa.nome}"? Esta ação não pode ser desfeita.`,
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await deleteEmpresa(empresa.id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Empresa excluída.");
    });
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{empresa.nome}</TableCell>
      <TableCell className="hidden text-muted-foreground md:table-cell">
        {empresa.local}
      </TableCell>
      <TableCell className="text-muted-foreground">{empresa.duracao}</TableCell>
      <TableCell className="hidden text-muted-foreground lg:table-cell">
        {formatDate(empresa.data_evento)}
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{empresa.count}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <EmpresaFormDialog mode="edit" empresa={empresa} />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Excluir"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
