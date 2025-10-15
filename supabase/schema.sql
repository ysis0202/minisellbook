-- 확장
create extension if not exists pgcrypto;

-- 프로필/사용자
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  profile_image text,
  auth_provider text check (auth_provider in ('google','kakao')) default 'google',
  is_premium boolean default false,
  premium_until timestamptz,
  currency char(3) default 'KRW',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 계정(지갑/카드/현금)
create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  type text check (type in ('cash','card','bank','other')) default 'cash',
  is_default boolean default false,
  archived boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_accounts_user on accounts(user_id);

-- 카테고리
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  kind text check (kind in ('income','expense','savings')) not null,
  emoji text,
  color text,
  sort int default 0,
  archived boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_categories_user on categories(user_id);

-- 항목(수입/지출/저축)
create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  account_id uuid references accounts(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  kind text check (kind in ('income','expense','savings')) not null,
  amount numeric(14,2) not null check (amount>=0),
  memo text,
  entry_date date not null,
  tags text[],
  attachment_url text,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_entries_user_date on entries(user_id, entry_date);
create index if not exists idx_entries_user_kind_date on entries(user_id, kind, entry_date desc);
create index if not exists idx_entries_user_category_date on entries(user_id, category_id, entry_date desc);

-- 반복 규칙(선택)
create table if not exists recurring_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  category_id uuid references categories(id),
  account_id uuid references accounts(id),
  kind text check (kind in ('income','expense','savings')) not null,
  amount numeric(14,2) not null,
  memo text,
  start_date date not null,
  rrule text not null
);

-- 예산(선택)
create table if not exists budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  month date not null,
  category_id uuid references categories(id),
  limit_amount numeric(14,2) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 저축 목표
create table if not exists savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  month date not null,
  goal_amount numeric(14,2) not null check (goal_amount >= 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, month)
);

-- 공지사항/이벤트
create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  type text check (type in ('notice','event','update')) default 'notice',
  emoji text default '📢',
  link text,
  is_active boolean default true,
  priority int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  expires_at timestamptz
);

-- updated_at 자동 갱신
create or replace function set_updated_at()
returns trigger language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;$$;

drop trigger if exists trg_profiles_updated on profiles;
create trigger trg_profiles_updated before update on profiles
for each row execute procedure set_updated_at();

drop trigger if exists trg_accounts_updated on accounts;
create trigger trg_accounts_updated before update on accounts
for each row execute procedure set_updated_at();

drop trigger if exists trg_categories_updated on categories;
create trigger trg_categories_updated before update on categories
for each row execute procedure set_updated_at();

drop trigger if exists trg_entries_updated on entries;
create trigger trg_entries_updated before update on entries
for each row execute procedure set_updated_at();

drop trigger if exists trg_budgets_updated on budgets;
create trigger trg_budgets_updated before update on budgets
for each row execute procedure set_updated_at();

drop trigger if exists trg_savings_goals_updated on savings_goals;
create trigger trg_savings_goals_updated before update on savings_goals
for each row execute procedure set_updated_at();

drop trigger if exists trg_notices_updated on notices;
create trigger trg_notices_updated before update on notices
for each row execute procedure set_updated_at();

-- RLS
alter table profiles enable row level security;
alter table accounts enable row level security;
alter table categories enable row level security;
alter table entries enable row level security;
alter table recurring_rules enable row level security;
alter table budgets enable row level security;
alter table savings_goals enable row level security;
alter table notices enable row level security;

drop policy if exists "own rows" on profiles;
create policy "own rows" on profiles for all using (id = auth.uid());

drop policy if exists "own rows" on accounts;
create policy "own rows" on accounts for all using (user_id = auth.uid());

drop policy if exists "own rows" on categories;
create policy "own rows" on categories for all using (user_id = auth.uid());

drop policy if exists "own rows" on entries;
create policy "own rows" on entries for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "own rows" on recurring_rules;
create policy "own rows" on recurring_rules for all using (user_id = auth.uid());

drop policy if exists "own rows" on budgets;
create policy "own rows" on budgets for all using (user_id = auth.uid());

drop policy if exists "own rows" on savings_goals;
create policy "own rows" on savings_goals for all using (user_id = auth.uid());

drop policy if exists "public read" on notices;
create policy "public read" on notices for select using (is_active = true and (expires_at is null or expires_at > now()));

-- 편의 뷰: 월 요약
create or replace view v_month_summary
with (security_invoker = true) as
select
  user_id,
  date_trunc('month', entry_date)::date as month,
  kind,
  sum(amount) as total
from entries
where deleted_at is null
group by user_id, month, kind;

-- 온보딩 시드 함수
create or replace function fn_onboard_seed(p_user_id uuid, p_display_name text, p_email text default null, p_auth_provider text default 'google')
returns void language plpgsql
security definer set search_path = public
as $$
begin
  insert into profiles (id, email, display_name, auth_provider)
  values (p_user_id, p_email, coalesce(p_display_name, '사용자'), p_auth_provider)
  on conflict (id) do nothing;

  insert into accounts (id, user_id, name, type, is_default)
  values (gen_random_uuid(), p_user_id, '현금', 'cash', true)
  on conflict do nothing;

  -- 기본 카테고리
  insert into categories (id, user_id, name, kind, emoji, sort) values
    (gen_random_uuid(), p_user_id, '급여', 'income', '💼', 1),
    (gen_random_uuid(), p_user_id, '이자', 'income', '🏦', 2),
    (gen_random_uuid(), p_user_id, '기타', 'income', '✨', 3),
    (gen_random_uuid(), p_user_id, '식비', 'expense', '🍚', 1),
    (gen_random_uuid(), p_user_id, '교통', 'expense', '🚌', 2),
    (gen_random_uuid(), p_user_id, '주거', 'expense', '🏠', 3),
    (gen_random_uuid(), p_user_id, '기타', 'expense', '🧩', 99),
    (gen_random_uuid(), p_user_id, '저축', 'savings', '💰', 1);
end;$$;

-- Storage 버킷 및 정책 (영수증 첨부용)
-- 버킷은 Dashboard에서 수동으로 생성: Storage > Create bucket > name: receipts, public: false

-- 본인만 업로드/조회 (버킷 생성 후 실행)
-- create policy "receipts read own" on storage.objects
--   for select to authenticated
--   using (bucket_id = 'receipts' and owner = auth.uid());

-- create policy "receipts insert own" on storage.objects
--   for insert to authenticated
--   with check (bucket_id = 'receipts' and owner = auth.uid());