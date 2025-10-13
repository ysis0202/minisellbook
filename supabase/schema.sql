-- 확장
create extension if not exists pgcrypto;

-- 프로필/사용자
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
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
  kind text check (kind in ('income','expense')) not null,
  emoji text,
  color text,
  sort int default 0,
  archived boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_categories_user on categories(user_id);

-- 항목(수입/지출)
create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  account_id uuid references accounts(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  kind text check (kind in ('income','expense')) not null,
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
  kind text check (kind in ('income','expense')) not null,
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

-- updated_at 자동 갱신
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;$$;

create trigger trg_profiles_updated before update on profiles
for each row execute procedure set_updated_at();
create trigger trg_accounts_updated before update on accounts
for each row execute procedure set_updated_at();
create trigger trg_categories_updated before update on categories
for each row execute procedure set_updated_at();
create trigger trg_entries_updated before update on entries
for each row execute procedure set_updated_at();
create trigger trg_budgets_updated before update on budgets
for each row execute procedure set_updated_at();

-- RLS
alter table profiles enable row level security;
alter table accounts enable row level security;
alter table categories enable row level security;
alter table entries enable row level security;
alter table recurring_rules enable row level security;
alter table budgets enable row level security;

create policy "own rows" on profiles for all using (id = auth.uid());
create policy "own rows" on accounts for all using (user_id = auth.uid());
create policy "own rows" on categories for all using (user_id = auth.uid());
create policy "own rows" on entries for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on recurring_rules for all using (user_id = auth.uid());
create policy "own rows" on budgets for all using (user_id = auth.uid());

-- 편의 뷰: 월 요약
create or replace view v_month_summary as
select
  user_id,
  date_trunc('month', entry_date)::date as month,
  kind,
  sum(amount) as total
from entries
where deleted_at is null
group by user_id, month, kind;

-- 온보딩 시드 함수
create or replace function fn_onboard_seed(p_user_id uuid, p_display_name text)
returns void language plpgsql as $$
begin
  insert into profiles (id, display_name) values (p_user_id, coalesce(p_display_name, '사용자'))
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
    (gen_random_uuid(), p_user_id, '기타', 'expense', '🧩', 99);
end;$$;

-- Storage 버킷 및 정책 (영수증 첨부용)
select storage.create_bucket('receipts', false);

-- 본인만 업로드/조회
create policy "receipts read own" on storage.objects
  for select to authenticated
  using (bucket_id = 'receipts' and owner = auth.uid());

create policy "receipts insert own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'receipts' and owner = auth.uid());