<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# team/model

## Key Files

| File       | Description                                                                                                                                                      |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts` | `./store` + `export type * from './types'`                                                                                                                       |
| `store.ts` | `useTeamStore`: `teams/teamCount/playersPerTeam/requiredPlayers`; `setTeamOption(teamCount, playersPerTeam)`(requiredPlayers 파생), `setTeams`, `resetTeamState` |
| `types.ts` | `Team`, `TeamState`, `MatchFormatConfigKey`, `MatchFormatConfig`, `MatchFormatType`(`MATCH_FORMAT_CONFIG[*].ID` 유니온, 예 `'6:6:6'`), `ShareKakaoContent`       |

## For AI Agents

### Working In This Directory

- `ShareKakaoContent.teams`는 `Team[]`으로 타입돼 있지만 실제 링크에는 직렬화 튜플이 들어간다(`footer.hooks.ts`에서 캐스팅). FSD 레이어 위반을 피하기 위한 의도적 경계.

<!-- MANUAL: -->
