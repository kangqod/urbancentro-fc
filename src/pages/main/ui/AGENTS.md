<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# main/ui

## Purpose

페이지 셸과 로스터 게이트 컴포넌트.

## Key Files

| File            | Description                                                                                                                                                                                                                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main.tsx`      | antd `Layout`: `.app-header`(`Header` + `Theme` 토글) / `Content` > `Container` / 형제로 `PlayerDetailModal`, `KakaoLoader`                                                                                                                                                                     |
| `container.tsx` | `Container`: `useRosterLoader()`가 `loading`이면 `LoadingOverlay`(⚽, `@/shared`), `error`면 `Result status="error"` + 다시 시도 버튼, 아니면 `ReadyContainer`(URL 복원 훅 호출 후 `TeamSetupFlow`). `useBuildVersionCheck()`는 게이트 바깥 `Container`에서 호출 — 에러 화면에서도 새 배포 안내 |
| `main.scss`     | `html, body` 리셋, `.app-layout`(`--ant-color-bg-layout`), `.app-header`(`::after` 3px 그라디언트 스트라이프 `--fc-gradient-cta` 폴백 포함, ≤576px space-between), `.app-content`                                                                                                               |

## For AI Agents

### Working In This Directory

- `ReadyContainer`를 `Container`에 합치지 말 것 — URL 복원 훅은 게이트 안쪽에서 호출돼야 한다.
- 스타일 변경 시 `--fc-*` 소비에는 항상 인라인 다크 폴백을 둔다(body 클래스는 post-mount에 붙음).

## Dependencies

### Internal

- `../lib`, `@/features`, `@/widgets`

<!-- MANUAL: -->
