-- =========================================
-- PROJETO PULSAR — Feedbacks (depoimentos com moderação)
-- Rode este script no SQL Editor do Supabase.
-- Mesmo conteúdo de: supabase/migrations/0003_feedbacks.sql
-- =========================================

create type public.feedback_status as enum ('pendente', 'aprovado', 'rejeitado');

create table public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  nome_snapshot text not null,
  empresa_snapshot text,
  mensagem text not null,
  nota smallint check (nota is null or (nota between 1 and 5)),
  status public.feedback_status not null default 'pendente',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null
);

create index feedbacks_status_idx on public.feedbacks (status);
create index feedbacks_profile_idx on public.feedbacks (profile_id);
create index feedbacks_created_at_idx on public.feedbacks (created_at desc);

alter table public.feedbacks enable row level security;

create policy "cliente_ve_proprios_feedbacks"
  on public.feedbacks for select
  using (profile_id = auth.uid());

create policy "publico_le_feedbacks_aprovados"
  on public.feedbacks for select
  to anon, authenticated
  using (status = 'aprovado');

create policy "admin_ve_feedbacks"
  on public.feedbacks for select
  using (public.is_admin());

create policy "cliente_envia_proprio_feedback"
  on public.feedbacks for insert
  with check (
    profile_id = auth.uid()
    and status = 'pendente'
  );

create policy "admin_modera_feedbacks"
  on public.feedbacks for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_deleta_feedbacks"
  on public.feedbacks for delete
  using (public.is_admin());
