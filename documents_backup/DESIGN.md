# Daily Saju Fortune & Emotion Diary — Design Guide (KR)

---

## 1) Design System Overview

### 제품 목표와 원칙

* **핵심 루프**: 열기 → 오늘 운세 확인 → 사진 1장 + 감정 1개 기록 → 닫기
* **분위기 키워드**: 신비롭고(mystical) · 고요하고(calm) · 미니멀(minimal) · 밤하늘(celestial) · 개인적(intimate)
* **UI 원칙**

  * **저소음 UI**: 한 화면에 “한 가지 주요 행동”만 크게 강조
  * **여백 우선**: 카드 간 간격을 넉넉히, 장식은 최소
  * **색상 절제**: Indigo 계열 + Gold 포인트 + Neutral만 사용
  * **그림자 최소**: 얕은 보더/솔리드 필로 레이어 구분
  * **전환 효과 최소화**: hover/focus 피드백은 짧고 단순하게

### 타이포그래피

* **권장 폰트 페어링**

  * 본문(가독성): `Pretendard` / `Noto Sans KR` (system fallback 포함)
  * 타이틀(조금 더 분위기): `Cinzel`(영문/숫자) 또는 `MaruBuri`(한글) *중 택1*
  * 원칙: **본문은 항상 산세리프**, 타이틀만 “의식(ritual)” 느낌을 살짝 더하기
* **타입 스케일(권장)**

  * Display: 24–28px (오늘 날짜/페이지 타이틀)
  * Title: 18–20px (카드 제목)
  * Body: 14–16px (운세/설명 텍스트)
  * Caption: 12–13px (보조 정보/라벨)

```html
<!-- Typography example -->
<h1 class="text-2xl font-semibold tracking-tight text-neutral-50">
  오늘의 운세
</h1>
<p class="text-sm leading-6 text-neutral-200">
  고요한 밤의 루틴처럼, 짧게 읽고 기록하세요.
</p>
```

### spacing/레이아웃 스케일

* **4px 기반**: `1(4px) / 2(8px) / 3(12px) / 4(16px) / 6(24px) / 8(32px) / 12(48px)`
* 카드 내부 패딩 기본: **p-4(16px)**, 중요한 카드: **p-6(24px)**

```html
<!-- Spacing example -->
<section class="space-y-6 px-4 py-6">
  <div class="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">...</div>
  <div class="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">...</div>
</section>
```

### 아이코노그래피

* **스타일**: 1.5px~2px 라인 아이콘, 라운드 캡, 단순 형태
* **허용 아이콘**: chevron/arrow, settings, calendar, camera, plus/minus, zodiac-like glyph(아주 절제)
* **색상 규칙**

  * 기본: `text-neutral-200`
  * 강조: `text-accent-500` (골드)

```tsx
// Icon usage example (Lucide-like)
const IconButton = ({ children }: { children: React.ReactNode }) => (
  <button className="h-10 w-10 rounded-xl border border-neutral-800 bg-neutral-950/40 text-neutral-200 hover:bg-neutral-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500">
    {children}
  </button>
);
```

---

## 2) Color Palette for TailwindCSS (토큰 + HEX)

> 목표: **다크 인디고 기반 + 골드 포인트 + 뉴트럴**.
> Primary 500는 #1E40AF에 “조금 더 밤색(남색)”을 섞어 **#1B3A8A**로 미세 조정.

### Tailwind 확장 예시 (`tailwind.config.js`)

```js
// tailwind.config.js (partial)
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#1B3A8A", // deep indigo (tuned)
          600: "#162F70",
          700: "#12265A",
          800: "#0E1D45",
          900: "#0A1432",
          950: "#060B1F"
        },
        accent: {
          50:  "#FFF7E6",
          100: "#FFE9B8",
          200: "#FFD77A",
          300: "#FFC44A",
          400: "#FFB21F",
          500: "#D7B25A", // warm gold
          600: "#B7923F",
          700: "#8F6F2C",
          800: "#6B521F",
          900: "#4A3814",
          950: "#2B1F0A"
        },
        neutral: {
          50:  "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1F2937",
          900: "#0B1220",
          950: "#070B14"
        }
      }
    }
  }
}
```

