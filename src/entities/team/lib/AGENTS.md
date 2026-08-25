<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# team/lib

## Purpose

팀 밸런싱 핵심. 랜덤 후보 400개를 생성해 사전식 점수(`band → topImbalance → gap → imbalance`)로 최적 배치를 뽑는다.

## Key Files

| File               | Description                                                                                                                                                                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`         | 선택적 배럴: `./constants`, `{ balanceTeams, calculateTeamStrength }`, `./team-rank`, `./share-kakao` (`balance-score` 내부는 비공개)                                                                                                                                            |
| `constants.ts`     | `MATCH_FORMAT_CONFIG`(5:5~5:5:5:5 9종, ID/TITLE/TEAM_COUNT/PLAYERS_PER_TEAM), `EXCLUDED_PAIRS=[['지원 1','지원 2']]`, `CONDITION_EXEMPT_NAMES`, `TIER_WEIGHTS`(에이스4/상급3/중급2/초급1)                                                                                        |
| `balance-score.ts` | `getTierWeight`, `calculateTeamStrength`, `strengthGap`, `tierCountSpread`, `compositionImbalance`, `topTierImbalance`, `scoreArrangement`(band: gap≤2→0, 3→1, ≥4→∞), `compareScore`                                                                                             |
| `balance-teams.ts` | `balanceTeams(players, mode)`; `@internal` 테스트용 `shuffleArray`(Fisher–Yates 고정), `getMovablePlayers`, `getTeamTierCounts`, `setPlayerCondition`, `distributeGuests`, `enforceExcludedPairs`. `CANDIDATE_COUNT=400`. 무결성 assert(중복 id·인원 불일치·팀 크기 차 >1) throw |
| `team-rank.ts`     | `getTopDogTeamNames(teams)` — 표시 전용 `powerScore = strength + high*2 + isPremium*3`, 밸런싱과 무관                                                                                                                                                                            |
| `share-kakao.ts`   | `shareKakao({teams, description})` → `window.Kakao.Share.sendCustom({ templateId: 119479, templateArgs: { description, link: 'teams=<JSON>' } })`                                                                                                                                |

## Subdirectories

| Directory    | Purpose                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------- |
| `__tests__/` | 점수 함수 단위·우선순위 테스트, 밸런서 헬퍼·통합·통계 불변식 (see `__tests__/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- 점수 순서에서 `topImbalance`가 `gap`보다 앞인 것은 의도(아니면 상급 몰림으로 gap만 줄이는 배치가 ~30% 발생). 표준편차 지표는 몰림을 보상해 폐기됨.
- `setPlayerCondition`은 연도 정렬 **전에** 실행해야 한다(HIGH 확률이 인덱스 기반). HIGH는 `CONDITION_EXEMPT_NAMES`·`isPremium`(시트 '프리미엄' 열) 선수에게 부여하지 않는다.
- `enforceExcludedPairs`는 용량 검사 없이 이동시킬 수 있어 결과가 `isValidCandidate`를 통과할 때만 채택한다.
- `sort(() => Math.random() - 0.5)` 셔플 금지 — 분포 테스트가 막는다.

### Testing Requirements

- 알고리즘 변경 시 `pnpm vitest run src/entities/team`으로 통계 하네스(80회×5 로스터)가 통과하는지 확인.

## Dependencies

### Internal

- `@/entities/player/model`(타입·상수), `@/entities/team/model/types`

### External

- 전역 `window.Kakao`(any)

<!-- MANUAL: -->
