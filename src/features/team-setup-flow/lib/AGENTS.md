<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# team-setup-flow/lib

## Key Files

| File           | Description                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `constants.ts` | `TAB_GAP=32`, `TAB_ICON_SIZE=20`, `TEAMS_PARAMS='teams'`(공유 URL 쿼리 키)                                                                                                                                                                                                                                                                                                                    |
| `utils.ts`     | `getSelectionStatus(count, required)`, `getTeamsText(teams)`(공유 본문 텍스트), `SharedPlayer=[YY, name, condition, tier, isGuest]`, `SharedTeam=[팀글자, SharedPlayer[]]`, `normalizeSharedPlayer`(레거시 `'year-name-condition-tier'` 문자열도 처리, `hasExplicitGuest`), `buildSharedPlayer(raw, id)`(로스터 `name+year2` 매칭), `parseSharedTeams(param)`                                 |
| `use-store.ts` | `useShallow` 셀렉터: flow(`useActiveTabValue`, `useSetActiveTabState`, `useIsSharedView*`, `useTeamDistributionValue`), team(`useSetTeamOptionState`, `useRequiredPlayersValue`, `useTeamsValue`, `useTeamsState`), player(`useGetAvailablePlayersState`, `useSetPlayersState`, `usePlayersValue`, `useSetPlayerSelectionState`, `useAvailablePlayerCountValue`, `useSetSelectedPlayerState`) |
| `index.ts`     | 배럴                                                                                                                                                                                                                                                                                                                                                                                          |

## Subdirectories

| Directory    | Purpose                                               |
| ------------ | ----------------------------------------------------- |
| `__tests__/` | `shared-player.test.ts` — 직렬화/복원 라운드트립 회귀 |

## For AI Agents

### Working In This Directory

- 복원 규칙: 신규 포맷(5튜플)은 `isGuest` 플래그를 신뢰(로스터 미스여도 정규 멤버 유지), 레거시 포맷은 미스 → 게스트. 게스트는 `year=DEFAULT_YEAR`로 복원해 모달에서 연도를 숨긴다.
- 영문 티어 별칭(`ace/advanced/...`)은 `LEGACY_TIER_ALIASES`로 이 경로에서만 매핑. `toTierType` 자체는 순수하게 둔다.
- 로스터 조회는 `getRosterRows()`(런타임 스토어) — 정적 명단 파일을 두거나 import 하지 않는다.

<!-- MANUAL: -->
