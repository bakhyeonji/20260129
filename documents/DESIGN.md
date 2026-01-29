# Daily Saju Fortune & Emotion Diary — Design Guide (KR, 레퍼런스 스타일 반영)

> 레퍼런스 이미지의 핵심 인상: **딥 블루 배경 + 둥근 카드 그리드 + 은은한 글로우 + 얇은 라인(보더) + 3D 오브젝트 포인트**
> 이 가이드는 그 분위기를 가져오되, 작은 1인 앱에 맞게 **요소 수를 줄이고 가독성과 접근성을 우선**합니다.

---

## Table of Contents

* Design System Overview
* Color Palette for tailwindcss (primary, secondary, accent, neutral, etc.)
* Page Implementations

  * detailed design guide for each page
  * core purpose of the page
  * key components
  * layout structure
* Layout Components

  * applicable routes
  * core components
  * responsive behavior
* Interaction Patterns
* Breakpoints

---

## 1) Design System Overview

### 1.1 컨셉을 UI로 번역하기

* **밤하늘(Deep Blue)**: 화면 전체는 단색에 가까운 딥 블루. 그라데이션은 “아주 미세하게”만 사용.
* **카드 기반 그리드**: 레퍼런스처럼 둥근 카드들이 안정적으로 배치. 정보는 카드 단위로 분리.
* **골드 포인트**: 핵심 상태(선택됨, 오늘, 저장됨, 포커스)에서만 골드.
* **3D 오브젝트(선택)**: 메인 정보에 과다 사용 금지. *빈 상태/오늘의 상징* 정도로 1~2개만.

### 1.2 타이포그래피

* 목표: 레퍼런스처럼 “숫자/요약값은 또렷하게”, 본문은 “조용하게”.
* 권장 폰트

  * 본문: `Pretendard` / `Noto Sans KR`
  * 숫자/헤드라인(선택): `Inter` (없으면 시스템)
* 텍스트 계층

  * Metric(숫자 강조): `text-2xl~3xl`, `font-semibold`, `tracking-tight`
  * Card title: `text-sm`, `text-neutral-200`
  * Body: `text-sm`, `text-neutral-100/200`

```html
<!-- Headline + Metric 스타일 -->
<div class="rounded-3xl border border-white/10 bg-white/5 p-6">
  <p class="text-xs text-neutral-400">오늘</p>
  <div class="mt-2 text-3xl font-semibold tracking-tight text-neutral-50">운세</div>
  <p class="mt-3 text-sm leading-6 text-neutral-200">짧게 읽고, 가볍게 기록하세요.</p>
</div>
```

### 1.3 스페이싱/라운드 규칙

* 레퍼런스 기반 라운드: **카드 radius 크게**

  * Card: `rounded-3xl` (24px) ~ `rounded-[32px]`
  * Button: `rounded-2xl` (16px)
* 스페이싱: 8px 기반(작은 앱이라 규칙 단순화)

  * `2(8) / 3(12) / 4(16) / 6(24) / 8(32)`

### 1.4 아이콘/일러스트

* 아이콘: 라인 아이콘(chevron, calendar, settings, camera)
* 3D 오브젝트: **“보조 시각 요소”**로만 사용

  * 예: 오늘 카드 오른쪽 상단에 작은 별/원뿔(감정 상징) 1개
  * 텍스트/입력 UI에 3D 오브젝트 배치 금지(가독성 저하)

---

## 2) Color Palette for TailwindCSS

> 레퍼런스 느낌을 위해 **딥 블루 기반 + 유리 느낌(투명 화이트 레이어) + 골드 포인트**를 토큰화합니다.
> *큰 무지개 팔레트 금지*, accent는 1개 계열만 유지.

### 2.1 토큰 테이블 (HEX)

#### Primary (Deep Blue)

| Token       |     HEX | Usage       |
| ----------- | ------: | ----------- |
| primary-950 | #050B1C | 앱 배경 최심부    |
| primary-900 | #07122B | 배경 기본       |
| primary-800 | #0B1D44 | 큰 영역/섹션     |
| primary-700 | #103063 | hover 배경 톤업 |
| primary-600 | #184089 | 링크/강조(보조)   |

#### Accent (Warm Gold)

| Token      |     HEX | Usage             |
| ---------- | ------: | ----------------- |
| accent-300 | #FFD88A | 작은 텍스트 강조(필요 시)   |
| accent-500 | #D7B25A | 핵심 포인트(선택/포커스/오늘) |
| accent-700 | #9A7A2F | 보더/미묘한 라인         |

#### Neutral (Text/Border)

