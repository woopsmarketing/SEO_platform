-- ============================================
-- SEO월드 초기 스키마
-- ============================================

-- 1. profiles (Supabase Auth users 확장)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auth 유저 생성 시 자동으로 profile 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. domains (도메인 기본 정보)
create table if not exists public.domains (
  id bigint generated always as identity primary key,
  domain text not null unique,
  tld text not null,
  registrar text,
  creation_date timestamptz,
  expiry_date timestamptz,
  is_available boolean,
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.domains enable row level security;
create policy "Domains are publicly readable" on public.domains for select using (true);

create index idx_domains_domain on public.domains (domain);

-- 3. domain_metrics (SEO 지표 캐시/스냅샷)
create table if not exists public.domain_metrics (
  id bigint generated always as identity primary key,
  domain_id bigint not null references public.domains(id) on delete cascade,
  metric_type text not null,
  data jsonb not null default '{}',
  source text,
  fetched_at timestamptz not null default now(),
  stale_after timestamptz,
  created_at timestamptz not null default now()
);

alter table public.domain_metrics enable row level security;
create policy "Metrics are publicly readable" on public.domain_metrics for select using (true);

create index idx_domain_metrics_domain_id on public.domain_metrics (domain_id);
create index idx_domain_metrics_type on public.domain_metrics (domain_id, metric_type);

-- 4. inquiries (서비스 문의)
create table if not exists public.inquiries (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  company text,
  service_type text not null,
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'resolved', 'closed')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

create policy "Users can read own inquiries"
  on public.inquiries for select
  using (auth.uid() = user_id);

create policy "Anyone can create inquiries"
  on public.inquiries for insert
  with check (true);

create policy "Admins can read all inquiries"
  on public.inquiries for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update inquiries"
  on public.inquiries for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 5. analyses (사용자 분석 결과 저장)
create table if not exists public.analyses (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete set null,
  tool_type text not null,
  input jsonb not null default '{}',
  result jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.analyses enable row level security;

create policy "Users can read own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can create analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

-- 6. posts (블로그/가이드)
create table if not exists public.posts (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  category text not null check (category in ('blog', 'guide')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  author_id uuid references public.profiles(id) on delete set null,
  cover_image_url text,
  tags text[] default '{}',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "Published posts are publicly readable"
  on public.posts for select
  using (status = 'published');

create policy "Admins can manage posts"
  on public.posts for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create index idx_posts_slug on public.posts (slug);
create index idx_posts_category on public.posts (category, status);

-- 7. tool_usage_logs (툴 사용 기록)
create table if not exists public.tool_usage_logs (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete set null,
  tool_type text not null,
  input_summary text,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.tool_usage_logs enable row level security;

create policy "Admins can read tool usage logs"
  on public.tool_usage_logs for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Anyone can insert tool usage logs"
  on public.tool_usage_logs for insert
  with check (true);

create index idx_tool_usage_logs_tool on public.tool_usage_logs (tool_type);
create index idx_tool_usage_logs_created on public.tool_usage_logs (created_at desc);

-- updated_at 자동 갱신 트리거
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.domains
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.inquiries
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.posts
  for each row execute function public.update_updated_at();