### 색상 토큰 사용 가이드 (권장 매핑)

| 사용처            | 토큰                                         |
| -------------- | ------------------------------------------ |
| 앱 메인 배경(밤하늘)   | `bg-primary-950` 또는 `bg-neutral-950`       |
| 카드 표면          | `bg-neutral-950/60` + `border-neutral-800` |
| 기본 텍스트         | `text-neutral-50`                          |
| 보조 텍스트/설명      | `text-neutral-200`                         |
| 뮤트/라벨          | `text-neutral-400`                         |
| 골드 강조(아이콘/키워드) | `text-accent-500`, `border-accent-700/40`  |
| 구분선/보더         | `border-neutral-800`                       |
| 포커스 링          | `ring-accent-500`                          |

```html
<!-- Color usage example -->
<div class="min-h-screen bg-primary-950 text-neutral-50">
  <div class="mx-auto max-w-xl px-4 py-6">
    <div class="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">
      <p class="text-neutral-200">오늘은</p>
      <p class="mt-2 text-accent-500">금전운이 안정적인 흐름</p>
    </div>
  </div>
</div>
```

---

## 3) Page Implementations

### A. Today (`/`)

#### Core Purpose

* 오늘의 운세를 “짧게 확인”하고, **사진 1장 + 감정 1개**를 빠르게 기록.

#### Key Components (우선순위)

1. **Header**: 날짜, 설정/캘린더 이동
2. **Fortune Card**: 재물운/연애운/건강운(짧은 요약 + 펼치기 옵션)
3. **Lucky Strip**: 행운 색/숫자(골드 포인트)
4. **Diary Input**: 사진 업로드 + 감정 5택1
5. **Saved Preview**: 오늘 저장된 사진/감정/메모(있다면)

#### Layout Structure

* Mobile: 세로 스택(한 손 사용 고려, 주요 CTA는 하단)
* Desktop(>=1024): 좌(운세) / 우(기록) 2컬럼, 폭은 좁게(max-w 유지)

```html
<!-- Today layout skeleton -->
<main class="mx-auto max-w-xl px-4 py-6 space-y-6">
  <header class="flex items-center justify-between">
    <div>
      <p class="text-xs text-neutral-400">2026.01.29</p>
      <h1 class="text-xl font-semibold">오늘</h1>
    </div>
    <div class="flex gap-2">
      <button class="h-10 w-10 rounded-xl border border-neutral-800">📅</button>
      <button class="h-10 w-10 rounded-xl border border-neutral-800">⚙️</button>
    </div>
  </header>

  <section class="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">
    <h2 class="text-sm text-neutral-200">오늘의 운세</h2>
    <div class="mt-4 grid gap-3">
      <div class="rounded-xl border border-neutral-800 p-4">
        <p class="text-xs text-neutral-400">재물운</p>
        <p class="mt-1 text-sm leading-6 text-neutral-100">작게 아끼는 선택이 도움.</p>
      </div>
      <!-- 연애운/건강운 -->
    </div>
    <div class="mt-4 flex items-center justify-between rounded-xl border border-accent-700/40 bg-neutral-950/40 p-4">
      <span class="text-xs text-neutral-300">행운</span>
      <span class="text-sm text-accent-500">색: Gold · 숫자: 7</span>
    </div>
  </section>

  <section class="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6 space-y-4">
    <h2 class="text-sm text-neutral-200">오늘의 기록</h2>
    <!-- photo -->
    <div class="rounded-xl border border-neutral-800 p-4">
      <img class="h-40 w-full rounded-lg object-cover"
           src="https://picsum.photos/seed/saju-diary/800/480"
           alt="일기 사진 자리" />
      <div class="mt-3 flex gap-2">
        <button class="px-3 py-2 rounded-lg border border-neutral-800 text-sm">사진 변경</button>
        <button class="px-3 py-2 rounded-lg border border-neutral-800 text-sm">삭제</button>
      </div>
    </div>
    <!-- emotion -->
    <div class="flex items-center justify-between gap-2">
      <button class="flex-1 rounded-xl border border-neutral-800 p-3 text-neutral-200">😊</button>
      <button class="flex-1 rounded-xl border border-neutral-800 p-3 text-neutral-200">😐</button>
      <button class="flex-1 rounded-xl border border-neutral-800 p-3 text-neutral-200">😢</button>
      <button class="flex-1 rounded-xl border border-neutral-800 p-3 text-neutral-200">😡</button>
      <button class="flex-1 rounded-xl border border-neutral-800 p-3 text-neutral-200">✨</button>
    </div>
  </section>
</main>
```

