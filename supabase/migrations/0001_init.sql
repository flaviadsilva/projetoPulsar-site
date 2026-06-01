-- =========================================
-- PROJETO PULSAR — Schema inicial
-- =========================================

-- ENUMS
create type public.user_role as enum ('admin', 'cliente');
create type public.user_status as enum ('pending', 'approved', 'rejected');

-- =========================================
-- TABELA PROFILES (1-to-1 com auth.users)
-- =========================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text not null,
  empresa text,
  telefone text,
  role public.user_role not null default 'cliente',
  status public.user_status not null default 'pending',
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references auth.users(id) on delete set null
);

create index profiles_status_idx on public.profiles (status);
create index profiles_role_idx on public.profiles (role);

-- =========================================
-- TRIGGER: cria profile automaticamente
-- =========================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nome, email, empresa, telefone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    new.email,
    new.raw_user_meta_data->>'empresa',
    new.raw_user_meta_data->>'telefone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================
-- ROW LEVEL SECURITY
-- =========================================
alter table public.profiles enable row level security;

-- Helper: checa se o user atual é admin (evita recursão nas policies)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Cliente lê só o próprio profile
create policy "users_read_own_profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Admin lê todos
create policy "admin_read_all_profiles"
  on public.profiles for select
  using (public.is_admin());

-- Cliente atualiza só campos seguros do próprio profile (não muda role/status)
create policy "users_update_own_profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
    and status = (select status from public.profiles where id = auth.uid())
  );

-- Admin atualiza qualquer profile (inclusive role/status)
create policy "admin_update_all_profiles"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- INSERT acontece via trigger (security definer). Nenhuma policy de insert é necessária.
