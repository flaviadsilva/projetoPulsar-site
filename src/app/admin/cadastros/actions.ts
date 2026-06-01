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

export async function approveUser(
  targetId: string,
  empresaId: string,
): Promise<Result> {
  if (!empresaId) {
    return { ok: false, error: "Selecione uma empresa antes de aprovar." };
  }

  const auth = await ensureAdmin();
  if (!auth.ok) return auth;

  const { error } = await auth.supabase
    .from("profiles")
    .update({
      status: "approved",
      empresa_id: empresaId,
      approved_at: new Date().toISOString(),
      approved_by: auth.userId,
    })
    .eq("id", targetId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/cadastros");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateClientEmpresa(
  targetId: string,
  empresaId: string,
): Promise<Result> {
  if (!empresaId) {
    return { ok: false, error: "Selecione uma empresa." };
  }

  const auth = await ensureAdmin();
  if (!auth.ok) return auth;

  const { error } = await auth.supabase
    .from("profiles")
    .update({ empresa_id: empresaId })
    .eq("id", targetId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/cadastros");
  return { ok: true };
}

export async function rejectUser(targetId: string): Promise<Result> {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth;

  const { error } = await auth.supabase
    .from("profiles")
    .update({
      status: "rejected",
      approved_at: new Date().toISOString(),
      approved_by: auth.userId,
    })
    .eq("id", targetId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/cadastros");
  revalidatePath("/admin");
  return { ok: true };
}