| Token       |     HEX | Usage    |
| ----------- | ------: | -------- |
| neutral-50  | #F8FAFF | 헤드라인     |
| neutral-200 | #C9D4F2 | 본문       |
| neutral-400 | #8EA0C9 | 라벨/설명    |
| neutral-700 | #2A3554 | 보더(다크)   |
| neutral-900 | #0A1022 | 카드 내부 대비 |

#### Glass Layer (투명 레이어용)

| Token   |                    HEX | Usage           |
| ------- | ---------------------: | --------------- |
| glass-1 | rgba(255,255,255,0.06) | 카드 표면           |
| glass-2 | rgba(255,255,255,0.10) | hover 표면        |
| stroke  | rgba(255,255,255,0.12) | 카드 보더           |
| glow    |  rgba(215,178,90,0.18) | 골드 글로우(아주 은은하게) |

### 2.2 “무엇에 무엇을 쓰나” 빠른 매핑

* 앱 배경: `bg-primary-900` + 아주 미세한 `bg-gradient-to-b` (선택)
* 카드 표면: `bg-white/5` + `border-white/10`
* 카드 내부 구분선: `border-white/10`
* 기본 텍스트: `text-neutral-50`, 본문: `text-neutral-200`, 라벨: `text-neutral-400`
* 강조/포커스/오늘: `text-accent-500`, `ring-accent-500`

```html
<!-- 배경 (레퍼런스 느낌의 미세 그라데이션) -->
<div class="min-h-screen bg-gradient-to-b from-primary-900 to-primary-950 text-neutral-50">
  <div class="mx-auto max-w-xl px-4 py-6">...</div>
</div>
```

---

## 3) Page Implementations

### 3.1 Today (`/`)

#### Core Purpose

* “오늘 운세”를 카드로 빠르게 확인하고, 사진+감정을 즉시 기록.

#### Key Components

1. Top Header: 날짜 + (Calendar, Settings)
2. **Fortune Metrics Card**: 오늘의 핵심 키워드/요약(짧게)
3. **Fortune Category Cards**: 재물운/연애운/건강운 (3개)
4. Lucky Row: 행운색/숫자 (골드 포인트)
5. Diary Card: 사진 업로드 + 감정 5택1 + 저장 상태

#### Layout Structure

* Mobile(기본): 카드 **세로 스택**
* Desktop: 상단 2열(운세/기록), 하단은 1열 유지(폭 제한)

```html
<!-- Today: 카드 스타일 예시 -->
<section class="space-y-4">
  <div class="rounded-[32px] border border-white/10 bg-white/5 p-6">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-xs text-neutral-400">오늘의 요약</p>
        <p class="mt-2 text-2xl font-semibold tracking-tight text-neutral-50">
          조용히 흐름을 타는 날
        </p>
      </div>
      <div class="h-12 w-12 rounded-2xl bg-white/5 border border-white/10"></div>
    </div>

    <div class="mt-5 flex items-center justify-between rounded-2xl border border-accent-700/40 bg-white/5 px-4 py-3">
      <span class="text-xs text-neutral-400">행운</span>
      <span class="text-sm text-accent-500">색: Gold · 숫자: 7</span>
    </div>
  </div>
</section>
```

---

### 3.2 Calendar/History (`/calendar`)

#### Core Purpose

* 월간 뷰에서 “기록 있음/없음”을 한눈에 보고 원하는 날짜로 이동.

#### Key Components

* Month Header (prev/next)
* Calendar Grid(7열)
* Day Indicator(점 2개)

  * 운세 존재: neutral dot
  * 기록 존재: gold dot

#### Layout

* Mobile: 캘린더 → 선택일 카드(아래)
* Desktop: 좌 캘린더 / 우 선택일 프리뷰(사진+감정+요약)

```html
<!-- Calendar day cell -->
<button class="relative aspect-square rounded-3xl border border-white/10 bg-white/5 p-3 text-left
               hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500">
  <span class="text-xs text-neutral-200">12</span>
  <div class="absolute bottom-3 left-3 flex gap-1">
    <span class="h-1.5 w-1.5 rounded-full bg-neutral-400/70"></span>
    <span class="h-1.5 w-1.5 rounded-full bg-accent-500"></span>
  </div>
</button>
```

---

### 3.3 Day Detail (`/day/:date`) (또는 캘린더 우측 패널)

#### Core Purpose

* 특정 날짜의 운세 전체와 기록(사진/감정)을 “읽기 모드”로 확인.

#### Key Components

* Header: 날짜 + Back
* Fortune Full Text: 카테고리 아코디언(기본 1개만 펼침)
* Photo + Emotion summary