#### Content Density 가이드

* 운세 텍스트는 기본 **2줄 내**로 요약, “자세히”는 토글(페이지 이동 없이)
* Lucky Strip은 한 줄로 끝내기(색/숫자만)

---

### B. Calendar/History (`/calendar`)

#### Core Purpose

* 날짜별로 “운세/기록 여부”를 한눈에 보고, 특정 날짜로 빠르게 이동.

#### Key Components

1. 월 이동(Header: prev/next, month label)
2. **Calendar Grid** (7열)
3. Day Cell Indicator

   * 운세 있음: 작은 점(Neutral)
   * 기록 있음: 골드 점(Accent)
4. 리스트 보조(선택한 날짜의 요약: 감정 아이콘 + 썸네일)

#### Layout

* Mobile: 캘린더 상단 + 선택일 요약 하단(스크롤)
* Desktop: 좌 캘린더, 우 선택일 상세(미리보기)

```html
<!-- Calendar cell indicator example -->
<button class="relative aspect-square rounded-xl border border-neutral-800 bg-neutral-950/40 p-2 text-left hover:bg-neutral-900/50 focus-visible:ring-2 focus-visible:ring-accent-500">
  <span class="text-xs text-neutral-300">12</span>
  <span class="absolute bottom-2 left-2 flex gap-1">
    <span class="h-1.5 w-1.5 rounded-full bg-neutral-500"></span> <!-- fortune -->
    <span class="h-1.5 w-1.5 rounded-full bg-accent-500"></span> <!-- diary -->
  </span>
</button>
```

---

### C. Day Detail (`/day/:date`) *(또는 Calendar 내부 패널로 통합 가능)*

#### Core Purpose

* 특정 날짜의 운세 전체 + 감정 + 사진을 “읽기 모드”로 확인.

#### Key Components

* 날짜 헤더 + 뒤로가기
* Fortune full text(카테고리 탭/아코디언 가능)
* 사진(큰 썸네일)
* 감정(아이콘 + 라벨)

#### Layout

* Mobile: 단일 컬럼(읽기 집중)
* Desktop: 상단 헤더 고정, 아래 2컬럼(운세/사진)

```html
<!-- Day detail: fortune accordion example -->
<div class="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">
  <button class="flex w-full items-center justify-between">
    <span class="text-sm text-neutral-100">재물운</span>
    <span class="text-neutral-400">⌄</span>
  </button>
  <p class="mt-3 text-sm leading-6 text-neutral-200">
    지출을 줄이기보다, “필요한 것에만 쓰는 기준”을 세우면 흐름이 안정됩니다.
  </p>
</div>
```

---

### D. Settings (`/settings`)

#### Core Purpose

* 생년월일시 편집(사주 기반 운세 생성용), 전체 초기화(리셋).

#### Key Components

* Birth Info Form: 날짜/시간 입력
* Save/Cancel
* Reset Section: 위험 강조 + 확인 다이얼로그

#### Layout

* Mobile: 폼 → 저장 버튼(하단 고정 가능)
* Desktop: 중앙 좁은 폼(max-w)

```html
<!-- Settings: reset warning block -->
<section class="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6 space-y-3">
  <h2 class="text-sm text-neutral-100">데이터 초기화</h2>
  <p class="text-sm text-neutral-300">
    모든 기록(사진/감정/운세 캐시)이 삭제됩니다. 되돌릴 수 없습니다.
  </p>
  <button class="w-full rounded-xl border border-accent-700/60 bg-neutral-950/40 px-4 py-3 text-sm text-accent-500 hover:bg-neutral-900/60 focus-visible:ring-2 focus-visible:ring-accent-500">
    전체 초기화
  </button>
</section>
```

---

## 4) Layout Components

### 4.1 Global App Shell

