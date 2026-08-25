<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# app

## Purpose

React 진입점과 앱 전역 설정. antd 디자인 토큰(색·radius·모션)의 **단일 소스**이자 `body.dark-mode/.light-mode` 클래스를 붙이는 주체.

## Key Files

| File           | Description                                                                                                                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.tsx`    | `createRoot` → `<StrictMode><Provider/></StrictMode>`, `index.scss` 로드                                                                                                                             |
| `Provider.tsx` | antd `ConfigProvider`(`colorPrimary: PRIMARY_COLOR`, Pretendard, radius 10/16, controlHeight 40/48, 모션 0.25s, 라이트/다크 surface 토큰) + `App` → `<Main/>`. `useEffect`로 `body` 테마 클래스 토글 |
| `index.scss`   | html/body 리셋, `#root` max-width 1120px, `prefers-reduced-motion` 가드(`animation: none` 아님 — 0.01ms로 이벤트 유지), autofill 배경 우회                                                           |

## Subdirectories

| Directory | Purpose                  |
| --------- | ------------------------ |
| `lib/`    | `useThemeValue()` 셀렉터 |

## For AI Agents

### Working In This Directory

- 토큰명은 antd `AliasToken`에 존재하는 것만. `colorInfo` 설정 금지, `colorSuccess/Warning/Error`는 기본값 유지. primary `#ff681f` 고정.
- 다크 surface 토큰은 레거시 `.dark-mode` SCSS 값(`#141414/#2a2a2a/#444`)과 동일하게 유지해 시각 회귀 없이 `--ant-color-*`를 단일 소스로 쓴다.
- reduced-motion 가드는 여기 한 곳. 개별 SCSS에서 `animation: none`으로 싸우지 말 것(antd `@rc-component/motion` enter/leave 이벤트가 멈춤).

## Dependencies

### Internal

- `@/pages`(`Main`), `@/entities`(`useThemeStore`), `@/shared`(`PRIMARY_COLOR`, `assets/sport`)

<!-- MANUAL: -->