```html
<!-- Day detail photo with placeholder -->
<div class="rounded-[32px] border border-white/10 bg-white/5 p-6">
  <img class="h-44 w-full rounded-3xl object-cover border border-white/10"
       src="https://picsum.photos/seed/fortune-day/900/520"
       alt="일기 사진" />
  <div class="mt-4 flex items-center justify-between">
    <span class="text-sm text-neutral-200">감정</span>
    <span class="text-2xl">✨</span>
  </div>
</div>
```

---

### 3.4 Settings (`/settings`)

#### Core Purpose

* 생년월일시 편집(사주 계산용) + 전체 초기화(경고 포함)

#### Key Components

* Birth Form (date/time)
* Save/Cancel
* Reset Section + Confirm Dialog

```html
<!-- Settings form card -->
<div class="rounded-[32px] border border-white/10 bg-white/5 p-6 space-y-4">
  <div>
    <label class="text-xs text-neutral-400">생년월일</label>
    <input type="date"
      class="mt-2 w-full rounded-2xl border border-white/10 bg-primary-950/40 px-4 py-3 text-sm text-neutral-50
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500" />
  </div>
  <div>
    <label class="text-xs text-neutral-400">출생 시간</label>
    <input type="time"
      class="mt-2 w-full rounded-2xl border border-white/10 bg-primary-950/40 px-4 py-3 text-sm text-neutral-50
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500" />
  </div>
</div>
```

---

## 4) Layout Components

### 4.1 App Shell

* Applicable routes: 전 라우트
* 구조: Top header + Content + (모바일) Bottom nav
* 카드 그리드는 `max-w-xl` 중심, 레퍼런스처럼 **중앙 정렬** 유지

```html
<header class="sticky top-0 z-10 border-b border-white/10 bg-primary-900/80">
  <div class="mx-auto max-w-xl px-4 py-4 flex items-center justify-between">
    <div>
      <p class="text-xs text-neutral-400">2026.01.29</p>
      <h1 class="text-lg font-semibold tracking-tight">Today</h1>
    </div>
    <div class="flex gap-2">
      <button class="h-11 w-11 rounded-2xl border border-white/10 bg-white/5">📅</button>
      <button class="h-11 w-11 rounded-2xl border border-white/10 bg-white/5">⚙️</button>
    </div>
  </div>
</header>
```

### 4.2 Card (공통)

* Core components: Card container / Card header / Card body / Card footer
* 시각 규칙(레퍼런스 반영)

  * `bg-white/5` + `border-white/10`
  * hover에서만 `bg-white/10` 정도
  * **두꺼운 그림자 금지**, 대신 필요 시 `ring-1 ring-white/5`

```html
<div class="rounded-[32px] border border-white/10 bg-white/5 ring-1 ring-white/5 p-6">
  ...
</div>
```

### 4.3 Bottom Navigation (모바일 권장)

* Applicable routes: `/`, `/calendar`, `/settings`
* Behavior:

  * Mobile: fixed bottom, 높이 낮게
  * Tablet+: 선택(Top header만으로 충분하면 제거)

```html
<nav class="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-primary-950/80">
  <div class="mx-auto max-w-xl px-4 py-3 flex justify-around text-xs text-neutral-200">
    <a class="text-accent-500">Today</a>
    <a>Calendar</a>
    <a>Settings</a>
  </div>
</nav>
```

---

## 5) Interaction Patterns

### 5.1 버튼/컨트롤 공통 규칙

* 데스크탑 hover: 배경 `white/5 → white/10` 정도만
* pressed: `translate-y-[0px]` 유지(튀는 모션 금지), 대신 BG만 진하게
* focus: 항상 `ring-2 ring-accent-500`

#### Primary Button 상태표

| State    | BG                | Border                 | Text               | Note  |
| -------- | ----------------- | ---------------------- | ------------------ | ----- |
| Default  | `bg-accent-500`   | `border-accent-700/40` | `text-primary-950` | 저장/확인 |
| Hover    | `bg-accent-300`   | 동일                     | 동일                 | 데스크탑  |
| Active   | `bg-accent-700`   | 동일                     | `text-neutral-50`  | 눌림    |
| Disabled | `bg-white/10`     | `border-white/10`      | `text-neutral-400` | 비활성   |
| Loading  | Default + spinner | 동일                     | 동일                 | 클릭 잠금 |

```html
<button class="w-full rounded-2xl border border-accent-700/40 bg-accent-500 px-4 py-3 text-sm font-medium text-primary-950
               hover:bg-accent-300 active:bg-accent-700 active:text-neutral-50
               disabled:bg-white/10 disabled:border-white/10 disabled:text-neutral-400
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500">
  저장
</button>
```

