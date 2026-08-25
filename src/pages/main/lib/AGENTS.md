<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# main/lib

## Purpose

메인 페이지의 비-UI 로직: 공유링크 파싱, 앱 시작 시 초기화 훅, 스토어 셀렉터.

## Key Files

| File                                  | Description                                                                                                                                                                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`                            | 배럴                                                                                                                                                                                                                                        |
| `initialize.ts`                       | `parseTeamsParam`(decodeURIComponent+JSON.parse, 실패 시 `[]`), `calculateTotalPlayers`, `createPlayersFromTeams`(id `shared-<team>-<idx>`, `buildSharedPlayer` 사용)                                                                       |
| `use-team-initialization-from-url.ts` | mount 시 `?teams` 읽어 팀 옵션·선수·`isSharedView`·탭(팀 분배) 설정                                                                                                                                                                         |
| `use-roster-loader.ts`                | status가 `loading`일 때마다 `loadRoster()` → `setRoster`(Container는 언마운트되지 않으므로 mount 1회 effect로는 retry 불가). `cached`면 저장 날짜 포함 `message.warning`. `{ status, retry }` 반환 — `retry` = 로더 리셋 + status `loading` |
| `use-build-version-check.tsx`         | PROD에서 `build.json` 폴링(30s 스로틀, visibilitychange/pageshow 재검사) → 새 배포면 닫을 수 없는 `modal.confirm`(새로고침만 허용)                                                                                                          |
| `use-store.ts`                        | `useShallow` 셀렉터: `useSetTeamSetupFlowState`, `useSetTeamOptionState`, `useSetPlayersState`, `useSelectedPlayerValue`, `useSetSelectedPlayerState`                                                                                       |

## For AI Agents

### Working In This Directory

- `SharedTeam`은 튜플 `[팀명 마지막 글자, SharedPlayer[]]`. 포맷 변경은 `src/features/team-setup-flow/lib/utils.ts`(디코더)·`ui/team-distribution/footer.hooks.ts`(인코더)와 함께 해야 한다.
- 버전 모달의 `onOk`는 미해결 Promise를 반환해 reload 전까지 닫히지 않는다 — 의도된 동작.

### Testing Requirements

- 순수 함수(`initialize.ts`)는 vitest 단위 테스트 추가 가능. 훅은 현재 테스트 없음.

## Dependencies

### Internal

- `@/entities`, `@/features`, `@/shared`

<!-- MANUAL: -->