* **적용 라우트**: 전 라우트
* **구성**

  * Top Header: 날짜/타이틀 + 유틸 액션(캘린더/설정)
  * Main: max-width 컨테이너
  * Bottom Nav(선택): Today / Calendar / Settings 3개만
* **스크롤**

  * Header는 **sticky** 가능(모바일에서 편의), 단 높이 낮게
  * Bottom nav는 **fixed** 가능(한 손 접근성)

```html
<!-- App shell example -->
<div class="min-h-screen bg-primary-950 text-neutral-50">
  <header class="sticky top-0 z-10 border-b border-neutral-800 bg-primary-950/90 backdrop-blur-none">
    <div class="mx-auto max-w-xl px-4 py-3 flex items-center justify-between">
      <span class="text-sm text-neutral-200">오늘</span>
      <nav class="flex gap-2">
        <button class="h-9 w-9 rounded-xl border border-neutral-800">📅</button>
        <button class="h-9 w-9 rounded-xl border border-neutral-800">⚙️</button>
      </nav>
    </div>
  </header>
  <main class="mx-auto max-w-xl px-4 py-6">...</main>
</div>
```

### 4.2 Card (Fortune / Diary / Preview 공용)

* **적용 라우트**: `/`, `/calendar`, `/day/:date`
* **규칙**

  * border로 레이어 구분, 배경은 투명도 소량만
  * 헤더(제목) + 바디(내용) + 푸터(행동) 패턴 통일

```html
<!-- Card base -->
<div class="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">
  <div class="flex items-center justify-between">
    <h3 class="text-sm text-neutral-100">카드 타이틀</h3>
    <span class="text-xs text-neutral-400">보조</span>
  </div>
  <div class="mt-4 text-sm text-neutral-200">내용</div>
</div>
```

### 4.3 Bottom Navigation (옵션)

* **적용 라우트**: 전 라우트(모바일 중심)
* **행동**: Today, Calendar, Settings
* **반응형**

  * Mobile: fixed bottom
  * Tablet+: Top header 유틸로 대체 가능(또는 유지하되 높이 축소)

```html
<nav class="fixed bottom-0 left-0 right-0 border-t border-neutral-800 bg-primary-950/95">
  <div class="mx-auto max-w-xl px-4 py-3 flex justify-around text-xs text-neutral-300">
    <a class="text-accent-500">Today</a>
    <a>Calendar</a>
    <a>Settings</a>
  </div>
</nav>
```

---

## 5) Interaction Patterns

### 공통 인터랙션 규칙

* 애니메이션은 **없거나 매우 짧게(150ms 이하)**. (가능하면 제거)
* Desktop hover는 “배경 톤 1단계 상승” 정도만
* **focus-visible** 링은 항상 표시(골드 링)

```css
/* (concept) Prefer focus-visible */
:focus { outline: none; }
:focus-visible { /* tailwind ring로 처리 */ }
```

### 5.1 감정 5택1 (Emotion Picker)

* **동작**

  * 탭/클릭 시 선택 상태 고정
  * 선택 변경 가능(재선택)
* **접근성**

  * `role="radiogroup"` / `role="radio"` 권장
  * 키보드: 좌/우 이동, Space 선택
* **시각 상태**

  * 선택됨: border/accent + 아이콘 골드
  * 미선택: neutral border

**Emotion Button 상태표**

| State          | Border                 | BG                  | Text/Icon          | Note  |
| -------------- | ---------------------- | ------------------- | ------------------ | ----- |
| Default        | `border-neutral-800`   | `bg-neutral-950/40` | `text-neutral-200` | 기본    |
| Hover          | `border-neutral-700`   | `bg-neutral-900/50` | `text-neutral-100` | 데스크탑만 |
| Active/Pressed | `border-neutral-600`   | `bg-neutral-900/70` | `text-neutral-50`  | 짧게    |
| Selected       | `border-accent-700/70` | `bg-neutral-950/60` | `text-accent-500`  | 핵심    |
| Disabled       | `border-neutral-900`   | `bg-neutral-950/20` | `text-neutral-600` | 비활성   |
| Loading        | 동일 + 스피너               | 동일                  | 동일                 | 선택 잠금 |

