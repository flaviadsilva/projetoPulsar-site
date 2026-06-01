import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NOME = process.env.ADMIN_NOME ?? "Administrador";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "✖ Variáveis obrigatórias ausentes. Confira NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL e ADMIN_PASSWORD em .env.local",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log(`→ Criando admin: ${ADMIN_EMAIL}`);

  const { data: existing } = await supabase
    .from("profiles")
    .select("id, role, status, email")
    .eq("email", ADMIN_EMAIL)
    .maybeSingle();

  if (existing) {
    console.log(`⚠ Usuário já existe (id ${existing.id}). Atualizando role/status…`);
    const { error } = await supabase
      .from("profiles")
      .update({
        role: "admin",
        status: "approved",
        nome: ADMIN_NOME,
        approved_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) {
      console.error("✖ Erro ao atualizar profile:", error.message);
      process.exit(1);
    }
    console.log("✔ Profile atualizado pra admin/approved.");
    return;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { nome: ADMIN_NOME },
  });

  if (error || !data.user) {
    console.error("✖ Erro ao criar admin no Auth:", error?.message);
    process.exit(1);
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      role: "admin",
      status: "approved",
      nome: ADMIN_NOME,
      approved_at: new Date().toISOString(),
    })
    .eq("id", data.user.id);

  if (profileError) {
    console.error("✖ Erro ao atualizar profile:", profileError.message);
    process.exit(1);
  }

  console.log(`✔ Admin criado: ${ADMIN_EMAIL} (id ${data.user.id})`);
}

main().catch((err) => {
  console.error("✖ Erro inesperado:", err);
  process.exit(1);
});
