# 3시간 MVP 정리본 — 데일리 운세 & 감정 다이어리 (1인용)

> 목적: **3시간 안에 “동작하는 제품”**을 만드는 게 1순위.
> 기존 `PRD/IA/ERD/DESIGN`의 방향은 유지하되, **스코프/스키마/화면을 최소화**합니다.

---

## 0) 이번 MVP에서 “버리는 것”(중요)

아래는 **3시간 MVP에서 제외**합니다.

- 로그인/회원가입, Auth 연동, 멀티 유저
- 프로필 버전 히스토리(`is_current` 등)
- LLM 호출(Claude/GPT) 및 토큰 로깅
- Signed URL / Private bucket / 이미지 리사이즈 파이프라인
- Day Detail 전용 라우트(`/day/:date`) — 캘린더에서 모달로만 처리(옵션)
- 통계/주간요약/알림/다크모드(추후)

**MVP 목표는 “매일 열고 기록 가능” + “캘린더로 회고”만**입니다.

---

## 1) MVP 기능 범위 (3개 화면)

### 1.1 오늘(`/`)
- **사주 프로필이 없으면**: 온보딩 모달(생년월일 + 출생시간) 표시 → 저장
- 오늘 날짜 기준:
  - `daily_fortunes`에서 오늘 운세 조회
  - 없으면 **간단 규칙 기반 운세 생성** → DB에 캐시 저장(“하루 1회 생성” 효과)
- **일기 기록**: 사진 1장 업로드 + 감정(1~5) 선택 → 저장(덮어쓰기)

### 1.2 캘린더(`/calendar`)
- 월간 캘린더(커스텀 or 간단 그리드)
- 날짜 셀 인디케이터:
  - 운세 있음: `•` 또는 `⭐`
  - 일기 있음: 감정 이모지(`😄🙂😐😞😢`) 또는 `•`
- 날짜 클릭 시 모달:
  - 운세 + 사진 + 감정 표시(읽기 전용)

### 1.3 설정(`/settings`)
- 사주 프로필 수정(덮어쓰기)
- 전체 초기화(2단 확인)
  - DB 레코드 삭제 + (가능하면) Storage 파일도 삭제
  - 3시간 MVP에서는 **DB 삭제만** 처리하고, Storage 삭제는 “추후”로 둬도 됨

---

## 2) 데이터 모델 (3시간용 “최소 스키마”)

### 핵심 원칙
- 1인용: `user_id`/`users` 테이블을 **빼서** 시간을 줄입니다.
- 조회가 단순해지도록 “날짜(date)”를 키로 씁니다.
- 사진은 `photos` 테이블 없이 **일기 테이블에 `photo_url`만 저장**합니다.

### 테이블 3개
1) `saju_profile` (단일 row)
- `id = 1` 고정(항상 1개의 프로필만 유지)

2) `daily_fortunes`
- `fortune_date`를 PK(하루 1개)
- `fortune_content`는 JSONB로 카테고리별 텍스트 저장

3) `diary_entries`
- `entry_date`를 PK(하루 1개)
- `emotion(1~5)` + `photo_url`(public URL) 저장

> 정확도 평가, note, photos 분리는 모두 추후 확장으로 미룹니다.

---

## 3) Supabase 준비 체크리스트 (붙여넣기 중심)

### 3.1 환경변수(프론트)
`.env.local`에 아래 2개만 있으면 됨:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3.2 Storage(사진)
- 버킷: `diary-photos`
- **3시간 MVP 추천**: Public bucket (Signed URL 구성 생략)
- 파일 경로 규칙: `YYYY-MM-DD/{timestamp}.{ext}`

---

## 4) 운세 생성 방식(3시간 MVP용)

LLM 대신 **규칙 기반 템플릿**으로 오늘 운세를 만들고 DB에 저장합니다.

- 입력: `dominant_element`(오행 중 대표 1개) + `today(요일/날짜)`
- 출력(JSON):
  - `fortune_content`: `재물운/연애운/건강운` 2문장 이내
  - `lucky_color`: 오행 매핑(예: 목=초록, 화=빨강, 토=노랑, 금=흰/은, 수=파랑)
  - `lucky_number`: 날짜 기반(1~99) deterministic
  - `daily_tip`: “오늘은 ____” 1문장

이 방식이면 **API 키 없이도** “하루 1회 생성 + 캐시” UX를 구현할 수 있습니다.

---

## 5) 3시간 타임박스(구현 순서 그대로)

### 0:00 ~ 0:25 (25m) — Supabase 스키마/버킷
- 아래 SQL 실행(또는 마이그레이션 파일 사용)
- `diary-photos` 버킷 생성(콘솔)

### 0:25 ~ 1:35 (70m) — 오늘(`/`)
- 온보딩 모달(프로필 저장)
- 오늘 운세 get-or-create
- 사진 업로드 + 감정 저장(업서트)

### 1:35 ~ 2:25 (50m) — 캘린더(`/calendar`)
- 월 그리드
- 월 데이터 한 번에 로드(운세/일기)
- 날짜 클릭 모달(상세 표시)

### 2:25 ~ 2:55 (30m) — 설정(`/settings`)
- 프로필 수정
- 전체 초기화(DB 삭제만)

### 2:55 ~ 3:00 (5m) — 마감
- 에러/로딩 토스트 정리
- 모바일에서 터치 타겟/스크롤 확인

---

## 6) Supabase SQL (MVP 최소 스키마)

> 동일 내용이 `supabase/migrations/20260129_000001_mvp.sql`에도 있습니다.

```sql
-- 3H MVP schema for single-user fortune & diary

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
```

---

## 7) 다음 단계(3시간 이후에 붙이기 좋은 것)
- `@supabase/supabase-js` + RLS + Auth(진짜 1인이라도 “내 데이터 보호” 목적)
- Storage를 private + Signed URL로 전환
- LLM 운세 생성(결과는 동일 스키마에 저장 가능)
- Day Detail 라우트(`/day/:date`) 추가

