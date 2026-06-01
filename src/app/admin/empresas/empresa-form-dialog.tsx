"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { createEmpresa, updateEmpresa } from "./actions";
import type { Empresa } from "@/lib/auth/get-profile";

type Props = {
  mode: "create" | "edit";
  empresa?: Empresa;
};

export function EmpresaFormDialog({ mode, empresa }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createEmpresa(form)
          : await updateEmpresa(empresa!.id, form);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(
        mode === "create" ? "Empresa criada." : "Empresa atualizada.",
      );
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          mode === "create" ? (
            <Button>
              <Plus className="size-4" />
              Nova empresa
            </Button>
          ) : (
            <Button variant="ghost" size="icon-sm" aria-label="Editar">
              <Pencil className="size-4" />
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nova empresa" : "Editar empresa"}
          </DialogTitle>
          <DialogDescription>
            Dados da turma/treinamento. Esses valores aparecem no certificado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nome">Nome da empresa / turma</Label>
            <Input
              id="nome"
              name="nome"
              required
              defaultValue={empresa?.nome ?? ""}
              placeholder="Ex: Hospital Centenário"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="local">Local</Label>
              <Input
                id="local"
                name="local"
                required
                defaultValue={empresa?.local ?? ""}
                placeholder="Ex: Porto Alegre, RS"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="duracao">Duração</Label>
              <Input
                id="duracao"
                name="duracao"
                required
                defaultValue={empresa?.duracao ?? ""}
                placeholder="Ex: 4 horas"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Data do evento</Label>
            <DatePicker
              name="data_evento"
              defaultValue={empresa?.data_evento ?? ""}
              placeholder="Selecione a data do treinamento"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              name="descricao"
              rows={3}
              defaultValue={empresa?.descricao ?? ""}
              placeholder="Resumo da vivência, palestra ou treinamento"
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {mode === "create" ? "Criar" : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
