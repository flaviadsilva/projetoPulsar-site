import { createClient } from "@/lib/supabase/server";
import type { Empresa } from "@/lib/auth/get-profile";
import { EmpresasTable } from "./empresas-table";
import { EmpresaFormDialog } from "./empresa-form-dialog";

export default async function EmpresasPage() {
  const supabase = await createClient();

  const { data: empresas } = await supabase
    .from("empresas")
    .select("*")
    .order("data_evento", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const { data: counts } = await supabase
    .from("profiles")
    .select("empresa_id")
    .eq("role", "cliente")
    .not("empresa_id", "is", null);

  const countByEmpresa = new Map<string, number>();
  for (const row of counts ?? []) {
    if (row.empresa_id) {
      countByEmpresa.set(
        row.empresa_id,
        (countByEmpresa.get(row.empresa_id) ?? 0) + 1,
      );
    }
  }

  const empresasWithCount = (empresas ?? []).map((e) => ({
    ...(e as Empresa),
    count: countByEmpresa.get(e.id) ?? 0,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold md:text-4xl">
            Empresas
          </h1>
          <p className="mt-2 text-muted-foreground">
            Cadastre as turmas/treinamentos. Cada empresa pode ter vários
            clientes vinculados.
          </p>
        </div>
        <EmpresaFormDialog mode="create" />
      </div>

      <EmpresasTable empresas={empresasWithCount} />
    </div>
  );
}