```tsx
// Emotion picker props example
type Emotion = "happy" | "neutral" | "sad" | "angry" | "sparkle";

function EmotionPicker({
  value,
  onChange,
  disabled,
}: { value: Emotion | null; onChange: (e: Emotion) => void; disabled?: boolean }) {
  const items: { id: Emotion; label: string; icon: string }[] = [
    { id: "happy", label: "기쁨", icon: "😊" },
    { id: "neutral", label: "보통", icon: "😐" },
    { id: "sad", label: "슬픔", icon: "😢" },
    { id: "angry", label: "화남", icon: "😡" },
    { id: "sparkle", label: "설렘", icon: "✨" },
  ];
  return (
    <div role="radiogroup" aria-label="오늘의 감정" className="flex gap-2">
      {items.map((it) => {
        const selected = value === it.id;
        return (
          <button
            key={it.id}
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(it.id)}
            className={[
              "flex-1 rounded-xl border p-3 text-center",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
              disabled ? "border-neutral-900 bg-neutral-950/20 text-neutral-600" :
              selected ? "border-accent-700/70 bg-neutral-950/60 text-accent-500" :
              "border-neutral-800 bg-neutral-950/40 text-neutral-200 hover:bg-neutral-900/50"
            ].join(" ")}
            title={it.label}
          >
            <span aria-hidden>{it.icon}</span>
            <span className="sr-only">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
```

### 5.2 사진 업로드/변경/삭제

* **동작**

  * 업로드: 클릭 → 파일 선택
  * 변경: 기존 이미지 위 “변경” 버튼
  * 삭제: 확인 다이얼로그 후 제거
* **가이드**

  * 크롭/필터 등 편집 기능은 **과감히 생략**
  * 업로드 영역은 카드 안에 크게(실패율 감소)

**Photo Control 상태표**

| State     | UI                   | Note                  |
| --------- | -------------------- | --------------------- |
| Empty     | 업로드 플레이스홀더 + 카메라 아이콘 | 안내 문구는 1줄             |
| Uploaded  | 이미지 프리뷰 + 변경/삭제      | 삭제는 확인 필수             |
| Uploading | 프리뷰 영역에 로딩(스피너/텍스트)  | 버튼 비활성                |
| Error     | 에러 텍스트(뮤트) + 재시도 버튼  | 과한 빨강 금지(필요시 neutral) |

```html
<!-- Photo placeholder example -->
<div class="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4">
  <button class="w-full rounded-lg border border-neutral-800 px-4 py-10 text-neutral-300 hover:bg-neutral-900/50 focus-visible:ring-2 focus-visible:ring-accent-500">
    📷 사진 추가
  </button>
  <p class="mt-2 text-xs text-neutral-400">한 장만 저장됩니다.</p>
</div>
```

### 5.3 캘린더 날짜 이동

* 월 이동은 상단 좌/우 chevron
* 날짜 선택 시:

  * Day Detail로 이동 또는 우측 패널 업데이트
* 선택된 날짜: border + 미세한 배경 변화

```html
<button class="rounded-xl border border-accent-700/60 bg-neutral-950/50 px-3 py-2 text-sm text-accent-500">
  2026.01.29 선택됨
</button>
```

### 5.4 생년월일시 편집 & 저장 확인

* 저장 전/후 상태 명확화

  * 변경사항 있음: Save 활성
  * 저장 완료: “저장됨” 토스트(짧게, 2초 내)
* 입력 컴포넌트는 기본 HTML date/time 사용 권장(단순 유지)

**Primary Button 상태표**

| State    | BG                | Border               | Text               | Note  |
| -------- | ----------------- | -------------------- | ------------------ | ----- |
| Default  | `bg-accent-500`   | `border-accent-600`  | `text-primary-950` | 골드 버튼 |
| Hover    | `bg-accent-400`   | 동일                   | 동일                 | 데스크탑  |
| Active   | `bg-accent-600`   | 동일                   | 동일                 | 눌림    |
| Disabled | `bg-neutral-800`  | `border-neutral-800` | `text-neutral-500` | 비활성   |
| Loading  | Default + spinner | 동일                   | 동일                 | 클릭 잠금 |

