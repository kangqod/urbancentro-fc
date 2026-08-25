<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# main

## Purpose

메인 페이지 슬라이스. `ui/main.tsx`가 antd Layout 셸을, `ui/container.tsx`가 로스터 로딩 게이트를, `lib/`가 URL 공유링크 복원·빌드 버전 체크·로스터 로더 훅을 제공한다.

## Key Files

| File       | Description                   |
| ---------- | ----------------------------- |
| `index.ts` | `./lib`, `./ui/main` 재export |

## Subdirectories

| Directory | Purpose                                                           |
| --------- | ----------------------------------------------------------------- |
| `lib/`    | 초기화 훅·파서·스토어 셀렉터 (see `lib/AGENTS.md`)                |
| `ui/`     | `Main`(셸), `Container`(게이트), `main.scss` (see `ui/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- 로스터 확정(`RosterStatus` ≠ `loading`) 전에는 `TeamSetupFlow`·URL 복원 effect가 마운트되지 않는다. 이 순서를 깨면 공유링크의 정규 멤버가 게스트로 오분류된다. `error`면 antd `Result` 에러 화면 + 다시 시도 버튼으로 서비스를 차단한다.
- `?teams=` 진입 시 빌드 버전 체크는 스킵된다(`use-build-version-check.tsx`).

### Testing Requirements

- 이 슬라이스는 RTL 테스트가 없다. 변경 시 `pnpm dev`로 (a) 일반 진입 (b) `?teams=` 진입 (c) 로스터 fetch 실패(`ROSTER_CSV_URL`을 임시로 잘못된 값으로) — 캐시 있으면 경고 토스트 진입, 없으면 에러 화면 — 세 경로를 육안 확인.

## Dependencies

### Internal

- `@/features`(`TeamSetupFlow`, `KakaoLoader`, `Theme`, `TabMenu`, `TEAMS_PARAMS`, `buildSharedPlayer`), `@/widgets`(`Header`, `PlayerDetailModal`), `@/entities`(스토어·로스터 로더), `@/shared`(`runBuildVersionCheck`)

### External

- antd(`Layout`, `Spin`, `App.useApp`), zustand `useShallow`

<!-- MANUAL: -->
