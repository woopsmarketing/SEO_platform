-- ============================================
-- Phase 7: SERP 추적 + 깨진 백링크 복구 테이블
-- ============================================
-- 세 테이블:
--   1) tracked_keywords   — 사용자가 등록한 추적 키워드
--   2) serp_tracking      — 키워드별 일일 순위 기록 (cron이 쌓음)
--   3) broken_backlinks   — 깨진 백링크 이력 (툴 실행 시 upsert)
--
-- RLS:
--   - 각 테이블은 user_id = auth.uid() 조건으로 CRUD
--   - service_role은 RLS 우회 (cron/admin client)

-- 1) tracked_keywords
create table if not exists public.tracked_keywords (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  domain text not null,
  keyword text not null,
  gl text not null default 'kr',
  hl text not null default 'ko',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, domain, keyword)
);

create index if not exists idx_tracked_keywords_user
  on public.tracked_keywords (user_id);
create index if not exists idx_tracked_keywords_active
  on public.tracked_keywords (is_active)
  where is_active = true;

alter table public.tracked_keywords enable row level security;

create policy "Users can select own tracked_keywords"
  on public.tracked_keywords for select
  using (auth.uid() = user_id);

create policy "Users can insert own tracked_keywords"
  on public.tracked_keywords for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tracked_keywords"
  on public.tracked_keywords for update
  using (auth.uid() = user_id);

create policy "Users can delete own tracked_keywords"
  on public.tracked_keywords for delete
  using (auth.uid() = user_id);

-- 2) serp_tracking
create table if not exists public.serp_tracking (
  id bigserial primary key,
  tracked_keyword_id uuid not null references public.tracked_keywords(id) on delete cascade,
  rank integer,
  url text,
  checked_at timestamptz not null default now()
);

create index if not exists idx_serp_tracking_keyword_checked
  on public.serp_tracking (tracked_keyword_id, checked_at desc);

alter table public.serp_tracking enable row level security;

create policy "Users can select own serp_tracking"
  on public.serp_tracking for select
  using (
    exists (
      select 1
      from public.tracked_keywords tk
      where tk.id = serp_tracking.tracked_keyword_id
        and tk.user_id = auth.uid()
    )
  );

create policy "Users can insert own serp_tracking"
  on public.serp_tracking for insert
  with check (
    exists (
      select 1
      from public.tracked_keywords tk
      where tk.id = serp_tracking.tracked_keyword_id
        and tk.user_id = auth.uid()
    )
  );

create policy "Users can update own serp_tracking"
  on public.serp_tracking for update
  using (
    exists (
      select 1
      from public.tracked_keywords tk
      where tk.id = serp_tracking.tracked_keyword_id
        and tk.user_id = auth.uid()
    )
  );

create policy "Users can delete own serp_tracking"
  on public.serp_tracking for delete
  using (
    exists (
      select 1
      from public.tracked_keywords tk
      where tk.id = serp_tracking.tracked_keyword_id
        and tk.user_id = auth.uid()
    )
  );

-- 3) broken_backlinks
create table if not exists public.broken_backlinks (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  target_domain text not null,
  source_url text not null,
  target_url text not null,
  status_code integer,
  first_detected_at timestamptz not null default now(),
  last_checked_at timestamptz not null default now(),
  resolved boolean not null default false,
  unique (user_id, source_url, target_url)
);

create index if not exists idx_broken_backlinks_user
  on public.broken_backlinks (user_id);
create index if not exists idx_broken_backlinks_unresolved
  on public.broken_backlinks (user_id, resolved)
  where resolved = false;
create index if not exists idx_broken_backlinks_target_domain
  on public.broken_backlinks (target_domain);

alter table public.broken_backlinks enable row level security;

create policy "Users can select own broken_backlinks"
  on public.broken_backlinks for select
  using (auth.uid() = user_id);

create policy "Users can insert own broken_backlinks"
  on public.broken_backlinks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own broken_backlinks"
  on public.broken_backlinks for update
  using (auth.uid() = user_id);

create policy "Users can delete own broken_backlinks"
  on public.broken_backlinks for delete
  using (auth.uid() = user_id);