```html
<button class="w-full rounded-xl bg-accent-500 px-4 py-3 text-sm font-medium text-primary-950
               hover:bg-accent-400 active:bg-accent-600
               disabled:bg-neutral-800 disabled:text-neutral-500
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500">
  저장
</button>
```

### 5.5 전체 초기화(Reset)

* 반드시 **2단 확인**

  1. 버튼 클릭 → 다이얼로그
  2. “RESET” 입력(옵션) 또는 체크박스 확인
* 다이얼로그도 다크/골드 톤 유지, 경고는 텍스트로 명확히

```html
<!-- Minimal confirm dialog pattern -->
<div role="dialog" aria-modal="true"
     class="fixed inset-0 grid place-items-center bg-black/60 p-4">
  <div class="w-full max-w-sm rounded-2xl border border-neutral-800 bg-primary-950 p-6">
    <h3 class="text-sm text-neutral-100">정말 초기화할까요?</h3>
    <p class="mt-2 text-sm text-neutral-300">되돌릴 수 없습니다.</p>
    <div class="mt-4 flex gap-2">
      <button class="flex-1 rounded-xl border border-neutral-800 px-4 py-3 text-sm">취소</button>
      <button class="flex-1 rounded-xl border border-accent-700/60 px-4 py-3 text-sm text-accent-500">초기화</button>
    </div>
  </div>
</div>
```

---

## 6) Breakpoints

### Breakpoint 정의

```scss
$breakpoints: (
  'mobile': 320px,
  'tablet': 768px,
  'desktop': 1024px,
  'wide': 1440px
);
```

### 반응형 전략

* **mobile (320~767)**

  * 한 손 사용: 주요 액션(사진/감정/저장)은 화면 하단 가까이
  * Bottom nav 사용 권장
* **tablet (768~1023)**

  * 캘린더는 여백 확대, 선택일 요약을 같은 화면에 함께 표시
* **desktop (1024~1439)**

  * Today: 2컬럼(운세/기록), 단 max-w는 과하게 넓히지 않기
  * Calendar: 좌 캘린더 + 우 패널(상세)
* **wide (1440+)**

  * 중앙 정렬 유지, 배경(별/별자리)은 넓은 여백에만 은은히 노출
  * 콘텐츠 폭은 720~860px 선에서 제한(“개인 다이어리” 감 유지)

```html
<!-- Responsive container example -->
<div class="mx-auto max-w-xl md:max-w-2xl lg:max-w-4xl px-4">
  <div class="grid gap-6 lg:grid-cols-2">...</div>
</div>
```

---

## 7) Accessibility & Contrast (WCAG 2.2 체크리스트)

### 대비(Contrast) 체크

* 본문 텍스트(14–16px)는 **최소 4.5:1**
* 큰 텍스트(18px+ 또는 14px Bold)는 **최소 3:1**
* 아이콘/비텍스트 요소(포커스 링, 상태 점)는 **3:1** 권장
* 골드(`accent-500`)를 텍스트로 쓸 때:

  * 배경이 `primary-950`/`neutral-950`처럼 충분히 어두운지 확인
  * 작은 텍스트에는 `accent-400`(더 밝은 골드)로 상향 조정 가능

### 포커스 & 키보드

* 모든 인터랙티브 요소에 `focus-visible:ring-2 ring-accent-500`
* 캘린더/감정 선택은 키보드 이동 가능하도록(라디오/그리드 패턴)

### 폰트/터치 타겟

* 최소 폰트: 12px는 캡션만
* 터치 타겟: **44x44px** 권장(아이콘 버튼 포함)

```html
<!-- Accessible focus example -->
<button class="min-h-11 min-w-11 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500">
  ⚙️
</button>
```

---

## 8) Interaction Patterns (요약 + 구현 힌트)

* 감정: 라디오 그룹(단일 선택)
* 사진: 업로드 → 프리뷰 → 변경/삭제(확인)
* 캘린더: 월 이동 + 날짜 선택(선택 상태 명확)
* 설정 저장: 변경 감지 + 저장/취소 + 저장 완료 피드백(짧은 토스트)
* 리셋: 2단 확인(다이얼로그)

```tsx
// Tiny toast pseudo-implementation idea
type Toast = { message: string };
function showToast(t: Toast) {
  // 2 seconds, no fancy animation
  console.log(t.message);
}
```