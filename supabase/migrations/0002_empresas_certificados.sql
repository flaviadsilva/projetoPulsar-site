-- =========================================
-- PROJETO PULSAR — Empresas (turmas) + Certificados
-- =========================================

-- =========================================
-- TABELA EMPRESAS (turmas/treinamentos)
-- =========================================
create table public.empresas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  local text not null,
  duracao text not null,            -- ex: "4 horas", "12 horas", "2 dias"
  data_evento date,                 -- quando aconteceu (vai no certificado)
  descricao text,
  created_at timestamptz not null default now()
);

create index empresas_data_evento_idx on public.empresas (data_evento desc);

-- =========================================
-- VÍNCULO no profile (1 cliente -> 1 empresa)
-- =========================================
alter table public.profiles
  add column empresa_id uuid references public.empresas(id) on delete set null;

create index profiles_empresa_id_idx on public.profiles (empresa_id);

-- =========================================
-- CERTIFICADOS EMITIDOS
-- =========================================
create table public.certificados_emitidos (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,                 -- ex: PULSAR-2026-A1B2C3
  profile_id uuid not null references public.profiles(id) on delete cascade,
  empresa_id uuid not null references public.empresas(id) on delete restrict,
  -- snapshots: caso profile/empresa mude depois, certificado mantém os dados originais
  nome_aluno_snapshot text not null,
  nome_empresa_snapshot text not null,
  local_snapshot text not null,
  duracao_snapshot text not null,
  data_evento_snapshot date,
  emitido_em timestamptz not null default now()
);

create index certificados_codigo_idx on public.certificados_emitidos (codigo);
create index certificados_profile_idx on public.certificados_emitidos (profile_id);

-- =========================================
-- ROW LEVEL SECURITY
-- =========================================
alter table public.empresas enable row level security;
alter table public.certificados_emitidos enable row level security;

-- ----- Empresas -----

-- Cliente lê apenas a empresa em que está vinculado
create policy "cliente_le_propria_empresa"
  on public.empresas for select
  using (
    id = (select empresa_id from public.profiles where id = auth.uid())
  );

-- Admin lê todas
create policy "admin_select_empresas"
  on public.empresas for select
  using (public.is_admin());

-- Admin insere / atualiza / deleta
create policy "admin_insert_empresas"
  on public.empresas for insert
  with check (public.is_admin());

create policy "admin_update_empresas"
  on public.empresas for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_delete_empresas"
  on public.empresas for delete
  using (public.is_admin());

-- ----- Certificados -----

-- Cliente lê os próprios certificados
create policy "cliente_ve_proprios_certificados"
  on public.certificados_emitidos for select
  using (profile_id = auth.uid());

-- Admin lê todos
create policy "admin_ve_certificados"
  on public.certificados_emitidos for select
  using (public.is_admin());

-- Cliente emite apenas certificado em nome próprio
create policy "cliente_emite_proprio_certificado"
  on public.certificados_emitidos for insert
  with check (profile_id = auth.uid());
