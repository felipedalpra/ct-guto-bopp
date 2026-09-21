-- Interações da Área do Professor: aplicar no SQL Editor do projeto Supabase.
-- Comentários levam apenas o nome de exibição; e-mails continuam privados.

create table public.material_curtidas (
  material_id uuid not null references public.materiais(id) on delete cascade,
  professor_id uuid not null references public.profiles(id) on delete cascade,
  criado_em timestamptz not null default now(),
  primary key (material_id, professor_id)
);

create table public.material_comentarios (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.materiais(id) on delete cascade,
  professor_id uuid not null references public.profiles(id) on delete cascade,
  autor_nome text not null check (char_length(autor_nome) between 1 and 120),
  conteudo text not null check (char_length(conteudo) between 1 and 1000),
  criado_em timestamptz not null default now()
);

create index material_comentarios_material_criado_em_idx
  on public.material_comentarios (material_id, criado_em);

alter table public.material_curtidas enable row level security;
alter table public.material_comentarios enable row level security;

create policy "usuarios ativos veem curtidas"
  on public.material_curtidas for select using (
    public.usuario_ativo()
    and exists (select 1 from public.materiais where id = material_id)
  );
create policy "usuario ativo curte"
  on public.material_curtidas for insert
  with check (
    professor_id = auth.uid()
    and public.usuario_ativo()
    and exists (select 1 from public.materiais where id = material_id)
  );
create policy "usuario remove propria curtida"
  on public.material_curtidas for delete
  using (professor_id = auth.uid());

create policy "usuarios ativos veem comentarios"
  on public.material_comentarios for select using (
    public.usuario_ativo()
    and exists (select 1 from public.materiais where id = material_id)
  );
create policy "usuario ativo comenta"
  on public.material_comentarios for insert
  with check (
    professor_id = auth.uid()
    and public.usuario_ativo()
    and exists (select 1 from public.materiais where id = material_id)
  );
create policy "usuario remove proprio comentario ou lider modera"
  on public.material_comentarios for delete
  using (professor_id = auth.uid() or public.is_lider_ativo());