### 5.2 감정 5택1 (Emotion)

* 레퍼런스처럼 “카드 안의 작은 선택 타일” 느낌
* 선택됨: `border-accent-700/60` + `text-accent-500` + 아주 약한 `shadow` 대신 `ring` 사용

#### Emotion Tile 상태표

| State    | BG            | Border                 | Icon/Text             |
| -------- | ------------- | ---------------------- | --------------------- |
| Default  | `bg-white/5`  | `border-white/10`      | `text-neutral-200`    |
| Hover    | `bg-white/10` | 동일                     | `text-neutral-50`     |
| Selected | `bg-white/5`  | `border-accent-700/60` | `text-accent-500`     |
| Disabled | `bg-white/5`  | `border-white/10`      | `text-neutral-400/60` |

```tsx
// Emotion tile class idea
const tile = (selected: boolean) =>
  [
    "flex-1 rounded-3xl border p-3 text-center",
    "bg-white/5 border-white/10 text-neutral-200 hover:bg-white/10",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
    selected && "border-accent-700/60 text-accent-500",
  ].filter(Boolean).join(" ");
```

### 5.3 사진 업로드

* 업로드 영역 자체가 “큰 카드”로 보이게
* 이미지가 있을 때만 변경/삭제 버튼 노출(항상 노출하면 복잡해짐)

```html
<div class="rounded-[32px] border border-white/10 bg-white/5 p-6">
  <img class="h-44 w-full rounded-3xl object-cover border border-white/10"
       src="https://picsum.photos/seed/diary-photo/960/540" alt="오늘 사진" />
  <div class="mt-4 flex gap-2">
    <button class="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-200 hover:bg-white/10">
      변경
    </button>
    <button class="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-200 hover:bg-white/10">
      삭제
    </button>
  </div>
</div>
```

### 5.4 캘린더 이동

* 월 이동은 상단에 작은 아이콘 버튼(불필요한 애니메이션 없음)
* 선택 날짜는 “골드 링”으로 명확하게

```html
<button class="rounded-3xl border border-accent-700/60 bg-white/5 p-3 text-left ring-1 ring-accent-500/20">
  <span class="text-xs text-accent-500">오늘</span>
</button>
```

### 5.5 Reset

* 2단 확인(다이얼로그)
* 경고 색은 과한 빨강 대신 **텍스트로 명확** + 골드 포커스 유지

---

## 6) Breakpoints

### 정의

* mobile: 320px
* tablet: 768px
* desktop: 1024px
* wide: 1440px

### 동작 가이드

* **mobile**: Bottom nav 권장, 카드 1열, CTA(저장)는 화면 하단 가까이
* **tablet**: Calendar에서 선택일 프리뷰를 같은 화면에 배치 가능
* **desktop**: Today를 2열로(운세/기록), 그러나 콘텐츠 폭은 제한
* **wide**: 배경 여백 활용(별/미세 텍스처), 본문은 중앙 고정(860px 내)

```html
<div class="mx-auto max-w-xl md:max-w-2xl lg:max-w-4xl px-4">
  <div class="grid gap-4 lg:grid-cols-2">
    <section class="space-y-4">운세</section>
    <section class="space-y-4">기록</section>
  </div>
</div>
```

---

## 7) WCAG 2.2 대비 체크리스트 (다크+골드)

* 본문(14–16px): **대비 4.5:1 이상**
* 큰 텍스트(18px+ 또는 Bold): **3:1 이상**
* 포커스 링/선택 링: 배경과 **3:1 이상**
* `text-accent-500`(골드) 사용 시:

  * 작은 글자에는 `accent-300`로 밝히거나, 배경을 더 어둡게(`primary-950`) 유지
* 터치 타겟: 최소 **44×44px**
* 입력/버튼 상태는 색만으로 구분하지 말고(선택 링/라벨 추가)

```html
<!-- Focus-visible 항상 유지 -->
<button class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500">
  Action
</button>
```

---

## 8) 구현 메모 (짧은 권장 스타일 세트)

### 카드 프리셋 클래스(권장)

```html
<!-- Tailwind utility preset idea -->
<!-- card-base: rounded-[32px] border border-white/10 bg-white/5 ring-1 ring-white/5 -->
<div class="rounded-[32px] border border-white/10 bg-white/5 ring-1 ring-white/5 p-6">
  ...
</div>
```

### 배경 프리셋

```html
<div class="min-h-screen bg-gradient-to-b from-primary-900 to-primary-950">
  <!-- 필요 시 아주 은은한 점/별 패턴은 CSS background-image로만(과하지 않게) -->
</div>
```