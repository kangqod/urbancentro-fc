<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# player/model

## Key Files

| File               | Description                                                                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`         | `./store`, `./player`, `./roster-store`, `./support-slots` + `export type * from './types'`                                                                                                                                                 |
| `types.ts`         | `Player`, `TierType`, `ConditionType`, `PlayerState`, `RosterRow`(시트 행 형태, `tier: TierType`, `isPremium` 포함), `RosterStatus`(`loading\|remote\|cached\|error`)                                                                       |
| `player.ts`        | `PLAYER_TIERS`(에이스/상급/중급/초급), `PLAYER_CONDITIONS`, `DEFAULT_YEAR='3000'`, `DEFAULT_NUMBER=99`, `DEFAULT_TIER`, `TIER_LABELS`, `toTierType`(검증 실패 → 중급), `PlayerClass`                                                        |
| `store.ts`         | `usePlayerStore`: `players/availablePlayerCount/selectedPlayer/isOCR`, `setPlayers`(updater 허용, count 재계산), `togglePlayerAvailability`, `setSelectedPlayer`, `checkTesseractPlayers`(첫 OCR은 교체, 이후는 합집합), `resetPlayerState` |
| `roster-store.ts`  | `composeRoster(rows)=[...SUPPORT_SLOTS, ...rows(지원 1/2 이름 행 제외)]`, `useRosterStore`(`rows/status/setRoster`, 초기 rows = 지원 슬롯만, status `loading`), `getRosterRows()` 비리액트 접근자                                           |
| `support-slots.ts` | `SUPPORT_SLOTS` — `지원 1`/`지원 2`(중급, number 0, year `DEFAULT_YEAR`)                                                                                                                                                                    |

## For AI Agents

### Working In This Directory

- `PlayerClass` 생성자 기본값(`||` 사용)에 주의: `number: 0`은 `DEFAULT_NUMBER(99)`로 바뀐다. 시트 등번호 0 = "없음" 표시와 맞물린다.
- 스토어는 플레인 `create`(immer/persist 없음). 컴포넌트에서는 직접 쓰지 말고 각 슬라이스 `lib/use-store.ts` 셀렉터를 통해 읽는다.

## Dependencies

### External

- zustand

<!-- MANUAL: -->
