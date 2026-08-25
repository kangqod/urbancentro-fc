<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# shared/test

## Purpose

vitest 전역 셋업과 RTL 렌더 헬퍼.

## Key Files

| File         | Description                                                                                                                                                                                                                                                       |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setup.ts`   | `jest-dom/vitest`, `window.matchMedia`·`ResizeObserver` 스텁(antd 필수), `getComputedStyle` 의사요소 인자 제거(jsdom 노이즈 회피), **전역 `fetch`를 reject로 스텁**(테스트는 네트워크 금지), `afterEach(cleanup)`                                                 |
| `render.tsx` | `renderWithProviders(ui)` — antd `ConfigProvider`(darkAlgorithm + `PRIMARY_COLOR`) + `App`. team/player/roster 스토어 초기 상태를 스냅샷해 `afterEach`에서 `act`로 리셋 + `resetRosterLoader()` + `clearRosterCache()`. `useTeamStore`, `usePlayerStore` 재export |

## For AI Agents

### Working In This Directory

- SCSS는 jsdom에서 무시된다 — 스타일 단언 금지.
- 스토어 리셋 `afterEach`는 RTL cleanup보다 먼저 돌아(마운트 상태) `act`로 감싸야 act 경고가 없다. 경고 재현은 `vitest run --disableConsoleIntercept`.
- 새 zustand 스토어를 추가하면 여기 리셋 목록에도 추가.

<!-- MANUAL: -->
