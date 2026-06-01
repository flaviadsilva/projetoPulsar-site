import { createClient } from "@/lib/supabase/server";

export type UserRole = "admin" | "cliente";
export type UserStatus = "pending" | "approved" | "rejected";

export type Empresa = {
  id: string;
  nome: string;
  local: string;
  duracao: string;
  data_evento: string | null;
  descricao: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  nome: string;
  email: string;
  empresa: string | null;
  telefone: string | null;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
  empresa_id: string | null;
};

export type ProfileWithEmpresa = Profile & {
  empresa_obj: Empresa | null;
};

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;

  return data as Profile;
}

export async function getProfileWithEmpresa(): Promise<ProfileWithEmpresa | null> {
  const profile = await getProfile();
  if (!profile) return null;
  if (!profile.empresa_id) return { ...profile, empresa_obj: null };

  const supabase = await createClient();
  const { data } = await supabase
    .from("empresas")
    .select("*")
    .eq("id", profile.empresa_id)
    .single();

  return { ...profile, empresa_obj: (data ?? null) as Empresa | null };
}
