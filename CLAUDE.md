# Urbancentro FC — Claude Rules

풋살(동네 축구) 팀 밸런싱 앱. 다른 PC에서 개발해도 동일한 컨벤션을 따르도록 아래 규칙을 지킨다.

## Stack
- antd v6(`^6.5.0`) + React 19 + Vite + TypeScript, 패키지 매니저 **pnpm**.
- 아키텍처: **FSD**(app / pages / widgets / features / entities / shared).
- 상태: **Zustand** + immer. 테마 상태는 `src/entities/theme/model/store.ts`(다크 기본, localStorage 영속).
- 스타일: 컴포넌트 co-located **일반 SCSS**(CSS Modules 아님 — 글로벌 클래스 + `.dark-mode`/`.light-mode` 프리픽스), `import './x.scss'`. CSS-in-JS 미사용.

## Key Files
- 진입점: `src/app/index.tsx`(createRoot, `index.scss` 로드)
- 테마 단일 소스: `src/app/Provider.tsx`(antd 토큰) / 전역 스타일·`#root`·reduced-motion 가드: `src/app/index.scss`
- 스포츠 믹스인·`--fc-*`: `src/shared/assets/_sport.scss` / FOUC 폴백: `src/shared/assets/_variables.scss`
- 다크 상태: `src/entities/theme/model/store.ts` / 매치 포맷 정의: `src/entities/team/lib/constants.ts`(`MATCH_FORMAT_CONFIG`)
- 레이아웃 셸: `src/pages/main/ui/main.tsx` / 전체 플로우: `src/features/team-setup-flow`

## Commands
```bash
pnpm dev      # vite dev 서버
pnpm build    # tsc -b && vite build
pnpm lint     # eslint . --ext ts,tsx --max-warnings 0
pnpm test     # vitest (밸런싱 로직 단위 테스트만 존재)
pnpm pages    # pnpm build && gh-pages -d dist → GitHub Pages 배포(gh-pages 브랜치)
```
> GitHub Pages SPA. Vite `base: '/urbancentro-fc'`(vite.config.ts)라 앱은 `/urbancentro-fc` 경로로 서빙된다 — 헤더 nav의 `window.location.href='/urbancentro-fc'`가 이 때문. 배포처: https://kangqod.github.io/urbancentro-fc

## 완료 전 검증 게이트 (반드시 통과)
1. `pnpm build` (tsc + vite build) — 타입/컴파일
2. `pnpm test` — 42개 밸런싱 테스트
3. `pnpm lint` — `--max-warnings 0`
4. 하드코딩 hex 게이트(아래) — bare 브랜드 hex 0건
> 참고: 컴포넌트/RTL 테스트가 없어 **렌더링·모션·반응형은 육안 QA가 유일한 게이트**다.

## 테마·디자인 토큰 (단일 소스)
- 색/radius/elevation/모션 타이밍의 단일 소스는 `src/app/Provider.tsx`의 antd `ConfigProvider` 토큰. SCSS는 antd가 주입하는 `var(--ant-color-*)`를 **소비만** 하고 브랜드 값을 포크하지 않는다.
- primary = `#ff681f`(고정), fontFamily = Pretendard(고정). `colorInfo` 설정 금지, `colorSuccess/Warning/Error`는 antd v6 기본값 유지.
- antd 토큰명은 반드시 `node_modules/antd` 타입(`GlobalToken`/`AliasToken`)에 존재하는지 확인 후 사용. 없는 이름은 지어내지 말 것.

### 브랜드 커스텀 프로퍼티 `--fc-*` (`src/shared/assets/_sport.scss`)
- antd 토큰으로 표현 못 하는 그라디언트·팀색·글로우·모션은 `--fc-*`로 정의.
- **반드시 `body.dark-mode`와 `body.light-mode` 양쪽에 정의**하고, **소비 시 항상 인라인 다크 폴백**을 쓴다: `var(--fc-x, <다크값>)`. (body 클래스는 post-mount `useEffect`로 붙어서 FOUC 구간엔 없음.)
- 팀 색: `--fc-team-a`(주황) / `-b`(파랑) / `-c`(그린) / `-d`(마젠타). 팀 구분은 `.team-row .ant-col:nth-child(n)`로 CSS-only.
- 기타: `--fc-gradient-cta`, `--fc-glow`, `--fc-accent-advanced`, `--fc-motion-fast/-mid/-ease`.

### 스포츠 타이포 (`_sport.scss` 믹스인)
- `@use '@/shared/assets/sport' as sport;` 후 헤드라인/CTA 라벨에만 `@include sport.sport-headline;`, CTA 버튼에 `@include sport.sport-cta;`.
- 본문/인풋/선수 이름 등엔 적용하지 않는다(한글 가독성). Pretendard 유지.
- 개별 셀렉터에서 믹스인 값을 덮어쓸 땐 그냥 해당 속성만 재선언(예: 헤더 타이틀 `text-transform: none; font-weight: 800;`).

## SCSS 규칙
- **`!important` 최대한 덜 쓴다.** 앱/antd 스타일 오버라이드는 부모 클래스로 감싸 **명시도**로 해결한다(예: `.team-option-content .option-title` = 0,2,0 이 `h5.ant-typography` 0,1,1 을 이김). `!important` 지양.
  - **정당한 예외(그냥 써도 됨)** = CSS 명시도로 못 이기는 브라우저 UA·전역 오버라이드: (1) `src/app/index.scss`의 `@media (prefers-reduced-motion)` a11y 가드, (2) `guest-modal.scss`의 `input:-webkit-autofill`.
- 브랜드 hex 하드코딩 금지. 색은 `var(--ant-color-*)` 또는 `--fc-*`로. hex는 **`var(…, #hex)` 폴백 위치**나 **`--fc-*:` 정의부**에서만 허용.
  - 게이트 대상 set: `#ff681f #1890ff #00ff00 #52c41a #faad14 #ff4d4f #fa8c16 #13c2c2`. Kakao `#fee500`·일반 `#fff`/그레이는 허용.
  - 검사: `grep -rInE '#(ff681f|1890ff|00ff00|52c41a|faad14|ff4d4f|fa8c16|13c2c2)' src/ | grep -vE 'var\(|--fc-|_variables\.scss|constants\.ts|fee500'` → 결과 없어야 함.
- 모션: transform/opacity만 애니메이트(box-shadow/filter/hue-rotate 루프 금지). reduced-motion 전역 가드가 `src/app/index.scss`에 있으니 개별 파일에 `animation:none` 추가로 싸우지 말 것.
- 반응형: `≤576px`(및 필요 시 `≤767px`) 미디어쿼리 유지. `#root` 최대폭 1120px(`src/app/index.scss`).

## 동작 동결 (리스타일 시)
- 스타일/마크업/className 재구성은 자유. 단 **이벤트 핸들러·훅·상태 read/write·라우팅·데이터 파생·밸런싱 로직·OCR·Kakao 연동은 변경 금지.**
- 렌더 구조를 바꿔야 하면 동작 보존 리팩터만(예: shuffle 스피너를 언마운트 대신 `<Spin spinning={isShuffle}>` 오버레이로 — 스크롤 위치 보존).

## 커뮤니케이션·주석
- 모든 응답은 **한국어**.
- 장식성/섹션 구분 주석 금지. 비자명한 제약·불변식·우회책만 한 줄 주석.
