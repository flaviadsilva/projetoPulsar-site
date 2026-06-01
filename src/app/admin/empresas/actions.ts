"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: true; id?: string } | { ok: false; error: string };

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Não autenticado." };

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (data?.role !== "admin") {
    return { ok: false as const, error: "Acesso negado." };
  }
  return { ok: true as const, supabase };
}

type EmpresaInput = {
  nome: string;
  local: string;
  duracao: string;
  data_evento: string | null;
  descricao: string | null;
};

function parseFormData(formData: FormData): EmpresaInput | { error: string } {
  const nome = String(formData.get("nome") ?? "").trim();
  const local = String(formData.get("local") ?? "").trim();
  const duracao = String(formData.get("duracao") ?? "").trim();
  const data_evento = String(formData.get("data_evento") ?? "").trim() || null;
  const descricao = String(formData.get("descricao") ?? "").trim() || null;

  if (!nome) return { error: "Informe o nome da empresa." };
  if (!local) return { error: "Informe o local." };
  if (!duracao) return { error: "Informe a duração." };

  return { nome, local, duracao, data_evento, descricao };
}

export async function createEmpresa(formData: FormData): Promise<Result> {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth;

  const parsed = parseFormData(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const { data, error } = await auth.supabase
    .from("empresas")
    .insert(parsed)
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/empresas");
  return { ok: true, id: data.id };
}

export async function updateEmpresa(
  id: string,
  formData: FormData,
): Promise<Result> {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth;

  const parsed = parseFormData(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const { error } = await auth.supabase
    .from("empresas")
    .update(parsed)
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/empresas");
  revalidatePath("/admin/cadastros");
  return { ok: true };
}

export async function deleteEmpresa(id: string): Promise<Result> {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth;

  const { count } = await auth.supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("empresa_id", id);

  if ((count ?? 0) > 0) {
    return {
      ok: false,
      error:
        "Não é possível excluir: há clientes vinculados a essa empresa. Mova-os antes.",
    };
  }

  const { error } = await auth.supabase.from("empresas").delete().eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/empresas");
  return { ok: true };
}
