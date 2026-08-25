<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# team-size-selector

## Purpose

1탭 "팀 구성 선택". `MATCH_FORMAT_CONFIG`를 팀 수별 그룹(2팀/3팀/4팀 대결)으로 렌더.

## Key Files

| File                          | Description                                                                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `team-size-selector.tsx`      | 모듈 레벨 `TEAM_OPTION_GROUPS`(TEAM_COUNT로 reduce·정렬). 카드 = `<button aria-pressed aria-label="N팀, 팀당 M명, 총 T명">` + `Shirt` 아이콘·인원. 푸터 다음 버튼은 선택 전 disabled |
| `team-size-selector.hooks.ts` | `selectedOption` 로컬 상태, `handleOptionClick(id)()` → `setTeamOption(TEAM_COUNT, PLAYERS_PER_TEAM)`, `handleNextClick` → blur 후 `TabMenu.PlayerSelection`                         |
| `team-size-selector.scss`     | `.team-option-card.selected`(primary 보더 + `--fc-glow`), 저지 아이콘 색 전환, 그룹/행 레이아웃                                                                                      |
| `index.ts`                    | 배럴                                                                                                                                                                                 |

## For AI Agents

### Working In This Directory

- 포맷 추가/삭제는 `src/entities/team/lib/constants.ts`의 `MATCH_FORMAT_CONFIG`에서만. 여기는 파생 렌더.

<!-- MANUAL: -->
