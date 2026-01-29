-- 3H MVP schema for single-user fortune & diary
-- 목표: 3시간 내 구현을 위해 "users/photos 등"은 생략하고 date를 PK로 사용

create extension if not exists pgcrypto;

-- 1) 단일 프로필(항상 1행만 유지)
create table if not exists public.saju_profile (
  id integer primary key default 1,
  birth_date date not null,
  birth_time time not null,
  saju_data jsonb not null,
  updated_at timestamptz not null default now()
);

-- 2) 날짜별 운세 캐시(하루 1개)
create table if not exists public.daily_fortunes (
  fortune_date date primary key,
  fortune_content jsonb not null,
  lucky_color text,
  lucky_number integer check (lucky_number is null or (lucky_number between 1 and 99)),
  daily_tip text,
  created_at timestamptz not null default now()
);

-- 3) 날짜별 일기(하루 1개)
create table if not exists public.diary_entries (
  entry_date date primary key,
  emotion integer check (emotion is null or (emotion between 1 and 5)),
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at 자동 갱신(간단 버전)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_diary_entries_updated_at on public.diary_entries;
create trigger trg_diary_entries_updated_at
before update on public.diary_entries
for each row execute function public.set_updated_at();

drop trigger if exists trg_saju_profile_updated_at on public.saju_profile;
create trigger trg_saju_profile_updated_at
before update on public.saju_profile
for each row execute function public.set_updated_at();

