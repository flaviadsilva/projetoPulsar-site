"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, error: "Não autenticado." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { ok: false as const, error: "Acesso negado." };
  }

  return { ok: true as const, supabase, userId: user.id };
}

async function moderar(
  id: string,
  status: "aprovado" | "rejeitado",
): Promise<Result> {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth;

  const { error } = await auth.supabase
    .from("feedbacks")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: auth.userId,
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/feedbacks");
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}

export async function aprovarFeedback(id: string) {
  return moderar(id, "aprovado");
}

export async function rejeitarFeedback(id: string) {
  return moderar(id, "rejeitado");
}

export async function deletarFeedback(id: string): Promise<Result> {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth;

  const { error } = await auth.supabase.from("feedbacks").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/feedbacks");
  revalidatePath("/");
  return { ok: true };
}
