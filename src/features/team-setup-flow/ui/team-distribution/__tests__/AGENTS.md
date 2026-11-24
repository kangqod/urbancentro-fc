# `team-distribution/__tests__`

**Parent context:** `../AGENTS.md`
**Generated:** 2026-08-25 · **Updated:** 2026-11-24

## Key Files

| File                              | Description                                                                                                                                                                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `container.test.tsx`              | `useTeamStore.setState({ teams })` 시드 후 카드 Row·선수 이름·`.team-card-title`(1팀/2팀) 렌더, 선수 클릭 → `selectedPlayer` 설정, 스왑 모드 탭 → `onSwapTap(id)`·`selectedPlayer` 불변, `is-swap-mode`/`is-swap-selected` 클래스 |
| `team-balance-log.test.tsx`       | 팀 있으면 버튼 렌더, `teams: []`면 미렌더, 클릭 시 모달에 팀 밸런스 정보·1팀/2팀 표시                                                                                                                                             |
| `team-distribution.hooks.test.ts` | `renderHook`으로 스왑 상태 전이(선택→재탭 해제→같은 팀 선택 이동→다른 팀 교환·해제), OFF 토글 시 선택 해제, `handleDistributePlayers` 시 리셋                                                                                     |

## Manual Notes

이 제목 아래는 사람이 작성한 메모이며 재생성 시 보존된다.
