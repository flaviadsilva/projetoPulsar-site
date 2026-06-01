"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateCertCode } from "@/lib/certificates/codigo";

type Result =
  | { ok: true; codigo: string }
  | { ok: false; error: string };

export async function emitirCertificado(): Promise<Result> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Não autenticado." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nome, status, empresa_id")
    .eq("id", user.id)
    .single();

  if (!profile) return { ok: false, error: "Perfil não encontrado." };
  if (profile.status !== "approved") {
    return { ok: false, error: "Sua conta ainda não foi aprovada." };
  }
  if (!profile.empresa_id) {
    return { ok: false, error: "Você ainda não está vinculado a uma turma." };
  }

  const { data: empresa } = await supabase
    .from("empresas")
    .select("id, nome, local, duracao, data_evento")
    .eq("id", profile.empresa_id)
    .single();

  if (!empresa) {
    return { ok: false, error: "Empresa vinculada não encontrada." };
  }

  let codigo = "";
  for (let i = 0; i < 5; i++) {
    const candidate = generateCertCode();
    const { data: existing } = await supabase
      .from("certificados_emitidos")
      .select("id")
      .eq("codigo", candidate)
      .maybeSingle();
    if (!existing) {
      codigo = candidate;
      break;
    }
  }

  if (!codigo) {
    return { ok: false, error: "Não foi possível gerar código único." };
  }

  const { error } = await supabase.from("certificados_emitidos").insert({
    codigo,
    profile_id: profile.id,
    empresa_id: empresa.id,
    nome_aluno_snapshot: profile.nome,
    nome_empresa_snapshot: empresa.nome,
    local_snapshot: empresa.local,
    duracao_snapshot: empresa.duracao,
    data_evento_snapshot: empresa.data_evento,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/painel/certificado");
  return { ok: true, codigo };
}
