"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

export async function enviarFeedback(formData: FormData): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Não autenticado." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, empresa, status")
    .eq("id", user.id)
    .single();

  if (!profile) return { ok: false, error: "Perfil não encontrado." };
  if (profile.status !== "approved") {
    return { ok: false, error: "Sua conta ainda não foi aprovada." };
  }

  const mensagem = String(formData.get("mensagem") ?? "").trim();
  const notaRaw = String(formData.get("nota") ?? "").trim();
  const nota = notaRaw ? Number(notaRaw) : null;

  if (mensagem.length < 10) {
    return { ok: false, error: "Escreva ao menos 10 caracteres." };
  }
  if (mensagem.length > 1000) {
    return { ok: false, error: "Máximo de 1000 caracteres." };
  }
  if (nota !== null && (Number.isNaN(nota) || nota < 1 || nota > 5)) {
    return { ok: false, error: "Nota inválida." };
  }

  const { error } = await supabase.from("feedbacks").insert({
    profile_id: user.id,
    nome_snapshot: profile.nome,
    empresa_snapshot: profile.empresa,
    mensagem,
    nota,
    status: "pendente",
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/painel/feedback");
  revalidatePath("/admin/feedbacks");
  revalidatePath("/admin");
  return { ok: true };
}
